---
status: complete
phase: quick-260925-ovl
plan: 01
subsystem: ci
tags: [github-actions, ci, node24, workflow]
dependency-graph:
  requires: []
  provides: [".github/workflows/ci.yml"]
  affects: ["future GitHub ruleset required check"]
tech-stack:
  added: []
  patterns: ["file-test guard step (steps.detect.outputs.present) instead of hashFiles if:"]
key-files:
  created:
    - .github/workflows/ci.yml
  modified: []
  deleted:
    - .github/workflows/astro.yml
decisions:
  - "Kept the guard as a bash file-test step (id: detect) with an explicit ::notice, not a hashFiles()-based if:, so the reason is logged and there is one testable step output."
metrics:
  duration: "~15 minutes"
  completed: "2026-09-25 CT"
actuals:
  tokens: 8500
  tasks: 2
  commits: 1
  plan_head_before: f5c7a90
requirements: [quick-260925-ovl]
---

# Quick Task 260925-ovl: Replace GitHub Pages Workflow with Node 24 CI Gate Summary

Deleted the disabled Node 20 GitHub Pages sample workflow and added a single always-reporting `build` job (Node 24, SHA-pinned actions, contents:-read-only) that gates PRs into `main` for this Vercel-hosted Astro site.

## What Was Built

- **Deleted** `.github/workflows/astro.yml` — the disabled, zero-run GitHub Pages sample workflow (Node 20, `pages: write`, `id-token: write`) that targeted a hosting surface (Pages) this project does not use (hosting is Vercel; the Pages site 404s).
- **Added** `.github/workflows/ci.yml` — one job, id and name `build`, triggered by `pull_request` (branches: `[main]`), `push` (branches: `[main]`), `merge_group`, and `workflow_dispatch`. Workflow-level `permissions: contents: read` only. `concurrency` cancels superseded PR runs, never push-to-main runs. `timeout-minutes: 15`.
  - Step `detect` (id: `detect`, no `if:`) tests for `package.json` and emits `present=true`/`present=false` to `$GITHUB_OUTPUT`, plus an `::notice title=No app yet::` workflow command when absent.
  - Every subsequent app step (setup-node, Node-version assertion, `npm ci`, `npm run check`, `npm run build`) is gated `if: steps.detect.outputs.present == 'true'`.
  - No `${{ }}` expression appears in any `run:` script.

## Live-Resolved Action Pins (measured 2026-09-25, ~5:55–6:00 PM CT)

| Action | Tag | Commit SHA | `using:` at that SHA |
|---|---|---|---|
| `actions/checkout` | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` | `node24` |
| `actions/setup-node` | v7.0.0 | `820762786026740c76f36085b0efc47a31fe5020` | `'node24'` |

Both tags are lightweight refs pointing directly at the commit (`gh api .../git/ref/tags/<tag> --jq '.object.type + " " + .object.sha'` returned `commit <sha>` for each — no annotated-tag dereference step was needed). `using: node24` was confirmed live at each pinned SHA via `gh api "repos/OWNER/REPO/contents/action.yml?ref=<sha>"` immediately before commit, matching the SHAs already present in the working tree.

## Verification

**Task 1 (`actionlint` + pin proof):**
```
ASTRO_YML_ABSENT
ACTIONLINT_EXIT=0
```
(actionlint printed no findings.) Pin-proof loop printed exactly two lines:
```
actions/checkout 3d3c42e5aac5ba805825da76410c181273ba90b1   using: node24
actions/setup-node 820762786026740c76f36085b0efc47a31fe5020   using: 'node24'
```

**Task 2 (structural audit + guard simulation), `AUDIT_EXIT=0`:**
```
PASS triggers-set
PASS triggers-branches
PASS no-pull_request_target
PASS permissions-contents-read-only
PASS no-job-write-permissions
PASS concurrency-group
PASS concurrency-cancel
PASS jobs-single-key-build
PASS job-name-build
PASS job-runs-on-ubuntu-latest
PASS job-timeout-set-and-<=30
PASS all-uses-pinned-40hex
PASS checkout-persist-credentials-false
PASS no-expressions-in-run-scripts
PASS detect-step-exists-no-if
PASS post-detect-steps-guarded
PASS setup-node-version-24-string-cache-npm
PASS run-order-npm-ci-check-build
PASS guard-absent
PASS guard-present
```
Zero FAIL lines. The guard was executed twice with the real `run:` text extracted from the file (never a hand copy) — once in an empty temp dir (exit 0, `present=false`, `::notice title=No app yet` on stdout) and once with a stub `{}` package.json (exit 0, `present=true`).

**Diff proof against `f5c7a90..HEAD` outside `.planning`:**
```
D	.github/workflows/astro.yml
A	.github/workflows/ci.yml
```
Exactly the delete plus the add — no other repository file changed. `git status --porcelain` after the commit shows only the untracked `.planning/quick/` GSD artifact directory.

## Commit

- `b886450` — `feat(quick-260925-ovl): replace GitHub Pages workflow with Node 24 CI gate` (both the delete and the add, one atomic commit on `gsd/quick-260925-ovl-replace-github-pages-workflow-with-node-`)

Task 2 touched no repository files (the audit script and its log lived entirely under the external-drive scratch directory, never inside the repo), so it produced no second commit — consistent with the plan's `files_modified`/`files_deleted` scope (astro.yml only).

## Scratch Files Moved to Trash

Per owner cleanup rule (move, don't delete), moved to `/Volumes/Satechi Hub/_TRASH_ZINC_CLEANUP/2026-09-25/260925-ovl/`:
- `scratch-260925-ovl/` (directory, containing `ci_audit.py` and `audit.log`) — was `/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/`
- `scratch-260925-ovl-actionlint.log` (0 bytes — actionlint had no findings) — was `/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl-actionlint.log`

## Deviations from Plan

None — plan executed exactly as written. The ci.yml content found already on disk at task start matched the plan's full specification byte-for-byte against every must-have rule; the live pin re-resolution in Task 1 Step 1 confirmed the SHAs already present were still current and still `node24` rather than requiring any change.

## Out of Scope (confirmed not done here)

Per the plan's objective: no push, no PR opened, no Vercel Git connection change, no GitHub ruleset change, no other repository file touched.

## Self-Check: PASSED

- `FOUND: .github/workflows/ci.yml` (exists, tracked, committed)
- `MISSING (expected): .github/workflows/astro.yml` (deleted, as intended)
- `FOUND: b886450` in `git log --oneline --all`
