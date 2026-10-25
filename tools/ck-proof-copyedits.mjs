// Narrow editorial repairs for the CK visual reader. This contains no complete
// reader document, certificate data, publication password, or executable input.
const assignments = {
  paper: 'const PAPER=',
  study: 'const STUDY = ',
  edits: 'async function bootStudy(){studyState.edits=',
};

function record(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Unknown CK proof schema: ' + label);
  }
  return value;
}

// Read a JSON object literal, not JavaScript. In particular, do not evaluate
// script blocks from the publication to recover their data.
function readAssignment(html, marker) {
  const markerStart = html.indexOf(marker);
  if (markerStart < 0 || html.indexOf(marker, markerStart + marker.length) >= 0) {
    throw new Error('Missing or ambiguous CK proof assignment: ' + marker);
  }
  let start = markerStart + marker.length;
  while (/\s/.test(html[start] || '')) start++;
  if (html[start] !== '{') throw new Error('CK proof data must be a JSON object');
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const character = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quoted = false;
    } else if (character === '"') quoted = true;
    else if (character === '{' || character === '[') depth++;
    else if (character === '}' || character === ']') {
      depth--;
      if (!depth) {
        let end = i + 1;
        while (/\s/.test(html[end] || '')) end++;
        if (html[end] !== ';') throw new Error('Unknown CK proof assignment terminator');
        return { start, end: i + 1, value: record(JSON.parse(html.slice(start, i + 1)), marker) };
      }
    }
  }
  throw new Error('Unterminated CK proof JSON assignment');
}

const mathBlocks = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$)/g;
const literalTextCommands = new Set(['text', 'textrm', 'textsf', 'texttt', 'textnormal', 'operatorname', 'mbox']);

function walkMath(tex, replace) {
  let result = '';
  for (let i = 0; i < tex.length;) {
    const character = tex[i];
    if (character === '\\') {
      const command = tex.slice(i + 1).match(/^[A-Za-z]+/);
      if (!command) { result += tex.slice(i, i + 2); i += 2; continue; }
      const name = command[0];
      let end = i + name.length + 1;
      // Words inside text/operator commands are not math variables.
      if (literalTextCommands.has(name)) {
        while (/\s/.test(tex[end] || '')) end++;
        if (tex[end] === '{') {
          let depth = 1;
          for (end++; end < tex.length && depth; end++) {
            if (tex[end] === '\\') { end++; continue; }
            if (tex[end] === '{') depth++;
            else if (tex[end] === '}') depth--;
          }
          if (depth) throw new Error('Unterminated CK proof text command');
        }
      }
      result += tex.slice(i, end); i = end; continue;
    }
    // Existing comparison notation is already correct, never M -> M_c_c.
    if (character === 'M' && /^M_(?:c|\{c\})/.test(tex.slice(i))) {
      const token = tex.slice(i).match(/^M_(?:c|\{c\})/)[0];
      result += token; i += token.length; continue;
    }
    let replacement = replace(character);
    if (replacement !== character && replacement.length > 1) {
      let previous = i - 1;
      while (previous >= 0 && /\s/.test(tex[previous])) previous--;
      // TeX takes one token after ^ or _. A newly subscripted M_c must
      // therefore be grouped, e.g. integral ^M -> ^{M_c}, not ^M_c.
      if (tex[previous] === '^' || tex[previous] === '_') replacement = '{' + replacement + '}';
    }
    result += replacement; i++;
  }
  return result;
}

function hasMathVariable(text, variable) {
  let found = false;
  for (const match of text.matchAll(mathBlocks)) {
    walkMath(match[0].slice(2, -2), character => {
      if (character === variable) found = true;
      return character;
    });
  }
  return found;
}

