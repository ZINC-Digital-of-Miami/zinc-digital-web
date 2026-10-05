#!/usr/bin/env node
// Deployment behaviour (design section 11, task 13.1), run against a Vercel preview or production URL:
// - every built page in dist/client answers 200 with HTML, and an unknown path answers 404;
// - admin pages 302 to sign-in and staff APIs 401 without a session; sign-in, confirm and sign-out stay public;
// - API methods: an unsupported method is refused, an oversized inquiry is 413, a cross-site form post is 403;
// - admin, auth and API responses are noindex and no-store; every response sends frame-ancestors 'none';
// - the server function in the build output runs on Node 24.
// Build the same commit first (npm run build). A protected preview needs VERCEL_BYPASS_SECRET (Protection
// Bypass for Automation) in the environment or the git-ignored .env; it is sent as a header, never printed.
// Usage: node scripts/check-deploy.mjs <base-url>
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { PRIVATE_ROUTES } from '../src/data/private-routes.ts';
import { MAX_BODY_BYTES } from '../src/lib/inquiry.ts';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!/^https?:\/\/[^/]+$/.test(base)) { console.error('usage: node scripts/check-deploy.mjs <base-url>'); process.exit(2); }
try { process.loadEnvFile('.env'); } catch { /* the variable may already be in the environment */ }
const bypass = process.env.VERCEL_BYPASS_SECRET || '';
const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist', 'client');

const failures = [];
let checks = 0;
const check = (ok, msg) => { checks++; if (!ok) failures.push(msg); };
const req = (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init, headers: { ...(bypass ? { 'x-vercel-protection-bypass': bypass } : {}), ...init.headers } });
const h = (r, name) => r.headers.get(name) || '';
const framed = (r, p) => check(/frame-ancestors 'none'/.test(h(r, 'content-security-policy')), p + ' has no frame-ancestors \'none\'');
const privateHeaders = (r, p) => {
  check(/noindex/.test(h(r, 'x-robots-tag')), p + ' is not noindex (x-robots-tag: ' + h(r, 'x-robots-tag') + ')');
  check(/no-store/.test(h(r, 'cache-control')), p + ' is not no-store (cache-control: ' + h(r, 'cache-control') + ')');
  framed(r, p);
};
const expect = async (p, init, status, extra = () => {}) => {
  const r = await req(p, init);
  check(r.status === status, (init?.method || 'GET') + ' ' + p + ' answered ' + r.status + ', expected ' + status);
  await extra(r);
  await r.body?.cancel();
  return r;
};

// Vercel Authentication answers 401, or a 302 to its SSO page, when the bypass is missing or wrong.
const first = await req('/');
if (first.status === 401 || first.status === 403 || /^https:\/\/vercel\.com\/sso/.test(h(first, 'location'))) {
  console.error('check-deploy: ' + base + ' answered ' + first.status + (bypass ? ' with the bypass header; check VERCEL_BYPASS_SECRET.' : '; set VERCEL_BYPASS_SECRET for a protected preview.'));
  process.exit(1);
}
await first.body?.cancel();

// Pages: everything the build wrote, except the 404 page, which the unknown path checks.
const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])))).flat();
const pages = (await walk(distDir)).map((f) => path.relative(distDir, f).split(path.sep).join('/'))
  .filter((f) => f.endsWith('.html') && f !== '404.html' && f !== '404/index.html')
  .map((f) => '/' + f.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '/'));
for (let i = 0; i < pages.length; i += 8) {
  await Promise.all(pages.slice(i, i + 8).map((p) => expect(p, {}, 200, (r) => {
    check(h(r, 'content-type').startsWith('text/html'), p + ' is not text/html');
    check(h(r, 'x-content-type-options') === 'nosniff', p + ' has no nosniff');
    framed(r, p);
  })));
}
await expect('/check-deploy-unknown-path/', {}, 404, (r) => { check(h(r, 'content-type').startsWith('text/html'), 'the 404 page is not text/html'); framed(r, '404'); });

// Admin and staff routes without a session.
for (const r of PRIVATE_ROUTES) {
  if (r.kind === 'page') await expect(r.path, {}, 302, (res) => { check(h(res, 'location').startsWith('/admin/login/?next='), r.path + ' does not redirect to sign-in'); privateHeaders(res, r.path); });
  else await expect(r.path, { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: '{}' }, 401, (res) => privateHeaders(res, 'POST ' + r.path));
}
await expect('/admin/login/', {}, 200, (r) => privateHeaders(r, '/admin/login/'));
await expect('/admin/auth/confirm/', {}, 303, (r) => { check(h(r, 'location').startsWith('/admin/login/?error=link'), '/admin/auth/confirm/ without a token does not return to sign-in'); privateHeaders(r, '/admin/auth/confirm/'); });
await expect('/api/admin/signout/', { method: 'POST', headers: { origin: base } }, 303, (r) => { check(h(r, 'location').startsWith('/admin/login/'), 'sign-out does not return to sign-in'); privateHeaders(r, 'POST /api/admin/signout/'); });

// Contact routes and API methods.
await expect('/api/inquiries/', {}, 404, (r) => privateHeaders(r, 'GET /api/inquiries/'));
await expect('/api/inquiries/', { method: 'POST', headers: { 'content-type': 'application/json', origin: base }, body: JSON.stringify({ message: 'x'.repeat(MAX_BODY_BYTES) }) }, 413, (r) => privateHeaders(r, 'POST /api/inquiries/ (oversized)'));
await expect('/contact/send/', {}, 303, (r) => { check(h(r, 'location').endsWith('/contact/'), 'GET /contact/send/ does not return to /contact/'); check(/no-store/.test(h(r, 'cache-control')), '/contact/send/ is not no-store'); });
await expect('/contact/send/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: 'https://cross-site.example' }, body: 'name=x' }, 403);

// The function runtime the adapter wrote for this build.
const funcs = path.join(root, '.vercel', 'output', 'functions');
for (const f of (await readdir(funcs)).filter((d) => d.endsWith('.func'))) {
  const runtime = JSON.parse(await readFile(path.join(funcs, f, '.vc-config.json'), 'utf8')).runtime;
  check(runtime === 'nodejs24.x', f + ' runtime is ' + runtime + ', expected nodejs24.x');
}

for (const f of failures) console.error('FAIL ' + f);
console.log('check-deploy.mjs: ' + (checks - failures.length) + '/' + checks + ' checks passed against ' + base + ' (' + pages.length + ' pages)');
process.exit(failures.length ? 1 : 0);
