import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { caseAliases } from './src/data/redirects.ts';
import { adminThemeHash } from './src/lib/admin-theme.ts';
import {analyticsEnabled, googleTagScript} from './src/lib/analytics.ts';
import {createHash} from 'node:crypto';

const analytics = analyticsEnabled(process.env.PUBLIC_ANALYTICS, process.env.VERCEL_ENV);
const analyticsHash = 'sha256-' + createHash('sha256').update(googleTagScript(process.env.PUBLIC_ADS_CONVERSION_LABEL)).digest('base64');

const fontFamilies = [
  { name: 'Big Shoulders Display', cssVariable: '--font-display', provider: fontProviders.fontsource(), weights: [800], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
  { name: 'Inter', cssVariable: '--font-body', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
  { name: 'JetBrains Mono', cssVariable: '--font-mono', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
];

// Unchanged guard from main: every page must ship exactly the three configured families.
const expectedWoff2 = fontFamilies.length;
const completeFonts = { name: 'zinc-complete-font-output', hooks: { 'astro:build:done': async ({ dir }) => {
  const fontsDir = new URL('_astro/fonts/', dir);
  const fonts = await readdir(fontsDir);
  const woff2Count = fonts.filter((n) => n.endsWith('.woff2')).length;
  if (woff2Count !== expectedWoff2) throw new Error('FONT_OUTPUT_INCOMPLETE: generated font count ' + woff2Count + ' differs from expected ' + expectedWoff2 + ' in ' + fontsDir);
  const displayFamily = fontFamilies.find((f) => f.cssVariable === '--font-display');
  for (const entry of await readdir(dir, { recursive: true })) {
    if (!entry.endsWith('.html')) continue;
    const html = await readFile(new URL(entry, dir), 'utf8');
    const flat = html.replaceAll('"', '');
    const missing = fontFamilies.filter((f) => !flat.includes(f.cssVariable + ':' + f.name + '-'));
    if (missing.length) throw new Error('FONT_OUTPUT_INCOMPLETE: ' + entry + ' is missing declared families: ' + missing.map((f) => f.name).join(', '));
    const sources = new Set(Array.from(html.matchAll(/url\("([^"?]+\.woff2)(?:\?[^"]*)?"\)/g), (m) => m[1]));
    const preloads = Array.from(html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g));
    for (const source of sources) { const bytes = await readFile(new URL(source.replace(/^\//, ''), dir)); if (bytes.toString('ascii', 0, 4) !== 'wOF2') throw new Error('FONT_OUTPUT_INCOMPLETE: invalid font file ' + source + ' in ' + entry); }
    const preload = preloads[0]?.[0].match(/href="([^"]+)"/)?.[1];
    const facePattern = new RegExp('@font-face\\{font-family:"?' + displayFamily.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-[^"}]*"?;src:url\\("([^"]+)"\\)');
    const displaySource = html.match(facePattern)?.[1];
    if (sources.size !== expectedWoff2) throw new Error('FONT_OUTPUT_INCOMPLETE: ' + entry + ' has ' + sources.size + ' active woff2 sources, expected ' + expectedWoff2);
    if (preloads.length !== 1) throw new Error('FONT_OUTPUT_INCOMPLETE: ' + entry + ' has ' + preloads.length + ' font preloads, expected 1');
    if (!displaySource) throw new Error('FONT_OUTPUT_INCOMPLETE: ' + entry + ' has no @font-face for the display family');
    if (preload !== displaySource) throw new Error('FONT_OUTPUT_INCOMPLETE: ' + entry + ' preload href (' + preload + ') does not match the display @font-face src (' + displaySource + ')');
  }
} } };

// @astrojs/vercel writes each redirect as `^/path$` after its own 308 to the slashed URL, so with
// trailingSlash 'always' the 308 wins and the redirect never matches (known Astro/Vercel issue). The adapter
// runs its build:done hook first, so rewrite its redirect routes here: match with or without the trailing
// slash, ahead of the 308. check-site.mjs replays the route table to prove each alias lands in one hop.
let projectRoot;
const vercelRedirects = { name: 'zinc-vercel-redirects', hooks: {
  'astro:config:done': ({ config }) => { projectRoot = config.root; },
  'astro:build:done': async () => {
    const file = new URL('.vercel/output/config.json', projectRoot);
    const cfg = JSON.parse(await readFile(file, 'utf8'));
    const isRedirect = (r) => r.status >= 301 && r.status <= 308 && r.headers?.Location && /^\^\/[^()]*\$$/.test(r.src);
    const redirects = cfg.routes.filter(isRedirect).map((r) => ({ ...r, src: r.src.replace(/\/?\$$/, '/?$') }));
    const rest = cfg.routes.filter((r) => !isRedirect(r));
    const at = rest.findIndex((r) => r.status === 308);
    rest.splice(at < 0 ? 0 : at, 0, ...redirects);
    await writeFile(file, JSON.stringify({ ...cfg, routes: rest }, null, 2));
  },
} };

export default defineConfig({
  site: 'https://www.zincdigital.co',
  output: 'static',
  trailingSlash: 'always',
  // Inline the page CSS: two render-blocking stylesheet requests delayed first paint and LCP on mobile.
  build: { inlineStylesheets: 'always' },
  integrations: [completeFonts, vercelRedirects],
  adapter: vercel({maxDuration:60}),
  fonts: fontFamilies,
  // Hashed script-src and style-src meta policy on every page. The Design's markup carries inline style
  // attributes, so style-src-attr allows those only; scripts stay hash-only. frame-ancestors is a header
  // (vercel.json), since browsers ignore it in a meta policy. Register hashes before SSR headers stream.
  security: { csp: { scriptDirective: { hashes: [adminThemeHash, ...(analytics ? [analyticsHash] : [])], resources: ["'self'", ...(analytics ? ['https://www.googletagmanager.com', 'https://www.googleadservices.com', 'https://www.google.com'] : [])] }, styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] } } },
  redirects: Object.fromEntries(Object.entries(caseAliases).map(([from, to]) => ['/work/' + from + '/', { status: 301, destination: '/work/' + to + '/' }])),
});
