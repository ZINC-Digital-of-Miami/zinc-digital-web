import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  // PRE-LAUNCH: root points at the Phase 1 mockup until the real homepage lands (Plan 01-05).
  redirects: { '/': '/design-preview/a/' },
  adapter: vercel(),
  fonts: [
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
  ],
});
