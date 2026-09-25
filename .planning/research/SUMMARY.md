# Project Research Summary

**Project:** ZINC Digital — Site Redesign  
**Domain:** Premium B2B agency marketing site (Astro static-first on Vercel, 5–7 day WordPress migration)  
**Researched:** 2026-09-25 (CT)  
**Confidence:** HIGH (stack verified via npm registry + Context7; architecture via Astro docs; pitfalls via platform docs + web-search best practices)

---

## Executive Summary

ZINC's site redesign is a bounded migration from WordPress to Astro + Vercel with a signature scroll-driven motion component and a single serverless form endpoint. The stack is straightforward and well-documented; the critical path is **owner copy review turnaround**, not code complexity. The approved spec's 5–7 day timeline is achievable if owner review checkpoints are explicit and scheduled upfront, not discovered ad-hoc. The architecture is deliberately fixture-first (band components accept data as props, never self-fetch) to enable parallel work while copy is still in review.

Three specific integration decisions remain open and must be resolved before form-delivery work begins: (1) Google Workspace email auth mode (Nodemailer SMTP vs Gmail API), (2) rate-limit store location (Vercel WAF vs Upstash Redis), and (3) 410-Gone mechanism (vercel.json routes vs on-demand API). The redirect map is the single largest launch-risk item — 116+ old URLs (posts, tags, categories, archives) must map to real destinations or 410s, not a catch-all homepage redirect. Cross-browser support for the Loop's fallback state is essential; Firefox 156 (current stable) does not support scroll-driven animations, so the finished-state CSS is the primary UX, not a fallback edge case.

---

## Key Findings

### Recommended Stack

**Astro 7.3.5** with TypeScript 5.x (bundled), Node 24 runtime, `@astrojs/vercel` adapter v11.0.11, output set to `'static'` (the default). The form endpoint is a single Vercel Node.js function (`/api/contact`), not Edge. Static output means 99% of traffic hits prerendered HTML on a CDN with zero cold starts; the form is the only exception. This is the only realistic way to hit the spec's ≤15KB JS/page and Lighthouse-100 gates.

**Core technologies:**
- **Astro 7.3.5**: static-first, zero-client-JS-by-default, native content collections (Content Layer API with `glob()` loader). Required.
- **@astrojs/vercel 11.0.11**: adapter for static output + one on-demand function. Required.
- **TypeScript 5.x** (bundled by Astro): content collection schemas, type-safe frontmatter. Spec-mandated.
- **Node 24 (LTS)**: local build + Vercel Function runtime. Required; spec-mandated.
- **Nodemailer 10.0.10**: SMTP client inside `/api/contact` for Workspace mail send. Credential-based auth (App Password) on port 465 or 587, **not** IP-allowlist mode (incompatible with serverless).
- **Cloudflare Turnstile (free tier)**: CAPTCHA + honeypot + rate limiting for spam. Server-side token verification required.
- **Sharp 0.35.4**: image transforms (AVIF/WebP output). Required for image-performance gate.
- **@astrojs/mdx 8.0.2**, **@astrojs/sitemap 3.7.4**: MDX support; auto-generated XML sitemap.

**Motion — native scroll-driven animations:**
- `animation-timeline: scroll()` / `view()` supported in Chrome/Edge 115+ (2023) and Safari 26+ (2025). **Firefox 156 (current) lacks support; Firefox 159 (~3 weeks out) will add it.**
- **Practical implication: the finished/no-support state is the primary Firefox experience today.** Ship the static, fully-drawn Loop SVG as the base render, animating into emphasis for supporting browsers.

**Font choices:**
Three open-license variable pairings provided; owner picks one at project kickoff. Metric-matched fallback fonts are **mandatory** to prevent Cumulative Layout Shift on display headings.

### Expected Features

**Must have (table stakes):**
- Service pages with real spec sheets (deliverables, cadence, client ownership, reporting).
- Case studies with named receipts (`[RECEIPT: …]` discipline).
- Qualifying contact form with budget tiers, timeline, and services multi-select.
- Named team page (all seven real faces, random order).
- Performance/accessibility gates: Lighthouse 100×4, LCP ≤1.2s, CLS 0, INP <100ms, ≤15KB JS, WCAG 2.2 AA.
- Clear, shallow IA (flat `/services/<slug>/` URLs).
- Redirect and 410 coverage.

