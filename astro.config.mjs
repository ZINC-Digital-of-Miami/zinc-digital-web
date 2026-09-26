import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readdir, readFile } from 'node:fs/promises';

// Native providers can warn and continue with an absent family. Reject that artifact.
const completeFonts = {name:'zinc-complete-font-output',hooks:{'astro:build:done':async({dir})=>{
  const fonts=await readdir(new URL('_astro/fonts/',dir));
  if(fonts.filter(name=>name.endsWith('.woff2')).length!==fontFamilies.length)throw new Error('FONT_OUTPUT_INCOMPLETE: generated font count differs from configuration');
  for(const entry of await readdir(dir,{recursive:true})){
    if(!entry.endsWith('.html'))continue;
    const html=await readFile(new URL(entry,dir),'utf8');
    const pairing=html.match(/data-pairing="([abc])"/)?.[1];
    const active=fontFamilies.filter(font=>font.cssVariable.endsWith('-'+pairing));
    if(active.length!==3||active.some(font=>!html.replaceAll('"','').includes(font.cssVariable+':'+font.name+'-')))throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' lacks its configured active font families');
    const sources=new Set(Array.from(html.matchAll(/url\("([^"]+\.woff2)"\)/g),match=>match[1]));
    const preloads=Array.from(html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]*>/g));
    for(const source of sources){const bytes=await readFile(new URL(source.replace(/^\//,''),dir));if(bytes.toString('ascii',0,4)!=='wOF2')throw new Error('FONT_OUTPUT_INCOMPLETE: invalid font file '+source);}
    const preload=preloads[0]?.[0].match(/href="([^"]+)"/)?.[1];
    const displaySource=html.match(/@font-face\{[^}]+src:url\("([^"]+)"/ )?.[1];
    if(sources.size!==3||preloads.length!==1||preload!==displaySource)throw new Error('FONT_OUTPUT_INCOMPLETE: '+entry+' must have three active sources and one preload');
  }
}}};

const fontFamilies = [
    {
      name: 'Big Shoulders Display',
      cssVariable: '--font-display-a',
      provider: fontProviders.fontsource(),
      weights: [800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-body-a',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono-a',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
    { name: 'Barlow Condensed', cssVariable: '--font-display-b', provider: fontProviders.google(), weights: [900], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { name: 'Public Sans', cssVariable: '--font-body-b', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { name: 'IBM Plex Mono', cssVariable: '--font-mono-b', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
    { name: 'Oswald', cssVariable: '--font-display-c', provider: fontProviders.google(), weights: [700], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { name: 'IBM Plex Sans', cssVariable: '--font-body-c', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { name: 'Space Mono', cssVariable: '--font-mono-c', provider: fontProviders.google(), weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
  ];

export default defineConfig({
  output: 'static',
  integrations: [completeFonts],
  adapter: vercel(),
  fonts: fontFamilies,
});
