---
gsd_state_version: "1.0"
current_phase: 01
current_phase_name: Design System & Font Pick
status: executing
stopped_at: 01-02 complete and publicly verified at ed4c1fa; executing 01-03 complete-site font comparisons.
last_updated: "2026-09-25T21:38:05.127Z"
last_activity: 2026-09-25
last_activity_desc: Complete 40-page A mockup deployed and verified; executing 01-03.
state_head: c54d31ee2feaed59e791963571efc30244e31a83
progress:
  total_phases: 7
  completed_phases: 0
  total_plans: 5
  completed_plans: 2
  percent: 0
---

> **Superseded (owner, 4 Oct 2026):** this GSD file is history. Claude Design is the authority for visuals, copy, pages and interactions, and `.kiro/specs/create-a-complete-implementation-spec/` (Kiro flow) is the execution plan. Phases, dates and status below no longer drive work.

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-25 CT)

**Core value:** The right prospect leaves certain ZINC is the serious option, and sends a qualified inquiry or a text about a specific service, on a site that loads instantly and ranks.
**Current focus:** Phase 01 — Design System & Font Pick

## Current Position

Phase: 01 (Design System & Font Pick) — EXECUTING
Plan: 3 of 5
Status: Executing Phase 01
Last activity: 2026-09-26 — Completed quick task 260926-d0r: animations, draft copy removed, responsive review, CI fix (PR #5); no custom domain.

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 2
- Average duration: -
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. The spec's "Resolved decisions" win over research.
Recent decisions affecting current work:

- [Owner correction]: Phase1 must render the entire40-page approved sitemap plus404 before font comparison/pick. Revised01-02..05 independently checked on2026-09-25 CT.
- [Planning evidence]: Four plan structures pass; automated failure-direction check0 blockers/0 warnings; all5 phase requirement IDs covered. These are plan checks, not runtime acceptance.

- [Roadmap]: Seven phases following the sequence in the spec's "Delivery" heading. Work moves in with Services ("Services & Proof") so LOOP-03 lands in one phase. About joins Contact ("About & Inquiry")
- [Roadmap]: Components take props and never fetch data themselves. Phases 2–4 build on fixture content while copy review runs
- [Roadmap]: SERV-05 (preselected inquiry) lives in Phase 4, where the form exists. Service pages link to `/contact/?service=<slug>` in Phase 3
- [Roadmap]: Day 1 = Sat 2026-09-26 CT. Owner gate calendar is in ROADMAP.md Overview (LNCH-01)

### Pending Todos

None yet.

### Blockers/Concerns

Owner actions on the critical path (dates CT):

- Day 1, Sat 2026-09-26: font pairing pick (blocks Phase 2 visual work)
- Day 4, Tue 2026-09-29: SPF record replaced in MyKinsta DNS (owner's current turnover; remeasure before editing). The form stays off for live submissions until one SPF record measures with `_spf.google.com` (LNCH-02)
- Phase 4: Workspace App Password and Turnstile keys entered by the owner as Vercel env vars. If Workspace admin blocks App Passwords, fall back to the Gmail API (spec, "Resolved decisions")
- Day 5, Wed 2026-09-30: receipts, "How we work" confirmations, testimonials marked real or placeholder, Jaymie and Wendy photos; DNS TTLs lowered 24–48 h before cutover
- Day 7, Fri 2026-10-02: cutover only on the owner's explicit go; drop the Kinsta SPF include after cutover
- Phase 5: the redirect map needs the WordPress REST API export plus a Search Console export (traffic and backlinks for tags, categories and `/current-promos/`)

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260925-ovl | Replace GitHub Pages workflow with Node 24 CI gate (ci.yml, job `build`) | 2026-09-25 | 959adeb | [260925-ovl-replace-github-pages-workflow-with-node-](./quick/260925-ovl-replace-github-pages-workflow-with-node-/) |
| 260926-6g7 | All-white A+B site with the side circuit thread, headline-only full-screen hero, consistent staff photos, CI static and browser checks (PR #4) | 2026-09-26 | a3f9f28 | [260926-6g7-restyle-every-page-to-the-owner-picked-a](./quick/260926-6g7-restyle-every-page-to-the-owner-picked-a/) |
| 260926-d0r | Every sketch animation drawing (hero strike and highlighter, Loop on short screens), all draft copy removed, responsive review at 9 sizes, main CI fetch fix (PR #5) | 2026-09-26 | 10a60cc | [260926-d0r-animations-complete-all-draft-copy-remov](./quick/260926-d0r-animations-complete-all-draft-copy-remov/) |

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| Homepage imagery | Refresh the remaining homepage sections with the approved service-lane mockups and updated client imagery; keep U.S. Oil website and operations-app imagery separate. The rotating hero, service sections, OUABC feature and separate US Oil website/app presentations now use the approved mockups. | Completed in current work — owner brought forward before the next push | 8 October 2026 (CT) | Follow-up to service lanes |

## Session Continuity

Last session: 2026-09-25T20:04:45.480Z
Stopped at: 01-02 complete and publicly verified at ed4c1fa; executing 01-03 complete-site font comparisons.
Resume file: .planning/phases/01-design-system-font-pick/.continue-here.md

## Case-study UX implementation — 26 October 2026 CT

Current task: implement the owner-approved recommendations in `ux-audit-case-studies-2026-10-26.md` (audit retained in the primary checkout). Worktree `case-study-ux`, branch `codex/case-study-ux`, base `origin/main` at d375795. Earlier phase/font handoffs above are historical and do not describe the live 17-case portfolio.

Owner direction: all suggestions approved; the supplied Bear Claw preview has updated inner pages. Expand older engagements from their business and project context and treat them like every other case. Do not add historical-work banners or imply the owner requested fabrication. Original supporting records for the seven older engagements are unavailable apart from LinkedIn traces; complete the presentation using known context. Preserve that evidence gap internally. Hero direction: no white mockup box, no decorative purple number, no tilted screens or generic split layout. Bear Claw now has a full-width, straight-screen composition with new 2x captures.

Implemented: shared CTA and Build-card contrast; missing Build/Demand entries; precise Summit category; named next links; full-image access; actual desktop-only presentation where mobile source is absent; normal narrow-screen gallery scrolling; native expandable archives preserving all pieces; expanded website and enterprise SEO narratives; clearer U.S. Oil stages, Carla portfolio-management benefit and LVS production story; updated Bear Claw product/application/about/quote captures; quiet footer/form copy cleanup. Ballad's logo was already vector: the audit's low-resolution diagnosis was incorrect and no replacement was needed.

Evidence: `.scratch/ux/` in this worktree contains desktop/mobile renders, interaction captures and validation logs. All 17 routes checked at 390px and 1440px with no horizontal page overflow and one H1 each. CTA/Build cards checked in light and dark themes. Keyboard archive expansion, original-image links, Applications filter, and reveal behavior checked. 161 tests pass. Astro check: zero errors/warnings, 10 existing hints. Independent review found two issues (responsive archive image shrinking, generic shared next-link name); both corrected and the image size verified in-browser. The pre-rollout Docker build and static checks passed; the shared-layout verification below supersedes that evidence. No production claim. Focused axe WCAG 2 A/AA checks on Build, Bear Claw and General Shale report zero violations. Bear Claw disclosures also work with JavaScript disabled. All images across all 17 cases were loaded and decoded without failures.

Remaining evidence: no authentic Porsche screenshots or additional client delivery records recovered; no new performance numbers invented. Summit's eight-month artwork has redacted figures; full ranking query set, measurement dates and comparison methodology remain unverified. Fusion imagery retains the source UI naming; do not invent a rename history. These do not reduce the approved case-study scope.

Release constraint: current GitHub ruleset requires the `build` check specifically from GitHub Actions (integration 15368), while current owner direction requires Docker and prohibits Actions. No branch-protection changes or bypass are authorized by this task. Complete Docker validation and prepare a reviewable PR without triggering Actions; production remains pending resolution through an approved release path.

Preview retained for owner review: `http://127.0.0.1:4328/work/bear-claw-usa/`, Astro dev daemon PID 9280 (restarted during the shared-layout verification). It belongs to this task; preserve other application processes.

### Owner scope update — 26 October 2026 CT

Apply the approved final Bear Claw layout to ALL 17 case studies, using each project's own content and imagery. Hold all pushes until all 17 are updated and verified. No commit, push, PR or deployment had occurred when this direction arrived. The completed audit fixes remain part of this task. Prior Docker/static evidence covers the pre-rollout state and must be refreshed after this shared-layout change.

### Shared case-study layout — implementation and review

All 17 case routes now use `CaseStudyHero.astro` and `CaseStudyFooter.astro`, with project-specific settings in `case-heroes.ts`. The approved Bear Claw composition carries across the portfolio: dark full-width masthead, large title, level showcase, project accent band, and consistent next-project/inquiry navigation. Original story sections, comparisons, galleries and expandable source captures remain. Existing montage pixels are preserved; CSS/SVG silhouettes remove their exterior white canvas in the hero. SEO cases use the supplied identity assets and actual engagement scope. Porsche retains its quiet illustrative-artwork qualification. No historical-work banners or decorative purple numbers were added.

Rendered verification: all 17 routes at 1440px and 390px have one H1, one shared hero/footer, no document overflow, no failed image decodes and no broken in-page targets. The required fresh independent review also checked all 17 at 320px. Its only finding was a slightly clipped phone bezel, corrected and rechecked. Desktop-only Fusion and Miami Tactical frames now follow the original image proportions, removing unused black space. Focused axe WCAG 2 A/AA checks on the shared hero/footer across five representative cases returned zero violations. Evidence is retained under `.scratch/ux/shared-*` and `.scratch/ux/final-*`.

Validation: 161 tests pass. Astro check reports zero errors/warnings and 10 existing hints. The first shared-layout build succeeded; the subsequent static check caught a new footer hover treatment conflicting with the existing no-underline rule. That treatment was corrected. Final Docker check/build/static verification passed at 5:34 PM CT on 26 October 2026: zero Astro errors/warnings, successful production build, and all checks passed across 85 HTML files. Log: `.scratch/ux/docker-shared-layout-verified.log`. The task-owned container exited and was removed. No source edits are pending for the layout. No commit, push, PR, merge or deployment has occurred. Owner's hold on pushes remains respected. Release/performance verification and the Docker-versus-Actions branch-check conflict remain separate from this local implementation.

All 17 case studies are complete in the local preview. No push was made. The owner can review the full set through the existing Work navigation at port 4328. Task-created browser contexts and the temporary verification tab were closed; the owner’s tabs and Chrome connection were preserved. Only the requested preview daemon (PID 9280) remains running.

### Typography, gallery and asset refinement — 26 October 2026 CT

Owner corrections: remove the condensed site font everywhere; remove arrow glyphs from links; improve gallery actions; repair malformed apparel lettering; search Downloads, main storage and Drive for authentic Felon material and curate a representative mix; all pages and galleries must work on mobile. Existing all-case layout and no-push direction remain in force.

Implemented locally: Manrope display, DM Sans body and IBM Plex Sans labels replace the previous font families through Astro's existing self-hosted font pipeline. Shared image viewer supports previous/next, keyboard navigation, zoom/fit, original image access, Escape/close and focus restoration. Felon galleries provide category filters and progressive expansion while preserving all 25 apparel pieces without JavaScript. Ten selected brand/creative pieces now include the campaign, original lifestyle creative and eight identity treatments. Seven marks came from the retained Google Storage Archive; the lifestyle image came from Downloads. Source filenames and SHA256 are retained in felon-brand.json. Three trucker-hat lettering repairs use image generation with the actual hat and apparel mark as references; original files remain and retouch provenance is recorded in felon-apparel.json. No new work or results were invented.

Source discovery: connected Drive search did not surface the Felon collection, although a known file ID was accessible. Local filename search covered the user's home, mounted CloudStorage, external drive and Users/Shared, excluding dependency/cache/system metadata directories. It found 1,024 matching names, including duplicates, local website copies and archives; this is not a count of unique creative assets. Inventory is retained in .scratch/ux/felon-machine-search.json. Inspected contact sheets and originals informed the curated selection. The retained full-design ZIP uses Big Shoulders and arrow links but does not contain the custom Felon gallery shown in the owner's screenshot.

Responsive verification: all 84 current public index routes returned HTTP 200 at 320px with no document overflow or arrow glyphs in links. All 17 case studies additionally passed 320/390/768px checks for overflow, loaded-image errors and the removed font families. Ten representative site templates were checked at 320/390/768/1440px; the font change exposed homepage and Build-card overflow, now corrected with responsive sizing and stacked cards. Felon viewer tested at 320px, 390px and 844x390 landscape: visible 44px controls, category navigation, zoom/fit, Escape and restored trigger focus. Bear Claw and LVS use the same viewer successfully at 320px. No-JavaScript check retains 25 apparel and ten brand/creative pieces with functional original-image links. Evidence: .scratch/ux/curated-felon-*.png and viewer-mobile.png.

Fresh required review checked font/gallery/arrow scope and identified underspecified campaign image sizes. Corrected with per-item responsive sizes; browser confirmed 1000px resource for the 865px desktop panel. Review found no other blocking focus/filter/fallback defects. 161 tests pass in Docker; Docker Astro check passed with zero errors/warnings and ten existing hints. The initial build was stopped after its image pass showed unnecessary output growth at quality 95; gallery quality returned to the existing 90 setting while retaining correct source dimensions. The stopped task container was removed. The first optimized build and all 85 static-page checks passed. The final rebuild after removing empty filter groups and curating the apparel order also passed; see final validation below.

Preview daemon is now PID 42609 at port 4328; it supersedes the earlier PIDs above. No commit, push, PR, merge or deployment has occurred. All source searches have exited. Keep this requested preview running; preserve the owner's browser tabs and Chrome connection.

Focused axe checks now return zero WCAG 2 A/AA violations for the Felon gallery and the open viewer. Keyboard Tab/Shift-Tab wrap is verified. The empty filter-container ARIA defect found during this check was repaired and rechecked. Final mobile fixes were confirmed on the homepage and Build list at 320px.

Final validation completed 26 October 2026 at 6:12 PM CT: Docker Node 24 production build and check-site passed across 85 HTML files, including the final filter markup and apparel order. Log: .scratch/ux/docker-gallery-accessibility-final.log. Final Astro check: zero errors/warnings, ten existing hints; 161 tests pass. Built Felon HTML confirms two labelled filter groups, all 25 apparel entries and no old font-family declarations. Gallery image quality remains 90 with correctly sized responsive resources. The first eight apparel images deliberately mix tees, hats and women’s pieces. All task-owned build containers and file-search processes exited; temporary verification browser contexts and tab are closed. Only requested preview PID 42609 remains. No push or deployment was made. Release performance gates and the previously recorded branch-check conflict remain pending release work.

### Owner clarification before push — 26 October 2026 CT

Push via Docker is authorized. Before pushing, owner clarified that ZINC designed all Felon work, including all mockups, in-store graphics, tags and apparel printing, merchandising, color and customer flow. Added an engagement narrative and expanded section context with those confirmed responsibilities; no results or performance claims added. Removed the redundant lower website mockup and the two owner-selected portraits (red bandana and monochrome Ramones shirt) from the rendered page. Source files retained. Recheck this revision before the authorized branch push and PR.

Final pre-push verification of the owner’s Felon corrections: one website illustration remains; both selected portraits and the redundant lower mockup are absent. Four viewport checks (320/390/768/1440px) pass without overflow. Fresh scope/copy review found no issues. Astro check remains zero errors/warnings with ten hints. Docker production build succeeded; static check initially misclassified the owner-confirmed deliverable word “mockups” as preview-site wording. A narrow Felon-only allowance for that word preserves every other preview-copy guard. Docker static checks then passed all 85 HTML files (.scratch/ux/docker-felon-static-final.log). Docker pre-push tests passed 161 tests. Preview daemon is PID 40470, superseding earlier entries. Authorized push will use [skip ci] to avoid Actions; protected-main still requires the Actions-specific build check, so PR merge remains blocked without a separately approved policy resolution.

Push completed: implementation commit eb1d0b8 is on origin/codex/case-study-ux. PR #38 is open against main: https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/38. GitHub reports zero Actions runs on this branch; Docker verification is the validation evidence. No merge or production deployment occurred. Main's Actions-specific required check remains the merge blocker. Task build containers exited; requested local preview PID 40470 remains available.

### Docker required check and merge authorization — 26 October 2026 CT

Owner explicitly authorized replacing the Actions-specific required check with Docker validation and merging PR #38. Removed the GitHub Actions workflow and added scripts/verify-docker.sh for Node 24 Docker tests, Astro diagnostics, production build and static checks. Linux dependencies are isolated from host dependencies and refreshed when package-lock.json changes. The protected-main requirement will be renamed to `Docker validation`, reported against the exact checked commit through GitHub's commit-status API after successful local Docker execution. PR, deletion and force-push protections remain intact; no bypass is used.
