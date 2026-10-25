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
