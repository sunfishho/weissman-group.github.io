import assert from 'node:assert/strict';
import test from 'node:test';
import { alignLRNotation, lrNotationRepairs, refineCKProofPage } from '../tools/ck-proof-copyedits.mjs';

// Synthetic snippets only: no complete unpublished reader, password or ledger.
function fixture({ overrides = {}, mutate } = {}) {
  const fields = {};
  for (const [id, field, mode] of lrNotationRepairs) {
    fields[id] ??= {};
    fields[id][field] = mode === 'both'
      ? String.raw`$$\mathcal N(p)\ge\mathcal N(M)=s^2V,\quad\int_{q_\star}^M m(q)\,dq.$$`
      : mode === 'auxiliary' ? String.raw`$$\mathcal N(M/2)\ge0.$$`
        : String.raw`Fix \(M\), then $$\mathcal N(p)=AP_W-4W\{(1-p)D+pt^2B\}.$$`;
  }
  for (const id of ['top-cap>top', 'top-cert>top', 'top-glue>top', 'top-cap>top-glue', 'top-cert>top-glue']) {
    fields[id] ??= {};
    fields[id].derivation = String.raw`At \(F_{c,r}(X)=0\), use \(\widetilde\Gamma_{c,r}(X)\).`;
  }
  fields['top-cert>top-glue'].argument = String.raw`It supplies the polynomial sign using \(\widetilde\Gamma\).`;
  fields['analytic-bridges>determinant'] = { derivation: 'These bounds prove the admitted determinant target.' };
  const paper = { nodes: [{ id: 'top-glue', lead: String.raw`At a solution \(X\) of \(F_{c,r}(X)=0\), \(\widetilde\Gamma_{c,r}(X)\) is nonnegative.` }] };
  const study = { nodes: {
    notation: {
      argument: String.raw`Compare \(M=\mathbb E m\) with \(M=v/(1+v)\).`,
      derivation: String.raw`Multiplying both solution of the entropy equation and objective by \(\log2\) preserves order. The later instantaneous-support notes use \(j\) for entropy production, whereas the finite-channel argument uses \(j\) for a mixed entropy. These functions should not be interchanged.`,
    },
    determinant: { derivation: String.raw`The subdivision starts from two closed boxes in \((s,k,\chi)\) are` },
  }, edges: fields };
  const edits = { nodes: overrides };
  mutate?.({ paper, study, edits });
  const html = '<script>globalThis.mustNotExecute = true;</script>BEFORE'
    + '<script>const PAPER=' + JSON.stringify(paper) + ';const keepPaperCode=1;</script>BETWEEN'
    + '<script>const STUDY = ' + JSON.stringify(study) + ';const keepStudyCode=2;</script>AFTER'
    + '<script>async function bootStudy(){studyState.edits=' + JSON.stringify(edits) + ';keepBootCode();}</script>TAIL';
  return { html, paper, study, edits };
}

function data(html, marker, after) {
  return JSON.parse(html.split(marker)[1].split(after)[0]);
}

test('fixed-mean renaming respects TeX tokens, adjacency, text and commands', () => {
  const before = String.raw`p in prose. \(M=u/(1-M),\quad pt^2+(1-p)D+\Phi(p),\quad\text{keep p and M}\). [p](https://example.test/p)`;
  const after = alignLRNotation(before, 'fixed');
  assert.equal(after, String.raw`p in prose. \(M=u/(1-M),\quad Mt^2+(1-M)D+\Phi(M),\quad\text{keep p and M}\). [p](https://example.test/p)`);
  assert.equal(alignLRNotation(after, 'fixed'), after);
});

test('simultaneous alpha renaming groups newly subscripted TeX limits', () => {
  const before = String.raw`$$\mathcal N(p)\ge\mathcal N(M),\quad\int_{q_\star}^M m(q)\,dq,\quad x^ M+y_M.$$`;
  const after = alignLRNotation(before, 'both');
  assert.equal(after, String.raw`$$\mathcal N(M)\ge\mathcal N(M_c),\quad\int_{q_\star}^{M_c} m(q)\,dq,\quad x^ {M_c}+y_{M_c}.$$`);
  assert.equal(alignLRNotation(after, 'both'), after);
  assert.doesNotMatch(after, /\^M_c|_M_c/);
});