// The modes refer to the OLD dictionary in these specific source fields:
// fixed: p -> M; auxiliary: M -> M_c; both: simultaneous p -> M, M -> M_c.
// TeX letters are individual tokens, so pt^2 is correctly changed to Mt^2.
export function alignLRNotation(text, mode) {
  if (typeof text !== 'string' || !['fixed', 'auxiliary', 'both'].includes(mode)) {
    throw new Error('Unknown CK LR notation repair');
  }
  const oldFixed = hasMathVariable(text, 'p');
  const oldAuxiliary = /\\mathcal N\(M\/2\)/.test(text);
  if ((mode === 'fixed' || mode === 'both') && !oldFixed) return text;
  if (mode === 'auxiliary' && !oldAuxiliary) return text;
  if (mode === 'both' && /M_(?:c|\{c\})/.test(text)) {
    throw new Error('Mixed CK LR dictionaries require manual review');
  }
  return text.replace(mathBlocks, block => block.slice(0, 2) + walkMath(block.slice(2, -2), character => {
    if ((mode === 'both' || mode === 'fixed') && character === 'p') return 'M';
    if ((mode === 'both' || mode === 'auxiliary') && character === 'M') return 'M_c';
    return character;
  }) + block.slice(-2));
}

export const lrNotationRepairs = Object.freeze([
  ['flow>lr', 'role', 'fixed'],
  ['low-shape>lr', 'role', 'fixed'],
  ['high-shape>lr', 'role', 'fixed'],
  ['boundary>flow', 'argument', 'fixed'],
  ['boundary>flow', 'derivation', 'fixed'],
  ['flow>low-shape', 'role', 'fixed'],
  ['determinant>high-shape', 'derivation', 'both'],
  ['interval>midpoint', 'argument', 'auxiliary'],
  ['interval>midpoint', 'derivation', 'auxiliary'],
  ['interval>compact-v', 'derivation', 'both'],
  ['boundary>finite-v', 'derivation', 'both'],
  ['interval>determinant', 'derivation', 'both'],
  ['interval>midpoint-small-s', 'derivation', 'auxiliary'],
].map(entry => Object.freeze(entry)));

const centeredLead = String.raw`At a solution \(X\) of the required entropy equation \(F_{c,r}(X)=0\), the centered entropy difference is nonnegative.`;
const extensionArgument = String.raw`The certificate proves \(\mathscr R_\rho(c_b,r)\ge0\). The extension proof then uses concavity in the mass \(c\) to obtain \(\mathscr R_\rho(c,r)\ge0\) for \(0\le c\le c_b\). At the entropy root, monotonicity in the bias gives the required objective bound.`;
const extensionDerivation = String.raw`With \(\Gamma_{c,r}\) and \(F_{c,r}\) defined in the [extension proof](#top-glue), the exact identity is
$$c j_{\rm nat}(\rho r)-\mathcal L(X)=\Gamma_{c,r}(X)+F_{c,r}(X).$$
At the entropy root, \(F_{c,r}(X)=0\). Since \(X\le1-c\) and \(\Gamma_{c,r}\) decreases with the bias,
$$c j_{\rm nat}(\rho r)-\mathcal L(X)=\Gamma_{c,r}(X)\ge\Gamma_{c,r}(1-c)=\mathscr R_\rho(c,r).$$
The entropy equation gives \(c\le c_b\). The [centered positivity certificate](#top-cert) proves \(\mathscr R_\rho(c_b,r)\ge0\), and \(\mathscr R_\rho(\cdot,r)\) is concave in the mass and vanishes at zero. Therefore
$$\mathscr R_\rho(c,r)\ge\frac c{c_b}\mathscr R_\rho(c_b,r)\ge0.$$
The channel and ray endpoints are treated directly in the [centered inequality](#top).`;

