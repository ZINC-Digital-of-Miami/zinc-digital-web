# Roadmap: ZINC Digital Website (zinc-digital-web)

## Reconciled checkpoint — 2026-09-26 CT

[Phase 1 reconciliation](./phases/01-design-system-font-pick/01-RECONCILIATION.md) governs resumption. Main already contains the full-site all-white design and subsequent homepage/motion work from PRs #4/#5. The selected fonts are Big Shoulders Display, Inter and JetBrains Mono. No phase is newly accepted here; plan/phase counts track formal acceptance, not amount implemented.

The completed 01-02 row below preserves its September 25 plan and summary: nine alternating bands, with the owner's design and font choice still open. PR #4 later introduced the current all-white ten-band homepage with a headline-only hero and separate intro; PR #5 added follow-on animation and responsive work. See the distinct quick-task entries in STATE.md. Do not use the 01-02 record as evidence for the later selected design.

Older success criteria below remain historical where they require A/B/C comparison, alternating dark bands or draft banners. The later recorded owner decisions supersede those presentation instructions. Plans 01-03/04/05 are marked `status: superseded`; GSD excludes them from progress routing. Both live plans have summaries and no Phase 1 verification exists, so GSD's next route is `$gsd-execute-phase 01` to resume at the verification gates. Do not ask for the already recorded font selection again.

## Overview

The selected full-site design and homepage motion are already implemented on `main`; the seven phases track acceptance and remaining production work. No launch date is approved. The owner said on 2026-09-26 that go-live is not near because substantial design work remains, superseding the original 5–7-day framing. Continue through the gates below without calendar targets. Phase 1 acceptance, copy/proof review, live inquiry integration, the 18-post migration, SEO and old-WordPress URL resolution remain open. Phase 6 holds launch gates and final approval. Phase 7 is the DNS cutover, only on the owner's explicit go.

**Authority:** `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md`. The spec's section 18 resolved decisions win over research.

**Owner review gates (LNCH-01; ordered, with no dates):**

| Order | Owner gate | Phase |
|-------|------------|-------|
| 1 | Review the selected full-site direction and current implementation; acceptance remains open | 1 |
| 2 | Review homepage copy | 2 |
| 3 | Review service and case-study copy | 3 |
| 4 | Review About and Contact; remeasure authoritative SPF and validate mail delivery before enabling live submissions | 4 |
| 5 | Review blog copy, receipts, "How we work", testimonial status and team photos | 5 |
| 6 | Complete the final review and approve all launch gates | 6 |
| 7 | Cut over DNS only on the owner's explicit go at that time | 7 |

**Budgets carried by every UI phase:** each phase checks its own templates against the section 10 budgets on its Vercel preview (Lighthouse mobile 100×4, LCP ≤ 1.2 s, CLS 0, ≤ 15 KB gzip JS). Phase 6 is the formal gate across all templates.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design System & Full-Site Acceptance** - Complete clickable full-site mockup with tokens, selected all-white design, Pairing A type and brand mark; acceptance outstanding
- [ ] **Phase 2: Homepage Motion & the Loop** - Ten all-white bands on `/`, with a headline-only hero and separate intro, the scroll-drawn Loop as the signature, and finished states for reduced motion and Firefox
- [ ] **Phase 3: Services & Proof** - `/services/`, 11 flat service pages, `/work/` and both case studies, each with the mini loop lit
- [ ] **Phase 4: About & Inquiry** - `/about/` team page and the qualifying contact form delivering to Jaymie, gated on fresh SPF verification and mail-delivery validation
- [ ] **Phase 5: Blog, SEO & Redirects** - 18 migrated posts, the full SEO override and analytics, and every old URL resolved to a 301 or 410
- [ ] **Phase 6: Launch Readiness & Owner Approval** - Every template passes the section 10 gates, all copy is clean and approved, and the owner gives final approval
- [ ] **Phase 7: Cutover** - Route 53 points to Vercel on the owner's go, with mail untouched, live checks run and Kinsta kept for rollback

## Phase Details

### Phase 1: Design System & Full-Site Acceptance

**Goal**: The owner accepts the complete clickable site in the already selected Pairing A and all-white design
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05
**Success Criteria** (what must be TRUE):

  1. The owner can navigate all 40 approved destinations and the genuine 404 on the public noindex Vercel URL: ten homepage bands, including the headline-only hero and separate intro, services index and all 11 services, work index and both cases, about, contact/demo confirmation, blog index and 18 articles, privacy, terms and 404. Internal links, blog filters, service preselection and non-sending demo confirmation work.
  2. All pages use the selected Pairing A (Big Shoulders Display / Inter / JetBrains Mono) and the owner-selected all-white option 3 with the side circuit thread. No A/B/C comparison or repeat font-pick gate remains.
  3. Desktop and mobile evidence covers every page template and relevant state. The owner accepts the deployed full-site design; unresolved content remains clearly identified through receipt/owner-confirmation markers. The demo form stores and sends nothing.
  4. The selected type is self-hosted in the deployed output with no more than three font files. Cold/throttled font loading and CLS are measured; the zero-CLS gate passes.
  5. The circuit-brain mark and ZINC wordmark render crisply at mobile and desktop widths. All Phase 1 quality results record route, deployment SHA, viewport and evidence; no result is inferred from plan completion.

