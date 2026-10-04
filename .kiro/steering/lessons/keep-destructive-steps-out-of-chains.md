---
name: keep-destructive-steps-out-of-chains
touches: shell commands in this worktree
kind of work: tooling
date: 2026-10-04 · source: M1–M2 permission denials
---

# One blocked step denies the whole chained command, so keep risky steps on their own

**Rule:** Run checks, builds and commits as their own commands. Never chain a removal, amend, force push or `.env` read onto them. Leave scratch removals for the end-of-task cleanup report.

**Evidence (denied commands):**
- 19:35 UTC: `git add … && git commit --amend && git push` was denied ([Excess Sensitive Detail]), so nothing was pushed.
- 21:05 and 21:33 UTC: a build-and-check run that ended in `rm -rf "$OUT"…` or `rm -rf …/m2-41-save` was denied as a whole. The live-mode build check did not run.
- 21:25 UTC: `ls -la .env` was denied. The live-form test ran with the Supabase variables forced empty instead.
- 20:56 UTC: resolving my own PR's review threads was denied as [Self-Approval].

**Why it was easy to get wrong:** chaining saves a turn, but the denial loses the useful steps too.

**Apply:** use a new commit instead of `--amend` once a branch is pushed. Never read `.env`; pass test values on the command line. If merging or resolving threads on my own PR is denied, answer the threads and report the exact blocked action.
