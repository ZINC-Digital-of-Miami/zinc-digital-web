# Roadmap: ZINC Digital Website (zinc-digital-web)

## Overview

The new `www.zincdigital.co` goes from an empty Astro repo to a live Vercel site in seven phases over 5–7 days from 2026-09-25 (CT). Phase 1 puts the visual system in front of the owner on a rendered homepage mockup so he can pick the font pairing. Phases 2–4 build the pages that sell: the homepage and its Loop, then services and proof, then the team page and the qualifying inquiry. Every band component takes props and never fetches data itself, so these pages build on fixture data while the owner reviews copy in dated batches. Phase 5 makes the site findable: 18 posts, the full SEO override, and every old WordPress URL resolved. Phase 6 holds the launch gates and the owner's final approval. Phase 7 is the DNS cutover, and it runs only on the owner's explicit go.

**Authority:** `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md`. The spec's §18 resolved decisions win over research.

**Owner review calendar (LNCH-01; all dates CT, Day 1 = Sat 2026-09-26):**

| Day | Date (CT) | Owner gate | Phase |
|-----|-----------|------------|-------|
| 1 | Sat 2026-09-26 | Font pairing pick from the rendered mockup | 1 |
| 2 | Sun 2026-09-27 | Copy batch: homepage bands | 2 |
| 3 | Mon 2026-09-28 | Copy batch: services and case studies | 3 |
| 4 | Tue 2026-09-29 | Copy batch: about and contact; SPF record applied in Route 53 (LNCH-02) | 4 |
| 5 | Wed 2026-09-30 | Copy batch: blog; receipts, "How we work", real-vs-placeholder testimonials, Jaymie and Wendy photos; DNS TTLs lowered | 5 / 6 / 7 |
| 6 | Thu 2026-10-01 | Final approval | 6 |
| 7 | Fri 2026-10-02 | Cutover, on the owner's explicit go at that moment | 7 |

**Budgets carried by every UI phase:** each phase checks its own templates against the §10 budgets on its Vercel preview (Lighthouse mobile 100×4, LCP ≤ 1.2 s, CLS 0, ≤ 15 KB gzip JS). Phase 6 is the formal gate across all templates.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Design System & Font Pick** - Tokens, band theming, self-hosted type and brand mark, rendered as a homepage mockup in three font pairings for the owner to choose from
- [ ] **Phase 2: Homepage & the Loop** - Nine alternating bands on `/`, with the scroll-drawn Loop as the signature and the finished state designed for reduced motion and Firefox
- [ ] **Phase 3: Services & Proof** - `/services/`, 11 flat service pages, `/work/` and both case studies, each with the mini loop lit
- [ ] **Phase 4: About & Inquiry** - `/about/` team page and the qualifying contact form delivering to Jaymie, gated on the SPF repair
- [ ] **Phase 5: Blog, SEO & Redirects** - 18 migrated posts, the full SEO override and analytics, and every old URL resolved to a 301 or 410
- [ ] **Phase 6: Launch Readiness & Owner Approval** - Every template passes the §10 gates, all copy is clean and approved, and the owner gives final approval
- [ ] **Phase 7: Cutover** - Route 53 points to Vercel on the owner's go, with mail untouched, live checks run and Kinsta kept for rollback

## Phase Details

