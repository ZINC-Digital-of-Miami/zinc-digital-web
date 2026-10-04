#!/usr/bin/env node
// Visual review capture (task 5.1). For every public template, captures the built site (scripts/serve-static.mjs)
// and its Design reference (current-design/ served on 127.0.0.1, routed through each file's hash route) in light
// and dark at 375, 768 and 1440 px, plus the interaction states. Frames are viewport screenshots taken down the
// page (transitions off, reveals in their finished state), so pinned scenes show as a visitor sees them. Each
// site frame is paired with the Design frame at the same step on labelled side-by-side sheets.
// Usage: node scripts/capture.mjs [--round <n>] [--only <template,...>] [--design <dir>] [--out <dir>]
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const root = process.cwd();
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const DESIGN = opt('--design', '/Volumes/Satechi Hub/zinc-digital-web-review/2026-10-04-packaged-design/current-design');
const OUT_ROOT = opt('--out', '/Volumes/Satechi Hub/zinc-digital-web-review/visual/m2');
const requireFromAxe = createRequire(path.join(root, 'node_modules/@axe-core/cli/package.json'));
const { Builder, By } = requireFromAxe('selenium-webdriver');
const chrome = requireFromAxe('selenium-webdriver/chrome.js');

// One instance per public template; services once per layer because each layer has its own visual.
const TEMPLATES = [
  ['home', '/', 'ZINC Home Blend.dc.html'],
  ['services', '/services/'], ['service-build', '/services/shopify/'], ['service-demand', '/services/seo/'], ['service-intelligence', '/services/business-intelligence/'],
  ['work', '/work/'], ['case', '/work/las-vegas-safety/'], ['about', '/about/'], ['contact', '/contact/'], ['thanks', '/thanks/'],
  ['blog', '/blog/'], ['article', '/blog/seven-digital-channels-which-to-skip/'], ['privacy', '/privacy/'], ['terms', '/terms/'], ['404', '/not-a-real-page/'],
].filter(([t]) => !opt('--only') || opt('--only').split(',').includes(t));
const WIDTHS = [[375, 812], [768, 1024], [1440, 900]];
const THEMES = ['light', 'dark'];
const MAX_FRAMES = { 375: 22, 768: 16, 1440: 14 };
const designUrl = (base, t) => (t[2] ? base + '/' + encodeURIComponent(t[2]) : base + '/' + encodeURIComponent('ZINC Site.dc.html') + '#' + t[1]);

// Interaction states, captured at 375 and 1440 in light: [template, name, steps]. Selectors and labels are the ones
// the site and the Design share (.p-chip filters, .p-ctrls buttons, .p-faq), so the same steps drive both.
const NEXT = '.p-ctrls .btn.fill';
const STATES = [
  ['blog', 'filter-intelligence', [['clickText', '.p-chip:not(.sm)', 'Intelligence'], ['scroll', '.p-chip']]],
  ['blog', 'no-results', [['clickText', '.p-chip:not(.sm)', 'Intelligence'], ['clickText', '.p-chip.sm', 'Shopify'], ['scroll', '.p-chip.sm']]],
  ['contact', 'step-1-error', [['scroll', 'form, .p-form'], ['click', NEXT]]],
  ['contact', 'step-2', [['scroll', 'form, .p-form'], ['fill'], ['click', NEXT]]],
  ['contact', 'step-3', [['scroll', 'form, .p-form'], ['fill'], ['click', NEXT], ['select'], ['click', NEXT]]],
  ['service-demand', 'faq-open', [['scroll', '.p-faq'], ['click', '.p-faq summary']]],
  ['home', 'mobile-nav', [['scroll-top']]],
];

const nextRound = async () => { try { const n = (await readdir(OUT_ROOT)).map((d) => +(/^round-(\d+)$/.exec(d)?.[1] || 0)); return Math.max(0, ...n) + 1; } catch { return 1; } };
const round = Number(opt('--round', 0)) || (await nextRound());
const out = path.join(OUT_ROOT, 'round-' + round);
await mkdir(path.join(out, 'frames'), { recursive: true }); await mkdir(path.join(out, 'sheets'), { recursive: true });

