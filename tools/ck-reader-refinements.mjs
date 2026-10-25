// Shared by the encrypted publisher and its regression tests. No complete page
// or password is stored here. Explicit proof-node and guide links remain available.
export function ckReaderDestination(search, hash) {
  const query = new URLSearchParams(search);
  const view = query.get('view');
  if (query.has('guide')) return null;
  if (view === 'map') return hash ? null : './#ck';
  const articleFragment = /^#(?:section-\d+(?:-[^#]*)?|fig-\d+(?:-caption)?|references(?:-heading)?|ref-\d+|contents(?:-heading)?|authors-heading|main-content|development-note(?:-reference)?)$/.test(hash);
  if (hash && !articleFragment && view !== 'article' && view !== 'home') return null;
  query.delete('view');
  const suffix = query.toString();
  return 'blog.html' + (suffix ? '?' + suffix : '') + hash;
}

export const entryRouter = '<script data-ck-entry-router>const ckDestination=('
  + ckReaderDestination.toString()
  + ')(location.search,location.hash);if(ckDestination)location.replace(ckDestination);</script>';

const oldRouter = '<script>if(!location.hash&&!new URLSearchParams(location.search).has("guide"))location.replace("home.html");</script>';
const staleEndnote = '<p>This is a working draft. The section on Lean formalization and the closing discussion are still to come.</p>';
const writeupPrefix = 'window.CK_PUBLISHED_WRITEUP=';
const auxiliaryPrefix = 'window.CK_AUXILIARY_PAGES=';

function replacePublishedValue(page, prefix, transform) {
  const start = page.indexOf(prefix);
  if (start < 0) throw new Error('Missing published reader data: ' + prefix);
  const end = page.indexOf(';</script>', start);
  if (end < 0) throw new Error('Unterminated published reader data');
  const value = JSON.parse(page.slice(start + prefix.length, end));
  const encoded = JSON.stringify(transform(value)).replaceAll('<', '\\u003c');
  return page.slice(0, start + prefix.length) + encoded + page.slice(end);
}

export function refineCKPages(input) {
  const pages = { ...input };
  for (const name of ['index.html', 'home.html', 'blog.html', 'lean-writeup.html', 'prompting.html', 'ai-disclosure.html']) {
    if (typeof pages[name] !== 'string') throw new Error('Missing CK reader page: ' + name);
    pages[name] = pages[name]
      .replaceAll('href="home.html"', 'href="blog.html"')
      .replaceAll('aria-label="Courtade–Kumar research notes home"', 'aria-label="Return to the Courtade–Kumar blog"')
      .replaceAll('[data-edit-fact],[data-edit-context],.sidebar-tabs', '[data-edit-fact],[data-edit-context],[data-edit-notation],.sidebar-tabs');
  }
  if (pages['index.html'].includes(oldRouter)) {
    pages['index.html'] = pages['index.html'].replace(oldRouter, entryRouter);
  } else if (pages['index.html'].includes('<script data-ck-entry-router>')) {
    pages['index.html'] = pages['index.html'].replace(/<script data-ck-entry-router>[\s\S]*?<\/script>/, entryRouter);
  } else {
    throw new Error('Unknown CK entry router. Review it before publishing.');
  }
  pages['index.html'] = pages['index.html'].replaceAll('satisfies Here', 'satisfies the derivative identity below. Here');
  pages['blog.html'] = pages['blog.html'].replace(staleEndnote, '');
  pages['prompting.html'] = pages['prompting.html'].replace(
    'a prompt used for the proof of Crouzeix&#x27;s conjecture',
    'a prompt from a Crouzeix-conjecture proof project',
  ).replace(
    "a prompt used for the proof of Crouzeix's conjecture",
    'a prompt from a Crouzeix-conjecture proof project',
  );
  if (pages['lean-writeup.html'].includes(writeupPrefix)) {
    pages['lean-writeup.html'] = replacePublishedValue(pages['lean-writeup.html'], writeupPrefix, record => {
      let text = record.text.replace(
        'when $s<k$.</span>', 'when $s<k$.',
      ).replace(
        'Checking all leaves and their coverage proves $F\\ge0$ throughout the required region.',
        'The verified boxes cover every admissible point in the decreasing case, proving $F\\ge0$ there, while the nondecreasing case was handled analytically.',
      );
      const introduction = 'Then, we describe each family in more detail.';
      const scope = '\n\n**Source and verification scope.** The source links below use the cleaned repository snapshot `59847d2a7679de9fbf696578f0f8dc0331bb18e2`. The linked Lean files are byte-identical to those in the frozen proof snapshot `9a667b0f786c5e6e082c55239db8c1f29d683dd2`. This guide explains the certificates. For the recorded build, statement, axiom, and proof-graph kernel checks, including their environment and existing-artifact qualifications, see the [verification record](https://github.com/sunfishho/courtade-kumar-conjecture/blob/9a667b0f786c5e6e082c55239db8c1f29d683dd2/verification/comparator/recorded/README.md).';
      if (!text.includes('**Source and verification scope.**')) text = text.replace(introduction, introduction + scope);
      return { ...record, text };
    });
  }
  if (pages['index.html'].includes(auxiliaryPrefix)) {
    pages['index.html'] = replacePublishedValue(pages['index.html'], auxiliaryPrefix, record => ({
      ...record, 'lean-writeup.html': pages['lean-writeup.html'],
    }));
  }
  return pages;
}

if (process.argv.includes('--json')) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(JSON.stringify(refineCKPages(JSON.parse(input))));
}
