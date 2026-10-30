#!/usr/bin/env node
// Static dist/ gate for the Oct 2026 redesign. Exits non-zero with every failure listed.
// Replaces the preview-era assertions (thread ids, noindex everywhere, [RECEIPT]/
// [OWNER CONFIRM] markers, data-theme="dark" ban, data-home-band order) with the
// launch set: real SEO head on every page, no placeholder markers, dark theme
// allowed, link integrity, font output, JS budget, JSON-LD, sitemap/robots,
// redirect routes, CSP meta and a secret scan.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { caseScreens } from '../src/data/case-screens.ts';
import { clientOrder, workFor, nextClient } from '../src/data/client-work.ts';
import { laneNames, workLanes } from '../src/data/work-lanes.ts';

const root = process.cwd();
// With on-demand routes, @astrojs/vercel builds in server mode: prerendered files land in dist/client/
// (copied to .vercel/output/static/), and redirects exist only as routes in .vercel/output/config.json.
const distDir = path.join(root, 'dist', 'client');
const failures = [];
const fail = (m) => failures.push(m);
const check = (ok, m) => { if (!ok) fail(m); };
// Design-level invariants that live in CSS (cursor correction: no blend mode anywhere).
for (const f of ['src/styles/site.css', 'src/styles/home.css']) { const css = await readFile(path.join(root, f), 'utf8'); check(!/mix-blend-mode:\s*difference/.test(css), f + ' still uses mix-blend-mode:difference (mauve cursor tint)'); check(/prefers-reduced-motion/.test(css), f + ' lacks the prefers-reduced-motion block'); }
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

const htmlFiles = (await readdir(distDir, { recursive: true })).filter((e) => e.endsWith('.html')).sort();
check(htmlFiles.length > 0, 'dist/ contains no built HTML files — run npm run build first');
const pages = [];
for (const rel of htmlFiles) pages.push({ rel, html: await readFile(path.join(distDir, rel), 'utf8') });

