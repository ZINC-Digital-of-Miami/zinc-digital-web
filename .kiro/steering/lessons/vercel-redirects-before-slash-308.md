---
name: vercel-redirects-before-slash-308
touches: astro.config.mjs (zinc-vercel-redirects), .vercel/output/config.json, scripts/serve-static.mjs
kind of work: redirects, deploy
date: 2026-10-04 · source: M2 task 4.2
---

# On Vercel with `trailingSlash: 'always'`, the adapter's slash 308 swallows alias redirects

**Rule:** Alias redirects must match with and without the slash and sit before the first 308 in `.vercel/output/config.json`. Verify by replaying `config.json`, not by `astro dev`.

**Evidence:** the adapter wrote the trailing-slash 308 ahead of the alias redirects, so a request for an alias without the slash got 308 to the slash form, which then 404'd. The fix is the `zinc-vercel-redirects` integration (`astro:build:done`, runs after the adapter). It rewrites each redirect's `src` to `^/x/?$` and moves it before the first 308. `scripts/serve-static.mjs` replays the `config.json` routes. check-site and verify-site require a 301 with and without the slash.

**Why it was easy to get wrong:** `astro dev` does not use `config.json`, so redirects work locally. The known Astro/Vercel issues (#9259, #9260, #13900, #18073) describe the deployed behaviour.

**Apply:** after any change to `redirects` or the adapter, run check-site (route replay) and recheck a redirect on the deployed preview.
