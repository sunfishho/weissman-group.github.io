(() => {
  'use strict';
  const passages = [...document.querySelectorAll('details.technical-details')];
  const expandButton = document.querySelector('.technical-toggle');
  const sections = [...document.querySelectorAll('.essay-section')];
  const links = [...document.querySelectorAll('.toc-nav a[data-section]')];
  const article = document.getElementById('article-view');
  const home = document.getElementById('home-view');
  let queued = false;
  function updatePosition() {
    document.body.classList.toggle('is-scrolled', scrollY > 135);
    let active = sections[0]?.id;
    for (const section of sections) { if (section.getBoundingClientRect().top <= innerHeight * .3) active = section.id; else break; }
    for (const link of links) { if (link.dataset.section === active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); }
    queued = false;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(updatePosition); } }
  function updateButton() {
    if (!expandButton) return;
    const open = passages.length > 0 && passages.every(p => p.open);
    expandButton.setAttribute('aria-pressed', String(open));
    expandButton.replaceChildren(document.createTextNode(open ? 'Collapse the calculations ' : 'Expand the calculations '));
    const symbol = document.createElement('span'); symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = open ? '−' : '+'; expandButton.append(symbol);
  }
  expandButton?.addEventListener('click', () => { const open = !passages.every(p => p.open); for (const p of passages) p.open = open; updateButton(); schedule(); });
  for (const passage of passages) passage.addEventListener('toggle', () => { updateButton(); schedule(); });
  function showView(view, push = false) {
    const isHome = view === 'home';
    article.hidden = isHome; home.hidden = !isHome;
    document.body.classList.toggle('is-home', isHome);
    if (push) { const url = new URL(location.href); url.searchParams.set('view', isHome ? 'home' : 'article'); url.hash = ''; history.pushState(null, '', url); }
    scrollTo(0, 0); schedule();
  }
  document.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); showView(link.dataset.view, true); }));
  document.querySelectorAll('[data-density]').forEach(button => { if (button.tagName !== 'BUTTON') return; button.addEventListener('click', () => { document.querySelector('.article-list').dataset.density = button.dataset.density; document.querySelectorAll('.density-controls button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }); });
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }));
  document.querySelectorAll('.toc-nav a').forEach(link => link.addEventListener('click', () => { document.getElementById('contents').open = false; }));
  function revealHash() {
    if (!location.hash) return;
    let target; try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target) return;
    let parent = target.parentElement; while (parent) { if (parent.tagName === 'DETAILS') parent.open = true; parent = parent.parentElement; }
    requestAnimationFrame(() => target.scrollIntoView());
  }
  addEventListener('popstate', () => { showView(new URLSearchParams(location.search).get('view')); revealHash(); });
  addEventListener('hashchange', revealHash);
  addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule);
  addEventListener('beforeprint', () => { for (const p of passages) { p.dataset.printOpen = String(p.open); p.open = true; } });
  addEventListener('afterprint', () => { for (const p of passages) p.open = p.dataset.printOpen === 'true'; });
  document.fonts.ready.then(schedule); showView(new URLSearchParams(location.search).get('view')); updateButton(); revealHash();
})();
