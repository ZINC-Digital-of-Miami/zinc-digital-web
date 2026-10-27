# ZINC public-site review — 27 October 2026 CT

## Scope and evidence

Reviewed all 85 public routes: 83 sitemap pages plus Thanks and 404. Private admin pages and API workflows were excluded. Browser checks covered 1440px desktop, 320px layout, and 390px normal-motion scrolling; light and dark themes were allowed to settle before contrast checks. This is a bounded automated accessibility check plus visual inspection, not a full WCAG certification. The route inventory and results are in [audit.json](all-page-2026-10-27/audit.json). Full mobile captures and five visual contact sheets are retained beside this report. The sheets were visually inspected; full-page captures were collected for every route, with detailed visual checks on the changed homepage and representative components.

Initial theme-transition contrast flags were discarded after settled-theme reruns. A rapid-scroll pass skipped a Web Design FAQ entrance; direct scrolling to it confirmed opacity 1 and correct reveal. No false-positive color fixes were applied.

## Findings and local fixes

| Finding | Evidence | Status |
|---|---|---|
| Homepage case-slider text was left at 35% opacity by an obsolete entrance selector | Code, browser computed opacity, owner screenshots | Fixed: every card remains fully opaque, including before script initialization |
| Work engagement category labels inherited dark-theme gray on permanently white cards | Settled browser axe check: 2.4:1 | Fixed using the existing dark label color on these white cards; both themes rechecked |
| LVS comparison controls inherited dark backgrounds within a fixed light case study | Settled browser axe check: approximately 1.1:1 | Fixed local background/panel tokens and light-surface focus accent; both themes rechecked |
| Homepage gallery had visually empty previous/next buttons after arrow removal | Rendered screenshot | Fixed with Previous/Next text; Next moves the track at 320px without overflow |
| Generic social cards still used the rejected condensed font and outdated “Four cases” copy | Visual inspection of social-card contact sheet | Replaced six generic cards with current Manrope typography and accurate copy; added named cards for Ballad, Meade and General Shale |
| Case social previews did not identify the project visually | Metadata and source inspection | Existing approved project artwork now supplies 14 case previews; three SEO cases use named scope cards. CreativeWork image matches OG/Twitter |
| Contained social montages have different dimensions than cropped 1200×630 images | Browser decoded dimensions | OG dimensions now follow actual contained dimensions; montages are not cropped to force a ratio |
| Privacy and Terms have no approved body text | Rendered pages and src/data/legal.ts | Unresolved existing content requirement. Source explicitly reserves these sections for owner-supplied reviewed wording. No legal copy invented |

## Motion direction

The owner's final correction is **static diagonals with the page scrolling into them**. This supersedes the earlier small drift and proposed slide-in. The homepage stripe retains its original polygon and 100px/120px overlap. Counter-scrolling holds the decorative plane at a constant viewport position while the section reveals it; the text stays in normal document flow. Measured diagonal top stays at -100px across desktop and mobile scroll samples. Reduced motion restores the static document decoration. The small service-rule and link feedback remains secondary.

The all-page opportunity review follows the existing templates:

| Pages | Recommended motion treatment |
|---|---|
| Homepage | Fixed diagonal plane and scrolling section reveal; fully readable case cards; explicit gallery controls. Implemented locally |
| Services index and 11 service pages | Keep the existing diagram/section reveals and deliberate focus feedback. Fixed diagonal treatment is a possible follow-up for existing angled surfaces; no new decorative graphics needed |
| Work index and three lane pages | Preserve artwork proportions and existing lane entrances. Use link/focus feedback instead of tilting devices |
| All 17 case studies | Keep artwork stable, retain meaningful comparison controls and gallery transitions; avoid hiding copy or adding continuous movement |
| Insights index and 41 articles | Keep reading content still, retain reading progress and existing reveals; no per-paragraph parallax |
| About and three author pages | Quiet existing section entrances; keep faces and biographies stable |
| Contact | Focus, step and validation feedback only; no motion on fields while typing |
| Privacy, Terms, Thanks and 404 | Stable readable content and clear navigation; no extra animation necessary |

These recommendations are opportunities, not newly imposed requirements. No animation dependency was added. The owner’s accepted diagonal angle is preserved.

## SEO, featured images, schema and AI search

All 85 rendered pages have one H1, unique titles and descriptions, canonical URLs, social metadata and parseable structured data. Final metadata sweep found no missing in-page anchor targets and no OG/Twitter/schema-image disagreement. All 63 social images in the first revised inventory decoded successfully; contained montage dimensions were then corrected. The final build and image inventory must be used for release evidence, rather than development /_image URLs.

Server-rendered page content, service FAQs, author profiles, internal links, robots.txt, sitemap.xml and llms.txt are already implemented. Page graphs connect Organization, WebSite, breadcrumbs and page entities; services have Service/FAQPage, articles have Article/authorship, cases have CreativeWork, and Work has ItemList. No fabricated ratings, results, awards or review schema were added. FAQ markup is not a promise of rich results.

