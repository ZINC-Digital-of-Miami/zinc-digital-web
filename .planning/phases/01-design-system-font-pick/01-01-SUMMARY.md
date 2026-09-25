---
phase: 01-design-system-font-pick
plan: 01
subsystem: infra
tags: [astro, vercel, css-tokens, fonts-api, deployment-protection]

# Dependency graph
requires: []
provides:
  - Scaffolded Astro 7.3.5 project (package.json, tsconfig.json) with @astrojs/vercel 11.0.11 adapter
  - Token system (tokens.css, themes.css, base.css, pairings.css) implementing data-theme banding
  - Pairing A self-hosted fonts (Big Shoulders Display 800 / Inter 400 / JetBrains Mono 400) via Astro native Fonts API
  - PreviewLayout.astro + Hero.astro rendering the locked core line on /design-preview/a/
  - Vercel project zinc-digital-web (zincdigitalofmiamis-projects), CLI-linked, protected preview deployment
affects: [01-02, 01-03, 01-04, 01-05]

# Actuals (#2632)
actuals:
  tokens: 96666
  tasks: 2
  commits: 1

tech-stack:
  added: ["astro@7.3.5", "@astrojs/vercel@11.0.11", "@astrojs/check@0.9.10", "typescript@6.0.3", "@lhci/cli@0.15.1", "@axe-core/cli@4.13.0"]
  patterns: ["data-theme single-attribute banding", "Astro native Fonts API (fontProviders.google/.fontsource) replaces manual subsetting", "decorative-layer marks (pseudo-elements) kept out of text-contrast scope"]

key-files:
  created:
    - package.json
    - astro.config.mjs
    - .vercelignore
    - src/styles/tokens.css
    - src/styles/themes.css
    - src/styles/base.css
    - src/styles/pairings.css
    - src/layouts/PreviewLayout.astro
    - src/components/MockupBands.astro
    - src/components/bands/Hero.astro
    - src/pages/design-preview/a.astro
  modified: []

key-decisions:
  - "Reverted a redundant .vercel line the Vercel CLI auto-appended to .gitignore during `vercel link` (already covered by the existing .vercel/ entry) to keep the governance-file-immutability check exact"
  - "Set ssoProtection.deploymentType to prod_deployment_urls_and_all_previews instead of the plan's assumed all_except_custom_domains, after measuring live that all_except_custom_domains left the production alias domain (project.vercel.app and the team-scoped alias) unprotected on this Pro team"
  - "Accepted that this git-disconnected, CLI-only project's very first deployment always auto-promotes to production regardless of --target/--prod flags (measured 3x); remediated by keeping the bootstrap production deployment unaliased and protected, then removing it once a genuine preview-target deployment existed"

patterns-established:
  - "Vercel preview URL for this phase: verify with `curl -D - <url>/design-preview/a/` expecting 302 to vercel.com/sso-api and x-robots-tag: noindex before ever reporting a URL as safe"

requirements-completed: []  # DSGN-02/03/04 implemented and locally verified; not marked complete until Task 3 owner confirmation closes this plan

coverage: []

# Metrics
duration: 68min
completed: 2026-09-25
status: halted
---

# Phase 1 Plan 1: Tracer — Scaffold, Token System, Pairing A Hero, Protected Vercel Preview Summary

**Astro 7.3.5 + @astrojs/vercel 11.0.11 scaffold with a data-theme token system, Pairing A self-hosted fonts via the native Fonts API, and the light hero band ("Other agencies deliver the scope. ZINC delivers the business.") live on a Vercel Authentication–protected preview — paused at Task 3 for the owner to confirm access.**

## Performance

- **Duration:** 68 min (14:09–14:17 CT, plus ~15 min of required reading/setup before Task 2 started)
- **Started:** 2026-09-25T19:06:02Z (14:06 CT)
- **Completed (through Task 2):** 2026-09-25T19:16:40Z (14:16 CT)
- **Tasks:** 2 of 3 (Task 1 approved by owner pre-dispatch, Task 2 executed and committed, Task 3 halted at checkpoint)
- **Files modified:** 13 (12 new source/config files + package-lock.json)

