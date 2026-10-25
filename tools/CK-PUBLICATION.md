# CK reader publication

`public/ck/` now provides the blog, visual proof, Prompting, AI Usage, and the
supporting Lean certificate writeup. The existing group-site password is retained.
The six HTML entry points are password screens. `article.enc` is now a version-2
AES-GCM encrypted JSON map of page names to complete reader HTML. It retains
PBKDF2/SHA-256 with 310,000 iterations. A derived key is remembered only for the
browser tab session so navigation does not require repeated password entry.

Authoring remains on the local website. Public readers have no comments, edit
controls, autosave calls, personal notes, or access to local revision history.
Saved author prose is snapshotted into the encrypted publication. The Lean
writeup uses its existing read-only renderer. Font/style assets are public.

To update from the local authoring site, install Python `cryptography` and run:

```
python tools/package-ck.py /path/to/ck-visual-paper-pilot
npm test
```

The packager asks for the existing password. Never commit the password, local
server state, or decrypted page snapshots. It checks that source revisions did
not change during packaging. The private preview snapshot is written under the
source project's `local-backups/`, outside this repository. Existing HTML loaders
are maintained separately from the content packager.

The publication uses the source project's current text, including the site's
attribution to Armstrong, Kuusi, and Loher's visual companion. The group site's
other pages and publication workflow are unchanged.

## Reader entry and review refinements (25 October 2026)

Ordinary `/ck/` and `/ck/index.html` visits open `blog.html` after unlocking.
Explicit proof-node hashes such as `/ck/#ck`, `/ck/#top`, and `/ck/#lr`, and
`?guide=...` links still open the visual proof. Legacy article-section, figure,
reference, and provenance-footnote fragments are forwarded to the blog.
The wordmark returns to the blog, with the visual proof available from its
navigation link. The password and noindex policy have not changed.

`ck-reader-refinements.mjs` applies these rules on every repack, removes the
obsolete working-draft paragraph without removing the calculations toggle,
and hides the remaining author-only notation control. It also clarifies the
certificate guide's recorded-verification scope and makes small prose repairs.
The historical prompt and the authors' AI-role/runtime statements are retained.
The regression suite exercises both default and explicit visual routing.

The original `ck_blog` Markdown/build is an earlier local authoring source.
Do not rebuild over the merged six-page publication from that source alone,
because doing so would discard the newer visual proof and supporting material.
Source-only changes and encrypted publication snapshots must be reconciled
before running the publication process again.
