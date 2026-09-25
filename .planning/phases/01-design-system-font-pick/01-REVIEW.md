---
phase: 01-design-system-font-pick
reviewed_plan: 01-02
review_depth: deep
status: issues_found
local_acceptance: accepted
reviewed_commit: f792789f924e61f0da953d069a6f01e56c780025
diff_base: df04b24
files_reviewed: 30
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
reviewer: independent GSD source reviewer / phase01_check
date: 2026-09-25
---

# Phase 01-02 — Independent source acceptance

**ACCEPT the local Pairing A source for the public noindex design preview.** No blocking content, routing or demo-safety defect was found. Two confirmed verifier warnings belong to the next execution stages and do not block this A preview. This decision does not approve deployment, final launch, final copy, or the parent's separately owned visual review.

## Scope and authority

Reviewed the implementation since `df04b24` against the current repository AGENTS.md, approved design spec, current full-site CONTEXT/UI-SPEC and 01-02 plan. Reviewed head is `f792789f924e61f0da953d069a6f01e56c780025`; application source was clean at the final source check. The unrelated planning state changes and `.gsd/` were not changed or accepted by this review.

The reviewed source/config/data files are `astro.config.mjs`; all three `scripts/*-mockup.mjs`/`gate-preview.mjs` scripts; `src/data/mockup.ts`, `posts.preview.json`, `assets.preview.json`; `MockupPage.astro`, `MockupBands.astro`, `bands/Hero.astro`; `PreviewLayout.astro`; canonical catch-all, 404 and existing design-preview/a routes; and `src/styles/base.css`. This is 15 source/config/data files including the unchanged compatibility route. The 14 WebP assets and favicon bring the total to 30 files. Large article JSON was inspected across every record and block programmatically, not accepted from a truncated listing.

## Evidence and counterevidence

| Need | Independent observation | Conclusion |
|---|---|---|
| Complete site | Fresh GETs to all 40 canonical paths returned 200, an h1 and noindex metadata. Two independently chosen missing paths, including a prefixed missing path, returned the designed page with HTTP404. | Full A destination inventory is present. |
| Actual source articles | Fresh public WordPress REST GET returned 18 posts, one page. SHA256 of every live original body matched the corresponding ignored raw source record. All 18 parsed bodies matched source text in order after the documented terminology/coda edits and whitespace/table-separator normalization. | No missing or duplicated body text from extraction was found. |
| Long article counterexample | Duplicate-content article: 206 blocks and 23,129 normalized characters in both original and extracted text. | The long capture is not evidence of parser duplication. |
| Approved assets | All 14 original-source hashes matched provenance metadata. Original, manifest and output dimensions matched for every asset; all outputs were WebP without enlargement. Favicon measured 96×96 PNG. | Asset identities and dimension provenance pass. Parent owns visual crispness judgment. |
| Demo cannot submit | Independent browser exercised invalid input, Enter progression, completed sample fields and confirmation. It reached exactly `/thanks/`; eight observed requests were GETs, none carried sample PII or POST data, and local/session storage and cookies were unchanged. The implementation uses a div group, not a submitting form. | Non-sending behavior passes the exercised path and source inspection. |
| Hostile/repeated service query | Repeated service values and an encoded HTML/event-handler payload selected zero checkboxes and created no injected image. | Query handling is an exact allowlisted value comparison, not HTML insertion. |
| No-JS fallback | With page script execution disabled, all three fieldsets were visible, with 4, 13 and 1 controls respectively; document had no form element. | Fields remain available without introducing a submission path. |
| Safe source rendering | Reviewed parser drops executable elements, constructs text/link records, and allows only HTTP(S) source links. Astro renders record text through escaped expressions; no raw provider-HTML insertion exists. An independent malicious-input run through the actual parser included encoded JavaScript URL, data URL, event handlers, script and SVG; the executable sentinel remained false. | Source is treated as data. This is distinct from synthetic observation-validator tests. |
| JS budget today | Independent per-script gzip accounting across all 40 pages found a maximum of 1,477 bytes, below 15,360. | Current A satisfies the budget despite WR-02 below. |

The article converter flattens table rows into paragraph text separated by middle dots. Cell text is preserved; this review does not claim preserved table semantics or a completed editorial migration. No source images were present in the 18 original article bodies.

