# zinc-digital-web — Complete Turnover

**Written:** 2026-09-25, 3:20 PM CT · **Owner:** Kirk Musick, MS, MBA — ZINC Digital
**Purpose:** everything a new operator needs, in one document. Part A is the decision register and the build plan. Part B is the approved spec, requirements and roadmap, verbatim. Part C is the exact brief for the next build. Part D is live state, owner actions, and how to resume. No secrets.

---

## A. Decision register (owner interview, 2026-09-25, in order)

| # | Question | Owner's decision |
|---|---|---|
| 1 | Baseline | Clean slate. The live WordPress site, the May Framer notes and the July "V2" prototype are fact sources only. Neither look is binding. |
| 2 | Platform | Astro on Vercel, in the existing empty repo `ZINC-Digital-of-Miami/zinc-digital-web`. No CMS; posts live in git. |
| 3 | Launch scope | Core pages + migrated blog + full 301 map at cutover. |
| 4 | Job of the site | A prospect leaves certain ZINC is the serious option before a referral call, and sends a qualified inquiry or texts about a lane. Clients today come from referrals, LinkedIn, network; the site must also win strangers. |
| 5 | Services (new list) | Apps, SEO, social ads, Merchant Center/Shopping ads, TikTok ads, web design, generative search optimization, Shopify ecommerce specialist. **Kept** from the old list: business intelligence, Google Search Ads, local SEO. **Dropped:** branding / graphic design. |
| 6 | Target client | Modeled on Once Upon a Book Club (Phoenix; ~3 years; ~$21k/month; high-touch). Second anchor: U.S. Oil Solutions (Las Vegas; site, SEO, two apps, more coming). Nationwide, jargon-fluent, often burned by prior agencies. Marketing directors and CFOs/C-level both read it. |
| 7 | Core message | Other agencies deliver the scope. ZINC delivers the business. Proof story: 70+ unpaid hours building OUABC's reporting system because they mentioned it. |
| 8 | Proof allowed | Name OUABC, U.S. Oil and Summit Marine with live links; reporting systems and internal app pages only as screenshots. Past clients whose logos may be shown: Porsche, Home Depot, General Shale, YMCA, John Deere. Real testimonials exist; the live site's set is part placeholder; each must be marked real/placeholder by the owner. No sales devices at all (no stat counters, badges, guarantees, comparison tables, "free consultation", carousels; also no chat widgets, pop-ups, hero video). |
| 9 | Voice | Fresh, site-only voice built from the core line: short declaratives, one contrast per idea, senior, no slang, **no cursing**, no exclamation points, nouns and receipts over adjectives. `kirk-voice` and every legacy line ("You bring the mess…", "Coded in Miami. With cafecitos.", etc.) are retired for this site. Blog bylines use `zinc-author-voice`. Never "GEO". |
| 10 | Look | Big headers, big moving parts, unexpected actions, white and black, little color but loud when used. Snow white with a touch of gray (`#F5F6F7`), never warm/yellow. Direction chosen: the Loop as signature + editorial ("annual report") type discipline; bands alternate black/white. |
| 11 | Color | Magenta `#FC0781` (live-site global secondary) only on black bands. Dark teal `#07B2B2` (live `--primary-color`) on white for display/graphics, `#057E7E` for small teal text on white. All other live accents out. |
| 12 | Motion | Native CSS scroll-driven animation, view transitions, reduced-motion finished states; no animation library, no 3D. Must stay instant and rank. Blend for CFOs: bands 1/3/4 carry drama, others stay calm. |
| 13 | Structure | One system, three layers (working names Build · Demand · Intelligence). Work shown before services. One flat URL per service (11 pages). |
| 14 | Inquiry | Form qualifies (budget `Under $5k/mo`, `$5–10k`, `$10–25k`, `$25k+`), spam-protected, delivered to `jaymie@zincdigital.co`. Text line (786) 575-4837 (Miami) always available. No public pricing. |
| 15 | Team | Current and complete: Kirk Musick (CEO), Jaymie Wilhoit (Managing Partner), Wendy Funnell (Chief Content Officer), Bethany McKinzie (Business Strategy & HR), Priya Nahar MBA (Shopify Developer), Martin Stewart (Glide Expert & App Developer), Dr. Basset (Code). Full grid, random order every load. Miami HQ, working nationwide, Panama City satellite. |
| 16 | Blog & SEO | 18 live posts at launch, polished; recovered queue continues after. Full SEO override (new taxonomy, titles, structured data, complete sitemap, llms.txt, GA4/Ads tags carried). |
| 17 | Timeline | No fixed date; sooner the better; 5–7 days. |
| 18 | Case studies | OUABC is the flagship (TikTok ads, Shopping ads, blog content, Meta ads, web updates, reporting system). U.S. Oil second. Draft with best available; every unconfirmed number is a `[RECEIPT: …]` marker. |
| 19 | Research conflicts | "Resolve all conflicts" → spec §18: 410 via one catch-all route; form email Nodemailer→smtp.gmail.com:465 App Password; rate limit Turnstile+honeypot (+Vercel WAF only at $0); case studies lead with a result strip; form in progressive steps, single POST; no cookie banner; Firefox finished-state is first-class. Zoho is no longer used (SPF record simplified). |
| 20 | Process | GSD adaptive profile, every piece of work reviewed by a fresh agent, phases in worktrees, PR to `main`. Owner then cut the ceremony: "get this together this week." |
| 21 | Deployment | Public production URL `zinc-digital-web.vercel.app`, noindex until launch. **Do not add the domain yet.** Custom domain on Pro costs $0 extra when it is added. |
| 22 | Visual QA | "Start doing a visual check before you stop" — every hand-off carries the agent's own 1440 + 375 screenshots. |
| 23 | Hero feedback | Supporting line copy rejected; no underlined links; page must not start with a big empty band; must read crisp, tight, high-def like the live site. |
| 24 | Next deliverable | "I have not even seen the first complete mockup yet" → the complete nine-band homepage, not a lone hero. Owner chose **Replan from scratch** for plans 01-02..01-05. Not yet done. |

