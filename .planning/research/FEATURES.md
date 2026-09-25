# Feature Research

**Domain:** Premium B2B agency/studio website (services marketplace-of-one, not SaaS, not ecommerce storefront)
**Researched:** 2026-09-25 (CT)
**Confidence:** MEDIUM (web search, cross-checked across 3+ independent sources per topic; no direct competitor-site teardown performed — see Sources)

## Feature Landscape

### Table Stakes (Users Expect These)

Features senior B2B buyers (marketing directors, CFOs) assume exist. Missing these reads as "not a serious agency."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Service pages with real deliverables/scope, not vague promises | Buyers compare providers on what's actually included and who owns what; vague scope reads as inexperience | LOW | Spec §6.2 covers this (spec sheet: deliverables, cadence, client-owned accounts/data/code). Aligned. |
| Named, receipts-based case studies (results first, not company-backstory first) | Research: "the pages that convert open with three numbers and no preamble" — executives skim, they don't read narrative preamble | MEDIUM | Spec §6.3 follows situation → loop → work → receipts → screenshots → testimonial → next case. **Gap:** spec's case-study order leads with situation/context before receipts; research favors results-first. See Disagreements below. |
| Qualifying contact path with budget/timeline fields | "A contact form without budget, timeline, and project-type questions is a tire-kicker magnet"; budget tiers reportedly cut cold-lead rate 40–60% | LOW | Spec §6.5 already has budget tiers, timeline, services multi-select. Directly matches best practice. Aligned. |
| Real team page (named people, real photos, real roles) | High-touch B2B relationships are bought on who will do the work, not just the brand | LOW | Spec §6.4/§8.1 band 7: all seven real faces, B&W, random order. Aligned; stronger than most competitor "leadership grid" pages because every hire is shown, not just principals. |
| Fast, stable pages (Core Web Vitals) | Enterprise/B2B buyers increasingly judge technical competence by the site's own performance — an agency selling SEO/ads that has a slow site is a credibility risk | HIGH | Spec §10 gates (LCP ≤1.2s, CLS 0, INP <100ms, ≤15KB JS) are stricter than typical "enterprise trend" articles even recommend. This is a genuine differentiator dressed as table stakes — see Differentiators. |
| Clear, shallow information architecture (flat URLs, few clicks to any service) | "Build a solid internal linking architecture so every key page is within three clicks" | LOW | Spec §5/§4 flat `/services/<slug>/` URLs satisfy this natively. Aligned. |
| Client logo wall (static or restrained-interactive, not sales-badge) | Recognizable-name social proof is still expected; the buyer's first instinct is "who else trusts them" | LOW | Spec §6.1 band 2: static wall, hover/tap-triggered logo flip, not a rotating "as seen in" strip. Aligned — and explicitly not a carousel. |
| FAQ content with FAQPage structured data on service/product pages | "FAQ rich results appear primarily for high-quality pages with genuine, non-promotional FAQs"; 3–10 Q&A pairs is the sweet spot | LOW | Spec §6.2.5: 4–6 real buyer questions with FAQ structured data. Matches the research-confirmed range. Aligned. |
| Blog/insights with real authorship and topical structure | Signals ongoing expertise; feeds internal linking and long-tail SEO | MEDIUM | Spec §6.6: index filtered by layer, author card, related services, Article schema. Aligned. |
| Legal pages (privacy, terms) | Baseline trust/compliance expectation, especially collecting form data with a form that stores name/company/email/budget | LOW | Spec §5 has `/privacy/` `/terms/`. Aligned. |
| Accessible, keyboard-navigable UI (WCAG AA) | Table stakes for any enterprise-facing site in 2026; CFO-side stakeholders increasingly check this as a proxy for engineering discipline | MEDIUM | Spec §10 mandates WCAG 2.2 AA — matches or exceeds current norm (most agency sites target AA, not more). Aligned. |
| Comprehensive structured data (Organization, LocalBusiness, Service, Article, FAQPage, BreadcrumbList) | Confirmed 2026 baseline for any local/service business wanting AI-answer and rich-result visibility | MEDIUM | Spec §11 lists exactly this set. Aligned; no gap. |
| 404 handling + working redirects from every legacy URL | Broken links after a redesign are the single most common enterprise-site launch failure users notice | MEDIUM | Spec §5, §12 cover this with a tested script. Aligned. |