export function refineCKProofPage(html) {
  if (typeof html !== 'string') throw new Error('CK proof page must be a string');
  const parts = Object.fromEntries(Object.entries(assignments).map(([key, marker]) => [key, readAssignment(html, marker)]));
  const paper = parts.paper.value, study = parts.study.value, edits = parts.edits.value;
  if (!Array.isArray(paper.nodes) || paper.nodes.some(node => !node || typeof node.id !== 'string')) {
    throw new Error('Unknown CK proof schema: PAPER.nodes');
  }
  const nodeIds = paper.nodes.map(node => node.id);
  if (new Set(nodeIds).size !== nodeIds.length) throw new Error('Duplicate CK proof node IDs');
  record(study.nodes, 'STUDY.nodes'); record(study.edges, 'STUDY.edges'); record(edits.nodes, 'edits.nodes');

  function transformVersions(key, field, base, transform) {
    record(base, key);
    if (typeof base[field] !== 'string') throw new Error('Unknown CK proof field: ' + key + '.' + field);
    base[field] = transform(base[field]);
    if (Object.hasOwn(edits.nodes, key)) {
      const saved = record(edits.nodes[key], 'saved ' + key);
      const fields = record(saved.fields, 'saved fields ' + key);
      if (Object.hasOwn(fields, field)) {
        if (typeof fields[field] !== 'string') throw new Error('Non-text CK proof override: ' + key + '.' + field);
        fields[field] = transform(fields[field]);
      }
    }
  }
  const edge = (id, field, transform) => transformVersions('edge:' + id, field, study.edges[id], transform);
  const node = (id, field, transform) => transformVersions(id, field, study.nodes[id], transform);

  for (const [id, field, mode] of lrNotationRepairs) edge(id, field, text => alignLRNotation(text, mode));
  edge('boundary>flow', 'derivation', text => text
    .replaceAll('T^*', 'T_*')
    .replaceAll(String.raw`\mathcal B(0)`, String.raw`\mathscr B(0)`));

  node('notation', 'argument', text => text.replace(String.raw`\(M=v/(1+v)\)`, String.raw`\(M_c=v/(1+v)\)`));
  node('notation', 'derivation', text => text
    .replace('Multiplying both solution of the entropy equation and objective', 'Multiplying both sides of the entropy equation and the objective')
    .replace(String.raw` The later instantaneous-support notes use \(j\) for entropy production, whereas the finite-channel argument uses \(j\) for a mixed entropy. These functions should not be interchanged.`, ''));

  const topGlue = paper.nodes.find(item => item.id === 'top-glue');
  transformVersions('top-glue', 'lead', topGlue, text => {
    if (text === centeredLead) return text;
    if (!text.includes(String.raw`\widetilde\Gamma_{c,r}(X)`) || !text.includes(String.raw`F_{c,r}(X)=0`)) {
      throw new Error('Unknown CK centered extension lead');
    }
    return centeredLead;
  });
  for (const id of ['top-cap>top', 'top-cert>top', 'top-glue>top']) {
    edge(id, 'derivation', text => text.replaceAll(String.raw`\widetilde\Gamma`, String.raw`\Gamma`));
  }
  for (const id of ['top-cap>top-glue', 'top-cert>top-glue']) {
    edge(id, 'derivation', text => {
      if (text === extensionDerivation) return text;
      if (!text.includes(String.raw`\widetilde\Gamma`) && !text.includes(String.raw`\Gamma_{c,r}`)) {
        throw new Error('Unknown CK centered dependency explanation');
      }
      return extensionDerivation;
    });
  }
  edge('top-cert>top-glue', 'argument', text => {
    if (text === extensionArgument) return text;
    if (!text.includes('It supplies the polynomial sign') || !text.includes(String.raw`\widetilde\Gamma`)) {
      throw new Error('Unknown CK centered certificate explanation');
    }
    return extensionArgument;
  });

  node('determinant', 'derivation', text => text.replace(
    String.raw`The subdivision starts from two closed boxes in \((s,k,\chi)\) are`,
    String.raw`The subdivision starts from the following two closed boxes in \((s,k,\chi)\):`,
  ));
  edge('analytic-bridges>determinant', 'derivation', text => text.replace('admitted determinant target', 'required determinant target'));

  // Replace only the three data literals. All other HTML/JavaScript is byte
  // preserved. Escape '<' so data cannot introduce a closing script tag.
  for (const part of Object.values(parts).sort((a, b) => b.start - a.start)) {
    const encoded = JSON.stringify(part.value).replaceAll('<', '\\u003c');
    html = html.slice(0, part.start) + encoded + html.slice(part.end);
  }
  return html;
}
