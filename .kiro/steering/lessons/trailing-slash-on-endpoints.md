---
name: trailing-slash-on-endpoints
touches: src/pages/api/*, form actions, src/scripts/page.ts
kind of work: routing
date: 2026-10-04 · source: M2 task 3.5
---

# With `trailingSlash: 'always'`, endpoints answer only with the slash

**Rule:** Call every endpoint and form action with its trailing slash (`/api/inquiries/`, `/contact/send/`).

**Evidence:** posting to `/api/inquiries` returned 404 in dev. `/api/inquiries/` worked. `astro.config.mjs` sets `trailingSlash: 'always'`.

**Why it was easy to get wrong:** API paths conventionally have no trailing slash, and pages redirect, so the mismatch shows up only on POST.

**Apply:** write endpoint URLs with the slash and keep `data-endpoint="/api/inquiries/"` as the single source in the form.
