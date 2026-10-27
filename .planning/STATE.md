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

Ruleset 24024093 now requires `Docker validation`; the other protections are unchanged. The fresh Docker run has passed 161 tests and Astro diagnostics and is rebuilding responsive image variants before static checks. PR #38 is not yet merged.

Owner-requested PR/build audit: the repository has two open PRs (#38 and #32). Recent merged PRs #33–37 used GitHub Actions; earlier Docker logs for the current case-study work independently confirm passing tests/build/static checks. No Actions jobs are queued or running. Main still contains the CI workflow until #38 merges; #38 removes it. CodeQL default setup is not configured. Corrected AGENTS.md's stale “no Docker” clause to the current owner direction. PR #32 is conflicting and includes removed OUABC content as well as client-engagement modeling absent from #38; preserve it for separate reconciliation, do not merge or close it blindly. Its old Actions results are not Docker validation evidence.

Fresh Docker gate failed during image optimization with exit 137; Docker events confirm OOM. Tests and Astro diagnostics passed. Astro's image queue uses available CPU affinity, which exposed all eight CPUs in the shared 8 GB VM. The verification script now bounds its own container to two CPUs and lowers image-worker concurrency/allocation overhead. Retained generated image cache for retry; no unrelated containers changed. The old commit's required status records failure. A successful full run on the final head is still required before merge.

### PR #32 reconciliation — 27 October 2026 CT

PR #38 merged to main as cb6b369 after successful Docker validation (161 tests, Astro diagnostics, production build, 85 HTML checks). GitHub Actions CI is removed and main requires Docker validation. Owner now authorizes cleaning up PR #32 while retaining useful missing functionality, excluding OUABC and preserving the current designs.

Reconciliation uses a separate worktree; the old PR worktree's uncommitted work remains untouched. A merge records the old PR ancestry while retaining the current main tree. Useful functionality is recovered using current lane data: one portfolio card per client with all current engagements, client-specific section navigation, a complete next-project loop in portfolio order, portfolio ItemList schema, and the correct ZINC Fusion v16 product name. Current US Oil website/app separation and enterprise SEO entries are retained. Existing canonical URLs already solved the old empty-schema-URL issue. Old device frames, screenshots, layouts, fonts, OUABC content and stale source claims are not restored. The older duplicate engagement inventory is replaced by grouping the current lane inventory, avoiding competing sources of truth.

Warm dependency and image caches were cloned into this task's own scratch directory. Docker verification, rendered desktop/mobile checks and fresh review are required before updating and resolving the PR. Existing owner preview on port 4328 is preserved.

Reconciliation review found no blocking design/content regressions. All 17 case pages pass 320px overflow and section-target checks; Work and representative cases also pass at 390/768/1440px. Visual inspection caught the old full-height card anchor pushing engagement lists outside their cards; scoped height correction keeps all links inside. The old same-page SEO links now point into the case story. Docker validation is queued through the existing BI coordinator; no parallel heavy build was started.

### Scroll detail — 27 October 2026 CT

Owner requested movement in the existing gray diagonal band and more subtle related details. Preserved the layout, artwork and text positions; the homepage's existing scroll RAF updates bounded band drift, a smaller seal drift and service-rule reveals. Service links and portfolio actions have quiet hover/focus feedback. Mobile travel is reduced. Reduced-motion CSS restores static decoration, including when the preference changes while the page is open. No animation library or new perpetual loop was added. Browser measurements at 390/1440px confirm changing decorative transforms, stationary heading position and no horizontal overflow. Production case-study verification continues separately while the PR #32 production deployment waits in Vercel's queue.

### All-page pre-push review — 27 October 2026 CT

Owner requires contrast, animation opportunities, SEO, featured images, schema and AI-search review across all public pages before pushing. The final motion correction is a static diagonal plane with page content scrolling into it, preserving the angle and overlap; this supersedes the earlier drift/slide-in interpretation. Homepage counter-scrolling now fixes the plane at viewport top -100px, verified at 1440px and 390px; reduced motion restores document-static decoration. No animation dependency added.

All 85 public routes reviewed: 83 sitemap entries plus Thanks and 404. Settled light/dark axe contrast checks at1440, 320px overflow checks, and390px normal-motion image/scroll checks. Fixed homepage stamp opacity, white Work-card category text, LVS comparison backgrounds/focus accent, empty gallery buttons, and narrow signature-mark overlap. Initial service/form contrast flags were transition-timing false positives, discarded after settled reruns. All case pages passed image/overflow checks. A missed FAQ entrance in a rapid scan was directly rechecked and reveals correctly. Detailed evidence and motion opportunities: docs/reviews/ux-audit-all-pages-2026-10-27.md.

SEO sweep: unique titles/descriptions, oneH1, canonical/social metadata, parseable graphs and valid in-page anchor targets across85. Case OG images now use retained artwork, with CreativeWork.image matching; six stale generic social cards (old font/Four cases) replaced and three named SEO-case cards added. Contained montage dimensions are reported accurately. Existing server-rendered content, authorship, FAQ, robots, sitemap and llms directory retained; no ranking/citation claims. Privacy and Terms remain empty by existing approved-copy requirement and need owner-supplied wording.

PR32 production independently read back: all17 caseURLs200/sharedhero/footer, Work17clientcards with engagement links, no OUABC HTML. New fixes remain local/unpushed. The initial scoped review did not establish complete visual polish; the owner subsequently identified missing backgrounds and transitions. Owner preview4328 now runs this worktree, PID81477; old preview42495 and temporary4333PID49553 exited. Review screenshots and JSON retained in docs/reviews/all-page-2026-10-27. Release validation still pending; no new PR or deployment.

Final Docker verification passed at02:19CT on27October2026 for eea1d7c:163tests, zeroAstroerrors/warnings, productionbuild and all85HTMLchecks. Log .scratch/docker-all-page-final.log. Container f477b2d56eea exited/removed and slot returned toBI. Built-image readback independently checked85pages/65uniqueimages: all declared dimensions matchdecodedfiles. Live17cases also rechecked at390px: nooverflow, oneH1, validanchors and correctnext-projectloop. No push. Owner subsequently confirmed the CTA background was missing, requested the notch restored, full-width compositions, and an icon-only toggle with a true dark theme. These corrections supersede the prior visual completion assessment.


### Owner visual corrections — still local, 27 October 2026 CT

Fixed the CTA selector from a nonexistent direct child to its actual descendant relationship, restored dark CTA background and layered Insights notch, removed visible theme text while preserving an accessible changing label/pressed state, and removed broad layout width caps while retaining prose measures. Added coherent dark surfaces to homepage, portfolio, lane and custom case bodies, including gallery controls and captions. Original creative artwork is not inverted. The previous Docker pass at eea1d7c does NOT validate these subsequent edits.

Re-ran all85 routes at1440 light/dark contrast and320 overflow; corrected Felon gallery controls/captions, Carla mixed-logo caption and LVS production caption failures. Targeted reruns are clean. Inspected viewport screenshots for dark CTA desktop/mobile, wide notch, Felon mobile gallery, Web Design FAQ; decoded and inspected Bear Claw applications/company/quote images, confirming prior blank panels were capture artifacts. Icon-only toggle changes appearance and accessible label;1920px broad containers are uncapped with no page overflow. These are bounded checks, not a claim that every lower-page composition is approved. Retained evidence in docs/reviews/all-page-2026-10-27. Fresh source reviewer identified the gallery and width gaps, now fixed.

No push. Next: complete remaining rendered polish review and run fresh Docker verification when BI coordinator explicitly releases a slot. The coordinator currently holds the slot for Today followed by demand/Ads; do not run a competing build. Keep owner preview4328 PID81477 running. Privacy/Terms approved body copy remains outstanding. The homepage's repeated closing invitations remain a design opportunity, not an approved content deletion.


### Fresh Docker validation — 27 October 2026 CT

At02:55:55CT ran scripts/verify-docker.sh on HEAD eea1d7cad75f5498601bf2d08cda69d2187c27d9 plus the retained working patch .scratch/docker-theme-validation.patch (SHA256 ff64f09b8b6e64dcb215067e32d4bc49d7fd081b577a3a6a989d272f5a14727f). Container872f7e02827a completed the163tests, Astro check (0errors,0warnings,10hints), and production build at02:56:36CT. Initial overall exit1 came only from the outdated HTML assertion requiring visible “Dark mode” text on85pages. The owner explicitly requested removing that text and retaining only the icon.

Updated scripts/check-site.mjs to require a button, nonempty accessible name, decorative icon and no visible text label; prior browser proof verifies toggle function, changing accessible label/pressed state and theme. No application source changed after this build. Script SHA256 da2e184c09720992cfe9add71b4a5fb2dd84147482babf2f7cd0471517b1250c. With coordinator approval, the single brief Docker rerun (container name zinc-theme-html-check) checked unchanged built output at02:57:22–02:57:23CT, exit0: all85HTMLchecks passed. Container removal verified; slot explicitly released. Logs .scratch/docker-theme-validation.log and .scratch/docker-theme-html-check.log. No push or deployment. Remaining visual polish review still open; build success does not close it.


## Completed rendered pass and Summit expansion — 27 October 2026 CT

All 85 routes received desktop/mobile visual review. Article indices37–77 include all body, sources, related links and footer; the18 long migrated posts were verified with760 actual viewport captures because giant full-page screenshots corrupted above16k. Work review covered all17 cases, index and three lanes. Final Blog mobile21 viewport captures and47 case lower-page captures closed the earlier coverage gaps. Seven apparently blank Felon desktop images and Bear Claw quote were directly scrolled into view and decoded; all render. Evidence: final-visual/article-review/segments, blog-tail-*, gap-*, felon-decoded-*, bear-quote-final.png.

Fixed VIS-01–04: Business Intelligence dark bands and diagram labels, lane title breaks, unrelated article illustrations, redundant shared closings on Home/Contact/Thanks, and the homepage CTA seam. Preserved full-width backgrounds, fixed diagonal plane and layered notch. Current homepage section backgrounds verified charcoal; normal scrolling offsets the diagonal by exactly the section's scroll delta. Mobile menu closes after transition; carousel advances; all five BI tabs select one panel; contact validation/Continue/Back work without submitting.

Summit now has a dedicated ten-piece brand gallery: original brand book, primary/light logos, standalone mark, logo explorations, location graphics, photographic treatment, footer art, supporting icon and before/after creative. Existing campaign and website presentations remain. Added explicit design context; removed duplicate brand-book carousel item and replaced the wrong Work-index dashboard thumbnail with actual Summit website captures. All ten images load; inspected desktop/mobile, corrected cropped mobile icons. Viewer advances9/10 to10/10 and Escape closes. No analytics/account artwork added. Evidence: summit-*, summit-mobile-icons-fixed.png. Source originals retained unchanged in assets registration.

Restored76 inventoried migrated comparison tables with a fail-open parser that preserves cells and declines linked/malformed rows. Removed only duplicated source references and duplicate takeaway paragraphs; fixed six stale service references through the article overlay, preserving the migration snapshot. Actual desktop1024 andmobile390 table views checked; fixed narrow mobile captions and crowded first-column allocation. The76-table assertion and compilation remain UNVERIFIED until Docker runs.

Targeted post-change light/dark contrast and320px overflow checks pass for Home, BI, Summit, both affected article examples and Thanks. Prior85-route SEO/schema/featured-image sweep remains applicable except the Summit title update, which was read back with oneH1, canonical and schema. Fresh scoped source review found no verified blocker. Build success from02:56CT predates this pass and must not be reused as validation.

No push/deployment. Final scripts/verify-docker.sh is queued behind the owner's BI checks; coordinator explicitly withheld a slot. Privacy/Terms approved body copy is still outstanding. Keep owner preview4328 PID81477; no task-owned build or browser-capture processes remain. Remaining release action: run the queued Docker gate on the final local changes, address failures, and retain evidence before considering a push.


### Final polish Docker validation — 27 October 2026 CT

Coordinator allocated one bounded run at04:43:20CT. HEAD eea1d7cad75f5498601bf2d08cda69d2187c27d9 plus36 changed/new files inventoried with SHA256 in .scratch/docker-final-polish-manifest.json; tracked diff in .scratch/docker-final-polish.patch. Container8d64d629aae9 (Node24,2CPUs) completed165tests (allpass), Astro239files (0errors,0warnings,10hints), productionbuild at04:44:32CT. Initial exit1 was solely20 stale HTML assertions requiring duplicate source sections and three unrelated illustrations intentionally removed by the authorized polish review. Container removed. Failed output retained in .scratch/docker-final-polish.log.

Corrected only scripts/check-site.mjs: requires an actual HTTPS source link in either retained authored Trusted Source Links or generated source section; specifically requires no unrelated inline illustration on the three named research articles while retaining other illustration, responsive hero and social-image checks. ScriptSHA256 dd787e8fbd1f56a9b96ec4515f1fbc35644fd776bb5b91877437978ead11b5d6; diff .scratch/docker-final-html-assertions.patch. No application changes after successful build. Coordinator allocated a single brief HTML-only rerun04:45:16CT, confirmedexit0 by04:45:21CT: all85HTMLchecks passed. Containername zinc-final-polish-html removed; ID not captured before its automatic removal. Log .scratch/docker-final-html-check.log. Slot released explicitly toBI, no further runs. Nothing pushed or deployed. Owner preview4328 retained. Privacy/Terms approved body copy remains outstanding.


### Owner-authorized release and editorial pass — 27 October 2026 CT

Owner authorizes push, protected merge and production verification after polished-site review, explicitly including Summit branding and natural, brand-safe blog copy. Fresh editorial review read all41articles:23authored and18migrated. Focused authored edits remove forced jokes, abstract phrasing and awkward service-link labels. The migrated editorial overlay retains original snapshot/provenance while removing internal publishing/schema-placement instructions, unsupported staffing/testimonial claims, stale active-update language and repetitive AI-prompt sections. Practical explanations, source citations and comparisons remain. Illustrative scenarios are labeled. Updated only revised articles' modification dates, keeping publication dates.

Technical corrections checked against Google primary documentation: PerformanceMax negativekeywords support (support.google.com/google-ads/answer/15726455); syndicated copies intended to stay out ofSearch use partner noindex rather than treating cross-domaincanonicals as guaranteed (developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting#syndicated-content). Private/stagingcontent requires accesscontrol; robots.txt alone doesnotpreventindexing.

Current release includes earlier fixed-plane diagonals, preserved notch, full-width backgrounds, true dark theme/icononlycontrol, original Summit ten-piecebranding gallery, and responsive articletables. Screenshotarchives remain retained locally and excluded fromrelease diff; original sources andcaseartwork preserved. Source review ongoing finaloverlaycheck; clean-head Docker gate and live verification pending. Prior dirty-tree validation doesnot substitute for required clean-head commitstatus.


### Three weekly editorial releases — 27 October 2026 CT

Owner requested an active three-post weekly schedule and a first WordPress/PHP security-to-Astro article, with Kirk Voice for Kirk, witty British content expertise for Wendy and a lively Miami voice for Jaymie. This latest direction governs the bylined series. Earlier polished-site release is independently verified: PR39 merged a24fb154ec7e5eaba60310715c11e18b9d2f86bc, Vercel dpl_3sTx5eFaLYTNFSqQ92ZamruDTBfv READY on both production domains;166Docker tests/85HTMLchecks passed and41livearticle bodies matched reviewed copy. That receipt does not validate new articles.

New canonical series register: docs/editorial/schedule.md, twelve dated briefs from28October through23November, author distribution Wendy6/Kirk3/Jaymie3. App heartbeat zinc-three-weekly-articles ACTIVE, Monday/Wednesday/Friday09:00 America/Chicago, beginning28October. Runs execute the authorized editorial/release workflow;09:00 is start time, not guaranteed publication time. Exact quality checks/protected merges remain mandatory. No new database scheduler or GitHubActions.

First complete draft: docs/editorial/articles/wordpress-php-security-moving-to-astro.md. Current primary PHP advisories checked27October, plus WordPress, Astro and Google migration documentation. Covers immediate hosting checks, maintenance versus migration, headless/complete replacement options and acceptance checks. Draft is not imported or live; featured image, publication-day advisory recheck, integration, fresh review, Docker and production verification remain for the28October slot. No changes to public application code in this setup task. Schedule and draft retained on codex/editorial-schedule under the external-drive worktree. Owner preview4328 remains untouched.


### Immediate first-article release — 27 October 2026 CT

Owner moved the WordPress/PHP article forward to today and corrected its audience: business owners, plain language, Kirk Voice. The public article is now integrated with distinct light studio artwork matching the existing blog family. Official PHP notices and Astro migration guidance were rechecked; the copy explicitly distinguishes Astro without PHP from retained WordPress editing that still uses PHP. Fresh scoped review found no blockers. Desktop1440/mobile390 and320 layouts, light/dark appearance, table, hero and archive feature were inspected locally on4334; no overflow. Review screenshots are in the task .scratch directory.

Docker validation is queued on the clean release head; nothing from this article is pushed or verified live yet. The original28October slot is fulfilled only once this early release is live; no duplicate post and no pulling another article forward. All later dates remain unchanged, with Wendy next30October. The existing heartbeat was updated and remains ACTIVE. Owner preview4328 is preserved.
