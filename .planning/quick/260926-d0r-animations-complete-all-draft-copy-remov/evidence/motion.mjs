#!/usr/bin/env node
// Evidence capture for quick task 260926-d0r Task 2. Real-browser frame
// sampler proving every sketch animation (.planning/sketches/001-a-plus-b-homepage/index.html)
// passes through an intermediate value under normal motion, and lands in its
// finished state under prefers-reduced-motion and with JavaScript disabled.
// Pattern copied from 260926-6g7's evidence/shoot.mjs (static server over
// dist, puppeteer-core with the local Chrome). Runs on port 4323 so it never
// collides with shoot.mjs (4322) or verify-mockup (4329).
import { createServer } from 'node:http';
import { writeFile, mkdir, copyFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../../');
const distDir = path.join(repoRoot, 'dist');
const scratchDir = path.join(repoRoot, '.scratch/260926-d0r/motion');
const port = 4323;
const base = 'http://127.0.0.1:' + port;
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

// A plain Node http.Server (not python's single-threaded http.server module,
// which was observed under puppeteer's concurrent keep-alive connections to
// intermittently 404 an otherwise-present file — sequential sampleHero /
// sampleLoop navigations on separate pages hit it directly during
// development of this script). Node's server handles concurrent connections
// natively, so it never exhibits that flake.
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(distDir, urlPath);
      let st = null;
      try {
        st = await stat(filePath);
      } catch {
        st = null;
      }
      if (st && st.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (!st && urlPath.endsWith('/')) {
        filePath = path.join(distDir, urlPath, 'index.html');
      }
      const data = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
  server.listen(port, '127.0.0.1');
  return server;
}

const HERO_LOOP_SIZES = [
  [1440, 900],
  [1280, 720],
  [390, 844],
];
const BAND_SIZE = [1440, 900];
const THREAD_ROUTES = ['/', '/blog/'];
const THREAD_SIZES = [[1440, 900], [390, 844]];

const HERO_DELAYS_MS = [0, 300, 700, 1000, 1200, 1500, 1900, 2600];
const BAND_ENTRY_TIMES_MS = [0, 200, 450, 800, 1500, 3000, 6000];

const failures = [];
function check(cond, msg) {
  if (!cond) failures.push(msg);
  return cond;
}

async function waitForServer(retries = 40) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(base + '/');
      if (res.ok || res.status === 404) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('local static server on ' + base + ' never became reachable');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function scaleXFromMatrix(transformStr) {
  if (!transformStr || transformStr === 'none') return 1;
  const m = transformStr.match(/matrix\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  return parts[0];
}

function translateYFromMatrix(transformStr) {
  if (!transformStr || transformStr === 'none') return 0;
  const m = transformStr.match(/matrix\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  return parts[5]; // ty component
}

async function newPage(browser, width, height, opts = {}) {
  const page = await browser.newPage();
  if (opts.reduce) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  } else {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  }
  if (opts.jsDisabled) {
    await page.setJavaScriptEnabled(false);
  }
  await page.setViewport({ width, height });
  return page;
}

async function elementClipScreenshot(page, selector, filePath) {
  const rect = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, selector);
  if (!rect || rect.width <= 0 || rect.height <= 0) return false;
  await page.screenshot({
    path: filePath,
    clip: { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: rect.width, height: rect.height },
  });
  return true;
}

// ---- A2/A3 hero strike + highlighter, and A1 hero kinetic word rise -------
async function sampleHero(browser, width, height) {
  const page = await newPage(browser, width, height);
  const t0 = Date.now();
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const samples = [];
  const sizeTag = width + 'x' + height;
  const frameFiles = {};
  for (const targetMs of HERO_DELAYS_MS) {
    const elapsed = Date.now() - t0;
    const wait = targetMs - elapsed;
    if (wait > 0) await sleep(wait);
    const state = await page.evaluate(() => {
      const hero = document.querySelector('[data-home-band="hero"]');
      const strike = document.querySelector('.mark-strike');
      const hit = document.querySelector('.mark-hit');
      const word = document.querySelector('.home-hero-title .w > i');
      const strikeCs = strike ? getComputedStyle(strike, '::after') : null;
      const hitCs = hit ? getComputedStyle(hit, '::before') : null;
      const wordCs = word ? getComputedStyle(word) : null;
      return {
        heroIn: hero ? hero.classList.contains('in') : null,
        htmlAnim: document.documentElement.classList.contains('anim'),
        strikeTransform: strikeCs ? strikeCs.transform : null,
        strikeOrigin: strikeCs ? strikeCs.transformOrigin : null,
        hitTransform: hitCs ? hitCs.transform : null,
        hitHeight: hitCs ? hitCs.height : null,
        wordTransform: wordCs ? wordCs.transform : null,
        kinCount: document.querySelectorAll('.home-hero-title .w > i').length,
      };
    });
    samples.push({ targetMs, actualMs: Date.now() - t0, ...state });
    if (targetMs === 300 || targetMs === 1500 || targetMs === 2600) {
      await mkdir(scratchDir, { recursive: true });
      const fname = path.join(scratchDir, `hero-${sizeTag}-${targetMs}ms.png`);
      await elementClipScreenshot(page, '.home-hero-title', fname);
      frameFiles[targetMs] = fname;
    }
  }
  await page.close();

  const strikeScales = samples.map((s) => scaleXFromMatrix(s.strikeTransform));
  const hitScales = samples.map((s) => scaleXFromMatrix(s.hitTransform));
  const wordTranslates = samples.map((s) => translateYFromMatrix(s.wordTransform));

  // Any strictly-between-0-and-1 sample proves progressive drawing rather
  // than an instant jump; the threshold is intentionally loose (0.001, not
  // 0.02) because a fixed 8-timestamp schedule can land close to either end
  // of a cubic-bezier curve depending on the mark's own transition-delay —
  // a real intermediate value of 0.0187 is still proof of drawing, not noise.
  const strikeIntermediate = strikeScales.some((v) => v !== null && v > 0.001 && v < 0.999);
  const strikeFinal = strikeScales[strikeScales.length - 1];
  const hitIntermediate = hitScales.some((v) => v !== null && v > 0.001 && v < 0.999);
  const hitFinal = hitScales[hitScales.length - 1];
  const wordIntermediate = wordTranslates.some((v) => v !== null && v > 1);
  const wordFinal = wordTranslates[wordTranslates.length - 1];

  check(check_(samples[0], 'kinCount') > 0, `[${sizeTag}] hero kinetic word wrap did not produce .w > i spans`);
  check(strikeIntermediate, `[${sizeTag}] A2 hero strike never passed through an intermediate scaleX (samples: ${JSON.stringify(strikeScales)})`);
  check(strikeFinal !== null && strikeFinal > 0.98, `[${sizeTag}] A2 hero strike did not finish drawn (final scaleX ${strikeFinal})`);
  check(hitIntermediate, `[${sizeTag}] A3 hero highlighter never passed through an intermediate scaleX (samples: ${JSON.stringify(hitScales)})`);
  check(hitFinal !== null && hitFinal > 0.98, `[${sizeTag}] A3 hero highlighter did not finish drawn (final scaleX ${hitFinal})`);
  check(wordIntermediate, `[${sizeTag}] A1 hero kinetic word rise never passed through an intermediate translateY (samples: ${JSON.stringify(wordTranslates)})`);
  check(wordFinal !== null && Math.abs(wordFinal) < 1, `[${sizeTag}] A1 hero kinetic word did not finish risen (final translateY ${wordFinal})`);

  return { sizeTag, samples, frameFiles, strikeScales, hitScales, wordTranslates };
}
function check_(obj, key) {
  return obj[key];
}

// ---- A4 the Loop ------------------------------------------------------------
async function sampleLoop(browser, width, height) {
  const page = await newPage(browser, width, height);
  const sizeTag = width + 'x' + height;
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await sleep(150);

  const totalLen = await page.evaluate(() => {
    const path = document.getElementById('loop-path');
    return path ? parseFloat(path.style.strokeDasharray) : null;
  });

  const bandInfo = await page.evaluate(() => {
    const band = document.querySelector('[data-home-band="loop"]');
    const rect = band.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: band.offsetHeight, innerHeight: window.innerHeight };
  });
  const { top, height: bandHeight, innerHeight } = bandInfo;
  const scrollStart = Math.max(0, top - innerHeight);
  const scrollEnd = top + bandHeight;
  const N = 9;
  const samples = [];
  const frameFiles = {};
  for (let i = 0; i < N; i++) {
    const y = scrollStart + ((scrollEnd - scrollStart) * i) / (N - 1);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    // allow the rAF-throttled onScroll handler to run
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    );
    const state = await page.evaluate(() => {
      const p = document.getElementById('loop-path');
      const pulse = document.getElementById('pulse');
      const layers = Array.from(document.querySelectorAll('.home-layer'));
      const nodes = Array.from(document.querySelectorAll('.home-loop-svg .node'));
      const pct = document.getElementById('loop-pct');
      const stage = document.querySelector('.home-loop-sticky');
      return {
        dashoffset: p ? parseFloat(p.style.strokeDashoffset) : null,
        pulse: pulse ? { cx: pulse.getAttribute('cx'), cy: pulse.getAttribute('cy') } : null,
        activeLayer: layers.findIndex((l) => l.classList.contains('on')),
        onLayerCount: layers.filter((l) => l.classList.contains('on')).length,
        onNodeCount: nodes.filter((n) => n.classList.contains('on')).length,
        pctText: pct ? pct.textContent : null,
        pinned: stage ? getComputedStyle(stage).position === 'sticky' : null,
      };
    });
    samples.push({ i, y, ...state });
    if (i === 0 || i === Math.floor(N / 2) || i === N - 1) {
      await mkdir(scratchDir, { recursive: true });
      const fname = path.join(scratchDir, `loop-${sizeTag}-step${i}.png`);
      await page.screenshot({ path: fname });
      frameFiles[i] = fname;
    }
  }
  await page.close();

  const dashoffsets = samples.map((s) => s.dashoffset).filter((v) => v !== null);
  const distinctBelowFull = new Set(dashoffsets.filter((v) => v > 0.5 && v < totalLen - 0.5).map((v) => Math.round(v)));
  const finalOffset = dashoffsets[dashoffsets.length - 1];
  const pulses = samples.map((s) => s.pulse && `${s.pulse.cx},${s.pulse.cy}`);
  const distinctPulsePositions = new Set(pulses.filter(Boolean));
  const activeLayers = samples.map((s) => s.activeLayer);

  check(
    distinctBelowFull.size >= 2,
    `[${sizeTag}] A4 Loop stroke-dashoffset never showed at least two distinct values below the full length ${totalLen} (samples: ${JSON.stringify(dashoffsets)})`
  );
  check(
    finalOffset !== undefined && finalOffset < 1,
    `[${sizeTag}] A4 Loop did not finish fully drawn (final dashoffset ${finalOffset}, length ${totalLen})`
  );
  check(
    distinctPulsePositions.size >= 2,
    `[${sizeTag}] A4 Loop pulse never moved across samples (positions: ${JSON.stringify([...pulses])})`
  );
  check(
    activeLayers[activeLayers.length - 1] === 2,
    `[${sizeTag}] A4 Loop's final active layer was not Intelligence (index 2); got ${activeLayers[activeLayers.length - 1]} (sequence: ${JSON.stringify(activeLayers)})`
  );
  check(
    new Set(activeLayers).size >= 2,
    `[${sizeTag}] A4 Loop's active layer never changed across the scroll sequence (sequence: ${JSON.stringify(activeLayers)})`
  );

  return { sizeTag, totalLen, samples, frameFiles, pinnedAtStart: samples[0].pinned, pinnedAtMid: samples[Math.floor(N / 2)].pinned };
}

