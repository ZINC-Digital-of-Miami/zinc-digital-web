#!/usr/bin/env node
// Evidence capture for quick task 260926-6g7 Task 3 (plan step 5). Serves
// the built dist/ over a throwaway local static server, drives it with the
// Chrome binary already on this machine via the puppeteer-core already
// present in node_modules (transitive; never ships in the site build), and
// records screenshots plus a machine-checkable results.json. Re-run after
// any base.css/home.css fix until results.json shows zero violations.
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../../');
const distDir = path.join(repoRoot, 'dist');
const port = 4322;
const base = 'http://127.0.0.1:' + port;

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const pages = [
  { slug: 'home', route: '/' },
  { slug: 'service', route: '/services/shopify/' },
  { slug: 'case', route: '/work/once-upon-a-book-club/' },
  { slug: 'blog', route: '/blog/' },
  { slug: 'article', route: '/blog/ai-search-results-and-generative-search-optimization/' },
  { slug: '404', route: '/404.html' },
];
const widths = [1440, 375];

// Owner, 2026-09-26, verbatim, on a screenshot of the headline running past
// the bottom of the screen: "I want this hero to be contained in viewport or
// 100vh full screen. I do not want it flowing over." Every size the owner
// named, plus the landscape-phone case that first surfaced the bug.
const HERO_SIZES = [
  [1440, 900], [1280, 720], [1780, 920], [1920, 1080],
  [768, 1024], [375, 812], [375, 667], [667, 375],
];

function startServer() {
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--directory', distDir], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return proc;
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

// Native `loading="lazy"` images (the site's own attribute, left untouched)
// only begin fetching once the browser judges them close enough to the
// viewport. A single full-page screenshot taken from the top of a tall page
// does not by itself guarantee every below-the-fold image has been asked to
// load. Scroll the real page through in steps — the same signal a real
// visitor's scroll gives the browser — then wait until every <img> reports
// complete with a real decoded width before the screenshot is taken.
async function ensureImagesLoaded(page) {
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = 12;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((scrollHeight * i) / steps));
    await new Promise((r) => setTimeout(r, 120));
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  try {
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('img')).every((img) => img.complete),
      { timeout: 8000 }
    );
  } catch {
    // fall through — the per-image report below records exactly which
    // image(s) never reached `complete` rather than throwing here.
  }

  return page.evaluate(() =>
    Array.from(document.querySelectorAll('img')).map((img) => ({
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }))
  );
}

