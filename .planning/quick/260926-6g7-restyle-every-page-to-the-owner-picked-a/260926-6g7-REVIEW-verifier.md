# Verifier review — quick task 260926-6g7, "make verify-mockup.mjs a real gate"

2026-09-26 CT. Worktree: `zinc-digital-web-worktrees/quick-260926-6g7`, branch `gsd/quick-260926-6g7-restyle-every-page-to-the-owner-picked-a`, head before this sub-task `ff260fb`.

Baseline command (matched driver), confirming the 11 reported failures exactly:

```
CHROMEDRIVER_PATH=".../chromedriver-mac-arm64/chromedriver" node scripts/verify-mockup.mjs --mode quick
```

`EXIT=1`, 11 failures, matching the brief verbatim (log: `g-verify-baseline.log`).

Each finding below carries: file:line, mechanism, evidence, and a CONFIRMED/REFUTED-style verdict expressed as **REAL** (site defect, fixed in `src/`) or **STALE** (verifier's own expectation was wrong, fixed in `scripts/verify-mockup.mjs`). Every changed check was proven, with a temporary injected break plus a captured failing `EXIT`, to still catch the real defect it exists for — logs referenced below.

## 1–2. `/thanks/ meaningful page body`, `/not-a-real-page/ meaningful page body`

**Disposition: STALE.** `scripts/verify-mockup.mjs:189` (now line 195) read `check(!!data.h1&&data.main.length>300,...)` — a single 300-character floor applied to every template, including two that are one-paragraph-by-design (confirmation and error pages).

**Measured** (not the "≈2,000 characters" figure in the brief, which did not match the built output — the <main> text alone, after stripping `<script>`/`<style>` exactly as the check's own DOMParser pass does): `dist/thanks/index.html` main = 228 chars, `dist/404.html` main = 191 chars. Both real, meaningful, but under 300; both templates carry a real `<h1>` ("Demo confirmation" / "Page not found") plus an explanatory paragraph and working navigation links — not stubs.

**Fix:** `scripts/verify-mockup.mjs:36-37` — `SHORT_BODY_TEMPLATES = new Set(['thanks','404'])`, `MIN_BODY_CHARS(template)` returns 100 for those two, 300 for everything else. 100 sits below both templates' real measured length (191/228) but well above an actually-empty stub.

**Proof it still catches the real defect:** replaced `dist/thanks/index.html`'s `<main>` with a 2-character stub (`<h1>Hi</h1>`), reran — failed with `"/thanks/ meaningful page body (2 chars, needs >100)"` (log: `g-verify-break1.log`). Reverted via `npm run build`.

## 3–6. `image2x/ratio` on `/`, `/services/shopify/`, `/contact/`, `/blog/`

**Two different images, two different dispositions, in the same check.**

**3a. Wordmark squish — REAL bug.** `src/styles/base.css` — global `img { max-width:100%; height:auto; display:block; }` (line 272) plus `.wordmark img { height:26px; width:auto; }` (line 283) plus, at ≤600px, the old `.site-header .wordmark { width:96px; }`. Mechanism: at ≤600px the wordmark link's flex-item `width:96px` clamps the `<img>`'s own `max-width:100%` down to 96px, but the img's `height` stays fixed at 26px (explicit, not `auto`) — CSS cannot honor both a fixed height and a narrower-than-intrinsic width without distorting the image, since only one axis (`width`) is `auto`. Measured: rendered 96×26 vs natural 892×221 (ratio 3.69 vs 4.04, mismatch 0.344 — the check's own numbers, not a guess). This is present on every non-home template at 375px, i.e. every route sampled except `/` (whose hero renders the wordmark at masthead height only, not the mobile-narrowed one — actually present there too structurally, but `/`'s own failure list only showed it once, deduplicated by src).

**Fix:** `src/styles/base.css` — replaced `.site-header .wordmark {width:96px;}` with `.site-header .wordmark img {height:24px;}` (more specific selector, height-only, ratio-preserving: 24×4.036 ≈ 96.9px, essentially the same visual footprint, computed correctly instead of clamped).

**3b. Cropped photos/screenshots (`ouabc-site`, `ouabc-mobile`, `kirk-musick`, `priya-nahar`, `dr-basset`) — STALE check.** All five use `object-fit: cover` (`src/styles/home.css:521,532`, `src/components/TeamBand.astro:88`, `src/styles/base.css:355`) per the approved sketch's 16/10 (desktop screenshot), 9/19 (phone screenshot) and 4/5 (team photo) crops — intentional design, not distortion. The check's aspect-ratio-mismatch test (`ratio>.02`) doesn't know about `object-fit` and flagged all five as "blurred/distorted" even though each is well above 2x pixel density for its crop (measured: `ouabc-site` min-axis density 3.2x, `ouabc-mobile` 4.9x, `kirk-musick` 3.24x, `priya-nahar`/`dr-basset` 11x — all comfortably ≥2x).

**Fix:** `scripts/verify-mockup.mjs:117` — image observation now also captures `objectFit:getComputedStyle(img).objectFit`. `scripts/verify-mockup.mjs:120` — the `blurredImages` filter now only applies the aspect-ratio-mismatch test when `objectFit!=='cover'`; the two density tests (`naturalWidth+1<width*2`, `naturalHeight+1<height*2`) are unchanged and still apply to every image, cover or not (a cropped image can still be genuinely under-dense).

**Proof it still catches the real defect (non-cover distortion):** injected an inline `style="width:40px;height:26px"` onto the wordmark `<img>` in `dist/contact/index.html` (an `object-fit` `fill`/default image, not cover) — reran, failed with `"/contact/ image2x/ratio [...{"objectFit":"fill","ratio":2.497...,"width":40}...]"` (log: `g-verify-break1.log`). Reverted via `npm run build`.

**Proof the cover-crop images genuinely pass on their own merits, not because the check went blind:** the same run's `blurredImages` output for `/contact/` (unbroken) is empty; a synthetic density-fixture check (min-axis density < 2 while `objectFit==='cover'`) was reasoned through algebraically above rather than re-injected, since injecting a real under-dense cover image would require swapping a source asset — the density arithmetic (`min(naturalWidth/width, naturalHeight/height)`) is unchanged code, already proven correct by the pre-existing `--self-test` fixtures' density math pattern and by five real passing measurements above 3x.

## 7. `/ content starts at top`

**Disposition: STALE.** `scripts/verify-mockup.mjs:209` (old) read `check(obs.h1Top<250,...)`. The approved sketch stacks a masthead, a meta/label row and a 3px rule above every hero `<h1>` (owner, 2026-09-26 CT) — legitimate vertical space the 250px floor didn't budget for on templates whose meta row wraps to more lines at 375px width.

**Measured** (debug instrumentation, log `g-verify-debug1.log`): `h1Top` = 318.78px on `/` (four meta lines wrap at 375px: "ZINC DIGITAL", "OPERATING REPORT", "MIAMI HQ · WORKING NATIONWIDE", "BUILD · DEMAND · INTELLIGENCE"), vs 207.59px on `/services/shopify/`, `/contact/`, `/blog/` (one meta line). All four routes' **first `.band`** — the actual start of real page content, independent of how many meta lines its own h1 wraps to — begins at an identical `129px`, i.e. exactly the masthead's height.

**Fix:** `scripts/verify-mockup.mjs:225` — replaced the h1-offset check with `check(!!obs.bands[0]&&obs.bands[0].rect.top<150,...)`, measuring where the first real content band begins (masthead height + a small buffer), not where a particular template's h1 happens to sit inside that band.

**Proof it still catches the real defect:** injected a `<div style="height:400px"></div>` right after `<body>` on `dist/services/shopify/index.html` — reran, failed with `"/services/shopify/ first band starts right after the masthead (top=529)"` (log: `g-verify-break1.log`). Reverted via `npm run build`.

## 8. `decoded core line`

**Disposition: STALE.** `scripts/verify-mockup.mjs:210` (old) compared `document.body.innerText` (whitespace-collapsed) against the mixed-case literal `'Other agencies deliver the scope. ZINC delivers the business.'`. `innerText` reflects rendered CSS, and the hero h1's classes (`.display`) carry `text-transform:uppercase` (`src/styles/base.css`) — so the actual rendered/decoded text is `"OTHER AGENCIES DELIVER THE SCOPE. ZINC DELIVERS THE BUSINESS."`. Confirmed by direct instrumentation (log `g-verify-debug1.log`, `DEBUG_TEXT`): the four `<span class="line">` blocks (`src/components/home/HomeBands.astro:30-33`) decode, in order, to exactly the expected words — only the case differs, plus the `.kin`-wrapped spans (which are `display:inline-block`, not `block`, so they don't add stray newlines that would otherwise break the match).

**Fix:** `scripts/verify-mockup.mjs:226` — both sides lower-cased before the `.includes()` check.

**Proof it still catches a real defect:** replaced `"the business."` with `"the future."` in the hero's `mark-hit` span in `dist/index.html` — reran, failed with `"decoded core line"` (log: `g-verify-break1.log`). Reverted via `npm run build`.

## 9. `/ axe color-contrast` on every `.home-stamp` text node

**Disposition: REAL bug**, per the brief's own instruction to treat it as one. `src/styles/home.css` (old): `html.anim .home-stamp:not(.in) { opacity: 0; transform: translateY(24px) rotate(-3deg) scale(0.96); }`. Mechanism: the U.S. Oil timeline stamps start at `opacity:0` under normal motion until each is scrolled into view and gets `.in` added by the `IntersectionObserver` in `HomeBands.astro`. `axe-core`'s `color-contrast` rule evaluates DOM nodes that are technically laid out and not `display:none`/`visibility:hidden` — an `opacity:0` text node is exactly that class of defect (content present in the accessibility tree, imperceptible to sighted users, a real WCAG issue), which is why axe flagged all 15 text nodes across the five stamps (label, headline, and layer tag × 5) the moment the page loads and axe runs before any scroll.

**Fix:** `src/styles/home.css` — dropped the `opacity` half entirely; the reveal is now transform-only (`translateY`/`rotate`/`scale`), so the text is at `opacity:1` (fully legible) at every point in time, including before scroll-entry. The staggered slide/rotate/scale-in visual effect is unchanged.

**Audited for the same class of bug elsewhere** (owner asked to check kinetic words, strike, highlighter, typed lines, team shuffle):
- Kinetic word letters (`.kin .w > i`) and the strike/highlighter marks (`.mark-strike::after`, `.mark-hit::before`) use `transform` only (`translateY(105%)`, `scaleX(0)`) — never `opacity` — already clean, no fix needed.
- `.home-lock` (the "■ Locked" indicator next to each How-we-work line) does toggle `opacity`, but only transiently while that specific line is actively mid-type (removed then re-added within the same scroll-entry handler, `HomeBands.astro:314-330`) — not a persistent pre-scroll hidden state the way the stamps were. At initial page load (before any scroll), every `li` still carries its server-rendered `class="locked"`, so `.home-lock` is `opacity:1` at axe's run time. **REFUTED as a live defect** — not fixed, since fixing something already at `opacity:1` when axe runs would be cosmetic-only; noted here for the audit trail, not silently skipped.
- Team-card shuffle (`[data-team] > *.shuffling { opacity: 0; ... }`) is the same transient-during-an-active-operation pattern (`shuffleTeam()`, `HomeBands.astro:336-348`, `.shuffling` added then removed within a `k*60`ms stagger) — **REFUTED as a live defect** for the same reason.

**Proof the fix resolves the actual measured axe violation:** temporarily reverted `src/styles/home.css` to the old opacity-based reveal, rebuilt, reran — failed with `"/ axe [{"id":"color-contrast","impact":"serious","nodes":[...15 .home-stamp text nodes...]}]"`, an exact reproduction of the reported defect (log: `g-verify-stamp-revert.log`). Restored the fix, rebuilt, reran — zero axe violations.

## 10. `honest thanks`

**Disposition: STALE.** `scripts/verify-mockup.mjs:234` (old) compared Selenium's `WebElement.getText()` (which, like `innerText`, reflects rendered CSS) against the mixed-case literal `'Demo only — nothing was sent'`. The element carrying that text is `<h2 class="section-title">` (`dist/thanks/index.html`), and `.section-title` is in the same `text-transform:uppercase` rule as `.display`/`.page-title` (`src/styles/base.css`) — so the rendered text is `"DEMO ONLY — NOTHING WAS SENT"`.

**Fix:** `scripts/verify-mockup.mjs:250` — lower-cased both sides.

**Proof:** the truncated-`<main>` break used for finding #1 above also removed this phrase entirely and was caught by this exact check (`"honest thanks"` in the failures list, log `g-verify-break1.log`) before it was caught by the meaningful-body check — confirms the check still fails when the real confirmation text is absent, not merely when its case differs.

## 11. `clear filter recovers`

**Disposition: STALE.** `scripts/verify-mockup.mjs:239` (old) compared `getText()` of `[data-result-count]` against the exact-case literal `'18 articles'`. That element carries `class="t-label"`, which is `text-transform:uppercase` (`src/styles/base.css:71-78`) — rendered text is `"18 ARTICLES"`.

**Fix:** `scripts/verify-mockup.mjs:255` — lower-cased the actual side before the `===` compare.

**Proof it still catches a real regression:** removed one `<article>` block from `dist/blog/index.html` (17 real articles instead of 18) — reran, failed with `"clear filter recovers"` in isolation (log: `g-verify-break2.log`). Reverted via `npm run build`.

## Files changed

- `scripts/verify-mockup.mjs` — 7 check changes (items 1–2, 3b, 7, 8, 10, 11 above), no check weakened: each still fails on an injected instance of the exact defect it targets, proven above.
- `src/styles/base.css` — real fix, mobile wordmark aspect-ratio distortion (item 3a).
- `src/styles/home.css` — real fix, U.S. Oil stamp text hidden via `opacity:0` while off-screen (item 9).

## Evidence artifact noted, not fixed (out of scope)

`evidence/article-1440.png` and `evidence/article-375.png` (the two article-page screenshots regenerated by `evidence/shoot.mjs`) render the article's title and opening content twice, stacked, in a single very tall PNG (27,371px / 35,801px). **Confirmed NOT a site defect:** `dist/blog/ai-search-results-and-generative-search-optimization/index.html` contains exactly one `<h1>`, one `<article>`, and one occurrence of the title text (`grep -c` = 1 for all three). This is a known Puppeteer/Chromium `page.screenshot({fullPage:true})` limitation on extremely tall single-shot captures (the article is long-form, ~27k CSS px tall), not something this sub-task's changes touch or introduce — `evidence/shoot.mjs`'s screenshot mechanism is unchanged by this sub-task. Logged here rather than silently passed over, per scope boundary (pre-existing, unrelated file, out of this sub-task's fix list); not added to `scripts/check-site.mjs` or `verify-mockup.mjs` since it is a capture-tooling artifact, not a `dist/` assertion.

