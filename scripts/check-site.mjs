#!/usr/bin/env node
// Static dist/ gate for the Oct 2026 redesign. Exits non-zero with every failure listed.
// Replaces the preview-era assertions (thread ids, noindex everywhere, [RECEIPT]/
// [OWNER CONFIRM] markers, data-theme="dark" ban, data-home-band order) with the
// launch set: real SEO head on every page, no placeholder markers, dark theme
// allowed, link integrity, font output, JS budget.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

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

// ---- expected route set: 43 HTML pages (42 routes + 404). Literal duplicate of site.ts on purpose: catches drift ----
const SERVICE_SLUGS = ['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence'];
const CASE_SLUGS = ['once-upon-a-book-club','us-oil-solutions','las-vegas-safety','summit-marine-development'];
const STATIC = ['', 'services', 'work', 'about', 'contact', 'thanks', 'blog', 'privacy', 'terms', '404'];
const postsPreview = JSON.parse(await readFile(path.join(root, 'src/data/posts.preview.json'), 'utf8'));
const POST_SLUGS = postsPreview.posts.map((p) => p.slug);
check(POST_SLUGS.length === 18, 'posts.preview.json should hold 18 posts, found ' + POST_SLUGS.length);
const expected = [
  ...STATIC.map((s) => (s ? s + '/index.html' : 'index.html')),
  ...SERVICE_SLUGS.map((s) => 'services/' + s + '/index.html'),
  ...CASE_SLUGS.map((s) => 'work/' + s + '/index.html'),
  ...POST_SLUGS.map((s) => 'blog/' + s + '/index.html'),
];
for (const e of expected) check(htmlFiles.includes(e) || htmlFiles.includes(e.replace('404/index.html', '404.html')), 'missing built page: ' + e);
const extra = htmlFiles.filter((f) => !expected.includes(f) && f !== '404.html');
check(extra.length === 0, 'unexpected built pages: ' + extra.join(', '));
check(await exists(path.join(distDir, 'sitemap.xml')), 'dist/sitemap.xml missing');
check(await exists(path.join(distDir, 'robots.txt')), 'dist/robots.txt missing');
for (const img of ['og/home.png','og/work.png','og/build.png','og/demand.png','og/intelligence.png','og/article.png','brand/zinc-badge.png','logos/general-shale.png','logos/ouabc.webp','logos/us-oil.png','logos/google-partner.png']) check(await exists(path.join(distDir, img)), 'dist/' + img + ' missing');
// Case images live in src/assets/work/ (fetched by scripts/fetch-live-assets.mjs) and ship through astro:assets.
const siteAssets = JSON.parse(await readFile(path.join(root, 'src/data/assets.site.json'), 'utf8'));
for (const [key, a] of Object.entries(siteAssets)) if (a.source) check(await exists(path.join(root, 'src/assets', a.src)), 'src/assets' + a.src + ' missing for ' + key + ' (run npm run assets)');

