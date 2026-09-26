#!/usr/bin/env node
// Evidence capture for quick task 260926-d0r Task 3 (full responsive review).
// Copied from 260926-6g7's evidence/shoot.mjs and extended: 16 routes x the
// owner's 9 sizes, motion allowed by default (settled, not mid-animation),
// plus a reduced-motion pass on / at three sizes. Serves the built dist/ over
// a throwaway local static server on a port distinct from 6g7's shoot.mjs
// (4322), motion.mjs (4323) and verify-mockup.mjs (4329).
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../../');
const distDir = path.join(repoRoot, 'dist');
const scratchDir = path.join(repoRoot, '.scratch/260926-d0r/responsive');
const sheetsDir = path.join(here, 'sheets');
const port = 4324;
const base = 'http://127.0.0.1:' + port;

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Owner-named routes (2026-09-26), confirmed against `find dist -name index.html`.
const ROUTES = [
  { slug: 'home', route: '/' },
  { slug: 'services-index', route: '/services/' },
  { slug: 'service-shopify', route: '/services/shopify/' },
  { slug: 'work-index', route: '/work/' },
  { slug: 'case-ouabc', route: '/work/once-upon-a-book-club/' },
  { slug: 'case-usoil', route: '/work/us-oil-solutions/' },
  { slug: 'about', route: '/about/' },
  { slug: 'contact', route: '/contact/' },
  { slug: 'thanks', route: '/thanks/' },
  { slug: 'blog-index', route: '/blog/' },
  { slug: 'article-genai', route: '/blog/ai-search-results-and-generative-search-optimization/' },
  { slug: 'article-merchant-center', route: '/blog/shopify-google-merchant-center-checklist/' },
  { slug: 'article-shortest', route: '/blog/when-web-design-trends-actually-matter/' },
  { slug: 'privacy', route: '/privacy/' },
  { slug: 'terms', route: '/terms/' },
  { slug: '404', route: '/404.html' },
];

// Owner's nine sizes (2026-09-26 verbatim: "review all areas in
// responsiveness"), each with the deviceScaleFactor a real device at that
// size would report.
const SIZES = [
  { label: '1920x1080', width: 1920, height: 1080, dsf: 1 },
  { label: '1780x920', width: 1780, height: 920, dsf: 1 },
  { label: '1440x900', width: 1440, height: 900, dsf: 1 },
  { label: '1280x720', width: 1280, height: 720, dsf: 1 },
  { label: '1024x768', width: 1024, height: 768, dsf: 1 },
  { label: '768x1024', width: 768, height: 1024, dsf: 2 },
  { label: '390x844', width: 390, height: 844, dsf: 3 },
  { label: '375x667', width: 375, height: 667, dsf: 2 },
  { label: '667x375', width: 667, height: 375, dsf: 2 },
];

const PHONE_LABELS = new Set(['390x844', '375x667', '667x375']);

function startServer() {
  return spawn('python3', ['-m', 'http.server', String(port), '--directory', distDir], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
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

// Scroll the full page through in steps (gives native loading="lazy" images
// their scroll signal) and let every home-page motion sequence settle before
// any screenshot or metric is taken — the owner's brief calls for "normal
// motion (after animations settle)", not a mid-animation snapshot.
async function settle(page, { isHome }) {
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = 14;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((scrollHeight * i) / steps));
    await new Promise((r) => setTimeout(r, 90));
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  try {
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('img')).every((img) => img.complete),
      { timeout: 8000 }
    );
  } catch {
    // recorded per-image below
  }

  if (isHome) {
    try {
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('.typed')).every((el) => el.textContent === el.getAttribute('data-text')),
        { timeout: 8000 }
      );
    } catch {
      /* fall through */
    }
    try {
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('.home-stamp')).every((el) => el.classList.contains('in')),
        { timeout: 4000 }
      );
    } catch {
      /* fall through */
    }
    try {
      await page.waitForFunction(
        () => {
          const grid = document.querySelector('[data-team]');
          return !grid || Array.from(grid.children).every((el) => !el.classList.contains('shuffling'));
        },
        { timeout: 4000 }
      );
    } catch {
      /* fall through */
    }
    try {
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('.kin')).every((el) => el.classList.contains('in')),
        { timeout: 4000 }
      );
    } catch {
      /* fall through */
    }
    // Scroll back through once more so the Loop's scroll-driven draw and the
    // circuit-thread dot both settle at the bottom-of-page position before
    // we read the "bottom" thread-dot sample; then return to top.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 150));
  }
}

