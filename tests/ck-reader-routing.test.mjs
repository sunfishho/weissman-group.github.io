import assert from 'node:assert/strict';
import test from 'node:test';
import { ckReaderDestination, refineCKPages, entryRouter, visualProofIntro } from '../tools/ck-reader-refinements.mjs';

test('CK defaults to the blog, including legacy article links', () => {
  for (const query of ['', '?view=article', '?view=home']) {
    assert.equal(ckReaderDestination(query, ''), 'blog.html');
  }
  for (const hash of ['#section-3', '#section-6-onto-the-computer-assisted-proof', '#fig-12', '#references', '#ref-16', '#contents', '#contents-heading', '#references-heading', '#development-note', '#development-note-reference']) {
    assert.equal(ckReaderDestination('', hash), 'blog.html' + hash);
  }
  assert.equal(ckReaderDestination('?utm_source=colleague', '#section-7'), 'blog.html?utm_source=colleague#section-7');
});

test('explicit CK visual proof nodes and guide links remain visual', () => {
  for (const hash of ['#ck', '#top', '#lr', '#flow', '#radial-hull']) {
    assert.equal(ckReaderDestination('', hash), null);
  }
  assert.equal(ckReaderDestination('?guide=certificate-checking', ''), null);
  assert.equal(ckReaderDestination('?view=map', ''), './#ck');
  assert.equal(ckReaderDestination('?view=map', '#lr'), null);
});

test('publication refinements are idempotent and preserve proof content', () => {
  const originalRouter = '<script>if(!location.hash&&!new URLSearchParams(location.search).has("guide"))location.replace("home.html");</script>';
  const fixture = Object.fromEntries(['index', 'home', 'blog', 'lean-writeup', 'prompting', 'ai-disclosure'].map(name => [name + '.html', '<head></head><a href="home.html">CK</a><article>unchanged mathematics</article>']));
  fixture['index.html'] = '<head>' + originalRouter + '</head><article>unchanged mathematics</article>';
  fixture['blog.html'] += '<p>This is a working draft. The section on Lean formalization and the closing discussion are still to come.</p><button class="technical-toggle">Expand the calculations</button>';
  fixture['blog.html'] += '<p id="ref-16" class="reference-item">[16] Matthew Ho (repository maintainer). <a href="https://github.com/sunfishho/courtade-kumar-conjecture"><em>Courtade–Kumar in Lean.</em></a> GitHub source repository, frozen proof snapshot.</p>';
  const updated = refineCKPages(fixture);
  assert.ok(updated['index.html'].includes(entryRouter));
  assert.doesNotMatch(updated['blog.html'], /This is a working draft/);
  assert.match(updated['blog.html'], /Expand the calculations/);
  assert.match(updated['blog.html'], /href="blog.html"/);
  assert.doesNotMatch(updated['blog.html'], /Matthew Ho \(repository maintainer\)/);
  assert.match(updated['blog.html'], /<\/a> Our GitHub source repository, frozen proof snapshot/);
  for (const page of Object.values(updated)) assert.match(page, /unchanged mathematics/);
  assert.deepEqual(refineCKPages(updated), updated);
});

test('the opening points to the proof map and AI attribution concerns the new argument', () => {
  const router = '<script>if(!location.hash&&!new URLSearchParams(location.search).has("guide"))location.replace("home.html");</script>';
  const pages = Object.fromEntries(['index', 'home', 'blog', 'lean-writeup', 'prompting', 'ai-disclosure'].map(name => [name + '.html', '<head></head>']));
  pages['index.html'] = '<head>' + router + '</head>';
  pages['blog.html'] += '<div class="essay-opening"><p>Opening explanation.</p><details class="reading-guide">Guide.</details></div>';
  pages['ai-disclosure.html'] += '<p>GPT 5.6 Sol was used to discover the proof of the Courtade-Kumar conjecture that this project explores (and is therefore responsible for discovery of the mathematical content in this project), and GPT 6 Astra was used to write the Lean formalization.</p>';
  const updated = refineCKPages(pages);
  assert.ok(updated['blog.html'].includes(visualProofIntro));
  assert.ok(updated['blog.html'].indexOf(visualProofIntro) < updated['blog.html'].indexOf('<details class="reading-guide">'));
  assert.equal(updated['blog.html'].split('class="visual-proof-intro"').length - 1, 1);
  assert.match(updated['ai-disclosure.html'], /discover the new proof argument/);
  assert.doesNotMatch(updated['ai-disclosure.html'], /discovery of the mathematical content/);
  assert.deepEqual(refineCKPages(updated), updated);
});