### Differentiators (Competitive Advantage)

Features that set ZINC apart from the generic "trends article" agency site. Not required, but this is where the spec is deliberately betting.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| The Loop as a literal, animated system diagram (Build→Demand→Intelligence) | Most agency sites present services as a flat menu/grid. Showing them as one interconnected system is the visual proof of the core line ("ZINC delivers the business," not a scope of work) | HIGH | Spec §6.1 band 3, §9. This is the single highest-complexity, highest-payoff element in the whole site — a scroll-tied SVG with pulse/scale states that must still degrade cleanly under `prefers-reduced-motion` and the ≤15KB JS budget. Feeds every service page's "mini loop" (§6.2.2) and both case studies' "layer lit" treatment (§6.1 bands 4–5) — build it once, reuse everywhere. |
| "How we work" commitments band, confirmed true by the owner | Replaces the banned "guarantee" pattern with something more credible to a CFO: specific, falsifiable operating commitments instead of marketing promises | LOW (content), MEDIUM (owner sign-off is the real cost) | Spec §6.1 band 6. This is the correct alternative to guarantees — research shows generic "guarantee" badges read as a trust signal only when specific; vague guarantees actively hurt credibility with sophisticated buyers. Depends on the owner confirming each line before launch (already flagged as a spec constraint). |
| Service-preselected inquiry (`/contact/?service=<slug>`) | Removes a full qualification step for a buyer already reading a specific service page — the case-study research finding "case studies that convert are built into the buyer journey" applies equally to the form entry point | LOW | Spec §6.2.6. Cheap, high-leverage; requires the contact form's service multi-select to support a pre-checked state from a query param (dependency, see below). |
| Case studies with live links + device-framed screenshots + explicit `[RECEIPT: …]` discipline | Most agency case studies use vague, unverifiable numbers. Making every number provably real (or explicitly a placeholder until confirmed) is unusual rigor that reads as credibility to a CFO specifically | MEDIUM | Spec §13. This is a genuine differentiator versus the "up and to the right chart, no source" pattern common on agency sites. |
| Native, JS-light motion (CSS scroll-driven animation + View Transitions API, no animation library, no 3D) | 2026 research: "CSS scroll-driven animations are now baseline across all major browsers... run on the compositor off the main thread," and "View Transitions API and CSS scroll-driven animations are native features that both run on the compositor and ship zero KB of JavaScript." A visually dramatic site that still hits 100×4 Lighthouse and ≤15KB JS is a rare combination and is itself proof of technical competence — relevant to a marketing-director + CFO audience buying SEO/ads/dev services | HIGH | Spec §9. This is on-trend, not experimental — but "zero KB" only holds for the scroll/transition primitives themselves; the team-shuffle inline script and the Turnstile widget still draw from the same 15KB budget (see Feature Dependencies). |
| Random-order team grid on every load | Small but deliberate signal: no forced hierarchy, every person shown equally — consistent with "direct access to the people doing the work" positioning | LOW | Spec §6.1 band 7, §6.4. Minor differentiator, cheap to build, reinforces the "How we work" commitments thematically. |
| Text-line CTA (SMS) presented as co-equal to the form, everywhere | Distinct from the "book a free consultation" pattern the spec explicitly bans — a direct, low-friction line to a real phone number is unusual for agencies above boutique size, and reads as confidence rather than lead-gen desperation | LOW | Spec §6.1 band 1, §6.5, §6.1 band 9 (footer). Aligned and differentiated — most competitors gate all contact behind a form. |