test('auxiliary-only renaming preserves already correct comparison notation', () => {
  const before = String.raw`$$\mathcal N(M/2)\ge0.$$`;
  const after = alignLRNotation(before, 'auxiliary');
  assert.equal(after, String.raw`$$\mathcal N(M_c/2)\ge0.$$`);
  assert.equal(alignLRNotation(after, 'auxiliary'), after);
  const correct = String.raw`$$\mathcal N(M)\ge\mathcal N(M_c),\quad\mathcal N(M_{c}/2)\ge0,\quad M_ct.$$`;
  assert.equal(alignLRNotation(correct, 'both'), correct);
  assert.throws(() => alignLRNotation(String.raw`$$p+M_c$$`, 'both'), /Mixed CK LR dictionaries/);
});

test('proof refinement corrects base and effective saved versions without executing scripts', () => {
  const { html } = fixture({ overrides: {
    'edge:boundary>flow': { revision: 3, fields: { derivation: String.raw`$$\mathcal N(p)=AP_W-4W\{(1-p)D+pt^2B\},\quad T^*=T_*,\quad\mathcal B(0)=0.$$` } },
    'edge:determinant>high-shape': { revision: 4, fields: { derivation: String.raw`$$\mathcal N(p)\ge\mathcal N(M),\quad\int_{q_\star}^M m(q)\,dq.$$` } },
  } });
  const updated = refineCKProofPage(html);
  assert.equal(globalThis.mustNotExecute, undefined);
  const study = data(updated, 'const STUDY = ', ';const keepStudyCode');
  const edits = data(updated, 'async function bootStudy(){studyState.edits=', ';keepBootCode');
  assert.match(study.edges['boundary>flow'].derivation, /Mt\^2B/);
  assert.match(edits.nodes['edge:boundary>flow'].fields.derivation, /Mt\^2B/);
  assert.doesNotMatch(edits.nodes['edge:boundary>flow'].fields.derivation, /pt\^2B/);
  assert.doesNotMatch(edits.nodes['edge:boundary>flow'].fields.derivation, /T\^\*|\\mathcal B\(0\)/);
  assert.match(edits.nodes['edge:boundary>flow'].fields.derivation, /\\mathscr B\(0\)/);
  assert.match(edits.nodes['edge:determinant>high-shape'].fields.derivation, /\^\{M_c\}/);
  assert.equal(edits.nodes['edge:determinant>high-shape'].revision, 4);
  for (const marker of ['BEFORE', 'BETWEEN', 'AFTER', 'TAIL', 'const keepPaperCode=1;', 'const keepStudyCode=2;', 'keepBootCode();']) assert.ok(updated.includes(marker));
  assert.equal(refineCKProofPage(updated), updated);
});

test('TOP explanations use bias monotonicity and mass concavity with the same residual', () => {
  const updated = refineCKProofPage(fixture().html);
  const paper = data(updated, 'const PAPER=', ';const keepPaperCode');
  const study = data(updated, 'const STUDY = ', ';const keepStudyCode');
  assert.match(paper.nodes[0].lead, /centered entropy difference/);
  for (const key of ['top-cap>top-glue', 'top-cert>top-glue']) {
    const proof = study.edges[key].derivation;
    assert.match(proof, /decreases with the bias/);
    assert.match(proof, /concave in the mass/);
    assert.match(proof, /\\Gamma_\{c,r\}\(X\)\+F_\{c,r\}\(X\)/);
    assert.doesNotMatch(proof, /widetilde|transition residual/);
  }
  assert.doesNotMatch(study.nodes.notation.derivation, /both solution|later instantaneous/);
  assert.match(study.nodes.notation.argument, /M_c=v/);
  assert.match(study.nodes.determinant.derivation, /following two closed boxes/);
  assert.match(study.edges['analytic-bridges>determinant'].derivation, /required determinant target/);
});

test('JSON serialization cannot close script tags and unknown schemas fail closed', () => {
  const { html } = fixture({ mutate: ({ study }) => { study.unrelated = { note: '</script><script>bad()</script>' }; } });
  const updated = refineCKProofPage(html);
  assert.ok(updated.includes('\\u003c/script>'));
  assert.equal(data(updated, 'const STUDY = ', ';const keepStudyCode').unrelated.note, '</script><script>bad()</script>');
  assert.throws(() => refineCKProofPage('<script>not a CK reader</script>'), /Missing or ambiguous/);
  assert.throws(() => refineCKProofPage(fixture({ mutate: ({ study }) => { study.edges = []; } }).html), /Unknown CK proof schema/);
  assert.throws(() => refineCKProofPage(fixture({ mutate: ({ study }) => { study.edges['flow>lr'].role = null; } }).html), /Unknown CK proof field/);
});
