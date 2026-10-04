---
name: centre-field-before-reportvalidity
touches: src/scripts/page.ts (contact form steps)
kind of work: forms
date: 2026-10-04 · source: M2 round-2 visual review, commit e8f2299
---

# Native validation scrolls only until the field is in the viewport, which can leave it under a sticky header

**Rule:** Before `reportValidity()`, scroll the invalid field to the centre (`field.scrollIntoView({ block: 'center' })`).

**Evidence:** at 375 px, step 1's "Please fill out this field." bubble pointed at the Name input hidden behind the 76 px sticky header (`state--contact--step-1-error--375`). The Design calls the same `reportValidity()` with no offset.

**Why it was easy to get wrong:** the field is technically in the viewport, so the browser does not scroll at all.

**Apply:** any script-triggered validation or focus on a page with a sticky header centres the target first.