// ---- per page ----
const NOINDEX_OK = new Set(['thanks/index.html', '404.html', '404/index.html']);
const PLACEHOLDER = /\[(RECEIPT|OWNER CONFIRM|LOGO|PHOTO PENDING)[^\]]*\]|Receipt pending|receipt pending|\bTBD\b|lorem ipsum/i;
const BANNED_ABBREVIATION = new RegExp('\\b' + String.fromCharCode(71, 69, 79) + '\\b');
const text = (html) => html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
const hrefs = (html) => Array.from(html.matchAll(/href=["']([^"']+)["']/g), (m) => m[1]);
// On-demand (server-rendered) routes are not in dist/; they are gated by src/middleware.ts.
const SERVER_ROUTES = ['/admin/', '/admin/login/', '/admin/callback/', '/api/inquiries', '/api/inquiries/email', '/api/research/chat', '/api/research/ingest'];
const resolves = async (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true;
  if (SERVER_ROUTES.includes(clean)) return true;
  if (clean === '/') return exists(path.join(distDir, 'index.html'));
  const rel = clean.replace(/^\/+/, '');
  return (await exists(path.join(distDir, rel))) || (await exists(path.join(distDir, rel, 'index.html')));
};
for (const { rel, html } of pages) {
  const is404 = rel === '404.html' || rel === '404/index.html';
  check(/<title>[^<]+<\/title>/.test(html), rel + ' has no <title>');
  check(/<meta name="description" content="[^"]{20,}"/.test(html), rel + ' has no usable meta description');
  check(/<link rel="canonical" href="https:\/\/www\.zincdigital\.co\/[^"]*"/.test(html), rel + ' has no canonical');
  check(/<meta property="og:image" content="https:\/\/www\.zincdigital\.co\/og\/[a-z]+\.png"/.test(html), rel + ' has no og:image');
  check(/<script type="application\/ld\+json">/.test(html), rel + ' has no JSON-LD');
  const hasNoindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  check(hasNoindex === NOINDEX_OK.has(rel), rel + (hasNoindex ? ' is noindex but should be indexable' : ' must be noindex'));
  check(html.includes('id="themeToggle"') && /<span data-theme-label>Dark mode<\/span>/.test(html), rel + ' is missing the light/dark toggle with its "Dark mode" label');
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
  for (const h of hrefs(html)) check(await resolves(h), rel + ' links to "' + h + '" which does not resolve in dist/');
  const woff2 = new Set(Array.from(html.matchAll(/url\("([^"?]+\.woff2)(?:\?[^"]*)?"\)/g), (m) => m[1]));
  check(woff2.size === 3, rel + ' has ' + woff2.size + ' woff2 sources, expected 3');
  const preloads = html.match(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g) || [];
  check(preloads.length === 1, rel + ' has ' + preloads.length + ' font preloads, expected 1');
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
// ---- work + cases ----
const work = pages.find((p) => p.rel === 'work/index.html');
if (work) for (const s of CASE_SLUGS) check(work.html.includes('href="/work/' + s + '/"'), 'work/index.html is missing a link to /work/' + s + '/');
for (const s of CASE_SLUGS) { const p = pages.find((x) => x.rel === 'work/' + s + '/index.html'); if (p) { check(p.html.includes('id="cOpen"') && p.html.includes('id="cHz"'), 'work/' + s + ' lacks the opener or screenshot scroller'); check(/\/ The situation/.test(p.html) && /\/ The approach/.test(p.html), 'work/' + s + ' lacks situation/approach'); } }
// ---- blog ----
const blog = pages.find((p) => p.rel === 'blog/index.html');
if (blog) { check((blog.html.match(/class="p-art"/g) || []).length === 17, 'blog/index.html should list 17 cards (18 posts minus the featured one)'); check(blog.html.includes('data-blog-filters') && blog.html.includes('data-blog-topics'), 'blog/index.html lacks the filter bars'); }
for (const s of POST_SLUGS) { const p = pages.find((x) => x.rel === 'blog/' + s + '/index.html'); if (p) check(/<article class="p-prose rv" data-source-id="\d+">[\s\S]*<p class="first">/.test(p.html), 'blog/' + s + ' does not render the article body'); }
// ---- contact ----
const contact = pages.find((p) => p.rel === 'contact/index.html');
if (contact) { check(contact.html.includes('data-demo-form'), 'contact lacks the form'); check((contact.html.match(/<input\b[^>]*\bdata-service\b/g) || []).length === SERVICE_SLUGS.length, 'contact form should list every service as a checkbox'); }
// ---- redirects: the alias must not be a real page and must appear in Vercel config output ----
check(!htmlFiles.includes('work/summit-marine/index.html') || (await readFile(path.join(distDir, 'work/summit-marine/index.html'), 'utf8')).includes('http-equiv="refresh"'), 'work/summit-marine should be a redirect, not a page');
// ---- built CSS: no underline affordance, no stray color literals outside tokens is a src concern (see below) ----
const astroDir = path.join(distDir, '_astro');
if (await exists(astroDir)) for (const f of (await readdir(astroDir, { recursive: true })).filter((e) => e.endsWith('.css'))) check(!(await readFile(path.join(astroDir, f), 'utf8')).toLowerCase().includes('underline'), '_astro/' + f + ' contains "underline"');
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
const JS_BUDGET = 15 * 1024; const cache = new Map();
const readJs = async (src) => { const c = src.split('?')[0]; if (cache.has(c)) return cache.get(c); let t = null; try { t = await readFile(path.join(distDir, c.replace(/^\//, '')), 'utf8'); } catch {} cache.set(c, t); return t; };
for (const { rel, html } of pages) {
  const chunks = []; const seen = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) { const b = m[1].trim(); if (b && !/application\/ld\+json/.test(m[0])) chunks.push(Buffer.from(b)); }
  const queue = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g), (m) => m[1]).filter((s) => s.startsWith('/'));
  while (queue.length) { const src = queue.shift(); const c = src.split('?')[0]; if (seen.has(c)) continue; seen.add(c); const t = await readJs(c); if (t == null) { fail(rel + ' references script ' + src + ' which does not exist'); continue; } chunks.push(Buffer.from(t)); const dir = path.posix.dirname(c); for (const imp of t.matchAll(/import\s*(?:[^'"]*?from\s*)?["']([^"']+)["']/g)) { const sp = imp[1]; if (sp.startsWith('.') || sp.startsWith('/')) queue.push(sp.startsWith('/') ? sp : path.posix.normalize(path.posix.join(dir, sp))); } }
  const bytes = chunks.reduce((n, b) => n + gzipSync(b).length, 0);
  check(bytes <= JS_BUDGET, rel + ' ships ' + bytes + ' gzip bytes of script, over ' + JS_BUDGET);
}

// ---- headers in markup: Astro's hashed CSP meta policy on every page (frame-ancestors is a vercel.json header) ----
for (const { rel, html } of pages) check(/<meta http-equiv="content-security-policy" content="[^"]*script-src 'self' 'sha256-/.test(html), rel + ' lacks the hashed content-security-policy meta tag');

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
