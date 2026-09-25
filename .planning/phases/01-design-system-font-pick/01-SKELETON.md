# Walking Skeleton: ZINC Digital Website (zinc-digital-web)

**Phase:** 1
**Generated:** 2026-09-25 (CT)

## Capability Proven End-to-End

The owner, logged into Vercel, opens a protected preview URL and sees `/design-preview/a/`: the light hero band ("Other agencies deliver the scope. ZINC delivers the business.") drawn from the token system and set in a self-hosted font. Astro builds it statically, Vercel serves it, and anyone who is not logged in gets the Vercel login wall (Plan 01-01).

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro 7.3.5, `output: 'static'`, TypeScript via `astro check` | CONTEXT "Stack (locked)". The static-first marketing site needs zero client JS (the planner probe measured 0 .js files in dist) |
| Adapter | `@astrojs/vercel` 11.0.11, exact pin | CONTEXT "Stack (locked)". The build writes both `dist/` and `.vercel/output/static/` (measured 2026-09-25 13:19 CT) |
| Runtime | Node 24 (`engines.node` 24.x; the Vercel project's nodeVersion is 24.x) | Owner rule; AGENTS.md invariant |
| Data layer | None. No database. Content arrives as props from fixture objects now, and from Astro content collections in Phases 2-5 | Spec §14: Markdown/MDX in git, no CMS. Components take props and never fetch (ARCHITECTURE.md) |
| Server code | None in Phase 1. The only planned function is the Phase 4 contact endpoint (`prerender = false`), plus the Phase 5 410 route | Spec §14, §18 |
| Auth | No in-app auth. Previews are gated at the platform edge by Vercel Authentication, Standard Protection (`ssoProtection.deploymentType = all_except_custom_domains`). Never Password Protection ($20/month/project on Pro) | RESEARCH Pattern 3 and Pitfall 4; team sibling projects use the same setting (measured) |
| Deployment target | Vercel project `zinc-digital-web` in team `zincdigitalofmiamis-projects` (Pro). CLI-linked and CLI-deployed (`vercel deploy`, preview target only). No Git connection, no production deployment, no domain or alias in Phase 1 | CONTEXT: preview deploys only. A CLI-linked project cannot create a production deployment when a branch merges to main |
| Preview indexing | Vercel's `x-robots-tag: noindex` (measured on the 302) plus `meta robots noindex, nofollow` in every draft page | Two independent controls for two threats: access and indexing |
| Styling | Plain CSS custom properties. `tokens.css` holds the only hex values. `themes.css` maps `[data-theme="dark"\|"light"]` to `--bg --fg --muted --accent --accent-text`. `base.css` holds type roles, band layout and the mark classes | Spec §14 (no CSS framework); CONTEXT "Theming (locked)" |
| Accent rule | Components use only `--accent` / `--accent-text`. `--color-magenta` is referenced only in the dark block; `--color-teal` / `--color-teal-text` only in the light block. `scripts/check-bands.mjs` enforces this | CONTEXT "Color (locked)": magenta only on black, teal only on white; hero marks are teal |
| Type system | Astro native Fonts API (`fonts` config, `<Font>`; build-time download, Latin subset, `size-adjust` metric-matched fallback faces, one preload on the display face). Components read `--font-display`, `--font-body` and `--font-mono` only | RESEARCH correction (replaces the pyftsubset/Fontaine pipeline); CONTEXT discretion on tooling |
| Type pairing | Pending the owner's Day 1 pick (Sat 2026-09-26 CT); Plan 01-05 writes the choice here | DSGN-01 |
| Type scale | Display `clamp(3.5rem, 10vw + 1rem, 12.5rem)`; Heading `clamp(1.75rem, 2vw + 1.25rem, 2.75rem)`; Body `clamp(1rem, 0.3vw + 0.94rem, 1.125rem)`; Label 0.875rem | Owner: big headers; UI-SPEC Typography |
| Images | `astro:assets` `<Picture>` (AVIF and WebP at 1x and 2x, sharp from astro's optionalDependency). The brand rasters are capped at source / 2 on screen; `BrandMark` throws above the cap | Spec §10; UI-SPEC unresolved raster-only constraint |
| Directory layout | `src/styles/{tokens,themes,base}.css`, `src/layouts/BaseLayout.astro`, `src/components/bands/*.astro` (one per band), `src/components/BrandMark.astro`, `src/assets/brand/`, `src/pages/**`, repo-root `scripts/` for non-shipped Node tooling | `.planning/research/ARCHITECTURE.md` |
| Quality gates | `scripts/gate-preview.sh <url> <path>...` runs build, astro check, `check-bands.mjs`, `check-fonts.mjs`, a JS gzip budget, header checks, `check-overflow.mjs` (zero-dependency CDP), axe (WCAG 2.2 A/AA), Lighthouse CI (100 on all four categories, LCP 1200 ms or less, script 15 KB or less) and devtools-throttled CLS 0. Reports use filesystem upload only | Spec §10; VALIDATION.md |
| Secrets | The Protection Bypass for Automation secret lives only in gitignored `.env.local` (mode 600, excluded by `.vercelignore`). No secret is ever committed | Threat T-01-12 |

## Stack Touched in Phase 1

- [x] Project scaffold: create-astro minimal (only package.json and tsconfig.json merged), exact pins, `astro check`
- [x] Routing: `/design-preview/{a,b,c,stress}/` and `/design-preview/` during review, then `/` after the pick
- [x] Database: not applicable. This static site has no database by design. Content is props from fixtures now and content collections later. No read or write exists to prove
- [x] UI: static, no-JS interactions only in Phase 1: the "Start an Inquiry" link, the `tel:` text line and the pairing index links. The first server interaction (the form POST) is Phase 4
- [x] Deployment: Vercel preview on the existing Pro team, protected by Vercel Authentication and reachable by the owner

## Out of Scope (Deferred to Later Slices)

- Motion: the Loop, scroll-driven marks and view transitions (Phase 2).
- The homepage bands beyond the hero (Phase 2); service pages and case studies (Phase 3); about and the contact form with its server function (Phase 4); blog, SEO, sitemap, analytics and redirects (Phase 5).
- A Git connection to Vercel, production deployments, domains and DNS. Before any Git connection, decide how main deploys stay protected until the Phase 7 cutover.
- A vector re-export of the brand marks (needed only if a placement exceeds the raster cap).

## Subsequent Slice Plan

Each later phase adds one vertical slice on this skeleton without changing its architectural decisions:

- Phase 2: A visitor to `/` reads the nine bands and sees the Loop draw on scroll.
- Phase 3: A buyer opens `/services/` and any of the 11 service pages, plus both case studies.
- Phase 4: A prospect meets the team on `/about/` and sends a qualified inquiry that reaches Jaymie.
- Phase 5: Search engines find every page and post; every old URL resolves.
- Phase 6: Every template passes the §10 gates, and the owner signs final approval.
- Phase 7: `www.zincdigital.co` serves the site from Vercel, on the owner's explicit go.
