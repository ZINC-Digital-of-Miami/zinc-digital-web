# Phase 01: Design System & Font Pick — Pattern Map

**Mapped:** 2026-09-25 (CT)
**Scope:** Complete clickable sitemap mockup, Pairing A first. Preserve the completed scaffold. Proposed paths below are planning assignments, not claims that those files exist.
**Source boundary:** Current `AGENTS.md`, updated `01-CONTEXT.md`, current `src/`, `package.json`, and `astro.config.mjs`. No broader research or runtime verification performed. No project skill directories exist at `.codex/skills` or `.agents/skills` in this checkout.

## File Classification

| New/Modified File or Family | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/layouts/PreviewLayout.astro`; optional shared site layout | component | transform | `src/layouts/PreviewLayout.astro` | exact |
| `src/pages/design-preview/a.astro`; homepage route | route | request-response | `src/pages/design-preview/a.astro` | exact |
| `src/components/MockupBands.astro`; remaining eight homepage bands | component | transform | `src/components/bands/Hero.astro` | exact |
| Services index and 11 service routes, proposed `src/pages/services/index.astro`, `src/pages/services/[slug].astro` | route | request-response | `src/pages/design-preview/a.astro` | role-match; no dynamic-route analog |
| Work index and two case studies, proposed `src/pages/work/index.astro`, `src/pages/work/[slug].astro` | route | request-response | `src/pages/design-preview/a.astro` | role-match; no dynamic-route analog |
| About, privacy, terms and 404 routes | route | request-response | `src/pages/design-preview/a.astro` | role-match |
| Contact and demo-confirmation routes | route | request-response | `src/pages/design-preview/a.astro` | role-match; no form analog |
| Blog index and article routes | route | request-response | `src/pages/design-preview/a.astro` | role-match; no article/filter analog |
| Proposed reusable service, case-study and article templates | component | transform | `src/components/bands/Hero.astro` | role-match |
| Proposed site navigation/footer components | component | transform | `src/layouts/PreviewLayout.astro` | partial; only preview header exists |
| Proposed `src/data/` sitemap, service, work and article fixtures | model | transform | None | no analog |
| Contact validation/preselection/demo-submit and blog filter behavior | utility | event-driven | None | no analog |
| `src/styles/tokens.css`, `themes.css`, `pairings.css`, `base.css` | config | transform | same tracked files | exact |
| `astro.config.mjs` font/pairing and root-route setup | config | transform | same tracked file | exact |
| Approved raster assets, proposed under `public/` or `src/assets/` | utility | file-I/O | None | no tracked asset analog found |
| Local screenshots, route-crawl and style/image evidence artifacts | test | batch | None | no authored source analog found |
| Pairing selector and later B/C preview routes | route | request-response | `src/pages/design-preview/a.astro` | role-match; current layout accepts only A |

Use the approved sitemap for exact slugs and article inventory. Do not derive those facts from the candidate family names above. Every destination must resolve locally, including both case studies and all 11 service pages; templates alone do not satisfy coverage.

## Pattern Assignments

### Shared layout and all route families

**Analog:** `src/layouts/PreviewLayout.astro`, lines 1–13.

```astro
---
import { Font } from 'astro:assets';
import '../styles/tokens.css';
import '../styles/themes.css';
import '../styles/base.css';
import '../styles/pairings.css';

interface Props {
  pairing: 'a';
  title: string;
}

