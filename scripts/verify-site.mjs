#!/usr/bin/env node
// Browser verification for the Oct 2026 redesign. Successor to scripts/verify-mockup.mjs:
// same harness (astro preview + Selenium/Chrome + axe + CDP), same budgets (15 KB gzip JS,
// 3 same-origin woff2 + 1 preload, no underline, no overflow, no CLS from fonts), with the
// preview-era assertions replaced by the redesign's invariants:
//   - 43 pages (42 routes + 404), real SEO head, noindex ONLY on /thanks/ + 404
//   - light default (no OS drift), header toggle → dark, label "Dark mode"/"Light mode", persists across reload
//   - cursor dot never uses mix-blend-mode:difference (no mauve tint over dark)
//   - shell on every page (cursor/grain/progress), reduced motion honoured, mobile nav row at 375
//   - blog layer + topic filters, 3-step contact form (demo mode: no POST, no PII in requests, storage unchanged)
//   - keyboard: skip link, toggle via Enter, FAQ via Space; axe wcag2a/aa/21aa/22aa clean
// Usage: node scripts/verify-site.mjs [--mode quick|full] [--base http://host]
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { gzipSync } from 'node:zlib';
// selenium-webdriver, axe-core and chromedriver are NOT root dependencies: they arrive through @axe-core/cli,
// exactly as the repo's verify-mockup.mjs relied on. Resolve them from there so the retained package-lock.json is untouched.
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
const save = (n, v) => fs.writeFile(path.join(out, n), JSON.stringify(v, null, 2) + '\n');
let server, driver;
const viewport = (w) => driver.sendAndGetDevToolsCommand('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 2, mobile: w < 700 });
const settle = () => driver.executeAsyncScript('const done=arguments[arguments.length-1];document.fonts.ready.then(()=>Promise.all(Array.from(document.images).map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))).then(()=>requestAnimationFrame(()=>requestAnimationFrame(done)))');
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
  if (!args.includes('--base')) { server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4329'], { cwd: root, stdio: 'ignore' }); for (let i = 0; i < 80; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 150)); } }

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
    const main = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').match(/<main[\s\S]*<\/main>/)?.[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') || '';
    check(main.length > (['thanks', '404'].includes(template) ? 100 : 300), route + ' body chars ' + main.length);
    check(!/\[(RECEIPT|OWNER CONFIRM|LOGO PENDING|PHOTO PENDING)/.test(main) && !/\.dc\.html|#\//.test(html.match(/href="[^"]+"/g)?.join(' ') || ''), route + ' placeholder or design-preview link');
    const post = posts.find((p) => route === '/blog/' + p.slug + '/');
    if (post) for (const b of post.blocks) { const t = (b.runs || b.items?.flat() || []).map((r) => r.text).join('').trim(); if (t) check(main.includes(t.replace(/\s+/g, ' ')), route + ' source text missing: ' + t.slice(0, 50)); }
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
  for (const [route, d] of htmlMap) for (const href of d.links) { const u = new URL(href, base + route); if (u.origin !== new URL(base).origin || seen.has(u.pathname + u.hash)) continue; seen.add(u.pathname + u.hash); if (u.pathname.startsWith('/api/')) continue; const r = await fetch(new URL(u.pathname, base), { redirect: 'manual' }).catch(() => null); const ok = r && (r.ok || (u.pathname.startsWith('/admin/') && [302, 200].includes(r.status)) || (u.pathname === '/work/summit-marine/' && [301, 308].includes(r.status))); check(ok, route + ' broken link ' + href + ' (' + (r && r.status) + ')'); if (u.hash && htmlMap.get(u.pathname)) check(htmlMap.get(u.pathname).ids.includes(u.hash.slice(1)), route + ' missing fragment ' + href); }
  check(((await fetch(base + '/work/summit-marine/', { redirect: 'manual' })).status + '').startsWith('30'), 'summit-marine short slug should redirect');
  check((await fetch(base + '/sitemap.xml')).ok && (await fetch(base + '/robots.txt')).ok, 'sitemap/robots');

  // ---- 2. browser ----
  const opts = new chrome.Options().addArguments('--headless=new', '--no-first-run', '--disable-background-networking', '--user-data-dir=' + path.join(out, 'profile'));
  const prefs = new logging.Preferences(); prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL); opts.setLoggingPrefs(prefs);
  const driverPath = process.env.CHROMEDRIVER_PATH || (process.env.CHROMEWEBDRIVER ? path.join(process.env.CHROMEWEBDRIVER, 'chromedriver') : path.join(path.dirname(requireFromAxe.resolve('chromedriver/package.json')), 'lib/chromedriver/chromedriver'));
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
    await driver.executeScript(axeSrc); const audit = await driver.executeAsyncScript('const d=arguments[arguments.length-1];axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}}).then(r=>d({violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))}))');
    result.axe.push({ route, w, ...audit }); check(audit.violations.length === 0, route + '@' + w + ' axe ' + JSON.stringify(audit.violations));
    await capture((route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replaceAll('/', '--')) + '--' + w + '--light');
    // theme: OS dark must NOT change anything; the toggle must.
    await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] }); check((await observe()).bg === SNOW, route + ' OS dark drift'); await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [] });
    if (template === 'home' || template === 'service') {
      await driver.findElement(By.id('themeToggle')).click(); const d = await observe(); check(d.theme === 'dark' && d.bg === NEAR_BLACK && d.toggleLabel === 'Light mode', route + ' toggle → dark'); await capture((route === '/' ? 'home' : 'service') + '--' + w + '--dark');
      await driver.navigate().refresh(); await settle(); check((await observe()).theme === 'dark', route + ' dark persists across reload');
      await driver.executeScript(axeSrc); const dark = await driver.executeAsyncScript('const d=arguments[arguments.length-1];axe.run(document,{runOnly:{type:"tag",values:["wcag2aa"]}}).then(r=>d(r.violations.map(v=>v.id)))'); check(dark.length === 0, route + ' dark-mode axe ' + dark.join(','));
      await driver.findElement(By.id('themeToggle')).click(); check((await observe()).theme === 'light', route + ' toggle → light');
    }
  }
  // keyboard: skip link + Enter on toggle + Space on FAQ
  await load('/services/seo/', 1440);
  await driver.actions().sendKeys(Key.TAB).perform(); check(await driver.executeScript('return document.activeElement.classList.contains("skip-link")'), 'first Tab lands on skip link');
  await driver.executeScript('document.getElementById("themeToggle").focus()'); await driver.actions().sendKeys(Key.ENTER).perform(); check((await observe()).theme === 'dark', 'Enter toggles theme'); await driver.actions().sendKeys(Key.ENTER).perform();
  await driver.executeScript('document.querySelector(".p-faq summary").focus()'); await driver.actions().sendKeys(Key.SPACE).perform(); check(await driver.executeScript('return document.querySelector(".p-faq details").open'), 'Space opens FAQ');
  // reduced motion
  await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); await load('/', 375); const rm = await observe(); check(rm.animated === 0, 'reduced motion: ' + rm.animated + ' elements still animate'); check(await driver.executeScript('return Array.from(document.querySelectorAll(".rv")).every(e=>getComputedStyle(e).opacity==="1")'), 'reduced motion: reveals visible'); await capture('home--375--reduced-motion'); await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia', { features: [] });
  // responsive sweep (full)
  if (mode === 'full') for (const [route] of [['/'], ['/services/ai-search-optimization/'], ['/work/las-vegas-safety/'], ['/about/'], ['/contact/'], ['/blog/']]) for (const w of [320, 375, 768, 1024, 1440, 2560]) { await load(route, w); check(!(await observe()).overflow, route + ' overflow at ' + w); }
  // blog filters
  await load('/blog/', 375);
  for (const layer of ['Build', 'Demand', 'Intelligence', 'All']) { await driver.findElement(By.css('[data-filter="' + layer + '"]')).click(); const s = await driver.executeScript('return {count:document.querySelector("[data-result-count]").textContent,visible:Array.from(document.querySelectorAll("[data-blog-list] article")).filter(x=>!x.hidden).map(x=>x.dataset.layer)}'); check(s.visible.length > 0 && s.visible.every((l) => layer === 'All' || l === layer), 'blog filter ' + layer); result.states.push({ filter: layer, ...s }); }
  await driver.findElement(By.css('[data-topic="seo"]')).click(); check(await driver.executeScript('return Array.from(document.querySelectorAll("[data-blog-list] article")).filter(x=>!x.hidden).every(x=>x.dataset.topics.split(" ").includes("seo"))'), 'topic filter seo');
  await driver.findElement(By.css('[data-filter="Intelligence"]')).click(); await driver.findElement(By.css('[data-topic="shopify"]')).click(); check(await driver.findElement(By.css('[data-empty]')).isDisplayed(), 'empty state shows'); await driver.findElement(By.css('[data-clear-filter]')).click(); check((await driver.findElement(By.css('[data-result-count]')).getText()) === '17 articles', 'clear filters → 17 articles');
  check(((await (await fetch(base + '/blog/?layer=Build')).text()).length > 0), '?layer= query accepted');
  // contact: preselect (incl. hostile slugs), 3 steps, demo mode = no POST / no PII / storage unchanged (theme key excepted)
  for (const slug of [...slugs, 'unknown', '<img src=x onerror=alert(1)>', 'shopify&service=seo']) { const qv = slug === 'shopify&service=seo' ? slug : encodeURIComponent(slug); await load('/contact/?service=' + qv, 375); const sel = await driver.executeScript('return Array.from(document.querySelectorAll("[data-service]:checked")).map(x=>x.value)'); check(JSON.stringify(sel) === JSON.stringify(slugs.includes(slug) ? [slug] : []), 'preselect ' + slug); }
  await load('/contact/?service=shopify', 375);
  const demo = await driver.executeScript('return document.querySelector("[data-demo-form]").dataset.mode');
  await driver.manage().logs().get(logging.Type.PERFORMANCE);
  const storage0 = await driver.executeScript('return JSON.stringify({l:Object.keys(localStorage).filter(k=>k!=="zinc-theme"),s:sessionStorage.length,c:document.cookie})');
  await driver.findElement(By.css('[data-next]')).click(); check((await driver.findElement(By.css('[data-form-error]')).getText()).length > 0, 'invalid step announces error');
  for (const [id, v] of [['name', 'Demo Reviewer'], ['company', 'Sample Company'], ['email', 'reviewer@example.test'], ['website', 'https://example.test']]) await driver.findElement(By.id('inquiry-' + id)).sendKeys(v);
  await driver.findElement(By.css('[data-next]')).click(); await driver.executeScript('document.getElementById("inquiry-budget").selectedIndex=2;document.getElementById("inquiry-timeline").selectedIndex=1'); await driver.findElement(By.css('[data-next]')).click();
  await driver.findElement(By.id('inquiry-message')).sendKeys('Sample inquiry for local review only.');
  if (demo === 'demo') {
    await driver.findElement(By.css('[data-next]')).click(); await settle();
    check((await driver.getCurrentUrl()) === base + '/thanks/', 'demo → /thanks/'); check((await driver.findElement(By.css('main')).getText()).includes('No inquiry was submitted'), 'thanks copy (demo)');
    const reqs = (await driver.manage().logs().get(logging.Type.PERFORMANCE)).map((l) => JSON.parse(l.message).message).filter((m) => m.method === 'Network.requestWillBeSent').map((m) => m.params.request);
    check(reqs.every((r) => r.method === 'GET' && !r.postData && !/Demo%20Reviewer|reviewer%40|Sample%20Company/.test(r.url)), 'demo form sent data');
    check((await driver.executeScript('return JSON.stringify({l:Object.keys(localStorage).filter(k=>k!=="zinc-theme"),s:sessionStorage.length,c:document.cookie})')) === storage0, 'demo form touched storage');
  } else result.states.push({ contact: 'live mode detected; submission not exercised by this script (would create a real inquiry)' });
  if (mode === 'full') { await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled', { value: true }); await driver.get(base + '/contact/'); check((await Promise.all((await driver.findElements(By.css('fieldset'))).map((f) => f.isDisplayed()))).every(Boolean), 'no-JS: all fieldsets visible'); check(await driver.findElement(By.css('[data-nojs-submit]')).isDisplayed(), 'no-JS: fallback control visible'); check(!(await driver.findElement(By.css('[data-next]')).isDisplayed()), 'no-JS: JS-only Continue hidden'); await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled', { value: false }); }
  // case page pins exist and the horizontal track moves
  await load('/work/las-vegas-safety/', 1440); await driver.executeScript('window.scrollTo(0, document.getElementById("cHz").offsetTop + innerHeight)'); await new Promise((r) => setTimeout(r, 300)); check(/translateX\(-\d/.test(await driver.executeScript('return document.getElementById("cHzTrack").style.transform')), 'case screenshot scroller moves');
  check(await driver.executeScript('return !!document.getElementById("ba") && getComputedStyle(document.getElementById("baStage")).getPropertyValue("--ba").trim().length>0'), 'before/after stage present on LVS');
} catch (e) { result.failures.push(e.stack); throw e; }
finally {
  result.completedAt = new Date().toISOString(); await save('verification-' + mode + '.json', result);
  console.log(JSON.stringify({ mode, routes: result.routes.length, axeRuns: result.axe.length, screenshots: result.screenshots.length, failures: result.failures }, null, 2));
  if (result.failures.length) process.exitCode = 1;
  if (driver) await driver.quit(); if (server) server.kill('SIGTERM');
}
