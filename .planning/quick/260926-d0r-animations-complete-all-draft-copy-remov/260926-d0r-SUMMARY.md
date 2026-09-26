---
phase: quick-260926-d0r
plan: 01
subsystem: frontend
tags: [astro, css, responsive, animations, draft-copy, ci]
status: complete
dependency-graph:
  requires: []
  provides: [no-rendered-draft-copy, ci-head-tilde-1-fix, hero-strike-highlighter-motion, loop-short-viewport-fix, responsive-review-9-sizes]
  affects: [homepage, all-templates, ci-workflow]
tech-stack:
  added: []
  patterns:
    - "CSS transition + transform-origin declared on the state a pseudo-element transitions INTO, not on the :not(.in) hidden-state rule"
    - "min-resolution media query to cap rendered image width to a source asset's real pixel density instead of upscaling"
    - "puppeteer-core + local Chrome for real-browser frame sampling and responsive metrics, no new dependency installed"
key-files:
  created:
    - .planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/motion.mjs
    - .planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/shoot.mjs
    - .planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/results.json
    - .planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/sheets/ (18 contact sheets)
  modified:
    - src/layouts/PreviewLayout.astro
    - src/components/SiteFooter.astro
    - src/components/MockupPage.astro
    - src/data/mockup.ts
    - src/pages/404.astro
    - src/components/home/HomeBands.astro
    - scripts/check-site.mjs
    - scripts/prepare-mockup.mjs
    - .github/workflows/ci.yml
    - src/styles/home.css
    - src/components/CircuitThread.astro
    - src/styles/base.css
decisions:
  - "Owner rule (d): every [RECEIPT: ...], [OWNER CONFIRM], [OWNER CONFIRMS EACH LINE], [LOGO FILES PENDING ...], [LOGO PENDING] marker stays rendered — removing them would present an unconfirmed number or claim as fact"
  - "Mobile header CTA moved into the nav drawer rather than kept as a second row — the same CTA already repeats one scroll later in the intro band, so the owner's 'judge it against the space it costs' call is: not worth a second row"
  - "Case-study phone screenshots (ouabc-mobile, uos-app-phone) render smaller at >=2.5dppx instead of upscaling past their measured native resolution (460px/430px wide, no higher-resolution source exists)"
actuals:
  tokens: 210000
  tasks: 3
  commits: 6
metrics:
  duration_minutes: 130
  completed: 2026-09-26
---

# Phase quick-260926-d0r Plan 01: Animations, draft-copy removal, full responsive review Summary

Removed every rendered "draft" label site-wide while keeping every receipt/confirmation marker, fixed the CI fetch so `main` scans only its own new commits, made the hero strike and highlighter actually draw on screen, fixed the Loop's scroll progress on short viewports, and reviewed every homepage band and every template at the owner's nine sizes — fixing a two-row mobile header, three under-12px text roles, one under-15px phone paragraph, and one image-density mismatch, with zero violations on the final gate.

All times in this document are America/Chicago (CT). Repo: `/Volumes/Satechi Hub/zinc-digital-web`, working tree `/Volumes/Satechi Hub/zinc-digital-web-worktrees/quick-260926-d0r`, branch `gsd/quick-260926-d0r-animations-complete-all-draft-copy-remov`.

## Task 1 — Remove rendered draft copy, fix the CI fetch, gate on no-draft-copy

**Commits:** `baefc90` (draft copy removal), `99c5b33` (CI fetch fix + check-site gate + negative test)

