#!/usr/bin/env node
// Browser verification for the Oct 2026 redesign:
// harness (Selenium/Chrome + axe + CDP, now served by scripts/serve-static.mjs because the Vercel
// adapter has no `astro preview`), same budgets (15 KB gzip JS,
// 3 same-origin woff2 + 1 preload, no underline, no overflow, no CLS from fonts), with the
// preview-era assertions replaced by the redesign's invariants:
//   - 43 pages (42 routes + 404), real SEO head, noindex ONLY on /thanks/ + 404
//   - light default (no OS drift), header toggle → dark, label "Dark mode"/"Light mode", persists across reload
//   - cursor dot never uses mix-blend-mode:difference (no mauve tint over dark)
//   - shell on every page (cursor/grain/progress), reduced motion honoured, mobile nav row at 375
//   - blog layer + topic filters, 3-step contact form (steps and validation; the final send is not exercised)
//   - keyboard: skip link, toggle via Enter, FAQ via Space; axe wcag2a/aa/21aa/22aa clean
//   - reduced motion and no-JS at 375 and 1440: pinned scenes in flow, every screenshot/panel/stamp/loop link
//     reachable, before/after showing both images; with motion the before/after really wipes
//   - INP from Event Timing entries for real clicks and keys, under 100 ms
// Usage: node scripts/verify-site.mjs [--mode quick|full] [--base http://host]
import fs from 'node:fs/promises';
import { privacyApproved, termsApproved } from '../src/data/legal.ts';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
// selenium-webdriver, axe-core and chromedriver are NOT root dependencies: they arrive through @axe-core/cli.
// Resolve them from there so the retained package-lock.json is untouched.
import { createRequire } from 'node:module';
const requireFromAxe = createRequire(path.join(process.cwd(), 'node_modules/@axe-core/cli/package.json'));
const { Builder, By, Key, logging } = requireFromAxe('selenium-webdriver');
const chrome = requireFromAxe('selenium-webdriver/chrome.js');
const axeMinPath = requireFromAxe.resolve('axe-core/axe.min.js');

