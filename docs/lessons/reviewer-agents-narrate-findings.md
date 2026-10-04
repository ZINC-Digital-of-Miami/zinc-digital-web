---
name: reviewer-agents-narrate-findings
touches: visual review rounds (task 5.2), /Volumes/Satechi Hub/zinc-digital-web-review/visual/m2/round-<n>/
kind of work: review orchestration
date: 2026-10-04 · source: M2 round 2 (session ended 22:47 UTC)
---

# Background reviewer agents end with the session and cannot write files, so their findings must be stated as they go

**Rule:** Tell each reviewer to state every finding in its running text the moment it finds one, using the `findings.md` format. Record each reviewer's agent ID and output path. After an interruption, pull the partial notes from those transcripts before re-running anything. Save each report to the round folder yourself as soon as it arrives.

**Evidence:** round 2 ran five reviewers. Two finished, and their reports were saved by the implementer because the agents could not write files. Three (services, work/case/about, article/legal) were cut off when the session ended at 22:47 UTC. Their transcripts held only progress notes plus one finding ("F1", the footer comma), so round 2 could not cover those templates and round 3 had to re-review everything.

**Why it was easy to get wrong:** an agent's full report arrives only at hand-back, which looks safe until the session ends first.

**Apply:** dispatch reviewers as Kiro agents where the session allows it (`spawn_run`, agent `kirocrew-worker`, without memory or lessons so the review stays blind). A Spec Builder execution session cannot: `spawn_run` accepts only `spec-builder--*` agents (none exist) and `workflow_run` fails with "dashboard user required" (4 Oct 2026). There, run the same brief on the harness's built-in agents and tell the owner which kind ran. Keep each scope small enough to finish in about 10 minutes (one template group), and put the narrate-as-you-go instruction in every brief. Keep each image a reviewer reads under 2000 px on both edges (Kiro `web-verify` rule); shrink larger sheets with `~/.kiro/crew/skills/web-verify/scripts/downscale_image.py` first.