// ---- expected route set. Keep the migrated snapshot and authored additions distinct. ----
const SERVICE_SLUGS = ['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence'];
const CASE_SLUGS = ['carla-funk-photography','ballad-health','meade-tractor','general-shale','us-oil-solutions','las-vegas-safety','summit-marine-development','zinc-fusion-v16','the-lampstand-va','straight-street-ministries','bear-claw-usa','felon-motorwerk','miami-tactical','fraim-cawley-company','smoky-mountain-survival','andrew-neese','porsche-roanoke'];
const STATIC = ['', 'services', 'work', 'work/build', 'work/demand', 'work/intelligence', 'about', 'contact', 'thanks', 'blog', 'privacy', 'terms', '404'];
const postsPreview = JSON.parse(await readFile(path.join(root, 'src/data/posts.preview.json'), 'utf8'));
const { authoredArticles } = await import('../src/data/article-library.ts');
const { authors, authorFor, authorPath } = await import('../src/data/authors.ts');
const POST_SLUGS = [...postsPreview.posts, ...authoredArticles].map((p) => p.slug);
check(postsPreview.posts.length === 18, 'posts.preview.json should preserve the 18 migrated posts');
const listedCategories = [...(pages.find(p=>p.rel==='blog/index.html')?.html || '').matchAll(/href="\/blog\/category\/([a-z-]+)\/"/g)].map(m=>m[1]);
const CATEGORY_SLUGS = [...new Set([...authoredArticles.flatMap(p=>p.related),...listedCategories])].filter(s=>SERVICE_SLUGS.includes(s));
const expected = [
  ...STATIC.map((s) => (s ? s + '/index.html' : 'index.html')),
  ...SERVICE_SLUGS.map((s) => 'services/' + s + '/index.html'),
  ...CASE_SLUGS.map((s) => 'work/' + s + '/index.html'),
  ...CATEGORY_SLUGS.map(s=>'blog/category/'+s+'/index.html'),
  ...POST_SLUGS.map((s) => 'blog/' + s + '/index.html'),
  ...authors.map((a) => 'authors/' + a.id + '/index.html'),
];
for (const e of expected) check(htmlFiles.includes(e) || htmlFiles.includes(e.replace('404/index.html', '404.html')), 'missing built page: ' + e);
const { redirects } = await import(new URL('../src/data/redirects.ts', import.meta.url).href);
const ALIAS_FILES = Object.keys(redirects).map((a) => a.replace(/^\/|\/$/g, '') + '/index.html');
const extra = htmlFiles.filter((f) => !expected.includes(f) && f !== '404.html' && !ALIAS_FILES.includes(f));
check(extra.length === 0, 'unexpected built pages: ' + extra.join(', '));
// Separate the forecasting platform and nonprofit support from commercial case claims.
const fusion = pages.find(p => p.rel === 'work/zinc-fusion-v16/index.html')?.html || '';
check(fusion.includes('Chris Stacy') && fusion.includes('In development'), 'Fusion case must name Chris Stacy and its development status');
check(!fusion.includes('zinc-fusion-v16.vercel.app'), 'Fusion case must not expose the unredacted live application');
for (const slug of ['the-lampstand-va', 'straight-street-ministries']) {
  const html = pages.find(p => p.rel === 'work/' + slug + '/index.html')?.html || '';
  check(html.includes('Pro bono') && html.includes('Keith Farmer'), slug + ' must identify the nonprofit support relationship');
  check(!html.includes('The layers in use.'), slug + ' must use the nonprofit presentation');
}
// Every available source-backed comparison uses the shared accessible slider.
for (const slug of ['las-vegas-safety','carla-funk-photography','us-oil-solutions','summit-marine-development','the-lampstand-va']) {
  const html = pages.find(p => p.rel === 'work/' + slug + '/index.html')?.html || '';
  check(html.includes('data-compare') && html.includes('type="range"') && html.includes('data-compare-to="100"') && html.includes('data-compare-to="0"'), slug + ' lacks before/after controls');
}
const carla = pages.find(p => p.rel === 'work/carla-funk-photography/index.html')?.html || '';
check(carla.includes('Admin image uploader') && carla.includes('In progress') && carla.includes('2025'), 'Carla must distinguish the existing website from the upgrade and admin uploader');
const ballad = pages.find(p => p.rel === 'work/ballad-health/index.html')?.html || '';
check(ballad.includes('Enterprise SEO') && ballad.includes('2018') && ballad.includes('thousands of pages') && ballad.includes('SEO technician'), 'Ballad must retain its 2018 enterprise SEO role and scale');
// Owner, 20 Oct 2026: Once Upon a Book Club is removed from the public site, with every image of it.
for (const p of pages) check(!/once upon a book club|once-upon-a-book-club|onceuponabookclub|ouabc/i.test(p.html), p.rel + ' still references Once Upon a Book Club');
for (const file of await readdir(distDir, { recursive: true })) check(!/ouabc|once-upon|book-?club/i.test(String(file)), 'dist/' + file + ' is a Once Upon a Book Club file');
const SITE = 'https://www.zincdigital.co';
const NOINDEX_PAGES = ['thanks/index.html', '404/index.html'];
const readText = async (rel) => { try { return await readFile(path.join(distDir, rel), 'utf8'); } catch { return null; } };
const sitemap = await readText('sitemap.xml');
check(sitemap !== null, 'dist/sitemap.xml missing');
if (sitemap !== null) {
  const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]).sort();
  const want = expected.filter((e) => !NOINDEX_PAGES.includes(e)).map((e) => SITE + '/' + e.replace(/index\.html$/, '')).sort();
  check(JSON.stringify(locs) === JSON.stringify(want), 'sitemap.xml should list exactly the ' + want.length + ' indexable pages; missing: ' + want.filter((u) => !locs.includes(u)).join(', ') + '; extra: ' + locs.filter((u) => !want.includes(u)).join(', '));
}
const llms = await readText('llms.txt');
check(llms !== null && llms.startsWith('# ZINC Digital\n') && llms.includes(SITE + '/contact/'), 'llms.txt must describe ZINC and link to its public contact page');
if (llms) check(!/\/admin\/|\/api\//.test(llms), 'llms.txt must not advertise private routes');

// Vercel aliases stay noindex; the live domain must not inherit that header at cutover.
const projectHeaders = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const robotsRules = projectHeaders.headers.filter(rule => rule.headers.some(header => header.key.toLowerCase() === 'x-robots-tag'));
check(robotsRules.length === 1 && robotsRules[0].has?.some(condition => condition.type === 'host' && new RegExp('^' + condition.value + '$').test('zinc-digital-web.vercel.app') && !new RegExp('^' + condition.value + '$').test('www.zincdigital.co')), 'X-Robots-Tag must match Vercel hosts without blocking www.zincdigital.co');

const expectAnalytics = process.argv.includes('--analytics=on');
for (const {rel, html} of pages) {
  const tags = Array.from(html.matchAll(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=GT-NNZRWNCF/g));
  check(tags.length === (expectAnalytics ? 1 : 0), rel + ' has an unexpected Google tag count for this build');
  if (expectAnalytics) {
    check(html.includes('tag.async=true'), rel + ' Google tag must be asynchronous');
    check(html.includes("'G-BV43HRVJ18'") && html.includes("'AW-17071018445'"), rel + ' must configure the existing Google destinations');
    check(html.includes('https://*.google-analytics.com') && html.includes('https://www.googletagmanager.com'), rel + ' CSP must allow the Google tag and collection');
  }
}
const robots = await readText('robots.txt');
check(robots !== null, 'dist/robots.txt missing');
if (robots !== null) {
  const lines = robots.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const l of ['User-agent: *', 'Disallow: /admin/', 'Disallow: /api/', 'Sitemap: ' + SITE + '/sitemap.xml']) check(lines.includes(l), 'robots.txt lacks "' + l + '"');
  check(!lines.some((l) => /^Disallow:\s*\/thanks\//.test(l)), 'robots.txt must not disallow /thanks/ (it is noindex instead)');
  check(!lines.some((l) => /^Disallow:\s*\/\s*$/.test(l)), 'robots.txt disallows the whole site');
}
for (const img of ['og/home.png','og/work.png','og/build.png','og/demand.png','og/intelligence.png','og/article.png','logos/general-shale.png','logos/us-oil.png','logos/google-partner.png']) check(await exists(path.join(distDir, img)), 'dist/' + img + ' missing');
// Case images live in src/assets/work/ (fetched by scripts/fetch-live-assets.mjs) and ship through astro:assets.
const siteAssets = JSON.parse(await readFile(path.join(root, 'src/data/assets.site.json'), 'utf8'));
for (const [key, a] of Object.entries(siteAssets)) if (a.source) {
  // Vector artwork is served unchanged from public; raster sources use astro:assets.
  const directory = a.src.endsWith('.svg') ? 'public' : 'src/assets';
  check(await exists(path.join(root, directory, a.src)), directory + a.src + ' missing for ' + key + ' (run npm run assets)');
}

// ---- per page ----
const NOINDEX_OK = new Set(['thanks/index.html', '404.html', '404/index.html']);
const PLACEHOLDER = /\[(RECEIPT|OWNER CONFIRM|LOGO|PHOTO PENDING|PLACEHOLDER|TODO)[^\]]*\]|Receipt pending|\bTBD\b|\bTODO\b|\bFIXME\b|lorem ipsum|coming soon|placeholder text/i;
// Every build is production: no demo or preview wording anywhere.
const PREVIEW_WORDING = /design preview|mockup|Demo inquiry|sample information|Inquiry preview|Demo confirmation|Marked preview|non-sending demo/i;
const BANNED_ABBREVIATION = new RegExp('\\b' + String.fromCharCode(71, 69, 79) + '\\b');
const text = (html) => html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, ' ').replace(/<style\b[\s\S]*?<\/style\s*>/gi, ' ').replace(/<[^>]+>/g, ' ');
const hrefs = (html) => Array.from(html.matchAll(/href=["']([^"']+)["']/g), (m) => m[1]);
// On-demand (server-rendered) routes are not in dist/; they are gated by src/middleware.ts.
const SERVER_ROUTES = ['/admin/', '/admin/login/', '/admin/auth/confirm/', '/contact/send/', '/api/inquiries/', '/api/admin/signout/', '/api/admin/notify/', '/api/research/chat/', '/api/research/ingest/'];
const resolves = async (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true;
  if (SERVER_ROUTES.includes(clean) || SERVER_ROUTES.includes(clean + '/')) return true;
  if (clean === '/') return exists(path.join(distDir, 'index.html'));
  const rel = clean.replace(/^\/+/, '');
  return (await exists(path.join(distDir, rel))) || (await exists(path.join(distDir, rel, 'index.html')));
};
for (const { rel, html } of pages) {
  const is404 = rel === '404.html' || rel === '404/index.html';
  check(/<title>[^<]+<\/title>/.test(html), rel + ' has no <title>');
  check(/<meta name="description" content="[^"]{20,}"/.test(html), rel + ' has no usable meta description');
  check(/<link rel="canonical" href="https:\/\/www\.zincdigital\.co\/[^"]*"/.test(html), rel + ' has no canonical');
  check(/<meta property="og:image" content="https:\/\/www\.zincdigital\.co\/(?:og\/[a-z-]+\.png|_astro\/[^/?]+\.webp(?:\?dpl=[A-Za-z0-9_-]+)?)"/.test(html), rel + ' has no valid og:image');
  const ld = []; for (const b of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { const j = JSON.parse(b[1]); ld.push(...(j['@graph'] || [j])); } catch (e) { fail(rel + ' has JSON-LD that does not parse: ' + e.message); } }
  const types = ld.map((x) => x['@type']);
  check(types.includes('Organization') && types.includes('WebSite') && types.includes('BreadcrumbList') && types.filter((x) => x === 'ProfessionalService').length === 2, rel + ' JSON-LD lacks Organization, the two office locations, WebSite or BreadcrumbList: ' + types.join(', '));
  if (rel.startsWith('services/') && rel !== 'services/index.html') check(types.includes('Service') && types.includes('FAQPage'), rel + ' JSON-LD lacks Service or FAQPage');
  if (rel.startsWith('blog/category/')) check(types.includes('CollectionPage') && !types.includes('Article'),rel+' must describe a category collection');
  if (rel.startsWith('blog/') && rel !== 'blog/index.html' && !rel.startsWith('blog/category/')) {
    const a = ld.find((x) => x['@type'] === 'Article');
    const profile = a?.author?.name && authorFor(a.author.name);
    check(!!a && ['Person', 'Organization'].includes(a.author?.['@type']) && !!a.author?.name && (a.author['@type'] === 'Organization') === (a.author.name === 'Team ZINC'), rel + ' has an inaccurate Article author');
    if (profile) check(a.author.url === SITE + authorPath(profile.id) && a.author['@id'] === SITE + authorPath(profile.id) + '#person' && a.author.name === profile.schemaName, rel + ' author must reference the correct profile');
    check(/T\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(a?.datePublished || '') && /T\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(a?.dateModified || ''), rel + ' Article dates require a timezone');
  }
  if (rel.startsWith('authors/')) check(types.includes('Person') && types.includes('ProfilePage'), rel + ' lacks Person/ProfilePage structured data');
  const hasNoindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  check(hasNoindex === NOINDEX_OK.has(rel), rel + (hasNoindex ? ' is noindex but should be indexable' : ' must be noindex'));
  const themeToggle = html.match(/<button\b[^>]*\bid="themeToggle"[^>]*>[\s\S]*?<\/button>/)?.[0] || '';
  check(/\btype="button"/.test(themeToggle) && /\baria-label="[^"]+"/.test(themeToggle) && /class="ic"[^>]*aria-hidden="true"/.test(themeToggle), rel + ' is missing the accessible icon-only appearance toggle');
  check(themeToggle.replace(/<[^>]+>/g, '').trim() === '' && !themeToggle.includes('data-theme-label'), rel + ' appearance toggle must not render a visible text label');
  check(!/mix-blend-mode:\s*difference/.test(html), rel + ' cursor still uses mix-blend-mode difference');
  check(html.includes('id="zsCur"') && html.includes('class="zs-grain"'), rel + ' is missing the shell cursor/grain');
  check(html.includes('href="sms:+17865754837"'), rel + ' is missing the sms link');
  check(html.includes('href="/contact/"'), rel + ' is missing a /contact/ link');
  check(!html.includes('href="#"'), rel + ' contains a bare href="#"');
  check(!html.includes('ZINC%20Site.dc.html') && !html.includes('.dc.html') && !/href="#\//.test(html), rel + ' still has a design-preview (hash or .dc.html) link');
  check(!/https:\/\/www\.zincdigital\.co\/wp-content\//.test(html), rel + ' hot-links an image from the WordPress site');
  check(!/["'(=]\/wp-content\//.test(html), rel + ' references a relative wp-content URL');
  check(!/["' ]\/work\/[^"' ]+\.png/.test(html), rel + ' serves a raw case PNG instead of the optimized image');
  for (const tag of html.match(/<img\b[^>]*>/g) || []) check(/\swidth=/.test(tag) && /\sheight=/.test(tag), rel + ' has an <img> without width and height: ' + tag.slice(0, 120));
  check(!/fonts\.googleapis\.com/.test(html), rel + ' loads Google Fonts directly (fonts must come from astro:assets)');
  check(!BANNED_ABBREVIATION.test(html), rel + ' contains the banned abbreviation for generative search');
  const t = text(html);
  const m = PLACEHOLDER.exec(t);
  check(!m, rel + ' renders a placeholder marker: "' + (m && m[0]) + '"');
  // Site copy only: migrated article bodies may use these words in their own sense ("mockup" in a design article).
  const copy = text(html.replace(/<article class="p-prose[\s\S]*?<\/article>/g, ' '));
  // Owner-confirmed Felon deliverables include mockups; the term describes the work, not a preview site.
  const productionCopy = rel === 'work/felon-motorwerk/index.html' ? copy.replace(/\bmockups?\b/gi, 'design presentations') : copy;
  const pw = PREVIEW_WORDING.exec(productionCopy);
  check(!pw, rel + ' renders demo or preview wording: "' + (pw && pw[0]) + '"');
  for (const h of hrefs(html)) check(await resolves(h), rel + ' links to "' + h + '" which does not resolve in dist/');
  const woff2 = new Set(Array.from(html.matchAll(/url\("([^"]+\.woff2(?:\?[^"]*)?)"\)/g), (m) => m[1]));
  const embedded = [...html.matchAll(/url\("data:font\/woff2;base64,([^"\)]+)"\)/g)];
  check(woff2.size === 2 && embedded.length === 1 && Buffer.from(embedded[0][1], 'base64').toString('ascii',0,4) === 'wOF2', rel + ' must ship two external font faces and one embedded display face');
  const preloads = html.match(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g) || [];
  const fontPreloads = new Set(preloads.map((tag) => tag.match(/href="([^"]+)"/)?.[1]));
  check(preloads.length === 3 && fontPreloads.size === 3 && [...woff2].every((src) => fontPreloads.has(src)) && fontPreloads.has("data:font/woff2;base64," + embedded[0]?.[1]), rel + ' must preload the embedded display face and both external font faces');
  if (!is404) check(/<meta property="og:url" content="https:\/\/www\.zincdigital\.co\/[^"]*\/"/.test(html) || rel === 'index.html', rel + ' og:url is missing or lacks trailing slash');
}

// ---- homepage structure ----
const home = pages.find((p) => p.rel === 'index.html');
if (home) {
  const order = ['id="hero"', 'id="loop"', 'id="hz"', 'id="work"', 'id="uso"', 'id="team"', 'id="notes"', 'id="inquiry"'];
  const pos = order.map((k) => home.html.indexOf(k));
  check(pos.every((p) => p >= 0), 'index.html is missing home sections: ' + order.filter((_, i) => pos[i] < 0).join(', '));
  check(pos.every((p, i) => i === 0 || p > pos[i - 1]), 'index.html home sections out of order');
  for (const s of SERVICE_SLUGS) check(home.html.includes('href="/services/' + s + '/"'), 'index.html is missing a link to /services/' + s + '/');
  check((home.html.match(/class="person rv"/g) || []).length === 7, 'index.html must render all 7 team members');
  check(home.html.includes('data-team'), 'index.html team grid lacks data-team (shuffle hook)');
}
// Homepage and Work reuse the approved lane art with live navigation.
if (home) {
  check(home.html.includes('data-zn-lane'), 'homepage lacks its service-lane controls');
  check((home.html.match(/<section[^>]*data-case-slider/g)||[]).length === 1, 'homepage must have one case slider');
  check(!home.html.includes('class="home-case-scenes"'), 'homepage has orphan case panels');
  for (const scene of ['build-uos','demand-summit','intelligence-fusion','intelligence-uos']) check(home.html.includes('data-scene="'+scene+'"'), 'homepage lacks approved mockup ' + scene);
  check(/class="band home-team" hidden/.test(home.html), 'saved staff must be hidden on home');
  check(home.html.includes('href="/work/us-oil-solutions/#website"') && home.html.includes('href="/work/us-oil-solutions/#operations-app"'), 'homepage must keep U.S. Oil website and app destinations separate');
  for (const lane of laneNames) check(home.html.includes('href="' + workLanes[lane].path + '"'), 'homepage lacks ' + lane + ' lane link');
}
for (const lane of laneNames) {
  const data = workLanes[lane];
  const page = pages.find(p => p.rel === data.path.slice(1) + 'index.html');
  check(!!page, 'missing lane page ' + data.path);
  if (!page) continue;
  check((page.html.match(/data-lane-project(?:\s|>)/g) || []).length === data.projects.length, lane + ' is missing project entries');
  for (const project of data.projects) if (project.scene) check(page.html.includes('data-scene="'+project.scene+'"'), lane + ' lacks approved scene ' + project.scene);
  check(page.html.includes('href="' + workLanes[data.next].path + '"'), lane + ' lacks next-lane link');
}
// ---- work + cases ----
const work = pages.find((p) => p.rel === 'work/index.html');
if (work) for (const s of CASE_SLUGS) check(hrefs(work.html).some(h => h.split('#')[0] === '/work/' + s + '/'), 'work/index.html is missing a link to /work/' + s + '/');
for (const s of CASE_SLUGS) {
  const p = pages.find((x) => x.rel === 'work/' + s + '/index.html');
  if (!p) continue;
  check(p.html.includes('data-case-hero="' + s + '"') && p.html.includes('data-case-mockup="' + s + '"') && p.html.includes('id="case-story"'), 'work/' + s + ' lacks the shared case-study layout');
  check(p.html.includes('data-case-footer="' + s + '"'), 'work/' + s + ' lacks the shared next-project navigation');
  if (!['bear-claw-usa','ballad-health','meade-tractor','general-shale'].includes(s)) check(p.html.includes('data-case-pages="' + s + '"'), 'work/' + s + ' lacks its detailed page presentation');
  for (const screenPage of caseScreens[s]?.pages || []) {
    for (const image of Object.values(screenPage.images)) check(p.html.includes(image + '.'), 'work/' + s + ' lacks its ' + screenPage.title + ' image: ' + image);
  }
  if (s === 'carla-funk-photography') {
    for (const id of ['website','upgrade','image-manager','identity']) check(p.html.includes('id="'+id+'"'), 'Carla lacks '+id);
  } else if (['meade-tractor','general-shale'].includes(s)) {
    check(p.html.includes(s+'-logo.') && p.html.includes('enterprise'), s+' lacks its logo or enterprise SEO context');
    check(!p.html.includes('data-device-composition'), s+' SEO case must not imply website design work');
  } else if (s === 'ballad-health') {
    check(p.html.includes('ballad-logo.') && p.html.includes('https://www.balladhealth.org/'), 'Ballad lacks its supplied logo or official website link');
    check(!p.html.includes('data-device-composition'), 'Ballad SEO case must not imply website design work');
  } else if (['fraim-cawley-company','smoky-mountain-survival','andrew-neese','porsche-roanoke'].includes(s)) {
    for (const id of ['overview','website','website-details']) check(p.html.includes('id="'+id+'"'), s+' lacks '+id);
  } else if (s === 'las-vegas-safety') {
    for (const id of ['before-after','website','identity','catalog','production','flyers']) check(p.html.includes('id="'+id+'"') && p.html.includes('href="#'+id+'"'), 'LVS lacks linked section '+id);
    check(!p.html.includes('case-lvs-'), 'LVS must not present the later client refresh as ZINC work');
    check(p.html.includes('catalog-image preparation') && p.html.includes('no additional charge') && p.html.includes('launch collateral'), 'LVS lacks owner-confirmed production context');
  } else if (s === 'miami-tactical') {
    for (const id of ['overview','website','logo','design-details']) check(p.html.includes('id="' + id + '"') && p.html.includes('href="#' + id + '"'), 'Miami Tactical lacks linked section ' + id);
  } else if (s === 'felon-motorwerk') {
    for (const id of ['website','apparel','brand-creative','merchandise','shop-signage','around-the-shop']) check(p.html.includes('id="' + id + '"'), 'Felon lacks gallery ' + id);
    check((p.html.match(/data-apparel-item/g)||[]).length === 25, 'Felon must show 25 selected apparel designs');
  } else {
    check((s === 'bear-claw-usa' ? p.html.includes('id="bear-title"') : p.html.includes('id="case-title"')) && p.html.includes(['bear-claw-usa','zinc-fusion-v16'].includes(s) ? 'data-case-pages="' + s + '"' : 'id="cHz"'), 'work/' + s + ' lacks the opener or website screenshots');
    const nonprofit = ['the-lampstand-va', 'straight-street-ministries'].includes(s);
    check(nonprofit ? /\/ The mission/.test(p.html) && /\/ Our support/.test(p.html) : /\/ The situation/.test(p.html) && /\/ The approach/.test(p.html), 'work/' + s + ' lacks its mission/support or situation/approach sections');
  }
  if (s === 'bear-claw-usa') {
    for (const page of ['home','product','applications','about','quote']) for (const device of ['desktop','tablet','mobile']) {
      check(p.html.includes('bear-claw-' + page + '-' + device + '.'), 'Bear Claw lacks its ' + page + ' ' + device + ' screenshot');
    }
    check(!p.html.includes('Brand and collateral') && !p.html.includes('business-card') && !p.html.includes('Product packaging'), 'Bear Claw must describe website work only');
  }
}
// ---- blog ----
const blog = pages.find((p) => p.rel === 'blog/index.html');
if (blog) { check((blog.html.match(/class="p-art"/g) || []).length === POST_SLUGS.length - 1, 'blog/index.html should list every post except the featured one'); check(blog.html.includes('data-blog-filters') && blog.html.includes('data-blog-topics'), 'blog/index.html lacks the filter bars'); }
for (const category of CATEGORY_SLUGS) {
  const p=pages.find(p=>p.rel==='blog/category/'+category+'/index.html');
  check(p?.html.includes('Service-aligned blog categories'),category+' lacks pillar category navigation');
  check(p?.html.includes('/services/'+category+'/'),category+' lacks its aligned service');
  check(!p?.html.includes('https://www.zincdigital.co/blog/category/\"'),category+' breadcrumb has a nonexistent intermediate page');
}
const hub=pages.find(p=>p.rel==='blog/build-a-content-hub-people-can-use/index.html');
for (const file of ['content-hub-workbook.pdf','content-hub-architecture.pdf']) {
  check(await exists(path.join(distDir,'downloads',file)),'missing built download '+file);
  check(hub?.html.includes('/downloads/'+file),'article lacks '+file);
}
for (const file of ['pillar-map.svg','link-plan.svg']) check(hub?.html.includes('/media/content-hub/'+file),'article lacks inline '+file);
const articleSocialImages = new Set();
for (const s of POST_SLUGS) {
  const p = pages.find((x) => x.rel === 'blog/' + s + '/index.html');
  if (!p) continue;
  check(/<article class="p-prose rv" data-source-id="\d+">[\s\S]*?<p(?: class="first")?>/.test(p.html), 'blog/' + s + ' does not render the article body');
  const sourceSection = p.html.match(/<section[^>]*data-article-sources[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const authoredSources = p.html.match(/<h2[^>]*>Trusted Source Links<\/h2>\s*<ul>([\s\S]*?)<\/ul>/)?.[1];
  check(/<a\s[^>]*href="https:\/\/[^" ]+"/.test(sourceSection || authoredSources || ''), 'blog/' + s + ' lacks linked source references');
  const noInlineArtwork = ['research-consensus-report','ai-research-workflow','ai-competitor-research-prompts','wordpress-php-security-moving-to-astro','build-a-content-hub-people-can-use'].includes(s);
  check(noInlineArtwork ? !p.html.includes('data-article-illustration') : p.html.includes('data-article-illustration'), 'blog/' + s + ' has an unexpected supporting illustration state');
  check(p.html.includes('aria-label="Share this article"') && p.html.includes('data-author-card') && p.html.includes('data-share-url="' + SITE + '/blog/' + s + '/"'), 'blog/' + s + ' lacks sharing or author attribution');
  check(/class="p-article-hero"/.test(p.html) && /image\/avif/.test(p.html) && /image\/webp/.test(p.html), 'blog/' + s + ' lacks responsive article artwork');
  check(/<nav class="p-reading" aria-label="Related articles">/.test(p.html), 'blog/' + s + ' lacks a published reading path');
  const social = p.html.match(/property="og:image" content="([^"]+)"/)?.[1];
  check(!!social && !social.endsWith('/og/article.png') && !articleSocialImages.has(social), 'blog/' + s + ' lacks its own social artwork');
  if (social) articleSocialImages.add(social);
  check(/property="og:image:alt" content="[^"]+"/.test(p.html), 'blog/' + s + ' lacks descriptive image metadata');
  const ld = p.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (ld) {
    const article = JSON.parse(ld)['@graph']?.find(node => node['@type'] === 'Article');
    check(article?.image === social && article?.keywords?.length >= 3 && article?.articleSection, 'blog/' + s + ' article metadata disagrees with its image or topic');
  }
}
if (blog) check(/aria-label="Article guides"/.test(blog.html), 'blog/index.html lacks the guide navigation');
// ---- contact ----
const contact = pages.find((p) => p.rel === 'contact/index.html');
if (contact) { check(contact.html.includes('data-inquiry-form'), 'contact lacks the form'); check((contact.html.match(/<input\b[^>]*\bdata-service\b/g) || []).length === SERVICE_SLUGS.length, 'contact form should list every service as a checkbox'); }
// ---- redirects: an alias is never a real page (a redirect output file is allowed), and Vercel's route table,
// replayed in order up to the filesystem handler, answers it with one 301 to the case, with or without the slash ----
for (const f of ALIAS_FILES) if (htmlFiles.includes(f)) check((await readText(f)).includes('http-equiv="refresh"'), f + ' should be a redirect file, not a page');
const vercelConfig = JSON.parse((await readFile(path.join(root, '.vercel/output/config.json'), 'utf8').catch(() => 'null')) || 'null');
check(!!vercelConfig, '.vercel/output/config.json missing — build with the Vercel adapter first');
const firstRoute = (p) => { for (const r of vercelConfig?.routes || []) { if (r.handle) return null; if (!r.continue && r.src && new RegExp(r.src).test(p)) return r; } return null; };
for (const [from, to] of Object.entries(redirects)) for (const p of [from, from.replace(/\/$/, '')]) {
  const r = firstRoute(p);
  check(r?.status === 301 && r.headers?.Location === to, 'Vercel routes answer ' + p + ' with ' + (r ? r.status + ' ' + (r.headers?.Location || r.dest || '') : 'nothing before the filesystem') + ', expected 301 ' + to);
}
// ---- built CSS: no underline affordance, no stray color literals outside tokens is a src concern (see below) ----
const astroDir = path.join(distDir, '_astro');
if (await exists(astroDir)) for (const f of (await readdir(astroDir, { recursive: true })).filter((e) => e.endsWith('.css'))) check(!(await readFile(path.join(astroDir, f), 'utf8')).toLowerCase().includes('underline'), '_astro/' + f + ' contains "underline"');
// Page CSS is inlined (build.inlineStylesheets), so scan the <style> blocks too.
// Owner-approved BI design (15 Oct 2026): the emphasized heading uses an underline. Exempt only that exact rule on that route.
for (const { rel, html } of pages) for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
  const css = rel === 'services/business-intelligence/index.html'
    ? m[1].replace(/(^|[{}])\s*\.bi-platform\s+\.bi-underlined\s*\{[^{}]*\}/g, '$1')
    : m[1];
  check(!css.toLowerCase().includes('underline'), rel + ' has inline CSS containing "underline"');
}
// ---- src scans: banned abbreviation, section sign ----
const SRC_EXT = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.md', '.mdx', '.json']);
const PROVENANCE = /^\s*"(sourceTitle|sourceSlug|sourceUrl)"\s*:/;
const sectionSign = Buffer.from([0xc2, 0xa7]);
for (const e of await readdir(path.join(root, 'src'), { recursive: true })) {
  if (!SRC_EXT.has(path.extname(e))) continue;
  const file = path.join(root, 'src', e); let buf; try { buf = await readFile(file); } catch { continue; }
  let s = buf.toString('utf8');
  if (e.endsWith('posts.preview.json')) s = s.split('\n').filter((l) => !PROVENANCE.test(l)).join('\n');
  check(!BANNED_ABBREVIATION.test(s), 'src/' + e + ' contains the banned abbreviation for generative search');
  check(!buf.includes(sectionSign), 'src/' + e + ' contains the U+00A7 section-sign character');
  if (e !== path.join('styles', 'tokens.css') && e.endsWith('.css')) { /* colors allowed in site.css/home.css for shadows/alpha; tokens hold the palette */ }
}
// ---- JS budget: 15 KB gzip per page, unchanged from the preview gate (external + inline, de-duplicated) ----
const JS_BUDGET = 15360; const cache = new Map(); // first-party only: external scripts (e.g. googletagmanager.com) are not counted
const readJs = async (src) => { const c = src.split('?')[0]; if (cache.has(c)) return cache.get(c); let t = null; try { t = await readFile(path.join(distDir, c.replace(/^\//, '')), 'utf8'); } catch {} cache.set(c, t); return t; };
for (const { rel, html } of pages) {
  const chunks = []; const seen = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) { const b = m[1].trim(); if (b && !/application\/ld\+json/.test(m[0])) chunks.push(Buffer.from(b)); }
  const queue = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g), (m) => m[1]).filter((s) => s.startsWith('/'));
  while (queue.length) { const src = queue.shift(); const c = src.split('?')[0]; if (seen.has(c)) continue; seen.add(c); const t = await readJs(c); if (t == null) { fail(rel + ' references script ' + src + ' which does not exist'); continue; } chunks.push(Buffer.from(t)); const dir = path.posix.dirname(c); for (const imp of t.matchAll(/import\s*(?:[^'"]*?from\s*)?["']([^"']+)["']/g)) { const sp = imp[1]; if (sp.startsWith('.') || sp.startsWith('/')) queue.push(sp.startsWith('/') ? sp : path.posix.normalize(path.posix.join(dir, sp))); } }
  const bytes = chunks.reduce((n, b) => n + gzipSync(b).length, 0);
  check(bytes <= JS_BUDGET, rel + ' ships ' + bytes + ' gzip bytes of script, over ' + JS_BUDGET);
}

// Reconciled client grouping: one card per client, complete links and one next-project loop.
const overview = pages.find(p => p.rel === 'work/index.html')?.html || '';
const listedClients = [...overview.matchAll(/data-client="([^"]+)"/g)].map(m => m[1]);
check(JSON.stringify(listedClients) === JSON.stringify(clientOrder), 'Work must list each current client once, in portfolio order');
for (const slug of clientOrder) {
  const page = pages.find(p => p.rel === 'work/'+slug+'/index.html')?.html || '';
  const footer = page.match(/<footer[^>]*data-case-footer[^>]*>([\s\S]*?)<\/footer>/)?.[1] || '';
  check(footer.includes('href="/work/'+nextClient(slug)+'/"'), slug+' has an incorrect next-project destination');
  for (const entry of workFor(slug)) {
    check(overview.includes('href="'+entry.href+'"'), slug+' lacks an engagement link on Work');
    check(page.includes('href="'+entry.href+'"'), slug+' lacks an engagement link in its rail');
    const anchor = entry.href.split('#')[1];
    if(anchor) check(page.includes('id="'+anchor+'"'), slug+' engagement points to missing section '+anchor);
  }
}
check(overview.includes('"@type":"ItemList"'), 'Work lacks its portfolio ItemList');
check(fusion.includes('"name":"ZINC Fusion v16"'), 'Fusion application schema must retain its registered product name');

// ---- headers in markup: Astro's hashed CSP meta policy on every page (frame-ancestors is a vercel.json header) ----
for (const { rel, html } of pages) {
  const policy = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/)?.[1] || '';
  const scripts = policy.match(/(?:^|;)\s*script-src ([^;]+)/)?.[1] || '';
  check(scripts.includes("'self'") && scripts.includes("'sha256-") && !/'unsafe-inline'|'unsafe-eval'/.test(scripts), rel + ' lacks a hashed script policy without unsafe-inline or unsafe-eval');
}

// ---- secrets (R15.2): nothing in the static output may look like a credential ----
// A Supabase JWT is a secret unless its role is anon (the anon key is public by design).
const SECRET_PATTERNS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['Supabase secret key', /\bsb_secret_[A-Za-z0-9_-]{16,}/],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI API key', /\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{32,}/],
  ['Resend API key', /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['Google OAuth client secret', /\bGOCSPX-[A-Za-z0-9_-]{20,}/],
  ['AWS access key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['secret variable with a value', /\b(?:SUPABASE_SERVICE_ROLE|SMTP_PASS|INQUIRY_HASH_SALT|OPENAI_API_KEY|ANTHROPIC_API_KEY|RESEND_API_KEY|CODEX_BRIDGE_TOKEN|VERCEL_BYPASS_SECRET)["']?\s*[:=]\s*["']?[A-Za-z0-9_\-./+]{12,}/],
];
const jwtRole = (payload) => { try { return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).role; } catch { return undefined; } };
const TEXT_FILE = /\.(?:html|js|mjs|cjs|css|json|txt|xml|svg|map|webmanifest)$/;
for (const rel of (await readdir(distDir, { recursive: true })).filter((f) => TEXT_FILE.test(f)).sort()) {
  const body = await readFile(path.join(distDir, rel), 'utf8');
  for (const [name, re] of SECRET_PATTERNS) if (re.test(body)) fail('dist/client/' + rel + ' contains what looks like a secret (' + name + ')');
  for (const m of body.matchAll(/\beyJ[A-Za-z0-9_-]{8,}\.(eyJ[A-Za-z0-9_-]{8,})\.[A-Za-z0-9_-]{8,}/g)) if (jwtRole(m[1]) !== 'anon') fail('dist/client/' + rel + ' contains a JWT with role ' + (jwtRole(m[1]) ?? 'unknown') + ' (only the anon key may ship)');
}

if (failures.length) { console.error('check-site.mjs: ' + failures.length + ' failure(s):'); for (const f of failures) console.error('  - ' + f); process.exitCode = 1; }
else console.log('check-site.mjs: all checks passed across ' + htmlFiles.length + ' HTML file(s)');