// One big in-page metrics collector. Runs after `settle()`, at scroll top.
/* eslint-disable no-undef */
function collectMetrics(opts) {
  const { isHome, isPhone } = opts;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const violations = [];

  function isSkippable(el) {
    if (el.id === 'thread' || el.id === 'thread-dot') return true;
    if (el.closest('#thread, #thread-dot')) return true;
    if (el.classList.contains('skip-link')) return true;
    return false;
  }

  // ---- 1. horizontal overflow -------------------------------------------
  const scrollWidth = document.documentElement.scrollWidth;
  const horizontalOverflow = scrollWidth > vw + 1;
  if (horizontalOverflow) violations.push('horizontal overflow: scrollWidth ' + scrollWidth + ' > viewport ' + vw);

  // ---- 2. elements extending past the left/right viewport edge ----------
  // Only the outermost offender is reported (skip an element whose parent
  // already overflows the same side) to avoid reporting every ancestor of a
  // genuinely broken element. Thread/dot excluded per plan.
  const overflowEls = [];
  const all = Array.from(document.querySelectorAll('body *'));
  for (const el of all) {
    if (isSkippable(el)) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    const overRight = rect.right > vw + 1;
    const overLeft = rect.left < -1;
    if (!overRight && !overLeft) continue;
    const parent = el.parentElement;
    if (parent) {
      const pr = parent.getBoundingClientRect();
      const parentOverRight = pr.right > vw + 1;
      const parentOverLeft = pr.left < -1;
      if ((overRight && parentOverRight) || (overLeft && parentOverLeft)) continue;
    }
    overflowEls.push({
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 60),
      text: (el.textContent || '').trim().slice(0, 40),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
    });
  }
  if (overflowEls.length) {
    violations.push('element(s) extending past viewport edge: ' + JSON.stringify(overflowEls.slice(0, 8)));
  }

  // ---- 3. clipped text ----------------------------------------------------
  const clipped = [];
  for (const el of document.querySelectorAll('body *')) {
    if (isSkippable(el)) continue;
    if (el.closest('.kin')) continue; // word masks at rest, excluded by plan
    const style = getComputedStyle(el);
    // NOTE: `text-overflow`'s initial value is itself "clip" per spec — it is
    // not a signal that the box is actually clipping anything, only that IF
    // overflow is hidden, no ellipsis is used. Only `overflow`/`overflow-x`/
    // `overflow-y` computing to hidden or clip is a real clip boundary.
    const overflowsHidden = style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden' || style.overflow === 'clip';
    if (!overflowsHidden) continue;
    const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (!hasOwnText) continue;
    // +2px tolerance on height: some fonts report scrollHeight 1-2px above
    // clientHeight/line-height from internal ascent/descent metrics alone,
    // with nothing visibly cut off. Width has no such quirk, so it keeps the
    // tighter +1px tolerance.
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2) {
      clipped.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 60),
        text: (el.textContent || '').trim().slice(0, 40),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      });
    }
  }
  if (clipped.length) violations.push('clipped text: ' + JSON.stringify(clipped.slice(0, 8)));

  // ---- 4. overlap between in-flow siblings inside layout containers ------
  // Absolutely/fixed-positioned children are intentionally out of flow
  // (e.g. the OUABC phone mockup over the desktop shot, the pinned Loop
  // head) and are excluded — overlap there is by design, not a bug.
  const overlaps = [];
  const containers = new Set(document.querySelectorAll('.band__inner'));
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'grid' || style.display === 'inline-grid' || style.display === 'flex' || style.display === 'inline-flex') {
      containers.add(el);
    }
  }
  for (const container of containers) {
    if (isSkippable(container)) continue;
    const children = Array.from(container.children).filter((c) => {
      if (isSkippable(c)) return false;
      const s = getComputedStyle(c);
      if (s.display === 'none' || s.visibility === 'hidden') return false;
      if (s.position === 'absolute' || s.position === 'fixed') return false;
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    for (let i = 0; i < children.length; i++) {
      for (let j = i + 1; j < children.length; j++) {
        const a = children[i].getBoundingClientRect();
        const b = children[j].getBoundingClientRect();
        const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (ix > 2 && iy > 2) {
          overlaps.push({
            container: (container.className || container.tagName).toString().slice(0, 40),
            a: children[i].tagName + '.' + (children[i].className || '').toString().slice(0, 30),
            b: children[j].tagName + '.' + (children[j].className || '').toString().slice(0, 30),
            overlapPx: Math.round(ix) + 'x' + Math.round(iy),
          });
        }
      }
    }
  }
  if (overlaps.length) violations.push('sibling overlap: ' + JSON.stringify(overlaps.slice(0, 8)));

  // ---- 5. tap targets under 44x44 -----------------------------------------
  const tapViolations = [];
  for (const el of document.querySelectorAll('a, button, summary, input, select, label')) {
    if (el.closest('.prose')) continue; // running-text links excluded
    if (isSkippable(el)) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    if (rect.width < 44 || rect.height < 44) {
      tapViolations.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 40),
        text: (el.textContent || '').trim().slice(0, 30),
        w: Math.round(rect.width * 10) / 10,
        h: Math.round(rect.height * 10) / 10,
      });
    }
  }
  if (tapViolations.length) violations.push('tap target(s) under 44x44: ' + JSON.stringify(tapViolations.slice(0, 10)));

  // ---- 6. text size ---------------------------------------------------------
  const textSizeViolations = [];
  for (const el of document.querySelectorAll('p, li, h1, h2, h3, h4, span, a, dd, dt, figcaption, label')) {
    if (!(el.textContent || '').trim()) continue;
    const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (!hasOwnText) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const size = parseFloat(style.fontSize);
    // The design system's own caption/label/marker roles (.t-label/.label,
    // .draft-tag/.draft, .draft-notice, .receipt — all mono, all sized well
    // under body copy at every breakpoint on purpose) are intentional
    // micro-caption styles, not "paragraph or list copy" in the owner's
    // sense. The absolute 12px floor still applies to them; only the
    // phone-specific 15px paragraph/list floor excludes them.
    const captionSelector = '.t-label, .label, .draft-tag, .draft, .draft-notice, .receipt';
    const isCaptionRole = el.matches(captionSelector) || el.closest(captionSelector);
    if (size < 12) {
      textSizeViolations.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 30), text: (el.textContent || '').trim().slice(0, 30), px: size, rule: 'under-12' });
    } else if (isPhone && size < 15 && (el.tagName === 'P' || el.tagName === 'LI') && !isCaptionRole) {
      textSizeViolations.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 30), text: (el.textContent || '').trim().slice(0, 30), px: size, rule: 'phone-body-under-15' });
    }
  }
  if (textSizeViolations.length) violations.push('undersized text: ' + JSON.stringify(textSizeViolations.slice(0, 10)));

  // ---- 7. image density ----------------------------------------------------
  const dpr = window.devicePixelRatio || 1;
  const imageViolations = [];
  for (const img of document.querySelectorAll('img')) {
    const style = getComputedStyle(img);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (!img.complete || img.naturalWidth === 0) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width <= 0) continue;
    const needed = rect.width * dpr * 0.95;
    if (img.naturalWidth < needed) {
      imageViolations.push({
        src: (img.currentSrc || img.src).split('/').pop(),
        naturalWidth: img.naturalWidth,
        renderedWidth: Math.round(rect.width),
        dpr,
        needed: Math.round(needed),
      });
    }
  }
  if (imageViolations.length) violations.push('under-density image(s): ' + JSON.stringify(imageViolations.slice(0, 8)));

  // ---- 8. hero: headline alone, one screen (home route only) --------------
  let heroMetrics = null;
  if (isHome) {
    const hero = document.querySelector('[data-home-band="hero"]');
    const title = hero ? hero.querySelector('h1') : null;
    const intro = document.querySelector('[data-home-band="intro"]');
    const header = document.querySelector('.site-header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const titleRect = title ? title.getBoundingClientRect() : null;
    const introRect = intro ? intro.getBoundingClientRect() : null;
    const extras = hero
      ? Array.from(hero.querySelectorAll('*')).filter(
          (el) => !el.closest('h1') && el.tagName !== 'H1' && !el.classList.contains('band__inner') && (el.textContent || '').trim() && el.getBoundingClientRect().height > 0
        ).length
      : null;
    heroMetrics = {
      headerBottom,
      heroBottom: heroRect ? heroRect.bottom : null,
      titleTop: titleRect ? titleRect.top : null,
      titleBottom: titleRect ? titleRect.bottom : null,
      introTop: introRect ? introRect.top : null,
      extras,
    };
  }

  // ---- 9. Loop side-by-side at >=1024 --------------------------------------
  let loopMetrics = null;
  if (isHome) {
    const svg = document.querySelector('.home-loop-svg');
    const layers = document.querySelector('.home-layers');
    if (svg && layers) {
      const svgRect = svg.getBoundingClientRect();
      const layersRect = layers.getBoundingClientRect();
      loopMetrics = {
        sideBySide: svgRect.right <= layersRect.left + 4 || layersRect.right <= svgRect.left + 4,
        svgRect: { left: Math.round(svgRect.left), right: Math.round(svgRect.right) },
        layersRect: { left: Math.round(layersRect.left), right: Math.round(layersRect.right) },
      };
    }
  }

  // ---- 10. blog / article h1 height vs 1/3 viewport ------------------------
  let titleHeightMetrics = null;
  const pageTitle = document.querySelector('.page-title');
  const template = document.querySelector('.page-intro')?.getAttribute('data-template');
  if (pageTitle && (template === 'blog' || template === 'article')) {
    const r = pageTitle.getBoundingClientRect();
    titleHeightMetrics = { template, height: r.height, vh, limit: vh / 3 + 24 };
  }

  return {
    vw,
    vh,
    horizontalOverflow,
    violations,
    heroMetrics,
    loopMetrics,
    titleHeightMetrics,
  };
}
/* eslint-enable no-undef */