---

## B1. Site map (spec §5)

```
/                               Home (nine bands)
/work/                          Logo wall + case studies
/work/once-upon-a-book-club/    Flagship case
/work/us-oil-solutions/         Second case
/services/                      The loop: Build · Demand · Intelligence
/services/<slug>/               shopify · web-design · apps ·
                                seo · local-seo · ai-search-optimization · google-search-ads ·
                                shopping-ads · social-ads · tiktok-ads ·
                                business-intelligence
/about/                         Team (random order) + locations
/contact/                       Qualifying form + text line
/blog/  /blog/<slug>/           18 posts, filtered by layer
/privacy/  /terms/  /thanks/  404
```

## B2. Homepage — nine bands (spec §6.1)

| # | Band | Ground | Content | Motion |
|---|---|---|---|---|
| 1 | Hero | white | Core line huge; supporting line slot `[DRAFT]`; "Start an Inquiry"; `Text (786) 575-4837` | teal strike on "the scope", teal highlight on "the business" |
| 2 | Logo wall | black | Porsche, Home Depot, John Deere, YMCA, General Shale, OUABC, U.S. Oil | logos flip to magenta on hover/tap |
| 3 | The Loop | white (pinned) | Build → Demand → Intelligence, each listing its services as links | line draws on scroll; pulse travels; layer scales as pulse arrives |
| 4 | OUABC | black | tenure, services run, live link, screenshots, `[RECEIPT]`s, reporting-system story | mini loop lights OUABC's layers |
| 5 | U.S. Oil | white | site → SEO → two apps → next build | timeline steps stamp in |
| 6 | How we work | black | 4–5 commitments `[OWNER CONFIRM]` | lines type in, then lock |
| 7 | Team | white | all seven, B&W, random order each load | reshuffle on entering view |
| 8 | Latest articles | black | three newest posts | none |
| 9 | Footer | white | new closing line `[DRAFT]`, form entry, text line, Miami HQ · Panama City · nationwide, socials | one restrained accent moment |

## B3. Roadmap (7 phases, 57 requirements, all mapped)

| Phase | Goal | Requirements |
|---|---|---|
| 1 Design System & Font Pick | Owner sees the system on a real homepage mockup in three font pairings and picks one | DSGN-01..05 |
| 2 Homepage & the Loop | Nine bands at `/`, the Loop drawing on scroll | LOOP-01, LOOP-02, MOTN-01..04, HOME-01..08 |
| 3 Services & Proof | 11 service pages + OUABC and U.S. Oil case studies | SERV-01..04, LOOP-03, WORK-01..05 |
| 4 About & Inquiry | Team page; qualifying form reaching Jaymie; text line | ABOU-01, CONT-01..05, SERV-05, LNCH-02 |
| 5 Blog, SEO & Redirects | 18 posts live; full SEO layer; every old URL 301 or 410 | BLOG-01..03, SEO-01..05, MIGR-01..02 |
| 6 Launch Readiness & Owner Approval | Every template passes §10 gates; copy clean; owner signs | QUAL-01..05, COPY-01..02, LNCH-01 |
| 7 Cutover | Route 53 (MyKinsta DNS) → Vercel on the owner's go; mail untouched; Kinsta kept ~30 days | LNCH-03..04 |

**Phase 1 status:** plan 01-01 complete (scaffold, tokens, fonts, Pairing A hero, public noindex URL). Plans 01-02..01-05 are stale and must be replaced by Part C.

---

## C. The next build — brief for "Replan from scratch" (Phase 1, plans 01-02..01-05)

Give this to the planner verbatim. It replaces the stale plans.

**Wave 2 — the complete homepage at `/`, Pairing A, deployed to `zinc-digital-web.vercel.app`, screenshot-verified at 1440 and 375 before anyone shows the owner.**

