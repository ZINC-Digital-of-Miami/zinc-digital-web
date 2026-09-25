# Architecture Research

**Domain:** Astro static-first marketing site on Vercel (content collections, token-based CSS, scroll-driven SVG signature component, one serverless form endpoint, WordPress migration)
**Researched:** 2026-09-25 (CT)
**Confidence:** HIGH — verified against current Astro docs (Context7 `/withastro/docs`) for content collections (content layer API, `glob()` loader, `reference()`), the Vercel adapter (`output: 'static'` vs `'server'`, per-route `prerender`, serverless vs static entrypoints), `redirects` config, and `<ClientRouter />` view transitions. MEDIUM on the Google Workspace send path and rate-limit store — those are stack-level choices, not doc-verifiable architecture, and are flagged as open decisions below.

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│  BUILD TIME (Vercel build, static output)                             │
│  ┌───────────────┐   ┌────────────────────┐   ┌────────────────────┐ │
│  │ content.config │→ │ src/content/**      │→ │ getCollection() /   │ │
│  │  .ts (schemas) │   │ (md/mdx, git)       │   │ getEntry() in pages│ │
│  └───────────────┘   └────────────────────┘   └─────────┬──────────┘ │
│                                                            ↓           │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐│
│  │ layouts/   │← │ components/ │← │ lib/seo/     │← │ lib/loop-      ││
│  │ (Base/     │  │ bands, Loop,│  │ jsonld.ts,   │  │ layers.ts      ││
│  │ Service/   │  │ TeamGrid,   │  │ meta.ts      │  │ (Build/Demand/ ││
│  │ Case/Post) │  │ DeviceFrame │  │              │  │ Intelligence)  ││
│  └────────────┘  └─────────────┘  └──────────────┘  └───────────────┘│
│         ↓                                                             │
│  Static HTML/CSS + prerendered og/*.png + prerendered llms.txt        │
│  + Vercel-level 301 redirects (from lib/redirects.ts)                 │
├───────────────────────────────────────────────────────────────────────┤
│  RUNTIME (Vercel, on-demand — the only two non-static routes)         │
│  ┌────────────────────────┐        ┌───────────────────────────────┐ │
│  │ /api/contact (Node fn) │        │ /api/gone (Node fn, optional)  │ │
│  │ validate → Turnstile   │        │ matches lib/redirects.ts 410   │ │
│  │ verify → Workspace send│        │ list → 410 response            │ │
│  └────────────────────────┘        └───────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────┤
│  CLIENT (browser, ≤15 KB gzip JS total)                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐│
│  │ team-shuffle.ts    │  │ contact-form.ts   │  │ CSS motion layer   ││
│  │ (Fisher-Yates +    │  │ (searchParams     │  │ animation-timeline:││
│  │ IntersectionObserv)│  │ preselect, fetch  │  │ scroll()/view() +  ││
│  │                    │  │ submit, Turnstile │  │ reduced-motion     ││
│  └────────────────────┘  └───────────────────┘  └────────────────────┘│
└───────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|-------------------------|
| `content.config.ts` | Type-safe schema per collection; single source of truth for what a service/case/team/post/client *is* | Astro content layer API, `defineCollection({ loader: glob(...), schema: z.object(...) })` per collection, `reference()` for cross-collection links |
| Pages (`src/pages/**`) | Own data fetching (`getCollection`/`getEntry`/`getStaticPaths`); decide what's prerendered vs on-demand; pass typed props down | `.astro` files; `export const prerender = false` only on `api/contact.ts` and (if used) `api/gone.ts` |
| Layouts | Shared document shell + per-template SEO wiring (title/meta/JSON-LD) | `BaseLayout` → `ServiceLayout`/`CaseLayout`/`PostLayout` extend it |
| Band components | Pure presentational units, one per homepage section; receive data as props, never self-fetch collections | `.astro` files under `components/bands/`, each root element is `<section data-theme="dark\|light">` |
| `Loop.astro` | The signature SVG; renders at `size="full"` (band 3) or `size="mini"` (case bands 4–5, service pages) with an optional `highlight` prop | Single component, one SVG source, CSS custom properties driven by scroll-timeline; zero JS |
| `lib/loop-layers.ts` | Static map of Build/Demand/Intelligence → service slugs | Plain TS object; imported by `Loop`-embedding pages, nav, and service mini-loop highlight logic |
| `lib/seo/jsonld.ts` | Pure generator functions per schema.org type | `organization()`, `localBusiness()`, `service(entry)`, `article(entry)`, `faqPage(qa[])`, `breadcrumbList(items[])` — each returns a plain object, serialized once in the layout |
| `lib/redirects.ts` | Single typed source for every old→new URL and the 410 list | Exported arrays, imported by `astro.config.mjs` (301s), `api/gone.ts` (410s), and `scripts/check-redirects.mjs` (test) |
| `api/contact.ts` | The one serverless function: validate, verify Turnstile, send mail, respond | Node runtime (not edge — mail sending needs Node APIs), `prerender = false`, handles both `fetch()`-JSON and native form-POST fallback |
| Client scripts | Minimal, budgeted, progressive-enhancement only | Two files: team shuffle, contact form enhancement; no framework, no bundler-added runtime beyond Astro's own |

## Recommended Project Structure

```
src/
├── content.config.ts            # defineCollection × 5: services, cases, team, posts, clients
├── content/
│   ├── services/*.mdx           # 11 files — id (frontmatter slug) + layer field
│   ├── cases/*.mdx              # once-upon-a-book-club.mdx, us-oil-solutions.mdx
│   ├── team/*.md                # 7 files
│   ├── posts/*.md               # 18 at launch
│   └── clients/*.json           # logo wall entries: name, logoAsset, url, caseRef?
├── layouts/
│   ├── BaseLayout.astro         # <html>, <ClientRouter/>, Meta slot, skip-link, global CSS
│   ├── ServiceLayout.astro      # + Service/FAQPage/BreadcrumbList JSON-LD, mini loop
│   ├── CaseLayout.astro         # + BreadcrumbList, device-framed screenshots
│   └── PostLayout.astro         # + Article JSON-LD, author card
├── components/
│   ├── bands/                   # one per homepage section (Hero, LogoWall, LoopBand,
│   │                             CaseHighlight ×2, HowWeWork, TeamBand, LatestArticles, SiteFooter)
│   ├── loop/
│   │   ├── Loop.astro           # size: 'full' | 'mini'; highlight?: string[]
│   │   └── loop-paths.ts        # SVG path data + layer anchor coordinates
│   ├── TeamGrid.astro           # shared by TeamBand (band 7) and /about/ (full grid)
│   ├── DeviceFrame.astro
│   ├── FaqAccordion.astro       # native <details>, zero JS
│   ├── InquiryForm.astro
│   └── seo/Meta.astro           # consumes lib/seo/meta.ts per page
├── lib/
│   ├── seo/jsonld.ts
│   ├── seo/meta.ts
│   ├── loop-layers.ts
│   └── redirects.ts
├── scripts/                     # shipped client JS — kept to 2 files, budget-tracked
│   ├── team-shuffle.ts
│   └── contact-form.ts
├── pages/
│   ├── index.astro
│   ├── work/index.astro
│   ├── work/[slug].astro
│   ├── services/index.astro
│   ├── services/[slug].astro
│   ├── about/index.astro
│   ├── contact/index.astro
│   ├── thanks/index.astro       # noindex
│   ├── blog/index.astro
│   ├── blog/[slug].astro
│   ├── privacy/index.astro
│   ├── terms/index.astro
│   ├── 404.astro
│   ├── og/[slug].png.ts         # prerender = true — build-time OG image generation
│   ├── llms.txt.ts              # prerender = true — generated from collections
│   └── api/
│       ├── contact.ts           # prerender = false — the one serverless function
│       └── gone.ts              # prerender = false — 410s for the WordPress URLs not worth a 301
└── styles/
    ├── tokens.css                # :root — color, type scale, space scale, motion durations/easings
    ├── themes.css                # [data-theme="dark"|"light"] — token overrides only, no layout
    ├── base.css                  # resets, base typography, focus-visible
    └── motion.css                # @supports (animation-timeline: scroll()) rules + reduced-motion block

astro.config.mjs                  # output:'static', adapter: vercel(), sitemap integration,
                                   # redirects: built from lib/redirects.ts (301 map only)
scripts/                          # repo-root, non-shipped tooling (Node, not bundled to client)
├── check-redirects.mjs           # imports src/lib/redirects.ts, hits a preview/build URL
├── check-links.mjs
├── check-schema.mjs
├── screenshots.mjs                # Playwright, desktop + mobile per template
└── lighthouserc.json              # budgets: LCP ≤1.2s, CLS 0, INP <100ms, JS ≤15KB gzip
```

### Structure Rationale

- **`content.config.ts` at `src/` root, not per-collection files:** Astro's content layer API (v5+) wants one config exporting a `collections` object; splitting schemas across files just adds indirection for five collections this size.
- **`lib/` vs `components/`:** anything that returns data or plain objects (JSON-LD, redirects, the layer map) lives in `lib/`; anything that returns markup lives in `components/`. This is the load-bearing boundary — it's what lets `scripts/check-redirects.mjs` (a Node CLI script, no Astro runtime) import the exact same `lib/redirects.ts` that `astro.config.mjs` and `api/gone.ts` use, with zero duplication.
- **Bands take props, never self-query:** `src/pages/index.astro` is the only file that calls `getCollection()` for homepage data; it passes typed slices to each band. This keeps every band buildable and visually reviewable against fixture data before real copy exists — critical given the owner's copy review is the stated critical path (PROJECT.md constraint).
- **One `Loop.astro`, not two components:** the full loop (band 3) and mini loop (case bands, service pages) are the same SVG and the same scroll/highlight logic at different scale — a `size` prop, not a second component, avoids the two ever drifting when the circuit-trace source asset is updated.
- **`api/` holds exactly two on-demand routes:** everything else stays `prerender: true` (the default under `output: 'static'`). This is what "static-first... one serverless form endpoint" means structurally — the 410 handler is the one addition beyond the form, justified because Astro's `redirects` config only emits 301/302/307/308s with a `Location` header, not a bare 410 status (verified: Astro's redirect config schema is `string | {status, destination}` — no 410 variant). Routing the small 410 list through a second on-demand function keeps the data-driven single-source pattern intact instead of hand-writing host-specific routing config.

## Architectural Patterns

### Pattern 1: Content collections as the schema boundary, `reference()` for relations

**What:** every content type declared once in `content.config.ts` with a Zod schema; cross-collection links (a service page's related case, a case's client, a post's related service) use `reference()` rather than a bare string slug.
**When to use:** here, for `services↔clients`, `cases↔clients`, `posts↔services` — anywhere a template needs to join two collections.
**Trade-offs:** `reference()` gives compile-time-checked, build-time-resolved links (`getEntry(post.data.relatedService)`) instead of a slug the template has to trust; costs nothing at runtime since collections are static.

**Example:**
```ts
// src/content.config.ts
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: z.object({
    layer: z.enum(['build', 'demand', 'intelligence']),
    name: z.string(),
    summary: z.string(),
    order: z.number(),
    relatedCase: reference('cases').optional(),
  }),
});
```
The service's `id` (filename, e.g. `shopify`) *is* the `<slug>` used in `/services/<slug>/` — no separate slug field to keep in sync.

### Pattern 2: Static-first with two named exceptions

**What:** `output: 'static'` (Astro v5 merged the old `'hybrid'` mode into this — no config needed to mix static and on-demand routes). Every route prerenders by default; `export const prerender = false` opt-out is explicit, file-local, and limited to `api/contact.ts` and `api/gone.ts`.
**When to use:** any marketing/content site where <5% of routes are truly dynamic — matches this project's one form + one redirect edge case.
**Trade-offs:** keeps the Vercel adapter's static entrypoint doing the heavy lifting (CDN-served HTML, zero cold starts for 99% of traffic) while still allowing exactly the two routes that need a live request. The alternative (`output: 'server'`, opting individual pages *into* prerendering) inverts the default and is the wrong direction for a static-first brief — it's the right choice only for apps that are mostly dynamic, which this is not.

**Example:**
```ts
// src/pages/api/contact.ts
export const prerender = false;
export const POST: APIRoute = async ({ request }) => { /* Turnstile + send */ };
```

### Pattern 3: Single-attribute theming, CSS-only

**What:** one `data-theme` attribute (`"dark" | "light"`) on each band's root `<section>`, with `themes.css` overriding only token *values* (`--bg`, `--fg`, `--muted`, `--accent-surface`) under `[data-theme="dark"]` / `[data-theme="light"]` selectors. Components and bands are written once against the tokens and never branch on theme in markup or JS.
**When to use:** alternating-band designs like this homepage (9 bands, black/white alternating) where the "theme" is a per-section design choice, not a user preference — distinct from OS dark-mode, which this site does not implement.
**Trade-offs:** one attribute keeps the CSS specificity flat and makes `prefers-color-scheme` irrelevant to this decision (the site's own alternation overrides any OS setting — the correct choice here since black/white banding is content, not accessibility preference). Downside: nested theme changes (a themed component inside a band of the opposite theme) need the attribute re-set at that boundary — acceptable given the design has no such nesting today.

**Example:**
```css
/* tokens.css */
:root { --color-near-black: #0A0A0B; --color-snow: #F5F6F7; --magenta: #FC0781; }
/* themes.css */
[data-theme="dark"]  { --bg: var(--color-near-black); --fg: var(--color-snow); }
[data-theme="light"] { --bg: var(--color-snow); --fg: var(--color-near-black); }
```
```astro
<!-- components/bands/LogoWall.astro -->
<section data-theme="dark" class="band-logo-wall"> ... </section>
```

### Pattern 4: Progressive-enhancement motion, CSS-native

**What:** every scroll-driven scene ships a static, finished-state CSS rule first (the "reduced motion" / no-JS / no-scroll-timeline-support end state). The scroll-driven version lives entirely inside `@supports (animation-timeline: scroll())` (or `view()`), so unsupported browsers simply never enter that block and render the finished state — no JS feature-detection needed. `@media (prefers-reduced-motion: reduce)` overrides on top of that, disabling even supported scroll-timelines.
**When to use:** the Loop's line-draw/pulse, the OUABC mini-loop light-up, the "How we work" line lock, the team-band reveal trigger.
**Trade-offs:** zero JS for the entire motion layer except the team shuffle (which reorders DOM, not something CSS scroll-timelines can do) and the view-transition router (native `<ClientRouter />`, which per Astro docs already ships its own `prefers-reduced-motion` media query that disables its animations and falls back to a plain DOM swap — no custom code needed for that layer).

**Example:**
```css
/* motion.css */
.loop-path { stroke-dashoffset: 0; } /* finished state, default */

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .loop-path {
      animation: draw-loop linear;
      animation-timeline: scroll(root block);
      animation-range: entry 0% cover 40%;
    }
  }
}
```

## Data Flow

### Content → page → markup (one direction, no back-edges)

```
src/content/**/*.mdx  →  content.config.ts schema validation (build)
        ↓
