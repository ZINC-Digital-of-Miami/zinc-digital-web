# Stack Research

**Domain:** High-performance, static-first agency marketing site (Astro on Vercel), scroll-driven motion, qualifying contact form, WordPress→Astro SEO migration
**Researched:** 2026-09-25 (CT)
**Confidence:** HIGH (verified against Context7 `/withastro/docs`, live npm registry, Vercel's own docs, caniuse, MDN, Wikipedia for current browser versions)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Astro | `7.3.5` (current stable, npm-verified 2026-09-25) | Static site generator, islands, content collections | Static-first output by default, zero client JS unless you opt in — the only realistic path to the spec's ≤15 KB JS/page and Lighthouse-100 gates. Matches PROJECT.md's "Astro (current stable)" constraint literally. |
| TypeScript | `5.x` (Astro 7 bundles/expects TS 5; use `npm view typescript version` → `7.0.2` line at research time was a red herring from a stale cache — pin via `astro check`'s bundled TS, do not hand-pin an old major) | Type safety for content schemas, API route, config | Spec mandates TypeScript. Astro's content collections and `astro:content` types are the main payoff — typed frontmatter for `services`, `cases`, `team`, `posts`, `clients`. |
| Node.js | `24.x` (LTS) | Build + Vercel Function runtime | Spec-mandated. Vercel's Node.js runtime is required (not Edge) for the SMTP form function — Edge lacks the `net`/`tls` sockets SMTP needs. |
| `@astrojs/vercel` | `11.0.11` (npm-verified) | Deployment adapter | Even for a **static** site, you need this adapter to compile the one on-demand form route into a Vercel Function. Add via `npx astro add vercel`. Astro 5+ merged the old `output: 'hybrid'` into `output: 'static'` (default) — you no longer set `output: 'hybrid'`; you set `output: 'static'` (or omit it, it's the default) and opt individual routes into on-demand rendering. |
| `@astrojs/mdx` | `8.0.2` (npm-verified) | MDX support for content collections | Spec requires MDX for `posts`, `cases`, and rich service pages (embedded components inside prose — FAQ blocks, receipt callouts). |
| `@astrojs/sitemap` | `3.7.4` (npm-verified) | XML sitemap generation | Spec §11 requires "complete XML sitemap including every post" — the current Rank Math sitemap on the live site misses all 18 posts; this integration walks the full route manifest, not a manually curated list, so it can't repeat that failure. |
| `sharp` | `0.35.4` (npm-verified) | Image transform engine behind `astro:assets` | Astro's default image service. Required (not optional) for AVIF/WebP output at build time — Vercel's runtime Image Optimization API is a separate, unrelated paid-adjacent feature the spec doesn't need since output is fully static. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `nodemailer` | `10.0.10` (npm-verified) | SMTP client inside the one Vercel Function | Contact form → Google Workspace delivery. See Email section below for the SMTP-vs-Gmail-API decision. |
| `astro:content` (built-in, no install) | ships with Astro 7 | Content Layer API — `glob()` loader | Define `services`, `cases`, `team`, `posts`, `clients` in `src/content.config.ts` using the **Content Layer API** (current API since Astro 5; the old `src/content/config.ts` + implicit `type: 'content'` collections are legacy). Each collection gets a `glob({ pattern, base })` loader + a Zod schema. |
| `astro:assets` (built-in) | ships with Astro 7 | `<Image />` / `<Picture />` components | `<Picture formats={['avif','webp']} alt="…">` is the direct, current answer to "image pipeline (AVIF/WebP)" — it emits a `<picture>` with AVIF and WebP `<source>`s and a format-matched `<img>` fallback, all responsive-sized, all with explicit `width`/`height` (CLS 0 requirement). |
| `@astrojs/check` (dev) | `0.9.10` (npm-verified) | `astro check` — typecheck `.astro` files + content schemas | Run in CI before build; catches broken content-collection frontmatter before it reaches Lighthouse CI. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `fonttools` (Python, `pyftsubset`) | Subset + convert the three self-hosted variable fonts to WOFF2 | Industry-standard subsetter (same one Google Fonts and most foundries use). Run once per font at build/prep time, not per-request. Subset to Latin + Latin-1 Supplement (`U+0000-00FF`) unless the site needs extended Latin diacritics; keep `kern`, `liga`, `clig` in `--layout-features`; output `--flavor=woff2` (needs Brotli, installed alongside fonttools). Variable-font subsetting correctly strips unused glyph outlines while preserving the weight/width variation axes for the glyphs you keep. |
| `@lhci/cli` | Lighthouse CI runner + budget assertion | `0.15.1` (npm-verified). Use directly (not only the `treosh/lighthouse-ci-action` wrapper) so budgets and assertions live in a versioned `lighthouserc.json`/`.cjs` in the repo, portable outside GitHub Actions too. |
| `lychee` + `lycheeverse/lychee-action` | Broken internal/external link checking in CI | Rust-based, async, fast (whole-site scans in ~1 min per public benchmarks). Point it at the built `dist/` output (not live URLs) for the 301/410 redirect-map verification step, and separately at the deployed preview URL for external link rot. |
| Google **Schema Markup Validator** + **Rich Results Test** | Structured-data validation | Two different Google tools, used together: Rich Results Test checks eligibility for search *features* (FAQ rich snippets etc.); Schema Markup Validator (the successor to the deprecated Structured Data Testing Tool) checks generic Schema.org conformance for Organization/LocalBusiness/Service/Article/FAQPage/BreadcrumbList. Run both per template before launch (spec §10's "structured data validates on every template" gate). |

## Installation

```bash
# Core
npm create astro@latest .
npm install @astrojs/mdx@^8 @astrojs/sitemap@^3 nodemailer@^10

# Vercel adapter (also wires astro.config.mjs)
npx astro add vercel

# Dev dependencies
npm install -D @astrojs/check@^0.9 typescript

# Font subsetting (once, not a project dependency — run locally / in a prep script)
pip install fonttools[woff] brotli

# CI tooling (used only inside GitHub Actions, not app dependencies)
npm install -D @lhci/cli@^0.15
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro static + one Vercel Function (`@astrojs/vercel`, `output: 'static'`, `prerender = false` on one route) | Next.js App Router | Never for this project — Next ships a much heavier client runtime baseline and fights the ≤15 KB JS gate; Astro's zero-JS-by-default model is the entire reason it's spec-mandated. |
| `nodemailer` SMTP with a Workspace App Password | Gmail API with OAuth2 | Use OAuth2/Gmail API only if a Workspace admin later disables App Passwords org-wide (some Workspace security policies block them), or if Google throttles/flags the SMTP relay — Gmail API needs a Google Cloud project, OAuth consent screen, and refresh-token storage in Vercel env vars, which is real setup overhead for a form that fires a handful of times a day. Start with SMTP; keep Gmail API as the documented fallback, not the default. |
| `vercel.json` `routes` array (`{"src": "/old-slug", "status": 410}`) for Gone URLs | A Vercel Node Function that returns 410 for a path list | Only if the 410 list needs to grow dynamically post-launch without a redeploy (it won't — the redirect/410 map is built once from the WordPress REST API + Search Console per spec §12 and is static). |
| Astro's built-in `redirects` config (`astro.config.mjs`) for the bulk of 301s | `vercel.json` `redirects` array | Use `vercel.json` only for edge cases Astro's config can't express (conditional `has`/`missing` matching on headers/cookies/query — not needed here) or for >a few hundred entries where `bulkRedirectsPath` (CSV/JSON import) is materially easier to generate from the WordPress export than hand-writing `astro.config.mjs` entries. For this project's redirect map (spec §12, a bounded list from one WordPress export), Astro's native `redirects` is simpler and avoids the documented Astro↔Vercel-adapter redirect-matching bugs below. |
| Google Schema Markup Validator + Rich Results Test | Third-party bulk schema checkers (Sitebulb, etc.) | Only if you need to validate hundreds of pages in one bulk pass — this site ships ~35 templates/pages at launch, well within manual per-template checks. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Any animation library (GSAP, Framer Motion, Lenis, ScrollTrigger) | Spec explicitly bans it ("no animation library"); also each adds 20–80 KB gzip minimum, blowing the ≤15 KB JS/page budget on its own | Native CSS `animation-timeline: scroll()` / `view()`, with `prefers-reduced-motion` and a static finished-state fallback for browsers that don't support it yet (see Browser Support below) |
| WebGL / any 3D library (Three.js, etc.) | Spec explicitly bans it; also incompatible with the CFO's "read the whole page in 60 seconds" requirement and the performance gates | Plain SVG for the Loop graphic, animated via `stroke-dashoffset` + scroll-timeline CSS |
| Any CSS framework (Tailwind, Bootstrap) or UI framework (React, Vue, Svelte islands) for this build | Spec explicitly bans both ("plain CSS with design tokens," "no UI framework, no CSS framework") | Plain `.css` with custom properties (design tokens) per PROJECT.md/spec §14 |
| `vercel.json` for URL rewrites/redirects on a static Astro + Vercel-adapter project as the primary mechanism | Documented, filed bugs (withastro/astro #9259, #9260, #13900, #18073) where `vercel.json`-driven or adapter-generated redirects on a **static**-output Astro project return 404 in production despite working in `astro dev`, and interact badly with `trailingSlash: 'always'` | Astro's own `redirects` config in `astro.config.mjs` — Vercel's own guidance is that redirects/rewrites should go through the framework's native mechanism, not `vercel.json`, on framework-detected projects |
| Gmail SMTP with a **personal** Gmail account, or "less secure app access" | Google permanently removed "less secure app" access in 2022; personal Gmail is not built for transactional/relay traffic and gets rate-limited/flagged fast | Google Workspace SMTP relay (`smtp.gmail.com:465`) authenticated with an **App Password** tied to the Workspace mailbox that actually receives the mail (`jaymie@zincdigital.co` or a dedicated sender alias), which is what the spec's "existing Google Workspace domain" already provides for free |
| Port 25 for outbound SMTP from the Vercel Function | Vercel blocks outbound port 25 platform-wide to prevent spam-relay abuse — this is a hard platform limit, not a config option | Port 465 (implicit TLS) or 587 (STARTTLS) — both open on Vercel's Node.js runtime, both supported directly by `nodemailer`'s Gmail/SMTP transport with no extra config |
| Any Edge runtime function for the contact form | Edge runtime has no `net`/`tls` sockets, so raw SMTP (`nodemailer`) cannot open a connection at all | Node.js runtime function (Vercel's default for `api/*` unless you opt into Edge) |
| "Archivo" as the condensed display grotesk | Spec explicitly excludes it (carried over from the July prototype, owner wants a clean break) | Three open-license variable alternatives below (Big Shoulders, Barlow Condensed, Oswald) |
| Paid captcha/anti-spam service (hCaptcha Pro, reCAPTCHA Enterprise) or paid transactional email (Resend, Postmark, SendGrid) | Spec: "no paid services beyond current subscriptions (Vercel Pro, Google Workspace)" | Cloudflare Turnstile (free tier) + honeypot + rate limit for spam; Google Workspace SMTP for delivery |
| Google's original "Structured Data Testing Tool" | Deprecated by Google; retired in favor of the two tools below | Rich Results Test (search-feature eligibility) + Schema Markup Validator (generic Schema.org conformance) |

## Stack Patterns by Variant

**Rendering mode — static site with exactly one dynamic route (the spec's actual shape):**
- Set `output: 'static'` in `astro.config.mjs` (or omit it — it's the default in Astro 7).
- On the single form-submission API route (e.g. `src/pages/api/contact.ts`), export `export const prerender = false;` — this is the current, correct way to opt one route into on-demand rendering while every other page stays fully prerendered static HTML.
- Do **not** set `output: 'server'` — that flips the default for every page (server-render everything, opt individual pages *back* into static with `prerender = true`), which is the wrong default for a static-first marketing site and adds unnecessary function cold-start risk to pages that don't need it.
- Do **not** use `output: 'hybrid'` — that mode was removed; its behavior is now what `'static'` mode does by default in Astro 5+.

**Font pairing — condensed heavy grotesk (display) + text sans (body) + mono (labels/data), 3 pairings for the owner to pick from, all open-license, all variable, all self-hostable:**

*Pairing A — industrial/editorial:*
- Display: **Big Shoulders** (Display/Text variable, SIL OFL, Google Fonts) — genuinely condensed, has a wide weight range on one variable file, strong "annual report" energy, not overused like Archivo.
- Body: **Inter** (variable, SIL OFL) — the de facto neutral, highly legible text sans at small sizes.
- Mono: **JetBrains Mono** (variable, Apache 2.0) — distinct data/label character, wide language support.

*Pairing B — Swiss/grotesk-classic:*
- Display: **Barlow Condensed** (variable wght, SIL OFL) — cleaner, less industrial than Big Shoulders, still clearly condensed grotesk.
- Body: **Public Sans** (variable, SIL OFL, US Web Design System's font) — built explicitly for long-form readability at small sizes.
- Mono: **IBM Plex Mono** (variable, SIL OFL) — pairs cleanly with either display option, corporate-serious without being sterile.

*Pairing C — contemporary/warmer grotesk:*
- Display: **Oswald** (variable wght since its 2022 rebuild, SIL OFL) — the most widely recognized condensed grotesk after Archivo; higher risk of feeling "templated" but very safe rendering across weights.
- Body: **IBM Plex Sans** (variable, SIL OFL).
- Mono: **Space Mono** (SIL OFL) — note: Space Mono is **not** a variable font (only Regular/Bold static weights) — flag this if the owner picks Pairing C and wants true variable-mono consistency; swap to IBM Plex Mono if that matters.

Subset each chosen family to Latin (+ Latin-1 Supplement) with `pyftsubset`, output WOFF2 only (variable fonts don't need WOFF fallback for any browser released in the last several years), self-host under `public/fonts/` or `src/assets/fonts/`, declare via `@font-face` with `font-display: swap` and correct `unicode-range`. Total ≤ 3 files per spec §8 — one variable WOFF2 per family (display, body, mono) satisfies that exactly.

**Motion — native CSS scroll-driven animations, current (2026-09-25) browser support:**
- `animation-timeline: scroll()` / `view()`: supported in Chrome/Edge 115+ (shipped 2023) and **Safari 26.0+** (shipped 2025). **Firefox does not yet support this by default** — caniuse's own compatibility data places default support at Firefox 159, while Firefox's actual current stable release (verified 2026-09-25, via Wikipedia) is **156**. That's roughly 3 releases / ~12 weeks out. Global "supports" usage is ~87% by caniuse's aggregate metric, but that number is inflated by treating Firefox as a large non-supporting bloc it already excludes from the "supported" tally — read it as "most non-Firefox traffic," not "87% of your actual visitors."
- Cross-document View Transitions (`@view-transition { navigation: auto }`): supported in Chrome/Edge 126+ and **Safari 18.2+** (both shipped 2024). Firefox has only **partial, disabled-by-default** support through at least version 155/156 — not production-ready in Firefox as of this research date.
- **Practical implication for this build:** the spec's own requirement — "`prefers-reduced-motion` and browsers without scroll-timeline support get each scene's finished state with no content loss" — is not optional polish, it is the *primary* Firefox experience today, not an edge case. Ship the finished-state CSS as the true default (`@supports not (animation-timeline: scroll())`), and layer the scroll-driven behavior on top for supporting browsers, rather than building the animated version first and bolting on a fallback.

## Email delivery — SMTP vs Gmail API decision

**Recommendation: Nodemailer over SMTP with a Google Workspace App Password, port 465, Node.js runtime function. Confidence: HIGH.**

- Vercel's own Knowledge Base confirms: port 25 is blocked platform-wide (anti-spam-relay policy); ports 465 (implicit TLS) and 587 (STARTTLS) are open and work with Nodemailer's SMTP transport with no extra Vercel-side configuration; only the **Node.js runtime** has the raw socket access (`net`/`tls`) SMTP needs — Edge functions cannot do this at all.
- Because Google retired "less secure app" access in 2022, the credential must be a **2-Step-Verification App Password** generated for the Workspace mailbox, stored only in Vercel environment variables (per spec §14) — never a plain account password.
- **Await the send before returning the response**, or explicitly extend the function's lifetime (`waitUntil`) — Vercel functions can pause background work immediately after responding, which can truncate an in-flight SMTP exchange if you fire-and-forget the mail send.
- **Gmail API (OAuth2)** is the documented, more resilient alternative — it survives if a Workspace admin ever disables App Passwords org-wide via the Admin Console, and it decouples you from raw SMTP entirely — but it requires a Google Cloud project, OAuth consent screen, and refresh-token issuance/storage, which is disproportionate setup for a low-volume qualifying-contact form. Document it as the fallback, not the v1 build.
- Do **not** reach for Resend/Postmark/SendGrid/AWS SES — all are outside "no paid services beyond current subscriptions," and none are necessary given Workspace SMTP already works on Vercel's Node runtime.

## Redirects / 410 on Vercel for a static Astro site

**Recommendation: Astro's native `redirects` config for the bulk of 301s; `vercel.json` `routes` (not `redirects`) for 410 Gone entries. Confidence: HIGH (Vercel's own vercel.json reference docs + multiple open withastro/astro issues).**

- Astro's `redirects` option in `astro.config.mjs` (`redirects: { '/old-page': '/new-page' }`) is the framework-native mechanism and Vercel explicitly recommends using a detected framework's own redirect mechanism over `vercel.json` where one exists.
- **Do not** rely on `vercel.json`'s `redirects` array or the `@astrojs/vercel` adapter's auto-generated routing for a **static**-output Astro project — there are multiple open/recent withastro/astro issues (#9259, #9260, #13900, #18073) where redirects work in `astro dev` but 404 once deployed to Vercel with the static adapter, and where `trailingSlash: 'always'` breaks matching. This is a live footgun, not a theoretical one — verify every redirect on the deployed preview URL, not just locally.
- `vercel.json`'s `redirects` array only supports redirect status codes (301/302/303/307/308) paired with a `destination` — there is no way to express a destination-less 410 through it.
- For 410 Gone, use `vercel.json`'s lower-level `routes` array, which explicitly supports a bare `status` with no `dest` (Vercel's own docs example: `{ "src": "/legacy", "status": 404 }` — the identical pattern works for `410`). This is the only spec-covered, static-compatible way to emit 410 from a fully static Astro deployment without standing up a server function per URL.
- For a redirect map large enough to be unwieldy as hand-written `astro.config.mjs` entries, Vercel's `bulkRedirectsPath` (CSV/JSON/JSONL import, thousands of entries) is a reasonable escape hatch for the 301 half only — but it still can't emit 410s, and it inherits the same static-adapter matching risk noted above, so re-verify on the deployed URL either way.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@7.3.5` | `@astrojs/vercel@11.0.11`, `@astrojs/mdx@8.0.2`, `@astrojs/sitemap@3.7.4`, `@astrojs/check@0.9.10` | All four integrations are on their current majors as of 2026-09-25 npm registry checks; install via `npx astro add <name>` rather than hand-picking versions to avoid peer-dependency drift as Astro ships frequent minors. |
| `output: 'static'` (Astro 7 default) | `@astrojs/vercel` adapter | The adapter works in either `'static'` or `'server'` output; for this project stay on `'static'` and use `prerender = false` per-route (see Stack Patterns above). Do not set `output: 'hybrid'` — removed since Astro 5. |
| `sharp@0.35.4` | Node 24 | Sharp ships prebuilt binaries per Node major; if `npm install` ever falls back to a source build on an unusual CI image, that's a signal the binary matrix hasn't caught up to Node 24 yet — pin CI to a supported Node LTS explicitly rather than "latest." |
| Variable WOFF2 fonts | All browsers in the spec's target matrix | No fallback static-weight files needed — variable font support itself is universal in currently-supported browser versions; the gap in this project is scroll-driven animation / view-transitions support, not font format support. |

## Sources

- Context7 `/withastro/docs` (High reputation, 6015 snippets) — content collections Content Layer API / `glob()` loader, `astro:assets` `<Picture>` API, `output: 'static'` + `prerender` on-demand routing, `@astrojs/vercel` adapter setup, `output: 'hybrid'` removal in v5 — HIGH confidence
- `npm view` against the live npm registry (2026-09-25) for exact current versions of `astro`, `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/vercel`, `@astrojs/check`, `sharp`, `nodemailer`, `@lhci/cli` — HIGH confidence (primary source, not training data)
- [vercel.com/docs/project-configuration/vercel-json](https://vercel.com/docs/project-configuration/vercel-json) (fetched live, `last_updated: 2026-08-14`) — `redirects` vs `routes` schema, 410 pattern, statusCode limits — HIGH confidence
- [vercel.com/kb/guide/serverless-functions-and-smtp](https://vercel.com/kb/guide/serverless-functions-and-smtp) — port 25 block, 465/587 allowed, Node-only runtime for SMTP, `waitUntil`/await requirement — HIGH confidence
- [developers.cloudflare.com/turnstile/get-started/server-side-validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) — `siteverify` endpoint contract — HIGH confidence
- [caniuse.com/mdn-css_properties_animation-timeline_scroll](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) and [caniuse.com/cross-document-view-transitions](https://caniuse.com/cross-document-view-transitions) (fetched live) cross-checked against Firefox's actual current stable version (156, per [Firefox version history — Wikipedia](https://en.wikipedia.org/wiki/Firefox_version_history), verified 2026-09-25) — HIGH confidence, verified via two independent sources
- [github.com/withastro/astro issues #9259, #9260, #13900, #18073](https://github.com/withastro/astro/issues/9259) — documented Vercel-adapter/static-redirect bugs — MEDIUM-HIGH confidence (primary source, GitHub issue tracker, some still open/unresolved as of research date)
- [developers.google.com/search/docs/appearance/structured-data](https://developers.google.com/search/docs/appearance/structured-data) — current Google structured-data tooling (Rich Results Test + Schema Markup Validator, successor to deprecated Structured Data Testing Tool) — HIGH confidence
- [github.com/lycheeverse/lychee-action](https://github.com/lycheeverse/lychee-action) — current link-checker GitHub Action — MEDIUM confidence (community tool, actively maintained, widely adopted)
- [nodemailer.com/guides/using-gmail](https://nodemailer.com/guides/using-gmail) — Nodemailer's own Gmail/Workspace SMTP guidance, App Password requirement — HIGH confidence

---
*Stack research for: zinc-digital-web (ZINC Digital Agency site redesign)*
*Researched: 2026-09-25 (CT)*
