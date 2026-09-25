---
phase: "1"
slug: design-system-font-pick
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-25"
updated: "2026-09-25 CT — full-site replan"
---

# Phase 1 — Full-Site Validation Strategy

Current 01-CONTEXT.md controls scope. Completed01-01 remains historical evidence; none of its old protected-preview or sample-only pass claims establishes current full-site readiness. This file describes required future execution, not measured results.

## Infrastructure and feedback

| Item | Contract |
|---|---|
| Stack | Existing Node24/Astro7.3.5/Vercel11.0.11; no package changes |
| Existing tools | npm run build; npm run check; installed selenium-webdriver, axe-core, @axe-core/cli, @lhci/cli, lighthouse, sharp |
| Quick feedback | npm run build && npm run check && node scripts/verify-mockup.mjs --mode quick --pairings a |
| Full matrix | node scripts/gate-preview.mjs --mode full --pairings a,b,c --base https://zinc-digital-web.vercel.app |
| After font collapse | node scripts/gate-preview.mjs --mode full --selected --base https://zinc-digital-web.vercel.app |
| Output | .scratch/phase01-mockup/ only, including browser profiles, raw source, screenshots and audit reports |
| Feedback timing | Quick checks under60seconds; full browser/Lighthouse matrix is a separate required gate and can run longer |
| Source expectation |40 canonical content pages, real404; then120 paired pages plus chooser=161 successful page URLs before collapse |
| Browser support | Native finished states for reduced motion/unsupported timelines; all content/links remain usable without JS |

## Per-task verification map

Every pending command below has an explicit creator task; no missing test is treated as a pass. Add script modes before the first use.

| Task | Wave | Requirements | Creation/check command | Status |
|---|---:|---|---|---|
|01-01 completed |1|DSGN-02/03/04|Preserve original plan/summary; inherited scaffold only|historical, not rerun by planning|
|01-02-01 |2|DSGN-01..05|Create prepare-mockup.mjs --check/--verify-tracer/--verify-site; npm run build && npm run check && node scripts/prepare-mockup.mjs --verify-tracer|pending|
|01-02-02 |2|DSGN-01..05|npm run build && npm run check && node scripts/prepare-mockup.mjs --verify-site|pending|
|01-02-03 |2|DSGN-01..05|Create verify-mockup and gate-preview; node scripts/verify-mockup.mjs --self-test; --mode quick/full --pairings a; gate-preview --check-target|pending|
|01-03-01 |3|DSGN-01/04|npm run build && npm run check && node scripts/verify-mockup.mjs --mode quick --pairings a,b --tracer|pending|
|01-03-02 |3|DSGN-01..05|node scripts/verify-mockup.mjs --mode full --pairings a,b,c --parity; target checks|pending|
|01-04-01 |4|DSGN-02..05|Extend full gate/configs; node scripts/gate-preview.mjs --self-test; --mode quick --pairings a --base https://zinc-digital-web.vercel.app|pending|
|01-04-02 |4|DSGN-01..05|node scripts/gate-preview.mjs --mode full --pairings a,b,c --base https://zinc-digital-web.vercel.app && node scripts/gate-preview.mjs --ready-for-owner|pending|
|01-04-03 |4|DSGN-01/05|node scripts/gate-preview.mjs --ready-for-owner; blocking explicit owner choice recorded in01-04-SUMMARY|pending owner gate|
|01-05-01 |5|DSGN-01/04|npm run build && npm run check && node scripts/verify-mockup.mjs --mode quick --selected --tracer|pending|
|01-05-02 |5|DSGN-01..05|node scripts/gate-preview.mjs --mode full --selected --base https://zinc-digital-web.vercel.app|pending|

## Full template and route coverage

Screenshots at1440 and375 CSS pixels/DPR2 for EACH successful-page template and EACH active pairing: home; services index; service detail; work index; case study; about; contact; thanks; blog index; article; privacy; terms. The shared canonical404 is outside A/B/C comparison; capture it separately at both widths and verify unknown canonical/prefixed paths return it with genuine404 status. Include both cases, longest service names and all distinct contact/filter/menu states. Before the owner sees Pairing A, its entire matrix already exists. Later B/C repeat the matrix across the same complete site. Screenshot review is independent; the implementer cannot accept their own work.

Crawl every canonical and comparison destination, fragment and internal link. Compare expected11 service slugs and18 source article IDs independently with actual built/rendered output. Root is a real homepage, not a redirect. Unknown paths must respond404. All local cards/CTAs/footer links resolve; no article destination is replaced with a link to the old site. Contact query selection is allowlisted and all eleven services are exercised. The demo never submits/stores fields, changes a network endpoint, or implies mail delivery; no-JS still exposes all fields and a confirmation-preview link.

## UI consideration and edge coverage

