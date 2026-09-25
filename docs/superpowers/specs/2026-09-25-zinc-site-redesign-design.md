# ZINC Digital — Site Redesign Design Spec

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

