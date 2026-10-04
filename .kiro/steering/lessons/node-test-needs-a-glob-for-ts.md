---
name: node-test-needs-a-glob-for-ts
touches: package.json (test script), tests/
kind of work: testing
date: 2026-10-04 · source: M2 task 4.3
---

# `node --test tests/` does not pick up `.ts` files under Node 24 type stripping; pass a quoted glob

**Rule:** The test script is `node --test 'tests/*.test.ts'`, quoted so Node, not the shell, expands it.

**Evidence:** task 4.3's literal `node --test tests/` failed to run the TypeScript tests. The quoted glob runs all 8 (`npm test`: pass 8, fail 0).

**Why it was easy to get wrong:** the directory form works for `.js`/`.mjs` tests, and tasks.md 4.3 is written with it.

**Apply:** add new test files as `tests/<name>.test.ts`. Do not "fix" the script back to the directory form from the task text.
