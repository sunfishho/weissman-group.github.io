(() => {
  'use strict';
  const passages = [...document.querySelectorAll('details.technical-details')];
  const expandButton = document.querySelector('.technical-toggle');
  const sections = [...document.querySelectorAll('.essay-section')];
  const links = [...document.querySelectorAll('.toc-nav a[data-section]')];
  const views = {
    article: document.getElementById('article-view'),
    map: document.getElementById('map-view'),
    home: document.getElementById('home-view'),
  };
  const publicationHeader = document.getElementById('publication-header');
  const viewLinks = [...document.querySelectorAll('[data-view]')];
  const publicationTitle = document.title;
  let activeView = 'article';
  let queued = false;
  const figureDialog = document.getElementById('figure-lightbox');
  const figureTitle = document.getElementById('figure-lightbox-title');
  const figureCaption = document.getElementById('figure-lightbox-caption');
  const figurePane = document.getElementById('figure-lightbox-scroll');
  const figureImage = figureDialog?.querySelector('.figure-lightbox-image');
  const figureZoom = figureDialog?.querySelector('.figure-lightbox-zoom');
  let figureOpener;
  function setFigureZoom(enlarged) {
    figureDialog?.classList.toggle('is-enlarged', enlarged);
    figureZoom?.setAttribute('aria-pressed', String(enlarged));
    if (figureZoom) figureZoom.textContent = enlarged ? 'Fit to window' : 'Larger view';
    if (figurePane) {
      figurePane.scrollLeft = 0; figurePane.scrollTop = 0;
      figurePane.setAttribute('aria-label', enlarged
        ? 'Enlarged figure. Scroll horizontally or vertically to inspect details.'
        : 'Figure overview. Use Larger view to inspect details.');
    }
  }
  document.querySelectorAll('.figure-expand').forEach(button => button.addEventListener('click', () => {
    const image = button.querySelector('img');
    const figure = button.closest('.blog-figure');
    if (!figureDialog || !figureImage || !image || !figure) return;
    figureOpener = button;
    figureTitle.textContent = `Fig. ${figure.id.replace('fig-', '')}`;
    const caption = figure.querySelector('figcaption')?.cloneNode(true);
    caption?.querySelectorAll('.katex-mathml').forEach(node => node.remove());
    figureCaption.textContent = caption?.textContent.trim() || '';
    figureImage.src = image.currentSrc || image.src;
    figureImage.alt = image.alt;
    setFigureZoom(matchMedia('(max-width: 650px)').matches);
    figureDialog.showModal();
    document.body.classList.add('figure-lightbox-open');
  }));
  figureZoom?.addEventListener('click', () => setFigureZoom(figureZoom.getAttribute('aria-pressed') !== 'true'));
  figureDialog?.querySelector('.figure-lightbox-close')?.addEventListener('click', () => figureDialog.close());
  figureDialog?.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...figureDialog.querySelectorAll('button, [tabindex="0"]')]
      .filter(element => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });
  figureDialog?.addEventListener('click', event => {
    const bounds = figureDialog.getBoundingClientRect();
    if (event.target === figureDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) figureDialog.close();
  });
  figureDialog?.addEventListener('close', () => {
    document.body.classList.remove('figure-lightbox-open');
    figureImage?.removeAttribute('src');
    figureOpener?.focus({ preventScroll: true });
    figureOpener = undefined;
  });
  function updatePosition() {
    document.body.classList.toggle('is-scrolled', scrollY > 135);
    let active = activeView === 'article' ? sections[0]?.id : undefined;
    if (activeView === 'article') for (const section of sections) { if (section.getBoundingClientRect().top <= innerHeight * .3) active = section.id; else break; }
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
  function showView(requestedView, push = false) {
    const view = Object.hasOwn(views, requestedView) ? requestedView : 'article';
    for (const [name, panel] of Object.entries(views)) panel.hidden = name !== view;
    publicationHeader.hidden = view === 'home';
    document.body.classList.toggle('is-home', view === 'home');
    document.body.classList.toggle('is-map', view === 'map');
    document.body.dataset.view = view;
    for (const link of viewLinks) {
      if (link.dataset.view === view) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    document.title = view === 'map' ? `Visual proof map — ${publicationTitle}` : view === 'home' ? 'Courtade–Kumar research notes' : publicationTitle;
    if (push && (view !== activeView || location.hash)) {
      const url = new URL(location.href); url.searchParams.set('view', view); url.hash = '';
      history.pushState(null, '', url);
    }
    activeView = view;
    scrollTo(0, 0); schedule();
  }
  viewLinks.forEach(link => link.addEventListener('click', event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); showView(link.dataset.view, true); }));
  document.querySelectorAll('[data-density]').forEach(button => { if (button.tagName !== 'BUTTON') return; button.addEventListener('click', () => { document.querySelector('.article-list').dataset.density = button.dataset.density; document.querySelectorAll('.density-controls button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }); });
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); }));
  function revealHash() {
    if (!location.hash) return;
    let target; try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!target || target.closest('[hidden]')) return;
    let parent = target.parentElement; while (parent) { if (parent.tagName === 'DETAILS') parent.open = true; parent = parent.parentElement; }
    requestAnimationFrame(() => target.scrollIntoView());
  }
  addEventListener('popstate', () => { showView(new URLSearchParams(location.search).get('view')); revealHash(); });
  addEventListener('hashchange', revealHash);
  addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule);
  addEventListener('beforeprint', () => { if (activeView === 'article') for (const p of passages) { p.dataset.printOpen = String(p.open); p.open = true; } });
  addEventListener('afterprint', () => { for (const p of passages) { if ('printOpen' in p.dataset) { p.open = p.dataset.printOpen === 'true'; delete p.dataset.printOpen; } } });
  document.fonts.ready.then(schedule); showView(new URLSearchParams(location.search).get('view')); updateButton(); revealHash();
})();