// ---- A5 logo wall, A6 U.S. Oil stamps, A7 how-we-work typing, A8 team -----
async function sampleBands(browser, width, height) {
  const page = await newPage(browser, width, height);
  const sizeTag = width + 'x' + height;
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });

  // Scroll each band into view in document order so each band's own
  // IntersectionObserver trigger fires, then sample on the schedule.
  const bandSelectors = ['[data-home-band="clients"]', '[data-home-band="us-oil-solutions"]', '[data-home-band="commitments"]', '[data-home-band="team"]'];
  for (const sel of bandSelectors) {
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (el) el.scrollIntoView({ block: 'center' });
    }, sel);
    await sleep(50);
  }
  // Scroll back to top of the band group so the entry timestamps below are
  // consistent across all four (they've all been observed by now).
  const startRef = Date.now();
  const timeline = [];
  for (const targetMs of BAND_ENTRY_TIMES_MS) {
    const elapsed = Date.now() - startRef;
    const wait = targetMs - elapsed;
    if (wait > 0) await sleep(wait);
    const state = await page.evaluate(() => {
      const flipCells = document.querySelectorAll('.home-logo-cell.flip').length;
      const stampsIn = document.querySelectorAll('.home-stamp.in').length;
      const stampsTotal = document.querySelectorAll('.home-stamp').length;
      const typed = Array.from(document.querySelectorAll('.home-commit-typed')).map((el) => (el.textContent || '').length);
      const typedTotal = Array.from(document.querySelectorAll('.home-commit-typed')).map((el) => (el.dataset.text || '').length);
      const lockedCount = document.querySelectorAll('.home-commit li.locked').length;
      const shuffling = document.querySelectorAll('[data-team] > *.shuffling').length;
      return { flipCells, stampsIn, stampsTotal, typed, typedTotal, lockedCount, shuffling };
    });
    timeline.push({ targetMs, ...state });
  }
  await page.close();

  const anyFlip = timeline.some((t) => t.flipCells > 0);
  const stampCounts = timeline.map((t) => t.stampsIn);
  const stampsTotal = timeline[0].stampsTotal;
  const stampIntermediate = stampCounts.some((c) => c > 0 && c < stampsTotal);
  const stampFinal = stampCounts[stampCounts.length - 1];
  const typedFinal = timeline[timeline.length - 1].typed;
  const typedTotalFinal = timeline[timeline.length - 1].typedTotal;
  const typedIntermediate = timeline.some((t) => t.typed.some((len, i) => len > 0 && len < (t.typedTotal[i] || Infinity)));
  const lockedFinal = timeline[timeline.length - 1].lockedCount;
  const anyShuffling = timeline.some((t) => t.shuffling > 0);

  check(anyFlip, `[${sizeTag}] A5 logo wall never showed a .flip cell (timeline: ${JSON.stringify(timeline.map((t) => t.flipCells))})`);
  check(stampIntermediate, `[${sizeTag}] A6 U.S. Oil stamps never showed a partial .in count (timeline: ${JSON.stringify(stampCounts)}, total ${stampsTotal})`);
  check(stampFinal === stampsTotal, `[${sizeTag}] A6 U.S. Oil stamps did not all finish .in (final ${stampFinal}/${stampsTotal})`);
  check(typedIntermediate, `[${sizeTag}] A7 how-we-work typed text never showed a partial length (timeline: ${JSON.stringify(timeline.map((t) => t.typed))})`);
  check(
    typedFinal.every((len, i) => len === typedTotalFinal[i]),
    `[${sizeTag}] A7 how-we-work typed text did not finish full (final ${JSON.stringify(typedFinal)} vs ${JSON.stringify(typedTotalFinal)})`
  );
  check(lockedFinal === typedFinal.length, `[${sizeTag}] A7 how-we-work lines did not all lock (final locked ${lockedFinal}/${typedFinal.length})`);
  check(anyShuffling, `[${sizeTag}] A8 team shuffle never observed a .shuffling card (timeline: ${JSON.stringify(timeline.map((t) => t.shuffling))})`);

  return { sizeTag, timeline };
}