AI-search work should improve useful, attributable content and crawlability. Google states that AI search features have no special technical optimization requirement beyond normal search eligibility: [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features). llms.txt remains a navigation aid, not evidence of inclusion or rankings. Search Console indexing, third-party social scrapers and actual AI citations were not verified in this review.

## Production and release boundary

The previously merged PR #32 is live: all 17 public case URLs return 200 with the shared hero/footer; Work renders 17 client cards and engagement links; the sampled HTML contains no OUABC references. New contrast, motion, social-image and schema changes remain local. No push has been made for this task. Docker validation and final review status are recorded in .planning/STATE.md.

## Remaining priorities

1. Docker validation for eea1d7c passed at 02:19 CT (before the later theme/layout corrections): 163 tests, zero Astro errors/warnings, production build and all 85 HTML checks. Built output confirms correct declared dimensions for all 65 social images across 85 pages. No push has been made.
2. Supply the approved Privacy and Terms body text; these remain existing unfinished pages.
3. Optionally apply the same fixed-plane motion to selected existing service/about diagonals after the homepage treatment is accepted. Do not animate every section for uniformity.


## Reopened visual review after owner corrections

The initial automated checks and top-of-page contact sheets did not establish lower-page design quality. Owner found the missing CTA background, missing notch, inconsistent dark appearance and constrained widths. Those defects are now addressed locally, including nested Felon gallery colors. All85 routes were rechecked for settled light/dark contrast and320px overflow; three affected case templates were corrected and passed targeted reruns. Viewport captures confirm the CTA, notch, mobile gallery and Web Design FAQ; Bear Claw's three apparently blank panels decode and render correctly when visited. Hidden tablet/mobile layouts must be opened before judging their lazy images.

Full visual acceptance remains open. No push. The new source edits require a fresh Docker gate, currently blocked by the shared BI build queue. The prior build is not release evidence for the new edits. Preserve the owner preview and continue the remaining rendered review before release.


### Fresh Docker validation — 27 October 2026 CT

At02:55:55CT ran scripts/verify-docker.sh on HEAD eea1d7cad75f5498601bf2d08cda69d2187c27d9 plus the retained working patch .scratch/docker-theme-validation.patch (SHA256 ff64f09b8b6e64dcb215067e32d4bc49d7fd081b577a3a6a989d272f5a14727f). Container872f7e02827a completed the163tests, Astro check (0errors,0warnings,10hints), and production build at02:56:36CT. Initial overall exit1 came only from the outdated HTML assertion requiring visible “Dark mode” text on85pages. The owner explicitly requested removing that text and retaining only the icon.

Updated scripts/check-site.mjs to require a button, nonempty accessible name, decorative icon and no visible text label; prior browser proof verifies toggle function, changing accessible label/pressed state and theme. No application source changed after this build. Script SHA256 da2e184c09720992cfe9add71b4a5fb2dd84147482babf2f7cd0471517b1250c. With coordinator approval, the single brief Docker rerun (container name zinc-theme-html-check) checked unchanged built output at02:57:22–02:57:23CT, exit0: all85HTMLchecks passed. Container removal verified; slot explicitly released. Logs .scratch/docker-theme-validation.log and .scratch/docker-theme-html-check.log. No push or deployment. Remaining visual polish review still open; build success does not close it.


## Final rendered review findings — current pass

- VIS-01 / High / Observed(rendered+source): Business Intelligence retains four pale content bands in dark appearance. Readers see an inconsistent theme. Fix local light-band tokens without reversing existing dark panels. EffortS.
- VIS-02 / Medium / Observed(rendered): Work lane desktop feature headings break Solutions and Development midword. Widen the copy proportion and lower its maximum heading size; preserve readable mobile wrapping. EffortS.
- CONTENT-01 / Medium / Observed(rendered): Research Consensus, AI Research Workflow and AI Competitor Research show unrelated Search Console/brief/shopping inline illustrations. Remove unrelated inline filler or use source-relevant artwork. EffortS.
- Summit owner scope: current case underrepresents original logo/branding/design work. Retained original identity marks, brand book, website graphics and campaign artwork found in organized project archive; add a contextual branded-work section, preserving case hero/layout. EffortM.
- Capture artifact, not a site defect: pale trailing strips disappear in actual viewport screenshot; footer bottom matches document height within1px. Do not patch footer CSS for that artifact.

- VIS-03 / Medium / Observed(rendered): homepage closing stacks three invitation sections; Contact repeats a link back to its own inquiry form. Omit the shared generic closing on those two pages, retaining the custom homepage inquiry section and the actual contact form. EffortS.
- VIS-04 / Medium / Observed(rendered+source): margin above homepage CTA reveals a pale seam in light appearance between charcoal sections. Remove only that adjacent margin; retain diagonal pseudo-element. EffortS.


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