**Plans**: Both live plans have summaries; 01-03/04/05 remain as superseded historical files so GSD does not resume them. Verification is pending; gap-closure plans follow only if verification identifies gaps.

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking skeleton: scaffold, token system, selected-design hero on a protected Vercel preview (owner gates: package legitimacy + Vercel go; owner opens preview)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Wave 2: complete clickable Pairing A site per its historical plan — 40 sitemap pages plus 404, nine homepage bands in alternating light/dark order, 11 services, both cases, 18 article previews, non-sending contact, every-template 1440/375 evidence. The owner’s design and font choice remained open at this checkpoint.

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03-PLAN.md — SUPERSEDED; do not execute. Historical Wave 3: identical full-site A/B/C comparisons with correct font families, route/content parity, budgets and cold-font evidence

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 01-04-PLAN.md — SUPERSEDED; do not execute. Historical Wave 4: complete route/state/visual/accessibility/performance gates, independent review, then owner's explicit font choice

**Wave 5** *(blocked on Wave 4 completion)*

- [ ] 01-05-PLAN.md — SUPERSEDED; do not execute. Historical Wave 5: retain chosen pairing across all 40 pages and 404, remove comparison routes only, remeasure and publish the full noindex mockup

**UI hint**: yes

### Phase 2: Homepage Motion & the Loop

**Goal**: A visitor to `/` reads the whole ZINC story across ten all-white bands, and the Loop drawing itself on scroll is the moment they remember
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: LOOP-01, LOOP-02, MOTN-01, MOTN-02, MOTN-03, MOTN-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08
**Success Criteria** (what must be TRUE):

  1. A visitor sees the ten snow-white bands in the selected content order:
     - a screen-filling headline-only hero with the core line, teal strike and highlighter;
     - a separate intro band with metadata, supporting line, inquiry and text actions, and contents navigation;
     - the logo wall, Loop, OUABC, U.S. Oil, How we work, team and latest articles;
     - the footer with its closing line, inquiry action, text line, locations and socials.
  2. In supported browsers, scrolling the pinned Loop band draws the circuit line and sends the pulse around Build → Demand → Intelligence. Each layer scales up as the pulse reaches it, and every service is listed as a link. All of this runs on native CSS only, with no animation library and no WebGL
  3. With reduced motion on, and in Firefox, every section shows its designed finished state with no content missing, and the owner has approved the finished Loop state
  4. On a real iPhone in Safari, the pinned Loop holds steady as the toolbar collapses and expands. Moving from `/` to another page uses a native view transition where supported and a plain navigation elsewhere
  5. The team band shows all seven black-and-white faces in a new order on each load and when it enters view. Commitments and receipts the owner has not confirmed show as visible pending or `[RECEIPT: …]` markers

**Plans**: TBD
**UI hint**: yes

### Phase 3: Services & Proof

**Goal**: A buyer can see exactly what ZINC delivers for each service, where it sits in the loop, and the client work that proves it
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, LOOP-03, WORK-01, WORK-02, WORK-03, WORK-04, WORK-05
**Success Criteria** (what must be TRUE):

  1. `/services/` shows the three-layer loop with all 11 services linked. Each flat URL, from `/services/shopify/` through `/services/business-intelligence/`, returns its page. No URL carries a layer folder, and no URL or label uses "GEO"
  2. Each service page shows:
     - the service name and one plain line on what it does;
     - a mini loop that lights only the layers that apply;
     - a spec sheet: deliverables, cadence, what the client owns, and how it is reported;
     - proof.
  3. Each service page answers 4–6 buyer questions, and its FAQPage structured data validates
  4. `/work/` shows the logo wall and both case studies. OUABC and U.S. Oil each open with a result strip, then the situation, the lit mini loop, the work by layer and device-framed screenshots. Live links go only to client public sites; reporting systems and internal apps appear only as screenshots
  5. Every unconfirmed number renders as a visible `[RECEIPT: …]` placeholder. A launch check lists every remaining placeholder and fails while any remain

**Plans**: TBD
**UI hint**: yes

### Phase 4: About & Inquiry

**Goal**: A convinced prospect can meet the team and send a qualified inquiry that reaches Jaymie, or text the line
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: ABOU-01, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, SERV-05, LNCH-02
**Success Criteria** (what must be TRUE):

  1. `/about/` shows:
     - the opening statement;
     - all seven team members, in a new random order on each load;
     - Miami HQ, nationwide work and the Panama City satellite;
     - how an engagement runs.
  2. A visitor can complete the form in short progressive steps, or as one page with JavaScript off. The form asks for services grouped by layer and the four budget tiers. Following any service page's inquiry action opens `/contact/?service=<slug>` with that service preselected
  3. A valid submission from the preview deploy arrives at `jaymie@zincdigital.co` through Nodemailer and smtp.gmail.com:465, and the visitor lands on `/thanks/`. A submission that fails Turnstile or fills the honeypot is rejected, and no email is sent
  4. (786) 575-4837 appears beside the Contact form, in the homepage intro band and in the shared footer. A site-wide scan finds no public pricing
  5. The form stays off for live submissions until a fresh authoritative DNS check returns exactly one SPF record including `_spf.google.com`, and live mail delivery is validated. All four Route 53 nameservers returned one such record on 2026-09-26; recheck before activation. No DNS change is requested by this criterion. The App Password and Turnstile secrets exist only as Vercel environment variables, entered by the owner

