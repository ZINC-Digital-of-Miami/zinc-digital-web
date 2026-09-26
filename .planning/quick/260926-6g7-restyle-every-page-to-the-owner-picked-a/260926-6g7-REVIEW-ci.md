# CI sub-task review — quick task 260926-6g7, "ci"

2026-09-26 07:00 CT. Worktree: `zinc-digital-web-worktrees/quick-260926-6g7-ci`, branch `gsd/quick-260926-6g7-ci`, base `876e3b7` (PR #4 head).

## Commits

| SHA | Message |
|---|---|
| `78e1824` | `fix(quick-260926-6g7): make check-site.mjs's diff base and font check CI-safe` |
| `fc51c24` | `fix(quick-260926-6g7): align verify-mockup.mjs with the all-white design, pair ChromeDriver with the runner's Chrome` |
| `14e7317` | `ci(quick-260926-6g7): wire check-site.mjs into CI, add non-required browser-verify job` |

## Verification commands (exit codes, no grep pipes)

Logs: `/private/tmp/claude-501/-Volumes-Satechi-Hub-zinc-digital-web/4d63e2c8-f06b-433f-b6af-2afc7f083cb8/scratchpad/ci-*.log`

| Command | EXIT | Notes |
|---|---|---|
| `npm run check` | 0 | 0 errors / 0 warnings / 0 hints (`ci-check-final2.log`) |
| `npm run build` | 0 | 41 pages built (`ci-build-final.log`) |
| `node scripts/check-site.mjs` | 0 | all checks passed across 41 HTML files (`ci-checksite-final.log`) |
| `node scripts/check-site.mjs` under a fake-`git` shim that fails `rev-parse --verify origin/main` | 1 | fail-closed fallback engaged: scanned 90 tracked files instead of 21, found real U+00A7 hits in `.planning/`/`AGENTS.md`/`docs/` that the normal changed-only diff never sees (`ci-checksite-fallback.log`) — proves the fallback path, not a real failure under normal CI operation |
| Font-URL regex fixtures (byte-identical regex, isolated) | 0 | fixture 1 (three `?dpl=`-suffixed sources) → size 3, pass; fixture 2 (two distinct sources) → size 2, correctly fails the `===3` gate (`ci-font-fixture.log`) |
| `node scripts/verify-mockup.mjs --self-test` | 0 | nine fault-injection directions detected, both before and after the edits |
| `node scripts/verify-mockup.mjs --mode quick` (unmodified npm chromedriver) | 1, then **crash** | `SessionNotCreatedError: This version of ChromeDriver only supports Chrome version 154. Current browser version is 153.0.8010.49` — measured, real, present locally right now (`ci-verifymockup-quick.log`) |
| `node scripts/verify-mockup.mjs --mode quick` with `CHROMEDRIVER_PATH` pointed at a matched `chromedriver@153.0.8010.52` (installed via the already-vendored `@puppeteer/browsers`, not a new project dependency) | 1 | browser launches, navigates, runs axe, completes the full quick-mode flow; failures are real current-`src/` findings, not verifier bugs (`ci-verifymockup-final.log`) |
| `actionlint .github/workflows/ci.yml` | 0 | clean, no findings |

## What `verify-mockup.mjs` reports against current `src/` (quick mode, paired driver)

After aligning the checker with the all-white design, **"invalid/nested band theme"** and **"home band order"** are gone for every sampled route (`/`, `/services/shopify/`, `/contact/`, `/blog/`) — those were the stale checks. Remaining failures are genuine current-`src/` state, not verifier bugs, and are reported (not fixed, not suppressed — out of this sub-task's file scope):

- `/thanks/ meaningful page body`, `/not-a-real-page/ meaningful page body` — both templates are short by design (a single confirmation/404 paragraph); the generic >300-character threshold applies uniformly and always will fail these two. Pre-existing, unrelated to the restyle; not touched.
- `/ image2x/ratio`, `/services/shopify/ image2x/ratio`, `/contact/ image2x/ratio`, `/blog/ image2x/ratio` — several `mockup/*.webp` images (`wordmark-black`, `ouabc-site`, `ouabc-mobile`, `kirk-musick`, `priya-nahar`, `dr-basset`) fail the 2x-source/ratio check. Other agents' asset domain.
- `/ content starts at top` — `h1` top offset ≥ 250px on the current build. Likely header/nav height from in-flight contrast/heading fixes.
- `decoded core line` — `"Other agencies deliver the scope. ZINC delivers the business."` is not present in the current hero copy (`HomeBands.astro` currently reads `"ZINC delivers"` with different continuation). Copy/content, not mine to change.
- `/ axe` — `color-contrast` (serious) on several home-band elements. Matches the brief's note that contrast fixes are in flight elsewhere.
- `honest thanks` — the post-submit `/thanks/` text reached via the simulated multi-step contact flow doesn't include the expected confirmation string in this run.
- `clear filter recovers` — blog filter "Clear filter" doesn't restore the expected `"18 articles"` count text in this run.

None of these are touched by this sub-task's commits; they're reported per the brief ("failures it finds in current src/ should be reported, not suppressed").

## Font URL / `?dpl=` reconciliation

`astro.config.mjs`'s own `astro:build:done` hook already strips Vercel's `?dpl=<deployment id>` query before reading font files from disk (confirmed by reading the file — not touched, not in this sub-task's edit scope). `check-site.mjs`'s font check did **not** do the same and would have been fooled by a `?dpl=`-suffixed source at serve time. Fixed with the identical strip-the-query pattern, plus a new on-disk `wOF2`-magic-byte verification for each of the exactly-three required distinct sources. Proved with isolated regex fixtures (see table above) — byte-identical regex confirmed via `grep` against the live file before running the fixture.

## `origin/main` diff-base fix

`actions/checkout`'s own README (github.com/actions/checkout, fetched live via `gh api` this session): *"Only a single commit is fetched by default, for the ref/SHA that triggered the workflow. Set `fetch-depth: 0` to fetch all history for all branches and tags."* On `pull_request` (checked-out ref is the PR merge commit, not `main`) and on `merge_group` (checked-out ref is a temporary `gh-readonly-queue/main/...` merge commit), `origin/main` has no local ref at all under the previous single-commit-only checkout — `git diff --name-only ... origin/main` throws `unknown revision`. Fixed two ways, per the brief's "for example... or":

1. **`ci.yml`**: added an explicit `git fetch --no-tags --prune --depth=1 origin +refs/heads/main:refs/remotes/origin/main` step right after checkout. `git diff --name-only` between two commits only needs both commits' trees, not ancestry, so a depth-1 fetch of just `main`'s tip is sufficient and cheap — no need for `fetch-depth: 0` (full history/branches).
2. **`check-site.mjs`**: added a `git rev-parse --verify origin/main` guard before the diff; if it fails for any reason, the scan fails closed by scanning every tracked file (`git ls-files`) instead of the changed-files diff, rather than silently scanning zero files. Proved live with a `git` shim that fails only that one command (see table above) — the fallback path found real hits the normal path never sees.

## Browser verifier: CI decision, with evidence

**Decision: added, as a separate, explicitly non-required job (`browser-verify`), with an honest caveat.**

Evidence for:
- `gh api rate_limit` confirmed network access; `gh api repos/actions/runner-images/contents/images/ubuntu/Ubuntu2404-Readme.md` (official runner-image doc, fetched live this session) shows `ubuntu-latest` preinstalls `Google Chrome 153.0.8010.52` and `ChromeDriver 153.0.8010.52` together — a matched pair — with the driver's directory exposed via env var `CHROMEWEBDRIVER=/usr/local/share/chromedriver-linux64`.
- Measured locally: the project's actual driver source is the npm `chromedriver` package pulled in transitively by `@axe-core/cli` (`package-lock.json`: `"chromedriver": "latest"`), which chases Chrome-for-Testing's newest release independent of whatever Chrome is on the machine. Right now that's `154.0.8037.57` against a locally installed Chrome `153.0.8010.49` — a real, reproducible mismatch, not hypothetical: `node scripts/verify-mockup.mjs --mode quick` crashed with `SessionNotCreatedError` before this fix.
- Fix: `verify-mockup.mjs` now prefers `$CHROMEWEBDRIVER/chromedriver` (the runner-paired driver) when set, then an explicit `CHROMEDRIVER_PATH` override, then the previous npm-bundled-binary default. Installed a matched `chromedriver@153.0.8010.52` locally via the already-vendored `@puppeteer/browsers` CLI (no new project dependency — this tool ships transitively already) and re-ran quick mode with `CHROMEDRIVER_PATH` pointed at it: the browser launched, ran the full route/link/axe/contact-flow/blog-filter suite, and produced real content findings (listed above) rather than a session-creation crash. This proves the *mechanism* the CI job depends on.

Residual, honestly unverified: I have not observed this workflow run on the actual `ubuntu-latest` GitHub Actions runner in this session — I was told not to push or open a PR, so there is no live run to point to. The fix is evidence-based (official docs + a locally reproduced matched-pair run) but **NOT VERIFIED live**. Mitigations reflecting that:
- The new job is named `browser-verify`, distinct from `build` — ruleset 24024093's `required_status_checks` only lists `{"context":"build","integration_id":15368}`, so this job cannot become a required check by accident, and adding it changes no repository setting.
- It's gated `needs: build` and non-blocking by construction (a separate job, not a step inside `build`).
- Regardless of how the live run goes, `npm run verify` (new script) is the explicit, zero-CI-cost pre-merge gate command the brief asked for as the fallback: `astro build && node scripts/check-site.mjs && node scripts/verify-mockup.mjs --mode quick`.
- Recommendation: watch the first real run of `browser-verify` after merge; if headless Chrome fails to launch in the container (a known category of risk for sandboxed root-less containers, distinct from the version-pairing problem solved here) or the job proves too slow/costly, drop the job and rely on `npm run verify` alone — no ruleset change needed either way since it was never required.

## Ruleset patch for making the Vercel status a required check — NOT APPLIED

Measured facts (`gh api`, this session):
- `gh api repos/ZINC-Digital-of-Miami/zinc-digital-web/rulesets/24024093` — the `required_status_checks` rule's parameters currently list exactly one required check: `{"context":"build","integration_id":15368}` (`15368` = the GitHub Actions app, matching the `build` check-run's `app.id` from `check-runs`).
- `gh api repos/ZINC-Digital-of-Miami/zinc-digital-web/commits/876e3b7/status` and `.../statuses` — Vercel reports via the **classic Commit Status API**, not a Check Run: `{"state":"success","context":"Vercel","creator":{"login":"vercel[bot]",...,"html_url":"https://github.com/apps/vercel"}}`.
- `gh api apps/vercel` — the Vercel GitHub App's integration id is **`8329`** (matches the status creator's `avatar_url` pattern `.../in/8329`, cross-verified).

Exact JSON patch (add one entry to the existing array; everything else in the ruleset is unchanged) — apply via `gh api --method PUT repos/ZINC-Digital-of-Miami/zinc-digital-web/rulesets/24024093 --input -` with this body, or the ruleset UI:

```json
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "required_reviewers": [],
        "require_code_owner_review": false,
        "dismissal_restriction": { "enabled": false, "allowed_actors": [] },
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "require_extra_approval_for_unattributed_changes": true,
        "allowed_merge_methods": ["squash"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "build", "integration_id": 15368 },
          { "context": "Vercel", "integration_id": 8329 }
        ]
      }
    }
  ]
}
```

**Not applied** — the brief and this session's instructions ("Do not change any repository setting or ruleset") both forbid it. One caveat worth the owner's attention before running it: `strict_required_status_checks_policy` is currently `false` (branch need not be up to date with `main` before merge) and Vercel's own status here is `"Deployment has completed"` for a **preview** deployment on the PR branch, not `main` — adding it as required will block merges on that same preview-deployment status existing and succeeding for every future PR head SHA, which is the intended effect but is worth confirming against how Vercel's Git integration is configured (preview deployments enabled for all branches) before flipping it on.