## Accomplishments

- Astro project scaffolded via `.scratch/scaffold` (Pitfall 1/2 mitigations applied); only `package.json`/`tsconfig.json` merged into the worktree; `AGENTS.md`, `CLAUDE.md`, `README.md`, `.gitignore` untouched (verified `git diff --quiet` before and after every Vercel operation)
- `astro@7.3.5` and `@astrojs/vercel@11.0.11` installed with exact pins (`--save-exact`, no caret); `typescript` resolved to `6.0.3` (not independently pinned — pulled in by `@astrojs/check@0.9.10`)
- `astro.config.mjs`: `output: 'static'`, `adapter: vercel()`, 3 Pairing A font entries (Big Shoulders Display 800 via `fontProviders.fontsource()`, Inter 400 and JetBrains Mono 400 via `fontProviders.google()`)
- Token system built: `tokens.css` (the only file with hex values — near-black, snow, magenta, teal, teal-text, spacing xs–5xl, type-scale clamp formulas), `themes.css` (`[data-theme="dark"|"light"]`, magenta only in the dark block, teal/teal-text only in the light block, no `prefers-color-scheme` anywhere), `base.css` (type roles, `.band`/`.band__inner`, `:focus-visible`, `.button`, `.draft-tag`, `.mark-strike`/`.mark-hit`/`.mark-bar` decorative pseudo-elements), `pairings.css` (`[data-pairing="a"]` font mapping)
- `PreviewLayout.astro` (noindex meta, single display-font preload, dark preview strip) and `Hero.astro` (light band, locked core line with teal strike/highlight marks on `#07B2B2`/`#057E7E`, "Start an Inquiry" CTA, `tel:` text line) rendering at `/design-preview/a/`
- Local build/check both exit 0: `npm run build` shows `Copying fonts (3 files)`, `npx astro check` shows `0 errors, 0 warnings, 0 hints`
- All plan `<verify>` automated checks pass: 3 WOFF2 files, 1 font preload, `size-adjust` present, `data-theme="light"` present, `noindex` meta present, governance files unchanged, exact version pins confirmed, hex values scoped to `tokens.css` only, no `prefers-color-scheme` anywhere in `src`
- Vercel project `zinc-digital-web` created in team `zincdigitalofmiamis-projects` (Pro), CLI-linked (`link: null`), framework `astro`, `nodeVersion: 24.x`, no `targets.production`
- A protected preview deployment is live and verified: unauthenticated `GET /design-preview/a/` returns `302` to `https://vercel.com/sso-api`, `x-robots-tag: noindex`

## Task Commits

1. **Task 1: Owner gate — package legitimacy and the go for the Vercel project** — no commit (checkpoint; approved by the owner in chat 2026-09-25 ~2:04 PM CT, per orchestrator dispatch context; no file changes)
2. **Task 2: Tracer — scaffold, token system, Pairing A hero, protected Vercel preview** — `266e4fd` (feat)

**Plan metadata:** pending (this SUMMARY commit)

## Files Created/Modified

- `package.json` — name `zinc-digital-web`, `private: true`, `engines.node: 24.x`, scripts `dev`/`build`/`check`/`astro`, exact-pinned `astro@7.3.5` + `@astrojs/vercel@11.0.11`
- `package-lock.json` — generated lockfile for the above plus devDependencies
- `tsconfig.json` — copied from the scaffold (`astro/tsconfigs/strict`)
- `astro.config.mjs` — `output: 'static'`, `adapter: vercel()`, Pairing A `fonts` array
- `.vercelignore` — excludes `.planning/`, `.claude/`, `docs/`, `.scratch/`, `.env`, `.env.*`, `node_modules/`, `dist/`, `.astro/`
- `src/styles/tokens.css` — the one token set (color, spacing, type)
- `src/styles/themes.css` — `[data-theme]` semantic mapping
- `src/styles/base.css` — reset, type roles, band layout, focus-visible, decorative marks
- `src/styles/pairings.css` — `[data-pairing="a"]` font mapping
- `src/layouts/PreviewLayout.astro` — noindex preview shell, Pairing A `<Font>` tags
- `src/components/MockupBands.astro` — composes `Hero` (Plan 01-02 adds more bands)
- `src/components/bands/Hero.astro` — the hero band, light ground
- `src/pages/design-preview/a.astro` — route `/design-preview/a/`

