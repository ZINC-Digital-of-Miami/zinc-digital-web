---
name: astro-route-imports-bundle-css
touches: src/pages/, src/styles/
kind of work: page templates
date: 2026-10-04 · source: M2 round-1 visual review, commit 17e09f9
---

# A route file ships the CSS of every component it imports, even ones it never renders for that page

**Rule:** Give a template with its own stylesheet its own route file. Do not branch between templates inside one catch-all route when each imports different CSS.

**Evidence:** `[...path].astro` imported both `HomeBands` (which imports `home.css`) and `Page`. Astro bundled `home.css` into every inner page, after `site.css`. Its `.disp{margin:0}` cancelled `.p-title`'s 28 px top margin, so every inner page title sat about 28 px high (round 1, mistake 1, high). `astro check`, check-site and verify-site all passed. Fixed by moving home to `src/pages/index.astro`.

**Why it was easy to get wrong:** the conditional render looked like it scoped the CSS. Astro decides CSS per route from the import graph, not per render.

**Apply:** when a page looks styled by another template, open the built HTML and list its inlined `<style>` blocks before touching selectors. Keep `home.css` imported only from `src/pages/index.astro`.