Every element whose only content was a draft label was deleted outright (nav "PUBLIC DESIGN DRAFT" tag, footer `[DRAFT]` status element, two draft-notice paragraphs on the article and blog-index templates, the intro band's "Supporting line under editorial review." paragraph). Where a bracketed `[DRAFT]` marker prefixed or suffixed real copy, the marker was dropped and the sentence kept. The legal pages (`/privacy/`, `/terms/`) swap the noun "draft" for "preview" — matching their own headings ("About this preview", "Purpose of this preview") — with minimal grammar edits and no new claims. The unused `mockup.ts` `draft` export and never-read `status` field were removed (confirmed by grep that nothing imported/read either).

**Retained (owner rule d — no invented numbers):** every `[RECEIPT: ...]`, `[OWNER CONFIRM]`, `[OWNER CONFIRMS EACH LINE]`, `[LOGO FILES PENDING — NAMES SET AS WORDMARKS]` and `[LOGO PENDING]` marker, plus the non-sending demo disclosures ("Demo only", "does not send", `noindex`).

**Remaining bracketed markers by route (measured against the final built `dist/`, 2026-09-26 11:05 CT):**

| Marker | Count | Routes |
|---|---|---|
| `[OWNER CONFIRM]` | 73 | every one of the 41 built pages (footer's "YouTube [OWNER CONFIRM]"), plus extra instances on `/about/`, every `/services/*` and service page, `/work/*` case pages, `/contact/`, `/privacy/`, `/terms/`, `/thanks/`, and every article |
| `[LOGO PENDING]` | 7 | `/work/` (one per client-grid entry) |
| `[LOGO FILES PENDING — NAMES SET AS WORDMARKS]` | 1 | `/` (homepage logo wall) |
| `[OWNER CONFIRMS EACH LINE]` | 1 | `/` (How we work band) |
| `[RECEIPT: confirmed engagement tenure]`, `[RECEIPT: approved outcome]`, `[RECEIPT: approved revenue outcome]`, `[RECEIPT: exact start date]`, `[RECEIPT: reporting impact]` (x2), `[RECEIPT: organic search outcome]`, `[RECEIPT: website outcome]`, `[RECEIPT: app workflow impact]` | 9 total | `/`, `/work/once-upon-a-book-club/`, `/work/us-oil-solutions/` |

**Retained non-draft status phrases** (owner rule: leave the non-draft words): "review before launch" (3 files: `/privacy/`, `/terms/`, and one more legal-adjacent copy block), "awaiting owner review" (1), "Build and review" (1, About page engagement-sequence step), "Scope to confirm" (1, case-study layer-grid), "Results / awaiting source confirmation" (2, case-study results band eyebrow).

**CI fetch fix:** the push-to-main job fetched `origin/main` at `--depth=1`, which marks the fetched commit shallow with no parent — so `check-site.mjs`'s `HEAD~1` lookup failed and the script fell back to its fail-closed path (scanning every tracked file, which trips on section signs in unrelated planning docs). Changed to `--depth=2`. Reproduced locally (09:40 CT): a depth=2 clone + the old depth=1 fetch left `git rev-parse --verify HEAD~1` failing (exit 128); the same clone + the new depth=2 fetch left it resolving (exit 0).

**New check-site.mjs gate section** ("no draft copy renders"): scans every built page's visible text, title, and `content`/`alt`/`aria-label`/`title`/`placeholder` attribute values for the word "draft", "editorial review", "under review", or a bracketed `[DRAFT...]` marker, with an exemption set built at run time from `posts.preview.json`'s own body-copy runs (never hand-listed), applied only on their own article routes. **Negative test:** a bracketed `[DRAFT]` marker temporarily injected into `SiteFooter.astro` made the gate fail non-zero, naming the footer on every page; reverting made it pass again (both recorded in the T1 worktree run).

## Task 2 — Prove every sketch animation plays frame by frame; fix what didn't

**Commit:** `9f23304`

**RED (unmodified tree, real-Chrome frame sampler, `evidence/motion.mjs`):** 9 failures — the hero strike (`.mark-strike::after`) and highlighter (`.mark-hit::before`) never left `scaleX(1)`/full-height at any sampled frame at 1440x900, 1280x720 and 390x844 (9 = 3 marks-worth x 3 sizes), and the Loop was fully stuck (dashoffset frozen, pulse frozen, layer stuck on Intelligence from first paint) at 1280x720, where `home.css` drops the sticky pin below 750px viewport height.

**Root causes and fixes:**
- The strike/highlighter's `transition` and `transform-origin: left` were declared only on the `html.anim .home-hero:not(.in)` rule. Once `.in` lands, `:not(.in)` stops matching, so the browser discards that rule's transition entirely and the mark jumps straight to its final state instead of drawing. Moved the transition/origin to the unconditional `.home-hero` mark rule (the state each mark transitions INTO, matching the approved sketch, `index.html:68-73`), keeping only the hidden transform on `:not(.in)`.
- That alone wasn't sufficient: `html.anim` was being added by the deferred module script (after first paint), which is itself a style change that raced and consumed the mark's own transition on the unwanted hide step. Moved the `.anim` class add into the synchronous `is:inline` hero-fit script (runs before first paint), so `scaleX(0)` becomes the pseudo-element's first-ever computed style — nothing to transition from, so only the later `.in`-triggered reveal actually animates.
- Loop progress math added a `loopPinned()` check; when the pin is dropped (short viewport), progress now derives from the band entering the viewport to its bottom leaving it, instead of the old pinned-only `offsetHeight - innerHeight` formula that went zero-or-negative and jumped straight to complete.

**GREEN (this commit):** 0 failures. `motion.mjs` samples every inventoried animation (hero word-rise, strike, highlighter, Loop draw/pulse/layer-scale, logo-wall flip, U.S. Oil stamps, How-we-work typing/locking, team shuffle, circuit-thread dot) at 1440x900, 1280x720 and 390x844 under normal motion, plus a `prefers-reduced-motion: reduce` finished-state pass and a JavaScript-disabled finished-state pass. **Frames read (2026-09-26):**
- `hero-early.png` / `hero-mid.png` / `hero-final.png`: the strike bar starts at zero width from the left edge of "the scope.", is partially drawn mid-frame, and is a full line through the text at rest; the highlighter block behind "the business." is likewise absent, then partial, then full-height.
- `loop-early.png` / `loop-mid.png` / `loop-final.png`: the Loop's traced path starts undrawn with the pulse dot at the Intelligence node, is partially drawn with the pulse mid-arc and the Build layer scaled up/active, and ends fully drawn with the pulse back at Intelligence and that layer active — "Loop complete · Intelligence feeds Build".

## Task 3 — Full responsive review across the owner's 9 sizes, fixes, gate, evidence

**Commits:** `5e35252` (fixes), `3352f93` (evidence script, sheets, results)

**Method:** copied and substantially extended the `260926-6g7` `evidence/shoot.mjs` pattern into a new script covering all 16 owner-named routes (`/`, `/services/`, `/services/shopify/`, `/work/`, `/work/once-upon-a-book-club/`, `/work/us-oil-solutions/`, `/about/`, `/contact/`, `/thanks/`, `/blog/`, 3 articles including the longest title (`ai-search-results-and-generative-search-optimization`, 82 chars) and the shortest (`when-web-design-trends-actually-matter`, 38 chars), `/privacy/`, `/terms/`, `/404.html`) at all 9 sizes (1920x1080, 1780x920, 1440x900, 1280x720, 1024x768 @1x; 768x1024 @2x; 390x844 @3x; 375x667, 667x375 @2x), motion allowed and settled (scrolled through, typed lines/stamps/team-shuffle/kinetic-words all waited for) before every screenshot and metric, plus a `prefers-reduced-motion: reduce` pass on `/` at 1440x900, 390x844 and 667x375. 144 route/size combinations + 3 reduced-motion passes, `evidence/results.json`.

Checked per page/size: horizontal overflow; elements extending past the left/right viewport edge (thread/dot excluded); clipped text (real `overflow:hidden`/`clip` boundaries only — the initial-value `text-overflow: clip` false-positive from an earlier draft of the script was corrected before the final run); sibling overlap inside `.band__inner` and every grid/flex container (absolutely/fixed-positioned children, which are intentionally out of flow, excluded); tap targets under 44x44 on `a, button, summary, input, select, label` outside running prose; text under the owner's 12px floor and, on phone sizes, paragraph/list copy under 15px (excluding the design system's own label/caption roles — `.t-label`, `.label`, `.draft-tag`, `.draft`, `.draft-notice`, `.receipt` — which are an intentional micro-caption style used identically at every breakpoint, not "paragraph or list copy"); content-image density against each source asset's real resolution; the circuit-thread dot's position and halo clearance at three scroll positions (top/middle/bottom); the hero's one-screen/headline-alone contract; the Loop's side-by-side layout at >=1024px; and blog/article `h1` height against one third of the viewport.

**18 contact sheets** (one per size for the 10 homepage bands — hero through footer — and one per size for the 16 templates) were generated with `sharp`, and every sheet was read with the Read tool. Visual notes: at 1440x900 every band composes cleanly (hero fills the screen with both marks drawn, intro's meta row/actions/contents render as designed, the logo wall's 4-column grid is even, the Loop shows the SVG and layer list side by side with Build active/teal, the case bands' figures and screenshots have no overlap, the team row shows all 7 photos evenly, articles and footer are clean). At 390x844/375x667 the intro band's Contents rows keep full 44px tap height, the logo wall reflows to 2 columns with no overlap, team reflows to 2 columns with consistent 4:5 crops (same aspect ratio at every breakpoint, so framing is identical, only physically smaller — no responsive framing bug). At every template size the masthead, thread, and page-title sizing (blog/article capped at ~1/3 screen height) held with no clipping or overflow.

### Fixes applied (file:line, base.css unless noted)

1. **Mobile header cost two rows at 375-390px width** (`src/layouts/PreviewLayout.astro`, header markup; `src/styles/base.css` `@media(max-width:899px)` block). Owner, 2026-09-26: "the header on phones ... takes two rows ... judge it against the space it costs." Measured cause: the standalone "Start an inquiry" button sits outside `#site-nav` and, combined with the logo + Menu toggle at 375-390px width, doesn't fit on one row (gap 24px x2 + wordmark ~97px + Menu button ~75px + the CTA's own width `>200px` exceeds the ~343px available). Fix: added the same CTA as the last item inside `#site-nav` (`class="btn solid nav-cta"`), hid the standalone header CTA below 900px, and made `.nav-cta` a full-width row inside the opened nav drawer. Judgment call: the same CTA already repeats one scroll later in the intro band's `.actions` block, so a permanent second header row wasn't worth its cost — moving it into the menu keeps the collapsed header to logo + Menu, one row, with the CTA still reachable and, additionally, no longer hidden from no-JS visitors (it renders inside the always-visible `<nav>` regardless of script).
2. **Orphaned `.nav-draft` CSS** (`base.css`, was lines 196-198, 284, 431). The element T1 deleted (`PreviewLayout.astro`'s nav draft-tag span) left these rules matching nothing (confirmed: zero matches for `class="nav-draft` in built `dist/`). Removed.
3. **`.draft`/`.draft-tag` under the 12px floor** (`base.css` ~185-190, plus its `.commitments`/`.footer-grid` overrides). Measured 11.52px (0.72rem base), 11px (`.commitments .draft-tag`), 10px (`.footer-grid .draft-tag`) — all under the owner's 12px minimum. Bumped to 0.75rem/12px/12px respectively. No other property changed.
4. **`.article-card .t-label` under the 12px floor** (`base.css`, blog-index date/layer meta). Measured 11px. Bumped to 12px.
5. **`.device-frame figcaption` under the 12px floor** (`base.css`, case-study screenshot captions — "ouabc site / original capture" etc.). Measured 10px. Bumped to 12px.
6. **`.article-sidebar` paragraph copy under the phone 15px floor** (`base.css`). The sidebar's "Originally published {date}." sentence (real prose, not a caption) inherited the sidebar's 14px container font-size. Bumped the container to 15px; the sidebar's own `.draft-tag` line keeps its explicit, correctly-excluded caption size.
7. **Image density: `ouabc-mobile.webp` / `uos-app-phone.webp` under-density at 390x844** (`base.css`, new rule at file end). Measured directly against the original source files in the project's asset zip: 460px and 430px wide natively — no higher-resolution asset exists. At the 390x844 size (3x device pixel ratio) the phone-frame's ~189px rendered width asked for 539px of source detail. Added `@media (min-resolution: 2.5dppx) { .screens-grid .phone-frame { flex-basis: 145px; } }` so the mockup renders smaller instead of upscaling past its real source density on very-high-density phones only (2x sizes were already within budget and are untouched).

**Files reviewed with no fix needed:** `TeamBand.astro` and `CircuitThread.astro` were in scope for this task but produced zero violations at any of the 9 sizes across every route that renders them (`/`, `/about/`) — the 7/2-column team grid and the thread/dot both held cleanly; no edit was made to either file.

### Section breakdown follow-ups

None of the combined-content sections below caused a measured failure at any of the 9 sizes — each is flagged here per plan step 5 as a candidate for a future, separately-scoped split, not something this task changed:

- `MockupPage.astro:93-116` (intro band, home template only) — the meta row, actions and Contents list already sit in one band by explicit owner-approved carve-out (`home.css:173-183` comment); no action needed, listed for completeness.
- `MockupPage.astro:57-59` (article template) — the source sidebar (author/date/attribution) and the article body share one `.band`; both render cleanly at every size, but they're editorially distinct (metadata vs. prose).
- `MockupPage.astro:44-49` (case-study template) — the results/receipts band, the connected-work layer grid, and the screenshots-plus-testimonial-notice band are three separate `<section>`s already (not combined); no split candidate here after re-reading the markup.
- `MockupPage.astro:61-79` (privacy/terms template) — the legal aside (non-approval disclaimer) and the full policy body share one band; both are short and render cleanly at every size.
- `MockupPage.astro:81-90` (contact template) — the aside (eyebrow, demo notice, text-us link) and the multi-step form share one `.contact-layout` band; stacks cleanly under 899px, no failure measured.

### Gate (exact tree pushed, each command's own exit code)

| Command | Exit |
|---|---|
| `npm run check` | 0 |
| `npm run build` | 0 |
| `node scripts/check-site.mjs` | 0 (41 files scanned, 6 exempt draft-copy runs matched, JS budget 4937/15360 gzip bytes on the largest page) |
| `npm run verify` | 0 (41 routes, 820 links, 17 images, 4 browser checks, 4 axe runs, 0 failures) |
| `node evidence/motion.mjs` | 0 (all animations pass through intermediate frames and finish correctly) |
| `node evidence/shoot.mjs` | 0 (144 route/size combinations + 3 reduced-motion passes, zero violations) |

## Self-Check

- FOUND: `src/layouts/PreviewLayout.astro` (mobile header fix)
- FOUND: `src/styles/base.css` (all responsive fixes)
- FOUND: `.planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/shoot.mjs`
- FOUND: `.planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/results.json`
- FOUND: 18 files under `.planning/quick/260926-d0r-animations-complete-all-draft-copy-remov/evidence/sheets/`
- FOUND commit `baefc90`, `99c5b33`, `9f23304`, `3fd5cfa`, `5e35252`, `3352f93` in `git log --oneline`

## Self-Check: PASSED
