---
name: cover-images-need-height-sizes
touches: src/components/Img.astro (cover prop), case hero and before/after images
kind of work: images
date: 2026-10-04 · source: M2 round-3 visual review
---

# An object-fit:cover image in a tall box renders wider than the viewport, so `sizes="100vw"` picks a source that is too small

**Rule:** For a cover image whose box height follows the viewport, pass `cover={<box height in vh>}` to `Img`. It sets `sizes` to `(min-aspect-ratio: W/100) 100vw, Wvh`, where W = height × the image's aspect ratio.

**Evidence:** `lvs-hero` (2560 × 1081) fills a box 124% of the viewport height. At 768 × 1024 it renders about 2,800 px wide, but `sizes="100vw"` chose the 960 px file, so the hero and the before/after images looked blurry next to the Design's full-size PNGs (round 3, case M3/M4). With `cover`, the 1920 or 2560 AVIF (69–106 KB) is chosen.

**Why it was easy to get wrong:** `100vw` is right for full-width images that keep their aspect ratio; cover cropping breaks that assumption only on tall screens.

**Apply:** re-check LCP on the case template after any change here (task 29).
