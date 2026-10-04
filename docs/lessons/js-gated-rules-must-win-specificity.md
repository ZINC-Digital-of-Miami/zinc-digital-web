---
name: js-gated-rules-must-win-specificity
touches: src/styles/site.css, src/styles/home.css (.rv reveals, pinned scenes)
kind of work: progressive enhancement
date: 2026-10-04 · source: M2 task 3.2
---

# A JS-gated "finished" rule must out-rank the hidden starting rule

**Rule:** When a starting state is scoped under `html.js` (or a media query), scope its finished state the same way, so the finished state's specificity is at least as high. Without JS or with reduced motion, the finished state must be the default.

**Evidence:** moving the reveal start state under `html.js` raised its specificity above `.rv.in`, so revealed content stayed invisible with JS on. Fixed with `html.js .rv.in{opacity:1;transform:none}` and `html.js .rv-stag.in > *`. Pinned scenes now sit in normal flow by default, with motion only under `html.js` and `prefers-reduced-motion: no-preference`.

**Why it was easy to get wrong:** adding a scope to one half of a pair looks like a safe guard, but it silently changes which rule wins.

**Apply:** whenever you add a scope to a state rule, add the same scope to its counterpart. verify-site's no-JS and reduced-motion reach checks guard this.
