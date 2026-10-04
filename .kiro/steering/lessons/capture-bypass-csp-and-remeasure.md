---
name: capture-bypass-csp-and-remeasure
touches: scripts/capture.mjs
kind of work: visual review
date: 2026-10-04 · source: M2 visual review rounds 1 and 2, commits 7ae399e, e8f2299
---

# Screenshot tooling must bypass the site's CSP, wait for the Design runtime and re-measure the page every frame

**Rule:** A capture that injects styles or scripts calls `Page.setBypassCSP` first. It waits longer for the Design runtime (2500 ms) than for the static site (700 ms), and re-reads `scrollHeight` after every scroll.

**Evidence:**
- Round 1's first attempt was discarded (`visual/m2/aborted-round-1-csp-freeze/`): the site's hashed `style-src` CSP blocked the transition-freeze stylesheet, so every site frame showed the hero mid-animation.
- Design frames captured too early showed mono FAQ summaries that a live browser does not.
- Round 2 missed the footer's bottom row at 768 and 1440 because the height was read once at load and the page grew after lazy images loaded.

**Why it was easy to get wrong:** a blocked injected style fails silently (a console warning only), and a short page still produces plausible frames.

**Apply:** after changing capture.mjs, spot-check one site frame for a frozen, finished state and confirm the last frame of each page shows the footer's bottom row.