- Replace the `/` → `/design-preview/a/` redirect in `astro.config.mjs` with a real `src/pages/index.astro`.
- All nine bands of B2 with alternating `data-theme`; content starts directly under the top of the page; no empty lead-in.
- Hero: core line at `clamp(3.5rem, 10vw + 1rem, 12.5rem)`; supporting line as a `[DRAFT]` slot; teal marks (`#07B2B2`, decorative); "Start an Inquiry" button; text link — **no underlines anywhere**, tokens only, hover + focus-visible states.
- Logo wall: official SVGs where obtainable; otherwise clean monochrome wordmark flagged `[LOGO PENDING]`.
- Loop: static finished-state SVG (animation is Phase 2) that looks finished, layers listing services.
- OUABC: screenshots from the July zip (`assets/ouabc-hero.png`, `ouabc-site.jpg`, `ouabc-mobile.jpg`) in a CSS device frame; services list; `[RECEIPT: …]` placeholders.
- U.S. Oil: `assets/uos-app-desktop.png`, `uos-app-phone.png`; timeline.
- How we work: 4–5 commitments `[OWNER CONFIRM]`.
- Team: `assets/kirk-musick.png`, `bethany-mckinzie.png`, `priya-nahar.png`, `dr-basset.png`, `martin-stewart.png` (B&W); Jaymie and Wendy as clean `[PHOTO PENDING]` tiles; tiny inline shuffle script.
- Latest articles: three real titles via read-only `GET https://www.zincdigital.co/wp-json/wp/v2/posts?per_page=3`, linking to live URLs for now.
- Footer: closing line `[DRAFT]`; `Text (786) 575-4837`; `hello@zincdigital.co`; 1900 N Bayshore Dr, Miami FL 33132 · 97 Oak Ave Suite 7, Panama City FL 32401 · nationwide; socials (FB /zincdigitalofmiami, IG @zincdigitalofmiami, X @zinc_of, LinkedIn /company/zinc-digital-of-miami, YouTube).
- Assets come ONLY from `/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website V2.zip` → `assets/`, extracted into `src/assets/`; never its HTML/CSS/copy. Retina: 2x sources through `astro:assets` (AVIF/WebP).
- Deploy: `vercel deploy --prod --scope zincdigitalofmiamis-projects` from the phase worktree. Verify `vercel ls` shows Production only for this deploy, `x-robots-tag: noindex` present, domains list = `zinc-digital-web.vercel.app` only.

**Wave 3 —** Pairings B (Barlow Condensed / Public Sans / IBM Plex Mono) and C (Oswald / IBM Plex Sans / Space Mono) rendered on the same complete homepage at `/design-preview/b/` and `/c/` + index; ≤3 font files per pairing.

**Wave 4 —** gates on the deployed URL: axe 0 violations; Lighthouse mobile Performance/Accessibility/Best Practices 100 (SEO may skip only is-crawlable because of the intentional noindex); CLS 0; ≤15 KB JS; computed-style check: zero underlined links; band-theme check. Then the owner's font pick.

**Wave 5 —** collapse to the chosen pairing; remove extra routes; re-measure.

Rules for every task: storage/temp/caches under `/Volumes/Satechi Hub/` only; no secrets in tracked files; no paid services; Node 24; Central time; never add a custom domain; production deploys to the vercel.app URL are owner-authorized.


---

# Part B (verbatim) — Approved design spec

## ZINC Digital — Site Redesign Design Spec

**Date:** 2026-09-25 (CT)
**Owner:** Kirk Musick, MS, MBA — ZINC Digital
**Status:** Approved in brainstorming interview, 2026-09-25. Source for `/gsd-new-project`.
**Repo:** `ZINC-Digital-of-Miami/zinc-digital-web` (this repo). Clean start — nothing is inherited from the live WordPress site, the July 2026 "Website V2" prototype, or the May 2026 Framer brainstorm except the facts listed under Content inputs.

---

## 1. Objective

Replace `www.zincdigital.co` (WordPress + Elementor + Mouno on Kinsta) with a new, custom, static-first site.

**The job of the site:** the right prospect leaves certain that ZINC is the serious option — before a referral call — and sends a qualified inquiry through the form, or texts about a specific service.

**Growth goal:** today clients come from referrals, LinkedIn, and Kirk's network. The site must also win new clients who have never heard of ZINC.

## 2. Audience

- **Model client:** Once Upon a Book Club (OUABC). Ecommerce brand, almost three years with ZINC, about $21k/month with the agency, very high-touch, multiple services.
- **Second anchor:** U.S. Oil Solutions (Las Vegas). ZINC built the site, runs SEO, built two apps, more work starting.
- **Buyer:** established brands, nationwide (Phoenix, Las Vegas, Virginia, Florida, and beyond), fluent in marketing language, often let down by past agencies.
- **In the room:** marketing directors *and* CFOs / C-level. The design must thrill the first and reassure the second.
- The "let down by past agencies" profile describes the audience. It is **not** a copy theme. The site does not dwell on other agencies failing.

## 3. Positioning

- **Core line (approved):** "Other agencies deliver the scope. ZINC delivers the business."
- **Proof story:** ZINC builds what the business needs before being asked. Example: Kirk spent 70+ unpaid hours building OUABC a reporting system because they mentioned needing it.
- **Pattern to show:** clients start with one service and hand ZINC more over time (OUABC; U.S. Oil: site → SEO → two apps → next build).

## 4. Services — one system, three layers

The site presents ZINC as one operating system, not a menu. Three layers form a loop:

| Layer | Services (one page each) | Slug |
|---|---|---|
| **Build** — the machine the customer touches | Shopify ecommerce | `shopify` |
| | Web design | `web-design` |
| | Apps | `apps` |
| **Demand** — traffic into it | SEO | `seo` |
| | Local SEO | `local-seo` |
| | Generative search optimization | `ai-search-optimization` |
| | Google Search Ads | `google-search-ads` |
| | Shopping / Merchant Center ads | `shopping-ads` |
| | Social ads (Meta) | `social-ads` |
| | TikTok ads | `tiktok-ads` |
| **Intelligence** — the truth about what works, feeding Build and Demand | Business intelligence (dashboards, reporting systems) | `business-intelligence` |

Rules:

- 11 service pages (Build 3 · Demand 7 · Intelligence 1), flat URLs `/services/<slug>/`. The layer is a grouping, never a URL folder.
- Never "GEO" as a label, slug, or abbreviation for generative search.
- **Dropped:** branding / graphic design. No page, no mention as a service.
- Layer names (Build / Demand / Intelligence) are working names; sharpen during copy if a better set lands, keep three.