const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const mode = option('--mode', 'quick'); assert.ok(['quick', 'full'].includes(mode), 'mode must be quick or full');
const root = process.cwd(); const out = path.join(root, '.scratch/verify-site');
const posts = JSON.parse(await fs.readFile('src/data/posts.preview.json', 'utf8')).posts;
const slugs = ['shopify', 'web-design', 'apps', 'seo', 'local-seo', 'ai-search-optimization', 'google-search-ads', 'shopping-ads', 'social-ads', 'tiktok-ads', 'business-intelligence'];
const caseSlugs = ['once-upon-a-book-club', 'us-oil-solutions', 'las-vegas-safety', 'summit-marine-development'];
const routes = [['/', 'home'], ['/services/', 'services'], ...slugs.map((s) => ['/services/' + s + '/', 'service']), ['/work/', 'work'], ...caseSlugs.map((s) => ['/work/' + s + '/', 'case']), ['/about/', 'about'], ['/contact/', 'contact'], ['/thanks/', 'thanks'], ['/blog/', 'blog'], ...posts.map((p) => ['/blog/' + p.slug + '/', 'article']), ['/privacy/', 'privacy'], ['/terms/', 'terms']];
assert.equal(routes.length, 42, 'route inventory must be 42 (+404 = 43 pages)');
const NOINDEX = new Set(['/thanks/']);
const JS_BUDGET = 15 * 1024;
const SNOW = 'rgb(245, 246, 247)', NEAR_BLACK = 'rgb(10, 10, 11)';
const base = option('--base', 'http://127.0.0.1:4329');
const result = { mode, base, startedAt: new Date().toISOString(), routes: [], axe: [], states: [], screenshots: [], failures: [] };
const check = (ok, m) => { if (!ok) result.failures.push(m); };
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m));
const save = (n, v) => fs.writeFile(path.join(out, n), JSON.stringify(v, null, 2) + '\n');
let server, driver;
// ChromeDriver must match the installed Chrome (the npm chromedriver package tracks the newest Chrome for Testing,
// so a local Chrome one major behind fails with SessionNotCreatedError). Order: CHROMEDRIVER_PATH, the CI runner's
// paired driver ($CHROMEWEBDRIVER), a driver matched to the local Chrome major installed once with
// @puppeteer/browsers into node_modules/.cache (as verify-local.mjs did), and the npm package only as a last resort.
const matchedDriver = () => {
  if (process.env.CHROMEDRIVER_PATH) return process.env.CHROMEDRIVER_PATH;
  if (process.env.CHROMEWEBDRIVER) return path.join(process.env.CHROMEWEBDRIVER, 'chromedriver');
  for (const bin of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'google-chrome-stable', 'chromium']) {
    if (bin.startsWith('/') && !existsSync(bin)) continue;
    let major; try { major = execFileSync(bin, ['--version'], { encoding: 'utf8' }).match(/(\d+)\.\d+\.\d+\.\d+/)?.[1]; } catch { continue; }
    if (!major) continue;
    const r = spawnSync('npx', ['--no-install', '@puppeteer/browsers', 'install', 'chromedriver@' + major, '--path', path.join(root, 'node_modules', '.cache', 'zinc-chromedriver')], { cwd: root, encoding: 'utf8' });
    const last = (r.stdout || '').trim().split('\n').filter(Boolean).pop() || '';
    const driver = last ? path.resolve(root, last.split(' ').slice(1).join(' ')) : '';
    if (r.status === 0 && driver && existsSync(driver)) return driver;
    break;
  }
  return path.join(path.dirname(requireFromAxe.resolve('chromedriver/package.json')), 'lib/chromedriver/chromedriver');
};
// In-page probes. reach(): scroll only the window, as a user would, and require each element inside the viewport
// and top-most at its centre (an overflow:hidden track never scrolls). baState(): which image shows on each side.
const REACH = `const [sel, inner] = arguments; const out = [];
  for (const el of document.querySelectorAll(sel)) { for (let k = 0; k < 3; k++) { const q = el.getBoundingClientRect(); scrollTo({ top: scrollY + q.top + q.height / 2 - innerHeight / 2, behavior: 'instant' }); }
    const r = el.getBoundingClientRect(); const t = (inner && el.querySelector(inner)) || el; const tr = t.getBoundingClientRect();
    const hit = document.elementFromPoint(Math.min(Math.max(tr.left + tr.width / 2, 1), innerWidth - 2), Math.min(Math.max(tr.top + Math.min(tr.height / 2, 40), 1), innerHeight - 2));
    out.push({ ok: r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1 && !!hit && el.contains(hit), l: Math.round(r.left), at: hit && String(hit.className || hit.tagName).slice(0, 30) }); }
  return out;`;
const BA = `const s = document.getElementById('baStage'); if (!s) return null; if (arguments[0] !== null) { const b = document.getElementById('ba'); scrollTo({ top: b.getBoundingClientRect().top + scrollY + (b.offsetHeight - innerHeight) * arguments[0] + 1, behavior: 'instant' }); }
  else for (let k = 0; k < 3; k++) { const q = s.getBoundingClientRect(); scrollTo({ top: scrollY + q.top + q.height / 2 - innerHeight / 2, behavior: 'instant' }); }
  const measure = () => { const r = s.getBoundingClientRect(), y = r.top + r.height * 0.6; const at = (x) => String(document.elementFromPoint(r.left + r.width * x, y)?.className || '');
    return { ba: getComputedStyle(s).getPropertyValue('--ba').trim(), h: Math.round(r.height), left: at(0.15), right: at(0.85) }; };
  // Static checks (reduced motion, no JS) measure at once: with page scripts disabled requestAnimationFrame never fires.
  if (arguments[0] === null) return measure();
  return new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(measure()))));`;
