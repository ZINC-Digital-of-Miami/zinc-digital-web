# Quick task 260926-6g7, sub-task "home": PR #4 review disposition

Reviewed at commit `876e3b7` (PR #4 head), fixes committed on
`gsd/quick-260926-6g7-home`. All measurements below are from a real Chrome
(puppeteer-core + local Chrome binary) driving the built `dist/` over a
throwaway local static server — not simulated. Reviewed 2026-09-26 CT.

## Leads: disposition

### 1. Textual accents using `--accent`/`--color-teal` instead of `--accent-text` — CONFIRMED, fixed

- **home.css:327 (pre-fix):** `html.anim .home-layer.on .home-layer-title { color: var(--accent); }` — the active Loop layer title (Build/Demand/Intelligence) used raw teal.
- **home.css:539 (pre-fix):** `.home-stamp--next .home-stamp-k { color: var(--color-teal); }` — the U.S. Oil "Next build" stamp used raw teal.
- **Mechanism:** `--accent` (`#07B2B2`) measures 2.42:1 on `--bg` (`#F5F6F7`); `--accent-text` (`#057E7E`) measures 4.52:1. Both computed via the WCAG relative-luminance formula (verified with an independent Python calc, not eyeballed).
- **Fix:** both switched to `var(--accent-text)`. Grepped every remaining `accent`/`teal` usage in `home.css` after the fix — all are `fill`/`stroke` (SVG) or `background` (the blinking-cursor bar), i.e. decoration, not text.
- **Commits:** `dfd68d0` (accent-text swap), `ebc8cca` (companion opacity fix, see #2).
- **Measured:** puppeteer contrast scan of every visible text node inside `#loop` and `.home-tl`, at 1440x900 / 375x812 / 375x667 / 667x375, both `prefers-reduced-motion` values (8 combos) — zero contrast violations (`home-a11y-results.json`, generated fresh against the final committed build).

### 2. Inactive Loop layers dimmed via `opacity` on text — CONFIRMED, fixed

- **home.css:305-312 (pre-fix):** `html.anim .home-layer { opacity: 0.35; }` applied to the whole `<li>`, including its heading and label text.
- **Mechanism:** near-black text (`#0A0A0B`) composited at 0.35 alpha over `--bg` (`#F5F6F7`) computes to `#A3A3A4`, contrast 2.33:1 — under the 4.5:1 floor. Verified independently in Python (composite-then-measure), not just asserted.
- **Fix:** removed `opacity` from `.home-layer` entirely. Inactive layers now signal subordination via `color: var(--muted)` (6.08:1 on `--bg`, still AA-safe) on the label/title/note text, plus a fainter border-top color. The active layer's title still animates to full contrast via `--accent-text` (fix #1).
- **Commit:** `ebc8cca`.
- **Measured:** same contrast scan as #1 — the mid-scroll state (one layer `.on`, two not) is exercised because the test scrolls the whole page through before scanning, so the Loop's own scroll handler settles on a real mixed active/inactive state; zero violations.

### 3. First heading after `<h1>` is `<h3>` with no `<h2>` — CONFIRMED, fixed

- **HomeBands.astro:89 (pre-fix):** the Loop layer titles (Build/Demand/Intelligence) were `<h3>`, immediately following the page's only `<h1>` — a skipped level.
- **Fix:** promoted all three to `<h2>`, matching the OUABC ("Almost three years.") and U.S. Oil ("A website became the business.") case-study headings, which were already `<h2>`. No other skip existed elsewhere on the page (the field-notes cards' `<h3>` sit correctly one level under the preceding `<h2>`; `TeamBand.astro`'s `heading` prop renders as a `<p class="t-label">`, not a heading tag, so it doesn't affect the sequence).
- **Commit:** `80c1e0c`.
- **Measured:** puppeteer heading-order scan (walks every visible `h1`-`h6` in document order, flags any level jump `>1`) across all 8 viewport/motion combos. Resulting sequence at every combo: `H1, H2, H2, H2, H2, H2, H3, H3, H3, H2, H3, H3` (Loop x3, OUABC, U.S. Oil, field-notes x3, footer — footer is `SiteFooter`, out of this sub-task's file scope, its own `H2`/`H3` sit fine after a `H3`→`H2` step-down, which is never a skip). Zero skips in every combo.

### 4. Collapsed Loop lists keep focusable links at zero height — CONFIRMED, fixed

- **home.css:343 (pre-fix):** `html.anim .home-layer-list { max-height: 0; overflow: hidden; }` clipped the list visually, but its `<a>` children stayed in the tab order at zero rendered height — a keyboard user tabbing through could land on an invisible stop.
- **Fix:** added `visibility: hidden` (synced to the same `.on` class toggle that already drives `max-height`) — `visibility: hidden` removes descendants from both the accessibility tree and the tab order, the CSS-native equivalent of toggling `inert`, with no change to the existing collapse/expand transition.
- **Commit:** `1ecda2e`.
- **Measured:** puppeteer keyboard walk — focuses the first TOC link, then presses Tab up to 25 times, recording every focused element's tag, visibility (`display`/`visibility`/bounding-rect size) and whether it's inside `#loop`. Across all 8 combos, every `inLoop` focus stop reports `visible: true` with a real rendered size (service links 44-176px wide x 44px tall, TOC rows 327-614px x 49px). The global `:focus-visible` outline (`base.css`, `outline: 2px solid var(--fg)`) still applies to every genuinely visible stop — visible focus indicator confirmed present, not just non-trapped.

### 5. TOC links apply 340vh progress math even when not armed — CONFIRMED, fixed

- **HomeBands.astro:444 (pre-fix):** the click handler on `.home-toc a[data-layer]` called `e.preventDefault()` and computed a `340vh`-scale scroll offset unconditionally — including under `prefers-reduced-motion: reduce`, when `html.anim` (and therefore the Loop's pin/340vh height) was never applied by `home.css`.
- **Fix:** gave each `.home-layer` a stable id (`#loop-layer-0/1/2`) and pointed the TOC anchors' `href` directly at them, so a plain, JS-free anchor click already lands on the right layer. The click handler now checks `root.classList.contains('anim')` first and returns early (no `preventDefault`, no math) when the scene isn't armed, letting the native anchor navigation happen instead.
- **Commit:** `80c1e0c`.
- **Measured:** puppeteer TOC-click check (clicks the "Demand" link, waits, reads `location.hash` and whether `#loop-layer-1`'s bounding rect is in the viewport) across all 8 combos:
  - **Reduced motion** (unarmed): `hash: '#loop-layer-1'` (native anchor fired, JS did not intercept), `layerInViewport: true` at every viewport.
  - **Normal motion, tall viewports** (armed, `.anim` present): `hash: ''` (JS intercepted and ran the progress math), `layerInViewport: true`.
  - **Normal motion, short viewports (375x667, 667x375)**: `.anim` is still present (motion is allowed; only the *visual pin* backs off via the #6 fallback), so the JS math still runs (`hash: ''`) — and it still lands correctly (`layerInViewport: true`) because the math is computed from the element's actual `offsetHeight`/`offsetTop`, not a hardcoded assumption.

### 6. Sticky Loop scene clips content at short viewports — CONFIRMED, fixed

- **home.css:215 (pre-fix, `html.anim .home-loop-sticky`):** `height: 100svh` + `overflow: hidden`. At 375x667 the head + SVG (`max-height: 38vh` under the existing mobile container query) + three-layer list add up to roughly 677px of content inside a 667px box; at 667x375 landscape the box is only 375px tall — both clip.
- **Fix:** added `@media (max-height: 750px)` that drops the pin entirely below that height — `position: static`, `height: auto`, `overflow: visible` on `.home-loop-sticky`, `height: auto` on the band, and a smaller SVG cap (`22rem`). Nothing is ever fixed to a height smaller than its content below this breakpoint; the scroll-driven draw becomes coarser there, an accepted trade against clipped, unreadable content.
- **Commit:** `44ab049`.
- **Measured:** puppeteer clip check (`home-loop-sticky.scrollHeight` vs `.clientHeight` while `overflow: hidden` is in effect) across all 8 combos — `clipped: false` everywhere. At 1440x900 normal motion the pin is still active as designed (`overflowsHidden: true`, `clientHeight === scrollHeight`, i.e. content fits the pin). At 375x667 and 667x375 normal motion, `overflowsHidden: false` (fallback engaged), content flows normally. Confirmed visually too — `band-loop-375x667-normal.png` and `band-loop-667x375-normal.png` show the Loop graphic plus the Build/Demand layer text and service links flowing in normal document order with nothing cut off.

### 7. "Almost three years." headline vs. "Receipt pending" Engagement figure — REFUTED (the headline), CONFIRMED (the contradiction), fixed

- **HomeBands.astro:119, "Almost three years." — REFUTED as an invented number.** `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md:20` records the owner's own fact: "Once Upon a Book Club (OUABC). Ecommerce brand, almost three years with ZINC, about $21k/month with the agency...". This is documented owner input, not an invention.
- **Real defect, CONFIRMED:** the same band's Engagement figure (line 130, pre-fix) still redacted that identical fact as `<span class="redact">Receipt pending</span>` with `[RECEIPT: confirmed tenure]` — directly contradicting the headline one section above it.
- **Fix:** set the Engagement figure's value to `Almost three years` (plain text, matching the headline's own wording, no invented number) and narrowed its draft-tag to `[RECEIPT: exact start date]` — the one number genuinely still missing. Revenue outcome and Reporting figures are untouched (`Receipt pending` / `[RECEIPT: approved outcome]` / `[RECEIPT: reporting impact]`) — those numbers are not yet supplied and stay redacted.
- **Commit:** `8fed51a`.

### 8. Desktop OUABC screenshot soft on 2x screens — CONFIRMED, fixed (no higher-res source found)

- **HomeBands.astro:143 / home.css:461 (pre-fix):** `.home-shots .desk { width: 100%; }` rendered `public/mockup/ouabc-site.webp` at roughly 735 CSS px at 1440 while the asset (`src/data/assets.preview.json`: `width: 1000, sourceWidth: 1000`) is only 1000px wide natively — about 1.36x, under the 2x floor.
- **Source search performed:** extracted and measured every image in `assets/ouabc-*.{jpg,png}` from `/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website V2.zip` (the exact `source` recorded in `assets.preview.json`) — `ouabc-site.jpg` is 1000x4841, `ouabc-mobile.jpg` 460x9940, `ouabc-laptop-shot.png` 986x521 (different crop, still under 1000px), `ouabc-phone-shot.png` 385x799, `ouabc-hero.png` 1415x867 (already used elsewhere, wrong crop for this slot). Also broad-searched `/Volumes/Satechi Hub` for `*ouabc*`/`*once*upon*` image files (OUABC Work/, MacM4Pro backup, client archives, CodexScratch) — nothing at higher resolution than the 1000px source already in the repo. **No higher-resolution original exists.**
- **Fix applied (per the lead's own fallback instruction):** capped `.home-shots { max-width: 480px; }`, so the 1000px-wide source stays at least 2x the rendered CSS width at every breakpoint rather than upscaling an already-soft image further.
- **Commit:** `4f30d36`.
- **Measured:** puppeteer `naturalWidth`/rendered-width check on both `.home-shots img` elements across all 8 combos — ratio range 2.08x-4.69x everywhere (was as low as ~1.36x before). Confirmed 1000/480 = 2.08x exactly matches the intended floor.

## Also checked: U.S. Oil stamps + logo-cell fixes (commit `0597714`) — CONFIRMED still holding

- `revealStamps()` is present and wired to the `IntersectionObserver` for `[data-home-band="us-oil-solutions"]` (`HomeBands.astro`), staggering `.in` onto each stamp (or applying it immediately under reduced motion) — no regression.
- Grepped `HomeBands.astro` and `home.css` for `tabindex` — zero matches. The seven dead `tabindex="0"` logo-wall stops removed in `0597714` have not returned.

## Verification commands run

All logs in `/private/tmp/claude-501/-Volumes-Satechi-Hub-zinc-digital-web/4d63e2c8-f06b-433f-b6af-2afc7f083cb8/scratchpad/home-*`, against the final committed tree (`8fed51a`):

| Command | Exit |
|---|---|
| `npm run check` | 0 |
| `npm run build` | 0 |
| `node scripts/check-site.mjs` | 0 |
| `node home-a11y-check.mjs` (custom puppeteer evidence script — contrast, heading order, tab order, TOC landing, clipping, image ratio; 4 viewports x 2 motion modes) | 0, zero violations |
| `node home-band-shots.mjs` (targeted Loop/U.S. Oil/OUABC band screenshots for visual confirmation) | 0 |

Screenshots read and confirmed against `.planning/sketches/001-a-plus-b-homepage/index.html` variant 3 ("All white"): the Loop's muted/active layer contrast, the U.S. Oil "Next build" stamp color, and the OUABC figures all match the sketch's visual language — dark ink on snow, teal reserved for the active/decorative accents, no invented numbers, `[DRAFT]`/`[RECEIPT]` markers intact.

## Commits on `gsd/quick-260926-6g7-home`

| Commit | Lead(s) | Summary |
|---|---|---|
| `ebc8cca` | 2 | Stop dimming inactive Loop layers via opacity on text |
| `dfd68d0` | 1 | Use `--accent-text`, not `--accent`/`--color-teal`, for text |
| `1ecda2e` | 4 | Sync inactive Loop lists' visibility with keyboard focus |
| `44ab049` | 6 | Add short-height fallback for the pinned Loop scene |
| `4f30d36` | 8 | Cap OUABC desktop shot width to keep it 2x-safe |
| `80c1e0c` | 3, 5 | Fix Loop heading order and unarmed TOC navigation |
| `8fed51a` | 7 | Align OUABC Engagement figure with the headline |

## Files changed

- `src/styles/home.css`
- `src/components/home/HomeBands.astro`

No changes to `src/data/*`, `public/mockup/*`, or any file outside this sub-task's scope.
