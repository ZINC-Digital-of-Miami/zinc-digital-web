---
phase: 01-design-system-font-pick
plan: "02"
subsystem: ui
tags: [full-site-mockup, astro, source-fixtures, non-sending-demo, accessibility]
requires:
  - phase: 01-01
    provides: Astro scaffold, native Pairing A fonts, design tokens and existing Vercel project
provides:
  - Complete 40-page Pairing A mockup, homepage compatibility alias and genuine 404
  - Eighteen complete structured article previews and fourteen original-derived raster assets
  - Working navigation, service preselection, blog filters and non-sending progressive inquiry demo
  - Local and public route/browser matrices, independent source and visual acceptance
affects: [01-03, 01-04, 01-05]
actuals:
  tokens: 362417
  tasks: 3
  commits: 4
tech-stack:
  added: []
  patterns: [shared static route manifest, escaped structured content, allowlisted demo query, segmented native DPR2 screenshots]
key-files:
  created: [src/data/mockup.ts, src/data/posts.preview.json, src/data/assets.preview.json, src/components/MockupPage.astro, "src/pages/[...path].astro", src/pages/404.astro, scripts/prepare-mockup.mjs, scripts/verify-mockup.mjs, scripts/gate-preview.mjs]
  modified: [astro.config.mjs, src/components/MockupBands.astro, src/components/bands/Hero.astro, src/layouts/PreviewLayout.astro, src/styles/base.css]
key-decisions:
  - All canonical destinations precede font comparison; no homepage-only checkpoint.
  - Keep visible draft, receipt, logo/photo and owner-confirm placeholders honest.
  - Contact is a non-submitting div group; no backend, saved PII or inquiry transmission.
  - Preserve long screenshots as native PNG segments below Chrome's physical surface limit.
requirements-completed: [DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05]
coverage:
  - id: D1
    description: Complete canonical destination and source-body inventory
    requirement: DSGN-01
    verification:
      - kind: e2e
        ref: node scripts/verify-mockup.mjs --mode full --pairings a --parity --base https://zinc-digital-web.vercel.app
        status: pass
    human_judgment: false
  - id: D2
    description: Complete desktop and mobile visual mockup
    verification: []
    human_judgment: true
    rationale: Parent inspected all 38 capture entries / 51 native parts; owner's design and font choice remains open.
  - id: D3
    description: Non-sending inquiry states and safe content rendering
    verification:
      - kind: e2e
        ref: 01-REVIEW.md independent malicious-source and browser interaction checks
        status: pass
    human_judgment: false
duration: 34min
completed: 2026-09-25
status: complete
---

# Phase 01-02 — Complete site mockup

**Forty canonical pages now render and navigate on the authorized public noindex preview, including the complete nine-band homepage.** This is a public design draft on the phase branch, not a main-branch delivery or final launch.

## Accomplishments

- Home, services index and eleven services, work index and both case studies, seven-person About, contact demo, thanks, blog index and eighteen full article previews, Privacy, Terms and genuine 404.
- Shared templates preserve original raster identities, aspect ratios, paired dark/light brand variants, large typography, no-underlined link states and responsive layouts.
- Safe structured content preserves source text; documented terminology expansion and one retired promotional coda are the only substantive preview edits. Tables preserve cell text as paragraph rows; semantic editorial migration remains later work.
- Progressive inquiry has invalid/step/back/confirmation/no-JS states and exact allowlisted service selection. It sends and stores nothing.

## Commits and verification

Task commits: `602e865`, `5b6ba82`, `f792789`. Independent source review: `ed4c1fa`.

- Build and Astro check passed; forty-one successful generated URLs plus 404 (forty canonical + existing A homepage alias).
- `prepare-mockup --check`: eighteen source IDs and fourteen dimensioned assets. `--verify-site`: forty complete routes, eighteen bodies, eleven services, nine homepage bands.
- Local AND deployed full browser matrices: **42 URLs, 816 internal link observations, 138 image observations, 68 layout checks, 32 axe runs, 38 capture entries, zero failures**.
- Parent independently inspected all fifty-one native screenshot parts at 1440/375, including contact states, no-JS, reduced motion and empty-filter recovery. Long-page footers render completely after replacing oversized captures with segments.
- Independent reviewer read all thirty scoped source/data/config/asset files; compared all eighteen bodies to fresh public WordPress originals and verified all fourteen asset identities. Local source acceptance: zero blockers, two nonblocking verifier warnings.
- Synthetic validator fault tests: nine directions; synthetic provider-target tests: eight directions. Actual malicious source parsing was tested separately; these evidence types are not interchangeable.
- Raw Lighthouse request to true404 records `ERRORED_DOCUMENT_REQUEST` and null category scores. No 404 score of100 is claimed. Formal all-font performance/CLS/latency gates remain 01-04.

## Deployment evidence

- Public alias: https://zinc-digital-web.vercel.app
- Deployment: `dpl_AmmbiJccqixqd5szRGFpmxAVAnHj`, READY, source SHA `ed4c1fad4796549e570a98594ae5072fd1aba964`.
- Project `prj_PcZ23na2T2M3j96XYMHZfeR3KF5t`, team `team_OBen4n9i3PybGdYsjENnrv1S`, Node24, no Git connection; only configured project domain is the authorized vercel.app alias.
- Public home200 and unknown path404 both retain header and meta noindex/nofollow. Raw deployment URL redirects302 to Vercel SSO. No custom domain added.
- Parent opened and observed the deployed full homepage in the Codex browser. Main separately remains `f5c7a90e7c1d705efc46986976753e660a3dc383`; PR2 remains unmerged.

## Deviations and next-stage obligations

1. **WR-01:** B/C verifier input is still rejected. Complete generic strict pairing/tracer support BEFORE executing the first 01-03 B tracer; never silently substitute A. The A preview is independently accepted.
2. **WR-02:** Current verifier concatenates JS before gzip. Independent correct per-resource sum is1477bytes maximum, under15360. Fix unique-resource plus explicit inline accounting and its counterexample before accepting the formal budget gate.
3. GSD isolated-worktree dispatch degraded to its documented sequential mode on this existing divergent phase branch. Parent made all explicit-path commits because the worker's branch-name guard rejected the existing authorized gsd branch. Hooks were not bypassed.
4. Requirements frontmatter records this plan's assigned IDs per GSD schema; it does not mean owner selection, collapse or phase-wide acceptance is complete.

## Evidence and cleanup

External-drive ignored evidence lives in `.scratch/phase01-mockup/accepted-a-local/` and `accepted-a-public/`, with complete screenshot manifests and original PNG parts. Local visual acceptance is `accepted-a-local/visual-review.json`; provider/deployment evidence is `accepted-a-public/target-check.json`. Original raw inputs and asset provenance remain in the same external scratch tree. Cache/profile scratch is retained while execution continues; no cleanup is falsely claimed here.

## Next

Execute01-03 for three complete comparable sites. Complete01-04 gates before the actual blocking-human font decision. Never choose a font on the owner's behalf. Main landing still needs the owner's GitHub Pages workflow decision; live inquiry still needs the recorded MyKinsta SPF/configuration work.
