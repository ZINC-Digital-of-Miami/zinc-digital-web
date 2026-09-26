#!/usr/bin/env node
// Static dist/ gate. Reads the built site and exits non-zero with a list of
// every failure. Structured so later plan tasks can append their own
// assertion groups below the SECTION markers rather than rewriting this file.
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';

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

  // Vercel appends `?dpl=<deployment id>` to font URLs in the HTML it serves
  // (astro.config.mjs's own build:done hook already strips this same query
  // before reading the file from disk — mirror that pattern here so this gate
  // is not fooled into over- or under-counting distinct fonts). The capture
  // group stops at the first `?` or the closing quote, so a plain build-time
  // URL (no query at all) and a Vercel-served one (with `?dpl=...`) both
  // resolve to the same underlying path.
  const woff2Sources = new Set(Array.from(html.matchAll(/url\("([^"?]+\.woff2)(?:\?[^"]*)?"\)/g), (match) => match[1]));
  check(woff2Sources.size === 3, relativePath + ' has ' + woff2Sources.size + ' distinct woff2 sources, expected exactly 3: ' + JSON.stringify([...woff2Sources]));
  for (const source of woff2Sources) {
    const absolute = path.join(distDir, source.replace(/^\/+/, ''));
    if (!(await pathExists(absolute))) {
      fail(relativePath + ' references woff2 source ' + source + ' which does not exist in dist/');
      continue;
    }
    const bytes = await readFile(absolute);
    check(bytes.toString('ascii', 0, 4) === 'wOF2', relativePath + ' woff2 source ' + source + ' is not a valid wOFF2 file (bad magic bytes)');
  }
}

check(!(await pathExists(path.join(distDir, DESIGN_PREVIEW_DIR))), 'dist/' + DESIGN_PREVIEW_DIR + ' still exists');

// ---------------------------------------------------------------------------
// SECTION: Task 1 (tracer) — no draft copy renders. Owner, 2026-09-26:
// "remove all draft copy still listed." Guarding markers ([RECEIPT: ...],
// [OWNER CONFIRM], [LOGO FILES PENDING ...], [LOGO PENDING], the demo
// disclosures) are NOT part of this pattern and are asserted present
// elsewhere in this file — they stay. The nine posts.preview.json body-run
// hits that use "draft" as ordinary English (migrated article prose) are
// exempted on article routes only, built from the JSON at run time.
// ---------------------------------------------------------------------------
const DRAFT_COPY_PATTERN = /\bdraft\b|editorial review|under review|\[\s*draft[^\]]*\]/i;

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&middot;/gi, '·')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&rarr;/gi, '→')
    .replace(/&copy;/gi, '©')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function collapseWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function extractScannableText(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const parts = [];
  for (const match of stripped.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) parts.push(match[1]);
  for (const match of stripped.matchAll(/\s(?:content|alt|aria-label|title|placeholder)="([^"]*)"/gi)) parts.push(match[1]);
  parts.push(stripped.replace(/<[^>]+>/g, ' '));
  return collapseWhitespace(decodeHtmlEntities(parts.join(' ')));
}

const postsPreviewPath = path.join(root, 'src/data/posts.preview.json');
const exemptRunTexts = [];
const articleSlugs = new Set();
if (await pathExists(postsPreviewPath)) {
  const postsPreview = JSON.parse(await readFile(postsPreviewPath, 'utf8'));
  for (const post of postsPreview.posts || []) {
    if (post.slug) articleSlugs.add(post.slug);
    for (const block of post.blocks || []) {
      const runs = block.runs || (block.items ? block.items.flat() : []);
      for (const run of runs || []) {
        if (run && typeof run.text === 'string' && DRAFT_COPY_PATTERN.test(run.text)) {
          exemptRunTexts.push(collapseWhitespace(run.text));
        }
      }
    }
  }
}

let noDraftCopyScanned = 0;
let exemptRunsMatched = 0;
for (const { relativePath, html } of pages) {
  let scannable = extractScannableText(html);
  const articleMatch = relativePath.match(/^blog[\\/]([^\\/]+)[\\/]index\.html$/);
  if (articleMatch && articleSlugs.has(articleMatch[1])) {
    for (const exemptText of exemptRunTexts) {
      if (exemptText && scannable.includes(exemptText)) {
        exemptRunsMatched++;
        scannable = scannable.split(exemptText).join(' ');
      }
    }
  }
  noDraftCopyScanned++;
  const match = DRAFT_COPY_PATTERN.exec(scannable);
  if (match) {
    const start = Math.max(0, match.index - 30);
    const context = scannable.slice(start, start + 60);
    fail(relativePath + ' renders draft copy near: "' + context + '"');
  }
}
console.log(
  'no-draft-copy scan: ' + noDraftCopyScanned + ' file(s) scanned, ' + exemptRunsMatched + ' exempt run(s) matched',
);