getCollection()/getEntry() in src/pages/**.astro (the only data-fetching layer)
        ↓
typed props  →  layouts (BaseLayout → Service/Case/Post)  →  components/bands, Loop, TeamGrid
        ↓
static HTML + prerendered og/*.png + llms.txt
```
Components never import `astro:content` directly (only pages/layouts do) — this is what keeps bands swappable against fixture data while copy review is still in flight.

### Redirects: one file, three consumers

```
src/lib/redirects.ts  (REDIRECTS_301[], GONE_410[] — built from WP REST API + Search Console audit)
   ├─→ astro.config.mjs        redirects: {...} object built from REDIRECTS_301   (build-time, Vercel-level 301s)
   ├─→ src/pages/api/gone.ts   matches path against GONE_410, returns 410          (runtime)
   └─→ scripts/check-redirects.mjs   crawls a deployed URL, asserts every old path resolves or 410s  (CI/manual gate)
```

### Form: client → function → two external services → redirect

```
InquiryForm.astro (static, /contact/ and /services/<slug>/?service=<slug>)
   ↓ (client) contact-form.ts reads ?service= via URLSearchParams, preselects checkbox — no server round-trip
   ↓ (submit) fetch POST JSON → /api/contact  [fallback: native form POST if JS disabled]
        ↓ honeypot check → reject silently if filled
        ↓ rate-limit check → reject if exceeded  [OPEN: needs a shared store across invocations — see Integration Points]
        ↓ Turnstile siteverify (Cloudflare, server-side token check)
        ↓ send via Google Workspace  [OPEN: Nodemailer/SMTP app-password vs Gmail API — see Integration Points]
   ↓ on success: JSON response (fetch path) → client navigates to /thanks/
                 303 redirect (no-JS fallback path) → browser navigates to /thanks/
```

## Scaling Considerations

This is a marketing site with a fixed, small content surface (11 services, 2 cases, 7 team, ~18→~97 posts over time, ~10 clients) — "scale" here means content growth and build performance, not concurrent users.

| Scale | Architecture Adjustments |
|-------|---------------------------|
| Launch (18 posts, static-first) | Everything prerendered; two serverless functions. No changes needed. |
| Post-launch (~79 recovered posts added) | `getCollection('posts')` + `getStaticPaths()` already scale to hundreds of MDX files; build time grows linearly but stays well under Vercel's build limits. No architecture change — content-only. |
| Heavy blog growth (500+ posts) | Paginate `/blog/` index (Astro's built-in `paginate()` helper) instead of a single list; still fully static. |
| Traffic scale | Irrelevant to cost/complexity here — static HTML on Vercel's CDN scales without app-layer changes. The only per-request cost is the two functions, and form submissions are inherently low-volume. |

### Scaling Priorities

1. **First real constraint: owner copy approval throughput, not code.** The architecture already decouples componentry from content (props-driven bands, fixture-first build order) specifically so this isn't a technical bottleneck.
2. **Second: OG image / build-time image generation as post count grows.** `og/[slug].png.ts` with `prerender: true` runs once per content entry at build; at hundreds of posts this adds build minutes. Not a concern at 18–97 posts; worth revisiting only if the post backlog fully lands (hundreds of legacy posts).

## Anti-Patterns

### Anti-Pattern 1: Letting `Loop.astro` fetch its own highlight data

**What people do:** have the Loop component call `getCollection('services')` internally to figure out what to highlight, "since it needs the data anyway."
**Why it's wrong:** breaks the component's reuse across full/mini contexts (case pages want to highlight *only the services that client uses*, not derive it from the full catalog) and makes it untestable/unrenderable against fixture data before content is final — directly conflicts with the fixture-first build order this project needs to hit 5–7 days.
**Do this instead:** `Loop` takes `highlight?: string[]` (service slugs) as a prop; the calling page/band computes that list from `lib/loop-layers.ts` + whatever entry it already fetched.

### Anti-Pattern 2: `output: 'server'` "to be safe" for a mostly-static site

**What people do:** default to `output: 'server'` + adapter because "the form needs SSR anyway," then mark everything else `prerender = true` to compensate.
**Why it's wrong:** inverts the correct default, adds a cold-start/function-invocation cost to every page unless every single route remembers to opt back into prerendering, and works against the LCP/Lighthouse-100 launch gates (spec §10) which are much easier to hit when the CDN serves plain static HTML.
**Do this instead:** `output: 'static'` (default), opt the two routes that truly need it *out* with `prerender = false`. Astro v5 explicitly recommends starting static and opting out per-route rather than the reverse (confirmed in Astro's on-demand-rendering guide).

### Anti-Pattern 3: A second redirect list living in `vercel.json` or duplicated in code comments

**What people do:** once the 301 map exists in `astro.config.mjs`, someone adds a couple more one-off redirects directly in Vercel's dashboard/`vercel.json` for convenience during launch week.
**Why it's wrong:** the launch gate requires "every old URL resolves to its mapped target or 410" verified by a script (spec §10) — that script can only be authoritative if there is exactly one source of truth. A second list drifts immediately and the test script can't see it.
**Do this instead:** every redirect and every 410, including "quick launch-week ones," goes into `src/lib/redirects.ts` first. Nothing else consumes routing data independently.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|----------------------|-------|
| Cloudflare Turnstile | Client renders widget (free, external script, async/defer — does not count against the ≤15KB *first-party* JS budget but does add its own network weight; budget this in the performance test, not the JS-KB gate) → server verifies token via `siteverify` POST from `api/contact.ts` | Never trust the client-side pass/fail alone; the function must re-verify. |
| Google Workspace (mail send) | **Open decision, not yet locked:** (a) Nodemailer over SMTP with an app password on a dedicated Workspace sender — fastest to stand up in a 5–7 day build, but SMTP-from-serverless deliverability/quota should be sanity-checked; or (b) Gmail API with a service account + domain-wide delegation — more setup (Workspace admin console changes), more robust long-term. Recommend (a) for launch speed, flag (b) as a fast-follow if delivery issues appear. | Either way, credentials are Vercel env vars only, entered by the owner (per PROJECT.md constraint) — never committed. |
| Rate limiting | **Open decision:** serverless functions are stateless per-invocation, so an in-memory counter does not work across requests. Needs a shared store — Vercel KV or a free-tier Upstash Redis binding are the standard fits and stay inside "no paid services beyond current subscriptions" if usage stays on the free tier. This is a stack decision to confirm, not an architecture gap; `api/contact.ts`'s boundary (a rate-limit check before Turnstile verify) is fixed regardless of which store backs it. | Flag for STACK.md / PITFALLS.md — do not defer past the form phase, since honeypot alone is not spam-sufficient. |
| Vercel (adapter, hosting, functions) | `@astrojs/vercel` adapter; static entrypoint for the site, serverless (Node) entrypoint for `api/contact.ts` and `api/gone.ts` — **not** the edge entrypoint, since Node-native mail/crypto APIs and (if used) a Redis client are simpler on Node runtime than edge's restricted API surface. | Confirmed via docs: `@astrojs/vercel/serverless` vs `@astrojs/vercel/static` are distinct entrypoints; `middlewareMode: 'edge'` is a separate, unrelated knob for middleware only. |
| Google Analytics (GA4/Ads tags) | Static `<script>` snippets in `BaseLayout`, IDs carried over unchanged (`GT-NNZRWNCF` / `G-BV43HRVJ18` / `AW-17071018445`) | No server-side involvement; purely a layout concern. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| Pages ↔ content collections | `getCollection()`/`getEntry()`, build-time only | Pages are the *only* callers; never called from components. |
| Pages/layouts ↔ band/UI components | Typed props, one direction | Components render what they're given; no component re-derives data it could instead receive. |
| `astro.config.mjs` ↔ `lib/redirects.ts` | Direct TS import at config-eval time | Astro config files run as Node/TS modules, so this is a plain import, not a build step — confirmed pattern from Astro's own config reference examples. |
| `api/contact.ts` ↔ Turnstile / Workspace | `fetch()` calls from within the function handler | No shared client library needed for Turnstile (single REST call); Workspace send is the one place needing a real dependency (Nodemailer or `googleapis`). |
| `scripts/*.mjs` (test/verification) ↔ site | Read-only, external HTTP against a built/deployed URL, plus direct import of `lib/redirects.ts` for the URL list | These are Node CLI scripts, not part of the Astro build graph — they run after a deploy (preview or prod), not during it. |

## Sources

- Astro docs (Context7 `/withastro/docs`, High reputation, current): content collections guide + `astro-content` module reference (`defineCollection`, `glob()` loader, `reference()`, `getEntry()`/`getEntries()`) — HIGH confidence.
- Astro docs: on-demand rendering guide (`output: 'static'` default, per-route `prerender`, v5 removal of `'hybrid'` mode merging it into `'static'`) — HIGH confidence.
- Astro docs: Vercel adapter guide (`includeFiles`, `middlewareMode: 'edge'`, serverless vs static entrypoints, adapter-support-output-mismatch error reference confirming `@astrojs/vercel/static` vs `@astrojs/vercel/serverless`) — HIGH confidence.
- Astro docs: configuration reference (`redirects` config — string or `{status, destination}` object shape, confirming no built-in 410 variant) — HIGH confidence.
- Astro docs: view-transitions guide + `astro-transitions` module reference (`<ClientRouter />`, built-in `prefers-reduced-motion` handling) — HIGH confidence.
- `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` (this project's approved design spec — project-specific authority for site map, bands, motion, SEO, redirects, form, architecture §14) — project source, not external.
- `.planning/PROJECT.md` — project-specific constraints (timeline, stack, owner-gated inputs) — project source, not external.

---
*Architecture research for: Astro static-first marketing site on Vercel*
*Researched: 2026-09-25 (CT)*
