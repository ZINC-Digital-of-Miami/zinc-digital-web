# GSD reconciliation — 2026-09-26 CT

## Scope and evidence boundary

Planning reconciliation, not a fresh application audit or phase acceptance. Read current source to identify implemented scope and preserve unmeasured requirements. No application, design, deployment configuration, DNS, credentials or runtime behavior changes are authorized by this record.

Baseline measured 2026-09-26 CT: remote main `1a2ea8b6c33aa5fbb726a953d2e16c9d15fb4368`; Vercel production `dpl_ExH9Ab1txt5fFnQngMuBetKDrPL5` is READY at that same SHA. PRs #4 and #5 are merged. The reachable main commits are `f79517446b98ec5d888d20223cf2efb996feba3b` for #4 and `1a2ea8b6c33aa5fbb726a953d2e16c9d15fb4368` for #5. The public vercel.app alias returns 200 with noindex/nofollow; www.zincdigital.co still returns WordPress/Elementor. These are dated observations, not future release claims.

Reproduce: `git ls-remote origin main`; `vercel api /v13/deployments/zinc-digital-web.vercel.app --method GET`; `curl -sSI https://zinc-digital-web.vercel.app/`. Read each new deployment SHA separately.

## Review on GitHub

Codex GitHub review is enabled for this repository. PRs trigger review when opened or marked ready; use `@codex review` to request a fresh review on the current head. Confirm the Codex review summary covers the current SHA and address findings before landing. Do not use Copilot as the PR reviewer. Keep GSD code-review, verifier and UI-review steps where their configured checkpoints call for them. PR #6 demonstrated the integration responding. For each landing, verify the review summary and inline comments against the exact final PR head; this reconciliation record does not substitute for that review.

## Effective direction and original evidence

- Current `src/styles/themes.css` implements one light mapping; `astro.config.mjs` registers Big Shoulders Display 800, Inter 400 and JetBrains Mono 400; `src/layouts/PreviewLayout.astro` uses those three roles and the page-long CircuitThread. There are no comparison route files under `src/pages/`.
- Quick task 260926-6g7 PLAN lines 88–90 records the owner's instruction to land option 3, all white with the side thread, across all pages, without connecting the domain. PR #4 landed that direction. This supersedes the older dark-band and repeated font-choice instructions; it does not establish a full quality acceptance.
- Quick task 260926-d0r PLAN records removal of draft copy while retaining markers that guard unconfirmed numbers. Current MockupPage still distinguishes a non-sending inquiry and unresolved owner confirmations. Do not restore draft banners or treat their removal as editorial approval.
- `src/pages/[...path].astro` maps the shared route manifest to PreviewLayout and MockupPage. `src/components/MockupPage.astro` implements service/case/article templates and a contact wizard whose final action is `location.assign` to a demo confirmation. There is no inquiry POST endpoint in `src/pages/`; mail delivery and abuse verification remain unfinished.
- `src/data/mockup.ts` has seven named team records, including Jaymie and Wendy, with photo references. Do not continue asking for these as missing implementation inputs; owner acceptance of the images is a separate gate.
- `src/layouts/PreviewLayout.astro` still emits noindex and a title-derived description. This is not proof of production SEO acceptance. Blog bodies and page presence are not proof of completed editorial migration.

## Plan disposition

| Plan | Disposition | Next use |
|---|---|---|
| 01-01 | Existing completed summary retained | Historical execution record |
| 01-02 | Existing completed summary retained | Historical execution record; remeasure changed behavior |
| 01-03 | Superseded comparison scope; excluded from GSD progress routing | Do not rebuild A/B/C or invent a completion summary |
| 01-04 | Font-choice task superseded; quality gates outstanding; excluded from GSD progress routing | Resume native verification route; plan gap closure only if verification finds a gap |
| 01-05 | Selected fonts and removal of comparison routes already implemented through PR #4; acceptance not closed; excluded from GSD progress routing | Resume native verification route; do not repeat implementation |