### Anti-Features (Commonly Requested, Often Problematic)

Includes every anti-feature the spec already bans, plus additional ones surfaced by research that the spec does not explicitly name but should be treated as in scope for the same "no sales pitch" reasoning.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Testimonial carousel (auto-rotating) | "Feels dynamic," lets you show more quotes in less space | Research: "autoplay carousels are often ignored... users may miss rotating content entirely" — the rotation itself suppresses reading, and it's a dated pattern to a senior buyer | Spec's approach is correct: one real testimonial placed statically beside the relevant case-study work (§6.3), none invented. |
| Stat counters (count-up animated numbers) | Feels impressive, cheap to build with a library | Round, animated numbers with no named source read as marketing theater to a CFO; also a JS-budget cost for a pattern research doesn't credit with conversion lift on its own | `[RECEIPT: …]`-disciplined, named, sourced numbers inside case studies (§13) — the number matters only when it's attributable. |
| Award badges | Feels like third-party validation | Badges are self-selected and buyer-invisible as signal in 2026 (anyone can win a "best agency" listicle award); adds visual clutter to a deliberately quiet black/white system | Named client logos + live case studies are stronger third-party proof for this specific audience (OUABC/US Oil are checkable). |
| Guarantees ("we guarantee X% growth") | Feels reassuring, common competitive pattern | Vague guarantees are a known credibility-killer with sophisticated buyers who've been burned before (spec §2 explicitly names this buyer profile) — an unenforceable promise reads as risk, not safety | "How we work" commitments band — specific, falsifiable, owner-confirmed operating facts instead of an outcome promise. |
| Comparison tables (us vs. them) | Feels like it helps buyers decide fast | Directly contradicts spec §2: "The site does not dwell on other agencies failing." Also invites the buyer to benchmark on price/features the site deliberately doesn't publish | Let the case studies and service spec sheets carry the comparison implicitly — a buyer comparing providers already has the other tabs open. |
| Public pricing | Buyers ask for it; feels transparent | Spec §17/PROJECT.md: "anchors buyers low." Published price ranges invite budget-shopping against the wrong client profile (this site targets $10k–25k+/mo relationships, not project quotes) | Budget-tier qualifier in the contact form (already the spec's mechanism) — research confirms this exact substitution pattern for enterprise-tier agencies. |
| "Free consultation" / "book a call" CTA as the primary action | Standard SaaS/agency lead-gen pattern, feels lower-commitment | Reads as generic lead-gen to a buyer who's "let down by past agencies" (spec §2) — cheapens the positioning the whole site is built to avoid, and duplicates the qualifying form's job with a lower bar | Qualifying form (budget-gated) + direct text line — both already require the buyer to self-identify, not just "grab a slot." |
| **(Not in spec, flagged from research) Live chat widget / chatbot bubble** | Feels responsive, common on agency sites | Adds a persistent third-party script (chat vendor JS) that competes for the ≤15KB JS budget and the "quiet, unhurried" visual system (§7); also undercuts the qualifying-form strategy by offering an unqualified back-channel | None needed — the text line already provides a low-friction, human channel without a JS/vendor cost. |
| **(Not in spec, flagged from research) Exit-intent or scroll-triggered popups/modals** | Common conversion-rate-optimization tactic | Directly contradicts "no sales pitch" positioning and the CFO promise of a 60-second, uninterrupted read (§6.1 executive rule); WCAG/motion-interruption risk | None — the persistent text line and per-service preselected CTA already cover intent capture without interruption. |
| **(Not in spec, flagged from research) Animated hero background video** | High "wow factor," common on premium creative-agency sites | Directly threatens the LCP ≤1.2s and ≤15KB JS gates (spec §10) that are launch-blocking; also conflicts with "no 3D/WebGL... nothing heavy" spirit of §9 | The Loop's SVG scroll animation already carries the "big, moving, unexpected" mandate (§8) without video weight. |
| **(Not in spec, flagged from research) Site-wide search or dark-mode toggle** | Feels like a "modern site" feature | Unnecessary at this content volume (11 services + 2 case studies + 18 posts); a toggle would also fight the fixed black/white alternating-band system that *is* the visual signature (§6.1, §8) | Layer filter on `/blog/` and flat, shallow IA already solve findability at this scale. |

## Feature Dependencies

```
Contact form (name/company/email/website/services/budget/timeline/message)
    └──requires──> Services multi-select grouped by layer (Build/Demand/Intelligence taxonomy)
                       └──requires──> Service-preselected inquiry (?service=<slug> pre-checks one option)

The Loop (SVG, scroll-tied line-draw + pulse)
    └──feeds──> Service page "mini loop" (§6.2.2, reused component)
    └──feeds──> Case study "layer lit" treatment (OUABC/US Oil bands, §6.1 bands 4–5)
    └──shares a JS/complexity budget with──> Team shuffle inline script, Turnstile widget, native view transitions

Case studies (OUABC, U.S. Oil)
    └──requires──> Owner-confirmed [RECEIPT: …] numbers (blocks launch per spec §13)
    └──requires──> Real testimonial marked real-vs-placeholder by owner (only real ones ship)

Blog index filtered by layer
    └──requires──> Posts tagged with layer taxonomy (new categories built around Build/Demand/Intelligence, §11)

FAQPage structured data (service pages)
    └──requires──> Services content collection schema with a typed FAQ field (4–6 Q&A pairs)

Redirect map / 410s
    └──requires──> WordPress REST API export + Search Console query data (§12) — blocks zero-broken-link launch gate

"How we work" commitments band
    └──requires──> Owner sign-off per line before launch (explicit spec constraint, not just a content task)

≤15KB JS gzip/page budget (§10)
    └──constrains──> Loop pulse script, team shuffle script, Turnstile widget, view-transition polyfill fallback (if any)
    └──conflicts with──> Any added chat widget, hero video, or animation library (all correctly excluded)
```

### Dependency Notes

- **The Loop is the single shared component** behind three separate spec sections (homepage band 3, every service page's mini-loop, both case studies' "layer lit" treatment). Building it once, early, and reusing it is a roadmap-ordering signal: it should land before service pages and case studies, not after.
- **The JS budget is a shared, finite resource.** Four things draw from the same ≤15KB gzip/page ceiling: the Loop's scroll-tied pulse, the team-shuffle inline script, the Cloudflare Turnstile widget (third-party, loads on the contact page and footer form), and any view-transition fallback logic. None of these are individually expensive, but the roadmap should budget them as one pool, not size each in isolation — measure combined JS weight on the pages where more than one appears (home, service pages with footer form).
- **Service-preselected inquiry depends on the contact form's field structure existing first** — the multi-select-by-layer UI has to support a pre-checked state driven by a URL query param, which is a form-component decision, not a page-content decision. Plan the contact form component before wiring `?service=` links from all 11 service pages.
- **Case studies are content-blocked, not code-blocked.** The actual case-study template can be built in parallel with other pages, but it cannot go live without owner-confirmed receipts and real-vs-placeholder testimonial marks — this is a critical-path dependency already correctly flagged in PROJECT.md's "Owner inputs."

## MVP Definition

This is a full relaunch on a 5–7 day timeline, not a staged product — so "MVP" here means the launch-blocking set already defined by PROJECT.md's Active requirements, distinguished from genuinely deferrable additions.

### Launch With (v1)

- [ ] Homepage: all 9 bands including the Loop signature moment — the core proof of positioning; nothing else on the site substitutes for it
- [ ] All 11 service pages with spec sheet, mini loop, proof, FAQ+schema, preselected inquiry — each is a direct sales asset and an SEO asset simultaneously
- [ ] `/work/` index + both case studies (OUABC, U.S. Oil) with real receipts — the primary trust mechanism for a "let down by past agencies" buyer
- [ ] `/about/` with all seven team members, real locations — table stakes for a high-touch relationship sell
- [ ] `/contact/` qualifying form + text line, spam-protected — the conversion mechanism the whole site points at
- [ ] 18 migrated blog posts at `/blog/<slug>/`, filtered by layer — table stakes for credibility and SEO continuity
- [ ] Full SEO override (structured data, sitemap, redirects, `robots.txt`, `llms.txt`) — required for launch-day ranking continuity, not a v2 nicety
- [ ] Performance/accessibility gates (Lighthouse 100×4, WCAG 2.2 AA, ≤15KB JS) — launch-blocking per spec §10, not negotiable

### Add After Validation (v1.x)

- [ ] Remaining ~79 recovered blog posts (already flagged in PROJECT.md as post-launch)
- [ ] Additional client logos as new cleared-for-use logos become available (logo wall is designed to accept more without a redesign)
- [ ] RSS/Atom feed for `/blog/` — cheap addition, aids syndication and llms.txt-adjacent AI-answer visibility; not requested in spec but low-cost and low-risk to add once the blog template is stable
- [ ] A lightweight "how did you hear about us" field on the contact form for marketing attribution — useful operationally, not required for the qualifying job the form already does; add only if it doesn't add a full extra form step

### Future Consideration (v2+)

- [ ] Additional case studies as new anchor clients (beyond OUABC/U.S. Oil) reach a defensible tenure/result — deliberately deferred; a thin third case study would dilute rather than strengthen the "two deep relationships" proof pattern (spec §3)
- [ ] Any firmographic/behavioral personalization of homepage content — 2026 "enterprise trend" research flags AI personalization as an emerging pattern, but it directly conflicts with the ≤15KB JS budget, the static-first architecture (§14), and the "CFO reads the whole page in 60 seconds" executive rule (§6.1) — explicitly not a fit for this spec, not just deferred
- [ ] Site-wide search — revisit only if content volume (services + posts + case studies) grows past what layer-filtering and flat IA can handle

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| The Loop (homepage signature + reused component) | HIGH | HIGH | P1 |
| Case studies with receipts | HIGH | MEDIUM | P1 |
| Qualifying contact form + budget tiers | HIGH | MEDIUM | P1 |
| Service pages (spec sheet + FAQ schema) | HIGH | MEDIUM | P1 |
| Service-preselected inquiry (`?service=`) | MEDIUM | LOW | P1 (cheap, high leverage — bundle with contact form build) |
| "How we work" commitments band | MEDIUM | LOW (content) / MEDIUM (owner sign-off) | P1 |
| Team page, real photos, random order | MEDIUM | LOW | P1 |
| Full SEO/structured-data override | HIGH | MEDIUM | P1 |
| Redirect map / 410s | HIGH (risk mitigation) | MEDIUM | P1 |
| Blog migration (18 posts) + layer filter | MEDIUM | MEDIUM | P1 |
| RSS feed | LOW | LOW | P2 |
| "How did you hear about us" field | LOW | LOW | P2 |
| Additional case studies | MEDIUM | HIGH (content-blocked) | P3 |
| Personalization / dynamic homepage content | LOW (conflicts with spec) | HIGH | P3 (do not build) |
| Site-wide search | LOW at this content volume | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible post-launch
- P3: Nice to have or explicitly deferred/rejected

## Disagreements With the Spec (flagged separately, per instructions)

None of these contradict an owner decision — they're implementation-level tensions worth surfacing during requirements/roadmap, not scope changes.

1. **Case-study ordering.** Spec §6.3 orders case studies as: situation → loop → work → receipts → screenshots → testimonial → next case. Research on B2B case studies that convert senior buyers is consistent that **results should lead**, with context compressed to a line, because "most readers leave before they get [to results]." Recommendation: keep the spec's content set, but consider a "the result, then the story" layout — e.g., a one-line result strip immediately under the client name/live-link header, before the full situation narrative — rather than changing what's included. This is a layout sequencing suggestion, not a content change, and should be validated on real screens during the design phase (spec §8 already defers final visual decisions to that stage).
2. **Contact form field count vs. multi-step research.** Spec §6.5 specifies 7 field groups (name, company, work email, website, services multi-select, budget, timeline, message) on what reads as a single form. Research across agency-specific A/B tests suggests multi-step presentation (revealing fields in groups of 3–4) outperforms single-page walls by 10–30% in conversion. This does not conflict with the spec's field list or its single Vercel-function delivery mechanism — it's a presentation-layer decision (progressive disclosure within one page, no page reloads) that can be made during UI design without reopening the requirements.

## Sources

- [Enterprise Web Development Trends in 2026 — belovdigital.agency](https://belovdigital.agency/blog/enterprise-web-development-trends-in-2026/)
- [Enterprise Website Design Trends 2026 — vezadigital.com](https://www.vezadigital.com/post/enterprise-website-design-trends-2026)
- [5 B2B Website Design Trends to Watch in 2026 — cleardigital.com](https://www.cleardigital.com/insights/5-b2b-website-design-trends-to-watch)
- [How to turn B2B case studies into high converting pages — grafit.agency](https://www.grafit.agency/blog/b2b-case-studies-that-convert)
- [10 Best B2B Case Study Examples and Why They Convert — grafit.agency](https://www.grafit.agency/blog/b2b-case-study-examples-that-convert)
- [How to Build a B2B Case Study That Converts Prospects — sagefrog.com](https://www.sagefrog.com/blog/how-to-build-a-b2b-case-study-that-converts-prospects/)
- [18 Lead Generation Forms: Examples & Best Practices — vwo.com](https://vwo.com/blog/lead-generation-forms/)
- [Best Contact Form for Agency Websites in 2026 — splitforms.com](https://splitforms.com/blog/best-contact-form-for-agencies)
- [FAQ Schema for SEO: How to Improve Search Visibility in 2026 — wellows.com](https://wellows.com/blog/improve-search-visibility-with-faq-schema/)
- [FAQ Schema in 2026: Why FAQ Sections Still Matter for SEO — alfdesigngroup.com](https://www.alfdesigngroup.com/post/faq-sections-aeo-strategy)
- [Website Trust Signals That Convert B2B Buyers: The A.C.I.D. Guide — squarerootseo.com](https://squarerootseo.com/blog/website-trust-signals-that-convert/)
- [Trust Signals That Convert: A Funnel Placement Framework — digitalapplied.com](https://www.digitalapplied.com/blog/social-proof-trust-signals-2026-conversion-placement-framework)
- [Best Testimonial Examples & Best Practices in UI/UX Design in 2026 — uinkits.com](https://www.uinkits.com/blog-post/best-testimonial-examples-best-practices-in-ui-ux-design-in-2026)
- [View Transitions API and CSS Scroll-Driven Animations: The Browser Wins of 2026 — frontendhorizon.com](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026)
- [Accessibility & Inclusive Motion Standards — css-scroll-driven.com](https://www.css-scroll-driven.com/accessibility-inclusive-motion-standards/)
- [Design accessible animation and movement — Pope Tech Resources](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/)
- Internal: `/Volumes/Satechi Hub/zinc-digital-web/.planning/PROJECT.md` and `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` (spec, treated as authority per task instructions)

**Confidence caveat:** No live teardown of specific named competitor agency sites (e.g., Clay, Instrument, Pentagram-adjacent studios) was performed in this pass — findings are pattern-level, synthesized from 2026 trend/best-practice articles rather than direct site audits. If the roadmap needs named competitor benchmarking (e.g., for the visual design phase), that should be a targeted follow-up with direct site visits, not an extension of this document.

---
*Feature research for: Premium B2B agency website (ZINC Digital redesign)*
*Researched: 2026-09-25*
