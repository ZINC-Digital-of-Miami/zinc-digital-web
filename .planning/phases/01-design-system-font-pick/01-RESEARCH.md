# Phase 1: Design System & Font Pick - Research

**Researched:** 2026-09-25 (CT)
**Domain:** Astro 7 project scaffolding, native Fonts API, Vercel preview deployment protection, Lighthouse/contrast validation
**Confidence:** HIGH

## Summary

Phase 1 is a scaffold-and-mockup phase: create the Astro project, wire the Vercel adapter, build the plain-CSS token system with `data-theme` banding, and render the homepage hero + one service spec sheet three times (once per font pairing) on protected, noindexed preview routes so the owner can pick a pairing on Day 1. The stack (Astro 7.3.5, `@astrojs/vercel` 11.0.11, Node 24) is unchanged from project-level research and reconfirmed live against the npm registry in this session.

**The single highest-value finding of this research session is a correction to `.planning/research/STACK.md` and `01-UI-SPEC.md`:** Astro 7.3.5 ships a **native, stable Fonts API** (`fonts` config key, `Since v6.0.0`, no experimental flag) that performs self-hosting, subsetting, `font-display: swap`, preload-link generation, **and automatic metric-matched fallback generation** (`size-adjust`/`ascent-override`/`descent-override`/`line-gap-override`) — all in one built-in mechanism, with zero extra npm dependencies. This was verified two ways in this session: (1) Context7 official Astro docs confirm the API is stable since Astro 6.0 and that experimental font flags were removed in Astro 7.0, and (2) a live local `astro build` in a throwaway scaffold produced the exact fallback CSS block (`size-adjust:107.1194%;ascent-override:90.4365%;descent-override:22.518%;line-gap-override:0%`) and a `unicode-range` matching the "Latin + Latin-1 Supplement" coverage UI-SPEC calls for. STACK.md's and UI-SPEC's `pyftsubset` + Fontaine/capsize pipeline is unnecessary for this phase — recommend the native Fonts API instead, since "font subsetting tool and fallback-metric generation method" is explicitly Claude's Discretion per `01-CONTEXT.md`.

