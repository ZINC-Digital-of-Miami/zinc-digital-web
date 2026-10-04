---
name: branch-reset-after-squash-without-force-push
touches: spec/create-a-complete-implementation-spec branch, milestone PRs
kind of work: release flow
date: 2026-10-04 · source: M1 merge (#7, ce34273), commit d0c4478
---

# After a squash merge, reset the Kiro branch without a force push

**Rule:** Rebuild the branch on the new `main`. Then merge the old remote head into it, keeping the current content (`--ours` on conflicts), so the push is a fast-forward. Confirm the empty diff against `main` before continuing.

**Evidence:** after PR #7 was squash-merged as `ce34273`, `git push --force-with-lease` was denied by the permission system ([Git Destructive], 21:58 UTC). Commit `d0c4478` merged the old head `9dc3ef2` (tasks.md conflict resolved with `--ours`), and the push fast-forwarded. `main` is an ancestor of the branch head.

**Why it was easy to get wrong:** the Kiro flow says "reset the branch", which reads as `reset --hard` plus a force push.

**Apply:** task 7.1 and every later milestone PR uses this reset. Do not retry a force push.
