/** Native dialog and progressive gallery controls; image links work without JavaScript. */
export function initCaseGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('.gallery-viewer');
  if (!dialog || dialog.dataset.ready) return;
  dialog.dataset.ready = 'true';
  const title = dialog.querySelector<HTMLElement>('#gallery-viewer-title')!;
  const count = dialog.querySelector<HTMLElement>('.viewer-count')!;
  const stage = dialog.querySelector<HTMLElement>('.viewer-stage')!;
  const status = dialog.querySelector<HTMLElement>('.viewer-status')!;
  const previous = dialog.querySelector<HTMLButtonElement>('[data-viewer-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-viewer-next]')!;
  const zoom = dialog.querySelector<HTMLButtonElement>('[data-viewer-zoom]')!;
  const original = dialog.querySelector<HTMLAnchorElement>('[data-viewer-original]')!;
  const selector = 'a[data-gallery-image],a.case-image,a.original-image,.presentation figure a';
  let items: HTMLAnchorElement[] = [], index = 0, trigger: HTMLAnchorElement | null = null;
  let scrollOverflow = '', request = 0;

  document.querySelectorAll<HTMLElement>('[data-filter-gallery]').forEach(gallery => {
    const cards = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-card]'));
    const filters = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-filter]'));
    const more = gallery.querySelector<HTMLButtonElement>('[data-gallery-more]')!;
    const tally = gallery.querySelector<HTMLElement>('[data-gallery-tally]')!;
    const initialLimit = Number(gallery.dataset.galleryLimit) || 8;
    let category = 'all', limit = initialLimit;
    const update = () => {
      const matching = cards.filter(card => category === 'all' || card.dataset.category === category);
      cards.forEach(card => { card.dataset.excluded = String(!matching.includes(card)); card.hidden = !matching.includes(card) || matching.indexOf(card) >= limit; });
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.galleryFilter === category)));
      tally.textContent = `${Math.min(limit,matching.length)} of ${matching.length} pieces`;
      more.hidden = matching.length <= limit;
      more.textContent = `Show ${Math.min(8,matching.length-limit)} more pieces +`;
      window.dispatchEvent(new Event('zinc-layout'));
    };
    gallery.querySelectorAll<HTMLElement>('[data-gallery-enhancement]').forEach(el => el.hidden = false);
    filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.galleryFilter!; limit = initialLimit; update(); }));
    more.addEventListener('click', () => {
      const firstNew = cards.filter(card => card.dataset.excluded !== 'true')[limit];
      limit += 8; update(); firstNew?.querySelector<HTMLAnchorElement>('a')?.focus({preventScroll:true});
    });
    update();
  });

  const resetZoom = () => { stage.classList.remove('is-zoomed'); stage.scrollTop = stage.scrollLeft = 0; zoom.setAttribute('aria-pressed','false'); zoom.textContent = 'Zoom in +'; };
  const show = () => {
    const item = items[index], source = item.querySelector('img');
    const label = source?.alt || item.getAttribute('aria-label') || 'Project image';
    const token = ++request;
    resetZoom(); title.textContent = label; count.textContent = `${index+1} / ${items.length}`;
    original.href = item.href; previous.disabled = index === 0; next.disabled = index === items.length-1;
    status.textContent = 'Loading image…'; zoom.disabled = true; stage.replaceChildren();
    const image = new Image(); image.alt = label;
    image.onload = () => {
      if (token !== request || !dialog.open) return;
      status.textContent = ''; zoom.disabled = false;
      stage.style.setProperty('--zoom-width', Math.max(image.naturalWidth,stage.clientWidth*1.6)+'px');
      stage.replaceChildren(image);
    };
    image.onerror = () => { if(token===request) status.textContent = 'This image could not load. Open the full image to try again.'; };
    image.src = item.href;
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest<HTMLAnchorElement>(selector);
    if (!anchor) return;
    event.preventDefault(); trigger = anchor;
    const group = anchor.closest('[data-gallery-group]') || anchor.closest('section') || document;
    items = Array.from(group.querySelectorAll<HTMLAnchorElement>(selector)).filter(a => a.closest<HTMLElement>('[data-gallery-card]')?.dataset.excluded !== 'true');
    index = items.indexOf(anchor);
    if(index < 0) { items=[anchor]; index=0; }
    scrollOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden'; dialog.showModal(); show();
    dialog.querySelector<HTMLButtonElement>('[data-viewer-close]')!.focus();
  });
  dialog.querySelector('[data-viewer-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { request++; document.documentElement.style.overflow = scrollOverflow; stage.replaceChildren(); trigger?.focus({preventScroll:true}); });
  previous.addEventListener('click', () => { if(index>0) { index--; show(); } });
  next.addEventListener('click', () => { if(index<items.length-1) { index++; show(); } });
  zoom.addEventListener('click', () => { const on = stage.classList.toggle('is-zoomed'); zoom.setAttribute('aria-pressed',String(on)); zoom.textContent=on?'Fit image −':'Zoom in +'; });
  dialog.addEventListener('keydown', event => {
    if(event.key==='ArrowLeft' && !stage.classList.contains('is-zoomed')) { event.preventDefault(); previous.click(); }
    if(event.key==='ArrowRight' && !stage.classList.contains('is-zoomed')) { event.preventDefault(); next.click(); }
    if(event.key==='Tab') {
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],[tabindex="0"]'));
      const first=focusable[0], last=focusable.at(-1);
      if(event.shiftKey && document.activeElement===first) {event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
    }
  });
}