**Should have (competitive differentiators):**
- **The Loop**: single SVG drawn on scroll with a pulsing magenta circuit. Reused across homepage, every service page, both case studies. **Single shared component across entire site.**
- **"How we work" commitments band**: specific, falsifiable operating facts confirmed true by the owner before launch.
- **Service-preselected inquiry**: form linked with `?service=<slug>` pre-checks one option.
- **Native, library-free motion**: CSS scroll-driven animations + View Transitions API.
- **Random team order**: deliberate signal of non-hierarchy.

**Defer (v2+):**
- Additional case studies, RSS feed, recovered blog posts, form attribution field, site-wide search.

### Architecture Approach

Static-first with fixture-first components. Pages own data fetching; **components never fetch collections** — they receive typed props. This boundary keeps every band buildable and reviewable against fixture data before copy exists, essential for the owner-review-critical-path constraint.

The Loop is a single Astro component, rendered at `size="full"` or `size="mini"`, with optional `highlight?: string[]` prop. One SVG source, scroll-timeline CSS, zero JS.

`lib/redirects.ts` is the single source of truth for all 301s and 410s, imported by `astro.config.mjs`, `/api/gone.ts`, and verification script.

**Major components:**
1. **Layouts** — page shell, SEO wiring, View Transitions.
2. **Band components** — pure presentational, props-driven.
3. **Loop.astro** — signature SVG, rendered at two scales, CSS scroll-driven with fallback.
4. **lib/seo/jsonld.ts** — pure generator functions.
5. **lib/redirects.ts** — typed arrays.
6. **Client scripts** — minimal, <2KB total, progressive enhancement only.

### Critical Pitfalls

