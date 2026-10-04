#!/usr/bin/env node
// Pulls the case images that still live on the WordPress site into src/assets/work/
// (rendered through astro:assets) so nothing hot-links once WP is retired. Idempotent: skips files that exist.
// Run once before build: `node scripts/fetch-live-assets.mjs`
// Also converts nothing — keep PNG so the dims in assets.site.json stay true.
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import assets from '../src/data/assets.site.json' with { type: 'json' };

const out = path.join(process.cwd(), 'src', 'assets');
let fetched = 0, skipped = 0, failed = 0;
for (const [key, a] of Object.entries(assets)) {
  if (!a.source) continue;
  const dest = path.join(out, a.src.replace(/^\//, ''));
  try { await access(dest); skipped++; continue; } catch {}
  await mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(a.source);
  if (!res.ok) { failed++; console.error('FAIL', key, res.status, a.source); continue; }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  fetched++; console.log('ok  ', key, '→', a.src);
}
console.log(`fetched ${fetched}, skipped ${skipped}, failed ${failed}`);
if (failed) process.exitCode = 1;
