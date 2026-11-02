#!/usr/bin/env node
// Validate the committed asset manifest. Source fields are provenance, never download endpoints.
import { stat } from 'node:fs/promises';
import path from 'node:path';
import assets from '../src/data/assets.site.json' with { type: 'json' };

const roots = ['src/assets', 'public'].map(root => path.resolve(root));
const failures = [];
for (const [key, asset] of Object.entries(assets)) {
  if (typeof asset.src !== 'string' || !asset.src.startsWith('/') || asset.src.startsWith('//') || asset.src.split('/').includes('..')) {
    failures.push(`${key}: expected an approved local asset path`);
    continue;
  }
  if (!(asset.width > 0 && asset.height > 0)) failures.push(`${key}: missing image dimensions`);
  let found = false;
  for (const root of roots) {
    try {
      const file = await stat(path.join(root, asset.src.slice(1)));
      if (file.isFile() && file.size > 0) { found = true; break; }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (!found) failures.push(`${key}: missing local file ${asset.src}`);
}
if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else console.log(`Verified ${Object.keys(assets).length} committed assets; no remote sources requested.`);