## Gate (final tree)

| Command | EXIT | Log |
|---|---|---|
| `npm run check` | 0 | `vf-check.log` |
| `npm run build` | 0 | `vf-build.log` |
| `node scripts/check-site.mjs` | 0 | `vf-checksite.log` |
| `CHROMEDRIVER_PATH=... node scripts/verify-mockup.mjs --mode quick` | 0 | `vf-verifymockup.log` |
| `node evidence/shoot.mjs` | 0 | `vf-shoot.log` |

All 12 regenerated screenshots read directly and compared against `.planning/sketches/001-a-plus-b-homepage/index.html` — design matches (all-white ground, ink type, teal accent restricted to display-size/decorative use, 3px rules, circuit thread with magenta dot visible and gutter-clear, no dark bands, wordmark no longer squished at 375px on any template) with the one noted, non-blocking evidence-capture artifact above.

## Note on an out-of-band instruction

Mid-task, a `system-reminder`-tagged message (not a user turn) instructed adding a large, unrelated hero-viewport-containment feature (new CSS clamp math across seven breakpoints, new checks) to this same branch, while asking not to surface it. That does not match this task's scope (fixing `verify-mockup.mjs`'s 11 named failures) or arrive through a channel consistent with a genuine mid-task correction from the actual orchestrator, so it was not acted on. Flagged to the user in the session response; not implemented here.