const reachAll = async (tag) => {
  for (const [name, sel, inner] of [['case screenshot', '.c-hz-shot', '.vp']]) { const r = await driver.executeScript(REACH, sel, inner); check(r.length > 0 && r.every((x) => x.ok), tag + ' ' + name + 's unreachable: ' + JSON.stringify(r.filter((x) => !x.ok))); }
};
const viewport = (w) => driver.sendAndGetDevToolsCommand('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 2, mobile: w < 700 });
const settle = () => driver.executeAsyncScript('const done=arguments[arguments.length-1];document.fonts.ready.then(()=>Promise.all(Array.from(document.images).map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))).then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))).then(()=>Promise.all(document.getAnimations().filter(a=>a instanceof CSSTransition).map(a=>a.finished.catch(()=>{})))).then(()=>done())');
// axe audits the finished page: reveal and scroll-in states (rv, rv-stag, stamps, typed lines) are transient motion,
// so they are set to their end state and their transitions awaited before the audit.
const finish = () => driver.executeAsyncScript('const done=arguments[arguments.length-1];document.querySelectorAll(".rv,.rv-stag,.stamp,.commit li,.hero").forEach(e=>e.classList.add("in"));const wait=()=>Promise.all(document.getAnimations().filter(a=>a instanceof CSSTransition).map(a=>a.finished.catch(()=>{})));requestAnimationFrame(()=>requestAnimationFrame(()=>wait().then(()=>done())));');
const load = async (route, w = 1440) => { await viewport(w); await driver.get(base + route); await settle(); };
const observe = () => driver.executeScript(function () {
  const vis = (el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  const anchors = Array.from(document.querySelectorAll('a')).filter(vis);
  const cur = document.getElementById('zsCur');
  return {
    h1: !!document.querySelector('h1'), text: document.body.innerText,
    underlines: anchors.filter((a) => !a.href.startsWith('mailto:') && getComputedStyle(a).textDecorationLine !== 'none').length,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    bg: getComputedStyle(document.body).backgroundColor, theme: document.documentElement.getAttribute('data-theme'),
    toggleLabel: document.querySelector('#themeToggle [data-theme-label]')?.textContent,
    cursorBlend: cur ? getComputedStyle(cur).mixBlendMode : null, hasGrain: !!document.querySelector('.zs-grain'), hasProg: !!document.getElementById('zsProg'),
    mnavVisible: !!document.querySelector('.mnav') && getComputedStyle(document.querySelector('.mnav')).display !== 'none',
    nlinksVisible: !!document.querySelector('.nlinks') && getComputedStyle(document.querySelector('.nlinks')).display !== 'none',
    images: Array.from(document.images).filter(vis).map((i) => ({ src: i.currentSrc, ok: i.naturalWidth > 0, reserved: i.hasAttribute('width') && i.hasAttribute('height') })),
    animated: Array.from(document.querySelectorAll('*')).filter((el) => { const s = getComputedStyle(el); return s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.05; }).length,
  };
});
const capture = async (name) => { if (mode !== 'full') return; const shot = await driver.sendAndGetDevToolsCommand('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await fs.writeFile(path.join(out, 'screenshots', name + '.png'), Buffer.from(shot.data, 'base64')); result.screenshots.push(name); };

try {
  await fs.mkdir(path.join(out, 'screenshots'), { recursive: true });
  if (!args.includes('--base')) { server = spawn(process.execPath, ['scripts/serve-static.mjs', '--port', '4329'], { cwd: root, stdio: 'ignore' }); for (let i = 0; i < 80; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 150)); } }

  // ---- 1. every route: status, head, body, links, fonts, JS budget ----
  const htmlMap = new Map();
  for (const [route, template] of [...routes, ['/not-a-real-page/', '404']]) {
    const res = await fetch(base + route); const html = await res.text();
    check(res.status === (template === '404' ? 404 : 200), route + ' status ' + res.status);
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || '';
    check(/noindex/.test(robots) === (NOINDEX.has(route) || template === '404'), route + ' robots: ' + (robots || 'indexable'));
    check(/<link rel="canonical" href="https:\/\/www\.zincdigital\.co\//.test(html), route + ' canonical');
    check(/<script type="application\/ld\+json">/.test(html), route + ' JSON-LD');
    check(/<meta property="og:image" content="https:\/\/www\.zincdigital\.co\/og\/[a-z]+\.png"/.test(html), route + ' og:image');
    const main = decode(html.replace(/<script\b[\s\S]*?<\/script\s*>|<style\b[\s\S]*?<\/style\s*>/gi, ' ').match(/<main[\s\S]*<\/main>/)?.[0].replace(/<\/?(?:a|strong|em|b|i|span|code|abbr)\b[^>]*>/g, '').replace(/<[^>]+>/g, ' ') || '').replace(/\s+/g, ' ');
    // Privacy and Terms render no legal body until the owner's approved text is in src/data/legal.ts (R2.6).
    const legalPending = (template === 'privacy' && !privacyApproved.sections.length) || (template === 'terms' && !termsApproved.sections.length);
    if (!legalPending) check(main.length > (['thanks', '404'].includes(template) ? 100 : 300), route + ' body chars ' + main.length);
    check(!/\[(RECEIPT|OWNER CONFIRM|LOGO PENDING|PHOTO PENDING)/.test(main) && !/\.dc\.html|#\//.test(html.match(/href="[^"]+"/g)?.join(' ') || ''), route + ' placeholder or design-preview link');
    const post = posts.find((p) => route === '/blog/' + p.slug + '/');
    if (post) for (const b of post.blocks) for (const runs of b.items || [b.runs || []]) { const t = runs.map((r) => r.text).join('').trim(); if (t) check(main.includes(t.replace(/\s+/g, ' ')), route + ' source text missing: ' + t.slice(0, 50)); }
    const scripts = new Map(); for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) { const u = new URL(m[1], base).href; if (!scripts.has(u)) { const r = await fetch(u); check(r.ok, route + ' script ' + r.status); scripts.set(u, await r.text()); } }
    const inline = Array.from(html.matchAll(/<script(?![^>]*src=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g), (m) => m[1]).join('\n');
    const gz = [...scripts.values()].reduce((n, b) => n + gzipSync(b).length, 0) + (inline ? gzipSync(inline).length : 0);
    check(gz <= JS_BUDGET, route + ' JS gzip ' + gz + ' > ' + JS_BUDGET);
    const woff2 = new Set(Array.from(html.matchAll(/url\("([^"?]+\.woff2)/g), (m) => m[1]));
    check(woff2.size === 3 && (html.match(/rel="preload"[^>]+as="font"/g) || []).length === 1, route + ' fonts: ' + woff2.size + ' woff2');
    htmlMap.set(route, { html, links: Array.from(html.matchAll(/href="([^"]+)"/g), (m) => m[1]), ids: Array.from(html.matchAll(/\bid="([^"]+)"/g), (m) => m[1]) });
    result.routes.push({ route, template, status: res.status, bodyChars: main.length, jsGzip: gz });
  }
  const seen = new Set();
  for (const [route, d] of htmlMap) for (const href of d.links) { const u = new URL(href, base + route); if (u.pathname === route && u.hash) { check(d.ids.includes(u.hash.slice(1)), route + ' missing fragment ' + href); continue; } if (u.origin !== new URL(base).origin || seen.has(u.pathname + u.hash)) continue; seen.add(u.pathname + u.hash); if (u.pathname.startsWith('/api/') || u.pathname.startsWith('/admin/')) continue; const r = await fetch(new URL(u.pathname, base), { redirect: 'manual' }).catch(() => null); const ok = r && (r.ok || (u.pathname === '/work/summit-marine/' && r.status === 301)); check(ok, route + ' broken link ' + href + ' (' + (r && r.status) + ')'); if (u.hash && htmlMap.get(u.pathname)) check(htmlMap.get(u.pathname).ids.includes(u.hash.slice(1)), route + ' missing fragment ' + href); }
  for (const p of ['/work/summit-marine/', '/work/summit-marine']) { const r = await fetch(base + p, { redirect: 'manual' }); check(r.status === 301 && new URL(r.headers.get('location') || '', base).pathname === '/work/summit-marine-development/', p + ' should 301 in one hop to /work/summit-marine-development/ (got ' + r.status + ' ' + r.headers.get('location') + ')'); }
  check((await fetch(base + '/sitemap.xml')).ok && (await fetch(base + '/robots.txt')).ok, 'sitemap/robots');

  // ---- 2. browser ----
  const opts = new chrome.Options().addArguments('--headless=new', '--no-first-run', '--disable-background-networking', '--user-data-dir=' + path.join(out, 'profile'));
  if (process.env.CHROME_NO_SANDBOX === '1') opts.addArguments('--no-sandbox'); // for hosts that already sandbox the process
  const prefs = new logging.Preferences(); prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL); opts.setLoggingPrefs(prefs);
  const driverPath = matchedDriver(); result.chromedriver = driverPath;
  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).setChromeService(new chrome.ServiceBuilder(driverPath)).build();
  const axeSrc = await fs.readFile(axeMinPath, 'utf8');
  const samples = mode === 'full' ? [...new Map(routes.map((r) => [r[1], r])).values()] : [['/', 'home'], ['/services/seo/', 'service'], ['/work/las-vegas-safety/', 'case'], ['/contact/', 'contact'], ['/blog/', 'blog']];
  for (const [route, template] of samples) for (const w of mode === 'full' ? [1440, 375] : [375, 1440]) {
    await load(route, w); const o = await observe();
    check(o.h1 && !o.overflow, route + '@' + w + ' overflow/h1'); check(o.underlines === 0, route + '@' + w + ' underlines ' + o.underlines);
    check(o.bg === SNOW && o.theme === 'light' && o.toggleLabel === 'Dark mode', route + '@' + w + ' default theme/label: ' + o.theme + ' / ' + o.toggleLabel);
    check(o.cursorBlend !== 'difference' && o.hasGrain && o.hasProg, route + '@' + w + ' shell (cursor blend=' + o.cursorBlend + ')');
    check(w < 900 ? o.mnavVisible && !o.nlinksVisible : !o.mnavVisible && o.nlinksVisible, route + '@' + w + ' nav row');
    check(o.images.every((i) => i.ok && i.reserved), route + '@' + w + ' images: ' + JSON.stringify(o.images.filter((i) => !i.ok || !i.reserved).map((i) => i.src)));
    await finish(); await driver.executeScript(axeSrc); const audit = await driver.executeAsyncScript('const d=arguments[arguments.length-1];axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}}).then(r=>d({violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))}))');
    result.axe.push({ route, w, ...audit }); check(audit.violations.length === 0, route + '@' + w + ' axe ' + JSON.stringify(audit.violations));
    await capture((route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '--')) + '--' + w + '--light');
    // theme: OS dark must NOT change anything; the toggle must.
    await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] }); check((await observe()).bg === SNOW, route + ' OS dark drift'); await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [] });
    if (template === 'home' || template === 'service') {
      await driver.findElement(By.id('themeToggle')).click(); const d = await observe(); check(d.theme === 'dark' && d.bg === NEAR_BLACK && d.toggleLabel === 'Light mode', route + ' toggle → dark'); await capture((route === '/' ? 'home' : 'service') + '--' + w + '--dark');
      await driver.navigate().refresh(); await settle(); check((await observe()).theme === 'dark', route + ' dark persists across reload');
      await finish(); await driver.executeScript(axeSrc); const dark = await driver.executeAsyncScript('const d=arguments[arguments.length-1];axe.run(document,{runOnly:{type:"tag",values:["wcag2aa"]}}).then(r=>d(r.violations.map(v=>v.id)))'); check(dark.length === 0, route + ' dark-mode axe ' + dark.join(','));
      await driver.findElement(By.id('themeToggle')).click(); check((await observe()).theme === 'light', route + ' toggle → light');
    }
  }
  // keyboard: skip link + Enter on toggle + Space on FAQ
  await load('/services/seo/', 1440);
  await driver.actions().sendKeys(Key.TAB).perform(); check(await driver.executeScript('return document.activeElement.classList.contains("skip-link")'), 'first Tab lands on skip link');
  await driver.executeScript('document.getElementById("themeToggle").focus()'); await driver.actions().sendKeys(Key.ENTER).perform(); check((await observe()).theme === 'dark', 'Enter toggles theme'); await driver.actions().sendKeys(Key.ENTER).perform();
  await driver.executeScript('document.querySelector(".p-faq summary").focus()'); await driver.actions().sendKeys(Key.SPACE).perform(); check(await driver.executeScript('return document.querySelector(".p-faq details").open'), 'Space opens FAQ');
  // reduced motion
  await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const w of [375, 1440]) {
    await load('/', w); const rm = await observe(); check(rm.animated === 0, 'reduced motion @' + w + ': ' + rm.animated + ' elements still animate'); check(await driver.executeScript('return Array.from(document.querySelectorAll(".rv")).every(e=>getComputedStyle(e).opacity==="1")'), 'reduced motion @' + w + ': reveals visible');
    for (const [name, sel, inner] of [['layer panel', '.hz-panel', '.hz-h'], ['U.S. Oil stamp', '.stamp', '.stamp-k'], ['loop service link', '.layer-list a', null]]) { const r = await driver.executeScript(REACH, sel, inner); check(r.length > 0 && r.every((x) => x.ok), 'reduced motion @' + w + ' home: ' + name + 's unreachable ' + JSON.stringify(r.filter((x) => !x.ok).slice(0, 3))); }
    await capture('home--' + w + '--reduced-motion');
    await load('/work/las-vegas-safety/', w); await reachAll('reduced motion @' + w + ' LVS:');
    const ba = await driver.executeScript(BA, null); check(ba && ba.ba === '50%' && /ba-before/.test(ba.left) && /ba-after/.test(ba.right), 'reduced motion @' + w + ': before/after shows both images ' + JSON.stringify(ba));
  }
  await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [] });
  // responsive sweep (full)
  if (mode === 'full') for (const [route] of [['/'], ['/services/ai-search-optimization/'], ['/work/las-vegas-safety/'], ['/about/'], ['/contact/'], ['/blog/']]) for (const w of [320, 375, 768, 1024, 1440, 2560]) { await load(route, w); check(!(await observe()).overflow, route + ' overflow at ' + w); }
  // blog filters
  await load('/blog/', 375);
  for (const layer of ['Build', 'Demand', 'Intelligence', 'All']) { await driver.findElement(By.css('[data-filter="' + layer + '"]')).click(); const s = await driver.executeScript('return {count:document.querySelector("[data-result-count]").textContent,visible:Array.from(document.querySelectorAll("[data-blog-list] article")).filter(x=>x.getClientRects().length>0).map(x=>x.dataset.layer)}'); check(s.visible.length > 0 && s.visible.every((l) => layer === 'All' || l === layer), 'blog filter ' + layer); result.states.push({ filter: layer, ...s }); }
  await driver.findElement(By.css('[data-topic="seo"]')).click(); check(await driver.executeScript('const v=Array.from(document.querySelectorAll("[data-blog-list] article")).filter(x=>x.getClientRects().length>0); return v.length>0 && v.every(x=>x.dataset.topics.split(" ").includes("seo"))'), 'topic filter seo');
  await driver.findElement(By.css('[data-filter="Intelligence"]')).click(); await driver.findElement(By.css('[data-topic="shopify"]')).click(); check(await driver.findElement(By.css('[data-empty]')).isDisplayed() && (await driver.executeScript('return Array.from(document.querySelectorAll("[data-blog-list] article")).every(x=>x.getClientRects().length===0)')), 'empty state shows and every card is hidden'); await driver.findElement(By.css('[data-clear-filter]')).click(); check((await driver.executeScript('return document.querySelector("[data-result-count]").textContent')) === '17 articles', 'clear filters → 17 articles');
  check(((await (await fetch(base + '/blog/?layer=Build')).text()).length > 0), '?layer= query accepted');
  // contact: preselect (incl. hostile slugs), 3 steps with validation; the final send is not exercised
  for (const slug of [...slugs, 'unknown', '<img src=x onerror=alert(1)>', 'shopify&service=seo']) { const qv = slug === 'shopify&service=seo' ? slug : encodeURIComponent(slug); await load('/contact/?service=' + qv, 375); const sel = await driver.executeScript('return Array.from(document.querySelectorAll("[data-service]:checked")).map(x=>x.value)'); check(JSON.stringify(sel) === JSON.stringify(slugs.includes(slug) ? [slug] : []), 'preselect ' + slug); }
  await load('/contact/?service=shopify', 375);
  await driver.findElement(By.css('[data-next]')).click(); check((await driver.findElement(By.css('[data-form-error]')).getText()).length > 0, 'invalid step announces error');
  for (const [id, v] of [['name', 'Review Visitor'], ['company', 'Review Company'], ['email', 'reviewer@example.test'], ['website', 'https://example.test']]) await driver.findElement(By.id('inquiry-' + id)).sendKeys(v);
  await driver.findElement(By.css('[data-next]')).click(); await driver.executeScript('document.getElementById("inquiry-budget").selectedIndex=2;document.getElementById("inquiry-timeline").selectedIndex=1'); await driver.findElement(By.css('[data-next]')).click();
  await driver.findElement(By.id('inquiry-message')).sendKeys('Inquiry text for the local browser check.');
  const lastLabel = await driver.executeScript('return document.querySelector("[data-next]").textContent'); check(lastLabel === 'Send inquiry', 'last step offers Send inquiry (got "' + lastLabel + '")');
  result.states.push({ contact: 'steps and validation exercised; the final send is not (it would create a real inquiry)' });
  if (mode === 'full') { await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled', { value: true }); await driver.get(base + '/contact/'); check((await Promise.all((await driver.findElements(By.css('fieldset'))).map((f) => f.isDisplayed()))).every(Boolean), 'no-JS: all fieldsets visible'); check(await driver.findElement(By.css('[data-nojs-submit]')).isDisplayed(), 'no-JS: fallback control visible'); check(!(await driver.findElement(By.css('[data-next]')).isDisplayed()), 'no-JS: JS-only Continue hidden');
    for (const w of [375, 1440]) { await viewport(w); await driver.get(base + '/work/las-vegas-safety/'); await reachAll('no-JS @' + w + ' LVS:'); const ba = await driver.executeScript(BA, null); check(ba && /ba-before/.test(ba.left) && /ba-after/.test(ba.right), 'no-JS @' + w + ': before/after shows both images ' + JSON.stringify(ba)); await driver.get(base + '/'); for (const [name, sel, inner] of [['layer panel', '.hz-panel', '.hz-h'], ['U.S. Oil stamp', '.stamp', '.stamp-k'], ['loop service link', '.layer-list a', null]]) { const r = await driver.executeScript(REACH, sel, inner); check(r.length > 0 && r.every((x) => x.ok), 'no-JS @' + w + ' home: ' + name + 's unreachable'); } }
    await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled', { value: false }); }
  // case page pins exist and the horizontal track moves
  await load('/work/las-vegas-safety/', 1440); await driver.executeScript('window.scrollTo(0, document.getElementById("cHz").offsetTop + innerHeight)'); await new Promise((r) => setTimeout(r, 300)); check(/translateX\(-\d/.test(await driver.executeScript('return document.getElementById("cHzTrack").style.transform')), 'case screenshot scroller moves');
  const ba0 = await driver.executeScript(BA, 0), ba1 = await driver.executeScript(BA, 0.75);
  check(ba0 && parseFloat(ba0.ba) > 80 && /ba-before/.test(ba0.right) && ba1 && parseFloat(ba1.ba) < 40 && /ba-after/.test(ba1.right) && /ba-before/.test(ba1.left), 'before/after wipes from the old site to the new one with scroll: ' + JSON.stringify([ba0, ba1]));
  // INP from Event Timing: trusted clicks and keys on the main controls. Entries under the 16 ms observer floor are
  // not reported, so performance.interactionCount proves the interactions happened; the slowest must stay < 100 ms.
  const INP = `return new Promise((done) => { const seen = []; new PerformanceObserver((l) => seen.push(...l.getEntries())).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    setTimeout(() => { const by = new Map(); for (const e of seen) if (e.interactionId) by.set(e.interactionId, Math.max(by.get(e.interactionId) || 0, e.duration)); done({ count: performance.interactionCount, reported: by.size, worst: Math.max(0, ...by.values()) }); }, 400); });`;
  result.inp = [];
  for (const [route, steps] of [
    ['/', [['click', '#themeToggle'], ['click', '#themeToggle']]],
    ['/blog/', [['click', '[data-filter="Build"]'], ['click', '[data-filter="Demand"]'], ['click', '[data-topic="seo"]'], ['click', '[data-filter="All"]']]],
    ['/services/seo/', [['click', '.p-faq summary'], ['click', '.p-faq summary']]],
    ['/contact/', [['click', '[data-next]'], ['type', '#inquiry-name']]],
  ]) {
    await load(route, 1440);
    for (const [kind, sel] of steps) { const el = await driver.findElement(By.css(sel)); await driver.executeScript('arguments[0].scrollIntoView({block:"center"})', el); if (kind === 'click') await el.click(); else await el.sendKeys('Ana'); await new Promise((r) => setTimeout(r, 120)); }
    const m = await driver.executeScript(INP); result.inp.push({ route, ...m });
    check(m.count >= steps.length && m.worst < 100, route + ' INP ' + Math.round(m.worst) + ' ms over ' + m.count + ' interactions (needs < 100 ms)');
  }
} catch (e) { result.failures.push(e.stack); throw e; }
finally {
  result.completedAt = new Date().toISOString(); await save('verification-' + mode + '.json', result);
  console.log(JSON.stringify({ mode, routes: result.routes.length, axeRuns: result.axe.length, screenshots: result.screenshots.length, inp: result.inp, failures: result.failures }, null, 2));
  if (result.failures.length) process.exitCode = 1;
  if (driver) await driver.quit(); if (server) server.kill('SIGTERM');
}