### Phase 1: Design System & Font Pick
**Goal**: The owner sees ZINC's visual system on a real homepage mockup and picks the font pairing every later page uses
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05
**Success Criteria** (what must be TRUE):
  1. On a Vercel preview URL, the owner can view the homepage hero and one service spec sheet in each of three open-license variable font pairings (Archivo excluded), and his pick is recorded (Day 1 gate, Sat 2026-09-26 CT)
  2. The mockup alternates near-black `#0A0A0B` and snow-white `#F5F6F7` bands, each set by one `data-theme` attribute, and the bands do not change when the OS switches between light and dark mode
  3. Magenta `#FC0781` appears only on black bands, and dark teal appears only on white bands (`#07B2B2` for display and graphics, `#057E7E` for small text). Every accent use passes WCAG AA contrast for its size
  4. On a throttled mobile load, the chosen pairing arrives in ≤ 3 self-hosted subset files, and the swap from the metric-matched fallback measures CLS 0 on the hero
  5. The circuit-brain mark and the ZINC wordmark render crisply on both grounds at mobile and desktop widths
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — Walking skeleton: scaffold, token system, Pairing A hero on a protected Vercel preview (owner gates: package legitimacy + Vercel go; owner opens preview)
- [ ] 01-02-PLAN.md — Band gate (check-bands), brand mark on both grounds, dark brand band with magenta, spec sheet, stress fixture
- [ ] 01-03-PLAN.md — Font-budget gate (check-fonts), nine-font config, Pairings B and C, pairing index
- [ ] 01-04-PLAN.md — Overflow/axe and deployed Lighthouse/CLS gates in one command; Day 1 owner pick (Sat 2026-09-26 CT)
- [ ] 01-05-PLAN.md — Record the pick, collapse to the chosen pairing on `/`, delete preview scaffolding, re-measure
**UI hint**: yes

### Phase 2: Homepage & the Loop
**Goal**: A visitor to `/` reads the whole ZINC story in nine alternating bands, and the Loop drawing itself on scroll is the moment they remember
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: LOOP-01, LOOP-02, MOTN-01, MOTN-02, MOTN-03, MOTN-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08
**Success Criteria** (what must be TRUE):
  1. A visitor sees the nine bands in spec order:
     - the hero core line with the magenta strike, the highlight, a contact action and `Text (786) 575-4837`;
     - the logo wall, with each logo flipping to the band's accent on hover or tap;
     - the Loop, OUABC, the U.S. Oil timeline, How we work, the team and latest articles;
     - the footer, with its closing line, text line, locations and socials.
  2. In Chrome and Safari 26+, scrolling the pinned Loop band draws the circuit line and sends the pulse around Build → Demand → Intelligence. Each layer scales up as the pulse reaches it, and every service is listed as a link. All of this runs on native CSS only, with no animation library and no WebGL
  3. With reduced motion on, and in Firefox 156, every band shows its designed finished state with no content missing, and the owner has approved the finished Loop state
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
  4. (786) 575-4837 appears beside the form, in the hero and in the footer. A site-wide scan finds no public pricing
  5. The form stays off for live submissions until SPF is repaired. The repair is measured when `dig +short TXT zincdigital.co` returns exactly one SPF record, and it includes `_spf.google.com` (the owner applies it in Route 53, LNCH-02). The App Password and Turnstile secrets exist only as Vercel environment variables, entered by the owner
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
  4. The owner has reviewed desktop and mobile screenshots of every template and signed each dated gate: the Day 1 font pick, the Day 2–5 copy batches, the Day 5 inputs (receipts, How we work, testimonials, Jaymie and Wendy photos) and the Day 6 final approval (Thu 2026-10-01 CT)
**Plans**: TBD
**UI hint**: yes

### Phase 7: Cutover
**Goal**: `www.zincdigital.co` serves the new site from Vercel, with mail untouched and Kinsta kept as the rollback path
**Mode:** mvp
**Depends on**: Phase 6 (final approval), with the LNCH-02 SPF repair measured in Phase 4
**Requirements**: LNCH-03, LNCH-04
**Success Criteria** (what must be TRUE):
  1. The Route 53 web-record TTLs were lowered 24–48 h before cutover (owner-applied, target Wed 2026-09-30 CT, confirmed with `dig`), and a full zone export is saved for comparison and rollback
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
| 1. Design System & Font Pick | 0/TBD | Not started | - |
| 2. Homepage & the Loop | 0/TBD | Not started | - |
| 3. Services & Proof | 0/TBD | Not started | - |
| 4. About & Inquiry | 0/TBD | Not started | - |
| 5. Blog, SEO & Redirects | 0/TBD | Not started | - |
| 6. Launch Readiness & Owner Approval | 0/TBD | Not started | - |
| 7. Cutover | 0/TBD | Not started | - |
