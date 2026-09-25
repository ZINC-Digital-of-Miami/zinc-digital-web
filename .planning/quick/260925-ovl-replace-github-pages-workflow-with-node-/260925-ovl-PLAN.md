---
phase: quick-260925-ovl
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .github/workflows/astro.yml
  - .github/workflows/ci.yml
files_deleted:
  - .github/workflows/astro.yml
autonomous: true
requirements: [quick-260925-ovl]

estimate:
  tokens: 30000
  raw_tokens: 30000
  tasks: 2
  confidence: low

must_haves:
  truths:
    - "The disabled GitHub Pages sample workflow (Node 20, pages: write, id-token: write) is gone from the repository."
    - "A single CI workflow runs on pull_request to main, push to main, merge_group and workflow_dispatch, with one job whose id and check name are both `build`."
    - "On a ref with no package.json (main today) the `build` job succeeds and emits a notice saying no app exists yet; it never leaves a pending or skipped required check."
    - "On a ref with package.json (PR #2 once ci.yml is on main) the job runs, in order, npm ci, npm run check (astro check) and npm run build (astro build) on Node 24, and fails the job if any of them fail or if the Node major is not 24."
    - "Every `uses:` is pinned to a full 40-character commit SHA whose action.yml declares `runs.using: node24`."
    - "The workflow token is least-privilege (contents: read only), checkout does not persist credentials, and no `run:` script interpolates `github.event.*`."
  artifacts:
    - path: ".github/workflows/ci.yml"
      provides: "Node 24 CI gate for the Vercel-hosted Astro site"
      contains: "name: build"
  key_links:
    - from: ".github/workflows/ci.yml step `detect`"
      to: "setup-node, npm ci, check and build steps"
      via: "step output `present` gates each app step with `if: steps.detect.outputs.present == 'true'`"
      pattern: "steps.detect.outputs.present"
    - from: ".github/workflows/ci.yml job `build`"
      to: "future GitHub ruleset required check"
      via: "stable job id and name `build`"
      pattern: "name: build"
---

<objective>
Replace the disabled GitHub Pages sample workflow with a Node 24 CI gate for this Vercel-hosted Astro site.

Purpose: main is the product and is only changed through a PR. A stable, always-reporting `build` check lets a ruleset require it later, proves every PR type-checks and builds on the owner-mandated Node 24, and removes a Node 20 Pages workflow that targets hosting this project does not use (hosting is Vercel; the Pages site does not exist).

Output: `.github/workflows/ci.yml` added, `.github/workflows/astro.yml` deleted. Nothing else in the repository changes.

Out of scope (orchestrator does these after the PR lands; do NOT do them here): Vercel Git connection, GitHub ruleset, pushing, opening the PR.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/AGENTS.md
@/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.planning/STATE.md
@/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.github/workflows/astro.yml

Working tree (run every command here): `/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl`, branch `gsd/quick-260925-ovl-replace-github-pages-workflow-with-node-`, created from origin/main f5c7a90. The path contains a space: quote it in every command.

Measured at planning time (2026-09-25, 5:55 PM CT) from the direct sources:

