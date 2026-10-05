---
name: nth-child-of-selector-for-filtered-lists
touches: src/styles/site.css (.p-art grid), src/scripts/page.ts (blog filter)
kind of work: CSS layout
date: 2026-10-04 · source: M2 round-2 visual review, commit e8f2299
---

# `:nth-child()` counts hidden siblings; filtered lists need `:nth-child(An+B of S)`

**Rule:** Any column rule keyed on position must count only visible items when a script can hide some of them. Use `:nth-child(3n of .item:not([hidden]))`.

**Evidence:** `.p-art:nth-child(3n+2)` and `:nth-child(3n)` gave cards middle- and right-column padding and borders. After the blog filter hid cards with `hidden`, visible cards 12 and 14 kept those positions. The first visible card was inset 26 px with no divider (`state--blog--filter-intelligence--1440`). The unfiltered page was correct, so every static check passed.

**Why it was easy to get wrong:** `display:none` takes an element out of layout, so it feels like it should leave the count too. It does not.

**Apply:** when adding a filter or `hidden` toggle to a grid, grep its CSS for `nth-child` and `nth-of-type` and capture a filtered state.
