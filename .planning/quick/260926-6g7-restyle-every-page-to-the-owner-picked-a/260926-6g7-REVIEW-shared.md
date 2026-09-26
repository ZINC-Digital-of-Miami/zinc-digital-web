# Quick 260926-6g7 — PR #4 review, sub-task "shared"

Scope: `src/layouts/PreviewLayout.astro`, `src/styles/base.css`, `src/styles/tokens.css`, `src/styles/themes.css`, `src/components/MockupPage.astro`, `src/components/SiteFooter.astro`, `src/components/TeamBand.astro`, `src/components/CircuitThread.astro`, `src/pages/*`. PR #4 head at start of this sub-task: `876e3b7`.

All times CT (America/Chicago). Verification run 2026-09-26 ~06:45–06:52 CT.

## Gate (exact tree, own exit codes)

| Command | Exit | Log |
|---|---|---|
| `npm run check` | 0 | scratchpad/shared-check.log — 0 errors, 0 warnings, 0 hints (15 files) |
| `npm run build` | 0 | scratchpad/shared-build.log — 41 pages built |
| `node scripts/check-site.mjs` | 0 | scratchpad/shared-site.log — all checks passed across 41 HTML files; U+00A7 byte scan 20 files scanned, 0 hits; JS budget largest page 3300/15360 gzip bytes |

## Real-browser verification method

Real Chrome (`/Applications/Google Chrome.app`) via `puppeteer-core` (already present in `node_modules`), driving `dist/` served locally on `127.0.0.1:4711`/`4712`/`4713` (python3 http.server, started and stopped by the scripts). Scripts: `scratchpad/shared-verify.mjs` (full sweep) and `scratchpad/shared-shoot.mjs` / `shared-shoot2.mjs` (targeted screenshots).

Pages checked: `/`, `/services/`, `/services/shopify/`, `/work/`, `/work/once-upon-a-book-club/`, `/about/`, `/contact/`, `/blog/`, `/blog/ai-search-results-and-generative-search-optimization/`, `/privacy/`, `/terms/`, `/404.html`.
Widths: 1440x900, 375x812, 375x667. Both `prefers-reduced-motion: reduce` and `no-preference` emulated for every page/width (`page.emulateMediaFeatures`).

Per page/width/motion-mode, measured: `document.documentElement.scrollWidth` vs `clientWidth` (horizontal scroll), heading level sequence (skip = level jumps by >1), every `.draft`/`.draft-tag` marker's bounding rect vs its container and the viewport plus computed `white-space`, contrast ratio (WCAG relative-luminance formula, own implementation) of every visible text node against its nearest ancestor with a non-transparent background, and — at 375px widths only — a simulated keyboard interaction on the header (`.menu-toggle`): focus it, click to open, walk the native forward-tab-order focusable list to find the element immediately after the toggle, dispatch `Escape`, and confirm `aria-expanded` and focus return.

Full machine-readable results: `scratchpad/shared-verify-results.json` (216 page/width/motion-mode cells).

## Lead dispositions

### 1. Mobile menu keyboard order — `src/layouts/PreviewLayout.astro:38` — CONFIRMED, fixed

**Mechanism (before fix):** the header markup was `<nav id="site-nav">…4 links…</nav><button class="menu-toggle">…</button><a class="btn">Start an inquiry</a>`. Below 900px, `nav` is `display:none` until `.is-open` is toggled, so while closed it takes no tab stop. But it precedes `.menu-toggle` in DOM order. Once opened, the browser's native forward-tab order still follows DOM order (`nav` links, then toggle, then inquiry link) — so pressing Tab **from the toggle** (the element the user actually has focus on after activating it) skips straight to "Start an inquiry", never landing on the four just-revealed nav links. Reaching them required reverse-tabbing.

**Fix:** reordered the markup so `<button class="menu-toggle">` renders before `<nav id="site-nav">`. `nav`'s `margin-left:auto` still positions it identically on ≥900px (the toggle stays `display:none` there and takes no layout space, so nothing shifts); below 900px `nav`'s `width:100%` still forces its own row. Escape-closes-and-returns-focus and `aria-expanded` sync were already correct and untouched.

