# Requirements: ZINC Digital Website (zinc-digital-web)

**Defined:** 2026-09-25 (CT)
**Core Value:** The right prospect leaves certain ZINC is the serious option — and sends a qualified inquiry or a text about a specific service — on a site that loads instantly and ranks.
**Authority:** `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` (§ numbers below). Spec §18 resolved decisions win over research.

## v1 Requirements

### Design System (DSGN)

- [ ] **DSGN-01**: Owner can compare three open-license variable font pairings rendered on the real homepage hero and a service spec sheet, and picks one (§8)
- [ ] **DSGN-02**: Every page uses one token set: near-black `#0A0A0B`, cool snow white `#F5F6F7`, one body gray per ground, magenta `#FC0781` only on black bands, dark teal `#07B2B2` (display/graphics) and `#057E7E` (small text) only on white bands (§8, §18)
- [ ] **DSGN-03**: Each band sets its ground with one `data-theme` attribute; black and white alternate by band independent of OS color scheme (§8)
- [ ] **DSGN-04**: Display type loads self-hosted, subset, ≤ 3 font files, with metric-matched fallbacks so the font swap causes zero layout shift (§8, §18)
- [ ] **DSGN-05**: The circuit-brain mark and ZINC wordmark render crisply on both grounds (§8)

### Motion (MOTN)

- [ ] **MOTN-01**: In browsers with scroll timelines, scenes animate on scroll using native CSS only — no animation library, no WebGL (§9)
- [ ] **MOTN-02**: With reduced motion on, or in a browser without scroll timelines (Firefox 156), every scene shows a designed finished state with no content missing (§9, §18)
- [ ] **MOTN-03**: Page-to-page navigation uses native view transitions where supported and plain navigation elsewhere (§9)
- [ ] **MOTN-04**: Pinned scenes hold steady on a real iPhone (Safari) without jumps from the dynamic toolbar (§9)

### The Loop (LOOP)

- [ ] **LOOP-01**: Visitor sees Build → Demand → Intelligence as one loop, each layer listing its services as links (§4, §6.1)
- [ ] **LOOP-02**: On the homepage, the circuit line draws as the visitor scrolls, a pulse travels the loop, and each layer scales up when the pulse reaches it (§6.1)
- [ ] **LOOP-03**: A mini loop on each service page and case study lights only the layers that apply (§6.2, §6.3)

### Homepage (HOME)

- [ ] **HOME-01**: Hero shows "Other agencies deliver the scope. ZINC delivers the business." with the strike and highlight hits, a contact action, and `Text (786) 575-4837` (§6.1)
- [ ] **HOME-02**: Logo wall shows Porsche, Home Depot, John Deere, YMCA, General Shale, Once Upon a Book Club, U.S. Oil Solutions; logos flip to the band's accent on hover/tap (§6.1)
- [ ] **HOME-03**: OUABC band shows tenure, services run, live link, screenshots, and receipts (§6.1)
- [ ] **HOME-04**: U.S. Oil band shows site → SEO → two apps → next build as a stamped timeline (§6.1)
- [ ] **HOME-05**: "How we work" band shows 4–5 commitments, each confirmed true by the owner (§6.1, §13)
- [ ] **HOME-06**: Team band shows all seven faces in black and white, reshuffled on every load and on entering view (§6.1)
- [ ] **HOME-07**: Latest-articles band shows the three newest posts (§6.1)
- [ ] **HOME-08**: Footer shows a new closing line, short form entry, text line, Miami HQ · Panama City satellite · nationwide, and socials (§6.1)

### Services (SERV)

