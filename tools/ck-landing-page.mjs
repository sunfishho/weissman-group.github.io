// Approved public landing copy. Keep it independent of local preview files.
export const landingCopy = {
  title: 'What is the most informative bit in a noisy string?',
  setup: "You summarize a string of random bits with a single yes-or-no answer, while someone else sees only a noisy copy of the original string. Given a noisy copy of a string of bits, what's the best any single-bit statistic can do to tell us about the original string of bits? Turns out, you can't do better than just copying one of the bits.",
  context: 'An exposition of our AI-assisted research effort to resolve and formalize the proof of the Courtade-Kumar conjecture.',
  blogDescription: 'An introduction to the problem and the main ideas of our argument.',
  visualTitle: 'A graphical visualization of the proof and its dependencies',
  visualDescription: 'See an interactive view of the intermediate results within the proof. This is an experimental feature designed to explore what math communication may look like in the AI era.',
};

export function refineCKLandingPage(page) {
  if (!page.includes('<main class="ck-home-main">')) return page;
  const main = `<main class="ck-home-main">
<h1>${landingCopy.title}</h1>
<p class="ck-home-deck">${landingCopy.setup}</p>
<p class="ck-home-context">${landingCopy.context}</p>
<div class="ck-reading-options">
<a class="ck-reading-option" href="blog.html"><span class="ck-option-label">Blog post</span><h2>A Bit, Too Many Proofs?</h2><p>${landingCopy.blogDescription}</p><span class="ck-option-action">Read the post <span aria-hidden="true">→</span></span></a>
<a class="ck-reading-option" href="./#ck"><span class="ck-option-label">Visual proof</span><h2>${landingCopy.visualTitle}</h2><p>${landingCopy.visualDescription}</p><span class="ck-option-action">Explore the proof <span aria-hidden="true">→</span></span></a>
</div>
<section class="ck-supporting ck-usage" aria-labelledby="usage-heading"><h2 id="usage-heading">AI Usage</h2><div><a href="ai-disclosure.html">Read the AI Usage statement →</a><p>A description of which models we used and how we used them</p></div></section>
<section class="ck-supporting" aria-labelledby="lean-heading"><h2 id="lean-heading">Lean certificate work</h2><div><a href="lean-writeup.html">Read the Lean certificate writeup →</a><p>A description of how each of the nine Lean certificate families was built in the formalization effort</p></div></section>
<section class="ck-supporting" aria-labelledby="prompt-heading"><h2 id="prompt-heading">Prompting</h2><div><a href="prompting.html">Read the original prompt →</a><p>Our prompt to GPT 5.6 Sol that led to a proof of the Courtade-Kumar conjecture</p></div></section>
<p class="ck-home-authors">Matthew Ho · Abhiram Gorle · Tsachy Weissman<br><span>Department of Electrical Engineering, Stanford University</span></p>
</main>`;
  return page.replace(/<main class="ck-home-main">[\s\S]*?<\/main>/, main);
}

const landingStyles = `/* CK landing styles: start */
.ck-home h1{max-width:1000px;text-wrap:balance}
.ck-home .ck-home-deck{color:#000;margin-bottom:14px}
.ck-home-context{max-width:760px;font:400 15px/1.65 var(--sans);color:#5b5853;margin:0 0 46px}
.ck-writeup article code{overflow-wrap:anywhere}
@media(max-width:1000px){.ck-writeup article :is(h1,h2,h3,h4,p[id]){scroll-margin-top:175px}}
@media(max-width:760px){.ck-home-context{font-size:14px;margin-bottom:34px}}
@media(max-width:760px){html:has(body.ck-blog){scroll-padding-top:200px}}
@media(max-width:360px){html:has(body.ck-blog){scroll-padding-top:240px}.ck-writeup article :is(h1,h2,h3,h4,p[id]){scroll-margin-top:215px}}
/* CK landing styles: end */`;

export function refineCKLandingStyles(css) {
  const existing = /\/\* CK landing styles: start \*\/[\s\S]*?\/\* CK landing styles: end \*\//;
  return existing.test(css) ? css.replace(existing, landingStyles) : css + '\n' + landingStyles + '\n';
}
