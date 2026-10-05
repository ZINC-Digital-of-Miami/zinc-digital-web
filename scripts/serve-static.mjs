#!/usr/bin/env node
// Static server for the built site on 127.0.0.1, used by verify-site.mjs because @astrojs/vercel has no
// `astro preview`. It mirrors what Vercel does with this build: the redirect and trailing-slash routes from
// .vercel/output/config.json (replayed in order), files from dist/client/ (directory → index.html), the
// designed 404 page with status 404, the headers from vercel.json, and brotli/gzip for text like Vercel's edge. On-demand routes (/admin/, /api/,
// /contact/send/) are not served; they answer 501 so a crawl can tell them apart from missing pages.
// Usage: node scripts/serve-static.mjs [--port 4329]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const root = process.cwd();
const dist = path.join(root, 'dist', 'client');
const args = process.argv.slice(2);
const port = Number(args.includes('--port') ? args[args.indexOf('--port') + 1] : 4329);
const vercelConfig = JSON.parse(await readFile(path.join(root, '.vercel/output/config.json'), 'utf8'));
const vercelJson = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };

// Routes before Vercel's filesystem handler: redirects (status + Location) and header-only `continue` routes.
const preRoutes = []; for (const r of vercelConfig.routes) { if (r.handle) break; if (r.src) preRoutes.push(r); }
// Routes after it that point at the function: on-demand pages this server cannot render.
const fnRoutes = vercelConfig.routes.filter((r) => r.dest && !r.dest.startsWith('/') && r.src).map((r) => new RegExp(r.src));
const headerRules = (vercelJson.headers || []).map((h) => ({ re: new RegExp('^' + h.source + '$'), headers: h.headers }));
// Compress text responses the way Vercel's edge does, so Lighthouse sees realistic transfer sizes.
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;
const send = (req, res, status, headers, body) => {
  const enc = req.headers['accept-encoding'] || '';
  if (COMPRESSIBLE.test(headers['content-type'] || '') && body.length > 1024 && /\b(br|gzip)\b/.test(enc)) {
    const br = /\bbr\b/.test(enc); body = br ? brotliCompressSync(body) : gzipSync(body);
    headers = { ...headers, 'content-encoding': br ? 'br' : 'gzip', vary: 'Accept-Encoding' };
  }
  res.writeHead(status, { ...headers, 'content-length': body.length }); res.end(body);
};
const fileAt = async (p) => { try { const s = await stat(p); return s.isFile() ? p : null; } catch { return null; } };

http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  const pathname = decodeURIComponent(url.pathname);
  const headers = {};
  for (const rule of headerRules) if (rule.re.test(pathname)) for (const h of rule.headers) headers[h.key] = h.value;
  for (const r of preRoutes) {
    const m = new RegExp(r.src).exec(pathname); if (!m) continue;
    if (r.continue) { Object.assign(headers, r.headers); continue; }
    if (r.status && r.headers?.Location) { const loc = r.headers.Location.replace(/\$(\d)/g, (_, i) => m[Number(i)] ?? ''); res.writeHead(r.status, { ...headers, Location: loc + url.search }); return res.end(); }
  }
  if (fnRoutes.some((re) => re.test(pathname))) { res.writeHead(501, { ...headers, 'content-type': 'text/plain' }); return res.end('on-demand route: not served by serve-static'); }
  const rel = pathname.replace(/^\/+/, '');
  const file = (await fileAt(path.join(dist, rel))) || (await fileAt(path.join(dist, rel, 'index.html')));
  if (file && file.startsWith(dist)) return send(req, res, 200, { ...headers, 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }, await readFile(file));
  send(req, res, 404, { ...headers, 'content-type': TYPES['.html'] }, await readFile(path.join(dist, '404.html')).catch(() => Buffer.from('Not found')));
}).listen(port, '127.0.0.1', () => console.log('serve-static: http://127.0.0.1:' + port + ' serving ' + path.relative(root, dist)));
