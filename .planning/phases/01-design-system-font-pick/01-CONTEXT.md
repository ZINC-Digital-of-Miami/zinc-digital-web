# Phase 1: Design System & Full-Site Acceptance - Context

**Gathered:** 2026-09-25 (CT)
**Status:** Implemented plans are summarized; Phase 1 verification is pending
**Source:** PRD Express Path (`docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md`) + owner interview 2026-09-25

## Superseding checkpoint — 2026-09-26 CT

Read [01-RECONCILIATION.md](./01-RECONCILIATION.md) first. The historical interview below is retained for provenance. Its A/B/C comparison, dark-band, repeat font-pick, draft-banner, old-worktree and no-CI directions are superseded: selected Pairing A/all-white option 3, shared side thread, draft-label removal and repository CI are on main through PRs #3–#5. Do not recreate comparison routes or ask for another font pick. The older UI-SPEC is historical wherever it conflicts with these later decisions. Retain every unfulfilled quality, full-site and truthful-content gate.

Current action: GSD 1.14.0 progress sees two active plans with summaries and no verification report, so it routes to `$gsd-execute-phase 01` to resume at the verification gates. It does not rerun summarized plans. Plans 01-03/04/05 are marked `status: superseded` and excluded from GSD progress routing; keep their source text as history. If verification identifies gaps, plan only the needed gap-closure work. Use a new task branch/worktree from freshly read main; do not use the merged phase-01 branch or this reconciliation checkout for follow-on work.

<domain>
## Phase Boundary

Phase 1 now verifies owner acceptance and current-baseline evidence for the selected, already implemented full-site design. Main contains the clickable sitemap, ten all-white homepage bands with a headline-only hero and separate intro, Pairing A type, and the shared side thread; see `01-RECONCILIATION.md` for the measured baseline and open evidence. Do not rebuild the mockup, reopen font selection, add comparison routes, or infer acceptance from implementation or old summaries. Preserve font/CLS, accessibility, truthful-content, every-template and owner-UAT gates. The demo remains non-sending; live inquiry, production integrations, final content approval and cutover remain later work.

**Superseding owner correction, 2026-09-25 CT:** "this is supposed to be a fucking full mockup of entire site!" followed by the explicit `$gsd-plan-phase` command and "CONTINUE". This direct correction supersedes the homepage-only next-build interpretation in `docs/handoff/2026-09-25-turnover-complete.md` Part C and every older hero/spec-sheet-only phase boundary. The turnover remains the source for the approved sitemap, assets, design decisions and historical state. Do not narrow this deliverable back to a homepage.

The next GSD action is verification, not another design-selection plan. Requirements: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05.

</domain>

<decisions>
## Implementation Decisions

### Stack (locked)
- Astro 7.3.5, `@astrojs/vercel` 11.0.11, TypeScript (version pinned by `create-astro`), Node 24. `output: 'static'`.
- Plain CSS with custom-property tokens. No CSS framework, no UI framework, no animation library, no component registry.
- Hosting: Vercel team `zincdigitalofmiamis-projects` (Pro, already paid). Owner selected the public noindex `zinc-digital-web.vercel.app` URL; custom domains remain unattached. Verify deployment target, protection and noindex after each deploy.
- Repo: `ZINC-Digital-of-Miami/zinc-digital-web`; `main` stays on main. Each follow-on task uses its own branch and worktree from freshly read main, lands by PR, then its branch is deleted after the merged commit is deployed and measured.

### Historical color direction (superseded by the 2026-09-26 all-white selection)
- Near-black `#0A0A0B`; cool snow white `#F5F6F7` (no warm/yellow whites); one body gray per ground.
- The selected site uses the snow-white ground throughout. Teal is used for display/graphics and accessible teal text; magenta is used on the side-thread dot.
- `#07B2B2` is the display/graphics accent; `#057E7E` is used for small teal text. Preserve contrast for the selected role.
- The hero is on the shared snow-white ground; its accent treatment follows the selected all-white design.
- Other live-site accents (`#0BD3D3`, `#C6FF00`, `#FF7A00`, `#FFC107`, `#00F5D4`) are excluded.

