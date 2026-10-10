// shell.ts — runs on every page. Progressive enhancement only: all content is
// server-rendered; this adds theme toggling, cursor, progress, reveals,
// scroll pins (case opener / before-after / horizontal shots / parallax),
// magnetic buttons and screenshot tilt. Respects prefers-reduced-motion.
const q = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => matchMedia('(pointer:fine)').matches;
const NAV = 76;

export function initShell() {
  initTheme();
  initMobileMenu();
  initCursor();
  initMotion();
  initScroll();
  initTeamShuffle();
}

// The native modal makes the page behind it inert; wrap Tab inside the menu
// explicitly because Chrome can otherwise move focus into browser chrome.
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu') as HTMLDialogElement | null;
  if (!toggle || !menu) return;
  let closing = false;
  let closeTimer: ReturnType<typeof setTimeout>;
  const restore = () => {
    document.documentElement.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    delete menu.dataset.visible;
    closing = false;
  };
  const finish = () => {
    clearTimeout(closeTimer);
    menu.close();
    restore();
  };
  const close = () => {
    if (!menu.open || closing) return;
    closing = true;
    delete menu.dataset.visible;
    if (reduce()) finish(); else closeTimer = setTimeout(finish, 360);
  };
  toggle.addEventListener('click', () => {
    if (menu.open) return;
    menu.showModal();
    document.documentElement.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => { if (menu.open && !closing) menu.dataset.visible = 'true'; }));
  });
  menu.querySelector('[data-menu-close]')?.addEventListener('click', close);
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = q<HTMLElement>('a[href],button:not([disabled])', menu).filter(el => el.getClientRects().length > 0);
    const first = controls[0], last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  menu.addEventListener('cancel', event => { event.preventDefault(); close(); });
  menu.addEventListener('click', event => {
    if ((event.target as Element).closest('a')) { finish(); return; }
    if (event.target !== menu) return;
    const box = menu.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  });
  menu.addEventListener('close', restore);
  addEventListener('pagehide', () => { if (menu.open) finish(); });
  matchMedia('(max-width: 900px)').addEventListener('change', event => { if (!event.matches && menu.open) finish(); });
}

// ---- theme ----
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const label = btn?.querySelector<HTMLElement>('[data-theme-label]');
  const paint = () => { if (label) label.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light mode' : 'Dark mode'; };
  paint();
  btn?.addEventListener('click', () => {
    const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('zinc-theme', t); } catch {}
    paint();
    dispatchEvent(new CustomEvent('zinc-theme', { detail: t }));
  });
}

// ---- cursor ----
function initCursor() {
  const c = document.getElementById('zsCur');
  if (!c || !fine() || reduce()) return;
  let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
  const tick = () => { cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; c.style.left = cx + 'px'; c.style.top = cy + 'px'; raf = requestAnimationFrame(tick); };
  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY; if (!raf) tick(); c.classList.add('on');
    const el = e.target as Element;
    c.classList.toggle('big', !!el.closest?.('a,button,.chips li,.logo-c,.toc a,.person,.p-chip,summary,label'));
    c.classList.toggle('hide', !!el.closest?.('input,select,textarea'));
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => c.classList.remove('on'));
}

// ---- magnetic buttons + tilt ----
function initMotion() {
  if (!fine() || reduce()) return;
  q('.btn').forEach((b) => {
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - (r.left + r.width / 2)) * 0.18 + 'px,' + (e.clientY - (r.top + r.height / 2)) * 0.28 + 'px)'; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
  q('.p-frame, .p-shot, .shots, .uso-shot').forEach((w) => {
    const im = w.querySelector<HTMLElement>('.vp') || w.querySelector<HTMLElement>('.desk') || w.querySelector<HTMLElement>('img');
    if (!im) return;
    w.addEventListener('pointermove', (e) => { const r = w.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; im.style.transform = 'rotateY(' + px * 8 + 'deg) rotateX(' + -py * 8 + 'deg)'; });
    w.addEventListener('pointerleave', () => { im.style.transform = ''; });
  });
}

// ---- scroll: progress, reveal, pins, parallax ----
function initScroll() {
  const prog = document.getElementById('zsProg');
  const opener = document.getElementById('cOpen'), openImg = document.getElementById('cOpenImg'), openTxt = document.getElementById('cOpenTxt');
  const ba = document.getElementById('ba'), baStage = document.getElementById('baStage');
  const hz = document.getElementById('cHz'), hzTrack = document.getElementById('cHzTrack');
  const pars = q('[data-par]');
  // A keyboard user must never focus a link inside an unrevealed case panel.
  if (opener || document.querySelector('.ou-case')) document.addEventListener('focusin', (event) => {
    let element = event.target instanceof Element ? event.target : null;
    while (element) {
      if (element.matches('.rv,.rv-stag')) element.classList.add('in');
      element = element.parentElement;
    }
  });
  const noMotion = reduce();
  if (noMotion) { q('.rv,.rv-stag').forEach((el) => el.classList.add('in')); if (baStage) baStage.style.setProperty('--ba', '50%'); }

  const pin = (el: HTMLElement | null, fn: (p: number) => void) => {
    if (!el) return;
    const b = el.getBoundingClientRect(); const span = b.height - (innerHeight - NAV);
    if (span <= 0) return;
    const elapsed = NAV - b.top;
    // Scroll positions round to physical pixels; land fully on the last panel.
    fn(elapsed >= span - 1 ? 1 : Math.min(1, Math.max(0, elapsed / span)));
  };
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    if (prog) { const mx = document.documentElement.scrollHeight - vh; prog.style.transform = 'scaleX(' + (mx > 0 ? scrollY / mx : 0) + ')'; }
    if (noMotion) return;
    if (!opener?.classList.contains('c-open-app')) pin(opener, (p) => { if (openImg) openImg.style.transform = 'translateY(' + -p * 12 + '%) scale(' + (1 + p * 0.06) + ')'; if (openTxt) { openTxt.style.opacity = String(1 - Math.max(0, (p - 0.6) / 0.4)); openTxt.style.transform = 'translateY(' + -p * 48 + 'px)'; } });
    pin(ba, (p) => baStage?.style.setProperty('--ba', (100 - p * 100).toFixed(2) + '%'));
    pin(hz, (p) => { if (hzTrack) { const max = Math.max(0, hzTrack.scrollWidth - innerWidth); hzTrack.style.transform = 'translateX(' + -p * max + 'px)'; } });
    q('.rv:not(.in),.rv-stag:not(.in)').forEach((el) => { const b = el.getBoundingClientRect(); if (b.top < vh * 0.9 && b.bottom > 0 && b.left < innerWidth && b.right > 0) el.classList.add('in'); });
    pars.forEach((el) => { const s = parseFloat(el.dataset.par || '0'); const b = el.parentElement!.getBoundingClientRect(); const d = b.top + b.height / 2 - vh / 2; el.style.transform = 'translateY(' + -d * s + 'px)'; });
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  addEventListener('zinc-layout', request);
  update();
  // Anything already above the fold after fonts settle.
  setTimeout(() => q('.rv,.rv-stag').forEach((el) => { const b = el.getBoundingClientRect(); if (b.top < innerHeight && b.bottom > 0 && b.left < innerWidth && b.right > 0) el.classList.add('in'); }), 1400);
}

// ---- team: shuffle order on every visit (About + Home) ----
function initTeamShuffle() {
  q('[data-team]').forEach((grid) => {
    if (grid.contains(document.activeElement)) return;
    const cards = Array.from(grid.children);
    cards.sort(() => Math.random() - 0.5).forEach((c) => grid.append(c));
  });
}
