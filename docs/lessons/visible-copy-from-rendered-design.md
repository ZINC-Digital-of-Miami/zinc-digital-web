---
name: visible-copy-from-rendered-design
touches: src/data/site.ts, src/layouts/SiteLayout.astro (footer)
kind of work: porting Design copy
date: 2026-10-04 · source: M2 round-2 visual review, commit e8f2299
---

# Take visible copy from the Design's rendered page, not from its structured data

**Rule:** Visible text comes from what the Design renders. When the Design's JSON-LD or data object writes the same fact differently, keep two fields (display and structured) rather than one.

**Evidence:** `STUDIOS.street` was `97 Oak Ave, Suite 7`, copied from the Design's JSON-LD `streetAddress`. The Design's visible footer, in both `ZINC Home Blend.dc.html` and `ZINC Site.dc.html`, reads `97 Oak Ave Suite 7`. Every template's footer was wrong. Two independent round-2 reviewers reported it. Fixed with a `streetLabel` display field; the JSON-LD keeps `street`.

**Why it was easy to get wrong:** the data object looked like the single source of truth, and the comma reads as correct English.

**Apply:** when porting a value that appears both on screen and in JSON-LD, search the Design file for both spellings before choosing one.