There are still only two formal plan summaries and zero formally accepted phases. These counts measure workflow acceptance, not implementation percentage. LNCH-02 alone is checked after all four authoritative Route 53 nameservers returned one SPF record including `_spf.google.com` on 2026-09-26. This measures the current DNS condition only; recheck it and validate mail delivery before enabling live submissions. Fifty-six of 57 requirements remain open, and no phase is accepted.

## Phase inventory and remaining work

| Phase | Current implementation | Remaining acceptance or implementation |
|---|---|---|
| 1 | Full-site mockup, selected type, all-white styling and shared side thread are implemented | Run `$gsd-execute-phase 01` for current font-load/CLS, full-template gates and owner UAT; plan gap closure only if verification finds a gap |
| 2 | HomeBands, home.css and CircuitThread implement homepage and motion work landed in #4/#5 | Verify against revised design, finished-state fallback, real iPhone Safari, performance and owner copy acceptance; do not rebuild homepage from old alternating-band plan |
| 3 | Service/work/case templates and source records exist | Receipts, service claims, final proof and structured-data acceptance |
| 4 | About/team and progressive non-sending inquiry demo exist | Live POST/email, Turnstile/honeypot, no-JS submission, fresh SPF recheck before activation, mail-delivery validation and owner-entered secrets; no test email authorized here |
| 5 | Blog index/article templates and imported preview records exist | Editorial approval, production metadata/schema, analytics, taxonomy, sitemap/robots/llms and complete 301/410 migration evidence |
| 6 | Prior quick-task checks and screenshots exist | Fresh all-template launch evidence and owner approval; historical summaries alone cannot close this phase |
| 7 | Vercel alias deployed; public domain remains WordPress | TTL/zone evidence, explicit cutover go, mail-record parity and live acceptance |

## Verification limits and next action

Current main CI run 36256848093 reports 0 type errors, 0 warnings and static checks passing across 41 HTML files. This does not certify Lighthouse 100x4, LCP, CLS, INP, real iPhone behavior, full accessibility, editorial approval, mail or redirects. No new full browser/launch audit was run in this reconciliation.

GSD 1.14.0 reports both live plans summarized, Phase 1 verification missing and all ten UAT checks pending. The native progress route is `$gsd-execute-phase 01`; it resumes at the verification gates without rerunning summarized plans. Plans 01-03/04/05 carry `status: superseded`, which the GSD scanner excludes from incomplete-plan routing; their source text remains as history. If verification identifies gaps, plan only the necessary gap-closure work. Read this record first. After Phase 1 acceptance, plan remaining production work in phases 2–5; keep Phase 6 and Phase 7 gates intact.

Historical UAT passes remain in notes but all ten checks require current-baseline acceptance. Do not fabricate owner responses. No launch date is approved; the roadmap gates are undated. Cutover still requires the owner's explicit go. The current SPF record was measured on all four authoritative nameservers, but it must be rechecked before live inquiry is enabled.

The GSD runtime identified as `@opengsd/gsd-core` 1.14.0. `query find-phase 1` reports 2 live plans, 2 summaries, 5 physical plan files; the three unsummarized comparison plans are excluded by their `status: superseded` frontmatter. `query init.progress` reports Phase 1 as executed with verification missing; `query verification.status .planning/phases/01-design-system-font-pick` independently confirms the missing report and returns `$gsd-execute-phase 01`. `query audit-uat` reports 10 pending checks and no parse gaps. The GSD health result is `degraded`, with zero errors and two warnings: W027 flags the old `/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01` worktree as stale; a fresh status check returns `?? .gsd/`, so it is preserved. W019 flags the existing root `.planning/INGEST-CONFLICTS.md` as a noncanonical GSD artifact; it is retained as the generated ingestion history with a current-disposition note. No repairable warnings were reported. All four authoritative Route 53 nameservers returned exactly one SPF record, `v=spf1 include:_spf.google.com include:relay.kinstamailservice.com ~all`; remeasure and validate delivery before live inquiry. No application, DNS, credential or deployment changes were made.