**Evidence (measured after fix, all 12 non-home + home pages × 375×812 × 375×667 × 2 motion modes = 48 cells in `shared-verify-results.json`, `tabOrder` key):** every cell reports `nextFocusableAfterToggleTag: "A"`, `nextFocusableAfterToggleText: "Work"`, `nextIsNavLink: true`, `expandedAfterEscape: "false"`, `focusReturnedToToggle: true`. Screenshot `scratchpad/shared-contact-menu-open.png` (375×812, menu open) shows the toggle top-right, the four nav links dropped into their own full-width row directly below, and "Start an inquiry" below that — DOM order now matches visual order.

### 2. Draft-marker `white-space: nowrap` clipping — `src/styles/base.css:191` (pre-fix line) — CONFIRMED, fixed

**Mechanism:** the shared `.draft, .draft-tag { … white-space: nowrap; }` rule forced every marker onto one line. `.frame` sets `overflow-x: clip`, so a marker wider than its container is cut off rather than causing page scroll. The article sidebar's `<p class="draft-tag">Legacy search terminology expanded for this preview. Full editorial review remains pending.</p>` is far wider than the 375px frame (and wider than the 240px desktop sidebar column) — confirmed by reading `src/components/MockupPage.astro:59` (article-sidebar block) and `src/styles/base.css:410` (`.article-layout { grid-template-columns: 240px … }`).

**Fix:** removed `white-space: nowrap` from the shared `.draft,.draft-tag` rule; added a new `.nav-draft { white-space: nowrap; }` rule scoped only to the short masthead badge ("PUBLIC DESIGN DRAFT"), which is hidden below 1100px anyway (`.nav-draft{display:none}` in the existing `max-width:1100px` media query) so it never competes for space at narrow widths.

**Evidence:** `shared-verify-results.json` `markerOverflow` is empty (`[]`) for every page/width/motion-mode cell — zero markers overflow their container or the viewport, at both 1440×900 and 375×(812|667). Targeted check on the long article-sidebar marker specifically: at 1440×900, `rectWidth: 240, parentRight: 297.59, overflowsParent: false`; at 375×812/667, `rectWidth: 327, parentRight: 351, overflowsParent: false`; `whiteSpace: "normal"` confirms the marker now wraps. Screenshot `scratchpad/shared-sidebar-375-clip.png` shows the marker wrapped cleanly across two lines with no clipping.

### 3. Teal-text contrast (`#07B2B2` ≈ 2.42:1 vs `#057E7E` ≈ 4.52:1) — REFUTED for this sub-task's files; CONFIRMED but out of scope (owned by the `home` worktree)

**Method:** measured actual rendered contrast (own luminance/ratio implementation, WCAG formula) of every visible text node against its resolved background, across all 12 pages × 3 widths × 2 motion modes.

**Finding:** `base.css`, `tokens.css`, `themes.css`, `SiteFooter.astro`, `TeamBand.astro`, `CircuitThread.astro`, and `MockupPage.astro` already route every *text* color through `--accent-text` (`#057E7E`, ≈4.52:1) — confirmed by grep: every `color:` declaration touching the accent in these files resolves to `var(--accent-text)` (base.css lines 44, 190, 301, 313, 315, 385, 399, 403, 405, 417–419; themes.css line 14). Where `var(--accent)` (`#07B2B2`) is used, it is always either (a) a non-text decoration — `.mark-strike::after`, `.mark-bar::after`, the SVG `.circuit-trace` stroke, all empty-content pseudo-elements or graphics, not text — or (b) a **background** with `--fg` (ink `#0A0A0B`) text on top (`.btn.solid:hover`, `.redact`), which I measured at **≈7.57:1**, well above the 4.5:1 normal-text threshold (own calculation: ink-on-teal luminance ratio, not teal-on-snow).

The actual violations the review comment describes (`--accent` used directly as *text* color on the snow ground, e.g. Loop layer titles and "Next build" stamps) live in `src/styles/home.css` and `src/components/home/HomeBands.astro` — files explicitly owned by the parallel `home` worktree, not in this sub-task's file list. My own sweep independently reproduced them: `CONTRAST-FAIL` entries in `shared-verify-results.json` appear **only** under the `home` page slug (e.g. `{"text":"Build","tag":"H3","cls":"display home-layer-title","ratio":2.42,"min":3}`, `{"text":"Next build",...,"ratio":2.42,"min":3}`), and **zero** contrast violations appear on any of the 11 non-home templates I own, at any width or motion mode.