## Decisions Made

- **`.gitignore` CLI-append reverted:** `vercel link` auto-appended a redundant `.vercel` line to `.gitignore` (the file already had `.vercel/`). Reverted with `git checkout -- .gitignore` (a single named-file checkout, not a blanket reset) to keep the plan's governance-file-immutability check (`git diff --quiet HEAD -- AGENTS.md CLAUDE.md README.md .gitignore`) exact, per the plan's explicit "do not edit it" instruction.
- **Deployment Protection scope corrected:** the plan assumed `ssoProtection.deploymentType: "all_except_custom_domains"` (matching sibling projects on this team, per RESEARCH.md). Live measurement showed this setting leaves the production alias domain (`<project>.vercel.app` and the team-scoped `<project>-<team>.vercel.app` alias) **unauthenticated (HTTP 200)** even though it correctly protects raw per-deployment URLs (HTTP 302). Corrected to `prod_deployment_urls_and_all_previews`, which the Vercel CLI's own OpenAPI spec documents as protecting "production Vercel-provisioned URLs (project.vercel.app) and all preview/git-branch/deployment URLs."
- **First-deployment-is-always-production accepted as a platform constraint:** for this git-disconnected, CLI-only-linked project, every `vercel deploy` attempt — bare, `--target preview`, `--target=preview` — returned `"target": "production"` for the project's first deployment, regardless of flags (reproduced 3 times after each remediation). A second deployment, made once one deployment already existed in the project's history, correctly returned `"target": null` (preview). The plan's literal instruction ("never pass --prod") could not be honored for the bootstrap deployment; the constraint's actual intent — no unauthenticated public exposure — was honored by keeping the bootstrap deployment unaliased (verified protected via raw-URL 302) and removing it once a genuine preview deployment existed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Live unauthenticated exposure: production alias domain was publicly reachable**
- **Found during:** Task 2, step M6 (`vercel deploy`)
- **Issue:** The plan's step M2 accepted the project's default `ssoProtection.deploymentType: "all_except_custom_domains"` as sufficient (matching sibling-project research). The first `vercel deploy --yes` (no `--prod` passed) nonetheless produced a deployment tagged `"target": "production"` and auto-aliased to `https://zinc-digital-web.vercel.app`. Curling that alias returned `HTTP/2 200` — the draft hero page, including `[DRAFT]` copy, was publicly reachable with no login wall. The raw per-deployment URL was correctly protected (302 to sso-api) throughout.
- **Fix:** Immediately removed the exposed deployment (`vercel remove <url> --yes`) each time it recurred (3 occurrences total, across different alias URL shapes — plain `.vercel.app`, team-scoped `-team.vercel.app`), verified closure via fresh `curl` (404 `DEPLOYMENT_NOT_FOUND`) after every removal before taking the next step. Corrected the project's `ssoProtection.deploymentType` to `prod_deployment_urls_and_all_previews`. Diagnosed (via Context7 `/vercel/vercel` docs + direct reproduction) that this project's first-ever deployment always targets production regardless of CLI flags; remediated by deploying once with `--prod --skip-domain` to bootstrap the project without any alias, verifying the bootstrap deployment stayed unaliased and protected, then removing it once a subsequent plain `vercel deploy --yes --force` correctly returned a `target: null` (preview) deployment that was never aliased to any public domain.
- **Files modified:** none (Vercel project configuration only; no source files)
- **Verification:** Final state confirmed via `curl -D -` on all three URL shapes (`zinc-digital-web.vercel.app`, `zinc-digital-web-zincdigitalofmiamis-projects.vercel.app`, and the live preview deployment URL) — only the live preview deployment URL resolves, returning 302 to `vercel.com/sso-api` with `x-robots-tag: noindex`; both alias domains return 404 (unassigned). `vercel alias ls` and `vercel ls zinc-digital-web` confirm exactly one deployment exists, tagged `Environment: Preview`, with no aliases.
- **Committed in:** not applicable — Vercel-side configuration and deployment state, not a file change; documented here and in `.scratch/` logs (`deploy.log` through `deploy7.log`, `vercel-remove.log`, `unauth-headers.txt`)

