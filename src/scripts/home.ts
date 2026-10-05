// home.ts — homepage motion (hero reveal/fade, loop draw, layer scroller,
// U.S. Oil horizontal track). Shell handles cursor, progress, reveals, parallax.
const q = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
const LOOP_STATUS = ['Build · the machine the customer touches', 'Demand · traffic into it', "Intelligence · the truth about what's working", 'Intelligence feeds Build · the loop closes'];

export function initHome() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.getElementById('hero');
  if (reduce) { hero?.classList.add('in'); q('.commit li, .stamp').forEach((el) => el.classList.add('in')); return; }
  setTimeout(() => hero?.classList.add('in'), 120);

  const heroIn = document.getElementById('heroIn');
  const loop = document.getElementById('loop'), draw = document.getElementById('loopDraw'), pulse = document.getElementById('loopPulse'), status = document.getElementById('loopStatus');
  const hz = document.getElementById('hz'), hzTrack = document.getElementById('hzTrack'), hzDots = q('#hzDots i');
  const uso = document.getElementById('uso'), track = document.getElementById('usoTrack'), prog = document.getElementById('usoProg');
  const layersEls = q('.layer'), nodes = q('.circ .node');
  let lastIdx = -1, ticking = false;

  const update = () => {
    ticking = false;
    const vh = innerHeight, wide = innerWidth > 900;
    if (heroIn) { const p = Math.max(0, Math.min(1, scrollY / (vh * 0.7))); heroIn.style.opacity = String(1 - p * 0.9); heroIn.style.transform = 'translateY(' + p * 50 + 'px) scale(' + (1 - p * 0.06) + ')'; }
    q('.commit li:not(.in)').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh * 0.88 && r.bottom > 0) el.classList.add('in'); });
    if (loop && draw && pulse && wide) {
      const r = loop.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
      draw.setAttribute('stroke-dashoffset', String(1 - p));
      const a = ((-90 + 360 * p) * Math.PI) / 180;
      pulse.setAttribute('cx', String(200 + 150 * Math.cos(a)));
      pulse.setAttribute('cy', String(200 + 150 * Math.sin(a)));
      const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      const key = p > 0.97 ? 3 : idx;
      if (key !== lastIdx) {
        lastIdx = key;
        layersEls.forEach((el, i) => el.classList.toggle('on', i === idx));
        nodes.forEach((el, i) => el.classList.toggle('on', i <= idx));
        if (status) status.textContent = LOOP_STATUS[key];
      }
    }
    if (hz && hzTrack && wide) {
      const r = hz.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
      hzTrack.style.transform = 'translateX(' + -p * (hzTrack.children.length - 1) * innerWidth + 'px)';
      const di = Math.round(p * (hzTrack.children.length - 1));
      hzDots.forEach((d, i) => d.classList.toggle('on', i === di));
    }
    if (uso && track && wide) {
      const r = uso.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
      track.style.transform = 'translateX(' + -p * (track.scrollWidth - innerWidth) + 'px)';
      if (prog) prog.style.transform = 'scaleX(' + p + ')';
      q('.stamp').forEach((el) => { if (el.getBoundingClientRect().left < innerWidth * 0.85) el.classList.add('in'); });
    } else if (!wide) q('.stamp').forEach((el) => el.classList.add('in'));
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  update();
}