**Disposition:** REFUTED for `base.css`/`tokens.css`/`themes.css`/the shared components in this sub-task's scope — already compliant, no fix made. CONFIRMED as a real defect, but in `home.css`/`HomeBands.astro`, which belong to the sibling `home` worktree; flagging here for the orchestrator to confirm the home agent addresses it (do not fix — out of my file allowlist).

### 4. Heading order on every non-home template — REFUTED for this sub-task's files; the homepage (out of scope) has a real skip

**Method:** walked every `h1`–`h6` in DOM order per page and flagged any level increase greater than 1.

**Finding:** read every heading render site in `MockupPage.astro` (grep confirmed the full set: lines 18 `h1`, 29–92 `h2`/`h3` pairs) and `SiteFooter.astro` (13 `h2`, 20/22 `h3`). Every non-home template follows `h1` (page-intro) → `h2` (first content section) → occasional `h3` nested one level down (mini-loop layers, commitments, related-services, footer facts) — never a level jump of more than 1. The footer (rendered after every page's own content) always opens at `h2`, which is a decrease-or-level from any preceding heading and therefore never itself a violation, regardless of what precedes it.

`shared-verify-results.json`: `headingOrder.violations` is empty for all 11 non-home templates × 3 widths × 2 motion modes (66 cells). The only `HEADING-SKIP` entries recorded are on the `home` slug: `{"from":1,"to":3,"text":"Build"}` — an `h1`→`h3` jump, matching the PR's own review comment on `HomeBands.astro:89` ("no intervening h2" before the Loop's `h3` layer titles).

**Disposition:** REFUTED for my scoped templates (already correct — the Task 2 rewrite evidently got this right). CONFIRMED as a real defect on the homepage, but `HomeBands.astro` is owned by the sibling `home` worktree — not fixed here.

### 5. Keyboard order and visible focus on every non-home template, including the mobile menu and footer — CONFIRMED (mobile menu, same root cause as #1) and now fixed; visible focus already correct, REFUTED as a separate defect

**Mobile menu:** identical root cause and fix as Lead 1 (`PreviewLayout.astro` is the single shared layout rendered on every non-home page). Verified independently per-template in `shared-verify-results.json`: all 11 non-home templates × 375×812 × 375×667 × 2 motion modes show `nextIsNavLink: true` after the fix.

**Visible focus:** `base.css` already applies `:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }` globally, plus an explicit list (`a, button, summary, input, select, textarea`) with the same rule (lines 125–138) — present on every template since they all share `base.css`. No separate defect found; no fix needed beyond the DOM-order fix above (a correct outline on an unreachable element is moot until the element is reachable, which #1's fix restores).

**Footer:** `SiteFooter.astro` links are plain `<a>`/native form elements in natural DOM order with no `tabindex` manipulation — confirmed by reading the file; no anomalies.

## Files changed

- `src/layouts/PreviewLayout.astro` — reordered `.menu-toggle` before `#site-nav` (Lead 1 / 5).
- `src/styles/base.css` — removed `white-space: nowrap` from the shared `.draft,.draft-tag` rule; added a `.nav-draft`-scoped nowrap rule (Lead 2).

No other files in this sub-task's scope required changes (Leads 3 and 4 confirmed compliant already; the real defects they describe live in `home.css`/`HomeBands.astro`, owned by the sibling `home` worktree).

## Screenshots

`scratchpad/shared-contact-menu-open.png` (375×812, header with menu opened via toggle — confirms visual + DOM tab order), `scratchpad/shared-sidebar-375-clip.png` and `shared-sidebar-1440-clip.png` (article sidebar marker, wrap confirmed), `scratchpad/shared-masthead-closed-375.png` (masthead, menu closed, about page) — all match the all-white sketch 001 variant 3 language (snow ground, ink type, mono labels, teal-text draft tag, 3px ink rules). No visual regression from the fixes; the toggle reorder additionally corrects a pre-existing mobile layout quirk (the toggle previously rendered below the hidden nav's slot, next to the inquiry button, instead of at the top of the header).