## 5. Site map

```
/                               Home
/work/                          Work index: logo wall + case studies
/work/once-upon-a-book-club/    Flagship case study
/work/us-oil-solutions/         Second case study
/services/                      The loop: Build · Demand · Intelligence
/services/<slug>/               11 service pages
/about/                         Team + locations
/contact/                       Qualifying form + text line
/blog/                          Blog index, filter by layer
/blog/<slug>/                   Articles
/privacy/  /terms/              Legal
/thanks/                        Form confirmation (noindex)
404                             Not found
```

## 6. Page designs

### 6.1 Homepage — nine bands, black and white alternating

| # | Band | Content | Motion |
|---|---|---|---|
| 1 | Hero (white) | The core line, huge. One supporting line. Primary action to Contact; `Text (786) 575-4837` in mono. | Magenta strike through "the scope"; highlighter hit on "the business". |
| 2 | Logo wall (black) | Porsche, Home Depot, John Deere, YMCA, General Shale, OUABC, U.S. Oil Solutions (+ other current clients). All logos cleared for use by the owner. | Logos flip white → magenta one at a time on hover/tap. |
| 3 | The Loop (white, pinned) | Build → Demand → Intelligence, each layer listing its services as links. | **Signature moment:** circuit line draws on scroll, a magenta pulse travels the loop, each layer scales up as the pulse reaches it. |
| 4 | OUABC (black) | Tenure, services ZINC runs (TikTok ads, Shopping ads, Meta ads, blog content, web updates, reporting system), live site link, screenshots, receipts. | Mini loop lights only the layers OUABC uses. |
| 5 | U.S. Oil (white) | Site → SEO → two apps → next build. | Timeline steps stamp in on scroll. |
| 6 | How we work (black) | 4–5 positive commitments (e.g., client owns every account, direct access to the people doing the work, reporting tied to revenue). **Each confirmed true by the owner before launch.** | Lines type in, then lock. |
| 7 | Team (white) | All seven faces, black and white, random order on every load → `/about/`. | Faces reshuffle when the band enters view. |
| 8 | Latest articles (black) | Three newest posts. | None — calm. |
| 9 | Footer (white) | New closing line (fresh copy — no legacy lines), short form entry, text line, Miami HQ · Panama City satellite · nationwide, socials. | One restrained magenta moment. |

Executive rule: bands 1, 3, 4 carry the drama. Bands 2, 6, 8 are still and scannable. A CFO can read the whole page in 60 seconds without waiting on any animation.

### 6.2 Service page (×11)

1. Service name, huge, and one plain line on what the service does.
2. Mini loop: where this service sits and which services it feeds (internal links).
3. Spec sheet: deliverables, cadence, what the client owns (accounts, data, code), how it is reported.
4. Proof: the relevant OUABC or U.S. Oil work, or a client logo.
5. 4–6 real buyer questions with FAQ structured data.
6. Inquiry action that preselects this service on the form (`/contact/?service=<slug>`).

### 6.3 Case study (OUABC, U.S. Oil Solutions)

Client name + live link → **result strip (receipts first)** → the situation → the loop with their layers lit → the work, layer by layer → screenshots in device frames → a real testimonial if one exists → next case.

Live links go to the client's public sites only. Reporting systems and internal app pages appear as screenshots, never as links.

### 6.4 About

Short opening statement. Full team grid in random order on every load. Locations: Miami HQ, working nationwide, Panama City satellite. How an engagement runs.

Team (owner confirmed current and complete): Kirk Musick, MS, MBA (CEO) · Jaymie Wilhoit (Managing Partner) · Wendy Funnell (Chief Content Officer) · Bethany McKinzie (Business Strategy & HR) · Priya Nahar, MBA (Shopify Developer) · Martin Stewart (Glide Expert & App Developer) · Dr. Basset (Code).

### 6.5 Contact

- Fields: name, company, work email, website URL, services needed (multi-select grouped by layer), monthly budget, timeline, message — shown in short progressive steps, submitted as one POST (works with JavaScript off as a single page).
- Budget options: `Under $5k/mo` · `$5–10k/mo` · `$10–25k/mo` · `$25k+/mo`.
- Text line beside the form: (786) 575-4837 (Miami), always available.
- A "what happens next" line only if it is true.
- No public pricing anywhere on the site.

### 6.6 Blog

- Index filtered by layer; article template with author card, related services, Article structured data.
- Blog bylines use the `zinc-author-voice` lane (controlled, no profanity), separate from site copy.

## 7. Voice (site copy)

`kirk-voice` is **not** used for this site (owner, 2026-09-25). No legacy phrasing carries over — not from the live site, the July prototype, or the old phrase bank. Retired for this site: "You bring the mess…", "Send the hard part", "Coded in Miami. With cafecitos.", "Pretty charts only after the data stops lying.", "Bring the messy part".

The new voice, derived from the core line:

- Short declaratives. One contrast per idea, then stop.
- Senior and unhurried. No slang, no cursing, no jokes, no exclamation points.
- Nouns and receipts over adjectives. If a line cannot point to a real client, number, or deliverable, cut it.
- Plain about what is included, what the client owns, and how it is measured.
- No sales devices: no stat counters, award badges, guarantees, comparison tables, "free consultation" calls to action, testimonial carousels, live chat widgets or chatbots, pop-ups (exit-intent or scroll), or hero background video.

## 8. Visual system

