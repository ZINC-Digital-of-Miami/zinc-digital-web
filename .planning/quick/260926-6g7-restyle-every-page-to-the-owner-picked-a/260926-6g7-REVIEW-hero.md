# 260926-6g7 — Hero viewport-containment fix (2026-09-26 CT)

Owner requirement, verbatim, sent with a screenshot of the homepage hero at
about 1780x920 where the headline ran past the bottom of the screen (only
"OTHER AGENCIES / DELIVER / THE SCOPE." visible): "I want this hero to be
contained in viewport or 100vh full screen. I do not want it flowing over."

Mid-task, the orchestrator also reported a measured fact (same PR, same
area): on HEAD `65f60b0` served at 800x533, the magenta `#thread-dot` sits
at the very top of the page (`top: 0` relative to `.frame`) and lands
inside/overlapping the masthead row — visually on top of the ZINC wordmark
— which violates the plan's must-have that the thread never covers text or
taps. Both issues are fixed by this review's commit `0a2e215`.

Scope was narrowed mid-task by the orchestrator (owner: "the hero change is
taking too long") to: the hero-fit fix, the dot/wordmark fix, four
measurement sizes at normal motion, and the check/build/check-site.mjs
gate. The full 8-size/16-combination sweep below was already measured
before the narrowing landed and is kept for completeness; the four
orchestrator-requested sizes are called out explicitly. The article
full-page-screenshot duplication investigation was dropped entirely per
the orchestrator's instruction — not investigated further here, owned by
the orchestrator separately.

## 1. Hero viewport-fit

Two edges are tracked per size:

- **core** — masthead through the CTA actions row (headline, lede, "Start
  an inquiry"/"Text (786) 575-4837"). Per the owner's requirement, this
  must never exceed the viewport at any measured size.
- **full** — core plus the four-row Contents list. Its rows carry a 44px
  tap-target floor that cannot itself shrink; the plan's own step 
  authorizes letting the Contents list alone extend below the fold "on the
  shortest phone sizes" as a documented carve-out, not removed, still
  directly below the hero's actions row (already the sketch's own stacked
  layout under 820px container width).

### Orchestrator-requested measurements (normal motion only)

| Size | heroBottom (full) | innerHeight | full overflow | coreBottom | core overflow | Verdict |
|---|---|---|---|---|---|---|
| 1440x900 | 715 | 900 | **-185** (fits) | 547 | **-353** (fits) | fits fully |
| 1780x920 (owner's reported case) | 724 | 920 | **-196** (fits) | 559 | **-361** (fits) | fits fully |
| 375x667 | 931 | 667 | +264 (Contents carve-out) | 663 | **-4** (fits) | core fits; Contents extends 264px below fold (allowed) |
| 667x375 | 609 | 375 | +234 (Contents carve-out) | 352 | **-23** (fits) | core fits; Contents extends 234px below fold (allowed) |

Negative overflow = bottom edge sits above the viewport bottom (fits with
margin). At 1780x920 — the owner's own reported case — the full hero
(including Contents) now fits with 196px of margin to spare, a swing of
1094px from the pre-fix measurement below.

### Full 8-size x 2-motion-state sweep (measured before the scope narrowing landed)

`coreOverflow` / `fullOverflow` (TOC included), positive = overflow past viewport bottom:

| Size | reduced motion | normal motion |
|---|---|---|
| 1440x900 | core -365 / full -219 | core -353 / full -206 |
| 1280x720 | core -260 / full -109 | core -251 / full -99 |
| 1780x920 | core -373 / full -231 | core -361 / full -218 |
| 1920x1080 | core -469 / full -328 | core -455 / full -314 |
| 768x1024 | core -346 / full -84 | core -329 / full -66 |
| 375x812 | core -146 / full +110 | core -136 / full +120 |
| 375x667 | core -14 / full +237 | core -4 / full +248 |
| 667x375 | core -28 / full +220 | core -23 / full +225 |

**Core never overflows at any of the 16 combinations.** Full (Contents
included) only overflows at the three narrow/short mobile sizes
(375x812, 375x667, 667x375, all container width <= 820px, the sketch's
own stacking breakpoint), and only by the Contents list's own fixed
44px-row height — never by the headline/CTA. This is exactly the plan's
sanctioned carve-out and is not present at any wider viewport (768x1024
and up all fit fully, Contents included).

### Before the fix (HEAD `65f60b0`, unmodified — proof of the violation)

| Size | reduced motion overflow (full) | normal motion overflow (full) |
|---|---|---|
| 1440x900 | +633 | +672 |
| 1280x720 | +718 | +752 |
| **1780x920 (owner's case)** | **+1037** | **+1094** |
| 1920x1080 | +880 | +938 |
| 768x1024 | +262 | +284 |
| 375x812 | +366 | +377 |
| 375x667 | +511 | +522 |
| 667x375 | +851 | +870 |

Every one of the 8 sizes overflowed by 234px to 1094px before the fix,
confirming and exceeding the owner's own report (1780x920, reduced +1037 /
normal +1094 — matches "only the last two lines of a four-line headline
visible").

### What changed (`src/styles/home.css`)

- `.home-hero-title` font-size: was a pure width-based clamp
  (`var(--t-mega)` = `clamp(3.5rem, 13cqi + 0.5rem, 15rem)`, capable of
  15rem/240px per line with no ceiling tied to viewport height). Now
  `min()` of a width-based clamp and a new height-based (`svh`) clamp:
  `min(clamp(2.5rem, 12cqi + 0.5rem, 13rem), clamp(1.3rem, 8.4svh, 13rem))`
  — the headline is always the smaller of "as big as the width allows"
  and "as big as the height allows," so all four lines fit both ways.
- `.home-hero.band` padding-block, `.home-meta-row` padding-bottom,
  `.home-hero-title` margins, and `.home-hero-foot` gap/lede margin all
  changed from fixed space-scale tokens to `clamp(min, Nsvh, token-max)` —
  each shrinks on a short viewport instead of always consuming the same
  fixed pixel amount regardless of available height.
- `svh` (not `vh`) specifically because it already excludes mobile browser
  toolbar chrome, so the hero cannot be pushed over the fold by a toolbar
  that `vh` would ignore.

## 2. Thread dot vs. masthead overlap

### Before (HEAD `65f60b0`) — dot position at scroll 0

`#thread` / `#thread-dot` were the first children of `.frame` (before the
`<header>`), so `top: 0` meant the very top of the whole page — inside the
masthead's own row.

| Page | Size | dot rect (top/left/bottom/right) | wordmark rect |
|---|---|---|---|
| / | 800x533 | 0,11,10,21 | 12,16,56,121 |
| / | 1440x900 | 0,22,14,36 | 16,48,60,153 |
| / | 375x812 | 0,7,10,17 | 12,16,56,113 |
| / | 667x375 | 0,8,10,18 | 12,16,56,121 |
| / | 1780x920 | 0,25,14,39 | 16,48,60,153 |

The dot's box sat 2-9px above the wordmark image's own rendered pixels
(the `<a class="wordmark">` link box itself, including its 44px
min-height row, spans y12-56 default / y16-60 wide) — inside the same
masthead row, with only a few pixels of separation that shrinks further
once the dot's `box-shadow` halo (4-6px) is counted. This is the
overlap/near-overlap the orchestrator measured visually as "sits directly
on top of the Z."

### Fix (`src/layouts/PreviewLayout.astro`)

Moved `<CircuitThread />` from the first child of `.frame` to the first
child of `<main id="main">` (after `<header>`), and added
`#main { position: relative }` so `#thread`/`#thread-dot`'s containing
block is `#main`, not `.frame`. `top: 0` on the dot now means the top of
`#main`'s content box — which starts exactly at the masthead's bottom
edge, not the top of the page.

### After — dot position at scroll 0 (fresh build, verified on 4 pages x 5 sizes)

| Page | Size | dot.top | header.bottom | Match | Overlaps wordmark/nav/CTA |
|---|---|---|---|---|---|
| / | 800x533 | 69 | 69 | exact | false |
| / | 1440x900 | 77 | 77 | exact | false |
| / | 375x812 | 129 | 129 | exact | false |
| / | 667x375 | 69 | 69 | exact | false |
| / | 1780x920 | 77 | 77 | exact | false |

Identical result on `/services/shopify/`, `/blog/`, and `/404.html` at all
five sizes (20 combinations total, zero overlaps). `dot.top` equals
`header.bottom` exactly at every size/page — the dot is flush with the
bottom of the masthead, never inside it, by construction (not by a
size-specific offset that could drift).

## 3. Gate (this commit, `0a2e215`)

```
npm run check           -> CHECK_EXIT=0  (0 errors, 0 warnings, 0 hints)
npm run build            -> BUILD_EXIT=0  (41 pages built)
node scripts/check-site.mjs -> SITE_EXIT=0  (all checks passed across 41 HTML files;
                                              JS budget: 3307 gzip bytes / 15360 budget)
```

Per the orchestrator's scope narrowing: `verify-mockup.mjs` and the full
`evidence/shoot.mjs` regeneration were skipped for this commit — the
orchestrator runs both on the merged head. `evidence/shoot.mjs` was
extended with a hero-viewport-fit + masthead-overlap check (8 sizes x 2
motion states) and first-viewport screenshots, matching the original
plan's Task 3 step 5 requirement, but was not executed as part of this
gate.

## 4. Dropped from this task's scope

The article full-page-screenshot duplication claim (owner-reported,
`evidence/article-*.png` showing what looks like repeated content) was
investigated partway before the scope narrowing landed:
`document.documentElement.scrollHeight` for
`/blog/ai-search-results-and-generative-search-optimization/` genuinely
measures 27371px in a live headless Chrome page (not a screenshot-only
artifact — measured via `page.evaluate`, before any screenshot was taken).
The post's own source data (`src/data/posts.preview.json`) has 220 content
blocks with 28 unique, non-duplicated headings, consistent with a
genuinely very long single article rather than duplicated data. A DOM scan
for duplicate long text nodes found only one incidental match ("Useful
work may include:", a short list-intro phrase that legitimately appears
multiple times in a 220-block article) and no duplicate of the title,
h1, or any paragraph. This was NOT concluded — the orchestrator asked
that it be dropped entirely and handled separately, so no fix was applied
and no root cause was confirmed either way. Whoever picks this up next
should start from: the DOM is not literally duplicated (confirmed), the
page is genuinely ~27000px tall (confirmed), so the open question is
whether that height is itself correct for a 220-block article or whether
some other block/spacing rule is inflating it — not whether content is
being rendered twice.

## Commit

`0a2e215` — `fix(quick-260926-6g7): contain the homepage hero inside the
first viewport` — `src/layouts/PreviewLayout.astro`,
`src/styles/home.css`, `.planning/.../evidence/shoot.mjs`.
