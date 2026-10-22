import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const clientRoot = new URL("../dist/client/", import.meta.url);
const appRoot = new URL("../app/", import.meta.url);

test("exports the CK password screen without plaintext article content", async () => {
  const html = await readFile(new URL("ck/index.html", clientRoot), "utf8");
  const payload = JSON.parse(
    await readFile(new URL("ck/article.enc", clientRoot), "utf8"),
  );

  assert.match(html, /<form[^>]+id="unlock-form"/);
  assert.match(html, /type="password"/);
  assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(html, /class="wordmark" href="\.\/"/);
  assert.match(html, /fetch\('article\.enc'/);
  assert.doesNotMatch(html, /<article\b|class="essay"|class="katex"/);
  assert.equal(payload.algorithm, "AES-GCM");
  assert.equal(payload.kdf, "PBKDF2");
  assert.equal(payload.hash, "SHA-256");
  assert.equal(payload.iterations, 310_000);
  assert.equal(Buffer.from(payload.salt, "base64").length, 32);
  assert.equal(Buffer.from(payload.iv, "base64").length, 12);
  assert.ok(Buffer.from(payload.data, "base64").length > 100_000);
  assert.deepEqual(Object.keys(payload).sort(), [
    "algorithm", "data", "hash", "iterations", "iv", "kdf", "salt", "version",
  ]);

  await Promise.all([
    access(new URL("ck/styles.css", clientRoot)),
    access(new URL("ck/blog.js", clientRoot)),
    access(new URL("ck/assets/fonts/inter-latin.woff2", clientRoot)),
    access(new URL("ck/assets/fonts/geist-mono-latin.woff2", clientRoot)),
    access(new URL("ck/assets/fonts/inter-OFL.txt", clientRoot)),
    access(new URL("ck/assets/fonts/geist-mono-OFL.txt", clientRoot)),
    access(new URL("ck/assets/katex/katex.min.css", clientRoot)),
    access(new URL("ck/assets/katex/LICENSE.txt", clientRoot)),
  ]);
});

test("copies only the approved encrypted CK runtime files, byte for byte", async () => {
  const source = new URL("../public/ck/", import.meta.url);
  const exported = new URL("ck/", clientRoot);
  const rootFiles = new Set(["index.html", "article.enc", "styles.css", "blog.js"]);
  const directories = new Set([
    "assets", "assets/fonts", "assets/katex", "assets/katex/fonts",
  ]);

  async function verify(relative = "") {
    const entries = await readdir(new URL(relative, source), { withFileTypes: true });
    const outputEntries = await readdir(new URL(relative, exported));
    assert.deepEqual(outputEntries.sort(), entries.map(entry => entry.name).sort());
    for (const entry of entries) {
      const path = relative + entry.name;
      assert.equal(entry.isSymbolicLink(), false, path);
      if (entry.isDirectory()) {
        assert.ok(directories.has(path), path);
        await verify(path + "/");
      } else {
        assert.ok(entry.isFile(), path);
        assert.ok(
          rootFiles.has(path)
          || path === "assets/katex/katex.min.css"
          || path === "assets/katex/LICENSE.txt"
          || /^assets\/fonts\/(inter-latin\.woff2|geist-mono-latin\.woff2|inter-OFL\.txt|geist-mono-OFL\.txt)$/.test(path)
          || /^assets\/katex\/fonts\/[a-zA-Z0-9_.-]+\.(woff2?|ttf)$/.test(path),
          path,
        );
        assert.deepEqual(
          await readFile(new URL(path, exported)),
          await readFile(new URL(path, source)),
          path,
        );
      }
    }
  }
  await verify();
});

async function readRoute(route = "") {
  const filename = route ? `${route}.html` : "index.html";
  return readFile(new URL(filename, clientRoot), "utf8");
}

test("exports the finished homepage", async () => {
  const html = await readRoute();

  assert.match(html, /<title>Weissman Research Group · Stanford University<\/title>/i);
  assert.match(html, /The science of/);
  assert.match(html, /Weissman Research Group/);
  assert.match(html, /Explore our research/);
  assert.match(html, /Information/);
  assert.match(html, /Intelligence/);
  assert.match(html, /Inference/);
  assert.match(html, /Toggle light and dark mode/);
  assert.match(html, /href="\/news"/);
  assert.doesNotMatch(
    html,
    /WRG \/ I|Three connected modes|Four questions about information|Recent papers|Theory is a team sport/i,
  );
  assert.match(html, /property="og:image"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/i);
});

test("exports every public route", async () => {
  const routes = [
    "research",
    "people",
    "publications",
    "news",
    "software",
    "courses",
    "outreach",
    "media",
    "community",
    "contact",
  ];
  for (const route of routes) {
    const html = await readRoute(route);
    assert.match(html, /Weissman Research Group/);
    assert.match(html, /<main[^>]*id="main-content"/i);
    assert.doesNotMatch(html, /hero-registration|37\.4275|122\.1697|WRG001|WHG001/i);
  }
});

test("renders the reconciled people directory", async () => {
  const html = await readRoute("people");

  for (const name of [
    "Aayush Rajesh",
    "Abhiram Gorle",
    "Connor Ding",
    "Jiwon Jeong",
    "Matthew Ho",
    "Naomi Sagan",
    "Yasmine Omri",
    "Amit Yadav",
    "Taesup Moon",
    "Thierry Tambe",
  ]) {
    assert.match(html, new RegExp(name));
  }

  assert.match(html, /Jaeseok Byun/);
  assert.match(html, /class="member-year"> \(<!-- -->2025<!-- -->\)/);
  assert.match(html, /Pumiao Yan/);
  assert.match(html, /Sagnik Bhattacharya/);
  assert.match(html, /Divija Hasteer/);
  assert.doesNotMatch(html, /Atindra Jha|MS students|Undergraduate researchers/i);
  assert.match(html, /<img[^>]+alt="Tsachy Weissman"/i);
  assert.match(html, /Leadership and recognition/);
  assert.match(html, /IEEE Fellow/);
  assert.match(html, /Founding Director of the Stanford Compression Forum/);
  assert.match(html, /Website<!-- --> ↗/);
  assert.match(html, /LinkedIn<!-- --> ↗/);
  assert.match(html, /Scholar ↗/);
  for (const portrait of [
    "abhiram-gorle.png",
    "connor-ding.png",
    "jiwon-jeong.png",
    "naomi-sagan.png",
  ]) {
    assert.match(html, new RegExp(`/people/${portrait.replace(".", "\\.")}`));
  }
});

test("includes GitHub Pages and metadata assets", async () => {
  await Promise.all([
    access(new URL(".nojekyll", clientRoot)),
    access(new URL("og.png", clientRoot)),
    access(new URL("robots.txt", clientRoot)),
    access(
      new URL(
        "papers/gorle-weissman-ksg-poisson-transition-2026.pdf",
        clientRoot,
      ),
    ),
    access(
      new URL(
        "papers/gorle-weissman-ksg-poisson-transition-2026.bib",
        clientRoot,
      ),
    ),
  ]);
});

test("publishes the hosted KSG preprint and citation", async () => {
  const html = await readRoute("publications");

  assert.match(
    html,
    /A Poisson Transition and Bias Law for KSG Mutual-Information Estimation/,
  );
  assert.match(html, /Abhiram Gorle and Tsachy Weissman/);
  assert.match(html, /Preprint · October 2026/);
  assert.match(
    html,
    /href="\/papers\/gorle-weissman-ksg-poisson-transition-2026\.pdf"/,
  );
  assert.match(
    html,
    /href="\/papers\/gorle-weissman-ksg-poisson-transition-2026\.bib"/,
  );
});

test("renders the latest arXiv publication", async () => {
  const html = await readRoute("publications");

  assert.match(
    html,
    /Information, Estimation, and Prediction for Discrete Memoryless Channels via Poissonization/,
  );
  assert.match(html, /arXiv:2610\.27737/);
  assert.match(html, /href="https:\/\/arxiv\.org\/abs\/2610\.27737"/);
});

test("uses full document navigation on GitHub Pages", async () => {
  const navigationSources = await Promise.all([
    readFile(new URL("minimal-home.tsx", appRoot), "utf8"),
    readFile(new URL("site-components.tsx", appRoot), "utf8"),
    readFile(new URL("not-found.tsx", appRoot), "utf8"),
  ]);

  for (const source of navigationSources) {
    assert.doesNotMatch(source, /from ["']next\/link["']/);
    assert.doesNotMatch(source, /<\/?Link\b/);
  }
});

test("renders the standalone news, outreach, and media indexes", async () => {
  const [news, outreach, media] = await Promise.all([
    readRoute("news"),
    readRoute("outreach"),
    readRoute("media"),
  ]);

  assert.match(news, /Group updates/);
  assert.match(news, /Summer internships at Amazon and NVIDIA/);
  assert.match(news, /SHTEM summer interns/);
  assert.match(news, /Aayush advances to Ph\.D\. candidacy/);
  assert.match(news, /2026 Knight-Hennessy Scholars cohort/);
  assert.match(news, /Jiwon, Matt and Naomi have begun internships at Amazon/);
  assert.match(news, /Information-computation trade-offs/);
  assert.match(news, /Three group presentations at ISIT 2025/);
  assert.match(news, /Three papers accepted at ISIT 2025/);
  assert.match(news, /Ann Arbor/);
  assert.match(outreach, /Stanford Compression Forum/);
  assert.match(outreach, /STEM to SHTEM/);
  assert.match(media, /Selected coverage/);
  assert.match(media, /A Made-For-TV Compression Algorithm/);

  for (const html of [news, outreach, media]) {
    assert.match(html, /editorial-page/);
    assert.doesNotMatch(html, /media-home|media-signal|outreach-orbit|outreach-card|news-intro/);
  }
});

test("renders the dedicated contact directory", async () => {
  const contact = await readRoute("contact");

  assert.match(contact, /Tsachy Weissman/);
  assert.match(contact, /tsachy@stanford\.edu/);
  assert.match(contact, /Shea Goodner/);
  assert.match(contact, /sgoodner@stanford\.edu/);
  assert.match(contact, /Packard Building/);
  assert.match(contact, /Room 256/);
  assert.match(contact, /Room 259/);
});