async function main() {
  const { default: puppeteer } = await import('puppeteer-core');
  await mkdir(here, { recursive: true });

  const server = startServer();
  let browser;
  const results = { generatedAt: new Date().toISOString(), pages: [], motionScrollTest: null, noJsTest: null };

  try {
    await waitForServer();
    browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });

    // ---- per-page, per-width capture (reduced motion = the finished state) --
    for (const { slug, route } of pages) {
      for (const width of widths) {
        const page = await browser.newPage();
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        await page.setViewport({ width, height: 1000 });
        await page.goto(base + route, { waitUntil: 'networkidle0' });

        const imageReport = await ensureImagesLoaded(page);
        const failedImages = imageReport.filter((img) => !img.complete || img.naturalWidth <= 0);

        const metrics = await page.evaluate(() => {
          const html = document.documentElement;
          const body = document.body;
          const thread = document.getElementById('thread');
          const dot = document.getElementById('thread-dot');
          const firstBandInner = document.querySelector('.band__inner');
          const dotRectBefore = dot ? dot.getBoundingClientRect() : null;
          const dotTopBefore = dot ? getComputedStyle(dot).top : null;

          const violations = [];
          for (const el of document.querySelectorAll('a, button, summary, input, select, textarea')) {
            if (el.closest('.prose')) continue;
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (rect.width < 44 || rect.height < 44) {
              violations.push({
                tag: el.tagName,
                text: (el.textContent || '').trim().slice(0, 40),
                width: Math.round(rect.width * 100) / 100,
                height: Math.round(rect.height * 100) / 100,
              });
            }
          }

          // Dead keyboard stops: any tabindex="0" element must itself be an
          // interactive control (link with href, button, form control), or
          // carry a role/aria-label declaring what it is (e.g. a scroll
          // region). A bare tabindex="0" <div>/<span> with none of those is
          // a stop a keyboard user reaches that does nothing.
          const tabindexViolations = [];
          for (const el of document.querySelectorAll('[tabindex="0"]')) {
            const tag = el.tagName.toLowerCase();
            const isFormControl = ['button', 'input', 'select', 'textarea'].includes(tag);
            const isLink = tag === 'a' && el.hasAttribute('href');
            const hasRole = el.hasAttribute('role');
            const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
            if (isFormControl || isLink || hasRole || hasAriaLabel) continue;
            tabindexViolations.push({
              tag: el.tagName,
              text: (el.textContent || '').trim().slice(0, 40),
              className: el.className,
            });
          }

          const haloPad = matchMedia('(min-width: 821px)').matches ? 6 : 4;
          const dotClearOfContent =
            !dot || !firstBandInner
              ? null
              : dotRectBefore.right + haloPad < firstBandInner.getBoundingClientRect().left;

          return {
            scrollWidth: html.scrollWidth,
            innerWidth: window.innerWidth,
            htmlBg: getComputedStyle(html).backgroundColor,
            bodyBg: getComputedStyle(body).backgroundColor,
            threadPresent: !!thread,
            dotPresent: !!dot,
            threadPointerEvents: thread ? getComputedStyle(thread).pointerEvents : null,
            dotPointerEvents: dot ? getComputedStyle(dot).pointerEvents : null,
            dotClearOfContent,
            dotTopBefore,
            tapTargetViolations: violations,
            tabindexViolations,
          };
        });

        // Dot-stays-put check: scroll to bottom under reduced motion, confirm
        // the dot's CSS top did not change (CircuitThread's script never runs
        // any motion under prefers-reduced-motion: reduce).
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await new Promise((r) => setTimeout(r, 150));
        const dotTopAfter = await page.evaluate(() => {
          const dot = document.getElementById('thread-dot');
          return dot ? getComputedStyle(dot).top : null;
        });
        await page.evaluate(() => window.scrollTo(0, 0));

        const file = `${slug}-${width}.png`;
        await page.screenshot({ path: path.join(here, file), fullPage: true });

        results.pages.push({
          slug,
          route,
          width,
          file,
          scrollWidth: metrics.scrollWidth,
          viewportWidth: metrics.innerWidth,
          horizontalScroll: metrics.scrollWidth > metrics.innerWidth,
          background: { html: metrics.htmlBg, body: metrics.bodyBg },
          thread: {
            present: metrics.threadPresent,
            dotPresent: metrics.dotPresent,
            threadPointerEventsNone: metrics.threadPointerEvents === 'none',
            dotPointerEventsNone: metrics.dotPointerEvents === 'none',
            dotClearOfContent: metrics.dotClearOfContent,
            dotStayedPutAfterScroll: metrics.dotTopBefore === dotTopAfter,
          },
          tapTargets: {
            checked: true,
            violationCount: metrics.tapTargetViolations.length,
            violations: metrics.tapTargetViolations,
          },
          tabindexZero: {
            checked: true,
            violationCount: metrics.tabindexViolations.length,
            violations: metrics.tabindexViolations,
          },
          images: {
            checked: true,
            count: imageReport.length,
            loadedCount: imageReport.length - failedImages.length,
            failed: failedImages.map((img) => ({ route, width, src: img.src })),
          },
        });

        await page.close();
      }
    }

    // ---- hero viewport-fit check (owner requirement, 2026-09-26) --------
    // The hero band is the headline alone and exactly one screen below the
    // masthead (owner, 2026-09-26: "from the first word to the last, it takes
    // up the users screen, nothing else"). At every size, in both motion
    // modes: the band ends at the fold, the headline sits inside the screen
    // below the masthead and fills at least 70% of it, nothing else is
    // visible in the band, the intro band starts at the fold, and there is
    // no horizontal scroll.
    // Also captures a first-viewport (not full-page) screenshot at each
    // size, and checks the circuit-thread dot never overlaps the masthead
    // wordmark/nav/CTA at scroll position 0 (owner-measured regression,
    // 2026-09-26: the dot used to sit at the very top of the page, on top
    // of the wordmark).
    {
      const heroResults = [];
      for (const reduce of ['reduce', 'no-preference']) {
        for (const [width, height] of HERO_SIZES) {
          const page = await browser.newPage();
          await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce }]);
          await page.setViewport({ width, height });
          await page.goto(base + '/', { waitUntil: 'networkidle0' });

          // Let the pre-paint fit script's font-load and post-wrap refits settle.
          await new Promise((r) => setTimeout(r, 1500));
          const m = await page.evaluate(() => {
            const rect = (el) => (el ? el.getBoundingClientRect() : null);
            const hero = document.querySelector('[data-home-band="hero"]');
            const title = hero ? hero.querySelector('h1') : null;
            const intro = document.querySelector('[data-home-band="intro"]');
            const header = document.querySelector('.site-header');
            const wordmark = document.querySelector('.wordmark');
            const nav = document.querySelector('#site-nav');
            const inquiryBtn = document.querySelector('.site-header > a.btn');
            const dot = document.getElementById('thread-dot');

            function intersects(a, b) {
              if (!a || !b) return false;
              return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
            }
            // Anything visible in the hero band besides the headline breaks
            // "nothing else" (the thread overlay is page chrome, not band content).
            const extras = hero
              ? Array.from(hero.querySelectorAll('*')).filter((el) => !el.closest('h1') && el.tagName !== 'H1' && !el.classList.contains('band__inner') && (el.textContent || '').trim() && el.getBoundingClientRect().height > 0).length
              : null;
            const dotRect = dot ? dot.getBoundingClientRect() : null;
            return {
              innerHeight: window.innerHeight,
              headerBottom: header ? rect(header).bottom : 0,
              heroBottom: hero ? rect(hero).bottom : null,
              titleTop: title ? rect(title).top : null,
              titleBottom: title ? rect(title).bottom : null,
              introTop: intro ? rect(intro).top : null,
              extras,
              horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
              dotOverlapsWordmark: intersects(dotRect, rect(wordmark)),
              dotOverlapsNav: intersects(dotRect, rect(nav)),
              dotOverlapsInquiryBtn: intersects(dotRect, rect(inquiryBtn)),
            };
          });

          if (reduce === 'reduce') {
            await page.screenshot({
              path: path.join(here, `hero-${width}x${height}.png`),
              fullPage: false,
            });
          }

          const screen = m.innerHeight - m.headerBottom;
          heroResults.push({
            reducedMotion: reduce === 'reduce',
            width,
            height,
            ...m,
            fill: m.titleBottom !== null ? (m.titleBottom - m.titleTop) / screen : null,
          });

          await page.close();
        }
      }
      results.heroViewport = heroResults;
    }

    // ---- motion-allowed scroll test on / at 1440 -----------------------
    {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await page.setViewport({ width: 1440, height: 1000 });
      await page.goto(base + '/', { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 200));

      const before = await page.evaluate(() => {
        const dot = document.getElementById('thread-dot');
        const pulse = document.getElementById('pulse');
        return {
          dotTop: dot ? getComputedStyle(dot).top : null,
          pulse: pulse ? { cx: pulse.getAttribute('cx'), cy: pulse.getAttribute('cy') } : null,
        };
      });

      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const steps = 24;
      for (let i = 1; i <= steps; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round((scrollHeight * i) / steps));
        await new Promise((r) => setTimeout(r, 90));
      }
      // The how-we-work band's type-then-lock sequence runs on its own
      // timers once it enters view (about 4.5s for all three lines) and can
      // still be finishing after the scroll pass above completes — wait for
      // it explicitly rather than guessing a fixed delay.
      try {
        await page.waitForFunction(
          () => Array.from(document.querySelectorAll('.typed')).every((el) => el.textContent === el.getAttribute('data-text')),
          { timeout: 8000 }
        );
      } catch {
        // fall through; the after-snapshot below records whatever state exists
      }

      // The U.S. Oil stamps stagger in ~220ms apart (5 stamps => ~1.1s) and
      // the team shuffle clears its 'shuffling' class on its own per-card
      // timers — wait for both explicitly for the same reason as above.
      try {
        await page.waitForFunction(
          () => Array.from(document.querySelectorAll('.home-stamp')).every((el) => el.classList.contains('in')),
          { timeout: 4000 }
        );
      } catch {
        // fall through — recorded as a violation below if still not .in
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
        // fall through
      }

      const after = await page.evaluate(() => {
        const dot = document.getElementById('thread-dot');
        const pulse = document.getElementById('pulse');
        const kinEls = Array.from(document.querySelectorAll('.kin'));
        const typedEls = Array.from(document.querySelectorAll('.typed'));

        // Generic "still stuck behind html.anim" scan. Any element gated by
        // an `html.anim ...:not(.in)` / `.shuffling` rule in home.css must,
        // once its band has scrolled past, report full opacity and not be
        // display:none/visibility:hidden. This is the check that would have
        // caught the U.S. Oil stamps never reaching `.in` (#P1).
        function visible(el) {
          const s = getComputedStyle(el);
          return parseFloat(s.opacity) >= 0.99 && s.display !== 'none' && s.visibility !== 'hidden';
        }
        function hiddenScan(selector) {
          const els = Array.from(document.querySelectorAll(selector));
          const failing = els.filter((el) => !visible(el));
          return {
            selector,
            count: els.length,
            failCount: failing.length,
            sample: failing.slice(0, 3).map((el) => (el.textContent || '').trim().slice(0, 30)),
          };
        }

        const stampScan = hiddenScan('.home-stamp');
        const kinLetterScan = hiddenScan('.kin .w > i');
        const typedTextScan = hiddenScan('.home-commit-typed');
        const teamCardScan = hiddenScan('[data-team] > *');

        // Strike/highlighter are pseudo-elements (::before/::after) driven by
        // transform + height, not opacity — read their pseudo computed style
        // directly rather than via the opacity-only helper above.
        const markStrike = document.querySelector('.mark-strike');
        const markHit = document.querySelector('.mark-hit');
        const strikeTransform = markStrike ? getComputedStyle(markStrike, '::after').transform : null;
        const hitTransform = markHit ? getComputedStyle(markHit, '::before').transform : null;
        const strikeDrawn = !markStrike || (strikeTransform !== null && !/matrix\(0,/.test(strikeTransform));
        const hitDrawn = !markHit || (hitTransform !== null && !/matrix\(0,/.test(hitTransform));

        return {
          dotTop: dot ? getComputedStyle(dot).top : null,
          pulse: pulse ? { cx: pulse.getAttribute('cx'), cy: pulse.getAttribute('cy') } : null,
          kinAllIn: kinEls.length > 0 && kinEls.every((el) => el.classList.contains('in')),
          kinCount: kinEls.length,
          typedAllFull: typedEls.length > 0 && typedEls.every((el) => el.textContent === el.getAttribute('data-text')),
          typedCount: typedEls.length,
          stampScan,
          kinLetterScan,
          typedTextScan,
          teamCardScan,
          strikeDrawn,
          hitDrawn,
        };
      });

      results.motionScrollTest = {
        dotMoved: before.dotTop !== after.dotTop,
        pulseMoved: JSON.stringify(before.pulse) !== JSON.stringify(after.pulse),
        allKinIn: after.kinAllIn,
        kinCount: after.kinCount,
        allTypedFull: after.typedAllFull,
        typedCount: after.typedCount,
        hiddenBehindAnim: {
          stamps: after.stampScan,
          kinLetters: after.kinLetterScan,
          typedText: after.typedTextScan,
          teamCards: after.teamCardScan,
        },
        strikeDrawn: after.strikeDrawn,
        hitDrawn: after.hitDrawn,
      };
      await page.close();
    }

    // ---- JS-disabled test on / at 375 ------------------------------------
    {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setViewport({ width: 375, height: 1000 });
      await page.goto(base + '/', { waitUntil: 'load' });

      const noJs = await page.evaluate(() => {
        const layers = Array.from(document.querySelectorAll('.home-layer'));
        const layerOk = layers.length === 3 && layers.every((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && getComputedStyle(el).opacity === '1';
        });
        const serviceLinks = Array.from(document.querySelectorAll('.home-layer-list a'));
        const linksOk = serviceLinks.length > 0 && serviceLinks.every((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && getComputedStyle(el).opacity === '1';
        });
        // textContent, not innerText: the display-face .typed spans are
        // uppercased by CSS (text-transform), and innerText reflects the
        // rendered case while textContent is the literal DOM text the
        // no-JS visitor actually receives.
        const bodyText = document.body.textContent || '';
        const commitments = [
          'You own your accounts, data and code.',
          'Direct access to the people doing the work.',
          'Reporting tied to revenue, not impressions.',
        ];
        const commitmentsPresent = commitments.every((line) => bodyText.includes(line));
        return {
          layerCount: layers.length,
          layersVisible: layerOk,
          serviceLinkCount: serviceLinks.length,
          serviceLinksVisible: linksOk,
          commitmentsPresent,
        };
      });

      results.noJsTest = noJs;
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  await writeFile(path.join(here, 'results.json'), JSON.stringify(results, null, 2) + '\n');

  const violations = [];
  for (const p of results.pages) {
    if (p.width === 375 && p.horizontalScroll) violations.push(p.route + ' @375: horizontal scroll (scrollWidth ' + p.scrollWidth + ' > ' + p.viewportWidth + ')');
    if (p.background.html !== 'rgb(245, 246, 247)') violations.push(p.route + ' @' + p.width + ': html background is ' + p.background.html + ', expected rgb(245, 246, 247)');
    if (p.background.body !== 'rgb(245, 246, 247)') violations.push(p.route + ' @' + p.width + ': body background is ' + p.background.body + ', expected rgb(245, 246, 247)');
    if (!p.thread.present || !p.thread.dotPresent) violations.push(p.route + ' @' + p.width + ': thread or dot missing');
    if (!p.thread.threadPointerEventsNone || !p.thread.dotPointerEventsNone) violations.push(p.route + ' @' + p.width + ': thread/dot pointer-events is not none');
    if (p.thread.dotClearOfContent === false) violations.push(p.route + ' @' + p.width + ': thread dot + halo overlaps first band content');
    if (!p.thread.dotStayedPutAfterScroll) violations.push(p.route + ' @' + p.width + ': thread dot moved under prefers-reduced-motion: reduce');
    if (p.tapTargets.violationCount > 0) violations.push(p.route + ' @' + p.width + ': ' + p.tapTargets.violationCount + ' tap target(s) under 44x44: ' + JSON.stringify(p.tapTargets.violations));
    if (p.tabindexZero.violationCount > 0) violations.push(p.route + ' @' + p.width + ': ' + p.tabindexZero.violationCount + ' dead tabindex="0" stop(s): ' + JSON.stringify(p.tabindexZero.violations));
    if (p.images.failed.length > 0) violations.push(p.route + ' @' + p.width + ': ' + p.images.failed.length + ' image(s) failed to load: ' + JSON.stringify(p.images.failed));
  }
  if (results.heroViewport) {
    const TOLERANCE = 2; // px, subpixel/rounding
    for (const h of results.heroViewport) {
      const label = `hero @ ${h.width}x${h.height} (${h.reducedMotion ? 'reduced motion' : 'normal motion'})`;
      // Owner, 2026-09-26: "from the first word to the last, it takes up the
      // users screen, nothing else". The hero band is the headline alone and
      // exactly one screen below the masthead; the intro band starts at the fold.
      if (h.heroBottom === null || h.titleTop === null) { violations.push(`${label}: hero band or headline missing`); continue; }
      if (Math.abs(h.heroBottom - h.innerHeight) > TOLERANCE) violations.push(`${label}: hero band ends at ${h.heroBottom.toFixed(0)}, not at the fold ${h.innerHeight}`);
      if (h.titleBottom > h.innerHeight + TOLERANCE || h.titleTop < h.headerBottom - TOLERANCE) violations.push(`${label}: headline ${h.titleTop.toFixed(0)}-${h.titleBottom.toFixed(0)} is not inside the screen below the masthead (${h.headerBottom.toFixed(0)}-${h.innerHeight})`);
      if (h.fill < 0.7) violations.push(`${label}: headline fills only ${(h.fill * 100).toFixed(0)}% of the screen below the masthead (minimum 70%)`);
      if (h.introTop === null || Math.abs(h.introTop - h.innerHeight) > TOLERANCE) violations.push(`${label}: intro band starts at ${h.introTop}, not at the fold ${h.innerHeight}`);
      if (h.extras !== 0) violations.push(`${label}: ${h.extras} visible element(s) besides the headline inside the hero band`);
      if (h.horizontalScroll) violations.push(`${label}: horizontal scroll`);
      if (h.dotOverlapsWordmark) violations.push(`${label}: thread dot overlaps the masthead wordmark`);
      if (h.dotOverlapsNav) violations.push(`${label}: thread dot overlaps the masthead nav`);
      if (h.dotOverlapsInquiryBtn) violations.push(`${label}: thread dot overlaps the masthead "Start an inquiry" button`);
    }
  }
  if (results.motionScrollTest) {
    const m = results.motionScrollTest;
    if (!m.dotMoved) violations.push('motion scroll test: thread dot did not move');
    if (!m.pulseMoved) violations.push('motion scroll test: #pulse did not move');
    if (!m.allKinIn) violations.push('motion scroll test: not every .kin reached .in (count ' + m.kinCount + ')');
    if (!m.allTypedFull) violations.push('motion scroll test: not every .typed reached its full text (count ' + m.typedCount + ')');
    for (const [label, scan] of Object.entries(m.hiddenBehindAnim)) {
      if (scan.failCount > 0) {
        violations.push(
          'motion scroll test: ' + scan.failCount + '/' + scan.count + ' ' + scan.selector +
            ' (' + label + ') still hidden behind html.anim after scroll-through: ' + JSON.stringify(scan.sample)
        );
      }
    }
    if (!m.strikeDrawn) violations.push('motion scroll test: .mark-strike::after never drew in (scaleX still 0)');
    if (!m.hitDrawn) violations.push('motion scroll test: .mark-hit::before never drew in (scaleX still 0)');
  }
  if (results.noJsTest) {
    const n = results.noJsTest;
    if (!n.layersVisible) violations.push('no-JS test: Loop layers not fully visible (count ' + n.layerCount + ')');
    if (!n.serviceLinksVisible) violations.push('no-JS test: service links not fully visible (count ' + n.serviceLinkCount + ')');
    if (!n.commitmentsPresent) violations.push('no-JS test: not all three commitments text present');
  }

  console.log('shoot.mjs: captured ' + results.pages.length + ' screenshot(s), wrote results.json');
  if (violations.length) {
    console.error('shoot.mjs: ' + violations.length + ' violation(s):');
    for (const v of violations) console.error('  - ' + v);
    process.exitCode = 1;
  } else {
    console.log('shoot.mjs: zero violations');
  }
}

await main();