// Thread-dot position + halo check at three scroll fractions (top, middle,
// bottom) — must always stay inside the viewport, and must never intersect
// visible band content (the "halo" pad mirrors 6g7's shoot.mjs).
async function checkThreadDot(page) {
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const fractions = [0, 0.5, 1];
  const samples = [];
  for (const f of fractions) {
    const innerHeight = await page.evaluate(() => window.innerHeight);
    const target = Math.max(0, Math.round((scrollHeight - innerHeight) * f));
    await page.evaluate((y) => window.scrollTo(0, y), target);
    await new Promise((r) => setTimeout(r, 180));
    const sample = await page.evaluate(() => {
      const dot = document.getElementById('thread-dot');
      if (!dot) return null;
      const rect = dot.getBoundingClientRect();
      const haloPad = matchMedia('(min-width: 821px)').matches ? 6 : 4;
      let overlapsContent = false;
      let overlapSample = null;
      for (const el of document.querySelectorAll('.band__inner *')) {
        if (!(el.textContent || '').trim()) continue;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const intersects = !(rect.right + haloPad <= r.left || rect.left - haloPad >= r.right || rect.bottom <= r.top || rect.top >= r.bottom);
        if (intersects) {
          overlapsContent = true;
          overlapSample = { tag: el.tagName, cls: (el.className || '').toString().slice(0, 30) };
          break;
        }
      }
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        overlapsContent,
        overlapSample,
      };
    });
    samples.push({ fraction: f, ...sample });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return samples;
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

async function makeLabeledThumb(imgPath, label, thumbWidth) {
  const img = sharp(imgPath);
  const meta = await img.metadata();
  const scale = thumbWidth / meta.width;
  const thumbHeight = Math.max(1, Math.round(meta.height * scale));
  const resized = await sharp(imgPath).resize({ width: thumbWidth }).toBuffer();
  const barHeight = 26;
  const svgLabel = `<svg width="${thumbWidth}" height="${barHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="4" y="18" font-family="monospace" font-size="12" fill="black">${escapeXml(label)}</text></svg>`;
  const labelBuf = Buffer.from(svgLabel);
  const canvas = sharp({ create: { width: thumbWidth, height: thumbHeight + barHeight, channels: 3, background: 'white' } });
  const out = await canvas
    .composite([
      { input: labelBuf, top: 0, left: 0 },
      { input: resized, top: barHeight, left: 0 },
    ])
    .png()
    .toBuffer();
  return { buffer: out, width: thumbWidth, height: thumbHeight + barHeight };
}

async function buildSheet(entries, outPath, columns, thumbWidth) {
  const thumbs = [];
  for (const { path: p, label } of entries) {
    thumbs.push(await makeLabeledThumb(p, label, thumbWidth));
  }
  const rows = Math.ceil(thumbs.length / columns);
  const rowHeights = [];
  for (let r = 0; r < rows; r++) {
    const rowThumbs = thumbs.slice(r * columns, r * columns + columns);
    rowHeights.push(Math.max(...rowThumbs.map((t) => t.height)));
  }
  const totalWidth = columns * thumbWidth;
  const totalHeight = rowHeights.reduce((a, b) => a + b, 0);
  const composites = [];
  let y = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const idx = r * columns + c;
      if (idx >= thumbs.length) continue;
      composites.push({ input: thumbs[idx].buffer, top: y, left: c * thumbWidth });
    }
    y += rowHeights[r];
  }
  await sharp({ create: { width: totalWidth, height: totalHeight, channels: 3, background: 'white' } })
    .composite(composites)
    .png()
    .toFile(outPath);
}