A second load-bearing, directly-tested finding: `npm create astro@latest .` **will not scaffold into a non-empty directory** — it silently creates a new randomly-named sibling subdirectory instead (verified by direct execution against a directory containing the worktree's existing `README.md`/`AGENTS.md`/`.gitignore`/`.planning/`). The worktree at `/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01` is exactly this kind of non-empty directory. The plan must scaffold to a temp location and merge in files selectively, because the official `minimal` template **also ships its own `AGENTS.md`, `README.md`, and a `CLAUDE.md → AGENTS.md` symlink** that would collide with this repo's own governance files of the same names (also directly verified).

A third finding with direct cost implications: Vercel's **Password Protection costs $20/month per project on Pro** (confirmed on vercel.com/docs, updated 2026-09-15) — this is a paid add-on and is disallowed by `01-CONTEXT.md`'s "no paid services beyond current subscriptions" constraint. **Vercel Authentication** is the correct, free protection method for this phase (available at no cost on Pro, gates all non-production URLs to logged-in team members — which the owner already is, on `zincdigitalofmiamis-projects`). Separately, Vercel already auto-adds `X-Robots-Tag: noindex` to every preview deployment by default (no config needed) unless a custom domain is attached to the branch — which this phase does not do.

**Primary recommendation:** Scaffold via a temp-directory `create-astro` run (never in-place), add the Vercel adapter via `astro add vercel`, configure all nine font files through Astro's native `fonts` array (mixing `fontProviders.google()` and `fontProviders.fontsource()` per-family based on which resolves — see Pitfall 3), set Standard Protection + Vercel Authentication on the project's Deployment Protection settings, and validate with `astro check` + `@lhci/cli` + `@axe-core/cli` against the deployed preview URL.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Font pairing fetch/subset/fallback-generation | Build (Astro Fonts API, build-time) | Browser (applies via CSS custom property) | Fonts are downloaded, subsetted, and fallback-matched once at `astro build` time; the browser only ever sees the resulting static `@font-face`/`:root` CSS and cached WOFF2 files |
| Design tokens & `data-theme` banding | Browser/Client (CSS cascade reads `data-theme`) | Build (tokens.css/themes.css authored and bundled at build) | `data-theme="dark\|light"` is a static HTML attribute per band; token values are resolved by the CSS cascade at render time with zero JS |
| Brand mark rendering | Browser/Client (`<img>`/CSS `aspect-ratio`) | CDN/Static (Vercel serves the raster PNG) | Static asset served straight from Vercel's CDN; sizing/crispness constraints are pure CSS |
| Preview route access control | CDN/Static (Vercel Deployment Protection, edge-level) | — | Enforced by Vercel's platform in front of the deployment, not by application code — there is no app-level auth in this phase |
| `noindex` enforcement | CDN/Static (Vercel's default `X-Robots-Tag` header) | Browser (`<meta name="robots">` as defense-in-depth) | Vercel injects the header automatically for every preview deployment without a custom domain; the meta tag is redundant-but-cheap insurance inside the HTML itself |

## Package Legitimacy Audit

| Package | Registry | Age (latest version) | Weekly Downloads | Source Repo | Verdict | Disposition |
|---------|----------|----------------------|-------------------|--------------|---------|-------------|
| `astro` | npm | published 2026-09-24 (1 day old) | 4,297,346 | github.com/withastro/astro | SUS (`too-new`) | Flagged — heuristic false positive: this is a same-week point release of an established, canonical project (4.3M weekly downloads, official withastro org repo). Planner should still add a `checkpoint:human-verify` before install per protocol, but treat as effectively OK. |
| `@astrojs/vercel` | npm | published 2026-09-22 (3 days old) | 272,547 | github.com/withastro/astro | SUS (`too-new`) | Flagged — same false-positive pattern (official withastro monorepo package, matches Astro's own release cadence). `checkpoint:human-verify` before install. |
| `@astrojs/check` | npm | published 2026-07-27 | 2,359,956 | github.com/withastro/astro | OK | Approved |
| `@lhci/cli` | npm | published 2025-06-25 | 1,072,916 | github.com/GoogleChrome/lighthouse-ci | OK | Approved (devDependency for validation) |
| `@axe-core/cli` | npm | published 2026-08-11 | 58,626 | github.com/dequelabs/axe-core-npm | OK | Approved (devDependency for contrast/a11y validation) |
| `lighthouse` (standalone) | npm | published 2026-09-18 (1 week old) | 3,213,484 | github.com/GoogleChrome/lighthouse | SUS (`too-new`) — not recommended as a direct dependency | Not used directly — `@lhci/cli` wraps Lighthouse internally; no need to also add the standalone CLI as a project dependency. |
| `sharp` | npm | published 2026-08-26 | 71,672,479 | github.com/lovell/sharp | OK | **Not required for Phase 1** — brand marks are plain raster PNGs sized via CSS `aspect-ratio` per UI-SPEC; no AVIF/WebP transform is needed until a later phase's `<Image>`/`<Picture>` usage. Listed here only so the planner doesn't reach for it unnecessarily. |

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `astro`, `@astrojs/vercel` (both "too-new" heuristic false positives on legitimate, high-download official packages — see disposition notes). The planner must still insert a `checkpoint:human-verify` task before `npm install` per protocol, even though the underlying risk is assessed as low.

**Provenance note:** all package names in this table were discovered via Context7 official docs and/or `npm view` executed directly in this session (not training-data recall), and each has a registry existence check plus a repo-URL/download-count cross-check — this qualifies them for `[VERIFIED: npm registry]` status per the package-name provenance rule, independent of the SUS/OK verdict.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---------------|
| `astro` | `7.3.5` `[VERIFIED: npm view astro version, this session]` | Static site generator, native Fonts API, content routing | Confirmed current on the npm registry in this session; matches `01-CONTEXT.md`'s locked stack decision exactly |
| `@astrojs/vercel` | `11.0.11` `[VERIFIED: npm view @astrojs/vercel version, this session]` | Vercel deployment adapter | Confirmed current; `npx astro add vercel` installs this exact version and wires `adapter: vercel()` into `astro.config.mjs` automatically (directly executed and observed in this session) |
| `@astrojs/check` + `typescript` | `0.9.10` (check) `[VERIFIED: npm view, this session]` | `astro check` — typecheck `.astro` files and font `cssVariable` references | `astro check` type-checks the `<Font cssVariable="…">` prop against the `fonts` config's declared variable names — directly observed catching a deliberately-introduced typo in this session's test build |

**No font-tooling packages are required as dependencies for this phase** — see Research Correction below. Astro's built-in `fonts` config (via `astro/config`'s `fontProviders`) replaces the previously-planned `fonttools`/`pyftsubset` + Fontaine/capsize pipeline entirely.

### Supporting (devDependencies, validation only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@lhci/cli` | `0.15.1` `[VERIFIED: npm view, this session]` | Lighthouse CI runner for the mobile ×4 gate | Run against each of the three deployed `/design-preview/{a,b,c}/` preview URLs, not `localhost`, since the gate is about the real deployed artifact |
| `@axe-core/cli` | `4.13.0` `[VERIFIED: npm view, this session]` | Automated WCAG 2.2 AA contrast + accessibility checks | `npx axe <url> --tags wcag2a,wcag2aa` covers the magenta/teal contrast rule (Pitfall #10 in project PITFALLS.md) as one command per preview route |

### Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Astro native `fonts` config (`fontProviders.google()` / `.fontsource()` / `.local()`) | Manual `pyftsubset` + Fontaine/capsize, per STACK.md's original plan | Only if a specific family's variable-axis or static-weight file cannot be resolved by **either** built-in provider by name (see Pitfall 3) — fall back to `fontProviders.local()` pointing at a manually-subsetted file you supply, not to hand-writing `@font-face`/`size-adjust` values yourself |
| `@lhci/cli` against the deployed preview URL | Chrome DevTools Lighthouse panel, manual run | Manual DevTools runs are fine for quick iteration but are not repeatable/scriptable — use `@lhci/cli` for the actual gate check that gets recorded |
| `@axe-core/cli` | Manual pairwise contrast lookup (WebAIM contrast checker, one color pair at a time) | The manual tool is fine for the initial token-selection pass (already done in UI-SPEC's own computed-contrast table) but not for the repeatable per-route gate — automate with axe |
| Vercel Authentication (protection method) | Password Protection | **Never for this project** — Password Protection costs $20/month/project on Pro, violating the "no paid services beyond current subscriptions" constraint. Vercel Authentication is free and sufficient since the only reviewer (the owner) is already a member of the `zincdigitalofmiamis-projects` team |

### Installation

```bash
# 1. Scaffold into a temp directory FIRST (the worktree is non-empty — see Pitfall 1)
cd /tmp && npm create astro@latest zinc-scaffold -- --yes --template minimal --install --no-git

# 2. Merge selected files into the worktree (skip AGENTS.md, README.md, CLAUDE.md — see Pitfall 2)
#    cp -R zinc-scaffold/{src,public,astro.config.mjs,package.json,package-lock.json,tsconfig.json,.vscode} \
#      "/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01/"
#    then hand-merge .gitignore (worktree's existing .gitignore already has .vercel/, .env.*, .scratch/ —
#    keep those, add astro's dist/ and .astro/ entries)

# 3. From inside the worktree, add the Vercel adapter (installs @astrojs/vercel, edits astro.config.mjs,
#    adds .vercel to .gitignore automatically — all three effects directly observed in this session)
npx astro add vercel

# 4. Dev-only typecheck tooling
npm install -D @astrojs/check typescript

# 5. Validation tooling (devDependencies)
npm install -D @lhci/cli @axe-core/cli
```

**Version verification performed this session:** `astro` 7.3.5, `@astrojs/vercel` 11.0.11, `@astrojs/check` 0.9.10, `@lhci/cli` 0.15.1, `@axe-core/cli` 4.13.0, `sharp` 0.35.4 — all confirmed via `npm view <pkg> version` against the live registry, matching `.planning/research/STACK.md`'s versions exactly (no drift since project-level research).

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ BUILD TIME (astro build, local + Vercel build container)             │
│                                                                        │
│  astro.config.mjs                                                     │
│   fonts: [ {name, cssVariable, provider, weights, subsets, ...} × 9 ] │
│        │                                                               │
│        ▼                                                               │
│  Astro Fonts API (astro:assets)                                       │
│   ├─ resolves family via fontProviders.google() or .fontsource()      │
│   ├─ downloads + caches exactly 1 WOFF2 file per (family,weight,style)│
│   ├─ computes metric-matched fallback (size-adjust/ascent-override/   │
│   │   descent-override/line-gap-override) from the real font metrics  │
│   └─ emits @font-face + :root{--font-x: ...} inline <style> + preload │
│        │                                                               │
│        ▼                                                               │
│  src/pages/design-preview/{index,a,b,c}.astro                         │
│   each renders identical Hero + SpecSheet markup, <Font> swaps only   │
│        │                                                               │
│        ▼                                                               │
│  dist/ (static HTML/CSS + dist/_astro/fonts/*.woff2, ≤3 files/pairing)│
├─────────────────────────────────────────────────────────────────────┤
│ DEPLOY (Vercel, @astrojs/vercel static entrypoint)                    │
│   Preview URL generated for gsd/phase-01-design-system-font-pick      │
│   → X-Robots-Tag: noindex header auto-added by Vercel (no config)     │
│   → Deployment Protection: Standard Protection + Vercel Authentication│
│     (free on Pro) gates every non-production URL to team members      │
├─────────────────────────────────────────────────────────────────────┤
│ OWNER REVIEW (Day 1, Sat 2026-09-26 CT)                                │
│   Owner opens /design-preview/ (logged into Vercel team) → compares   │
│   pairings A/B/C on hero + spec sheet → picks one → losing 2 pairings'│
│   font entries + /design-preview/ route group deleted post-decision   │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── pages/
│   └── design-preview/
│       ├── index.astro        # links to a/, b/, c/ — throwaway, deleted post-pick
│       ├── a.astro             # Hero + SpecSheet, Pairing A active
│       ├── b.astro             # same markup, Pairing B active
│       └── c.astro             # same markup, Pairing C active
├── components/
│   ├── Hero.astro              # band 1 markup only (light ground), receives no props yet (fixture copy)
│   ├── SpecSheet.astro         # one fixed sample (Shopify Ecommerce), fixture copy
│   └── BrandMark.astro         # renders the circuit-brain mark or wordmark per `ground` prop
├── styles/
│   ├── tokens.css              # :root — color, spacing (xs..5xl), type-scale clamp() formulas
│   ├── themes.css               # [data-theme="dark"|"light"] — token value overrides only
│   └── pairing-{a,b,c}.css      # per-pairing :root{--font-display/body/mono: var(--font-*)} mapping
└── assets/
    └── brand/                   # the 4 verified brand raster files (copied in, not re-derived)

astro.config.mjs                 # output: 'static' (default), adapter: vercel(), fonts: [ ×9 entries ]
```

### Pattern 1: One shared markup source, per-pairing CSS variable swap

**What:** `Hero.astro` and `SpecSheet.astro` are written once, referencing `var(--font-display)`, `var(--font-body)`, `var(--font-mono)`. Each of `a.astro`/`b.astro`/`c.astro` imports a different `pairing-{x}.css` that maps those three custom properties to that pairing's actual `--font-*` variables (the ones Astro's `<Font>` component generates).
**When to use:** exactly this phase's three-way comparison — guarantees the owner is judging identical markup/copy/spacing across all three routes, isolating the one variable (typeface) that's actually being decided.
**Example:**
```astro
---
// src/pages/design-preview/a.astro
import { Font } from 'astro:assets';
import Hero from '../../components/Hero.astro';
import SpecSheet from '../../components/SpecSheet.astro';
import '../../styles/pairing-a.css';
---
<html data-pairing="a">
  <head>
    <Font cssVariable="--font-display-a" preload />
    <Font cssVariable="--font-body-a" />
    <Font cssVariable="--font-mono-a" />
  </head>
  <body>
    <Hero />
    <SpecSheet />
  </body>
</html>
```
```css
/* src/styles/pairing-a.css */
:root {
  --font-display: var(--font-display-a);
  --font-body: var(--font-body-a);
  --font-mono: var(--font-mono-a);
}
```

### Pattern 2: Astro's native `fonts` config replaces manual subsetting entirely

**What:** every one of the nine font files (3 pairings × display/body/mono) is declared as one entry in `astro.config.mjs`'s `fonts` array, using `fontProviders.google()` where the family resolves, `fontProviders.fontsource()` as the fallback where it doesn't (see Pitfall 3), specifying exactly the one weight/style each role needs per `01-UI-SPEC.md`'s Font Pairings table.
**When to use:** for every font in this phase — this is the whole subsetting/self-hosting/fallback mechanism, not one option among several.
**Verified example (directly built and inspected in this session):**
```js
// astro.config.mjs — VERIFIED output shape from a real `astro build` in this session
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  fonts: [
    {
      name: 'Inter',                    // UI-SPEC Pairing A body
      cssVariable: '--font-body-a',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    // ... 8 more entries, one per (pairing × role)
  ],
});
```
Observed build output for the `Inter` entry above (exact, from `dist/index.html` in this session's test build):
```css
@font-face{font-family:Inter-c6a99181cf8b71d4;src:url("/_astro/fonts/233f952ab2955996.woff2") format("woff2");font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-weight:400;font-style:normal;}
@font-face{font-family:"Inter-c6a99181cf8b71d4 fallback: Arial";src:local("Arial");font-display:swap;font-weight:400;font-style:normal;size-adjust:107.1194%;ascent-override:90.4365%;descent-override:22.518%;line-gap-override:0%;}
:root{--font-body:Inter-c6a99181cf8b71d4,"Inter-c6a99181cf8b71d4 fallback: Arial",sans-serif;}
```
This single build artifact satisfies DSGN-04 in full: self-hosted (file lives under `dist/_astro/fonts/`), subset (the `unicode-range` covers Basic Latin + Latin-1 Supplement plus a handful of typographic punctuation glyphs — a superset of, not a gap in, UI-SPEC's "Latin + Latin-1 Supplement" requirement), one file for this entry (three entries × three pairings = 9 files total, ≤3/pairing), `font-display: swap`, and a metric-matched fallback with real computed `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` values — no Fontaine, no capsize, no `pyftsubset` invocation anywhere in this pipeline.

### Pattern 3: Vercel Deployment Protection — Standard Protection + Vercel Authentication, never Password Protection

**What:** in the Vercel project's **Settings → Deployment Protection**, set protection scope to **Standard Protection** (protects everything except the production domain — irrelevant here since this phase never touches production) and protection method to **Vercel Authentication**.
**When to use:** every preview deployment for this phase, per `01-CONTEXT.md`'s "preview deploys only... deployment-protected" requirement.
**Why not Password Protection:** `[VERIFIED: vercel.com/docs/deployment-protection, last_updated 2026-09-15]` — "Password Protection: Available on Pro for $20 per month per protected project." This is a real, recurring charge that violates the project's "no paid services beyond current subscriptions" constraint. Vercel Authentication is explicitly called out on the same page as **not** requiring a paid add-on.
**Belt-and-suspenders `noindex`:** Vercel's own preview deployments already return `X-Robots-Tag: noindex` automatically with zero configuration `[VERIFIED: vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines]` — this only stops turning off when a custom domain is manually attached to the branch, which this phase does not do. Still add `<meta name="robots" content="noindex">` in each preview page's `<head>` as cheap defense-in-depth (per `01-UI-SPEC.md`'s own routing note), since Deployment Protection blocks *people* without a login, while `noindex` blocks *search engines* — these are two different threats and both controls are needed together, not as alternatives.

### Anti-Patterns to Avoid

- **Running `npm create astro@latest .` directly in the worktree root:** the worktree is non-empty (existing `README.md`, `AGENTS.md`, `.gitignore`, `.planning/`, `.claude/`, `docs/`). Verified directly in this session: create-astro detects the non-empty directory and silently scaffolds into a new, randomly-named sibling subdirectory instead of `.` — no error, no visible warning in `--yes` mode, exit code 0. A plan step that doesn't account for this will "succeed" while leaving the actual worktree untouched.
- **Copying the scaffolded `AGENTS.md`/`README.md`/`CLAUDE.md` into the worktree during the merge step:** the official `minimal` template ships its own generic Astro-dev-workflow `AGENTS.md` (about `astro dev --background`) and a `CLAUDE.md → AGENTS.md` symlink — both verified present in this session's real (non-dry-run) scaffold. These must NOT overwrite this repo's actual `AGENTS.md` (repo invariants) and `CLAUDE.md` (points to it).
- **Assuming `fontProviders.google()` resolves every Google Fonts family by its display name:** directly falsified in this session for "Big Shoulders Display" (see Pitfall 3) — verify each of the nine font names against the actual provider before finalizing the font config, not just against Google Fonts' own website naming.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Font subsetting to Latin | A `pyftsubset` prep script | Astro's `fonts` config `subsets: ['latin']` per entry | Astro's Google-provider subset resolves to a `unicode-range` that already covers Basic Latin + Latin-1 Supplement (verified build output, Pattern 2 above) — a hand-rolled script duplicates work the framework already does correctly |
| Metric-matched fallback font generation | Fontaine/capsize invoked in a build step | Astro's built-in `optimizedFallbacks` (default `true`) | Directly verified: Astro computes real `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` values from the actual font's own metrics at build time, with no extra dependency or script |
| Font preload link management | Manually writing `<link rel="preload">` tags and guessing which file is the LCP font | `<Font cssVariable="…" preload />` on exactly the Display-role font (the LCP element) | The component generates the correct `as="font" type="font/woff2" crossorigin` attributes automatically, verified in this session's build output |
| Contrast ratio checking per page | A hand-rolled color-math script | `@axe-core/cli` (`npx axe <url> --tags wcag2a,wcag2aa`) | Deque's axe-core is the industry-standard accessibility engine (also what Lighthouse's own Accessibility category uses under the hood) — a hand-rolled checker will miss edge cases (e.g. text-over-graphics, focus-visible contrast) axe already covers |
| Preview-deployment access gating | A custom Vercel Edge Middleware auth check | Vercel's built-in Deployment Protection (Vercel Authentication method) | Zero code, zero maintenance, free on Pro, and already the platform's own recommended mechanism — a hand-rolled middleware gate is both more code and a worse security posture (one more thing to get wrong) |

**Key insight:** every "don't hand-roll" item above exists because Astro 7 and Vercel's platform absorbed exactly the mechanics `01-CONTEXT.md`/`01-UI-SPEC.md` scoped as "Claude's Discretion" (font tooling, fallback method) into first-class, zero-dependency features since this project's earlier stack research was written. The discretion should be exercised in favor of the built-in mechanism, not the manual pipeline that predates it.

## Common Pitfalls

### Pitfall 1: `npm create astro@latest .` does not scaffold into a non-empty directory — it silently redirects to a new sibling folder

**What goes wrong:** Running the scaffold command directly inside the phase-01 worktree (which already contains `README.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.planning/`, `.claude/`, `docs/`) does not populate the worktree. Instead, create-astro detects the directory is non-empty and creates a brand-new, randomly-named subdirectory (e.g. `./former-kelvin`) and scaffolds there instead — with `--yes` passed, this happens with **no error and exit code 0**, so a script that doesn't check afterward will believe it succeeded.
**Why it happens:** create-astro's non-empty-directory handling defaults to "make a new folder" rather than "ask to overwrite" or "merge," and `--yes` auto-accepts that default without surfacing it as a warning.
**How to avoid:** Scaffold into a temp directory (`cd /tmp && npm create astro@latest zinc-scaffold -- --yes --template minimal --install --no-git`), then copy only the generated `src/`, `public/`, `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `.vscode/` into the worktree, and hand-merge `.gitignore` (see Pitfall 2's sibling note).
**Warning signs:** after running create-astro "in place," `ls` the worktree root and confirm `src/` and `astro.config.mjs` actually exist there, not in a new subdirectory alongside it.
**Verification performed:** directly executed in this session, both with and without `--dry-run`, against a directory seeded with the same file set the real worktree has (`README.md`, `.gitignore`, `.planning/`, `AGENTS.md`, `CLAUDE.md`). Reproduced consistently.

### Pitfall 2: The official `minimal` template ships its own `AGENTS.md`/`README.md`/`CLAUDE.md` that collide with this repo's governance files

**What goes wrong:** A real (non-dry-run) scaffold in this session produced `AGENTS.md` (generic Astro dev-workflow content — `astro dev --background`, doc links), `README.md`, and `CLAUDE.md` as a **symlink to `AGENTS.md`**. This repo's own `AGENTS.md` (repo invariants: branching, copy voice, performance gates) and `CLAUDE.md` (a real file: "Read AGENTS.md first") would be silently destroyed by a blind file copy during the temp-directory merge step from Pitfall 1's mitigation.
**Why it happens:** Astro's minimal template assumes it's scaffolding a brand-new project where no such files exist yet.
**How to avoid:** When merging the temp scaffold into the worktree, explicitly exclude `AGENTS.md`, `README.md`, and `CLAUDE.md` from the copy. Everything else (`src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`, `.vscode/`) is safe to copy directly since the worktree has no prior versions of those.
**Warning signs:** `git diff AGENTS.md CLAUDE.md README.md` showing unexpected large diffs, or `CLAUDE.md` becoming a symlink instead of the plain-text file `Read AGENTS.md first`.
**Verification performed:** directly executed in this session (`npm create astro@latest . -- --yes --template minimal --install --no-git` into an empty scratch dir), files inspected with `ls -la` and `head`.

### Pitfall 3: `fontProviders.google()` cannot resolve "Big Shoulders Display" by name — use `fontProviders.fontsource()` for that family

**What goes wrong:** Configuring `{ name: 'Big Shoulders Display', provider: fontProviders.google(), ... }` (Pairing A's display face, per `01-UI-SPEC.md`) produces a build-time warning — `No data found for font family Big Shoulders Display... Did you mean Big Shoulders Inline?` — and zero files are downloaded for that entry, silently breaking Pairing A's rendering (the `<Font>` component then throws `FontFamilyNotFound` at build).
**Why it happens:** Astro's built-in Google Fonts provider (backed by the `unifont` package's bundled metadata) does not have an entry for "Big Shoulders Display" under that exact name, despite it being a real, distinct family on Google Fonts' own site and confirmed present in `google/fonts`' METADATA.pb by `01-UI-SPEC.md`'s own live verification. This is a gap in Astro's provider data, not a naming mistake in the UI-SPEC.
**How to avoid:** Use `fontProviders.fontsource()` instead of `fontProviders.google()` for this specific family — directly verified in this session to resolve "Big Shoulders Display" correctly and download 1 file. As a general rule for all nine fonts: attempt `fontProviders.google()` first (it worked without issue for `Inter` and the base `Big Shoulders` family in this session's tests), and fall back to `fontProviders.fontsource()` per-family wherever `astro build` logs `No data found for font family …`.
**Warning signs:** `[assets] No data found for font family …` and `[assets] Copying fonts (0 files)…` in build output (as opposed to `(1 file)` for a successful resolution); a downstream `FontFamilyNotFound` error at render time.
**Verification performed:** directly executed `astro build` in this session against `Big Shoulders Display` under `fontProviders.google()` (failed, 3 case variations tried, all failed identically) and `fontProviders.fontsource()` (succeeded, 1 file downloaded). The other 8 fonts in the three pairings were not individually build-tested in this session — the plan's Wave 0 should run this same resolve-and-log check against all nine before finalizing the font config, budgeting for a provider swap on any that fail under `google()`.

### Pitfall 4: Password Protection is a $20/month/project paid add-on on Pro — Vercel Authentication is the free, correct choice

**What goes wrong:** A plan or executor that reaches for "Password Protection" (the more commonly-documented/tutorial'd Vercel protection method) because it's simpler to explain to a non-technical reviewer will incur a real recurring charge that violates this project's explicit "no paid services beyond current subscriptions" constraint.
**Why it happens:** Password Protection is the more prominently-tutorialized method online (simple shared password, no login required) and its cost isn't obvious until checking Vercel's pricing docs specifically.
**How to avoid:** Configure **Vercel Authentication** (free on all plans including Pro) with **Standard Protection** scope. The owner already has access — they're a member of the `zincdigitalofmiamis-projects` Vercel team (per `01-CONTEXT.md`) — so Vercel Authentication requires no new credential distribution, just being logged into the existing Vercel account.
**Warning signs:** any mention of "Password Protection" or a `$20`/mo line item in the Vercel billing dashboard for this project.
**Verification performed:** `[VERIFIED: vercel.com/docs/deployment-protection, last_updated 2026-09-15]` — fetched live in this session; exact pricing table confirms Pro = $20/mo/project for Password Protection, and explicitly states "Vercel Authentication for All Deployments... do[es] not require a paid add-on."

### Pitfall 5: Font-swap CLS is only zero if the fallback is actually wired to `<Font preload />` — a missing `preload` on the Display role reintroduces LCP risk

**What goes wrong:** `01-UI-SPEC.md`'s Display role (the hero core line, `clamp(3.5rem, 10vw + 1rem, 12.5rem)`) is very likely the page's LCP element. If the plan preloads all three fonts (Display/Body/Mono) "to be safe," or preloads none, the Display font either competes for bandwidth priority with fonts that aren't on the critical path, or arrives late and the CLS-0 gate fails on a cold/throttled load (this is `.planning/research/PITFALLS.md`'s own Pitfall #6, still applicable here).
**Why it happens:** it's easy to either over-preload (every font gets the `preload` prop "for consistency") or under-preload (nobody adds it at all since the automatic fallback already prevents *visible* reflow).
**How to avoid:** add `preload` to exactly the Display-role `<Font>` per pairing route; leave Body and Mono unpreloaded (they load in normal priority, which is fine since they're not the LCP element).
**Warning signs:** Lighthouse flagging "preload key requests" with more than one font preloaded, or LCP timing regressing versus a single-preload baseline.
**Phase to address:** this phase, at the same time the `pairing-{a,b,c}.astro` routes are built — not deferred to QA.

## Code Examples

### Complete `astro.config.mjs` for this phase (adapter + all pairing-A font entries; B and C follow the identical shape)

```js
// Source: this session's own verified `astro build` output (Pattern 2), plus Context7 /withastro/docs
// (font-provider-reference.mdx, configuration-reference.mdx, fonts.mdx — all Since v6.0.0, stable in 7.3.5)
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static', // default; stated explicitly for clarity, matches project-level STACK.md decision
  adapter: vercel(),
  fonts: [
    // Pairing A
    { name: 'Big Shoulders Display', cssVariable: '--font-display-a', provider: fontProviders.fontsource(), weights: [800], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] }, // google() fails to resolve this name — see Pitfall 3
    { name: 'Inter',                 cssVariable: '--font-body-a',    provider: fontProviders.google(),     weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['sans-serif'] },
    { name: 'JetBrains Mono',        cssVariable: '--font-mono-a',    provider: fontProviders.google(),     weights: [400], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
    // Pairing B, C: same shape — verify each family's provider resolution during Wave 0 per Pitfall 3
    // before committing to google() vs fontsource() for Barlow Condensed, Public Sans, IBM Plex Mono,
    // Oswald, IBM Plex Sans, Space Mono.
  ],
});
```

### `<Font>` usage with correct preload targeting

```astro
---
// Source: this session's verified test build + Context7 /withastro/docs (astro-assets.mdx)
import { Font } from 'astro:assets';
---
<head>
  <Font cssVariable="--font-display-a" preload />
  <Font cssVariable="--font-body-a" />
  <Font cssVariable="--font-mono-a" />
</head>
```

### `astro check` catching a `cssVariable` typo (verified this session)

```
$ npx astro check
src/pages/index.astro:6:11 - error ts(2322):
  Type '"--font-body"' is not assignable to type '"--font-display"'.
    <Font cssVariable="--font-body" preload />
              ~~~~~~~~~~~
Result (3 files): 1 error, 0 warnings, 0 hints
```
This is a real compile-time safety net for DSGN-04/DSGN-01 — a mismatched pairing route (e.g. route `c.astro` accidentally referencing Pairing A's `cssVariable`) fails `astro check` rather than silently rendering the wrong font.

## State of the Art

| Old Approach (STACK.md, written 2026-09-25 earlier same day) | Current Approach (this session) | When Changed | Impact |
|---|---|---|---|
| `pyftsubset` (Python `fonttools`) run as a manual prep script per font | Astro's native `fonts` config, `subsets: ['latin']` per entry | Fonts API stabilized in Astro `6.0.0` (`Since v6.0.0` on every relevant config key, confirmed via Context7); experimental flags for it were removed entirely in Astro `7.0` | Zero extra dependency, zero prep script, output verified equivalent (unicode-range covers the required Latin + Latin-1 Supplement range plus typographic punctuation) |
| Fontaine/capsize computing `size-adjust`/`ascent-override`/etc. by hand in a build step | `optimizedFallbacks: true` (Astro's default) generates the identical category of values automatically | Same v6.0.0 stabilization | One fewer tool in the pipeline; values come from the framework's own metric computation, directly observed in this session's build output |

**Deprecated/outdated:** the `experimental.fonts` flag pattern some older Astro 6.x-era guides may reference — removed as a flag in Astro 7.0 per Context7's upgrade-to-v7 guide (it's now just the stable, default `fonts` config key with no flag needed).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|-----------------|
| A1 | The other 8 fonts (beyond Inter, Big Shoulders, Big Shoulders Display) across Pairings A/B/C resolve correctly under `fontProviders.google()` or `.fontsource()` without further naming surprises | Pattern 2, Pitfall 3 | If any of Barlow Condensed/Public Sans/IBM Plex Mono/Oswald/IBM Plex Sans/Space Mono/JetBrains Mono also fail to resolve by name, the affected pairing's build fails at `astro build` until the provider is swapped — low cost to fix (same fix as Pitfall 3) but must be caught in Wave 0, not discovered mid-build |
| A2 | Static-weight-only families (Barlow Condensed Black 900, IBM Plex Mono Regular 400, Space Mono Regular 400) can be requested from either provider with a single `weights: [n]` entry the same way variable families are | Standard Stack, Pattern 2 | If a provider requires a different config shape for non-variable families, the font entry needs a one-line adjustment (e.g. dropping the weight array in favor of provider-specific static-file addressing) — not a structural risk, just an implementation detail to confirm per-family |
| A3 | The Vercel team `zincdigitalofmiamis-projects` already has the owner as a member with standing access (so Vercel Authentication needs no new invite) | Pattern 3, Pitfall 4 | If the owner isn't already a team member, they'd be blocked from the Day 1 review until invited — low-cost, same-day fix, but worth confirming before Day 1 rather than discovering it live |

**If this table is empty:** not applicable — see entries above. All three are low-risk/same-day-fixable if wrong, and none block the phase's architecture.

## Open Questions (RESOLVED)

1. **Do Barlow Condensed, IBM Plex Mono, Oswald, Public Sans, IBM Plex Sans, and Space Mono all resolve cleanly under one of Astro's two font providers?**
   - What we know: `Inter`, `Big Shoulders` (base family), and `Big Shoulders Display` (via `fontsource()`) all resolve correctly; `Big Shoulders Display` specifically fails under `google()`.
   - What's unclear: whether any of the remaining six fonts have a similar naming gap under either provider.
   - **RESOLVED (2026-09-25 CT, planner measurement):** all nine families resolve — Big Shoulders Display via `fontsource()`, the other eight via `google()`; test build emitted 9 woff2 files and 0 KB JS. Plan 01-03 Task 2 keeps the per-family provider fallback as a guard.
   - Recommendation: Wave 0 of the plan should include a fast per-family resolution check (a throwaway `astro build` with all nine entries, reading the warning log) before writing the three pairing routes' real markup — this converts an open question into a five-minute verification rather than a mid-build surprise.

2. **Is the owner already a member of the `zincdigitalofmiamis-projects` Vercel team with login access, or does Vercel Authentication require a fresh invite?**
   - What we know: `01-CONTEXT.md` states the team is "already paid" and used for hosting.
   - What's unclear: team membership roster wasn't checked in this session (no Vercel MCP/API credential scoped for this task).
   - **RESOLVED (2026-09-25 CT, Vercel API `list_team_members`):** the owner (`zincmiami@gmail.com`, username `zincdigitalofmiami`) is the team OWNER, confirmed member; no invite needed for Vercel Authentication.
   - Recommendation: confirm before Day 1 (Sat 2026-09-26 CT) — if an invite is needed, send it a day ahead so it isn't a same-day blocker on the review itself.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|--------------|-----------|---------|----------|
| Node.js | Astro build + Vercel Function runtime | ✓ | v24.21.0 `[VERIFIED: node --version, this session]` | — |
| npm | package install, `create-astro`, `astro add` | ✓ | bundled with Node 24 | — |
| Vercel CLI | local preview deploy testing (optional; Vercel's own CI handles the real preview deploy on push) | ✓ | 53.1.1 `[VERIFIED: vercel --version, this session]` | Not required for the plan's critical path — Vercel's git integration deploys previews automatically on push to `gsd/phase-01-design-system-font-pick` |
| Python 3 | only needed if a Pitfall 3 fallback requires manually pre-subsetting a font for `fontProviders.local()` | ✓ | 3.12.8 `[VERIFIED: python3 --version, this session]` | Not expected to be needed given Astro's native Fonts API covers all nine fonts via `google()`/`fontsource()` per current findings |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — all tooling needed for this phase is already present on the executing machine.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | none (no unit-test framework exists yet or is needed — this phase ships zero application logic, only static markup/CSS and build-time font config) |
| Config file | none — see Wave 0 gaps below |
| Quick run command | `npx astro build && npx astro check` |
| Full suite command | `npx astro build && npx astro check && npx lhci autorun --collect.url=<preview-url>/design-preview/a/ --collect.url=<preview-url>/design-preview/b/ --collect.url=<preview-url>/design-preview/c/` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|---------------------|--------------|
| DSGN-01 | Three pairings render distinctly on identical hero + spec-sheet markup; owner can compare them | manual (UAT) + smoke | `astro build` succeeds for all 3 routes; owner review on Day 1 is the actual gate | ❌ Wave 0 — routes don't exist yet |
| DSGN-02 | Every page uses the one locked token set (colors) | automated | `npx axe <preview-url>/design-preview/a/ --tags wcag2a,wcag2aa` (contrast) + `grep` `tokens.css` for the five locked hex values | ❌ Wave 0 — `tokens.css` doesn't exist yet |
| DSGN-03 | Each band sets `data-theme` independent of `prefers-color-scheme` | automated | a small Node/Playwright script asserting every `<section>` has a `data-theme` attribute, and `grep -r "prefers-color-scheme"` returns no match tied to `--bg`/`--fg` tokens | ❌ Wave 0 — no script exists yet; simplest to add as one line in the build-verification step, not a full Playwright suite |
| DSGN-04 | ≤3 self-hosted font files/pairing, metric-matched fallback, CLS 0 | automated | `find dist/_astro/fonts -name '*.woff2' \| wc -l` (expect ≤9 total for 3 pairings) + `npx lhci autorun` asserting `cumulative-layout-shift` == 0 per preview route | ❌ Wave 0 — no `lighthouserc.json` exists yet |
| DSGN-05 | Brand mark renders crisply on both grounds | manual + automated | Lighthouse "Best Practices"/image-audit categories at 100, plus manual visual check at 320/768/1440px per UI-SPEC's stated ceiling (mark ≤1000px, wordmark ≤446px on-screen) | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx astro build && npx astro check` (fast, catches font-resolution failures and `cssVariable` typos immediately)
- **Per wave merge:** full `lhci autorun` against the actual deployed preview URL (not `localhost` — the CLS-0 gate must be measured on the real cold/throttled deployed artifact per `.planning/research/PITFALLS.md` Pitfall #6's own warning)
- **Phase gate:** full suite green + owner's Day 1 pick recorded before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `lighthouserc.json` — budgets: CLS == 0, Performance/SEO/Accessibility/Best-Practices == 100, mobile form factor, targeting the three `/design-preview/{a,b,c}/` preview URLs
- [ ] A one-file `scripts/check-bands.mjs` (or equivalent) asserting every rendered `<section>` carries `data-theme` — satisfies DSGN-03's automated check without pulling in a full Playwright/E2E framework for a single-page static check
- [ ] Framework install: none required beyond what's already listed in Installation above (`@lhci/cli`, `@axe-core/cli` cover this phase's entire automated-check surface)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|----------------|---------|---------------------|
| V2 Authentication | No | This phase has no application-level login; the only "authentication" surface is Vercel's platform-level Deployment Protection (Vercel Authentication method), which is infrastructure config, not app code |
| V3 Session Management | No | No sessions/cookies are created by this phase's static routes |
| V4 Access Control | Partial | Access to the preview *deployment* is Vercel's Deployment Protection (Pattern 3) — there is no in-app authorization logic to review since the phase ships zero dynamic routes |
| V5 Input Validation | No | No form, no user input, no query-param handling in this phase's two static surfaces |
| V6 Cryptography | No | No secrets, tokens, or crypto operations in this phase |

### Known Threat Patterns for this phase's stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|------------------------|
| Unfinished/draft copy (marked `[DRAFT]`) or unreleased visual direction leaking via a public preview URL | Information Disclosure | Vercel Authentication (Standard Protection scope) gates the deployment to logged-in team members; `X-Robots-Tag: noindex` (Vercel default) + `<meta name="robots" content="noindex">` prevent search-engine indexing as a second, independent layer against a different threat (indexing vs. direct access) |
| A leaked/shared preview URL bypassing Deployment Protection via a Protection Bypass token accidentally committed to the repo | Elevation of Privilege | Do not generate or commit a Protection Bypass for Automation secret for this phase — it isn't needed since there's no CI/CD step that needs to fetch the protected preview programmatically in Phase 1 |

## Sources

### Primary (HIGH confidence, VERIFIED this session)
- Context7 `/withastro/docs` — `font-provider-reference.mdx`, `fonts.mdx`, `configuration-reference.mdx` (`fonts`, `font.fallbacks`, `font.optimizedFallbacks` all `Since v6.0.0`), `astro-assets.mdx` (`<Font>` component, `preload` prop), `cli-reference.mdx` (`astro check` flags), `upgrade-to/v7.mdx` (experimental font flags removed), `integrations-guide/vercel.mdx` (`astro add vercel` behavior)
- Direct local execution in this session: `npm create astro@latest` (empty dir, non-empty dir, `--dry-run` and real runs), `npx astro add vercel`, `npx astro build` with `fontProviders.google()` and `.fontsource()` against `Inter`, `Big Shoulders`, and `Big Shoulders Display`, `npx astro check` against a deliberately-mismatched `cssVariable`, `npx astro info`
- `npm view <pkg> version` against the live npm registry (this session) for `astro`, `@astrojs/vercel`, `@astrojs/check`, `@lhci/cli`, `@axe-core/cli`, `sharp`, `lighthouse`
- `gsd_run query package-legitimacy check` (this session) for the same package set
- [vercel.com/docs/deployment-protection](https://vercel.com/docs/deployment-protection) (fetched live, `last_updated: 2026-09-15`) — protection methods, exact Password Protection pricing table
- [vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines) — default `X-Robots-Tag: noindex` behavior and its one exception
- [github.com/withastro/astro/blob/main/packages/create-astro/README.md](https://raw.githubusercontent.com/withastro/astro/main/packages/create-astro/README.md) — full CLI flag list, fetched live this session

### Secondary (MEDIUM confidence)
- [github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md) and community sources — Lighthouse CLI flags (`--only-categories`, `--form-factor`, mobile-is-default behavior); community-sourced, cross-checked but not a single canonical flags page
- WebSearch cross-checked, 2+ sources — Google Fonts OFL self-hosting norms (already independently verified by `01-UI-SPEC.md`'s own live METADATA.pb check, treated here as confirming, not primary)
- WebSearch — `@axe-core/cli` command syntax (`--tags wcag2a,wcag2aa`, `--rules color-contrast`)

### Tertiary (project-internal, treated as authoritative per canonical_refs)
- `.planning/phases/01-design-system-font-pick/01-CONTEXT.md`, `01-UI-SPEC.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, `.planning/research/{STACK,ARCHITECTURE,PITFALLS,SUMMARY}.md`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions reconfirmed live against npm registry, zero drift from project-level STACK.md
- Fonts API mechanism: HIGH — verified via both official docs (Context7) and direct local `astro build` execution producing the exact expected CSS output
- Font family name resolution (Pitfall 3): MEDIUM — one specific failure (Big Shoulders Display) directly reproduced and fixed; the other 8 families were not individually build-tested in this session (flagged as Open Question 1 / Assumption A1 for Wave 0 to close)
- Vercel Deployment Protection / pricing: HIGH — official, dated Vercel docs page fetched live this session
- create-astro non-empty-directory and template-file-collision behavior: HIGH — directly reproduced by execution, not inferred from docs (docs were silent on this exact scenario)
- Validation/Lighthouse CLI specifics: MEDIUM — community-sourced flag syntax, cross-checked across multiple results but no single canonical current-version flags page was fetched

**Research date:** 2026-09-25 (CT)
**Valid until:** 30 days for the Vercel pricing/protection findings (pricing pages change); 7 days for the specific font-family-resolution findings (Astro's bundled provider metadata updates with each release, and `astro`/`@astrojs/vercel` are both shipping near-daily point releases per this session's package-legitimacy check) — re-verify the font provider resolution for all nine families at execution time if more than a few days elapse before this phase is executed.