const { pairing, title } = Astro.props;
```

Copy the relative imports, typed props, and shared CSS ownership. The existing page `src/pages/design-preview/a.astro` is the nearest tracked route shell; it is not an example of a content collection or parameterized route.

**Document/preview pattern:** layout lines 16–28 and 40–42.

```astro
<html lang="en" data-pairing={pairing}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content="Draft design preview for the ZINC website. Not public." />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" href="/favicon.png" type="image/png" />
    {pairing === 'a' && (
      <>
        <Font cssVariable="--font-display-a" preload />
        <Font cssVariable="--font-body-a" />
        <Font cssVariable="--font-mono-a" />
```

```astro
<main id="main">
  <slot />
</main>
```

The source has a preview header with an “All pairings” link (line 37), not a complete site navigation pattern. Build sitemap navigation deliberately. The favicon reference is not evidence that a tracked favicon exists. `noindex` is a preview indexing directive, not authentication or access protection.

### Homepage bands and reusable content templates

**Analog:** `src/components/bands/Hero.astro`, lines 2–6 and 15–26.

```astro
interface Props {
  supporting?: string;
  ctaHref?: string;
  draft?: boolean;
}
```

```astro
<section data-theme="light" class="band band--hero" aria-labelledby="hero-title">
  <div class="band__inner">
    <h1 id="hero-title" class="t-display">
      <span class="hero-line">Other agencies deliver <span class="mark-strike">the&nbsp;scope</span>.</span>
      <span class="hero-line">ZINC delivers <span class="mark-hit">the&nbsp;business</span>.</span>
    </h1>
    <p class="t-body muted hero-supporting">
      <span>{supporting}</span>
      {draft && <span class="draft-tag">[DRAFT]</span>}
    </p>
    <div class="hero-actions">
      <a class="button" href={ctaHref}>Start an Inquiry</a>
```

Copy semantic section markup, named theme, shared typography classes and explicit draft marking. Use unique IDs and appropriate heading levels in repeated bands. The existing supporting-copy default is not approved copy: updated context requires the rejected line to remain a draft slot. Service/case-study/article templates need their own typed content contracts; Hero supplies a rendering convention only.

The existing `src/components/MockupBands.astro` is only five lines:

```astro
---
import Hero from './bands/Hero.astro';
---

<Hero />
```

Extend that composition to all nine homepage bands. It does not establish that the remaining site has been implemented.

### CSS, themes and pairing extension

**Analog:** `src/styles/themes.css`, lines 8–28.

```css
[data-theme="dark"] {
  --bg: var(--color-near-black);
  --fg: var(--color-snow);
  --muted: var(--color-gray-on-dark);
  --accent: var(--color-magenta);
  --accent-text: var(--color-magenta);
  background-color: var(--bg);
  color: var(--fg);
  color-scheme: dark;
}

[data-theme="light"] {
  --bg: var(--color-snow);
  --fg: var(--color-near-black);
  --muted: var(--color-gray-on-light);
  --accent: var(--color-teal);
  --accent-text: var(--color-teal-text);
  background-color: var(--bg);
  color: var(--fg);
  color-scheme: light;
}
```

**Token source:** `src/styles/tokens.css`, lines 25–31.

```css
--touch-min: 44px;

/* Type (UI-SPEC Typography, exact formulas) */
--text-display: clamp(3.5rem, 10vw + 1rem, 12.5rem);
--text-heading: clamp(1.75rem, 2vw + 1.25rem, 2.75rem);
--text-body: clamp(1rem, 0.3vw + 0.94rem, 1.125rem);
--text-label: 0.875rem;
```

**Pairing source:** `src/styles/pairings.css`, lines 5–10.

```css
[data-pairing="a"] {
  --font-display: var(--font-display-a);
  --font-body: var(--font-body-a);
  --font-mono: var(--font-mono-a);
  --weight-heavy: 800;
}
```

Keep color literals centralized in tokens and band colors in the semantic theme mapping. Extend pairing variables and layout props together only after the complete A site is ready. Current `astro.config.mjs` registers A fonts through Astro's font providers and redirects `/` to `/design-preview/a/`; choose the complete mockup route strategy explicitly so root and every internal link agree. Current dependencies contain Astro/Vercel and verification tooling, with no UI framework or animation library.

## Shared Patterns

- **Imports and rendering:** relative `.astro` imports; typed `Astro.props`; layout slot; server-rendered static markup.
- **Draft and receipt status:** preserve visible draft labels; add explicit unconfirmed receipt/photo/legal markers as required by context. Existing markup shows only the draft convention.
- **Theme and type:** inherit semantic variables from explicit `data-theme`, and font variables from document `data-pairing`.
- **Authentication/error handling:** no applicable auth middleware, form validation, submission handling or shared error wrapper exists in the inspected scaffold. Do not invent a source convention. Mockup submission must be local demo behavior with no mail or live inquiry collection.
- **Testing:** scripts currently provide `build` and `check`; packages include Axe and Lighthouse tooling. Package presence does not prove template audits, screenshots, crawl coverage, CLS, or performance results. Plan those concrete artifacts for every template at 1440px and 375px.

## No Analog Found

| Family | Missing pattern | Planner consequence |
|---|---|---|
| Structured content/data and static parameterized routes | No content model, collection, fixtures or `getStaticPaths` example in current src | Define the approved sitemap inventory and typed records explicitly |
| Contact and blog interactions | No event handler, preselection, validation, filter or demo-success pattern | Specify small local behavior and prove complete states without sending data |
| Asset pipeline | No tracked public assets appeared in the scoped tracked-file query | Specify approved provenance, dimensions and raster display caps; do not infer asset existence from URLs |
| Evidence artifacts | No authored local verification harness in inspected src | Define output paths, required captures, crawl and computed-style assertions in plans |

## Metadata

**Tracked-source gate:** `git ls-files -- src public package.json astro.config.mjs .codex/skills .agents/skills` confirmed every named source analog above is tracked. No runtime/plugin mirror paths are used.
**Search scope:** Eight authored files under `src/`, plus package and Astro configuration; 10 source/config files read. Five principal pattern anchors: preview layout, preview route, Hero, theme mapping, and token set; direct composition and pairing snippets supplement them.
**Limits:** This is a source pattern map, not a runtime audit or a full design-authority review. Exact sitemap slugs, approved source assets and detailed design contracts remain the planner's upstream inputs. No source code, Git state, providers or runtime were changed.
