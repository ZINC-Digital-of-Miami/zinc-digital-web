---
name: prove-the-check-before-the-site
touches: scripts/verify-site.mjs, scripts/check-site.mjs
kind of work: writing checks
date: 2026-10-04 · source: M2 task 4.2, commit b2093f3
---

# A failing new check is suspect until it passes on a known-good page

**Rule:** When a newly written check fails, first prove whether the check or the site is wrong. Compare against the Design or a page you know is right before changing site code.

**Evidence:** the first verify-site runs failed on harness bugs, not site defects:
- list items joined without separators;
- missing spaces where inline tags were stripped;
- WebDriver `getText` returning uppercased text from `text-transform`;
- a 404 skip-link false alarm and a hidden clear button;
- the before/after probe waiting on `requestAnimationFrame` with JS disabled, which never fires;
- axe running mid-transition and flagging contrast on half-faded text.

Each was fixed in the script (compare `textContent`, decode entities, `settle`/`finish()` before axe, synchronous BA probe without JS).

**Why it was easy to get wrong:** a red check reads as a site defect, and the site had real defects too.

**Apply:** for each new assertion, run it once against a page that should pass. Wait for transitions to finish before measuring colour or position.
