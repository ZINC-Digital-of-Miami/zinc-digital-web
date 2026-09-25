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
| **Full suite command** | `npx astro build && npx astro check && node scripts/check-bands.mjs && npx lhci autorun` (against the deployed preview URLs for `/design-preview/{a,b,c}/`) |
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
| 1-xx-xx | xx | 0/1 | DSGN-01 | — | N/A | smoke + UAT | `npx astro build` builds all 3 `/design-preview/*` routes | ❌ W0 | ⬜ pending |
| 1-xx-xx | xx | 1 | DSGN-02 | — | N/A | automated | `npx axe <preview>/design-preview/a/ --tags wcag2a,wcag2aa` exits 0; `grep` of `src/styles/tokens.css` finds `#0A0A0B #F5F6F7 #FC0781 #07B2B2 #057E7E` | ❌ W0 | ⬜ pending |
| 1-xx-xx | xx | 1 | DSGN-03 | — | N/A | automated | `node scripts/check-bands.mjs` exits 0 (every `<section>` in `dist/**/*.html` has `data-theme`; no `prefers-color-scheme` rule sets ground tokens) | ❌ W0 | ⬜ pending |
| 1-xx-xx | xx | 1 | DSGN-04 | — | N/A | automated | woff2 count per pairing ≤ 3 in `dist/`; `npx lhci autorun` asserts CLS = 0 per route | ❌ W0 | ⬜ pending |
| 1-xx-xx | xx | 1 | DSGN-05 | — | N/A | automated + manual | Lighthouse Best Practices = 100; visual check at 320/768/1440 px | ❌ W0 | ⬜ pending |
| 1-xx-xx | xx | 1 | — | T-1-01 | Preview gated by Vercel Authentication; `X-Robots-Tag: noindex` present | automated | `curl -sI <preview-url>` returns 401 unauthenticated or `x-robots-tag: noindex` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lighthouserc.json` — mobile form factor; assertions: CLS = 0, Performance/SEO/Accessibility/Best-Practices = 100; URLs `/design-preview/{a,b,c}/`
- [ ] `scripts/check-bands.mjs` — asserts every rendered `<section>` carries `data-theme`
- [ ] Dev dependencies: `@lhci/cli`, `@axe-core/cli`, `@astrojs/check`
- [ ] Font resolve check: all 9 families resolve under the chosen provider before pairing routes are written (research Open Question 1)

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