// ---- A9 circuit thread dot --------------------------------------------------
async function sampleThread(browser, route, width, height) {
  const page = await newPage(browser, width, height);
  const sizeTag = width + 'x' + height;
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await sleep(150);

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const positions = [0, 0.5, 1];
  const results = [];
  for (const frac of positions) {
    await page.evaluate((f, sh) => window.scrollTo(0, Math.round((sh - window.innerHeight) * f)), frac, scrollHeight);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const state = await page.evaluate(() => {
      const dot = document.getElementById('thread-dot');
      if (!dot) return null;
      const r = dot.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, cssTop: getComputedStyle(dot).top };
    });
    results.push({ frac, ...state });
  }
  await page.close();

  const inViewport = results.every((r) => r && r.top >= -1 && r.bottom <= height + 1);
  const distinctTops = new Set(results.map((r) => r && Math.round(r.top)));
  check(inViewport, `[${route} ${sizeTag}] A9 thread dot left the viewport at some scroll position (results: ${JSON.stringify(results)})`);
  check(distinctTops.size >= 2, `[${route} ${sizeTag}] A9 thread dot never moved across scroll positions (results: ${JSON.stringify(results)})`);

  return { route, sizeTag, results };
}

// ---- reduced-motion finished-state pass ------------------------------------
async function sampleReducedMotion(browser) {
  const [width, height] = BAND_SIZE;
  const page = await newPage(browser, width, height, { reduce: true });
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  await sleep(300);

  const state = await page.evaluate(() => {
    const strike = document.querySelector('.mark-strike');
    const hit = document.querySelector('.mark-hit');
    const strikeCs = strike ? getComputedStyle(strike, '::after') : null;
    const hitCs = hit ? getComputedStyle(hit, '::before') : null;
    const stamps = Array.from(document.querySelectorAll('.home-stamp'));
    const stampsOk = stamps.every((s) => {
      const cs = getComputedStyle(s);
      return parseFloat(cs.opacity) >= 0.99 && cs.transform === 'none';
    });
    const typed = Array.from(document.querySelectorAll('.home-commit-typed'));
    const typedOk = typed.every((el) => el.textContent === (el.getAttribute('data-text') || ''));
    const lockedOk = document.querySelectorAll('.home-commit li.locked').length === typed.length;
    const path = document.getElementById('loop-path');
    const dashoffset = path ? parseFloat(path.style.strokeDashoffset || '0') : null;
    const layers = Array.from(document.querySelectorAll('.home-layer'));
    const layersVisible = layers.every((l) => {
      const r = l.getBoundingClientRect();
      return r.width > 0;
    });
    const teamCards = Array.from(document.querySelectorAll('[data-team] > *'));
    const teamVisible = teamCards.every((c) => {
      const cs = getComputedStyle(c);
      return parseFloat(cs.opacity) >= 0.99;
    });
    return {
      htmlAnim: document.documentElement.classList.contains('anim'),
      strikeTransform: strikeCs ? strikeCs.transform : null,
      hitTransform: hitCs ? hitCs.transform : null,
      hitHeight: hitCs ? hitCs.height : null,
      stampsOk,
      typedOk,
      lockedOk,
      dashoffset,
      layersVisible,
      teamVisible,
    };
  });
  await page.close();

  const strikeScale = scaleXFromMatrix(state.strikeTransform);
  const hitScale = scaleXFromMatrix(state.hitTransform);

  check(!state.htmlAnim, `[reduced-motion] html unexpectedly carries the anim class`);
  check(strikeScale !== null && strikeScale > 0.98, `[reduced-motion] hero strike is not fully drawn (scaleX ${strikeScale})`);
  check(hitScale !== null && hitScale > 0.98, `[reduced-motion] hero highlighter is not fully drawn (scaleX ${hitScale})`);
  check(state.stampsOk, `[reduced-motion] U.S. Oil stamps are not all fully visible with no transform`);
  check(state.typedOk, `[reduced-motion] how-we-work lines are not showing full text immediately`);
  check(state.lockedOk, `[reduced-motion] how-we-work lines are not all locked`);
  check(state.dashoffset !== null && state.dashoffset < 1, `[reduced-motion] Loop path is not fully drawn (dashoffset ${state.dashoffset})`);
  check(state.layersVisible, `[reduced-motion] a Loop layer is not visible`);
  check(state.teamVisible, `[reduced-motion] a team card is not fully visible`);

  return state;
}