| Fact | Source | Value |
|------|--------|-------|
| actions/checkout latest release | `gh api repos/actions/checkout/releases/latest` | v7.0.1 (published 2026-07-20 10:10 AM CT), tag is a lightweight ref to commit `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/checkout runtime at that SHA | its action.yml | `using: node24`; input `persist-credentials` defaults to `true` |
| actions/setup-node latest release | `gh api repos/actions/setup-node/releases/latest` | v7.0.0 (published 2026-07-13 9:46 PM CT), commit `820762786026740c76f36085b0efc47a31fe5020` |
| actions/setup-node runtime at that SHA | its action.yml | `using: 'node24'`; `package-manager-cache` defaults to true but only fires when package.json has a `packageManager`/`devEngines.packageManager` field; explicit `cache: npm` needs a lockfile |
| PR #2 package.json (branch gsd/phase-01-design-system-font-pick, head be1e437) | `gh api .../contents/package.json?ref=...` | engines node `24.x`; scripts `build: astro build`, `check: astro check`; deps astro 7.3.5, @astrojs/vercel 11.0.11; dev @astrojs/check 0.9.10, typescript 6.0.3; NO `packageManager` field |
| Local lint tools (already installed, do not install anything) | `command -v` | actionlint 1.7.12 at /opt/homebrew/bin/actionlint, shellcheck at /opt/homebrew/bin/shellcheck, PyYAML 6.0.3 |
| API-coverage detector on this scope | `api-coverage.cjs --json` | `detected: false` (no external API integration; gate skipped) |
| Assumption-delta detector | `assumption-delta scan` | `skipped: phase_unresolved` (quick task, no roadmap phase; checkpoint not raised) |
| Schema gate | scope scan | no ORM/schema files; no schema push task |

These SHAs are leads measured at planning time. The executor re-resolves them live before writing (Task 1 step 1) and uses whatever the live release tags point to at that moment, then re-proves `runs.using: node24` at the exact SHA it pins.
</context>

<tasks>

<task type="tracer">
  <name>Task 1: Tracer, delete the Pages workflow and add the full ci.yml gate (trigger, guard, Node 24 toolchain, npm ci, check, build) in one pass</name>
  <files>.github/workflows/astro.yml (delete), .github/workflows/ci.yml (create)</files>
  <read_first>/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.github/workflows/astro.yml</read_first>
  <action>
Step 1, resolve pins live (never from memory or from this plan's table). For each of actions/checkout and actions/setup-node: read `gh api repos/OWNER/REPO/releases/latest --jq .tag_name`; read `gh api repos/OWNER/REPO/git/ref/tags/TAG --jq '.object.type + " " + .object.sha'`; if the type is `tag` (annotated), dereference once more with `gh api repos/OWNER/REPO/git/tags/SHA --jq .object.sha` to get the commit SHA. Then confirm the runtime at that exact SHA with `gh api "repos/OWNER/REPO/contents/action.yml?ref=SHA" --jq .content | base64 -d | grep -E '^[[:space:]]+using:'` and require it to print node24. If either action's latest release is not node24, stop and report; do not fall back to an older release silently. Record tag, commit SHA and the using line for each in the SUMMARY.

Step 2, delete the Pages workflow with `git rm .github/workflows/astro.yml`. Rationale: hosting is Vercel, the Pages site returns 404, the workflow is disabled_manually with zero runs, and it pins Node 20 plus pages: write and id-token: write scopes this project never needs.

Step 3, create `.github/workflows/ci.yml` with exactly this shape (write it as YAML; prose below is the specification):
- Top comment block, 3 to 6 lines, stating: this is the Node 24 CI gate for the Vercel-hosted Astro site; Vercel does deploys, this workflow only gates; the `build` job always reports so a ruleset can require it; when package.json is absent the job passes and logs a notice.
- `name: CI`.
- `on:` with four triggers: `pull_request` limited to `branches: [main]`; `push` limited to `branches: [main]`; `merge_group` (bare, costs nothing today and keeps a future merge queue from stalling on a required check that never reports); `workflow_dispatch` (bare). Do NOT use pull_request_target anywhere.
- Workflow-level `permissions:` with only `contents: read`.
- `concurrency:` with `group` set to the workflow name plus the PR number falling back to the ref (expression form: github.workflow, then a hyphen, then github.event.pull_request.number OR github.ref), and `cancel-in-progress` set to the expression that is true only when github.event_name equals pull_request, so superseded PR runs are cancelled but push-to-main runs always finish. Expressions are allowed in `concurrency:`; they are NOT allowed inside any `run:` script (see below).
- `defaults: run: shell: bash`.
- One job with id `build` and `name: build` (both literally `build`; this string is the future required-check name and must stay stable). `runs-on: ubuntu-latest` (standard GitHub-hosted runner, free for this public repo; never a larger runner). `timeout-minutes: 15`. Job-level `env:` with `ASTRO_TELEMETRY_DISABLED: "1"`.
- Steps, in this order:
  1. `name: Checkout`, `uses: actions/checkout@<checkout commit SHA>` followed by a trailing YAML comment carrying the release tag (for example `# v7.0.1`), `with: persist-credentials: false`.
  2. `name: Detect app`, `id: detect`. A bash script that tests for `package.json` in the workspace root with `[ -f package.json ]`. If present: append `present=true` to "$GITHUB_OUTPUT" and echo a line saying the app was found. If absent: append `present=false` to "$GITHUB_OUTPUT" and emit a workflow command notice, titled `No app yet`, whose message says package.json is not on this ref, the Astro app has not landed, and install, check and build are skipped. The step exits 0 in both branches. Quote "$GITHUB_OUTPUT". Chosen over a hashFiles-based `if:` because it logs the reason explicitly and yields one testable output (Claude's discretion per scope).
  3. `name: Set up Node 24`, `if: steps.detect.outputs.present == 'true'`, `uses: actions/setup-node@<setup-node commit SHA>` with trailing tag comment, `with:` `node-version: '24'` and `cache: npm`. Node 24 is set literally (owner rule: Node 24 at every layer) rather than read from package.json, so the runtime cannot drift if engines is ever edited. `cache: npm` is explicit because PR #2's package.json has no packageManager field, so the setup-node auto-cache would not engage; if a future package.json lands without package-lock.json this step fails closed, which is correct because npm ci needs the lockfile anyway.
  4. `name: Assert Node 24`, same `if:`. Bash: read the major with `node -p` on process.versions.node split at the dot, print `node --version`, and if the major is not exactly 24 emit an error workflow command and exit 1.
  5. `name: Install dependencies`, same `if:`, `run: npm ci`.
  6. `name: Type-check (astro check)`, same `if:`, `run: npm run check`.
  7. `name: Build (astro build)`, same `if:`, `run: npm run build`.
- Hard rules for every `run:` block: no `${{ }}` expression of any kind inside a run script (this rules out github.event interpolation and script injection outright); every `uses:` is `owner/repo@<40-hex commit SHA>` with the tag only in a trailing comment; no secrets referenced; no artifact upload; no deploy job; no `pages`, `id-token` or write scopes.

Step 4, run `actionlint` (already installed at /opt/homebrew/bin; it also runs shellcheck on each run script because shellcheck is on PATH) on the new file, and fix every finding until it prints nothing and exits 0.
  </action>
  <verify>
    <automated>cd "/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl" && test ! -e .github/workflows/astro.yml && echo ASTRO_YML_ABSENT && /opt/homebrew/bin/actionlint .github/workflows/ci.yml > "/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl-actionlint.log" 2>&1; echo "ACTIONLINT_EXIT=$?"; cat "/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl-actionlint.log"; for u in $(grep -E '^[[:space:]]*uses:' .github/workflows/ci.yml | sed -E 's/.*uses:[[:space:]]*([^ #]+).*/\1/'); do repo="${u%@*}"; sha="${u#*@}"; printf '%s %s ' "$repo" "$sha"; gh api "repos/$repo/contents/action.yml?ref=$sha" --jq .content | base64 -d | grep -E '^[[:space:]]+using:'; done</automated>
  </verify>
  <done>astro.yml no longer exists (ASTRO_YML_ABSENT printed); ci.yml exists; actionlint prints nothing and ACTIONLINT_EXIT=0; the loop prints exactly two lines, actions/checkout and actions/setup-node, each with a 40-hex SHA and `using: node24` (quoted or unquoted). Both edits are committed together in one atomic commit on the quick branch.</done>
</task>

<task type="auto">
  <name>Task 2: Prove the rules and both guard branches with a structural audit and a local guard simulation</name>
  <files>/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/ci_audit.py (scratch, outside the repo, not committed)</files>
  <read_first>/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.github/workflows/ci.yml</read_first>
  <action>
Create the scratch directory `/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/` (external drive, outside the repo; nothing in this task touches the repository) and write `ci_audit.py` there. It takes the ci.yml path as its only argument, loads it with PyYAML `safe_load`, and asserts each of the following, printing `PASS <rule>` or `FAIL <rule>: <detail>` per rule and exiting 1 if any rule fails:

1. Triggers: the `on` mapping (note PyYAML parses the bare key `on` as boolean True; read either key) contains exactly pull_request, push, merge_group and workflow_dispatch; pull_request and push each have `branches == ['main']`; pull_request_target is absent.
2. Permissions: top-level `permissions` equals the mapping contents: read and nothing else; no job defines its own permissions with any `write` value.
3. Concurrency: `group` is present and references github.workflow; `cancel-in-progress` references github.event_name and pull_request.
4. Job: `jobs` has exactly one key, `build`; its `name` is `build`; `runs-on` is `ubuntu-latest`; `timeout-minutes` is set and at most 30.
5. Pins: every step `uses` value matches the regex owner/repo@ followed by exactly 40 lowercase hex characters and nothing else.
6. Checkout: the checkout step has `persist-credentials` false.
7. Injection: no step `run` string contains the two-character sequence dollar-brace-brace (build the needle in code by concatenating the characters, so the literal never appears in this plan or the script as a bare token).
8. Guard: a step with id `detect` exists and has no `if`; every step after it that is not the checkout carries an `if` equal to the output-present comparison; the setup-node step has node-version `'24'` (string) and cache `npm`.
9. Order: the run commands after the guard appear in the order npm ci, npm run check, npm run build.

Then simulate the guard locally, both branches, with the real script text taken from the file (never a hand copy): in the same python script, or a second small script, extract the `run` string of the step whose id is `detect`, and execute it with bash twice, each time in a fresh temporary directory under the scratch directory and with GITHUB_OUTPUT pointed at a temp file in that directory: (a) empty directory, assert exit 0, output file contains `present=false`, stdout contains the `::notice` workflow command with title `No app yet`; (b) directory containing an empty `{}` package.json, assert exit 0 and output file contains `present=true`. Print `PASS guard-absent` and `PASS guard-present` on success.

Run the audit against the worktree ci.yml, capturing the exit code directly (no pipe). If any rule fails, fix ci.yml (amend within the same quick branch as a follow-up commit), rerun actionlint from Task 1, and rerun the audit until all PASS.

When all pass, move the scratch directory and the Task 1 actionlint log to `/Volumes/Satechi Hub/_TRASH_ZINC_CLEANUP/2026-09-25/260925-ovl/` (owner cleanup rule: move, do not delete) and list what was moved in the SUMMARY.
  </action>
  <verify>
    <automated>python3 "/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/ci_audit.py" "/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.github/workflows/ci.yml" > "/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/audit.log" 2>&1; echo "AUDIT_EXIT=$?"; cat "/Volumes/Satechi Hub/zinc-digital-web-worktrees/_scratch-260925-ovl/audit.log"; cd "/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl" && git status --porcelain && git diff --name-status f5c7a90..HEAD -- . ':(exclude).planning'</automated>
  </verify>
  <done>AUDIT_EXIT=0 with PASS on all nine rules plus guard-absent and guard-present, and zero FAIL lines; `git diff --name-status f5c7a90..HEAD` outside .planning shows exactly `D .github/workflows/astro.yml` and `A .github/workflows/ci.yml`; working tree clean apart from GSD planning artifacts; scratch files moved to the trash directory and listed in the SUMMARY.</done>
</task>

</tasks>

<threat_model>
Security enforcement is on: ASVS level 1, block on high. This change adds one CI workflow; the trust boundaries are GitHub events into the runner and the runner's GITHUB_TOKEN.

## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| PR author to runner | PR titles, branch names, bodies and code from any contributor (including forks on this public repo) reach the runner |
| Third-party action code to runner | actions/checkout and actions/setup-node execute with the job token |
| npm registry to runner | `npm ci` installs whatever package-lock.json on the PR ref resolves |
| Runner to repository | GITHUB_TOKEN scope determines what a compromised step could change |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-ovl-01 | Tampering | `uses:` references in ci.yml | high | mitigate | Every action pinned to a full 40-hex commit SHA resolved live from the release tag; Task 2 rule 5 fails on any tag or short ref. Task 1 re-proves node24 at the pinned SHA |
| T-ovl-02 | Elevation of privilege | GITHUB_TOKEN | high | mitigate | Workflow permissions limited to contents: read (Task 2 rule 2); `pull_request` (fork PRs get a read-only token and no secrets), never pull_request_target (rule 1); no secrets referenced |
| T-ovl-03 | Information disclosure | Checkout credentials on disk | medium | mitigate | `persist-credentials: false` on checkout (Task 2 rule 6), so later steps and npm lifecycle scripts cannot read a stored token from .git/config |
| T-ovl-04 | Tampering | Script injection through event fields | high | mitigate | No expression syntax at all inside any `run:` script (Task 2 rule 7); guard uses a file test and a step output instead of interpolated event data |
| T-ovl-05 | Denial of service | Runner minutes (org Actions budget is $0 with prevent_further_usage) | medium | mitigate | Standard ubuntu-latest only (free on this public repo); concurrency cancels superseded PR runs; timeout-minutes 15 (Task 2 rules 3 and 4) |
| T-ovl-06 | Repudiation | CI results | low | accept | GitHub retains run logs and check results per commit; no additional audit trail needed for a gate-only workflow |
| T-ovl-SC | Tampering | `npm ci` dependency install | medium | transfer | This plan installs no packages; CI runs `npm ci` strictly from the lockfile on the PR ref. Package legitimacy for astro, @astrojs/*, typescript and friends is owned by the plan that added them (PR #2); `npm ci` refuses to run on lockfile drift |
</threat_model>

<verification>
- Task 1 verify: astro.yml absent, actionlint exit 0 with no output, both pinned actions print `using: node24` at their pinned SHA.
- Task 2 verify: audit exit 0 with all rules PASS and both guard branches PASS; diff against f5c7a90 outside .planning is exactly the delete plus the add.
- Live proof is the orchestrator's, after it pushes and opens the PR (out of scope here): the PR's own `build` check runs from the merge ref with no package.json and must pass with the `No app yet` notice; after merge, PR #2's `build` check must run npm ci, check and build on Node 24.
</verification>

<success_criteria>
- `.github/workflows/astro.yml` deleted; `.github/workflows/ci.yml` added; no other repository file changed.
- One job, id and name `build`, triggered by pull_request (main), push (main), merge_group and workflow_dispatch.
- Passes green with a logged notice when package.json is absent; runs npm ci, astro check and astro build on asserted Node 24 when present.
- All actions SHA-pinned to node24 releases resolved live; contents: read only; credentials not persisted; no expressions in run scripts; concurrency and timeout set.
- actionlint clean and the structural audit all PASS, with exit codes captured directly.
</success_criteria>

<output>
Create `/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260925-ovl/.planning/quick/260925-ovl-replace-github-pages-workflow-with-node-/260925-ovl-SUMMARY.md` when done. Include: the live-resolved tag, commit SHA and `using:` line for each action; the actionlint and audit exit codes and PASS lines; the commit SHA(s); the list of scratch files moved to trash. All times in CT.
</output>