- **Direction:** the Loop as the signature, set in editorial ("annual report") type discipline. Huge headers, big moving parts, unexpected interactions. Black and white alternate by band.
- **Color:**
  - Black: near-black around `#0A0A0B`.
  - White: cool snow white with a touch of gray, around `#F5F6F7`. **No warm or yellowish whites.**
  - One mid-gray for body text on each ground.
  - **Two accents, one per ground** (owner, 2026-09-25: "use our dark teal on white"). Rare and loud in both cases: pulse, strike, highlight, active states. Never a background band.
    - **On black bands: magenta `#FC0781`** (live Elementor global secondary). Contrast 5.17:1 on `#0A0A0B` — passes AA at every size.
    - **On white bands: ZINC dark teal `#07B2B2`** (live `--primary-color`) for display type and graphics (2.42:1 on `#F5F6F7` — large/non-text only), and **`#057E7E`** (the same hue darkened; 4.52:1 on `#F5F6F7`, 4.89:1 on white) for any small teal text or links on white.
    - Magenta never appears on white bands (3.54:1 on `#F5F6F7`).
    - The other live accents (`#0BD3D3`, `#C6FF00`, `#FF7A00`, `#FFC107`, `#00F5D4`) are out.
- **Type:** condensed heavy grotesk for display, precise text sans for body, mono for labels and data. Open-license fonts only, self-hosted, subset, ≤ 3 files. Three pairings rendered in the design phase; the owner picks one. Archivo is excluded (July prototype).
- **Brand mark:** the black-and-white circuit-brain profile mark and the ZINC wordmark. The mark's circuit traces are the visual source for the loop line.

## 9. Motion system

- Native CSS scroll-driven animations first; no animation library. No 3D / WebGL.
- The loop is a single SVG; line-draw and pulse are tied to scroll position.
- Page-to-page: native view transitions.
- Team shuffle: a tiny inline script.
- `prefers-reduced-motion` and browsers without scroll-timeline support get each scene's finished state with no content loss.

## 10. Performance and quality gates (launch-blocking)

- Lighthouse mobile: Performance, SEO, Accessibility, Best Practices all 100 on every template.
- LCP ≤ 1.2 s, CLS 0, INP < 100 ms.
- ≤ 15 KB JavaScript (gzip) per page.
- Images AVIF/WebP, responsive, dimensioned.
- WCAG 2.2 AA contrast and keyboard access.
- Zero broken internal links; every old URL resolves to its mapped target or 410.
- Structured data validates on every template.
- Desktop and mobile screenshots of every template reviewed before launch.

## 11. SEO

Full override — nothing inherited from the WordPress/Rank Math configuration.

- New categories and tags built around the three layers. The live site has 16 categories and 86 tags on 18 posts (measured 2026-09-25); none carry over by default.
- New titles and meta descriptions on every page.
- Structured data: Organization, LocalBusiness (Miami HQ), Service, Article, FAQPage, BreadcrumbList.
- Complete XML sitemap including every post. The live Rank Math sitemap lists 7 pages and no posts (measured 2026-09-25).
- `robots.txt`, `llms.txt`, canonical URLs, generated share images.
- Analytics continuity: Google tag `GT-NNZRWNCF` → GA4 `G-BV43HRVJ18` (property 494489814), Ads `AW-17071018445` — the IDs live today.

## 12. Content migration

- **Blog at launch:** the 18 live posts (WordPress REST API count, 2026-09-25), polished or updated as needed, moved to `/blog/<slug>/`.
- **After launch:** the remaining recovered posts (queue in `ZINC-Digital-of-Miami/Zinc_Digital_Agency` → `docs/recovery/`) keep publishing into this site.
- **Redirects:** 301 map built from the WordPress REST API and Search Console:
  - `/<post-slug>/` → `/blog/<post-slug>/`
  - `/service/*` → matching new service page
  - `/zinc-services/` → `/services/`
  - `/zinc-portfolio/`, `/portfolio/*` → `/work/`
  - `/about-us/` → `/about/`; `/team/*` → `/about/`
  - tags, categories, `/current-promos/`: redirect only where Search Console shows traffic or backlinks; otherwise 410.
- **One source of truth:** `src/lib/redirects.ts` holds the 301 map and the 410 list. 301s go through Astro's native `redirects` config; 410s through one on-demand catch-all route (`prerender = false`) that returns 410 for listed paths and the 404 page otherwise. The same file feeds the redirect test script. Every redirect and 410 is verified on a Vercel preview deploy, not in `astro dev`. No redirects are ever added in the Vercel dashboard.
- Summit Marine and Las Vegas Safety: logos only; their case pages redirect to `/work/`.

## 13. Proof and content inputs

- **Case studies:** OUABC (flagship) and U.S. Oil Solutions. Drafted from the best available material. Every number is a `[RECEIPT: …]` placeholder until the owner confirms it; nothing is invented.
- **Testimonials:** only real, attributable quotes placed beside the work they describe. The live-site set is part real, part placeholder; each quote is marked real or placeholder by the owner, and only real ones ship.
- **"How we work" commitments:** drafted, each confirmed by the owner before launch.
- **Team photos:** reuse the black-and-white graded headshots from the July prototype zip (local file `/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website V2.zip` → `assets/`). Jaymie and Wendy photos are supplied by the owner.
- **Facts carried over (verified with the owner):** Miami HQ 1900 N Bayshore Dr, Miami, FL 33132; Panama City satellite 97 Oak Ave Suite 7, Panama City, FL 32401; `hello@zincdigital.co`; socials (Facebook /zincdigitalofmiami, Instagram @zincdigitalofmiami, X @zinc_of, YouTube, LinkedIn /company/zinc-digital-of-miami).