// ---- JavaScript-disabled finished-state pass --------------------------------
async function sampleNoJs(browser) {
  const [width, height] = BAND_SIZE;
  const page = await newPage(browser, width, height, { jsDisabled: true });
  await page.goto(base + '/', { waitUntil: 'load' });

  const state = await page.evaluate(() => {
    const strike = document.querySelector('.mark-strike');
    const hit = document.querySelector('.mark-hit');
    const strikeCs = strike ? getComputedStyle(strike, '::after') : null;
    const hitCs = hit ? getComputedStyle(hit, '::before') : null;
    const layers = Array.from(document.querySelectorAll('.home-layer'));
    const layersOn = layers.every((l) => l.classList.contains('on'));
    const layersVisible = layers.every((l) => l.getBoundingClientRect().width > 0);
    const serviceLinks = Array.from(document.querySelectorAll('.home-layer-list a'));
    const linksVisible = serviceLinks.length > 0 && serviceLinks.every((el) => el.getBoundingClientRect().width > 0);
    const typed = Array.from(document.querySelectorAll('.home-commit-typed'));
    const typedFull = typed.every((el) => (el.textContent || '').trim().length > 0);
    const lockedOk = document.querySelectorAll('.home-commit li.locked').length === typed.length;
    const stamps = Array.from(document.querySelectorAll('.home-stamp'));
    const stampsVisible = stamps.every((s) => s.getBoundingClientRect().width > 0);
    const htmlAnim = document.documentElement.classList.contains('anim');
    const kinWrapped = document.querySelectorAll('.home-hero-title .w > i').length > 0;
    return { layersOn, layersVisible, linksVisible, typedFull, lockedOk, stampsVisible, htmlAnim, kinWrapped, strikeTransform: strikeCs ? strikeCs.transform : null, hitTransform: hitCs ? hitCs.transform : null };
  });
  await page.close();

  const strikeScale = scaleXFromMatrix(state.strikeTransform);
  const hitScale = scaleXFromMatrix(state.hitTransform);

  check(!state.htmlAnim, `[no-js] html unexpectedly carries the anim class`);
  check(!state.kinWrapped, `[no-js] hero words were wrapped without JS running`);
  check(strikeScale !== null && strikeScale > 0.98, `[no-js] hero strike is not fully drawn without JS (scaleX ${strikeScale})`);
  check(hitScale !== null && hitScale > 0.98, `[no-js] hero highlighter is not fully drawn without JS (scaleX ${hitScale})`);
  check(state.layersOn, `[no-js] not every Loop layer is server-rendered .on`);
  check(state.layersVisible, `[no-js] a Loop layer is not visible without JS`);
  check(state.linksVisible, `[no-js] Loop layer service links are not visible without JS`);
  check(state.typedFull, `[no-js] a how-we-work line is not showing its full text without JS`);
  check(state.lockedOk, `[no-js] how-we-work lines are not all locked without JS`);
  check(state.stampsVisible, `[no-js] a U.S. Oil stamp is not visible without JS`);

  return state;
}