| ID | Requirement | Check/result required |
|---|---|---|
|UI-01;EP-DSGN04-concurrency|DSGN-04|Actual <=3 same-origin WOFF2 requests,1 display preload, generated metric fallbacks, cold/delayed-font CLS0; failed/interrupted isolated build cannot deploy partial output|
|UI-02|DSGN-01|Hero clamp preserved; widths320/375/768/1024/1440/2560; no horizontal overflow or orphaned final word at>=375|
|UI-03|DSGN-01|Longest actual service names checked in every pairing|
|UI-04|DSGN-01|Zero/one/two/six-item list fixtures; no fixed row assumptions; empty blog filter recovery|
|UI-05|DSGN-05|Native source ratios preserved; image dimensions reserved and chosen source>=2x CSS size|
|UI-06;EP-DSGN05-unclassified|DSGN-05|Flagged-human judgment: mark<=1000px, wordmark<=446px; source/rendered DPR2 crops on both grounds; never auto-resolve unclassified probe|
|UI-07|DSGN-02/03|Explicit theme mapping unchanged by OS theme|
|EP-DSGN01-adjacency|DSGN-01|A/B/C controls distinct,44px targets, no overlapping wrapped labels|
|EP-DSGN01-empty|DSGN-01|Missing/invalid pairing route yields designed404|
|EP-DSGN01-ordering|DSGN-01|A→B→C order fixed; article date ties broken by source ID|
|EP-DSGN02-adjacency|DSGN-02|Band boundaries meet without gaps/overlap|
|EP-DSGN02-empty|DSGN-02|Missing/invalid explicit theme fails|
|EP-DSGN02-encoding|DSGN-02|Rendered Unicode core text/names/punctuation/budgets preserved|
|EP-DSGN02-ordering|DSGN-02|Color semantics independent of cascade/order/OS|
|EP-DSGN03-adjacency|DSGN-03|No nested conflicting themes; nine-band alternating ground sequence|
|EP-DSGN03-empty|DSGN-03|Every rendered band declares exactly one valid ground|
|EP-DSGN03-ordering|DSGN-03|Home/layer/service order stable; only seven-person team permutation varies|

The supplied12 edge items map to3 DSGN-01 +4 DSGN-02 +3 DSGN-03 +1 DSGN-04 explicit truths and1 DSGN-05 flagged assumption. UI IDs add coverage without changing that count. The three retained bespoke prohibitions in01-02 remain flagged-unverified with no invented wired-check descriptor; human review must resolve the actual intent claims.

## Accessibility, performance and exposure

- Zero axe violations for WCAG2A/AA,2.1A/AA,2.2AA; keyboard/focus/menu/form validation checked; no underlined link in default/hover/focus; clear alternative cues.
- Per successful-page template/pairing: mobile Lighthouse Performance/Accessibility/Best Practices100. SEO100 only after explicitly skipping is-crawlable for intentional noindex; retain original report and label the adjusted score. No other successful-page audit exception. The shared canonical404 receives the same applicable visual/accessibility/performance/link/noindex checks, but its raw Lighthouse SEO score is reported honestly without a100 gate: the installed http-status-code audit scores400–599 as0. Preserve the genuine404; never skip that audit or change the response to200.
- LCP<=1200ms; cold devtools-throttled CLS0 including font/menu/team/filter activity; <=15360 gzip bytes of all inline/external JS per page. Controlled interaction duration<100ms with actual EventTiming evidence is lab data, not field INP. Missing measurements block.
- Full-page images, currentSrc2x dimensions, exact theme/accent values, top placement and all draft markers are measured. Bright teal2.42:1 stays decorative; meaningful light-band text uses ink or #057E7E.
- Public alias returns expected200/404 plus noindex/nofollow header AND meta. Raw preview/deployment URLs retain SSO protection. Check current project/team/domain list and deployment identity; no custom domains, paid protection, secrets or live inquiry integration.
- ASVS1 blocks unresolved high threats; gates cover unsafe source content, unsafe queries, form network/storage leakage, deceptive content, exposure and stale evidence.

## Scaffolds still to create during assigned tasks

- [ ]01-02-01 prepare-mockup source/asset/fixture/tracer checks
- [ ]01-02-03 verify-mockup browser/crawl/screenshot matrix and gate-preview target check
- [ ]01-03-02 complete paired route/content/font parity checks
- [ ]01-04-01 Lighthouse configs, full runner and synthetic failing gate fixtures
- [ ]01-04-02 independent full-matrix evidence and ready-for-owner check
- [ ]01-05 selected-mode final full-site regression

## Sign-off

nyquist_compliant and wave_0_complete stay false until the promised scaffolds/checks are actually created and evidenced. Planning does not self-approve runtime results. Owner font choice and raster crispness are explicit human judgments; production launch/content approval is outside this gate.
