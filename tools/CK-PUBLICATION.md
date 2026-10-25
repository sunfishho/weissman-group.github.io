# CK reader publication

`public/ck/` provides the blog, visual proof, Prompting, AI Usage, and the
supporting Lean certificate writeup. As of the approved public launch on
25 October 2026, all six HTML entry points are directly readable without a
password, sign-in, decryption step, or stored browser key. The obsolete
`article.enc` runtime and password screens were archived privately before
removal from the deployment. The reviewed reader content was preserved.

The release is accessible to anyone with the link. Existing `noindex` directives
are retained, including on the visual-map entry, so this launch does not request
search indexing. These directives are not access control or a privacy guarantee.

Authoring remains on the local website. Public readers have no comments, edit
controls, autosave calls, personal notes, or access to local revision history.
Saved author prose is snapshotted into the public reading pages. The Lean
writeup uses its existing read-only renderer. Font/style assets are public.

To update from the local authoring site, run:

```
python tools/package-ck.py /path/to/ck-visual-paper-pilot
npm test
```

The packager writes public HTML, never password loaders. `ck-public-pages.mjs`
rejects password-loader input and preserves the link-sharing indexing policy.
Never commit historical passwords, local server state, personal notes, or
revision histories. The packager checks that source revisions did not change
during packaging. A private staging copy is written under the source project's
`local-backups/`, outside this repository.

The publication uses the source project's current text, including the site's
attribution to Armstrong, Kuusi, and Loher's visual companion. The group site's
other pages and publication workflow are unchanged.

## Reader entry and review refinements (25 October 2026)

Ordinary `/ck/` and `/ck/index.html` visits open `blog.html` immediately.
Explicit proof-node hashes such as `/ck/#ck`, `/ck/#top`, and `/ck/#lr`, and
`?guide=...` links still open the visual proof. Legacy article-section, figure,
reference, and provenance-footnote fragments are forwarded to the blog.
The wordmark returns to the blog, with the visual proof available from its
navigation link. No password is required. The noindex policy is retained.

`ck-reader-refinements.mjs` applies these rules on every repack, removes the
obsolete working-draft paragraph without removing the calculations toggle,
and hides the remaining author-only notation control. It also clarifies the
certificate guide's recorded-verification scope and makes small prose repairs.
The historical prompt and the authors' runtime statement are retained. The
approved AI attribution now concerns discovery of the new proof argument, not
all mathematical content presented in the project. A visible paragraph near
the blog opening explains the contextual links into the visual proof map.
The regression suite exercises both default and explicit visual routing.

The opening includes one sentence recording that the conjecture was posed in
2013 and remained open until the recent 2026 proofs. The desktop contents flow
down items 1–4 on the left and 5–8 on the right, preserving DOM/keyboard order.
Mobile readers see one sequential column. The packager reapplies both changes.

The final editorial pass also applies `ck-proof-copyedits.mjs` to the reader's
structured proof data. It aligns 13 scoped dependency fields with the current
fixed-mean/comparison-point notation and repairs residual-name/grammar slips,
including saved prose overrides. It does not change certificate data, graph
dependencies, source revisions, or the formal proof. Focused tests cover
simultaneous TeX renaming, grouped limits, override precedence, and idempotence.

The original `ck_blog` Markdown/build is an earlier local authoring source.
Do not rebuild over the merged six-page publication from that source alone,
because doing so would discard the newer visual proof and supporting material.
Source-only changes and publication snapshots must be reconciled
before running the publication process again.