// U+00A7 (section sign) byte scan of every file changed on this branch versus
// origin/main plus every untracked file. The needle is built from its UTF-8
// bytes (0xC2 0xA7) so this file never contains the character itself.
const sectionSignNeedle = Buffer.from([0xc2, 0xa7]);
function tryGit(args) {
  try {
    return {
      ok: true,
      lines: execFileSync('git', args, { cwd: root, encoding: 'utf8' })
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };
  } catch (error) {
    return { ok: false, error };
  }
}
function gitLines(args) {
  const result = tryGit(args);
  if (!result.ok) {
    fail('git command failed: git ' + args.join(' ') + ' — ' + result.error.message);
    return [];
  }
  return result.lines;
}
// actions/checkout fetches only the single commit for the triggering ref by
// default (github.com/actions/checkout README, "Only a single commit is
// fetched by default... Set fetch-depth: 0 to fetch all history for all
// branches and tags") — `origin/main` has no local ref at all on that path,
// so `git diff ... origin/main` throws "unknown revision" and this scan would
// silently cover zero files. ci.yml now fetches `origin/main` explicitly
// right after checkout so the normal path below always resolves; this is the
// fail-closed backstop for any trigger/checkout combination that still
// leaves it missing (e.g. a future workflow change, or a local shallow clone)
// — scan every tracked file rather than quietly scanning nothing.
let changedFiles;
let usedFallbackScan = false;
const baseRefCheck = tryGit(['rev-parse', '--verify', 'origin/main']);
const headSha = tryGit(['rev-parse', 'HEAD']);
const mainSha = baseRefCheck.ok ? tryGit(['rev-parse', 'origin/main']) : null;
if (baseRefCheck.ok && headSha.ok && mainSha && mainSha.ok && headSha.lines[0] === mainSha.lines[0]) {
  // HEAD is main itself (push-to-main run): diffing against origin/main is
  // empty, so scan what the landed commit changed against its parent. CI
  // checks out with fetch-depth 2 so HEAD~1 exists; if it does not, fail
  // closed by scanning every tracked file.
  const parent = tryGit(['rev-parse', '--verify', 'HEAD~1']);
  if (parent.ok) {
    changedFiles = gitLines(['diff', '--name-only', '--diff-filter=d', 'HEAD~1', 'HEAD']);
    console.log('check-site.mjs: HEAD is origin/main; scanning files changed by HEAD against HEAD~1.');
  } else {
    usedFallbackScan = true;
    console.warn('check-site.mjs: HEAD is origin/main and HEAD~1 is unavailable; failing closed by scanning every tracked file.');
    changedFiles = gitLines(['ls-files']);
  }
} else if (baseRefCheck.ok) {
  changedFiles = gitLines(['diff', '--name-only', '--diff-filter=d', 'origin/main']);
} else {
  usedFallbackScan = true;
  console.warn(
    'check-site.mjs: origin/main did not resolve (' + baseRefCheck.error.message.trim().split('\n')[0] +
      ') — failing closed by scanning every tracked file instead of the changed-vs-main diff.',
  );
  changedFiles = gitLines(['ls-files']);
}
const untrackedFiles = gitLines(['ls-files', '--others', '--exclude-standard']);
const scannedFiles = [...new Set([...changedFiles, ...untrackedFiles])];
// The U+00A7 policy is about authored text (source, copy) never spelling the
// character out. Binary evidence files (Task 3's screenshots) are opaque
// compressed pixel data, not authored text — scanning their bytes for an
// incidental two-byte match is a false-positive generator, not a real check.
const BINARY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.woff', '.woff2', '.pdf']);
let scannedCount = 0;
for (const relativePath of scannedFiles) {
  if (BINARY_EXTENSIONS.has(path.extname(relativePath).toLowerCase())) continue;
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
console.log(
  'U+00A7 byte scan: ' + scannedCount + ' file(s) scanned (' +
    (usedFallbackScan ? 'all tracked (origin/main unavailable, fail-closed)' : 'changed vs origin/main') +
    ' + untracked)',
);

// ---------------------------------------------------------------------------
// SECTION: Task 2 — all-white design system, masthead, footer, team band,
// links (no dark band, no bare '#', link integrity, no underline, banned
// abbreviation for generative search).
// ---------------------------------------------------------------------------
const FOOTER_SMS_HREF = 'href="sms:+17865754837"';
const CONTACT_HREF = 'href="/contact/"';

function extractHrefs(html) {
  return Array.from(html.matchAll(/href=["']([^"']+)["']/g), (match) => match[1]);
}

async function internalHrefResolves(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true; // external, mailto:, sms:, tel:, in-page anchor
  if (clean === '/') return pathExists(path.join(distDir, 'index.html'));
  const rel = clean.replace(/^\/+/, '');
  const asFile = path.join(distDir, rel);
  const asIndex = path.join(distDir, rel, 'index.html');
  return (await pathExists(asFile)) || (await pathExists(asIndex));
}

for (const { relativePath, html } of pages) {
  check(!html.includes('data-theme="dark"'), relativePath + ' still contains data-theme="dark" — no band may be ink-filled');
  check(!html.includes('href="#"'), relativePath + ' contains a bare href="#"');
  check(html.includes(FOOTER_SMS_HREF), relativePath + ' is missing the footer sms link');
  check(html.includes(CONTACT_HREF), relativePath + ' is missing a /contact/ link');

  for (const href of extractHrefs(html)) {
    // eslint-disable-next-line no-await-in-loop
    const resolved = await internalHrefResolves(href);
    check(resolved, relativePath + ' links to "' + href + '" which does not resolve in dist/');
  }
}

// Built CSS must never carry an underline affordance (property or value).
async function listFilesWithExt(dir, ext) {
  const entries = await readdir(dir, { recursive: true }).catch(() => []);
  return entries.filter((entry) => entry.endsWith(ext)).map((entry) => path.join(dir, entry));
}
const astroAssetsDir = path.join(distDir, '_astro');
if (await pathExists(astroAssetsDir)) {
  for (const file of await listFilesWithExt(astroAssetsDir, '.css')) {
    const css = await readFile(file, 'utf8');
    check(!css.toLowerCase().includes('underline'), path.relative(root, file) + ' contains "underline"');
  }
}

// The uppercase three-letter abbreviation for generative search is banned
// everywhere. Built from character codes so this file's own source never
// spells it out.
const BANNED_ABBREVIATION = String.fromCharCode(71, 69, 79);
const bannedPattern = new RegExp('\\b' + BANNED_ABBREVIATION + '\\b');
for (const { relativePath, html } of pages) {
  check(!bannedPattern.test(html), relativePath + ' contains the banned abbreviation for generative search');
}
const SRC_TEXT_EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.md', '.mdx', '.json']);
// posts.preview.json carries three named provenance fields (sourceTitle,
// sourceSlug, sourceUrl) that intentionally preserve the original WordPress
// title/slug/url — including the banned abbreviation when the source post
// used it. Provenance is never rendered to any page (grep-verified separately);
// only the lines carrying those three keys are exempt from this scan, so the
// abbreviation still fails the gate anywhere else in src/ (authored copy) or
// in any other field of this same file.
const PROVENANCE_FIELD_LINE = /^\s*"(sourceTitle|sourceSlug|sourceUrl)"\s*:/;
const PROVENANCE_EXEMPT_FILE = path.join('src', 'data', 'posts.preview.json');
const srcDir = path.join(root, 'src');
if (await pathExists(srcDir)) {
  const srcEntries = await readdir(srcDir, { recursive: true }).catch(() => []);
  for (const entry of srcEntries) {
    if (!SRC_TEXT_EXTENSIONS.has(path.extname(entry))) continue;
    const file = path.join(srcDir, entry);
    let text;
    try {
      text = await readFile(file, 'utf8');
    } catch {
      continue;
    }
    const relative = path.join('src', entry);
    if (relative === PROVENANCE_EXEMPT_FILE) {
      const scannable = text
        .split('\n')
        .filter((line) => !PROVENANCE_FIELD_LINE.test(line))
        .join('\n');
      check(!bannedPattern.test(scannable), 'src/' + entry + ' contains the banned abbreviation for generative search outside its provenance fields');
    } else {
      check(!bannedPattern.test(text), 'src/' + entry + ' contains the banned abbreviation for generative search');
    }
  }
}

// ---------------------------------------------------------------------------
// SECTION: Task 3 — homepage nine bands and per-page JS budget.
// ---------------------------------------------------------------------------

// mockup.ts is TypeScript and this script runs as plain Node ESM, so the
// expected home-band content is a deliberate, literal duplicate of the data
// file here — this gate exists precisely to catch drift between the two.
const HOME_SERVICE_SLUGS = [
  'shopify', 'web-design', 'apps',
  'seo', 'local-seo', 'ai-search-optimization', 'google-search-ads', 'shopping-ads', 'social-ads', 'tiktok-ads',
  'business-intelligence',
];
const HOME_COMMITMENTS = [
  'You own your accounts, data and code.',
  'Direct access to the people doing the work.',
  'Reporting tied to revenue, not impressions.',
];
const HOME_BAND_ORDER = ['hero', 'intro', 'clients', 'loop', 'once-upon-a-book-club', 'us-oil-solutions', 'commitments', 'team', 'articles', 'footer'];

const indexPage = pages.find((p) => p.relativePath === 'index.html');
if (!indexPage) {
  fail('dist/index.html does not exist');
} else {
  const html = indexPage.html;
  const bandPositions = HOME_BAND_ORDER.map((band) => ({ band, index: html.indexOf('data-home-band="' + band + '"') }));
  check(bandPositions.every((b) => b.index !== -1), 'dist/index.html is missing one of the home bands: ' + bandPositions.filter((b) => b.index === -1).map((b) => b.band).join(', '));
  const inOrder = bandPositions.every((b, i) => i === 0 || b.index === -1 || bandPositions[i - 1].index === -1 || b.index > bandPositions[i - 1].index);
  check(inOrder, 'dist/index.html home bands are out of order, expected: ' + HOME_BAND_ORDER.join(', '));

  check(html.includes('href="sms:+17865754837"'), 'dist/index.html is missing the sms link');
  check(html.includes('[LOGO FILES PENDING'), 'dist/index.html is missing the [LOGO FILES PENDING marker');
  check(html.includes('[OWNER CONFIRMS EACH LINE]'), 'dist/index.html is missing the [OWNER CONFIRMS EACH LINE] marker');
  check(html.includes('[RECEIPT:'), 'dist/index.html is missing a [RECEIPT: marker');
  check(!html.includes('[PHOTO PENDING]') && (html.match(/class="team-band-photo"/g) || []).length === 7, 'dist/index.html must render all 7 team members with a real photo and no [PHOTO PENDING] marker');
  for (const text of HOME_COMMITMENTS) {
    check(html.includes(text), 'dist/index.html is missing the how-we-work line: ' + text);
  }
  for (const slug of HOME_SERVICE_SLUGS) {
    check(html.includes('href="/services/' + slug + '/"'), 'dist/index.html is missing a link to /services/' + slug + '/');
  }
}

// Per-page JS budget: every external module script it references (followed
// through static imports, deduped) plus every inline script, gzipped and
// summed, must be at most 15360 bytes. No library ships here, so this is
// mostly a guard against regressions growing HomeBands' own script.
const jsCache = new Map();
async function readJsFile(relativeSrc) {
  const clean = relativeSrc.split('?')[0];
  if (jsCache.has(clean)) return jsCache.get(clean);
  const absolute = path.join(distDir, clean.replace(/^\//, ''));
  let text = null;
  try {
    text = await readFile(absolute, 'utf8');
  } catch {
    text = null;
  }
  jsCache.set(clean, text);
  return text;
}

async function collectScriptBytes(html, pageLabel) {
  const seen = new Set();
  const chunks = [];

  // Inline module/no-src scripts (Astro emits component scripts as external
  // modules by default; this also covers any is:inline script that ships).
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const body = match[1].trim();
    if (body) chunks.push(Buffer.from(body, 'utf8'));
  }

  // External module scripts, followed through their own static imports.
  const queue = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g), (m) => m[1]).filter((src) => src.startsWith('/'));
  while (queue.length) {
    const src = queue.shift();
    const clean = src.split('?')[0];
    if (seen.has(clean)) continue;
    seen.add(clean);
    const text = await readJsFile(clean);
    if (text == null) {
      fail(pageLabel + ' references script "' + src + '" which does not exist in dist/');
      continue;
    }
    chunks.push(Buffer.from(text, 'utf8'));
    const dir = path.posix.dirname(clean);
    for (const imp of text.matchAll(/import\s*(?:[^'"]*?from\s*)?["']([^"']+)["']/g)) {
      const spec = imp[1];
      if (!spec.startsWith('.') && !spec.startsWith('/')) continue; // bare specifier: no library ships, so nothing to resolve
      const resolved = spec.startsWith('/') ? spec : path.posix.normalize(path.posix.join(dir, spec));
      queue.push(resolved);
    }
  }

  return chunks.reduce((sum, chunk) => sum + gzipSync(chunk).length, 0);
}

const JS_BUDGET_BYTES = 15360;
let largestPage = { relativePath: '', bytes: 0 };
for (const { relativePath, html } of pages) {
  const bytes = await collectScriptBytes(html, relativePath);
  if (bytes > largestPage.bytes) largestPage = { relativePath, bytes };
  check(bytes <= JS_BUDGET_BYTES, relativePath + ' ships ' + bytes + ' gzip bytes of script, over the ' + JS_BUDGET_BYTES + ' byte budget');
}
console.log('JS budget: largest page is ' + largestPage.relativePath + ' at ' + largestPage.bytes + ' gzip bytes (budget ' + JS_BUDGET_BYTES + ')');

if (failures.length) {
  console.error('check-site.mjs: ' + failures.length + ' failure(s):');
  for (const failure of failures) console.error('  - ' + failure);
  process.exitCode = 1;
} else {
  console.log('check-site.mjs: all checks passed across ' + htmlFiles.length + ' HTML file(s)');
}
