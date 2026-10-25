// Shared by the public reader publisher and its regression tests. No complete page
// or password is stored here. Explicit proof-node and guide links remain available.
import { refineCKProofPage } from './ck-proof-copyedits.mjs';

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
export const visualProofIntro = '<p class="visual-proof-intro">For a closer look at the mathematics, follow the <a href="./#ck">visual proof map</a>. The <em>In the visual proof</em> links throughout this blog take you directly to the corresponding statements, proofs, and dependencies.</p>';
export const designCredit = '<p class="design-credit" id="design-credit"><small>The authors drew inspiration for this blog’s layout and presentation from <a href="https://hyperstition.cc/">Hyperstition’s blogs</a>.</small></p>';

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
  pages['blog.html'] = pages['blog.html'].replace(
    /(?<!,) and is differentiable in the interior\./, ', and is differentiable in the interior.',
  ).replace(
    '<p>Whereas the centered inequality uses the <a href="./#top-cert">positivity certificate for the centered inequality</a>, establishing ',
    '<p>Establishing ',
  ).replace(
    'across the single-ray parameter space requires combining several regimes:',
    'across the single-ray parameter space requires several types of estimates:',
  );
  if (!pages['blog.html'].includes('class="visual-proof-intro"')) {
    pages['blog.html'] = pages['blog.html'].replace(
      /(<div class="essay-opening"><p>[\s\S]*?<\/p>)/,
      '$1\n' + visualProofIntro,
    );
  }
  if (!pages['blog.html'].includes('id="design-credit"')) {
    pages['blog.html'] = pages['blog.html'].replace(
      /(<\/article>\s*<div class="draft-endnote">)/,
      designCredit + '\n$1',
    );
  }
  pages['ai-disclosure.html'] = pages['ai-disclosure.html'].replace(
    'GPT 5.6 Sol was used to discover the proof of the Courtade-Kumar conjecture that this project explores (and is therefore responsible for discovery of the mathematical content in this project)',
    'GPT 5.6 Sol was used to discover the new proof argument for the Courtade–Kumar conjecture presented here',
  );
  // Repository maintenance is not an authorship statement. Cite the shared
  // project without inferring research contribution from Git commit ownership.
  pages['blog.html'] = pages['blog.html'].replace(
    /(<p id="ref-16" class="reference-item">)([\s\S]*?)(<\/p>)/,
    (_, open, entry, close) => open + entry
      .replace('[16] Matthew Ho (repository maintainer). ', '[16] ')
      .replace('</a> GitHub source repository,', '</a> Our GitHub source repository,') + close,
  );
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
      ).replace(
        'For the remaining coefficients, we use certificates to prove the base case of an inductive argument and use an analytic argument to prove the inductive hypothesis to complete the nonnegativity proof.',
        'For the remaining coefficients, certificates establish the base case, and an analytic induction step proves nonnegativity of every subsequent coefficient.',
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
  if (pages['index.html'].includes('const PAPER=')) {
    pages['index.html'] = refineCKProofPage(pages['index.html']);
  }
  return pages;
}

if (process.argv.includes('--json')) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(JSON.stringify(refineCKPages(JSON.parse(input))));
}
