# Phase 1: Design System & Font Pick - Context

**Gathered:** 2026-09-25 (CT)
**Status:** Ready for planning
**Source:** PRD Express Path (`docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md`) + owner interview 2026-09-25

<domain>
## Phase Boundary

Scaffold the Astro project and deliver the design system (tokens, fonts, band theming, brand mark) proven on a rendered mockup: the homepage hero and one service spec sheet, shown in three font pairings on noindex, deployment-protected preview routes. The owner picks one pairing on Day 1 (Sat 2026-09-26 CT). No other pages, no form, no Loop animation in this phase.

Requirements: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05.

</domain>

<decisions>
## Implementation Decisions

### Stack (locked)
- Astro 7.3.5, `@astrojs/vercel` 11.0.11, TypeScript (version pinned by `create-astro`), Node 24. `output: 'static'`.
- Plain CSS with custom-property tokens. No CSS framework, no UI framework, no animation library, no component registry.
- Hosting: Vercel team `zincdigitalofmiamis-projects` (Pro, already paid). Preview deploys only in this phase — no production domain change.
- Repo: `ZINC-Digital-of-Miami/zinc-digital-web`; work on branch `gsd/phase-01-design-system-font-pick` in worktree `/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01`; lands on `main` by PR.

### Color (locked — spec §8, §18)
- Near-black `#0A0A0B`; cool snow white `#F5F6F7` (no warm/yellow whites); one body gray per ground.
- Magenta `#FC0781` only on black bands (5.17:1).
- Dark teal `#07B2B2` on white bands for display type and graphics only (2.42:1); `#057E7E` for any small teal text on white (4.52:1). Magenta never on white.
- The hero is a white band, so its strike/highlight marks are teal, not magenta.
- Other live-site accents (`#0BD3D3`, `#C6FF00`, `#FF7A00`, `#FFC107`, `#00F5D4`) are excluded.

### Theming (locked)
- Each band sets its ground with one `data-theme="dark|light"` attribute; tokens swap per attribute; never tied to `prefers-color-scheme`.

### Type (locked — spec §8; UI-SPEC)
- Editorial "annual report" discipline: heavy condensed grotesk display, precise text sans body, mono labels/data.
- Hero Display: `clamp(3.5rem, 10vw + 1rem, 12.5rem)` (owner wants big headers).
- Open-license only, self-hosted, subset, ≤ 3 font files per pairing, metric-matched fallbacks so the swap measures CLS 0.
- Archivo excluded. Three pairings per `01-UI-SPEC.md` (A Big Shoulders Display / Inter / JetBrains Mono; B Barlow Condensed / Public Sans / IBM Plex Mono; C Oswald / IBM Plex Sans / Space Mono — static-weight caveats recorded in the UI-SPEC).

### Copy (locked — spec §7)
- Core line: "Other agencies deliver the scope. ZINC delivers the business."
- Fresh voice: short declaratives, senior, no slang, no cursing, no exclamation points, nouns and receipts over adjectives; no legacy lines; never "GEO".
- Mockup body copy is draft and marked [DRAFT]. Primary CTA "Start an Inquiry"; text line "Text (786) 575-4837".

### Brand mark (locked)
- Black/white circuit-brain profile mark + ZINC wordmark, from `/Volumes/Satechi Hub/ZINC Digital Agency/Graphics/` and `/Volumes/Satechi Hub/ZINC Digital Agency/docs/context/brand-assets/`. Raster only; on-screen width capped at source ÷ 2.

### Gates that start here (spec §10)
- Lighthouse mobile 100 ×4 on the mockup routes; CLS 0 on cold throttled load per pairing; WCAG 2.2 AA contrast; ≤ 15 KB JS (this phase should ship ~0 KB).

### Claude's Discretion
- Directory layout and token file names (follow `.planning/research/ARCHITECTURE.md`).
- Font subsetting tool and fallback-metric generation method.
- How the pairing index page is laid out (it is throwaway, deleted after the pick).
- CI: none required this phase; local build + preview-deploy checks suffice. Any GitHub Actions workflow must stay within free minutes on this public repo.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design authority
- `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` — approved spec; §7 voice, §8 visual system, §9 motion, §10 gates, §14 architecture, §18 resolved decisions (wins over research)
- `.planning/phases/01-design-system-font-pick/01-UI-SPEC.md` — approved UI design contract (spacing, type scale, color, pairings, UI Considerations)

### Research
- `.planning/research/STACK.md` — versions, font pairings, subsetting workflow
- `.planning/research/ARCHITECTURE.md` — directory layout, token/theming architecture
- `.planning/research/PITFALLS.md` — font CLS, contrast, preview protection
- `.planning/research/SUMMARY.md` — incl. "Resolved After Synthesis"

### Project
- `.planning/REQUIREMENTS.md` — DSGN-01..05
- `AGENTS.md` — repo invariants

</canonical_refs>

<specifics>
## Specific Ideas

- The owner explicitly asked to see a mockup before any production build; this phase is that mockup.
- Owner quotes: "big headers, big moving parts, unexpected actions, white and black, little color but when it's used I want it loud"; "no yellowish whites, if anything have a snow or touch of gray in the white"; "use our dark teal on white".

</specifics>

<deferred>
## Deferred Ideas

- The Loop animation, homepage bands, motion system — Phase 2.
- Service pages, case studies — Phase 3. Form — Phase 4. Blog/SEO/redirects — Phase 5.

</deferred>

---

*Phase: 01-design-system-font-pick*
*Context gathered: 2026-09-25 via PRD Express Path*
