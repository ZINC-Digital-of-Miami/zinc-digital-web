import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readdir, readFile } from 'node:fs/promises';

const fontFamilies = [
  {
    name: 'Big Shoulders Display',
    cssVariable: '--font-display',
    provider: fontProviders.fontsource(),
    weights: [800],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['sans-serif'],
  },
  {
    name: 'Inter',
    cssVariable: '--font-body',
    provider: fontProviders.google(),
    weights: [400],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['sans-serif'],
  },
  {
    name: 'JetBrains Mono',
    cssVariable: '--font-mono',
    provider: fontProviders.google(),
    weights: [400],
    styles: ['normal'],
    subsets: ['latin'],
    fallbacks: ['monospace'],
  },
];

// Native providers can warn and continue with an absent family. Reject that artifact.
// Every thrown message names the file plus the measured values so a future failure
// explains itself without re-deriving state by hand.
const completeFonts = {name:'zinc-complete-font-output',hooks:{'astro:build:done':async({dir})=>{
  const fontsDir=new URL('_astro/fonts/',dir);
  const fonts=await readdir(fontsDir);
  const woff2Count=fonts.filter(name=>name.endsWith('.woff2')).length;
  if(woff2Count!==fontFamilies.length)throw new Error('FONT_OUTPUT_INCOMPLETE: generated font count '+woff2Count+' differs from configured family count '+fontFamilies.length+' in '+fontsDir);
  const displayFamily=fontFamilies.find(font=>font.cssVariable==='--font-display');
  for(const entry of await readdir(dir,{recursive:true})){
    if(!entry.endsWith('.html'))continue;
    const html=await readFile(new URL(entry,dir),'utf8');
    const flat=html.replaceAll('"','');
    const missingFamilies=fontFamilies.filter(font=>!flat.includes(font.cssVariable+':'+font.name+'-'));
    if(missingFamilies.length)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' is missing declared families: '+missingFamilies.map(f=>f.name).join(', '));
    // Vercel's own build/deployment platform appends a `?dpl=<deployment-id>`
    // skew-protection query string to these asset URLs (confirmed via a
    // build-log head dump — never happens in local or CI builds, only on
    // Vercel's actual infrastructure). The capture group excludes any such
    // query so `sources` holds the real on-disk path either way.
    const sources=new Set(Array.from(html.matchAll(/url\("([^"?]+\.woff2)(?:\?[^"]*)?"\)/g),match=>match[1]));
    const preloads=Array.from(html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g));
    for(const source of sources){const bytes=await readFile(new URL(source.replace(/^\//,''),dir));if(bytes.toString('ascii',0,4)!=='wOF2')throw new Error('FONT_OUTPUT_INCOMPLETE: invalid font file '+source+' in '+entry+' (first four bytes were not wOF2)');}
    const preload=preloads[0]?.[0].match(/href="([^"]+)"/)?.[1];
    // Find the display family's own @font-face by matching its font-family name,
    // never by assuming it is the first @font-face block in the page (build-order
    // and cache state can reorder blocks even when the fonts themselves are correct).
    const displayFacePattern=new RegExp('@font-face\\{font-family:"?'+displayFamily.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'-[^"}]*"?;src:url\\("([^"]+)"\\)');
    const displaySource=html.match(displayFacePattern)?.[1];
    if(sources.size!==fontFamilies.length)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' has '+sources.size+' active woff2 sources, expected '+fontFamilies.length+'. sources='+JSON.stringify([...sources]));
    if(preloads.length!==1)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' has '+preloads.length+' font preloads, expected 1. preloads='+JSON.stringify(preloads.map(p=>p[0])));
    if(!displaySource)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' has no @font-face for the display family "'+displayFamily.name+'"');
    if(preload!==displaySource)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' preload href ('+preload+') does not match the display family @font-face src ('+displaySource+')');
  }
}}};

export default defineConfig({
  output: 'static',
  integrations: [completeFonts],
  adapter: vercel(),
  fonts: fontFamilies,
});
