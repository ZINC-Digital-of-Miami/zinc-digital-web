#!/usr/bin/env node
// Static dist/ gate. Reads the built site and exits non-zero with a list of
// every failure. Structured so later plan tasks can append their own
// assertion groups below the SECTION markers rather than rewriting this file.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const failures = [];
const fail = (message) => failures.push(message);
const check = (condition, message) => {
  if (!condition) fail(message);
};

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { recursive: true });
  return entries.filter((entry) => entry.endsWith('.html')).sort();
}

async function pathExists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

// Retired-route needles, built from concatenated fragments so this file's own
// source never contains the literal substrings it is scanning dist/ for —
// otherwise the plan's own "no leftover pairing/preview code" grep over
// src/scripts/astro.config.mjs would flag this legitimate negative assertion.
const join = (...parts) => parts.join('');
const DATA_PAIRING_ATTR = join('data', '-', 'pairing');
const DESIGN_PREVIEW_PATH = join('/', 'design', '-preview/');
const DESIGN_PREVIEW_DIR = join('design', '-preview');

const htmlFiles = await listHtmlFiles(distDir);
check(htmlFiles.length > 0, 'dist/ contains no built HTML files — run npm run build first');

const pages = [];
for (const relativePath of htmlFiles) {
  const html = await readFile(path.join(distDir, relativePath), 'utf8');
  pages.push({ relativePath, html });
}

// ---------------------------------------------------------------------------
// SECTION: Task 1 (tracer) — thread on every page, fonts, no pairing/preview
// ---------------------------------------------------------------------------
for (const { relativePath, html } of pages) {
  check(html.includes('id="thread"'), relativePath + ' is missing id="thread"');
  check(html.includes('id="thread-dot"'), relativePath + ' is missing id="thread-dot"');
  check(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex[^"]*"/.test(html), relativePath + ' is missing a noindex robots meta');
  check(!html.includes(DATA_PAIRING_ATTR), relativePath + ' still contains ' + DATA_PAIRING_ATTR);
  check(!html.includes(DESIGN_PREVIEW_PATH), relativePath + ' still references ' + DESIGN_PREVIEW_PATH);

  const preloads = Array.from(html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g));
  check(preloads.length === 1, relativePath + ' has ' + preloads.length + ' font preloads, expected exactly 1');

  const woff2Sources = new Set(Array.from(html.matchAll(/url\("([^"]+\.woff2)"\)/g), (match) => match[1]));
  check(woff2Sources.size === 3, relativePath + ' has ' + woff2Sources.size + ' distinct woff2 sources, expected exactly 3: ' + JSON.stringify([...woff2Sources]));
}

check(!(await pathExists(path.join(distDir, DESIGN_PREVIEW_DIR))), 'dist/' + DESIGN_PREVIEW_DIR + ' still exists');

// U+00A7 (section sign) byte scan of every file changed on this branch versus
// origin/main plus every untracked file. The needle is built from its UTF-8
// bytes (0xC2 0xA7) so this file never contains the character itself.
const sectionSignNeedle = Buffer.from([0xc2, 0xa7]);
function gitLines(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    fail('git command failed: git ' + args.join(' ') + ' — ' + error.message);
    return [];
  }
}
const changedFiles = gitLines(['diff', '--name-only', '--diff-filter=d', 'origin/main']);
const untrackedFiles = gitLines(['ls-files', '--others', '--exclude-standard']);
const scannedFiles = [...new Set([...changedFiles, ...untrackedFiles])];
let scannedCount = 0;
for (const relativePath of scannedFiles) {
  const absolute = path.join(root, relativePath);
  if (!(await pathExists(absolute))) continue;
  let bytes;
  try {
    bytes = await readFile(absolute);
  } catch {
    continue;
  }
  scannedCount++;
  if (bytes.includes(sectionSignNeedle)) {
    fail(relativePath + ' contains the U+00A7 section-sign character');
  }
}
console.log('U+00A7 byte scan: ' + scannedCount + ' file(s) scanned (changed vs origin/main + untracked)');

// ---------------------------------------------------------------------------
// SECTION: Task 2 appends its assertion group here (design system, links).
// SECTION: Task 3 appends its assertion group here (homepage, JS budget).
// ---------------------------------------------------------------------------

if (failures.length) {
  console.error('check-site.mjs: ' + failures.length + ' failure(s):');
  for (const failure of failures) console.error('  - ' + failure);
  process.exitCode = 1;
} else {
  console.log('check-site.mjs: all checks passed across ' + htmlFiles.length + ' HTML file(s)');
}