// Design server: plain static files from current-design/.
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const designServer = http.createServer(async (req, res) => {
  const p = path.join(DESIGN, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { if (!p.startsWith(DESIGN) || !(await stat(p)).isFile()) throw 0; res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(await readFile(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(4342, '127.0.0.1');
const site = spawn(process.execPath, ['scripts/serve-static.mjs', '--port', '4341'], { cwd: root, stdio: 'ignore' });
const SITE = 'http://127.0.0.1:4341', DES = 'http://127.0.0.1:4342';
for (let i = 0; i < 60; i++) { try { if ((await fetch(SITE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 150)); }

const o = new chrome.Options().addArguments('--headless=new', '--no-first-run', '--hide-scrollbars', '--user-data-dir=' + path.join(process.env.TMPDIR || out, 'capture-profile-' + process.pid));
if (process.env.CHROME_NO_SANDBOX === '1') o.addArguments('--no-sandbox');
const builder = new Builder().forBrowser('chrome').setChromeOptions(o);
if (process.env.CHROMEDRIVER_PATH) builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH));
const d = await builder.build();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async () => Buffer.from((await d.sendAndGetDevToolsCommand('Page.captureScreenshot', { format: 'png' })).data, 'base64');
// Finished state for capture: no transitions, every reveal/scroll-in element in, cursor and grain off.
const FREEZE = `if (!document.getElementById('cap-freeze')) { const s = document.createElement('style'); s.id = 'cap-freeze'; s.textContent = '*,*::before,*::after{transition:none!important;caret-color:transparent!important}.zs-cur,.cur,.zs-grain,.grain{display:none!important}'; document.head.appendChild(s); }
  document.querySelectorAll('.rv,.rv-stag,.stamp,.commit li,.hero,.reveal').forEach((e) => e.classList.add('in'));`;
const open = async (src, t, w, h, theme) => {
  await d.sendAndGetDevToolsCommand('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  const url = src === 'site' ? SITE + t[1] : designUrl(DES, t);
  await d.get(url.split('#')[0]);
  await d.executeScript('localStorage.setItem("zinc-theme", arguments[0])', theme);
  await d.get(url); await d.navigate().refresh();
  await d.executeAsyncScript('const done = arguments[arguments.length - 1]; (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(done, 700))');
  await d.executeScript(FREEZE);
};
const frames = async (prefix, w, h) => {
  const files = []; const total = await d.executeScript('return document.documentElement.scrollHeight');
  for (let k = 0, y = 0; k < MAX_FRAMES[w] && y < total; k++, y += Math.round(h * 0.9)) {
    await d.executeScript('scrollTo(0, arguments[0])', y); await sleep(160); await d.executeScript(FREEZE);
    const f = path.join(out, 'frames', prefix + '--' + String(k).padStart(2, '0') + '.png'); await writeFile(f, await shot()); files.push(f);
  }
  return { files, total };
};

const label = (text, width) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="34"><rect width="100%" height="100%" fill="#111"/><text x="10" y="23" font-family="Menlo, monospace" font-size="16" fill="#fff">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`);
// Pair frames side by side (site left, Design right) and pack pairs onto sheets no larger than ~1600 px wide.
const sheets = async (name, siteFiles, designFiles, w, h) => {
  const n = Math.max(siteFiles.length, designFiles.length); const gap = 12;
  const scale = Math.min(1, 1600 / (2 * w + gap)); const pw = Math.round(2 * w * scale + gap), ph = Math.round(h * scale) + 34;
  const perRow = w <= 375 ? 2 : 1, rows = w <= 375 ? 2 : w <= 768 ? 1 : 3, per = perRow * rows; const made = [];
  const blank = await sharp({ create: { width: w, height: h, channels: 3, background: '#e5e5e5' } }).png().toBuffer();
  for (let s = 0; s * per < n; s++) {
    const layers = []; let idx = 0;
    for (let k = s * per; k < Math.min(n, (s + 1) * per); k++, idx++) {
      const x = (idx % perRow) * (pw + gap), y = Math.floor(idx / perRow) * (ph + gap);
      const img = async (f) => sharp(f ? await readFile(f) : blank).resize(Math.round(w * scale)).toBuffer();
      layers.push({ input: label(name + ' · frame ' + k + ' · site | design', pw), left: x, top: y });
      layers.push({ input: await img(siteFiles[k]), left: x, top: y + 34 });
      layers.push({ input: await img(designFiles[k]), left: x + Math.round(w * scale) + gap, top: y + 34 });
    }
    const cols = Math.min(perRow, idx), rws = Math.ceil(idx / perRow);
    const f = path.join(out, 'sheets', name + '--' + String(s).padStart(2, '0') + '.png');
    await sharp({ create: { width: cols * pw + (cols - 1) * gap, height: rws * ph + (rws - 1) * gap, channels: 3, background: '#ffffff' } }).composite(layers).png().toFile(f);
    made.push(path.relative(out, f));
  }
  return made;
};

const manifest = { round, startedAt: new Date().toISOString(), design: DESIGN, combos: [], states: [] };
try {
  for (const t of TEMPLATES) for (const [w, h] of WIDTHS) for (const theme of THEMES) {
    const name = t[0] + '--' + w + '--' + theme; const got = {};
    for (const src of ['site', 'design']) { await open(src, t, w, h, theme); got[src] = await frames(name + '--' + src, w, h); }
    const made = await sheets(name, got.site.files, got.design.files, w, h);
    manifest.combos.push({ template: t[0], path: t[1], width: w, theme, siteFrames: got.site.files.length, designFrames: got.design.files.length, siteHeight: got.site.total, designHeight: got.design.total, sheets: made });
    console.log('captured ' + name + ' (' + got.site.files.length + '/' + got.design.files.length + ' frames)');
  }
  for (const [tname, state, steps] of STATES) {
    const t = TEMPLATES.find((x) => x[0] === tname); if (!t) continue;
    for (const [w, h] of [[375, 812], [1440, 900]]) {
      const files = {};
      for (const src of ['site', 'design']) {
        await open(src, t, w, h, 'light'); let note = '';
        for (const [kind, sel, text] of steps) {
          try {
            if (kind === 'clickText') { if (!(await d.executeScript('const el = [...document.querySelectorAll(arguments[0])].find((e) => e.textContent.trim().startsWith(arguments[1])); if (el) { el.scrollIntoView({block:"center"}); el.click(); } return !!el', sel, text))) throw Object.assign(new Error(), { name: 'NoSuchElementError' }); }
            else if (kind === 'click') { const el = await d.findElement(By.css(sel)); await d.executeScript('arguments[0].scrollIntoView({block:"center"}); arguments[0].click()', el); }
            else if (kind === 'scroll') await d.executeScript('document.querySelector(arguments[0])?.scrollIntoView({block:"start"}); scrollBy(0, -90)', sel);
            else if (kind === 'scroll-top') await d.executeScript('scrollTo(0,0)');
            else if (kind === 'fill') await d.executeScript(`const set = (id, v) => { const e = document.getElementById(id); if (e) { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); } };
              set('inquiry-name', 'Ana Ruiz'); set('inquiry-company', 'Ruiz Supply'); set('inquiry-email', 'ana@ruizsupply.com'); set('inquiry-website', 'https://ruizsupply.com');
              const c = document.querySelector('[data-service]'); if (c) c.checked = true;`);
            else if (kind === 'select') await d.executeScript(`for (const id of ['inquiry-budget', 'inquiry-timeline']) { const e = document.getElementById(id); if (e) e.selectedIndex = 1; }`);
            await sleep(250); await d.executeScript(FREEZE);
          } catch (e) { note += kind + ' ' + (sel || '') + ' failed (' + e.name + '); '; }
        }
        const f = path.join(out, 'frames', 'state--' + tname + '--' + state + '--' + w + '--' + src + '.png'); await writeFile(f, await shot()); files[src] = f;
        if (note) manifest.states.push({ template: tname, state, width: w, source: src, note });
      }
      const made = await sheets('state--' + tname + '--' + state + '--' + w, [files.site], [files.design], w, h);
      manifest.states.push({ template: tname, state, width: w, sheets: made });
      console.log('captured state ' + tname + ' ' + state + ' @' + w);
    }
  }
} finally {
  manifest.completedAt = new Date().toISOString();
  await writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  await d.quit(); site.kill('SIGTERM'); designServer.close();
}
const expected = TEMPLATES.length * WIDTHS.length * THEMES.length;
console.log('round ' + round + ': ' + manifest.combos.length + '/' + expected + ' template × width × theme combinations, ' + manifest.states.filter((s) => s.sheets).length + ' interaction states → ' + out);
if (manifest.combos.length !== expected) process.exitCode = 1;