## 14. Architecture

- **Framework:** Astro (current stable, confirmed against the docs at build time), TypeScript, static output with one server function for the form.
- **Content:** Astro content collections — `services`, `cases`, `team`, `posts`, `clients` — typed schemas; Markdown/MDX in git.
- **Styling:** plain CSS with design tokens (custom properties). No UI framework, no CSS framework.
- **Runtime:** Node 24.
- **Hosting:** Vercel, team `zincdigitalofmiamis-projects` (Pro plan active — measured "Pro" subscription line on 2026-09-01; no new plan or add-on).
- **Form delivery:** one Vercel Node function → Nodemailer → `smtp.gmail.com:465` authenticated with an App Password on a Workspace mailbox → `jaymie@zincdigital.co`. (Not the IP-allowlisted SMTP relay service, which cannot work from serverless.) Fallback only if Workspace admin blocks App Passwords: Gmail API with a service account. Spam: Cloudflare Turnstile (free, server-verified) + honeypot; a Vercel WAF rate-limit rule on `/api/contact` only if it measures $0 within Pro's included usage — no new store or service. Secrets live only in Vercel environment variables, entered by the owner.
- **No paid services** beyond current subscriptions.

## 15. Launch and cutover

- DNS is AWS Route 53; the live site runs on Kinsta behind Cloudflare (measured 2026-09-25).
- Build and review on Vercel preview URLs. Cutover = pointing the Route 53 records for `zincdigital.co` / `www` to Vercel, **only on the owner's explicit go at that moment**.
- Kinsta stays up about 30 days after cutover as the rollback path.
- Post-cutover checks on the live domain: every redirect, sitemap submitted in Search Console, GA4 receiving hits, form delivers to Jaymie, Lighthouse gates re-run.

## 16. Delivery

- **Target:** live in 5–7 days. The owner's copy review turnaround is the critical path.
- **Indicative sequence:** (1) design system + font pick · (2) home + loop · (3) service pages · (4) work, about, contact, form · (5) blog migration, SEO, redirects · (6) QA and owner review · (7) cutover.
- **Process:** GSD (`/gsd-new-project` from this spec). Phases in worktrees on GSD-computed branches, merged to `main` through PRs, Copilot review per PR, GSD code review / verifier / UI review at the configured points.
- **Repo rules:** `main` is the product; work branches merge to `main` and are deleted. All times shown to the owner are America/Chicago (CT).

## 17. Out of scope

- Branding / graphic design as a service.
- Public pricing.
- A CMS (posts are edited in the repo).
- Client portal, logins, or live dashboards on the site.
- Any change to the live WordPress site before cutover.

## 18. Resolved decisions (2026-09-25, owner: "resolve all conflicts")

| Topic | Decision | Basis |
|---|---|---|
| Accent colors | Magenta `#FC0781` on black; dark teal `#07B2B2` (display/graphics) and `#057E7E` (small text) on white | Owner instruction; contrast measured (§8) |
| 410 Gone | On-demand catch-all route reading `src/lib/redirects.ts`; verified on preview deploy | Research conflict (vercel.json routes vs function) — one source of truth wins; Astro adapter owns routing output |
| Form email | Nodemailer → smtp.gmail.com:465 with App Password; Gmail API only if App Passwords are blocked | Vercel allows 465/587; relay IP auth impossible from serverless |
| Rate limiting | Turnstile + honeypot required; Vercel WAF rule only at $0 included usage | No new paid service |
| Case study order | Result strip first, then narrative — same content | Senior buyers scan receipts first |
| Form presentation | Progressive steps, single POST, no-JS fallback | Higher completion, no extra JS weight beyond budget |
| Extra bans | Chat widgets, pop-ups, hero video | Same "no sales pitch" rule; LCP/JS budget |
| Cookie banner | None. Privacy page discloses GA4/Ads measurement | U.S. audience; ZINC is below CCPA thresholds; a banner costs CLS and JS |
| Firefox | Finished-state fallback is designed as a first-class view (Firefox 156 lacks scroll timelines until 159) | Measured browser support |
| Fonts | Three open-license variable pairings rendered in Phase 1, each with metric-matched fallback (`size-adjust`) to hold CLS 0 | Pitfalls research |
| Owner review | Dated gates: Day 1 font pick · Days 2–5 copy batches · Day 5 receipts, "How we work", testimonials, Jaymie/Wendy photos · Day 6 final approval | Owner review is the critical path |

**Pre-launch dependency on the owner (production DNS, not applied by agents):** `zincdigital.co` publishes two SPF records (a permanent SPF error) and neither authorizes Google Workspace; DMARC is `p=none`. DNS is managed in MyKinsta (Kinsta DNS runs on Route 53). Zoho is no longer used (owner, 2026-09-25). Replace both records with one — `v=spf1 include:_spf.google.com include:relay.kinstamailservice.com ~all` (2 DNS lookups) — before the form goes live. After cutover, drop the Kinsta include: `v=spf1 include:_spf.google.com ~all`.



---

# Part B (verbatim) — Requirements