- [ ] **SERV-01**: `/services/` presents the three-layer loop with every service linked (§5)
- [ ] **SERV-02**: Eleven service pages exist at flat `/services/<slug>/` URLs — shopify, web-design, apps, seo, local-seo, ai-search-optimization, google-search-ads, shopping-ads, social-ads, tiktok-ads, business-intelligence (§4)
- [ ] **SERV-03**: Each service page shows the name, a plain line on what it does, a spec sheet (deliverables, cadence, what the client owns, how it's reported), and proof (§6.2)
- [ ] **SERV-04**: Each service page answers 4–6 real buyer questions with FAQ structured data (§6.2)
- [ ] **SERV-05**: Each service page's inquiry action opens `/contact/?service=<slug>` with that service preselected (§6.2)

### Work (WORK)

- [ ] **WORK-01**: `/work/` shows the logo wall and both case studies (§5)
- [ ] **WORK-02**: `/work/once-upon-a-book-club/` leads with a result strip, then situation, lit loop, work by layer, screenshots, and a real testimonial if one exists (§6.3, §18)
- [ ] **WORK-03**: `/work/us-oil-solutions/` follows the same structure (§6.3)
- [ ] **WORK-04**: Every unconfirmed number renders as a visible `[RECEIPT: …]` placeholder and blocks launch until confirmed (§13)
- [ ] **WORK-05**: Reporting systems and internal app pages appear only as screenshots, never as links (§6.3)

### About (ABOU)

- [ ] **ABOU-01**: `/about/` shows an opening statement, all seven team members in random order on each load, locations, and how an engagement runs (§6.4)

### Contact (CONT)

- [ ] **CONT-01**: Visitor can submit name, company, work email, website, services (grouped by layer), budget (`Under $5k/mo`, `$5–10k/mo`, `$10–25k/mo`, `$25k+/mo`), timeline, and message in short progressive steps; the form still works as one page with JavaScript off (§6.5, §18)
- [ ] **CONT-02**: A valid submission is emailed to `jaymie@zincdigital.co` via Nodemailer → smtp.gmail.com:465 with a Workspace App Password, and the visitor lands on `/thanks/` (§14, §18)
- [ ] **CONT-03**: Submissions failing Turnstile server verification or filling the honeypot are rejected without sending email (§14)
- [ ] **CONT-04**: The text line (786) 575-4837 appears beside the form and in the hero and footer (§6.5)
- [ ] **CONT-05**: No public pricing appears anywhere on the site (§6.5)

### Blog (BLOG)

- [ ] **BLOG-01**: All 18 live posts are published at `/blog/<slug>/`, polished in the `zinc-author-voice` lane (§12)
- [ ] **BLOG-02**: `/blog/` lists posts filterable by layer (§6.6)
- [ ] **BLOG-03**: Each article shows author card, related services, and Article structured data (§6.6)

### Copy (COPY)

- [ ] **COPY-01**: All site copy is new, in the §7 voice, with no legacy lines, no cursing, no sales devices, and never "GEO" (§7)
- [ ] **COPY-02**: Only real, attributable testimonials ship, each beside the work it describes (§13)

### SEO (SEO)

- [ ] **SEO-01**: Every page has a unique title, meta description, canonical URL, and share image (§11)
- [ ] **SEO-02**: Structured data validates: Organization, LocalBusiness (Miami), Service, Article, FAQPage, BreadcrumbList (§11)
- [ ] **SEO-03**: The sitemap lists every indexable page including every post; `robots.txt` and `llms.txt` are served (§11)
- [ ] **SEO-04**: New categories and tags are built around the three layers; no WordPress taxonomy carries over by default (§11)
- [ ] **SEO-05**: Google tag `GT-NNZRWNCF` (GA4 `G-BV43HRVJ18`, Ads `AW-17071018445`) fires on every page without breaking the JS budget; the privacy page discloses it; no cookie banner (§11, §18)

### Migration (MIGR)

- [ ] **MIGR-01**: Every old WordPress URL (from the REST API and Search Console) either 301s to its mapped target or returns 410, from one source file (§12, §18)
- [ ] **MIGR-02**: A script checks every old URL against the preview deploy and fails on any miss (§12, §10)

### Quality Gates (QUAL)

- [ ] **QUAL-01**: Every template scores Lighthouse mobile 100 on Performance, SEO, Accessibility, Best Practices (§10)
- [ ] **QUAL-02**: LCP ≤ 1.2 s, CLS 0, INP < 100 ms, ≤ 15 KB gzip JS per page (§10)
- [ ] **QUAL-03**: WCAG 2.2 AA contrast and full keyboard access on every template (§10)
- [ ] **QUAL-04**: Zero broken internal links (§10)
- [ ] **QUAL-05**: Desktop and mobile screenshots of every template are reviewed by the owner (§10)

### Launch (LNCH)

- [ ] **LNCH-01**: Owner review gates are held on dated checkpoints: Day 1 font pick; Days 2–5 copy batches; Day 5 receipts, "How we work", testimonials, Jaymie/Wendy photos; Day 6 final approval (§18)
- [ ] **LNCH-02**: Before the form goes live, `zincdigital.co` has one SPF record authorizing Google Workspace (owner applies the §18 record in Route 53) (§18)
- [ ] **LNCH-03**: DNS TTLs are lowered 24–48 h ahead; on the owner's explicit go, Route 53 web records point to Vercel with mail records untouched (§15)
- [ ] **LNCH-04**: After cutover on the live domain: every redirect passes, sitemap submitted in Search Console, GA4 receives hits, a test inquiry reaches Jaymie, Lighthouse gates re-run (§15)

## v2 Requirements

### Content

- **CNTN-01**: Remaining recovered blog posts publish into `/blog/` through the content machine
- **CNTN-02**: Additional case studies beyond OUABC and U.S. Oil Solutions
- **CNTN-03**: RSS feed for the blog
- **CNTN-04**: "How did you hear about us" form field

## Out of Scope

| Feature | Reason |
|---------|--------|
| Branding / graphic design service | Dropped by the owner |
| Public pricing | Anchors buyers low; the budget question filters |
| CMS | Posts live in git |
| Client portal, logins, live dashboards | Not the site's job |
| Testimonial carousels, stat counters, award badges, guarantees, comparison tables, "free consultation" CTAs | Owner: no sales pitch |
| Live chat / chatbots, pop-ups, hero background video | Same rule; JS and LCP budget (§18) |
| Cookie banner | U.S. audience, below CCPA thresholds (§18) |
| 3D / WebGL, animation libraries | Performance gate |
| Site search, dark-mode toggle, personalization | Not needed at this content volume; conflicts with fixed band theming |
| Changes to the live WordPress site before cutover | Protect the live site |

## Traceability

(Filled by roadmap creation.)

---
*Requirements defined: 2026-09-25*
*Last updated: 2026-09-25 after initial definition*