async function main() {
  const { default: puppeteer } = await import('puppeteer-core');
  await mkdir(scratchDir, { recursive: true });
  await mkdir(sheetsDir, { recursive: true });

  const server = startServer();
  let browser;
  const results = {
    generatedAt: new Date().toISOString(),
    routes: ROUTES.map((r) => r.route),
    sizes: SIZES.map((s) => s.label),
    pages: [],
    reducedMotion: [],
  };
  const violationLines = [];
  // sheetShots[sizeLabel] = { home: [{path,label}], templates: [{path,label}] }
  const sheetShots = {};
  for (const s of SIZES) sheetShots[s.label] = { home: [], templates: [] };

  try {
    await waitForServer();
    browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });

    for (const { slug, route } of ROUTES) {
      const isHome = slug === 'home';
      for (const size of SIZES) {
        const isPhone = PHONE_LABELS.has(size.label);
        const page = await browser.newPage();
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
        await page.setViewport({ width: size.width, height: size.height, deviceScaleFactor: size.dsf });
        await page.goto(base + route, { waitUntil: 'networkidle0' });
        await settle(page, { isHome });

        const firstScreenPath = path.join(scratchDir, `${slug}-${size.label}.png`);
        await page.screenshot({ path: firstScreenPath, fullPage: false });
        const fullPagePath = path.join(scratchDir, `${slug}-${size.label}-full.png`);
        await page.screenshot({ path: fullPagePath, fullPage: true });

        if (isHome) {
          // One element screenshot per homepage band (plan step 3): every
          // [data-home-band] section, in document order, feeds the home
          // contact sheet for this size.
          const bandHandles = await page.$$('[data-home-band]');
          for (const handle of bandHandles) {
            const bandName = await handle.evaluate((el) => el.getAttribute('data-home-band'));
            const bandPath = path.join(scratchDir, `home-band-${bandName}-${size.label}.png`);
            try {
              await handle.screenshot({ path: bandPath });
              sheetShots[size.label].home.push({ path: bandPath, label: `${bandName} @ ${size.label}` });
            } catch (err) {
              violationLines.push(`${route} @ ${size.label}: could not screenshot band "${bandName}" (${err.message})`);
            }
          }
          // elementHandle.screenshot() scrolls its target into view; after
          // walking every band (ending at the footer) the page is left
          // scrolled far down. Metrics below (notably the hero-viewport
          // check) read getBoundingClientRect() against the CURRENT scroll
          // position, so it must be back at the top first.
          await page.evaluate(() => window.scrollTo(0, 0));
          await new Promise((r) => setTimeout(r, 150));
        } else {
          sheetShots[size.label].templates.push({ path: firstScreenPath, label: `${slug} @ ${size.label}` });
        }

        const metrics = await page.evaluate(collectMetrics, { isHome, isPhone });
        const dotSamples = await checkThreadDot(page);

        const entry = { slug, route, size: size.label, width: size.width, height: size.height, dsf: size.dsf, ...metrics, dotSamples };
        results.pages.push(entry);

        for (const v of metrics.violations) violationLines.push(`${route} @ ${size.label}: ${v}`);
        for (const d of dotSamples) {
          if (d.top < -2 || d.bottom > d.innerHeight + 2 || d.left < -2 || d.right > d.innerWidth + 2) {
            violationLines.push(`${route} @ ${size.label}: thread dot outside viewport at scroll fraction ${d.fraction} (top=${d.top} bottom=${d.bottom} left=${d.left} right=${d.right})`);
          }
          if (d.overlapsContent) {
            violationLines.push(`${route} @ ${size.label}: thread dot overlaps band content at scroll fraction ${d.fraction} (${JSON.stringify(d.overlapSample)})`);
          }
        }
        if (isHome && metrics.heroMetrics) {
          const h = metrics.heroMetrics;
          const TOL = 2;
          if (h.heroBottom === null || h.titleTop === null) {
            violationLines.push(`${route} @ ${size.label}: hero band or headline missing`);
          } else {
            if (Math.abs(h.heroBottom - metrics.vh) > TOL) violationLines.push(`${route} @ ${size.label}: hero band ends at ${h.heroBottom.toFixed(0)}, not at the fold ${metrics.vh}`);
            if (h.titleBottom > metrics.vh + TOL || h.titleTop < h.headerBottom - TOL) violationLines.push(`${route} @ ${size.label}: headline is not inside the screen below the masthead`);
            if (h.introTop === null || Math.abs(h.introTop - metrics.vh) > TOL) violationLines.push(`${route} @ ${size.label}: intro band does not start at the fold`);
            if (h.extras !== 0) violationLines.push(`${route} @ ${size.label}: ${h.extras} visible element(s) besides the headline inside the hero band`);
          }
        }
        if (isHome && metrics.loopMetrics && size.width >= 1024) {
          if (!metrics.loopMetrics.sideBySide) violationLines.push(`${route} @ ${size.label}: Loop SVG and layer list are not side by side at width ${size.width}`);
        }
        if (metrics.titleHeightMetrics) {
          const t = metrics.titleHeightMetrics;
          if (t.height > t.limit) violationLines.push(`${route} @ ${size.label}: ${t.template} h1 height ${Math.round(t.height)}px exceeds one third of viewport (${Math.round(t.limit)}px)`);
        }

        await page.close();
      }
    }

    // ---- reduced-motion pass on / at three owner-named sizes ---------------
    const reducedSizes = SIZES.filter((s) => ['1440x900', '390x844', '667x375'].includes(s.label));
    for (const size of reducedSizes) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.setViewport({ width: size.width, height: size.height, deviceScaleFactor: size.dsf });
      await page.goto(base + '/', { waitUntil: 'networkidle0' });
      await settle(page, { isHome: true });
      const shotPath = path.join(scratchDir, `home-reduced-${size.label}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      const metrics = await page.evaluate(collectMetrics, { isHome: true, isPhone: PHONE_LABELS.has(size.label) });
      const entry = { route: '/', size: size.label, ...metrics };
      results.reducedMotion.push(entry);
      for (const v of metrics.violations) violationLines.push(`/ @ ${size.label} (reduced motion): ${v}`);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  // ---- contact sheets: one per size for home bands, one per size for templates
  for (const size of SIZES) {
    const { home, templates } = sheetShots[size.label];
    if (home.length) await buildSheet(home, path.join(sheetsDir, `home-${size.label}.png`), 1, 480);
    if (templates.length) await buildSheet(templates, path.join(sheetsDir, `templates-${size.label}.png`), 3, 360);
  }

  await writeFile(path.join(here, 'results.json'), JSON.stringify({ ...results, violations: violationLines }, null, 2) + '\n');

  console.log('shoot.mjs: captured ' + results.pages.length + ' page/size combination(s), wrote results.json and ' + SIZES.length * 2 + ' contact sheets');
  if (violationLines.length) {
    console.error('shoot.mjs: ' + violationLines.length + ' violation(s):');
    for (const v of violationLines) console.error('  - ' + v);
    process.exitCode = 1;
  } else {
    console.log('shoot.mjs: zero violations');
  }
}

await main();