## Requirements: ZINC Digital Website (zinc-digital-web)

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
- [ ] **LNCH-02**: Before the form goes live, `zincdigital.co` has one SPF record authorizing Google Workspace (owner applies the §18 record in MyKinsta DNS) (§18)
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

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 1 | Pending |
| DSGN-05 | Phase 1 | Pending |
| MOTN-01 | Phase 2 | Pending |
| MOTN-02 | Phase 2 | Pending |
| MOTN-03 | Phase 2 | Pending |
| MOTN-04 | Phase 2 | Pending |
| LOOP-01 | Phase 2 | Pending |
| LOOP-02 | Phase 2 | Pending |
| LOOP-03 | Phase 3 | Pending |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| HOME-05 | Phase 2 | Pending |
| HOME-06 | Phase 2 | Pending |
| HOME-07 | Phase 2 | Pending |
| HOME-08 | Phase 2 | Pending |
| SERV-01 | Phase 3 | Pending |
| SERV-02 | Phase 3 | Pending |
| SERV-03 | Phase 3 | Pending |
| SERV-04 | Phase 3 | Pending |
| SERV-05 | Phase 4 | Pending |
| WORK-01 | Phase 3 | Pending |
| WORK-02 | Phase 3 | Pending |
| WORK-03 | Phase 3 | Pending |
| WORK-04 | Phase 3 | Pending |
| WORK-05 | Phase 3 | Pending |
| ABOU-01 | Phase 4 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| BLOG-01 | Phase 5 | Pending |
| BLOG-02 | Phase 5 | Pending |
| BLOG-03 | Phase 5 | Pending |
| COPY-01 | Phase 6 | Pending |
| COPY-02 | Phase 6 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 5 | Pending |
| SEO-05 | Phase 5 | Pending |
| MIGR-01 | Phase 5 | Pending |
| MIGR-02 | Phase 5 | Pending |
| QUAL-01 | Phase 6 | Pending |
| QUAL-02 | Phase 6 | Pending |
| QUAL-03 | Phase 6 | Pending |
| QUAL-04 | Phase 6 | Pending |
| QUAL-05 | Phase 6 | Pending |
| LNCH-01 | Phase 6 | Pending |
| LNCH-02 | Phase 4 | Pending |
| LNCH-03 | Phase 7 | Pending |
| LNCH-04 | Phase 7 | Pending |

**Coverage:**

- v1 requirements: 57 total
- Mapped to phases: 57
- Unmapped: 0

---
*Requirements defined: 2026-09-25*
*Last updated: 2026-09-25 (CT) after roadmap creation (traceability filled)*


---

# Part D — Live state, owner actions, incidents, resume

## 2. Live state (measured 3:03 PM CT)