### Theming (locked)
- The selected design uses the snow-white ground throughout with the shared token system; never switch the selected presentation based on `prefers-color-scheme`.

### Type (locked — spec section 8; UI-SPEC)
- Editorial "annual report" discipline: heavy condensed grotesk display, precise text sans body, mono labels/data.
- Hero Display: `clamp(3.5rem, 10vw + 1rem, 12.5rem)` (owner wants big headers).
- Pairing A is selected: Big Shoulders Display / Inter / JetBrains Mono. Keep the open-license, self-hosting, subset, three-file ceiling, metric-matched fallback and zero-CLS gates.
- Barlow Condensed / Public Sans / IBM Plex Mono and Oswald / IBM Plex Sans / Space Mono are historical alternatives only. Do not compare them or reopen font selection.

### Copy (locked — spec section 7)
- Core line: "Other agencies deliver the scope. ZINC delivers the business."
- Fresh voice: short declaratives, senior, no slang, no cursing, no exclamation points, nouns and receipts over adjectives; no legacy lines; never "GEO".
- Copy remains unapproved where owner review is open, but PR #5 removed draft banners. Keep `[RECEIPT: …]` and owner-confirmation markers for unconfirmed claims; their removal does not approve copy. The homepage hero is headline-only with a separate intro band. Preserve the selected CTA, phone/text actions, no-underlined-link rule, top-starting content and crisp-asset limits from the current spec.

### Brand mark (locked)
- Black/white circuit-brain profile mark + ZINC wordmark, from `/Volumes/Satechi Hub/ZINC Digital Agency/Graphics/` and `/Volumes/Satechi Hub/ZINC Digital Agency/docs/context/brand-assets/`. Raster only; on-screen width capped at source ÷ 2.

### Gates that start here (spec section 10)
- Lighthouse mobile 100 ×4 on the preview templates; measure Pairing A font loading and cold-load CLS; WCAG 2.2 AA contrast; ≤ 15 KB JS per page.
- Before any visual handoff: agent-owned 1440px and 375px screenshots across every template, a crawl of all local destinations, and computed-style checks for link decoration, top-of-page content and image sharpness. Show the complete selected-design site for owner acceptance; comparison routes and another font pick are not in scope.

### Claude's Discretion
- Directory layout and token file names (follow `.planning/research/ARCHITECTURE.md`).
- Font subsetting tool and fallback-metric generation method.
- No comparison or pairing-index page is in scope; the font pick is complete.
- Use the existing Node 24 CI build and repository checks. Do not add paid services or a second deployment workflow.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

Read `01-RECONCILIATION.md` first for current sources, implementation status, open evidence and the GSD verification route.

### Design authority
- `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` — approved design and copy authority; read with the later decisions summarized in `01-RECONCILIATION.md`
- `.planning/phases/01-design-system-font-pick/01-UI-SPEC.md` — historical UI design contract; use only where it agrees with the selected design spec and 2026-09-26 reconciliation

### Research
- `.planning/research/STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md` and `SUMMARY.md` — 2026-09-25 technical background only; their old launch dates, owner actions and unselected design directions are superseded by the current reconciliation.
- `.planning/phases/01-design-system-font-pick/01-RESEARCH.md` — historical technical research; retain verified Astro font findings, not its three-pairing or Day 1 plan.

### Project
- `.planning/REQUIREMENTS.md` — DSGN-01..05
- `AGENTS.md` — repo invariants

</canonical_refs>

<specifics>
## Specific Ideas

- The full-site mockup and selected design are implemented. This phase records current-baseline verification and owner acceptance; do not reopen the completed font/design selection.
- Owner quotes: "big headers, big moving parts, unexpected actions, white and black, little color but when it's used I want it loud"; "no yellowish whites, if anything have a snow or touch of gray in the white"; "use our dark teal on white".

</specifics>

<deferred>
## Deferred Ideas

- Remaining work includes owner UAT and quality evidence, final copy and receipts, live inquiry/mail/anti-abuse, reviewed blog migration, production SEO/redirects, and launch/cutover. The selected design and homepage motion are already implemented; do not schedule a rebuild as Phase 1 work.

</deferred>

---

*Phase: 01-design-system-font-pick*
*Context gathered: 2026-09-25 via PRD Express Path*
