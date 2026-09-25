# ZINC Digital Website (zinc-digital-web)

## What This Is

The new `www.zincdigital.co`: a custom, static-first Astro site on Vercel replacing ZINC Digital's WordPress/Elementor/Mouno site on Kinsta. It presents ZINC as one operating system in three layers (Build · Demand · Intelligence) for established, nationwide brands — ecommerce first — whose marketing directors and CFOs need to see that ZINC is the serious option.

Full approved design: `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` (the authority for every requirement below).

## Core Value

The right prospect leaves certain ZINC is the serious option — and sends a qualified inquiry or a text about a specific service — on a site that loads instantly and ranks.

## Business Context

- **Customer**: established brands nationwide, modeled on Once Upon a Book Club (~$21k/month, almost 3 years, multi-service) and U.S. Oil Solutions (site, SEO, two apps); marketing directors and C-level/CFOs.
- **Revenue model**: agency retainers and builds across 11 services; no public pricing.
- **Success metric**: qualified inquiries (form with budget qualifier, or texts to (786) 575-4837) from prospects outside the referral network.
- **Strategy notes**: spec §1–§3.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage: nine alternating black/white bands per spec §6.1, with the core line hero and the scroll-driven Loop as the signature moment
- [ ] `/services/` loop page and 11 service pages (Build 3 · Demand 7 · Intelligence 1) at flat `/services/<slug>/` URLs, each with spec sheet, proof, FAQ, and preselected inquiry
- [ ] `/work/` index with logo wall; case studies for Once Upon a Book Club (flagship) and U.S. Oil Solutions with live links, screenshots, `[RECEIPT: …]` numbers until confirmed
- [ ] `/about/` with all seven team members in random order on every load; Miami HQ, nationwide, Panama City satellite
- [ ] `/contact/` qualifying form (budget `Under $5k/mo`, `$5–10k`, `$10–25k`, `$25k+`) delivered to `jaymie@zincdigital.co` via Google Workspace, with Turnstile + honeypot + rate limit; text line (786) 575-4837
- [ ] Blog: 18 live posts migrated to `/blog/<slug>/`, polished in the `zinc-author-voice` lane, filtered by layer
- [ ] Visual system: editorial condensed-grotesk type (owner picks from three pairings), near-black + cool snow white; accents rare and loud — magenta `#FC0781` on black, dark teal `#07B2B2` / `#057E7E` (small text) on white
- [ ] Motion system: native CSS scroll-driven animation, view transitions, reduced-motion finished states; no animation library, no WebGL
- [ ] Full SEO override: new taxonomy, titles/meta, structured data, complete sitemap, `robots.txt`, `llms.txt`, share images, GA4/Ads tags carried over
- [ ] 301/410 redirect map from every old WordPress URL, tested by script
- [ ] Launch gates (spec §10): Lighthouse mobile 100×4 per template, LCP ≤ 1.2 s, CLS 0, INP < 100 ms, ≤ 15 KB JS per page, WCAG 2.2 AA
- [ ] Cutover: Route 53 → Vercel on the owner's explicit go; Kinsta kept ~30 days as rollback

### Out of Scope

- Branding / graphic design as a service — dropped by the owner 2026-09-25
- Public pricing — anchors buyers low; the form's budget question filters
- CMS — posts live in git as Markdown/MDX
- Client portal, logins, live dashboards — not the site's job
- Testimonial carousels, stat counters, award badges, guarantees, comparison tables — owner: "no sales pitch"
- `kirk-voice` phrasing and any legacy copy — owner: fresh voice for this site
- 3D / WebGL — performance gate
- Changes to the live WordPress site before cutover

## Context

- Live site today: 18 posts, 14 pages, 16 categories, 86 tags; the Rank Math sitemap lists 7 pages and no posts (measured 2026-09-25 CT).
- Hosting: Vercel team `zincdigitalofmiamis-projects`, Pro plan active. DNS: AWS Route 53. Email: Google Workspace. Current site: Kinsta behind Cloudflare.
- Analytics IDs in use: Google tag `GT-NNZRWNCF`, GA4 `G-BV43HRVJ18` (property 494489814), Ads `AW-17071018445`.
- Asset sources: team headshots and client screenshots in the July prototype zip (`/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website V2.zip`, `assets/`); brand mark (circuit-brain profile) and wordmark in `/Volumes/Satechi Hub/ZINC Digital Agency/Graphics/` and `docs/context/brand-assets/`. Facts only — no design or copy carries over.
- Recovered blog queue (≈79 unpublished) lives in the `Zinc_Digital_Agency` repo `docs/recovery/`; it publishes into this site after launch.

## Constraints

- **Timeline**: live in 5–7 days from 2026-09-25; owner copy review is the critical path.
- **Performance**: spec §10 gates are launch-blocking on every template.
- **Budget**: no paid services beyond current subscriptions (Vercel Pro, Google Workspace); open-license fonts only.
- **Tech stack**: Astro (current stable), TypeScript, plain CSS tokens, Node 24, Vercel.
- **Copy**: fresh voice (spec §7); no invented numbers; never "GEO" for generative search; no cursing.
- **Owner inputs**: receipts for case studies, real-vs-placeholder testimonials, "How we work" commitments, Jaymie and Wendy photos.
- **Irreversible actions**: DNS cutover and production secrets need the owner's explicit go.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Clean slate; V2 prototype and live site are fact sources only | Owner wants fresh eyes | — Pending |
| Astro on Vercel in `zinc-digital-web` | Static-first speed + SEO; Vercel Pro already paid | — Pending |
| One system, three layers (Build · Demand · Intelligence) with flat service URLs | Sells the connected relationship; flat URLs rank | — Pending |
| Loop signature + editorial type; black/white alternating; magenta `#FC0781` on black, dark teal `#07B2B2` on white | Owner direction: big, moving, unexpected, mostly B&W, loud color | — Pending |
| Research conflicts resolved per spec §18 (410 route, form email, rate limit, cookie banner, case order, form steps) | Owner: "resolve all conflicts" | — Pending |
| Core line: "Other agencies deliver the scope. ZINC delivers the business." | Approved by owner | — Pending |
| Full SEO override, 18 posts at launch, rest after | Old config untouched for years; speed to launch | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-25 after initialization*
