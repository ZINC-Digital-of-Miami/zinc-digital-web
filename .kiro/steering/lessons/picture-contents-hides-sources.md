---
name: picture-contents-hides-sources
touches: src/styles/site.css (picture rule), src/components/Img.astro
kind of work: CSS layout
date: 2026-10-04 · source: M2 round-3 visual review
---

# With `picture{display:contents}`, its `<source>` elements become layout items unless hidden

**Rule:** Whenever `picture` is `display:contents`, also set `picture>source{display:none}`.

**Evidence:** case-page brand tiles (`display:grid;place-items:center`) sat 10–35 px low. Each tile's grid had three items (two `<source>` elements and the `<img>`), so the free space was split across three rows and the image landed in the third. Two round-3 reviewers measured it; `display:none` on the sources fixed it. Source selection is unaffected.

**Why it was easy to get wrong:** `<source>` is not in the user-agent `display:none` list, and an empty item looks harmless until the container distributes free space.

**Apply:** check any grid or flex container that holds an `Img` for extra rows or columns.
