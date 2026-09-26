# Graph Report - phase-01  (2026-09-25)

## Corpus Check
- 41 files · ~78,770 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .css 3, .lock 1)

## Summary
- 482 nodes · 449 edges · 36 communities (32 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7250ae63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Phase 1: Design System & Font Pick - Research
- ZINC Digital — Site Redesign Design Spec
- package.json
- CI tooling (used only inside GitHub Actions, not app dependencies)
- Part B (verbatim) — Approved design spec
- Architecture Research
- Critical Pitfalls
- Implications for Roadmap
- Part D — Live state, owner actions, incidents, resume
- v1 Requirements
- Implementation Decisions
- Phase 1 — UI Design Contract
- v1 Requirements
- Feature Research
- Phase 1 Plan 1: Tracer — Scaffold, Token System, Pairing A Hero, Protected Vercel Preview Summary
- Stack Research
- ZINC Digital Website (zinc-digital-web)
- Phase Details
- Project State
- zinc-digital-web — Turnover
- External Integrations
- Technology Stack
- Phase 1 — Validation Strategy
- Architecture Patterns
- Walking Skeleton: ZINC Digital Website (zinc-digital-web)
- BLOCKING CONSTRAINTS — Read Before Anything Else
- 01-01-PLAN.md
- tsconfig.json
- 01-02-PLAN.md
- 01-03-PLAN.md
- 01-04-PLAN.md
- 01-05-PLAN.md
- AGENTS.md — zinc-digital-web
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Part B (verbatim) — Approved design spec` - 20 edges
2. `ZINC Digital — Site Redesign Design Spec` - 19 edges
3. `Phase 1: Design System & Font Pick - Research` - 17 edges
4. `v1 Requirements` - 15 edges
5. `Phase 1 — UI Design Contract` - 15 edges
6. `v1 Requirements` - 15 edges
7. `CI tooling (used only inside GitHub Actions, not app dependencies)` - 13 edges
8. `Critical Pitfalls` - 13 edges
9. `Phase 1 Plan 1: Tracer — Scaffold, Token System, Pairing A Hero, Protected Vercel Preview Summary` - 12 edges
10. `Pitfalls Research` - 11 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (36 total, 4 thin omitted)

### Community 0 - "Phase 1: Design System & Font Pick - Research"
Cohesion: 0.05
Nodes (37): Alternatives Considered, Applicable ASVS Categories, Architectural Responsibility Map, Assumptions Log, `astro check` catching a `cssVariable` typo (verified this session), Code Examples, Common Pitfalls, Complete `astro.config.mjs` for this phase (adapter + all pairing-A font entries; B and C follow the identical shape) (+29 more)

### Community 1 - "ZINC Digital — Site Redesign Design Spec"
Cohesion: 0.07
Nodes (26): 10. Performance and quality gates (launch-blocking), 11. SEO, 12. Content migration, 13. Proof and content inputs, 14. Architecture, 15. Launch and cutover, 16. Delivery, 17. Out of scope (+18 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (25): dependencies, astro, @astrojs/vercel, devDependencies, @astrojs/check, @axe-core/cli, @lhci/cli, typescript (+17 more)

### Community 3 - "CI tooling (used only inside GitHub Actions, not app dependencies)"
Cohesion: 0.08
Nodes (25): Alternatives Considered, Architecture, CI tooling (used only inside GitHub Actions, not app dependencies), Constraints, Conventions, Core, Core Technologies, Dev dependencies (+17 more)

### Community 4 - "Part B (verbatim) — Approved design spec"
Cohesion: 0.08
Nodes (26): 10. Performance and quality gates (launch-blocking), 11. SEO, 12. Content migration, 13. Proof and content inputs, 14. Architecture, 15. Launch and cutover, 16. Delivery, 17. Out of scope (+18 more)

### Community 5 - "Architecture Research"
Cohesion: 0.08
Nodes (25): Anti-Pattern 1: Letting `Loop.astro` fetch its own highlight data, Anti-Pattern 2: `output: 'server'` "to be safe" for a mostly-static site, Anti-Pattern 3: A second redirect list living in `vercel.json` or duplicated in code comments, Anti-Patterns, Architectural Patterns, Architecture Research, Component Responsibilities, Content → page → markup (one direction, no back-edges) (+17 more)

### Community 6 - "Critical Pitfalls"
Cohesion: 0.08
Nodes (23): Critical Pitfalls, Integration Gotchas, "Looks Done But Isn't" Checklist, Performance Traps, Pitfall 10: Magenta `#FC0781` fails WCAG contrast as small text, and kinetic type risks the AA gate the spec itself set, Pitfall 11: DNS cutover TTLs and Search Console verification lapse at the exact moment the team can least afford it, Pitfall 12: Owner copy review, sitting on the critical path, has no explicit checkpoint cadence — so it either blocks everything at the end or gets rubber-stamped, Pitfall 1: Catch-all or missing redirects silently bleed indexed URLs (+15 more)

### Community 7 - "Implications for Roadmap"
Cohesion: 0.09
Nodes (21): Architecture Approach, Confidence Assessment, Critical Pitfalls, Executive Summary, Expected Features, Gaps to Address, Implications for Roadmap, Key Findings (+13 more)

### Community 8 - "Part D — Live state, owner actions, incidents, resume"
Cohesion: 0.10
Nodes (20): 2. Live state (measured 3:03 PM CT), 3. What is built (Phase 1, plan 01-01 — complete), 4. What is NOT done, 5. Things that need a decision or a human, 6. How to resume (exact path), 7. Cleanup done at turnover, 8. Incident log (for the record), A. Decision register (owner interview, 2026-09-25, in order) (+12 more)

### Community 9 - "v1 Requirements"
Cohesion: 0.10
Nodes (20): About (ABOU), Blog (BLOG), Contact (CONT), Content, Copy (COPY), Design System (DSGN), Homepage (HOME), Launch (LNCH) (+12 more)

### Community 10 - "Implementation Decisions"
Cohesion: 0.11
Nodes (17): Brand mark (locked), Canonical References, Claude's Discretion, Color (locked — spec §8, §18), Copy (locked — spec §7), Deferred Ideas, Design authority, Gates that start here (spec §10) (+9 more)

### Community 11 - "Phase 1 — UI Design Contract"
Cohesion: 0.12
Nodes (15): Brand Mark Assets (DSGN-05), Checker Sign-Off, Color, Copywriting Contract, Design System, Draft Mockup Copy (Phase 1 scope only — [DRAFT COPY], not final), Font/Mockup Preview Routing (execution decision, Claude's discretion), Font Pairings (DSGN-01) (+7 more)

### Community 12 - "v1 Requirements"
Cohesion: 0.13
Nodes (15): About (ABOU), Blog (BLOG), Contact (CONT), Copy (COPY), Design System (DSGN), Homepage (HOME), Launch (LNCH), Migration (MIGR) (+7 more)

### Community 13 - "Feature Research"
Cohesion: 0.13
Nodes (14): Add After Validation (v1.x), Anti-Features (Commonly Requested, Often Problematic), Dependency Notes, Differentiators (Competitive Advantage), Disagreements With the Spec (flagged separately, per instructions), Feature Dependencies, Feature Landscape, Feature Prioritization Matrix (+6 more)

### Community 14 - "Phase 1 Plan 1: Tracer — Scaffold, Token System, Pairing A Hero, Protected Vercel Preview Summary"
Cohesion: 0.14
Nodes (13): Accomplishments, Auto-fixed Issues, Decisions Made, Deviations from Plan, Files Created/Modified, Issues Encountered, Next Phase Readiness, Owner Resolution (orchestrator, 2026-09-25 CT) (+5 more)

### Community 15 - "Stack Research"
Cohesion: 0.14
Nodes (13): Alternatives Considered, Core Technologies, Development Tools, Email delivery — SMTP vs Gmail API decision, Installation, Recommended Stack, Redirects / 410 on Vercel for a static Astro site, Sources (+5 more)

### Community 16 - "ZINC Digital Website (zinc-digital-web)"
Cohesion: 0.15
Nodes (12): Active, Business Context, Constraints, Context, Core Value, Evolution, Key Decisions, Out of Scope (+4 more)

### Community 17 - "Phase Details"
Cohesion: 0.15
Nodes (12): Overview, Phase 1: Design System & Font Pick, Phase 2: Homepage & the Loop, Phase 3: Services & Proof, Phase 4: About & Inquiry, Phase 5: Blog, SEO & Redirects, Phase 6: Launch Readiness & Owner Approval, Phase 7: Cutover (+4 more)

### Community 18 - "Project State"
Cohesion: 0.18
Nodes (10): Accumulated Context, Blockers/Concerns, Current Position, Decisions, Deferred Items, Pending Todos, Performance Metrics, Project Reference (+2 more)

### Community 19 - "zinc-digital-web — Turnover"
Cohesion: 0.20
Nodes (9): 1. What this is, 2. Live state (measured 3:03 PM CT), 3. What is built (Phase 1, plan 01-01 — complete), 4. What is NOT done, 5. Things that need a decision or a human, 6. How to resume (exact path), 7. Cleanup done at turnover, 8. Incident log (for the record) (+1 more)

### Community 20 - "External Integrations"
Cohesion: 0.22
Nodes (8): APIs & External Services, Authentication & Identity, CI/CD & Deployment, Data Storage, Environment Configuration, External Integrations, Monitoring & Observability, Webhooks & Callbacks

### Community 21 - "Technology Stack"
Cohesion: 0.25
Nodes (7): Configuration, Frameworks, Key Dependencies, Languages, Platform Requirements, Runtime, Technology Stack

### Community 22 - "Phase 1 — Validation Strategy"
Cohesion: 0.25
Nodes (7): Manual-Only Verifications, Per-Task Verification Map, Phase 1 — Validation Strategy, Sampling Rate, Test Infrastructure, Validation Sign-Off, Wave 0 Requirements

### Community 23 - "Architecture Patterns"
Cohesion: 0.29
Nodes (7): Anti-Patterns to Avoid, Architecture Patterns, Pattern 1: One shared markup source, per-pairing CSS variable swap, Pattern 2: Astro's native `fonts` config replaces manual subsetting entirely, Pattern 3: Vercel Deployment Protection — Standard Protection + Vercel Authentication, never Password Protection, Recommended Project Structure, System Architecture Diagram

### Community 24 - "Walking Skeleton: ZINC Digital Website (zinc-digital-web)"
Cohesion: 0.29
Nodes (6): Architectural Decisions, Capability Proven End-to-End, Out of Scope (Deferred to Later Slices), Stack Touched in Phase 1, Subsequent Slice Plan, Walking Skeleton: ZINC Digital Website (zinc-digital-web)

### Community 25 - "BLOCKING CONSTRAINTS — Read Before Anything Else"
Cohesion: 0.33
Nodes (5): BLOCKING CONSTRAINTS — Read Before Anything Else, Critical Anti-Patterns, Infrastructure State, Pre-Execution Critique Required, Required Reading (in order)

### Community 27 - "01-01-PLAN.md"
Cohesion: 0.40
Nodes (4): Artifacts this phase produces, Phase Goal, STRIDE Threat Register, Trust Boundaries

### Community 28 - "tsconfig.json"
Cohesion: 0.40
Nodes (4): astro/tsconfigs/strict, exclude, extends, include

### Community 29 - "01-02-PLAN.md"
Cohesion: 0.50
Nodes (3): Artifacts this phase produces, STRIDE Threat Register, Trust Boundaries

### Community 30 - "01-03-PLAN.md"
Cohesion: 0.50
Nodes (3): Artifacts this phase produces, STRIDE Threat Register, Trust Boundaries

### Community 31 - "01-04-PLAN.md"
Cohesion: 0.50
Nodes (3): Artifacts this phase produces, STRIDE Threat Register, Trust Boundaries

### Community 32 - "01-05-PLAN.md"
Cohesion: 0.50
Nodes (3): Artifacts this phase produces, STRIDE Threat Register, Trust Boundaries

## Knowledge Gaps
- **374 isolated node(s):** `name`, `private`, `type`, `version`, `node` (+369 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 399 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Part B (verbatim) — Approved design spec` connect `Part B (verbatim) — Approved design spec` to `Part D — Live state, owner actions, incidents, resume`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Part B (verbatim) — Requirements` connect `Part D — Live state, owner actions, incidents, resume` to `v1 Requirements`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `Phase 1: Design System & Font Pick - Research` connect `Phase 1: Design System & Font Pick - Research` to `Architecture Patterns`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _374 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Phase 1: Design System & Font Pick - Research` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `ZINC Digital — Site Redesign Design Spec` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._