Fresh read-only check executions passed: `prepare-mockup --check` (18 unique source articles, 14 dimensioned assets), `prepare-mockup --verify-site` (40 pages, 18 bodies, 11 services, nine homepage bands), `verify-mockup --self-test` (nine synthetic failure directions), and `gate-preview --self-test` (eight synthetic provider-target failures).

The existing full matrix was read and its checking implementation inspected: 42 URLs (40 canonical, A homepage alias, one404), 816 link observations, 138 image observations, 68 browser layout observations, 32 axe runs with zero violations, 38 screenshot entries and zero recorded failures, completed at `2026-09-25T21:25:31.718Z`. These counts are the builder's preserved matrix, not a claim that this reviewer reran that entire matrix. Independent runtime/source checks above were run separately against the restarted localhost:4328 server.

## WR-01 — B/C tracer CLI support is not implemented before its planned consumer

- **Severity:** WARNING. **Verdict:** CONFIRMED.
- **Location:** `scripts/verify-mockup.mjs:43`.
- **Mechanism:** The script unconditionally asserts that `--pairings` equals `a`. Current 01-02 promises generic allowlisted pairing/tracer support, and 01-03 Task1 invokes `--pairings a,b --tracer` before its later full-parity expansion.
- **Concrete failure:** Running `node scripts/verify-mockup.mjs --mode quick --pairings a,b --tracer` exited 1 at line43 with `'a,b' !== 'a'`, before inspecting any route. A correctly built B tracer would still fail this gate.
- **Counterevidence / current consequence:** Pairing A verification works. No B/C route is part of current local A acceptance. This warning therefore does not block the A preview.
- **Required fix before 01-03's first tracer:** Support the planned allowlisted pairing input and route mappings: canonical A tracer, explicit B/C prefixes, strict failure for an absent requested route. Do not silently ignore B/C or substitute A. Parent owns carrying and independently reviewing that change.

## WR-02 — JS budget verifier compresses combined payloads instead of summing separately delivered scripts

- **Severity:** WARNING. **Verdict:** CONFIRMED.
- **Location:** `scripts/verify-mockup.mjs:95` through the check at line96 and report at line97.
- **Mechanism:** Inline and fetched script text are concatenated and then gzipped once. Compression can reuse repeated strings across separate files, understating the sum of independently compressed resources. Fetches are also not deduplicated by actual resource URL.
- **Concrete failure:** Multiple separately delivered scripts sharing substantial text can exceed 15,360 aggregate gzip bytes while their artificially combined gzip remains below it; the verifier would pass and report the smaller number. Current independent measurement already shows the accounting difference: maximum 1,477 actual summed bytes versus 1,261 concatenated bytes.
- **Counterevidence / current consequence:** Both current measurements are far below budget; no current A page is rejected by this finding.
- **Required fix before the 01-04 budget gate is accepted:** Measure unique actual external script payloads separately, add explicitly defined inline-script accounting, and test a repeated-content multi-resource case that crosses the budget only under correct accounting. Preserve the 15,360-byte threshold.

## Limits and remaining ownership

- The parent independently owns review of every screenshot and screenshot segment. This report does not substitute code or axe checks for that visual acceptance.
- No deployment, public alias, Vercel protection, live main/landing or production behavior was accepted here. The first localhost attempt returned ECONNREFUSED; after the parent restarted its server, all independent runtime checks reported above passed.
- Lighthouse scores, cold-font CLS, controlled interaction latency and all-pairing performance are not independently measured here. They remain the explicit 01-04 gate. No synthetic pass was relabeled as a real measurement.
- Production mail/anti-abuse, analytics, final legal/copy/receipts, final migration and launch remain later-phase work. Visible draft/receipt/owner-confirm markers are permitted by this review's scope.
- No application source, Git state, external provider, deployment or unrelated project was changed by this reviewer. The only authored review artifact is this file. Test execution created/used `.scratch/phase01-mockup/independent-review-browser` on the external drive; final measurement was 188 files / 8,790,576 bytes. It is ignored scratch and is reported for the parent's authorized cleanup, not silently deleted. Nothing was deleted by this reviewer.

**Local disposition: ACCEPT. Blocking findings: 0. Nonblocking verifier warnings: 2.**
