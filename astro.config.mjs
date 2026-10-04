import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readdir, readFile } from 'node:fs/promises';
import { caseAliases } from './src/data/redirects.ts';

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

export default defineConfig({
  site: 'https://www.zincdigital.co',
  output: 'static',
  trailingSlash: 'always',
  integrations: [completeFonts],
  adapter: vercel(),
  fonts: fontFamilies,
  redirects: Object.fromEntries(Object.entries(caseAliases).map(([from, to]) => ['/work/' + from + '/', { status: 301, destination: '/work/' + to + '/' }])),
});
