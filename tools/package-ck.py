"""Package a local CK reader snapshot without publishing drafts or server data.
Requires: pip install cryptography
Usage: python tools/package-ck.py /path/to/ck-visual-paper-pilot
The password is requested interactively (or read from CK_PUBLICATION_PASSWORD).
"""
import argparse,base64,getpass,html,json,os,re,shutil,subprocess,urllib.request
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import hashlib

args=argparse.ArgumentParser(description=__doc__)
args.add_argument('source',type=Path)
args.add_argument('--origin',default='http://localhost:8768')
a=args.parse_args();src=a.source/'dist';out=Path(__file__).resolve().parents[1]/'public/ck'
password=os.environ.get('CK_PUBLICATION_PASSWORD') or getpass.getpass('Existing CK publication password: ')
def api(path):return json.load(urllib.request.urlopen(a.origin+'/api/'+path))
snapshots={name:api(name) for name in ['edits','writeup','prompting','disclosure']}
def js(value):return json.dumps(value,ensure_ascii=False).replace('<',r'\u003c')
def script(text):return '<script>'+text.replace('</script','<\\/script')+'</script>'
def prose(text):
 return ''.join('<p>'+re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)',r'<a href="\2">\1</a>',html.escape(t))+'</p>' for t in text.split('\n\n'))
# Include only public prose overrides. Never export personal notes or histories.
edits={'nodes':{}}
for key,record in snapshots['edits']['nodes'].items():
 fields={k:v for k,v in record['fields'].items() if k!='notes'}
 if fields:edits['nodes'][key]={'fields':fields,'revision':0}
readonly='''#editor-open,#comment-open,#comments-toggle,#export-edits,#source-button,[data-edit-fact],[data-edit-context],.sidebar-tabs,.personal-notes,.edit-badge,#save-status,#editor-panel,#edit-toggle,#continue-writing,#editor{display:none!important}'''
pages={}
for name in ['home.html','blog.html','lean-writeup.html','prompting.html','ai-disclosure.html','index.html']:
 page=(src/name).read_text()
 if name in ['prompting.html','ai-disclosure.html']:
  record=snapshots['prompting' if name=='prompting.html' else 'disclosure']
  page=re.sub(r'<div class="prompting-tools"><button id="edit-intro".*?</textarea>','',page,flags=re.S)
  page=re.sub(r'(<div class="prompting-intro" id="intro-preview">).*?(</div>)',lambda m:m[1]+prose(record['text'])+m[2],page,flags=re.S)
  page=re.sub(r'<script src="(?:prompting|disclosure)-editor.js[^\"]*"></script>','',page)
  if name=='prompting.html':
   download='data:text/plain;base64,'+base64.b64encode((src/'prompting.txt').read_bytes()).decode()
   page=page.replace('href="prompting.txt" download','href="'+download+'" download="prompting.txt"')
 if name=='lean-writeup.html':page=page.replace('</head>',script('window.CK_PUBLISHED_WRITEUP='+js({'text':snapshots['writeup']['text'],'revision':0})+';')+'</head>')
 if name=='index.html':page=page.replace('</head>',script('window.CK_AUXILIARY_PAGES='+js({'lean-writeup.html':pages['lean-writeup.html']})+';')+'</head>')
 scripts=[]
 def embed(m):
  filename=m[1].split('?')[0]
  if filename in ['comments.js','sidebar-tabs.js']:return ''
  text=(src/filename).read_text()
  if filename=='data.js':
   data=json.loads(text.split('=',1)[1].strip().removesuffix(';'))
   for node in data['nodes']:node['sources']=[];node['note']=''
   text='const PAPER='+js(data)+';'
  if filename=='study.js':
   start=text.index('async function bootStudy()');end=text.index("document.addEventListener('paper:select'",start)
   text=text[:start]+'async function bootStudy(){studyState.edits='+js(edits)+';studyState.loaded=false;applyEdits();select(current,false);}\n'+text[end:]
   # No API requests can be made by editing code in a read-only publication.
   start=text.index('async function api(');end=text.index('async function bootStudy()',start)
   text=text[:start]+"async function api(){throw new Error('This publication is read-only.')}\n"+text[end:]
  scripts.append(script(text));return ''
 page=re.sub(r'<script(?: defer)? src="([^\"]+)"[^>]*></script>',embed,page)
 page=page.replace('Explanations and notes are editable.','')
 page=page.replace('</head>','<style>'+readonly+'</style></head>')
 page=page.replace('</body>',''.join(scripts)+'</body>')
 pages[name]=page
# Fonts, licenses and styles are the only unencrypted imported assets.
for path in src.rglob('*'):
 if path.is_file() and (path.suffix in ['.css','.woff','.woff2','.ttf'] or ('vendor' in path.parts or 'blog-assets' in path.parts) and ('LICENSE' in path.name.upper() or 'OFL' in path.name.upper())):
  rel=path.relative_to(src);target=out/rel;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,target)
# Keep the blog as the ordinary entry point, without breaking explicit proof
# links, and apply the reader-only publication refinements on every repack.
refiner=Path(__file__).with_name('ck-reader-refinements.mjs')
pages=json.loads(subprocess.run(['node',str(refiner),'--json'],input=json.dumps(pages),text=True,capture_output=True,check=True).stdout)
edition=out/'edition.css'
mobile_rule='@media(max-width:380px){.ck-primary{flex-wrap:wrap;gap:0 12px;font-size:12px;max-width:100%;min-width:0;flex-shrink:1}}'
if mobile_rule not in edition.read_text():edition.write_text(edition.read_text()+'\n'+mobile_rule+'\n')
plain=js(pages).encode();salt=os.urandom(32);iv=os.urandom(12);iterations=310000
key=hashlib.pbkdf2_hmac('sha256',password.encode(),salt,iterations,32)
data=AESGCM(key).encrypt(iv,plain,None)
b64=lambda x:base64.b64encode(x).decode()
payload={'version':2,'algorithm':'AES-GCM','kdf':'PBKDF2','hash':'SHA-256','iterations':iterations,'salt':b64(salt),'iv':b64(iv),'data':b64(data)}
(out/'article.enc').write_text(json.dumps(payload))
assert AESGCM(key).decrypt(iv,data,None)==plain
# Recheck snapshots so a concurrent author edit never silently misses publication.
for name,value in snapshots.items():
 assert api(name)==value, 'Text changed while packaging. Run the packager again.'
# Private staging permits local browser checks without committing decrypted content.
stage=a.source/'local-backups/publication-preview';stage.mkdir(parents=True,exist_ok=True)
for name,page in pages.items():(stage/name).write_text(page)
print(f'Packaged {len(pages)} read-only pages into {len(data):,} encrypted bytes.')
