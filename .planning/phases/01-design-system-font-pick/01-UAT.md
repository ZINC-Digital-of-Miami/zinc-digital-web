---
status: testing
phase: 01-design-system-font-pick
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md]
started: 2026-09-25T17:14:03-05:00
updated: 2026-09-25T17:14:03-05:00
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 3
name: Homepage on desktop
expected: |
  Open https://zinc-digital-web.vercel.app on a laptop/desktop browser. The homepage loads in Pairing A and scrolls through all nine bands top to bottom, ending in a complete footer. Large condensed headlines, snow-white ground, black type, real ZINC mark and wordmark. Nothing overlaps, nothing is cut off, no empty band.
awaiting: user response

## Tests

### 1. Complete canonical destination and source-body inventory
expected: Every canonical page, all 18 article bodies and every internal link resolve on the public preview.
result: pass
source: automated
coverage_id: D1
note: "Live re-measured 2026-09-25 17:13 CT: /, /services/, /work/, /about/, /contact/, /blog/, /privacy/, /terms/ return 200; unknown path returns 404; every response carries x-robots-tag noindex, nofollow."

### 2. Non-sending inquiry states and safe content rendering
expected: Inquiry demo stores and sends nothing; source article HTML renders as safe structured text.
result: pass
source: automated
coverage_id: D3

### 3. Homepage on desktop
expected: Open https://zinc-digital-web.vercel.app on a laptop/desktop browser. The homepage loads in Pairing A and scrolls through all nine bands top to bottom, ending in a complete footer. Large condensed headlines, snow-white ground, black type, real ZINC mark and wordmark. Nothing overlaps, nothing is cut off, no empty band.
result: [pending]

### 4. Phone view and menu
expected: On a phone (or a browser window narrowed to phone width), the homepage reflows to one column with no sideways scrolling. The menu opens and closes, every menu link goes to its page, and buttons are easy to tap.
result: [pending]

### 5. Services
expected: The Services page lists all eleven services grouped by Build, Demand and Intelligence. Each service opens its own full page. The inquiry button on a service page opens Contact with that service already selected.
result: [pending]

### 6. Work and case studies
expected: The Work page shows both case studies (Once Upon a Book Club, US Oil Solutions). Each opens a full case page with its real images, sharp on a Retina screen. Any unconfirmed figures show as clearly marked placeholders, not invented numbers.
result: [pending]

### 7. About and team
expected: The About page shows all seven people. Missing photos or details appear as honest placeholders marked for your confirmation, not made-up content.
result: [pending]

### 8. Blog, filters and articles
expected: The Blog page lists all 18 articles, newest first. The filters narrow the list, and an empty filter result offers a way back. Each article opens with its full original text and a visible "Draft migration preview — editorial review pending" flag.
result: [pending]

### 9. Contact demo
expected: Contact walks through the inquiry step by step. Leaving a required field empty shows a clear message. Back returns to the previous step without losing answers. Finishing shows a confirmation. Nothing is actually sent (no email arrives), and the text-message and phone links are visible.
result: [pending]

### 10. Links and small pages
expected: No link anywhere is underlined; links still show a visible hover and keyboard-focus state. Privacy and Terms open as complete pages. A made-up address (for example /nope/) shows the designed 404 page with a way back home.
result: [pending]

## Summary

total: 10
passed: 2
issues: 0
pending: 8
skipped: 0
blocked: 0

## Gaps

[none yet]
