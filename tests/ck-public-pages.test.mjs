import assert from 'node:assert/strict';
import test from 'node:test';
import { preparePublicCKPages, publicCKPageNames } from '../tools/ck-public-pages.mjs';

test('public reader preserves page content, adds missing noindex and is idempotent', () => {
  const pages = Object.fromEntries(publicCKPageNames.map(name => [name, '<html><head><title>Reader</title></head><body>Approved content</body></html>']));
  pages['blog.html'] = pages['blog.html'].replace('<head>', '<head><meta name="robots" content="noindex, nofollow, noarchive">');
  const next = preparePublicCKPages(pages);
  assert.equal(next['blog.html'], pages['blog.html']);
  assert.deepEqual(preparePublicCKPages(next), next);
  for (const name of publicCKPageNames) {
    assert.match(next[name], /<meta name="robots" content="noindex/);
    assert.match(next[name], /<body>Approved content<\/body>/);
  }
});

test('public publisher refuses missing pages or password loaders', () => {
  assert.throws(() => preparePublicCKPages({}), /Missing CK reader/);
  const pages = Object.fromEntries(publicCKPageNames.map(name => [name, '<html><head></head><body></body></html>']));
  pages['index.html'] = pages['index.html'].replace('<body>', '<body><form id="unlock-form"></form>');
  assert.throws(() => preparePublicCKPages(pages), /Password loader/);
});
