---
name: auto-margin-items-need-a-width
touches: src/styles/home.css (.shots and similar grid or flex items)
kind of work: CSS layout
date: 2026-10-04 · source: M2 round-2 visual review, commit e8f2299
---

# A grid or flex item with only max-width and an auto margin shrinks to its content

**Rule:** Give such an item a definite width (`width:100%` plus `max-width`). Otherwise its size depends on whether its lazy images have loaded.

**Evidence:** `.shots{max-width:620px;margin-left:auto}` measured 2 px wide until its lazy images loaded, then grew by 440 px. That changed the page height after load, and the capture script, which measured the height once, missed the footer's bottom row at 768 and 1440 (round 2, home).

**Why it was easy to get wrong:** in normal block flow the same declarations fill the line. In a grid or flex container an auto margin absorbs the free space, so the item shrinks to fit its content.

**Apply:** when a box's size changes after load, check for auto margins without a width first. CLS checks miss it when the box is below the fold at load.
