---
phase: "1"
slug: "design-system-font-pick"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-25"
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Source: `01-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — static markup/CSS only; checks are build, type-check, Lighthouse CI, axe, and one small Node script |
| **Config file** | `lighthouserc.json` (Wave 0 installs) |
| **Quick run command** | `npx astro build && npx astro check` |
| **Full suite command** | `bash scripts/gate-preview.sh "$(cat .scratch/preview-url.txt)" /design-preview/a/ /design-preview/b/ /design-preview/c/` (after Plan 01-05: `... /`) — build, astro check, check-bands, check-fonts, JS budget, headers, overflow, axe, Lighthouse CI, devtools CLS against the deployed protected preview |
| **Estimated runtime** | ~30 s quick · ~3 min full |

---

## Sampling Rate

- **After every task commit:** `npx astro build && npx astro check`
- **After every plan wave:** full suite against the Vercel preview deploy (not localhost — CLS must be measured on the deployed, throttled artifact)
- **Before `/gsd:verify-work`:** full suite green and the owner's Day 1 pairing pick recorded
- **Max feedback latency:** 60 seconds for the quick command

---

## Per-Task Verification Map

(Filled by the planner per task; each row maps to a PLAN.md task.)

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | (supply chain) | T-01-SC | Installs only after owner legitimacy check | checkpoint + automated | `npm view astro@7.3.5 repository.url && npm view @astrojs/vercel@11.0.11 repository.url && npm view typescript repository.url` | n/a | ⬜ pending |
| 1-01-02 | 01 | 1 | DSGN-02, DSGN-03, DSGN-04 | T-01-01..06 | Standard Protection verified before first deploy; unauth 302 to sso-api + `x-robots-tag: noindex` | tracer (build + dist + Vercel) | `npm run build && npx astro check` + dist checks (3 woff2, 1 preload, size-adjust, data-theme, noindex); `vercel project protection ... --format json` assertion; `curl -D` 302/sso-api/noindex | ❌ W0 (created by task) | ⬜ pending |
| 1-01-03 | 01 | 1 | — | T-01-01 | Owner reaches preview only when logged in | UAT + automated | `curl -D` on `/design-preview/a/` shows 302 | n/a | ⬜ pending |
| 1-02-01 | 02 | 2 | DSGN-02, DSGN-03 | T-01-09 | Accent placement + alternation enforced | unit (self-test) + automated | `node scripts/check-bands.mjs --self-test && npm run build && node scripts/check-bands.mjs` | ❌ W0 → created | ⬜ pending |
| 1-02-02 | 02 | 2 | DSGN-05, DSGN-02 | T-01-07 | Brand copies MD5-identical to owner sources | automated | md5 loop; `npm run build && npx astro check && node scripts/check-bands.mjs` + `<picture>` ≥ 3, AVIF, dark band, favicon | ❌ W0 → created | ⬜ pending |
| 1-02-03 | 02 | 2 | DSGN-03 | — | N/A | automated | build + check-bands; a and stress pages have 3 sections; spec `dl` present; banned abbreviation absent | ❌ W0 → created | ⬜ pending |
| 1-03-01 | 03 | 2 | DSGN-04 | T-01-10 | No third-party font host | unit (self-test) + automated | `node scripts/check-fonts.mjs --self-test && npm run build && node scripts/check-fonts.mjs --max 3 dist/design-preview/a/index.html` | ❌ W0 → created | ⬜ pending |
| 1-03-02 | 03 | 2 | DSGN-01, DSGN-04 | — | N/A | automated | build log `Copying fonts (9 files)`, no `No data found`; `check-fonts --max 3 --distinct` a/b/c and `--max 0` index; data-pairing per route | ❌ W0 → created | ⬜ pending |
| 1-04-01 | 04 | 3 | DSGN-02 (contrast), DSGN-01 (overflow) | — | N/A | unit (self-test) + automated | `node scripts/check-overflow.mjs --self-test`; local server + check-overflow (4 paths × 6 widths) + `npx axe ... --tags wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa --exit` | ❌ W0 → created | ⬜ pending |
| 1-04-02 | 04 | 3 | DSGN-04, DSGN-05, DSGN-02 | T-01-12..15 | Bypass secret untracked; lhci upload filesystem only; 302 unauth / 200 + noindex with bypass | automated (deployed preview) | `bash scripts/gate-preview.sh "$(cat .scratch/preview-url.txt)" /design-preview/a/ /design-preview/b/ /design-preview/c/` (10 STEP lines, all EXIT=0) | ❌ W0 → created | ⬜ pending |
| 1-04-03 | 04 | 3 | DSGN-01, DSGN-05 | T-01-14 | Review index not public | UAT (owner pick) + automated | `curl -D` on `/design-preview/` shows 302 | n/a | ⬜ pending |
| 1-05-01 | 05 | 4 | DSGN-01, DSGN-04 | — | N/A | automated | build + astro check + check-bands + `check-fonts --max 3 dist/index.html`; 3 woff2; no design-preview; 3 font entries; STATE pick bullet | n/a | ⬜ pending |
| 1-05-02 | 05 | 4 | DSGN-04 | T-01-17, T-01-18 | `/` still protected; no production target, no Git link | automated (deployed preview) | `bash scripts/gate-preview.sh "$(cat .scratch/preview-url.txt)" /` + project-read assertion | n/a | ⬜ pending |

Measured correction (2026-09-25 13:24 CT): an unauthenticated request to a protected deployment on this team returns **302** to `https://vercel.com/sso-api` with `x-robots-tag: noindex`, not 401. The rows above use 302.

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lighthouserc.json` + `lighthouserc.cls.json` (Plan 01-04 Task 2) — mobile; 100 ×4 (`is-crawlable` skipped, noindex asserted separately), LCP ≤ 1200 ms, script ≤ 15 KB, CLS = 0 simulated and devtools-throttled; filesystem upload only
- [ ] `scripts/check-bands.mjs` (Plan 01-02 Task 1) — `data-theme` on every section, alternation, no nesting, accent-token placement, no OS color-scheme rule
- [ ] `scripts/check-fonts.mjs` (Plan 01-03 Task 1) — ≤ 3 woff2 per page, subset, size-adjust fallback, one preload, self-hosted, `--distinct`
- [ ] `scripts/check-overflow.mjs` (Plan 01-04 Task 1) — no horizontal scroll at 320–2560 px, no orphaned hero word ≥ 375 px
- [ ] `scripts/gate-preview.sh` (Plan 01-04 Task 2) — the full suite as one command
- [ ] Dev dependencies installed in Plan 01-01 Task 2: `@lhci/cli@0.15.1`, `@axe-core/cli@4.13.0` (with `DETECT_CHROMEDRIVER_VERSION=true`), `@astrojs/check@0.9.10`, `typescript`
- [x] Font resolve check: all 9 families resolve (Big Shoulders Display via fontsource, other 8 via google) — planner probe 2026-09-25 13:19 CT, `Copying fonts (9 files)`; re-checked at execution by Plan 01-03 Task 2

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner picks one pairing | DSGN-01 | Taste decision | Owner opens the protected preview index on Day 1 (Sat 2026-09-26 CT), views A/B/C, states the pick; pick recorded in STATE.md |
| Brand mark crispness | DSGN-05 | Visual judgment of raster scaling | View mark + wordmark on both grounds at 320/768/1440 px on a retina screen |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60 s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