**Plans**: TBD
**UI hint**: yes

### Phase 5: Blog, SEO & Redirects

**Goal**: Search engines and visitors can find every page of the new site, including all 18 posts, and no old URL is left dead
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: BLOG-01, BLOG-02, BLOG-03, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, MIGR-01, MIGR-02
**Success Criteria** (what must be TRUE):

  1. All 18 live WordPress posts read at `/blog/<slug>/`, polished in the `zinc-author-voice` lane. Each has an author card, related services and valid Article data. `/blog/` filters by Build, Demand and Intelligence, and the homepage latest-articles band shows the three newest real posts
  2. Every page, including `/privacy/`, `/terms/` and the 404 page, has a unique title, meta description, canonical URL and generated share image. Organization, LocalBusiness (Miami), Service, Article, FAQPage and BreadcrumbList data validate on their templates
  3. The sitemap lists every indexable page and every post, and `robots.txt` and `llms.txt` are served. Categories and tags are new and built around the three layers; no WordPress taxonomy carries over
  4. Google tag `GT-NNZRWNCF` sends GA4 (`G-BV43HRVJ18`) and Ads (`AW-17071018445`) hits from every page, and each page stays at or under 15 KB of gzipped JS. `/privacy/` discloses the measurement, and no cookie banner appears
  5. The redirect script checks every old URL from the WordPress REST API and the Search Console export against the preview deploy. Each URL either 301s in one hop to its mapped target or returns 410, all from `src/lib/redirects.ts`, and the script exits non-zero on any miss

**Plans**: TBD
**UI hint**: yes

### Phase 6: Launch Readiness & Owner Approval

**Goal**: Every template meets the launch gates on the preview, every line of copy is clean and owner-approved, and the owner signs final approval
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, COPY-01, COPY-02, LNCH-01
**Success Criteria** (what must be TRUE):

  1. Every template scores Lighthouse mobile 100 for Performance, SEO, Accessibility and Best Practices on the preview:
     - home, the services index, service, the work index, case study and about;
     - contact, thanks, the blog index, article, privacy, terms and 404.
     Each also measures LCP ≤ 1.2 s, CLS 0, INP < 100 ms and ≤ 15 KB of gzipped JS per page.
  2. Every template passes WCAG 2.2 AA contrast and can be run fully from the keyboard. A crawl of the preview finds zero broken internal links
  3. A scan of all shipped copy finds:
     - no legacy line, no "GEO", no cursing and no sales device;
     - no leftover `[RECEIPT: …]` or placeholder text;
     - only testimonials the owner marked real, each beside the work it describes.
  4. The owner has reviewed desktop and mobile screenshots of every template and approved the selected full-site direction, copy batches, receipts, "How we work", testimonials, team photos and final launch gates. No dates are assigned until the owner sets a launch schedule

**Plans**: TBD
**UI hint**: yes

### Phase 7: Cutover

**Goal**: `www.zincdigital.co` serves the new site from Vercel, with mail untouched and Kinsta kept as the rollback path
**Mode:** mvp
**Depends on**: Phase 6 (final approval) and LNCH-02; remeasure SPF and validate mail delivery before enabling live inquiry
**Requirements**: LNCH-03, LNCH-04
**Success Criteria** (what must be TRUE):

  1. The owner lowers the Route 53 web-record TTLs 24–48 h before cutover, confirms them with `dig`, and saves a full zone export for comparison and rollback. No target date is assigned
  2. On the owner's explicit go, `zincdigital.co` and `www` resolve to Vercel and serve the new site over HTTPS. MX, SPF, DKIM and DMARC records match the pre-cutover export exactly, and Kinsta stays up as the rollback path for about 30 days
  3. On the live domain:
     - the redirect script passes 100%, and the Lighthouse gates re-run green;
     - GA4 receives hits;
     - the sitemap is submitted in Search Console;
     - a test inquiry reaches Jaymie.

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design System & Full-Site Acceptance | 2/2 live | Selected design implemented; verification pending | - |
| 2. Homepage & the Loop | 0/TBD | Implementation present; acceptance pending | - |
| 3. Services & Proof | 0/TBD | Mockup present; production proof pending | - |
| 4. About & Inquiry | 0/TBD | About/demo present; live inquiry pending | - |
| 5. Blog, SEO & Redirects | 0/TBD | Blog mockup present; production migration pending | - |
| 6. Launch Readiness & Owner Approval | 0/TBD | Prior checks exist; formal launch acceptance pending | - |
| 7. Cutover | 0/TBD | Not started; custom domain remains WordPress | - |