**2. [Rule 3 - Blocking] Reverted a governance-file diff introduced by `vercel link`**
- **Found during:** Task 2, step M4 (`vercel link`)
- **Issue:** `vercel link` auto-appended `.vercel` to `.gitignore` (redundant with the existing `.vercel/` entry), which would have failed the plan's own `git diff --quiet HEAD -- AGENTS.md CLAUDE.md README.md .gitignore` acceptance check.
- **Fix:** `git checkout -- .gitignore` (single named file, not a blanket reset).
- **Files modified:** none (reverted to original state)
- **Verification:** `git diff --quiet HEAD -- .gitignore` exits 0.
- **Committed in:** not applicable (file reverted before any commit; never entered the diff)

---

**Total deviations:** 2 auto-fixed (1 Rule 1 security bug with live remediation, 1 Rule 3 blocking governance-file revert)
**Impact on plan:** The Rule 1 fix was essential — without it, draft copy and the unreleased visual direction would have stayed publicly reachable at a guessable URL (`zinc-digital-web.vercel.app`). No scope creep: no source files changed, only Vercel project configuration and deployment lifecycle. The plan's own threat register (T-01-01, T-01-06) anticipated exactly this class of risk; the mitigation mechanism named in the plan (`all_except_custom_domains`) needed a one-value correction to actually close it on this team's Pro plan.

## Issues Encountered

- **Vercel CLI target resolution does not match its own documentation for git-disconnected projects.** Context7's `/vercel/vercel` docs state `vercel deploy` (no flags) defaults to preview. Measured behavior on this specific project (CLI-linked, no Git integration) was that the very first deployment always targets production regardless of flags; only the second and later deployments correctly default to preview. This is now recorded as a pattern for future phases in this project: never trust the very first `vercel deploy` on a fresh, git-disconnected project to be a preview deployment — always curl-verify the resulting URL(s), including the default alias domain, before reporting a URL as safe.
- Resolved before Task 2's commit; no open issue remains for the code artifacts. The Vercel project itself now holds exactly one deployment (the verified preview) with corrected protection.

## User Setup Required

None — Vercel actions in this plan required only the Task 1 owner "approved" reply, already recorded by the orchestrator before dispatch.

## Next Phase Readiness

- Waiting on **Task 3** (owner checkpoint, `gate="blocking"`): the owner must open the preview URL below in a browser where they are logged into Vercel, and separately in a private window, and confirm what they see (per `<checkpoint_rule>` in the dispatch — not auto-approved even though `workflow.auto_advance: true`, because this requires the owner's own browser session).
- **Preview URL:** `https://zinc-digital-gh6jtacag-zincdigitalofmiamis-projects.vercel.app/design-preview/a/`
- **Deployment ID:** `dpl_8aV6NowgemyX6agXZHZmLfWUMQtc`
- Once Task 3 is confirmed, Plan 01-02 can proceed (adds the dark band, brand mark, spec sheet) on top of this proven token system and Vercel setup — no architectural changes expected.

---
*Phase: 01-design-system-font-pick*
*Completed: 2026-09-25 (through Task 2; Task 3 pending owner confirmation)*
