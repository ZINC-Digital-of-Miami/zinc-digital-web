---
name: chrome-needs-no-sandbox-locally
touches: scripts/verify-site.mjs, scripts/capture.mjs, scripts/lighthouse.mjs (local runs on the owner's Mac)
kind of work: tooling
date: 2026-10-04 · source: M2 tasks 4.2, 5.1, 6.1
---

# Headless Chrome tabs crash on this Mac unless the sandbox is off

**Rule:** Run the browser scripts locally with `CHROME_NO_SANDBOX=1`. CI does not need it.

**Evidence:** local verify-site runs ended with "tab crashed" until `--no-sandbox` was added. All three scripts read `CHROME_NO_SANDBOX=1`. The full and quick verify-site runs then passed with 0 failures.

**Why it was easy to get wrong:** the crash looks like a page bug or memory problem, not a launch flag.

**Apply:** the local command prefix is `PATH="/opt/homebrew/opt/node@24/bin:$PATH" TMPDIR="/Volumes/Satechi Hub/zinc-digital-web-review/tmp" CHROME_NO_SANDBOX=1`.
