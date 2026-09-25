# Pitfalls Research

**Domain:** WordPress→static (Astro/Vercel) agency site migration, motion-heavy design held to Lighthouse 100, serverless contact form on Google Workspace, 5–7 day launch
**Researched:** 2026-09-25 (CT)
**Confidence:** MEDIUM (web search cross-checked across 2+ independent sources per finding; Vercel/Astro platform behavior confirmed against current official docs via context7; no primary-source access to Kinsta/Cloudflare/Route 53 config, so DNS specifics are best-practice patterns, not this project's live config)

## Critical Pitfalls

### Pitfall 1: Catch-all or missing redirects silently bleed indexed URLs

**What goes wrong:**
The team builds a handful of "obvious" redirects (`/about-us/` → `/about/`, etc.) and either skips the long tail (tags, categories, paginated archives, attachment pages, `/current-promos/`) or bulk-redirects everything unmapped to the homepage. Google treats mass homepage redirects as soft-404s and drops the URLs from the index instead of transferring their equity. Traffic and rankings erode over weeks, not instantly — so it isn't caught at launch, it's caught in the following month's organic report.

**Why it happens:**
The live site has 18 posts, 14 pages, 16 categories, and 86 tags (measured 2026-09-25), but the new site's flat IA (11 service pages, no category/tag archive pages) has no 1:1 target for most of that surface. Under a 5–7 day deadline, mapping every one of those 116+ old URLs individually looks like it can wait.

**How to avoid:**
Build the redirect map from two live sources per spec §12: the WordPress REST API URL list and Google Search Console (Performance + Coverage) to find which of those 116+ URLs actually have traffic, backlinks, or indexed status. Anything with signal gets a real 1:1 destination; everything else gets 410, not a redirect to `/`. Test the full map with a script before cutover (already an Active requirement) — script should assert zero redirects targeting `/` except the literal root, and zero redirect chains (A→B→C).

**Warning signs:**
- Redirect map has a `/*` or default catch-all rule to `/`.
- Redirect map has fewer than ~40 entries for a site with 116+ known old URLs.
- Any destination in the map itself later redirects again (chain).

**Phase to address:**
SEO/redirects phase (spec's indicative step 5) — before cutover, not after.

---

### Pitfall 2: 301 vs 308 mismatch breaks non-GET requests and wastes crawl signal

**What goes wrong:**
Vercel's `redirects` config in `vercel.json` defaults to **308** for `permanent: true` and **307** for `permanent: false`, not 301/302. If the team assumes "permanent redirect = 301" and hand-writes explicit `301`/`302` status codes out of habit, that's fine for SEO (Google treats 301 and 308 as equivalent permanent-redirect signals) — but if a redirect rule fires on a form POST or webhook callback (e.g., an old `/contact/` form action, or a WordPress REST API path something external still calls), a 301/302 rewrites the method to GET and drops the body, while 307/308 preserve it. Vercel's own docs recommend 307/308 specifically to avoid this ambiguity for non-GET traffic.

**Why it happens:**
Legacy SEO advice (and most tutorials) talk only about 301 vs 302; the method-preservation distinction (307/308 vs 301/302) is a separate axis most people don't think about until something breaks.

**How to avoid:**
Use `permanent: true` in `vercel.json`'s `redirects` array (→ 308) for all real permanent moves rather than hardcoding `301`, unless a specific downstream consumer requires exactly 301. Confirm in the redirect-testing script that Google-indexed URLs return a 3xx with `Location` pointing to the final destination in one hop, and that any redirect that could receive non-GET traffic is 307/308.

**Warning signs:**
- Hardcoded `"status": 301` throughout `vercel.json` with no consideration of POST/webhook paths.
- Redirect test script only checks status code, not `Location` header or method preservation.

**Phase to address:**
SEO/redirects phase; verify in the launch-gate QA pass (spec §10, "zero broken internal links").

---

### Pitfall 3: 410 is hard to produce on a static-output Astro/Vercel site

**What goes wrong:**
The spec requires "every old URL resolves to its mapped target or 410" (§10). On a fully static (`output: 'static'`) Astro build, there's no per-request server to set a custom status code — static hosts serve whatever status the CDN gives a matched file, and a prerendered page can't set `Astro.response.status = 410` because it doesn't run per-request. Teams under deadline pressure quietly substitute a 404 (or a redirect to `/`) for the 410s the spec calls for, which is a silent scope miss that only shows up in a header-by-header audit.

**Why it happens:**
410 (Gone, explicit and permanent) vs 404 (Not Found, ambiguous) is a distinction Google explicitly says it treats differently for re-crawl frequency — but most static-site tooling and CDN configs only have first-class support for 404s.

**How to avoid:**
Two working paths on Astro + Vercel: (1) mark the specific retired-URL routes `export const prerender = false` so they run as Vercel Functions and can set `Astro.response.status = 410` per request, keeping the rest of the site static; or (2) use `vercel.json` route rules that map the retired-URL patterns to a static 410 response via a custom header/status rule. Pick one, list every URL that needs it (from the tags/categories/promos decision in spec §12), and include 410 verification in the automated redirect-map test script alongside the 3xx checks.

**Warning signs:**
- Retired URLs return 404 instead of 410 when tested.
- No explicit list of which old URLs get 410 vs redirect exists before build starts.

**Phase to address:**
SEO/redirects phase; this is a build-architecture decision, so raise it when the redirect map is being scoped, not after the static build is already locked in.

---

### Pitfall 4: Google Workspace SMTP relay's IP-based auth doesn't work from Vercel serverless functions

**What goes wrong:**
Spec §14 says the contact form delivers "via the existing Google Workspace domain (MX → Google)." The common way to send FROM a Workspace domain programmatically is Workspace's SMTP relay service — but SMTP relay's IP-based authentication option requires a **static, registered outbound IP**, and Vercel Functions do not have a fixed outbound IP by default (it varies per invocation/region). A team that configures SMTP relay with IP auth will see it work in local testing (from a home/office static-ish IP) and then fail intermittently or completely in production, because Google is validating whatever NAT/edge IP Vercel's infra happens to expose that request through — which isn't on the allowlist and isn't stable enough to allowlist.

**Why it happens:**
SMTP relay's IP-auth mode is written for on-prem devices (printers, scan-to-email, mail servers) with a known static IP — not ephemeral serverless compute.

**How to avoid:**
Do not use SMTP relay's IP-allowlist auth mode. Instead, use SMTP relay with **credential-based auth** (a Workspace mailbox's SMTP username/password, or better, OAuth2/XOAUTH2 with a service account) which doesn't depend on source IP, or send via the Gmail API (OAuth2) instead of raw SMTP. Confirm which auth mode is actually configured in the Workspace Admin console before assuming "MX → Google" delivery will work from Vercel; test the exact serverless code path against production Workspace settings, not a local script, before calling this done. If credential/OAuth complexity threatens the 5–7 day window, a transactional email API (that still delivers to `jaymie@zincdigital.co`) is a lower-risk fallback that keeps the "no paid services" constraint (most have a free tier sufficient for a low-volume contact form) — but this changes the sending domain's SPF/DKIM, see Pitfall 5.

**Warning signs:**
- Form works in local dev / `vercel dev` but fails or times out in production.
- Workspace Admin console shows SMTP relay configured with an IP range, not credentials.
- No test of the actual deployed Vercel Function's email path before declaring the form "done."

**Phase to address:**
Contact form / form delivery phase (spec's indicative step 4) — resolve the auth mode decision before writing the function, not while debugging a launch-blocking failure.

---

### Pitfall 5: Adding a sender breaks SPF's 10-lookup limit or fails DMARC alignment

**What goes wrong:**
`zincdigital.co`'s existing SPF record already authorizes Google Workspace (`include:_spf.google.com`) for regular mail. If the contact-form function sends through a different path (a transactional API, or a second Google mechanism), the team appends another `include:` — and SPF has a hard 10-DNS-lookup ceiling. Cross a small number of `include:` chains (Google's own include alone can consume several) and the entire domain's SPF starts returning `permerror`, which many receivers treat as an outright SPF fail for **all** mail from the domain, including normal Workspace mail unrelated to the form. Separately, if a third-party sender is used, its messages may pass SPF for its own return-path but fail DMARC **alignment** unless DKIM is also correctly signed under `zincdigital.co` — so "SPF passed" is not proof deliverability is solid.

**Why it happens:**
SPF lookup limits and DMARC alignment rules are non-obvious and not enforced until a receiving server (Gmail, Outlook) starts silently folder-ing or rejecting mail — there's no local error.

**How to avoid:**
Before adding any sending mechanism beyond existing Workspace mail, count existing SPF lookups (`dig TXT zincdigital.co`) and confirm headroom. Prefer a solution that sends *as* `jaymie@zincdigital.co` through Workspace itself (Pitfall 4's OAuth/credential path) so no new SPF include is needed at all. If a third-party transactional sender is used instead, configure its DKIM signing under the sending domain and verify DMARC alignment (`dmarc-reports@` or a checker tool) — don't just confirm the email arrived once in testing. Keep DMARC at `p=none` initially if any uncertainty remains, then tighten after a monitoring period; do not ship straight to `p=reject` on a fresh sending path days before launch.

**Warning signs:**
- `dig TXT zincdigital.co` shows an SPF record close to or over 10 lookups.
- New sender's test email lands but shows "via" or a mismatched return-path domain in Gmail's header detail.
- DMARC record (if one exists) already at `p=quarantine`/`p=reject` with no monitoring window for the new sender.

**Phase to address:**
Contact form / form delivery phase, same gate as Pitfall 4.

---

### Pitfall 6: font-display: swap without metric-matched fallback fonts trades FOIT for a CLS penalty

**What goes wrong:**
The team sets `font-display: swap` to avoid invisible text (satisfying one Lighthouse check) but the self-hosted condensed grotesk display font has different character widths/line-height than the system fallback. When the real font swaps in, every heading reflows — and because the spec calls for **huge display type** in bands 1, 3, and 4, that reflow is large and visually obvious, which Lighthouse's Cumulative Layout Shift measurement scores heavily. The team hits `swap` correctly, sees text-visible-during-load pass, and still fails the CLS-0 launch gate.

**Why it happens:**
`font-display: swap` only controls *when* the fallback-to-webfont swap happens, not *how much* it shifts layout. Metric alignment (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` on a `@font-face` fallback declaration) is a separate, easy-to-skip step.

**How to avoid:**
For each of the (≤3, per spec §8) self-hosted display/body/mono fonts, generate a metric-matched fallback `@font-face` (tools like Fontaine/`capsize` compute the override values from the real font's metrics) and use it as the immediate fallback in the font stack, so the swap is visually near-invisible. Test by throttling network in Lighthouse/WebPageTest and watching the heading region specifically — not just the aggregate CLS number, since a brief flash on a hero H1 can dominate the whole page's score.

**Warning signs:**
- CLS score is nonzero specifically on templates with large display headings (home hero, service page H1).
- No `size-adjust`/`ascent-override` declarations exist alongside the `@font-face` rules.

**Phase to address:**
Design system + font pick phase (spec's indicative step 1) — the metric-override fallback must be built when the font pairing is chosen, not patched in during QA.

---

### Pitfall 7: The Loop's scroll-driven pulse animation has no correctness guarantee outside Chromium/Safari 26+, and "reduced motion = finished state" is easy to build wrong

**What goes wrong:**
Spec §9 requires native CSS scroll-driven animation (`animation-timeline`) with `prefers-reduced-motion` and no-scroll-timeline-support users getting "each scene's finished state with no content loss." `animation-timeline: scroll()`/`view()` has real but uneven support: Chrome/Edge 115+, Safari 18+/26 depending on the specific timeline function, and Firefox only recently and inconsistently (behind flags in parts of 2026). A team that tests only in Chrome during a 5–7 day sprint ships a homepage where Firefox and some Safari versions show the Loop's SVG mid-animation, frozen, or not drawn at all — a partially-drawn circuit line is worse than no animation, because it reads as broken, not as a deliberate static state.

**Why it happens:**
`@supports` feature-detection for `animation-timeline` is straightforward, but writing the *actual finished-state CSS* (the fully-drawn line, pulse-at-rest, layers at scale) as a distinct, deliberately-designed fallback — not just "whatever frame the animation happened to stop on" — is extra design and CSS work that's easy to deprioritize against a five-day clock.

**How to avoid:**
Build the Loop's finished/static state as a first-class design deliverable (owner should see and approve it, since it's what CFOs on Firefox/older Safari will actually see), gated behind `@supports not (animation-timeline: scroll())` and `@media (prefers-reduced-motion: reduce)`, both pointing at the same finished-state CSS. Test explicitly in Firefox and at least one older Safari/iOS version before calling the homepage phase done — "it works in Chrome DevTools" is not sufficient verification per this project's own `verification-before-completion` discipline.

**Warning signs:**
- No dedicated CSS for the finished/no-support state — only the animated version exists.
- Testing only in Chrome/Chromium during the build.
- Reduced-motion testing done only via DevTools emulation, not an actual OS-level reduced-motion toggle.

**Phase to address:**
Home + Loop phase (spec's indicative step 2), with explicit cross-browser verification before sign-off.

---

### Pitfall 8: Pinned/sticky Loop section breaks on mobile Safari's dynamic viewport and toolbar

**What goes wrong:**
Band 3 (the Loop) is "pinned" while its animation plays out — a common implementation is `position: sticky` on the band with a tall scroll-driving container. On iOS Safari, elements combining `position: sticky`/`fixed` with compositing effects (backdrop-filter, transforms) can lag behind fast scrolls and appear to "jump" or freeze at a stale offset, because the toolbar's show/hide behavior changes the visual viewport height dynamically and Safari's compositor doesn't always keep sticky layers synced with it. Recent iOS builds have also shipped regressions where `position: sticky; bottom: 0` stops tracking the viewport correctly when the toolbar animates. Since the spec explicitly calls out mobile pinned sections as a concern, and mobile is also the Lighthouse-gate target (spec §10 says "Lighthouse mobile"), this pitfall sits directly on the critical path.

**Why it happens:**
iOS Safari's dynamic toolbar changes `100vh` and viewport height mid-scroll in ways desktop browsers don't; sticky/fixed positioning combined with any GPU-compositing trigger (filters, certain transforms) can decouple from the compositor thread during fast scrolls.

**How to avoid:**
Test the Loop section specifically on real iOS Safari (not just Chrome DevTools device emulation) at multiple scroll speeds, with the address bar both shown and collapsed. Avoid `backdrop-filter` on the pinned element; if jank appears, force the sticky element onto its own compositing layer with a cheap `transform: translateZ(0)` (or `will-change: transform`) hint. Prefer CSS scroll-driven `animation-timeline` on the *inner* animated elements over JS-driven pin logic — this keeps the pin itself off the main thread and reduces the surface area for iOS-specific jank.

**Warning signs:**
- Loop band only tested in desktop browser or device emulator, never a physical iPhone.
- Visible "jump" or freeze when scrolling fast through the Loop section on an actual iOS device.

**Phase to address:**
Home + Loop phase, verified again in the QA/owner-review phase (spec's indicative step 6) on a real device.

---

### Pitfall 9: In-memory rate limiting on Vercel Functions does nothing against real abuse

**What goes wrong:**
The team writes a rate limiter that tracks submission counts in a module-level JS variable inside the Vercel Function. It "works" in manual testing (same warm instance, few requests) and then does nothing in production, because each invocation can run in a different, freshly-cold container — there is no shared memory across invocations on serverless. A spam run of hundreds of submissions in a burst sails through, each hitting a fresh container with an empty counter.

**Why it happens:**
The mental model of "a server process that stays running" doesn't hold for serverless; this is one of the most common serverless correctness mistakes and isn't caught by local `vercel dev` testing, which often reuses one process.

**How to avoid:**
Use durable rate-limit state — either Vercel's built-in WAF rate limiting (available on the Pro plan already in use per spec §14, so no new cost) applied at the edge in front of the form endpoint, or a shared store (Upstash Redis free tier, if WAF rate limiting doesn't cover the granularity needed) — not an in-memory counter. Combine with the honeypot field and Turnstile already scoped in the spec; none of the three is sufficient alone.

**Warning signs:**
- Rate limiter implemented as a plain in-memory object/array/Map inside the function file with no external store.
- Load-testing the endpoint with rapid concurrent requests from a script shows no throttling.

**Phase to address:**
Contact form / form delivery phase.

---

### Pitfall 10: Magenta `#FC0781` fails WCAG contrast as small text, and kinetic type risks the AA gate the spec itself set

**What goes wrong:**
Spec §8 already flags this partially ("small magenta text only on black... fails contrast" on white) — the risk is that this rule gets violated in a late-stage design tweak (a magenta caption, a magenta link inline in body copy, a magenta FAQ badge) that isn't caught until the Lighthouse Accessibility gate fails at 99, not 100. Separately, the animated "strike through" and "highlighter hit" effects on the hero core line (spec §6.1 band 1) and the "type in, then lock" How We Work band are exactly the kind of auto-playing, more-than-five-seconds animated text WCAG 2.2 AA (SC 2.2.2) requires a pause/stop/hide mechanism for, unless the animation is short and non-essential to understanding the content.

**What goes wrong (contrast, concretely):** `#FC0781` on white (`#F5F6F7`) computes well under the 4.5:1 AA text minimum — a pure, more-conservative red (`#FF0000`) only reaches ~4:1 on white, and magenta/pink hues are typically lower-contrast than red at equivalent lightness, so `#FC0781` as body-size text on the light band almost certainly fails outright, not just marginally.

**Why it happens:**
The rule ("magenta only at display size or as graphics on white; small magenta text only on black") lives in a spec document, not in a linted design-token constraint — it's easy for a component built weeks apart from when the rule was written to violate it once, which is all it takes to fail the automated gate.

**How to avoid:**
Encode the constraint as a design token rule, not tribal knowledge: define `--color-magenta-text-safe: { minSize: display, allowedBackground: black }` in whatever token/lint layer exists, or at minimum a single shared CSS class (`.magenta-accent`) that's the only sanctioned way to apply the color to text, audited once rather than trusted per-component. Run axe/Lighthouse Accessibility on every template as a hard gate before sign-off (already required, spec §10) — treat any sub-100 Accessibility score as launch-blocking, not "close enough." For the animated text effects, keep each animated reveal short (a few seconds, one-time, triggered by scroll-into-view rather than looping) so it falls outside SC 2.2.2's "more than five seconds, auto-updating" trigger, and confirm this explicitly rather than assuming intent counts.

**Warning signs:**
- Any Lighthouse Accessibility score below 100 on any template during QA.
- Magenta used as inline body-size text color anywhere on a white/light band.
- Any animated text sequence that loops or exceeds ~5 seconds without a way to stop it.

**Phase to address:**
Design system phase for the token/lint rule; verified per-template at the QA/owner-review phase (spec's indicative step 6).

---

### Pitfall 11: DNS cutover TTLs and Search Console verification lapse at the exact moment the team can least afford it

**What goes wrong:**
Two related failures cluster around the Route 53 → Vercel cutover (spec §15): (1) TTLs on the `zincdigital.co`/`www` records are left at their current (likely long, e.g., 3600s+ or higher under Cloudflare-proxied setup) value, so the cutover doesn't actually propagate for hours, during which some visitors hit the old Kinsta site and some hit Vercel inconsistently — including Googlebot, which can crawl the new site mid-propagation with stale DNS and misjudge the migration; (2) the existing Search Console property's verification method (if DNS TXT-based) gets disturbed by the DNS record changes made during cutover, silently un-verifying the property at the exact moment the team needs Search Console to confirm the new site is indexing correctly.

**Why it happens:**
TTL lowering is a "do this 24–48+ hours before, not at, cutover time" step that's easy to fold into "cutover day" under schedule pressure; DNS TXT verification records are easy to overlook as "just another record" when auditing/cleaning up the zone during cutover.

**How to avoid:**
Lower TTLs on the records that will change (A/AAAA/CNAME for apex and `www`) to 300s at least 24–48 hours ahead of the actual cutover window, not on the day of. Before touching any DNS record, export the full current zone (including the Search Console TXT verification record, any existing SPF/DKIM/DMARC records, MX records, and CAA records) and diff the planned new zone against it record-by-record — this project already keeps Kinsta as a 30-day rollback (spec §15), so there's no excuse for cutting a corner on the export. Re-confirm Search Console verification status immediately after cutover, and set up DNS-TXT verification on the new setup as a backup method in addition to whatever's already there, so a single record change can't strand verification either way. If the current site is Cloudflare-proxied in front of Kinsta, confirm whether the *new* Vercel-facing DNS should also be proxied or DNS-only (grey vs orange cloud) before cutover — mail (MX/SPF/DKIM/DMARC) records must stay DNS-only regardless of what happens to the web-facing apex/www records.

**Warning signs:**
- TTL lowering happens same-day as cutover instead of 24–48 hours prior.
- No full DNS zone export/diff exists before cutover.
- Search Console shows "property not verified" any time in the 48 hours after cutover.
- MX/SPF/DKIM/DMARC records accidentally proxied (orange-cloud) if Cloudflare stays in the path.

**Phase to address:**
Cutover phase (spec's indicative step 7) — the prep steps (TTL lowering, zone export, backup verification method) belong in the QA/pre-cutover phase, 1–2 days before the actual DNS flip, not folded into cutover day itself.

---

### Pitfall 12: Owner copy review, sitting on the critical path, has no explicit checkpoint cadence — so it either blocks everything at the end or gets rubber-stamped

**What goes wrong:**
PROJECT.md and the spec both flag copy review as the critical path for the 5–7 day window (spec §16, PROJECT.md constraints), but neither specifies *when* within the sequence the owner reviews what. Two failure patterns are equally likely under time pressure: either the team waits to show the owner anything until near-final (day 5–6), discovers required-true content isn't true yet (the "How we work" commitments must be "confirmed true by the owner before launch" per spec §6.1 band 6; case-study numbers are `[RECEIPT: …]` placeholders per spec §13 until confirmed) with no time left to fix it — or the owner is shown so much, so fast, that review becomes a rubber stamp and factual errors (an unconfirmed receipt, an untrue "how we work" line) ship anyway.

**Why it happens:**
"Owner review is the critical path" is a true statement about risk, but it isn't yet a schedule — a risk only becomes a mitigation once it has checkpoints, owners, and dates attached, which is exactly the gap agency-timeline research consistently flags as the most common and least-controlled delay source.

**How to avoid:**
Convert the indicative 7-step sequence (spec §16) into explicit named checkpoints where owner input is a hard gate, not a courtesy: (1) font pairing choice — owner picks one of three, blocks all subsequent visual work; (2) every `[RECEIPT: …]` placeholder resolved to a real number or explicitly cut — blocks the case-study and OUABC/U.S. Oil bands; (3) every "How we work" commitment confirmed true — blocks that band's copy lock; (4) Jaymie/Wendy photos supplied — blocks the team band; (5) final full-site copy pass — blocks cutover. Each checkpoint gets a date, not just a name, and the team does not proceed past a gate without the specific input it needs (not "send when you can" — a named field/list with a due date). Since testimonials are explicitly "part real, part placeholder" until the owner marks each one (spec §13), build the testimonial section to gracefully omit any unmarked quote rather than blocking on it.

**Warning signs:**
- No day-by-day checkpoint list exists with owner as the named blocking party for each.
- `[RECEIPT: …]` placeholders still present in copy being built into final templates rather than tracked in a single open list.
- "How we work" band copy gets built and styled before the confirm-true step happens, creating pressure to ship it anyway rather than cut it.

**Phase to address:**
Applies across every content-bearing phase (steps 2–6); the checkpoint schedule itself should be set explicitly at project kickoff / roadmap creation, not discovered mid-build.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Redirect only high-traffic old URLs, 410 the rest without checking Search Console backlinks | Saves redirect-mapping time under the 5–7 day clock | Silent loss of backlink equity on pages Search Console would have flagged as linked | Only if Search Console backlink data was actually checked for every 410 candidate, not skipped |
| Ship the Loop animation Chrome-only, defer cross-browser finished-state CSS to "polish" | Homepage looks done fast in the demo browser | Firefox/older Safari visitors (a share of CFO-persona desktop users) see a broken half-animation, which undercuts the exact "serious option" positioning the site exists to prove | Never for the signature moment; acceptable only for genuinely decorative micro-interactions elsewhere |
| Use SMTP relay with IP-auth because it's the first thing that appears in Workspace docs | Fast to configure, "works" in local test | Production failures on serverless are found late, often after launch, when the form silently stops delivering | Never — not compatible with the serverless architecture at all |
| In-memory rate limiting on the form endpoint | Zero extra dependency, ships in minutes | No actual spam protection in production; false sense of security | Never in production; fine only as a local-dev placeholder before wiring the real store |
| Skip metric-matched fallback fonts, rely on `font-display: swap` alone | One line of CSS, ships instantly | CLS gate failure discovered late, on the exact bands (hero, Loop) that carry the most design weight | Never on templates in the Lighthouse gate — every template is gated, so there's no "low-stakes" page to cut this on |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Vercel `redirects` in `vercel.json` | Assuming `permanent: true` maps to 301 | It maps to 308; use explicit status only when a downstream consumer specifically requires 301, and always verify actual returned status in the redirect test script |
| Google Workspace SMTP relay | Configuring IP-based auth for a Vercel Function | Use credential/OAuth-based auth, or send via Gmail API, since serverless has no static outbound IP |
| Cloudflare Turnstile | Relying on implicit (auto-scan) rendering for a form that may be dynamically rendered or re-rendered by client-side routing (Astro view transitions) | Use explicit rendering (`turnstile.render()`) so the widget lifecycle is controlled and refreshed correctly after a client-side navigation |
| Google Search Console | Verifying only the exact domain/subdomain combination in active use | Submit Change of Address and hold verification for every historical variant (www, non-www, http, any prior subdomain) even if unused today |
| Cloudflare-in-front-of-Kinsta → Route 53-to-Vercel cutover | Treating all DNS records as web-facing and proxying them uniformly | Keep MX/SPF/DKIM/DMARC records DNS-only (grey-cloud) regardless of what happens to the web A/CNAME records; audit record-by-record, not by "flip everything" |
| GA4 / Google Ads tag continuity | Assuming a new template automatically fires the existing `GT-NNZRWNCF` / `G-BV43HRVJ18` / `AW-17071018445` correctly just because the ID string is present in code | Verify actual hits arrive in GA4 Realtime and Ads conversion tracking on the live Vercel preview before cutover, not just that the tag ID is pasted in |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Unmatched fallback font metrics on display headings | CLS nonzero specifically on hero/Loop templates | Metric-matched `@font-face` fallback (size-adjust, ascent/descent-override) per font | Breaks the CLS-0 gate immediately on any template with large display type, i.e., most of this site |
| Too many preloaded font files | LCP regresses instead of improves | Preload exactly the one font file used by the LCP element; don't preload all three type families | Breaks once more than ~1–2 fonts are marked preload; each additional preload competes for priority bandwidth |
| JS-driven scroll/pin logic (vs. native `animation-timeline`) | INP/TBT climbs on mobile; scroll feels janky | Use CSS `animation-timeline: scroll()`/`view()` for the Loop and any pinned sections; reserve JS only for the team-shuffle (already scoped as "a tiny inline script" per spec §9) | Breaks the ≤15KB JS budget and the INP <100ms gate together if a scroll library gets pulled in "just to make it easier" |
| Unoptimized case-study screenshots (device frames, OUABC/U.S. Oil bands) | LCP/CLS regress on `/work/` and case study pages specifically | AVIF/WebP, explicit width/height, responsive `srcset`, already required by spec §10 — but easy to forget on late-added proof screenshots | Breaks once real screenshots replace placeholders late in the build, if dimensioning isn't re-verified |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Vercel preview deployment URLs left without Deployment Protection | Unfinished/unapproved copy (including unconfirmed `[RECEIPT: …]` placeholders or draft "How we work" claims) becomes reachable by anyone with the `.vercel.app` link, and can leak via OG previews, Slack, GitHub Action logs | Enable Deployment Protection (login-gated) on all non-production deployments, not just the `noindex` header Vercel adds by default — noindex stops search engines, not people with the link |
| Form endpoint trusts client-supplied data without server-side validation matching the budget/service enum options | Spam or malformed submissions with arbitrary budget/service strings pollute the lead list Jaymie works from | Validate the budget and service-multiselect fields server-side against the exact spec §6.5 enum, reject anything else, independent of client-side form constraints |
| Turnstile verified client-side only, server trusts a boolean flag from the client instead of calling Cloudflare's siteverify | Trivially bypassable — an attacker just sends the "verified" flag directly to the API route | Server-side function must call Cloudflare's siteverify endpoint itself with the token on every submission; never trust a client-asserted verification state |
| Secrets (Turnstile secret key, any email-auth credentials) committed to a `.env` file that gets checked in | Credential leak in git history | Confirmed already as owner-entered Vercel environment variables per spec §14 — keep it that way; add a pre-commit check or `.gitignore` entry as a backstop |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Auto-playing "type in, then lock" How We Work band with no way to pause, running longer than 5 seconds | Fails WCAG 2.2 AA SC 2.2.2 for users with attention or vestibular conditions; also just annoying for a CFO skimming | Keep the type-in effect brief (well under 5s) and non-blocking — content should be fully legible immediately even if the animation is still finishing, not dependent on waiting it out |
| Team reshuffle on every load (spec §6.4/§6.1 band 7) implemented as a full re-render that causes a layout shift | CLS hit on `/about/` and the homepage team band; jarring flash for repeat visitors | Reserve fixed grid dimensions before shuffle runs; animate position swaps with `transform`, not DOM reflow |
| Magenta "strike through the scope, highlighter hit the business" hero effect timed to autoplay on load rather than gated behind reduced-motion and a sensible one-time trigger | Same-session reflow of the single most important line on the site (the core positioning line) risks looking broken if it fires before fonts/layout have settled | Trigger only after fonts are confirmed loaded (or use the finished state as the base render, animating *into* emphasis rather than *out of* plain text) so a slow connection never shows a mid-animation broken-looking state |
| Mobile pinned Loop section scroll-jank (Pitfall 8) read by a CFO on a phone as "this site is broken" | Directly undercuts the site's entire job — the right prospect is supposed to leave "certain ZINC is the serious option" | Real-device iOS testing before sign-off, not emulator-only |

## "Looks Done But Isn't" Checklist

- [ ] **Redirect map:** Often missing the long tail (tags/categories/paginated archives) — verify against the full WordPress REST API URL export, not just the main nav pages.
- [ ] **410 responses:** Often silently downgraded to 404 or a redirect-to-home because static hosting makes true 410s harder — verify actual HTTP status per retired URL, not just "resolves to something."
- [ ] **Contact form email delivery:** Often works in local/preview testing (different network path) but fails in production — verify a real submission from the live/preview Vercel deployment lands in `jaymie@zincdigital.co`, not just that the function returns 200.
- [ ] **Rate limiting:** Often implemented as an in-memory counter that "passes" a quick manual test — verify with a scripted burst of concurrent requests against the deployed endpoint.
- [ ] **CLS-0 gate:** Often measured only on a cached repeat-view — verify on a cold/throttled first load, since font-swap and image-load shifts only show up before caching kicks in.
- [ ] **Cross-browser Loop fallback:** Often only visually checked in Chrome — verify the finished/no-support state renders correctly in actual Firefox and an older Safari/iOS version.
- [ ] **Magenta contrast rule:** Often violated by one late-added component (a badge, an inline link) — verify with an automated contrast check across every template, not a one-time manual review of the design system doc.
- [ ] **Search Console verification post-cutover:** Often assumed to "just still work" — verify property status explicitly within 24 hours of the DNS flip.
- [ ] **SPF/DKIM/DMARC after any new sending path:** Often "tested" by one successful email — verify header analysis (SPF pass, DKIM pass, DMARC align) on that one email, and recount SPF lookups against the 10-lookup ceiling.
- [ ] **`[RECEIPT: …]` placeholders:** Often shipped by accident when a phase is marked done under deadline pressure — verify zero placeholder strings remain in production content before cutover (a simple grep gate).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|-----------------|------------------|
| Missing redirects discovered post-launch via GSC Coverage drop | MEDIUM | Pull the specific 404/410-that-should-have-redirected URLs from Search Console Coverage report, add targeted redirects, resubmit affected URLs for re-crawl; equity recovers over weeks, not instantly |
| Google Workspace SMTP relay auth failing in production | LOW | Kinsta stays live ~30 days as rollback (spec §15) is for the *site*, not the form — but the text line (786) 575-4837 is an immediate fallback channel already in the design while the email path is fixed; switch to credential/OAuth auth or a transactional API same-day |
| CLS/Lighthouse gate failure found at QA | LOW–MEDIUM | Isolate to the specific band (usually font-swap or an unsized image); metric-override fallback fonts and explicit image dimensions are both same-day fixes once identified — the cost is in finding it late, not fixing it |
| DNS cutover breaks Search Console verification | LOW | Add DNS TXT verification back (or use an alternate method — HTML file, meta tag) within the same day; a short verification gap doesn't itself cause an index drop, but it blocks visibility into whether anything else went wrong during that window |
| Magenta contrast violation found post-launch | LOW | CSS-only fix — swap the token/class to the approved black-background-only usage; no content or architecture change needed, but re-run the full Lighthouse Accessibility gate on every template, not just the one that failed |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Missing long-tail redirects (P1) | SEO/redirects phase | Automated redirect-map test script covers 100% of WordPress REST API + GSC-listed URLs |
| 301 vs 308 method mismatch (P2) | SEO/redirects phase | Redirect test script asserts status code and `Location`, not just "3xx" |
| 410 not achievable on static output (P3) | SEO/redirects phase (raised at IA/architecture decision time) | Header check confirms literal `410` status on every URL flagged for retirement |
| SMTP relay IP-auth incompatible with serverless (P4) | Contact form phase | Production (not local) submission test confirms delivery to `jaymie@zincdigital.co` |
| SPF lookup/DMARC alignment risk (P5) | Contact form phase | `dig TXT` SPF lookup count + header analysis of a live test send |
| Font swap CLS penalty (P6) | Design system + font pick phase | CLS measured 0 on cold/throttled load for every template, especially hero/Loop |
| Cross-browser scroll-timeline fallback (P7) | Home + Loop phase | Manual verification in Firefox and an older Safari/iOS version, plus OS-level reduced-motion toggle |
| Mobile Safari pinned-section jank (P8) | Home + Loop phase | Real-device iOS test at multiple scroll speeds, toolbar shown/hidden |
| In-memory rate limiting (P9) | Contact form phase | Scripted concurrent-burst test against the deployed endpoint shows throttling |
| Magenta contrast / kinetic-type AA violations (P10) | Design system phase (token rule); QA/owner-review phase (verification) | Lighthouse Accessibility = 100 on every template, no exceptions |
| DNS cutover TTL/verification lapse (P11) | Pre-cutover QA phase, 24–48h ahead of cutover | Full zone diff before flip; GSC verification status re-confirmed within 24h post-cutover |
| Owner copy review with no checkpoint cadence (P12) | Set at project kickoff / roadmap creation, enforced every content phase | Named checkpoint list with dates exists; zero `[RECEIPT: …]` placeholders remain before cutover phase begins |

## Sources

- [Vercel — Redirects (vercel.json)](https://vercel.com/docs/project-configuration/vercel-json) — official docs, via context7 (MEDIUM confidence)
- [Vercel — Bulk Redirects, available status codes](https://vercel.com/docs/routing/redirects/bulk-redirects) — official docs, via context7 (MEDIUM confidence)
- [Astro — View Transitions / ClientRouter fallback](https://docs.astro.build/en/guides/view-transitions/) — official docs, via context7 (MEDIUM confidence)
- [Astro — Configuration Reference, trailingSlash](https://docs.astro.build/en/reference/configuration-reference/) — official docs (MEDIUM confidence)
- [Google Search Central — Site Moves and Migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) — official docs (referenced in search results)
- [Redirect Maps for Site Migrations: 301 vs 308 — SEOParity](https://seoparity.com/blog/redirect-map-site-migration)
- [Manage redirects during a website migration — Siteimprove](https://www.siteimprove.com/blog/manage-redirects-during-website-migration/)
- [Cloudflare DNS Migration Checklist — Nanosek](https://www.nanosek.com/resources/cloudflare-dns-migration-checklist)
- [Cloudflare DNS Migration Checklist for 2026 — Qikot](https://qikot.com/blog/cloudflare-dns-migration-checklist-2026)
- [WebKit — A guide to Scroll-driven Animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Can I Use — animation-timeline: scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)
- [Apple Developer Forums — iOS 26 Safari fixed/sticky viewport regressions](https://developer.apple.com/forums/thread/800798)
- [Apple Developer Forums — sticky bottom:0 toolbar behavior](https://developer.apple.com/forums/thread/801028)
- [Chrome for Developers — Ensure text remains visible during webfont load](https://developer.chrome.com/docs/lighthouse/performance/font-display)
- [DebugBear — CSS Font Display and CLS from metric mismatch](https://www.debugbear.com/blog/ensure-text-remains-visible-during-webfont-load)
- [DebugBear — Fix LCP for text elements and H1 headings](https://www.debugbear.com/docs/largest-contentful-paint-text-h1)
- [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp)
- [CoreWebVitals.io — Improve INP by ditching JavaScript scrolling](https://www.corewebvitals.io/pagespeed/improve-inp-ditch-javascript-scrolling)
- [Cloudflare Turnstile — implicit vs explicit rendering](https://developers.cloudflare.com/turnstile/tutorials/implicit-vs-explicit-rendering)
- [Cloudflare Turnstile — client-side errors](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors)
- [Vercel Knowledge Base — Add Rate Limiting with Vercel](https://vercel.com/kb/guide/add-rate-limiting-vercel)
- [Vercel Docs — WAF Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [Google Workspace Help — Route outgoing SMTP relay messages through Google](https://support.google.com/a/answer/2956491?hl=en)
- [Google Workspace Help — Send email from a printer, scanner, or app](https://support.google.com/a/answer/176600?hl=en)
- [EasyDMARC — Setup Guide to Google Workspace DKIM, DMARC, SPF](https://easydmarc.com/blog/setup-guide-to-google-workspace-dkim-dmarc-spf-in-2026-for-business/)
- [DEV Community — Email Deliverability: SPF, DKIM, DMARC Setup and Resend Integration](https://dev.to/whoffagents/email-deliverability-for-saas-spf-dkim-dmarc-setup-and-resend-integration-1hpd)
- [WebAIM — Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [web.dev — Learn Accessibility: Animation and motion](https://web.dev/learn/accessibility/motion)
- [CSS-Tricks — Accessible Web Animation: The WCAG on Animation Explained](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/)
- [Vercel Knowledge Base — Are Vercel Preview Deployments indexed by search engines?](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)
- [Vercel Academy — Deployment Protection](https://vercel.com/academy/optimize-your-vercel-account/deployment-protection)
- [Enterprise DNA — Reduce Agency Project Timeline Delays](https://enterprisedna.co/resources/guides/agencies-reduce-project-timeline-delays/)
- Project sources: `.planning/PROJECT.md`, `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md` (this project's approved spec, treated as authoritative for all requirement-level claims above)

---
*Pitfalls research for: WordPress→Astro/Vercel migration with motion-heavy Lighthouse-100 design and serverless form on Google Workspace*
*Researched: 2026-09-25 (CT)*