| Thing | State |
|---|---|
| Public site | https://zinc-digital-web.vercel.app → 301 → `/design-preview/a/` (HTTP 200). One page: the Pairing A hero only. `x-robots-tag: noindex, nofollow` on every path + `<meta name="robots" content="noindex, nofollow">`. |
| Vercel project | `zinc-digital-web`, team `zincdigitalofmiamis-projects` (`team_OBen4n9i3PybGdYsjENnrv1S`), Pro plan already paid, **no Git connection** (CLI-linked from the phase worktree via `.vercel/project.json`, gitignored). Protection `prod_deployment_urls_and_all_previews` via Vercel Authentication (free). No Password Protection. Domains: `zinc-digital-web.vercel.app` only. 3 deployments: 1 Production (`bqxgp8uvb`), 2 Preview. |
| zincdigital.co | Untouched. Still WordPress on Kinsta behind Cloudflare. DNS managed in MyKinsta (Route 53 nameservers). Registrar GoDaddy. |
| GitHub | `ZINC-Digital-of-Miami/zinc-digital-web` (public). `main` = `f5c7a90`. Phase branch `gsd/phase-01-design-system-font-pick` = `e7fb6a5` (pushed). PR #1 merged. **PR #2 open** (owner-opened 2:43 PM CT, head `a8022b2`, mergeable) — see §5. |
| Local | Main checkout `/Volumes/Satechi Hub/zinc-digital-web` on `main` @ `1256025` (behind origin by the workflow commit). Phase worktree `/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01`. Two untracked GSD runtime files (`.planning/milestone.lock`, `.planning/state.json`) — leave them. |
| Email/SPF | `zincdigital.co` publishes **two** SPF records (permerror); neither authorizes Google Workspace. Owner action, in MyKinsta DNS: replace both with `v=spf1 include:_spf.google.com include:relay.kinstamailservice.com ~all` (Zoho is no longer used). DMARC is `p=none`. |
| Copilot | PR review quota is exhausted on this account (PR #1). Paid Copilot is off the table (no new charges). |

Re-measure:
```bash
cd "/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01"
git fetch && git log --oneline -3 origin/main origin/gsd/phase-01-design-system-font-pick
vercel ls zinc-digital-web --scope zincdigitalofmiamis-projects
curl -sI https://zinc-digital-web.vercel.app/design-preview/a/ | grep -iE "^HTTP|x-robots"
dig +short TXT zincdigital.co | grep spf
```

## 3. What is built (Phase 1, plan 01-01 — complete)

Commits `266e4fd` → `a8022b2` on the phase branch.

- Astro 7.3.5 + `@astrojs/vercel` 11.0.11, TypeScript, Node 24, `output: 'static'`.
- Tokens: `src/styles/tokens.css` (`#0A0A0B`, `#F5F6F7`, `#FC0781`, `#07B2B2`, `#057E7E`, spacing, type scale), `themes.css` (`data-theme="dark|light"` band theming), `base.css`, `pairings.css`.
- Fonts via Astro's native Fonts API: Pairing A = Big Shoulders Display 800 (fontsource provider) / Inter 400 / JetBrains Mono 400 (google provider), 3 woff2 files, metric-matched fallbacks generated.
- `src/layouts/PreviewLayout.astro`, `src/components/MockupBands.astro`, `src/components/bands/Hero.astro`, `src/pages/design-preview/a.astro`.
- `vercel.json` (site-wide noindex header), `astro.config.mjs` (`/` → `/design-preview/a/` redirect). Both marked PRE-LAUNCH; remove at cutover.
- Hero Display size: `clamp(3.5rem, 10vw + 1rem, 12.5rem)` — owner wants big headers; do not shrink.

Known defects the owner already called out, still open: supporting-line copy rejected; verify there are zero underlined links (fix pass `d084a48` tokenized link colors — re-check visually); crispness/tightness bar is the live WordPress site.

## 4. What is NOT done

- **Plans 01-02..01-05 are stale.** Committed versions build a dark band + spec sheet + pairing routes + gates. The owner rejected that shape: the next deliverable must be the complete nine-band homepage (spec §6.1) at `/`, in Pairing A, deployed to the vercel.app URL, then Pairings B/C on that full page, then gates + font pick, then collapse. An interrupted partial rewrite of 01-02 was moved to `/Volumes/Satechi Hub/_TRASH_ZINC_CLEANUP/2026-09-25/interrupted-replan/`; the working tree is clean.
- Phases 2–7 (Loop animation, services, work, about, contact form, blog/SEO/redirects, launch gates, cutover): not started.
- Owner inputs still needed: real testimonials (which are real vs placeholder), case-study receipts, "How we work" commitments, Jaymie + Wendy photos, logo permission is granted for all listed clients.

## 5. Things that need a decision or a human

1. **PR #2** (`gsd/phase-01-design-system-font-pick` → `main`, opened by the owner). It contains 01-01 plus all Phase 1 planning docs. If merged now, `main` gets a one-page site plus stale plans; fine as a checkpoint, but the branch also needs the owner's `f5c7a90` merged in first (see next item). Recommended: merge after the workflow question is settled.
2. **`.github/workflows/astro.yml` on `main`** (owner commit `f5c7a90`, 2:40 PM CT): the stock "Deploy Astro to GitHub Pages" workflow (Node 20, `actions/deploy-pages`). It conflicts with the plan (Vercel hosting, Node 24, the Vercel adapter) and will fail or double-deploy on every push to `main`; it also spends Actions minutes. No runs have fired yet (`gh run list` empty). Decide: delete it, or replace it with a check-only workflow (build + Lighthouse), never a deploy.
3. **SPF repair** in MyKinsta DNS (§2). The contact form must not go live before this.
4. **Copilot review** unavailable this period; the repo's AGENTS.md expects it per PR. Use GSD's code-review agent instead until quota resets.
5. **Font pick** and **complete-homepage review** are owner gates (Day 1 was planned as Sat 2026-09-26 CT).

## 6. How to resume (exact path)

```bash
cd "/Volumes/Satechi Hub/zinc-digital-web-worktrees/phase-01"   # phase branch, all Phase 1 work lives here
git fetch origin && git merge origin/main                       # bring in f5c7a90 (owner's workflow) first
export npm_config_cache='/Volumes/Satechi Hub/zinc-digital-web-worktrees/.npm-cache'
npm ci && npm run build && npx astro check
```
1. Replan: `/gsd-plan-phase 1` → choose **Replan from scratch** → give the planner §1 items 5–10 and spec §6.1 as the brief (the brief text is preserved in `.planning/STATE.md` session notes and in this file). Do not run the stale plans.
2. Execute: `/gsd-execute-phase 1`. Deploy with `vercel deploy --prod --scope zincdigitalofmiamis-projects` from the worktree (production on the vercel.app URL is owner-authorized; a custom domain is not).
3. Before showing the owner anything: build, screenshot 1440 and 375 (local `python3 -m http.server --directory dist` or the live URL), check no underlined links, content starts at top, retina-sharp images.
4. Land: PR to `main`, then delete the branch and worktree. `main` is the product.

Rules that bind every agent here: `AGENTS.md` (repo), the owner's global rules (Central time, external-drive storage, no new paid services, no cursing in copy, never "GEO", visual check before stopping, verify before claiming).

## 7. Cleanup done at turnover

- Stopped the local preview server; removed the temporary `.claude/launch.json` from the ZINC Digital Agency repo.
- Moved to `/Volumes/Satechi Hub/_TRASH_ZINC_CLEANUP/2026-09-25/`: researcher scratch (237 MB), planner font probe, interrupted 01-02 partial.
- Kept: `/Volumes/Satechi Hub/zinc-digital-web-worktrees/.npm-cache` (524 MB, reusable), `/Volumes/Satechi Hub/CodexScratch/phase01-tmp` (42 MB, scaffold temp — safe to delete), `/Volumes/Satechi Hub/zinc-digital-web/.scratch/` (gitignored: spec PDF, probe JSON, logs).
- Nothing on the internal disk.

## 8. Incident log (for the record)

- **2:0x PM CT** — First deploy to the new, Git-disconnected Vercel project auto-promoted to Production and the draft hero was publicly reachable at `zinc-digital-web.vercel.app` three times for seconds each (draft copy only; no secrets; not zincdigital.co). The executor removed those deployments and changed protection to `prod_deployment_urls_and_all_previews`. Root cause and timestamps: `.planning/phases/01-design-system-font-pick/01-01-SUMMARY.md` § Deviations.
- **2:27 PM CT** — Owner chose a public noindex production URL; applied in `6c04e71`.