1. **Catch-all or missing redirects silently bleed indexed URLs** (Pitfall #1, CRITICAL)  
   **How to avoid**: Build redirect map from WordPress REST API export + Google Search Console (traffic, backlinks, index signal). Map everything with signal to a destination; retire rest with 410. Test with automated script that asserts zero catch-all redirects and zero chains.

2. **410 is hard to produce on static output** (Pitfall #3, HIGH)  
   **How to avoid**: Use `vercel.json` `routes` array with `status: 410`, or create `/api/gone.ts` with `prerender = false`. Pick one, list every URL needing it. **Open decision**: Recommend preview-deploy test of both.

3. **Google Workspace SMTP relay's IP-auth doesn't work from Vercel serverless** (Pitfall #4, HIGH)  
   **How to avoid**: Use credential-based auth (Workspace mailbox SMTP user/password) on port 465/587, or Gmail API (OAuth2). **Open decision**: Owner must confirm Workspace Admin allows App Passwords.

4. **Font swap trades FOIT for CLS penalty without metric-matched fallback** (Pitfall #6, HIGH)  
   **How to avoid**: Generate metric-matched fallback `@font-face` declarations so swap is visually imperceptible. Test by throttling network and watching hero/Loop region.

5. **Cross-browser fallback for Loop animation breaks if only animated version exists** (Pitfall #7, HIGH)  
   **How to avoid**: Firefox 156 (current) lacks scroll-timeline support. **The finished state CSS is the primary UX for ~20% of desktop visitors today.** Build finished state as first-class design deliverable (owner sees and approves both versions), test explicitly in actual Firefox and older Safari/iOS device.

---

## Implications for Roadmap

The spec's indicative 7-step sequence is sound. Owner copy review is the critical path. Suggested phases:

### Phase 1: Design System + Font Pick
**Rationale:** Foundation for all visual work. Metric-matched fallback fonts must be built when pairing is chosen. Magenta contrast rule must be encoded as design-token rule. Finished-state CSS for Loop must be designed and approved before visual work proceeds.

**Delivers:** Three font pairings presented, one selected (blocking gate); metric-matched fallback stack + overrides; design-token rules; finished-state Loop CSS designed and approved.

**Avoids:** Pitfalls #6, #10.

### Phase 2: Home + Loop
**Rationale:** Loop is the signature moment and single shared component across entire site. Cross-browser testing (Firefox + Safari + iOS) must complete before this phase ends.

**Delivers:** Homepage layout (9 bands), Loop SVG with CSS scroll-timeline animation and finished-state fallback, `/` live with Lighthouse 100×4, cross-browser verification (real-device iOS).

**Avoids:** Pitfalls #7, #8, #10.

**Research flags:** Loop testing must use real-device iOS. Finished-state CSS is first-class design.

### Phase 3: Service Pages (×11)
**Rationale:** Reuses Loop component (mini-size with layer highlight). Every service page is direct sales and SEO asset.

**Delivers:** All 11 service pages, spec sheets, mini Loop with layer highlighting, FAQ sections with FAQPage schema, service-preselected inquiry links, all LH 100×4.

### Phase 4: Work + About + Contact + Form
**Rationale:** Two case studies are primary trust mechanism. Team page reinforces "direct access" positioning. Contact form is conversion mechanism. **Open decisions must be resolved before this phase starts:** (1) Email auth mode — owner must confirm Workspace Admin allows App Passwords. (2) Rate-limit store — recommend testing both before committing.

**Delivers:** `/work/` index + 2 case studies (receipts all confirmed by owner), `/about/` with team grid and shuffle script, `/contact/` with form (honeypot → rate-limit → Turnstile → Workspace send), GA4/Ads tags verified, all LH 100×4.

**Avoids:** Pitfalls #4, #5, #9.

**Research flags:** Email auth mode decision must be made before function is written. Rate-limit store testing on preview before committing.

### Phase 5: Blog Migration + SEO + Redirects
**Rationale:** Blog is SEO asset and credibility signal. Redirect map is P1 pitfall if inaccurate. **WordPress REST API export + GSC audit is mandatory before redirect map is finalized.**

**Delivers:** Blog index at `/blog/` with layer-based filtering, 18 posts migrated, redirect map built from WordPress REST API + GSC, 410 list for retired URLs, XML sitemap, structured-data validation, redirect test script passing 100%, all LH 100×4.

**Avoids:** Pitfalls #1, #2, #3.

**Research flags:** WordPress REST API export + GSC audit is blocking work. Redirect test script must cover 100% of old URL surface.

### Phase 6: QA + Owner Review
**Rationale:** Final verification of all Lighthouse gates, cross-browser support, owner copy approval. **Owner copy review is the critical-path risk.** If checkpoints are not scheduled upfront with dates, this phase will slip.

**Delivers:** All templates LH 100×4 on mobile and desktop, LCP ≤1.2s, CLS 0, INP <100ms on cold/throttled load, WCAG 2.2 AA, form submission test (delivery to `jaymie@zincdigital.co`), rate-limit store verified, redirect test script passes 100%, cross-browser verification (Firefox 156 + Safari + iOS Safari), screenshots.

**Owner Approval Checkpoints (critical path — no exceptions):**
1. Font pairing + finished Loop state (from Phase 1).
2. Case-study receipts (`[RECEIPT: …]` resolved or explicitly cut).
3. "How we work" commitments (every line confirmed true, not aspirational).
4. Team photos (Jaymie and Wendy images supplied).
5. Full-site copy review (zero `[RECEIPT: …]` or placeholder text remains).

Each checkpoint has a **date**, not just a name. Example: "Receipts approved by 2026-09-29, no exceptions."

### Phase 7: Cutover
**Rationale:** Final deployment gate and DNS flip. **Three preparation steps must complete 24–48 hours *before* cutover, not on cutover day.**

**Delivers:** DNS TTL lowered to 300s (24–48h before cutover), full DNS zone export and diff, backup Search Console verification method added, Route 53 flip (apex and `www` point to Vercel), post-cutover verification (1–2 hours): redirects resolve, GA4 hits, Ads conversion tracking, form delivery, Search Console verified, Lighthouse re-run on live domain.

**Avoids:** Pitfall #11 (DNS TTL/verification timing), Pitfalls #1–3 (redirect issues).

---

## Confidence Assessment

| Area | Confidence | Notes |
|---|---|---|
| **Stack** | **HIGH** | All core technologies verified against npm registry (2026-09-25), Vercel KB, Nodemailer docs via Context7, Firefox release history. |
| **Features** | **MEDIUM** | Best-practice patterns from 2026 trend research (multiple sources, consensus on table stakes and differentiators). No live competitor teardown; pattern-level consensus. |
| **Architecture** | **HIGH** | Content collections, static-first output, on-demand routing, View Transitions verified against current Astro Context7 docs. Fixture-first design confirmed for owner-review critical path. |
| **Pitfalls** | **MEDIUM** | Sourced from web-search best practices + platform docs. No primary-source access to this project's live config; recommendations are standard patterns. DNS and email specifics flagged for owner verification. |

**Overall confidence:** **HIGH** for execution (stack and architecture solid, well-documented, proven). **MEDIUM** for scope (features are standard patterns). **Risk is operational**: owner copy review cadence and redirect-map accuracy are the largest non-technical threats.

### Gaps to Address

1. **Email auth mode decision** — Workspace admin must confirm App Passwords are allowed org-wide. If blocked, pivot to Gmail API before Phase 4 function work.
2. **Rate-limit store selection** — Evaluate Vercel WAF vs Upstash Redis on a preview; pick one before Phase 4 sign-off.
3. **410 mechanism** — Clarify whether 410s use `vercel.json` `routes` (static list) or `/api/gone.ts` (on-demand). Recommend preview-deploy test of both before Phase 5 work.
4. **Redirect and 410 map accuracy** — Phase 5 must complete WordPress REST API export + GSC audit before mapping. Do not guess; do not use catch-all.
5. **DNS pre-cutover preparation** — Schedule TTL lowering and zone-export work 24–48 hours *before* cutover, not same-day.
6. **Owner copy-review checkpoint schedule** — Must be set at project kickoff (not discovered mid-Phase-6). Five explicit gates with dates; each is a blocking gate.
7. **Loop fallback-state visual approval** — Phase 2 must get explicit owner approval of the finished/no-support state. Firefox 156 is the primary UX for ~20% of desktop visitors today.

---

## Sources

### Primary (HIGH confidence)
- Context7 `/withastro/docs` — content collections, static-first output, Vercel adapter, View Transitions, redirects config.
- npm registry (live, 2026-09-25) — verified versions.
- Vercel official documentation — redirects vs routes, 410 patterns, SMTP constraints, Node vs Edge runtime.
- Cloudflare Turnstile docs — server-side siteverify, lifecycle management.
- Nodemailer docs — Gmail/Workspace SMTP, App Password requirement.
- Firefox version history (Wikipedia, 2026-09-25) — Firefox 156 current, Firefox 159 estimate.
- caniuse.com (2026-09-25) — `animation-timeline: scroll()` support.
- ZINC Digital design spec (2026-09-25-zinc-site-redesign-design.md) — approved requirements.
- PROJECT.md — constraints (5–7 day timeline, no paid services).

### Secondary (MEDIUM confidence)
- 2026 B2B website design trends — table stakes, differentiators, case-study research.
- B2B case study conversion research — results-first ordering, receipts discipline.
- CSS scroll-driven animations (webkit.org, MDN, Chrome Developers) — fallback patterns, prefers-reduced-motion handling.
- Core Web Vitals (web.dev, DebugBear) — font CLS, LCP for text, INP improvements.
- iOS Safari sticky bugs (Apple Developer Forums) — dynamic viewport regressions, workarounds.
- DNS migration checklists (nanosek.com, qikot.com) — TTL lowering, zone export, verification backup.
- Email deliverability (EasyDMARC, DEV Community) — SPF limits, DMARC alignment.
- Vercel rate-limiting (vercel.com/kb, vercel.com/docs) — WAF on Pro plan, Upstash Redis free tier.

---

*Research completed: 2026-09-25 (CT)*  
*Ready for roadmap creation: yes*
