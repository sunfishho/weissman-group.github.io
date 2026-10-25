// Public access is independent of indexing. Keep this link-shareable release
// out of search results without imposing a password or authentication step.
export const publicCKPageNames = ['index.html', 'blog.html', 'home.html', 'lean-writeup.html', 'prompting.html', 'ai-disclosure.html'];

export function preparePublicCKPages(input) {
  const pages = {};
  for (const name of publicCKPageNames) {
    let page = input[name];
    if (typeof page !== 'string' || !/<head[\s>]/i.test(page)) throw new Error('Missing CK reader page: ' + name);
    if (/id=["']unlock-form["']|ck-reader-key-v2|fetch\(["']article\.enc/.test(page)) throw new Error('Password loader is not a public reader: ' + name);
    const head = page.slice(0, page.indexOf('</head>'));
    if (!/<meta\s+name=["']robots["']/i.test(head)) {
      page = page.replace(/<head(?:\s[^>]*)?>/i, '$&<meta name="robots" content="noindex">');
    }
    pages[name] = page;
  }
  return pages;
}

if (process.argv.includes('--json')) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(JSON.stringify(preparePublicCKPages(JSON.parse(input))));
}
