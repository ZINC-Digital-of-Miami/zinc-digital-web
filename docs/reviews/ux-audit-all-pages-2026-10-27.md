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

1. Complete the queued final Docker validation before any push.
2. Supply the approved Privacy and Terms body text; these remain existing unfinished pages.
3. Optionally apply the same fixed-plane motion to selected existing service/about diagonals after the homepage treatment is accepted. Do not animate every section for uniformity.