async function main() {
  await mkdir(scratchDir, { recursive: true });
  const evidenceDir = here;
  const server = startServer();
  let browser;
  const results = {
    generatedAt: new Date().toISOString(),
    hero: [],
    loop: [],
    bands: [],
    thread: [],
    reducedMotion: null,
    noJs: null,
  };

  try {
    await waitForServer();
    const { default: puppeteer } = await import('puppeteer-core');
    browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });

    for (const [w, h] of HERO_LOOP_SIZES) {
      results.hero.push(await sampleHero(browser, w, h));
      results.loop.push(await sampleLoop(browser, w, h));
    }

    results.bands.push(await sampleBands(browser, BAND_SIZE[0], BAND_SIZE[1]));

    for (const route of THREAD_ROUTES) {
      for (const [w, h] of THREAD_SIZES) {
        results.thread.push(await sampleThread(browser, route, w, h));
      }
    }

    results.reducedMotion = await sampleReducedMotion(browser);
    results.noJs = await sampleNoJs(browser);

    // Copy canonical early/mid/final frames for A2/A3 (hero) and A4 (Loop)
    // at the primary desktop size into the evidence folder.
    const heroPrimary = results.hero.find((h) => h.sizeTag === '1440x900');
    if (heroPrimary) {
      const order = [300, 1500, 2600];
      const labels = ['early', 'mid', 'final'];
      for (let i = 0; i < order.length; i++) {
        const src = heroPrimary.frameFiles[order[i]];
        if (src) await copyFile(src, path.join(evidenceDir, `hero-${labels[i]}.png`));
      }
    }
    const loopPrimary = results.loop.find((l) => l.sizeTag === '1440x900');
    if (loopPrimary) {
      const keys = Object.keys(loopPrimary.frameFiles).map(Number).sort((a, b) => a - b);
      const labels = ['early', 'mid', 'final'];
      for (let i = 0; i < keys.length; i++) {
        const src = loopPrimary.frameFiles[keys[i]];
        if (src) await copyFile(src, path.join(evidenceDir, `loop-${labels[i]}.png`));
      }
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  results.failures = failures;
  await writeFile(
    path.join(evidenceDir, 'motion-results.json'),
    JSON.stringify(results, null, 2)
  );

  if (failures.length > 0) {
    console.error('MOTION SAMPLER: ' + failures.length + ' failure(s):');
    failures.forEach((f) => console.error('  - ' + f));
    process.exitCode = 1;
  } else {
    console.log('MOTION SAMPLER: all animations passed through intermediate frames and finished correctly.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
