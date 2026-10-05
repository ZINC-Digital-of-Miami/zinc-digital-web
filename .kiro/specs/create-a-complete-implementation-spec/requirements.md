# Requirements — Finish and launch the ZINC Digital website

Spec `create-a-complete-implementation-spec` (feature) · Revision 2 (simplified) · 4 October 2026 (CT)

## Goal and scope

Build the owner-approved Claude Design into the production `www.zincdigital.co`:
- one Astro 7 / Vercel project;
- prerendered public pages;
- an account-free contact form that stores every inquiry;
- a private, invite-only staff admin using Supabase Auth and data.

Launch replaces the WordPress site only on the owner's go.

**Out of scope:** client or visitor accounts, a customer portal, public registration, another design cycle, and paid services the owner has not enabled.

**Authority:**
1. The owner's newest instruction.
2. Claude Design for visuals, copy, pages and interactions.
3. Operational rules that still apply:
   - Node 24;
   - the performance targets in R16;
   - all work under `/Volumes/Satechi Hub/`;
   - no paid services beyond Vercel Pro and Google Workspace;
   - the repo's branch and PR rules;
   - the owner's go for DNS, production secrets and deletions.

These older rules are superseded: all-white only, the circuit thread, placeholder markers in copy, and site-wide noindex. The owner also dropped three items on 4 Oct 2026:
- Lighthouse 100 as a pass/fail gate (Lighthouse still runs and reports scores);
- Cloudflare, including Turnstile;
- Docker-based tooling.

**Inputs:**
- **Design package:** `/Volumes/Satechi Hub/zinc-digital-web-review/2026-10-04-packaged-design/current-design/` (the port is in `astro/`).
  - `Zinc Digital redesign ASTRO.zip`, SHA-256 `a624cfec…d42d0`.
  - `Zinc Digital redesignFULLDESIGN.zip`, SHA-256 `11214dc5…e8c17`.
  - Both checksums re-measured.
- **Design references:**
  - `ZINC Site.dc.html` (inner pages);
  - `ZINC Home Blend.dc.html` (homepage);
  - `ZINC Admin.dc.html`, `admin/adapter.js` and `admin/astro-endpoints.md` (admin);
  - `CLAUDE.md` and `Brand Voice.md`.
- **Repo:** `main` at `1a2ea8b`.
- **Supabase project:** `zeetlqskfvsfbllrhzre`.
- **Vercel project:** `zinc-digital-web`.

---

## 1. Current state

Measured 4 Oct 2026, 13:00–13:45 CT, with read-only checks. **Nothing in the package has been built, run or deployed.**

### 1.1 Inventory

| Area | Items | Status |
|---|---|---|
| Public pages (43) | home, services, 11 service pages, work, 4 case pages, about, contact, thanks, blog, 18 articles, privacy, terms, 404 | Source only, never built |
| Generated files | sitemap (41 URLs), robots.txt, `/work/summit-marine/` 301 redirect | Source only |
| Public interactions | <ul><li>theme toggle, cursor, grain, progress line, magnetic buttons, tilt;</li><li>reveals, parallax, pinned scenes, case scroller, before/after;</li><li>blog filters, FAQ, mobile link row;</li><li>three-step contact form with service preselect;</li><li>skip link, reduced-motion handling</li></ul> | Source only; defects in 1.3 |
| Assets | <ul><li>package: logos, share images, badge, black-and-white team photos;</li><li>repo: wordmarks, marks, OUABC and U.S. Oil screenshots, favicon;</li><li>fonts are downloaded at build time</li></ul> | Present |
| Case images | 17 WordPress-hosted Las Vegas Safety and Summit images | Missing; must be fetched while WordPress is online |
| Logos | 6 client logos and the Meta partner logo | Owner must supply |
| Missing public pieces | `llms.txt`, analytics tags, WordPress 301/410 map | Missing |
| Sign-in (magic link and callback) and staff check | — | Source only; insecure session handling (1.3) |
| Admin inquiry board | stages, advance, archive, restore | Source only |
| Admin shell and views | Dashboard, Stats, Pages, Posts, SEO, Backend | Missing; prototype only |
| Research UI | projects, sources, chat | Missing; prototype only |
| Inquiry drawer, notes, next step | — | Missing; prototype only |
| Staff invitations, offboarding, sign-out | — | Missing; not in Design |
| `POST /api/inquiries` | contact endpoint | Source only; does not match the live database |
| `POST /api/inquiries/email` | staff email to a prospect | Source only; uses Resend, which is paid and not approved |
| Research ingestion | Note and URL sources | Source only |
| Research ingestion | File and SERP sources | Missing; both return 501 |
| `POST /api/research/chat` | research chat | Source only; calls metered APIs |
| Codex bridge, nightly jobs | — | Written description only |

### 1.2 Live database gaps (verified with read-only SQL)

- **No API access:** `anon`, `authenticated` and `service_role` have no read, insert, update or delete grants on any `public` table, so every website call to those tables would fail.
- **No staff:** `auth.users` and `public.staff` are empty. The only staff check is the private `private.is_staff()`, which the website cannot call.
- **`inquiries` table:**
  - no `timeline` column;
  - `status` and `stage` duplicate each other;
  - an "anyone submit inquiry" policy allows direct anonymous inserts, bypassing the endpoint.
- **`inquiry_events`:** the `kind` check has no `notify` value.
- **`inquiry_board` view:** not `security_invoker`.
- **Research schema, against what the code expects:**
  - the column is `research.documents.source_url`, and kinds are lowercase;
  - the search function's argument is `p_project`;
  - `service_role` has no grants on `research`.
- **Storage:** no buckets exist.
- **Security advisor:** warns that `private.touch_updated_at` has a mutable search_path.
- **Migrations:** four are recorded in the database, but no migration SQL exists anywhere.

### 1.3 Known defects (fixed during implementation)

**Public site:**
- The catch-all page file still has its placeholder name, `-...path-.astro`.
- No `[hidden]` style rule exists, which breaks blog filtering, the empty state and the form's step controls.
- With reduced motion or JavaScript off:
  - pinned tracks hide content;
  - before/after shows only the "before" image;
  - form errors are never shown.
- The contact code contains a Cloudflare Turnstile check, to be removed (owner: no Cloudflare).
- Article structured data labels every author "CEO".
- Two service-to-case links, the homepage contents line and the homepage title differ from Design.
- `.c-quote` asks for a weight that isn't shipped.
- Demo wording appears in live mode.
- `robots.txt` does not cover `/admin/` and `/api/`.
- A comment in `admin/index.astro` contains the section-sign character, which the repo's checks reject.

**Contact endpoint:**
- Inserts anonymously with `return=representation`.
- Writes the missing `timeline` column.
- Sends through Resend.
- Defaults the recipient to `hello@` instead of `jaymie@`.
- Has no body-size limit, rate limit or JSON parse guard.
- Exposes database error text.

**Auth and admin:**
- Sign-in sends `create_user:true`.
- The session token passes through the URL fragment into a cookie set by JavaScript.
- An unused refresh token sits in localStorage.
- `//host` redirect targets are accepted.
- No sign-out or session refresh.
- The admin page relies on middleware alone.
- URL filter values are not encoded.
- Prototype defects to fix in the port:
  - the toggle label reads "Dark mode mode";
  - no aria-label;
  - no Escape key or focus handling in the drawer;
  - a button nested inside a button;
  - fonts load from Google;
  - figures are invented.

**Research:**
- URL fetching:
  - accepts `metadata.google.internal.`, confirmed by running the code offline;
  - never checks the address a hostname resolves to;
  - does not block `100.64.0.0/10`.
- Column and argument names don't match the database.
- Inputs are uncapped.

**Checks:**
- **Static check:** contradicts itself on the Summit alias, and misses preview wording.
- **Browser check:**
  - wrongly fails three articles because it doesn't decode entities;
  - crawls `/admin/` in static preview;
  - has some checks that always pass.
- **CI** still runs the old `verify-mockup.mjs`.

---

## 2. Implementation choices

Each choice is the smallest one that delivers the requested feature.

1. **One Astro project, no UI framework.**
   - Public pages are prerendered; admin pages and APIs render on demand.
   - The admin is built as server-rendered Astro pages with small plain scripts for the drawer, toast and chat streaming, matching the repo's no-framework rule.
2. **`@supabase/ssr` and `supabase-js` on the server** replace the hand-written auth and REST helper. They supply code exchange, cookies, refresh and sign-out, which are currently missing.
3. **Contact: one endpoint and one insert.**
   - Notification status lives in columns on the inquiry.
   - Failed emails are resent from the admin with a button.
   - The rate limit counts recent inquiries with the same hashed client address.
   - Spam protection is the honeypot, a same-origin check and the rate limit. There is no third-party challenge.
   - No extra tables, queues or scheduled jobs.
4. **Email: Nodemailer over Google Workspace SMTP**, as already decided in spec section 14.
   - Resend is removed.
   - Supabase Auth uses the same SMTP for invitation and sign-in emails.
5. **Publishing:**
   - Staff edits are saved in Supabase.
   - An owner's **Publish** button calls a Vercel deploy hook; the build reads the saved fields.
   - No pull-request publishing and no second approval stage.
6. **Dashboard and Stats:**
   - Search Console and GA4 are read live when the view opens, through one free Google service account. Nightly sync jobs are not built.
   - SEO scores use the prototype's field-based formula, not a crawler.
7. **Backend:**
   - Deployment data comes from a read-only Vercel token; commit details come from that same deployment data, so no GitHub token is needed.
   - **Redeploy** uses the same deploy hook as Publish.
8. **Research:**
   - Retrieval uses Postgres full-text search: no embeddings and no OpenAI cost.
   - The Design's model choices call the Anthropic and OpenAI APIs directly, each enabled only once the owner sets its key. Both are metered.
   - This replaces the Codex bridge, a custom server on the owner's machine that would run commands. The trade-off: GPT answers bill the API instead of using the ChatGPT Pro plan.
   - SERP sources work once the owner supplies a provider key.
9. **Inquiry board updates:** the board refreshes when the window regains focus and every 60 seconds while visible. No realtime connection.
10. **Tests:**
    - Node's built-in test runner (no new framework).
    - The package's static and browser checks, corrected.
    - Database and permission tests run without Docker:
      - they use `psql` from the already-installed Homebrew PostgreSQL 17;
      - each test file runs inside a transaction on the Supabase project and ends with `ROLLBACK`, so nothing persists;
      - the schema baseline is taken with `pg_dump --schema-only`.
11. **Performance:**
    - The JavaScript budget and font checks run on every build.
    - Lighthouse runs and reports scores and Web Vitals. A score below 100 never fails a build or blocks a merge.
12. **Visual review:** screenshot rounds compared against the Design, repeated until a round finds nothing (R17.6). These are the only repeated reviews.
13. **Live preview:** the Astro dev server runs locally and is open in the dashboard's Browser panel throughout implementation (R18.2).

### Package features changed or not built (explicit)

| Feature | Outcome |
|---|---|
| Codex bridge server | Replaced by direct API calls (choice 8) |
| Nightly `stats_daily` / `seo_audits` jobs | Replaced by live reads (choice 6); the tables are kept, unused |
| Embedding retrieval | Replaced by full-text search; the `vector` column is kept, unused |
| Realtime subscriptions | Replaced by focus and interval refresh |
| Resend | Replaced by Workspace SMTP |
| Cloudflare Turnstile | Removed (owner: no Cloudflare); spam is handled by the honeypot, origin check and rate limit |
| "New page" button | Not built. Pages are fixed by the Design, so a new page needs design work first. |
| "AI citations" KPI | Shows "No data source" until the owner names one |
| `transcript` source kind | Not built; not in Design |

---

## 3. Requirements

### R1 — Repository baseline

**As the owner, I want the package integrated into a clean, reproducible build, so that every later step works on real output.**

1. THE repo instructions (`AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`) SHALL state the authority above.
2. Superseded design rules in `docs/` and `.planning/` SHALL be marked superseded, without deleting files. R1.1 and R1.2 land in one documentation PR.
3. That PR SHALL carry over PR #6's Codex GitHub review rule and its SPF measurement note.
4. Once that PR merges, PR #6 SHALL be closed as superseded, with a comment linking the replacement (D3).
5. THE port SHALL be added from the admitted package, with the catch-all page at `src/pages/[...path].astro`.
6. THE project SHALL pin Node 24 in `engines`, `.nvmrc`, CI and Vercel.
7. Dependency changes SHALL update `package-lock.json` in the same commit.
8. `npm ci`, `npm run check` and `npm run build` SHALL each exit 0.
9. CI SHALL run type check, build, the static check and the quick browser check on every PR.

### R2 — Public pages and content

**As a prospect, I want every Design page complete at its URL, so that I can evaluate ZINC without gaps.**

1. THE build SHALL produce exactly the 43 pages in 1.1.
2. Unknown paths SHALL return the designed 404 page with HTTP 404, except paths handled by R14.
3. Copy and layout SHALL match the Design per page. The port's deviations listed in 1.3 SHALL be corrected toward the Design.
4. THE 18 articles SHALL render their full migrated bodies (headings, lists, links, images) in the Design article layout, with the author from each post.
5. Live pages SHALL contain:
   - no placeholder, preview, demo or sample wording;
   - no invented numbers;
   - not the banned abbreviation for generative search;
   - no section-sign character in `src/`.
6. Sections waiting on owner content SHALL render nothing, as the Design does.
7. Case results, receipts, quotes and before images SHALL appear only once the owner confirms them.

### R3 — Design fidelity, themes, motion and accessibility

**As any visitor, I want the site to look like the approved Design and work with my settings, so that it is usable for everyone.**

1. Every public and admin page SHALL have the header toggle:
   - labelled "Dark mode" or "Light mode", with `aria-label="Switch between light and dark"`;
   - light when no choice is stored;
   - with the choice stored under `zinc-theme` and applied before first paint.
2. WITH motion allowed and a fine pointer, THE site SHALL reproduce the Design's motion:
   - cursor, with no blend mode;
   - grain and progress line;
   - magnetic buttons and tilt;
   - reveals and parallax;
   - pinned scenes, the case scroller and before/after.
3. WHEN reduced motion is requested, scroll timelines are unsupported, or JavaScript is off, every piece of content SHALL be visible and reachable, and before/after SHALL show both images.
4. Elements with the `hidden` attribute SHALL NOT display.
5. There SHALL be no horizontal overflow from 320 to 2560 px in either theme.
6. Every public template and admin view SHALL have:
   - zero axe violations (WCAG 2.2 AA) in both themes;
   - full keyboard operation with visible focus;
   - labelled fields and announced errors.

### R4 — Assets and fonts

**As the owner, I want all images and fonts served by this site, so that it is fast and independent of WordPress.**

1. THE 17 WordPress case images SHALL be fetched with `fetch-live-assets.mjs` before WordPress is retired. They SHALL be committed and served as dimensioned AVIF/WebP, and the site SHALL NOT link to `wp-content`.
2. Every visible image SHALL have width, height and alt text, and below-the-fold images SHALL load lazily.
3. Fonts SHALL be self-hosted woff2: Big Shoulders Display 800, Inter 400 and JetBrains Mono 400. `.c-quote` SHALL use a shipped face; no synthesized faces.
4. Client logos SHALL replace text marks only once the owner supplies the files.

### R5 — Contact form and endpoint

**As a prospect, I want a short form that works on any device and without JavaScript, so that I can reach ZINC about a specific service.**

1. THE form SHALL follow the Design's three steps:
   - preselect a service when exactly one valid `?service=` value is given;
   - validate each step with the Design's messages;
   - on success, go to `/thanks/` showing the owner-approved live copy.
2. WHEN the server rejects a submission, with or without JavaScript, the visitor SHALL see the message with their entries kept and the text-us alternative.
3. The contact form SHALL be live in every build (owner, 5 Oct 2026: production only, no demo mode). Previews are protected, so only staff and checks reach their form.
4. `POST /api/inquiries` SHALL:
   - accept only POST;
   - reject bodies over 32 KB;
   - reject cross-origin requests;
   - validate every field against the Design's options and length limits;
   - ignore any client-supplied ids or stages;
   - treat a filled honeypot as success without storing anything.
5. THE endpoint SHALL use no third-party challenge service. Spam protection SHALL be the honeypot (R5.4), the same-origin check (R5.4) and the rate limit (R5.6).
6. THE endpoint SHALL accept at most 5 inquiries per client per 10 minutes and 20 per day, then return 429. Limits SHALL be counted from stored salted hashes of client addresses; raw addresses are never stored.
7. Responses SHALL be `no-store`, SHALL never echo stored data, and SHALL never expose internal error text.

### R6 — Inquiry storage and notifications

**As ZINC staff, I want every valid inquiry saved and emailed, with failures visible, so that no lead is missed.**

1. A valid submission SHALL be saved by one server-side insert that includes the timeline and sets the notification status to `pending`.
2. THE database SHALL give anonymous and non-staff users no read or write access to inquiry data. The direct anonymous insert policy SHALL be removed.
3. THE server key SHALL be server-only and used only by named server operations.
4. After saving, the server SHALL email the notification through Workspace SMTP to `jaymie@zincdigital.co` (configurable). It SHALL finish the attempt before the function ends and record `sent`, or `failed` with the error.
5. The visitor's success SHALL NOT depend on the email. A failed email SHALL never remove or change the inquiry.
6. THE admin SHALL highlight failed notifications and offer **Resend notification**.
7. Before live mode, the domain SHALL publish one SPF record that includes Google Workspace, and DKIM SHALL be on (owner DNS change).

### R7 — Staff accounts and sessions

**As the owner, I want only invited staff to sign in, with sessions that refresh, end cleanly and stop at offboarding, so that the admin stays private.**

1. Public signup SHALL be disabled in Supabase Auth, and sign-in SHALL never create users.
2. An owner SHALL invite staff by email and role (owner or editor) from the admin. The invitation SHALL create the staff membership linked to the new user id.
3. A `zincdigital.co` or `zincmiami.com` address SHALL be required, but SHALL never be sufficient on its own.
4. THE first owner SHALL be added once through a documented step run with the owner's go. No staff addresses SHALL appear in source or migrations.
5. Sign-in SHALL use a magic link with server-side code exchange and HttpOnly, Secure, `SameSite=Lax` cookies. No tokens SHALL remain in localStorage or URLs.
6. Expired sessions SHALL refresh transparently while the refresh token is valid. When refresh fails, the user SHALL be sent to sign-in.
7. Sign-out SHALL be available on every admin view and SHALL end the session and clear its cookies.
8. Post-login redirects SHALL be limited to `/admin/` paths on this site. Anything else, including `//` addresses, SHALL fall back to `/admin/`.
9. An owner SHALL be able to offboard staff by removing the membership and deleting the user. That person's next admin request SHALL be denied, even with an unexpired token. The last owner SHALL NOT be removable.

### R8 — Admin access control

**As the owner, I want every private page and API to check staff membership on every request, so that there is no way around it.**

1. Every `/admin/` page except sign-in and callback, and every staff API, SHALL render on demand and verify both the Supabase session and an active staff membership.
2. IF either check fails, THEN pages SHALL redirect to sign-in and APIs SHALL return 401.
3. Errors or unexpected answers SHALL deny access.
4. Pages and APIs SHALL check access themselves, not rely on middleware alone.
5. Owner-only actions SHALL be enforced on the server: invite, role change, offboarding, Publish and Redeploy.
6. Staff data SHALL be read under the signed-in user's session wherever RLS allows. The server key SHALL be used only for:
   - the contact insert;
   - invitations and offboarding;
   - publish and build reads.
7. Admin and auth responses SHALL be `private, no-store` and `noindex`.
8. State changes SHALL require POST from the same origin, and IDs SHALL be validated before use in queries.

### R9 — Database

**As the owner, I want the database defined in the repo and matching the code, so that nothing depends on untracked console changes.**

1. THE live schema SHALL be captured into `supabase/migrations/` as a baseline that matches the live database.
2. Changes SHALL be new migrations:
   - rehearsed with their tests inside a rolled-back transaction on the project;
   - merged by PR;
   - applied to production only with the owner's go.
3. THE migrations SHALL fix the gaps in 1.2 and add what the features need:
   - explicit least-privilege grants;
   - the anonymous insert policy removed;
   - `timeline`, notification-status and hashed-address columns;
   - `stage` as the only stage field;
   - an app-callable staff check with a fixed search path;
   - an RLS-respecting `inquiry_board`;
   - research column and kind names matching the code, plus a full-text index;
   - a private `research` storage bucket;
   - SEO and status fields for pages and posts.
4. After migration, the Supabase security advisor SHALL report no warnings, and generated database types SHALL compile against the code.

### R10 — Admin shell and inquiries

**As a staff member, I want the admin to match the approved admin design with real data, so that I can work leads in one place.**

1. THE admin SHALL implement `ZINC Admin.dc.html` in both themes on desktop and mobile:
   - a sidebar with Dashboard, Research, Inquiries, Pages, Posts, SEO, Stats and Backend, showing live counts;
   - the theme toggle;
   - a View-site link;
   - a drawer;
   - an undo toast.
2. Each view SHALL have its own URL under `/admin/`.
3. THE "Sample data" chip SHALL become a real connection-status indicator.
4. Every view SHALL have loading, empty and error states, and SHALL show no invented figures.
5. A **Staff** view (list, invite, resend invite, change role, offboard) and the sign-out control SHALL use the admin design's existing components; they are not drawn in the Design.
6. THE inquiry board SHALL show four stages (New, Contacted, Qualified, Closed) with counts. Each card SHALL show company, name, services, budget, date and notification status.
7. THE drawer SHALL show every field and offer:
   - stage chips;
   - saved notes and next step;
   - **Email**, via Workspace SMTP or `mailto:`;
   - **Archive**, with Undo. Archived inquiries SHALL be restorable.
8. Each change SHALL be logged with the acting staff user.
9. THE board SHALL refresh on window focus and every 60 seconds while visible.

### R11 — Pages, posts, SEO and publishing

**As ZINC staff, I want to edit page and post SEO in the admin and publish it safely, so that content stays current without code changes.**

1. **Pages** SHALL list all public pages and **Posts** SHALL list all posts, each with the Design's search, filters and detail drawer.
2. Staff SHALL edit meta title, meta description, focus keyword and noindex. Posts can also be set to draft or published.
3. **New post** SHALL create a draft with title, slug, layer, excerpt and a Markdown body. Published posts SHALL render in the Design article layout.
4. **SEO** SHALL list every page and post with:
   - a score from the prototype's field-based formula, and its issues;
   - a search-result preview;
   - 60/160 character counters.

   SEO edits SHALL save to the same fields.
5. Saving SHALL NOT change the live site. An owner's **Publish** SHALL trigger a production build that applies saved fields and published posts. The admin SHALL show the last publish time and result.
6. IF the build cannot read the database, THEN the build SHALL fail and the current live site SHALL stay unchanged.

### R12 — Dashboard, Stats and Backend

**As the owner, I want truthful performance and system views, so that I can see what is happening without other dashboards.**

1. **Dashboard** SHALL show, from the configured Google service account and the database:
   - Search Console organic clicks and indexed pages;
   - new inquiries and average SEO score;
   - a 30-day chart;
   - GA4 top pages;
   - a needs-attention list (failed notifications, SEO issues, failed deploys).
2. **Stats** SHALL show sessions, engagement and inquiries. "AI citations" SHALL show "No data source".
3. **Backend** SHALL show:
   - the latest production deployment and its commit, plus the last five deployments;
   - Search Console and GA4 connection state;
   - the contact form's mode and failed notifications;
   - the last publish.
4. An owner-only, confirmed **Redeploy** SHALL rebuild `main`.
5. WHILE a credential is missing, its card SHALL say what is needed instead of showing data.

### R13 — Research workspace

**As ZINC staff, I want private research projects with sources and a cited chat, so that client research lives in one place.**

1. Staff SHALL create and select projects; a blank name SHALL show a message.
2. Sources SHALL list kind, title, status (pending, ready or error) and time. Staff SHALL be able to add:
   - **Note:** up to 200,000 characters;
   - **URL:** see R13.4;
   - **File:** PDF, DOCX, TXT or MD up to 10 MB, stored in the private bucket, with text extracted;
   - **SERP:** top 20 results, enabled once the owner supplies a provider key.
3. Failures SHALL show status `error` with a readable reason.
4. URL sources SHALL be fetched only from public internet addresses:
   - http(s) only, no credentials, hostname normalized;
   - every resolved address checked before connecting, and the connection made to that checked address;
   - each redirect re-checked (at most 3);
   - limits: 10 seconds, 2 MB, text content types only, 120 chunks.

   Until these checks pass their tests, URL sources SHALL show as not enabled.
5. Chat SHALL:
   - answer from the project's sources, found by full-text search;
   - stream answers and disable Send while streaming;
   - support Cmd/Ctrl+Enter and auto-scroll;
   - save each message with its status and model.
6. Citations `[n]` SHALL refer only to sources actually supplied to the model. Questions SHALL be capped at 8,000 characters.
7. THE model picker SHALL show the Design's options. Each SHALL be selectable only once the owner sets its API key; otherwise it SHALL say why it is unavailable.
8. Models SHALL receive sources as quoted text and SHALL have no tools.
9. All research data SHALL be staff-only.

### R14 — SEO, redirects and indexing

**As the owner, I want search engines to see only the finished site and old URLs to keep working, so that rankings survive the move.**

1. Every public page SHALL have:
   - a title, a description and an absolute canonical URL on `https://www.zincdigital.co`;
   - Open Graph tags with a share image;
   - valid JSON-LD: Organization, the two office locations, WebSite and BreadcrumbList on every page; Service and FAQPage on service pages; Article on articles, with authors typed correctly.
2. Discovery files and noindex:
   - THE sitemap SHALL list exactly the indexable pages.
   - `robots.txt` SHALL disallow `/admin/` and `/api/`.
   - `llms.txt` SHALL be published.
   - `/thanks/`, 404 and admin pages SHALL be `noindex`.
3. Analytics SHALL continue with `GT-NNZRWNCF`, `G-BV43HRVJ18` and `AW-17071018445`, loaded asynchronously and counted outside the 15 KB first-party budget (D1). The privacy page SHALL disclose it. There is no cookie banner.
4. BEFORE cutover, one file SHALL hold the 301 map and the 410 list, built from the WordPress REST API and Search Console:
   - posts → `/blog/<slug>/`, including the renamed AI-search post;
   - `/service/*` → service pages;
   - portfolio → `/work/`;
   - about and team → `/about/`;
   - other URLs → 301 only where they have traffic or backlinks, otherwise 410.
5. 301s SHALL use Astro redirects and 410s SHALL use one on-demand route. Every redirect SHALL be single-hop, and internal links in posts SHALL be updated.
6. Preview deployments SHALL use Vercel Deployment Protection and send `noindex`.
7. `zinc-digital-web.vercel.app` SHALL send `noindex` until launch. After launch, only `www.zincdigital.co` SHALL be indexable.

### R15 — Security and paid services

**As the owner, I want standard protections and no surprise costs, so that the site is safe and within budget.**

1. Responses SHALL send:
   - a Content-Security-Policy limited to the required origins;
   - `frame-ancestors 'none'`;
   - `nosniff`;
   - a Referrer-Policy;
   - a Permissions-Policy;
   - HSTS on the production domain after cutover.
2. Secrets SHALL live only in Vercel environment variables (entered by the owner) and a git-ignored `.env`. A build check SHALL fail if a secret appears in client output.
3. Logs SHALL contain no secrets and no prospect details beyond the inquiry id.
4. Paid or metered providers (Anthropic API, OpenAI API, SERP provider) SHALL stay off until the owner sets their keys.
5. Usage SHALL stay within Vercel Pro, Supabase and Google Workspace.

### R16 — Performance targets

**As the owner, I want the agreed speed targets met, so that the site proves ZINC's standard.**

1. Every public template SHALL meet:
   - LCP ≤ 1.2 s;
   - CLS 0;
   - INP < 100 ms;
   - at most 15,360 gzip bytes of first-party JavaScript per page.
2. THE JavaScript budget and font checks SHALL run on every build and fail it when exceeded.
3. Lighthouse mobile SHALL run on every public template:
   - at the end of each page milestone;
   - on the release candidate;
   - on production after cutover.

   It SHALL report all four category scores and the Web Vitals. A score below 100 SHALL NOT fail anything (owner, 4 Oct 2026). Issues it reports SHALL be reviewed, and real defects fixed.
4. LCP, CLS and INP misses on the release candidate SHALL be fixed before launch.
5. Before launch, INP SHALL be measured with scripted interactions, because field data does not exist yet.

### R17 — Verification

**As the owner, I want focused tests on the risky parts, so that "done" is proven without excess process.**

1. **Build:** CI SHALL pass `npm ci`, `npm run check`, `npm run build` and the corrected static check, which covers:
   - the 43 pages;
   - metadata and links;
   - the JavaScript budget;
   - banned text.
2. **Main page flows:** the corrected quick browser check SHALL pass in CI:
   - every page loads;
   - the theme persists;
   - the contact flow works with and without JavaScript;
   - blog filters work;
   - content is visible under reduced motion;
   - axe passes in both themes.
3. **Contact tests** SHALL cover:
   - validation;
   - the size limit;
   - the origin check;
   - the honeypot;
   - the rate limit;
   - database failure;
   - email failure, with the inquiry kept and marked failed.
4. **Permission tests** SHALL run as SQL inside rolled-back transactions on the Supabase project, plus HTTP checks on a preview deployment. They SHALL cover:
   - anonymous and non-staff users denied on every table;
   - editor vs owner actions;
   - an offboarded user denied with a live token;
   - admin pages and APIs redirecting or returning 401 without a session;
   - redirect-target sanitising.
5. **URL-fetch tests** SHALL reject:
   - loopback, private, metadata, CGNAT and trailing-dot hosts;
   - a hostname resolving to a private address;
   - a redirect to a private address;
   - oversize and slow responses.
6. **Visual UX/UI review, repeated until clean:**
   - WHEN a page template or admin view is built THE implementer SHALL capture it and the matching Design reference in light and dark at 375, 768 and 1440 px, and review them side by side.
   - Each review SHALL also check interaction states: hover, focus, open drawer and menus, form errors, empty and loading states, reduced motion.
   - Every mistake SHALL be recorded with its screenshot, fixed, and re-captured.
   - Rounds SHALL repeat until a round finds no mistakes. Each later round SHALL be done by a reviewer who did not build that page.
   - Before launch, a final full-site round SHALL cover every template and admin view. The owner SHALL receive the screenshot set and the list of fixed mistakes.
7. **Before launch:** the redirect script SHALL pass on a preview deployment.

### R18 — Integration, retirement and launch

**As the owner, I want the current site preserved until the new one is proven, and a controlled cutover, so that nothing is lost.**

1. Work SHALL follow the Kiro flow (D5):
   - every milestone runs in this spec's Kiro worktree on its Kiro branch `spec/create-a-complete-implementation-spec`;
   - milestones are the numbered task groups in `tasks.md`, executed in order after Spec Builder's hand-off;
   - each milestone ends with a PR from the Kiro branch to `main`, merged with green checks after one app review of its final head;
   - after each merge, the Kiro branch is reset to the updated `main` before the next milestone starts;
   - the branch and worktree are removed after the last milestone merges.
2. WHILE implementation is in progress, THE local Astro dev server SHALL stay running on `127.0.0.1` and open in the dashboard's Browser panel, so the owner can watch changes live. Each pushed branch SHALL also have its Vercel preview link in the PR.
3. New code SHALL run alongside the old preview files until R17 passes.
4. Retiring the old preview files and scripts SHALL then be proposed as a list. Files SHALL be deleted only with the owner's explicit approval.
5. Every requirement R1–R17 SHALL be implemented and verified before DNS cutover (D2). A feature that depends on an owner key the owner has not set (the paid AI models or SERP) counts as verified once:
   - its mocked tests pass;
   - its "not enabled" state is shown.
6. Before cutover:
   - owner content approvals recorded;
   - live mode on;
   - one real test inquiry received and seen in the admin;
   - SPF and DKIM verified;
   - owner staff accounts set up.
7. DNS SHALL switch only on the owner's go at that moment. Before switching: confirm the DNS host, lower TTLs, and leave mail records unchanged.
8. Within an hour after cutover, the following SHALL be checked on the live domain:
   - redirects;
   - sitemap submission;
   - analytics;
   - a test inquiry;
   - Web Vitals;
   - staff sign-in.
9. WordPress SHALL stay available for about 30 days as the rollback path.

---

## 4. Decisions

**Already decided (reused):**
- Claude Design is the authority (owner, 4 Oct 2026).
- Single-project architecture with invite-only staff (this request).
- Light theme by default, with the visitor's choice stored.
- Performance: LCP, CLS, INP and the 15 KB JavaScript budget are kept. Lighthouse runs and reports, but scores below 100 never fail (owner, 4 Oct 2026).
- Visual UX/UI reviews repeat until a round finds no mistakes (owner, 4 Oct 2026).
- A live local preview is kept open during implementation (owner, 4 Oct 2026).
- No paid services, no Cloudflare and no Docker (owner, 4 Oct 2026).
- Inquiry emails go to Jaymie through Workspace SMTP.
- Spam protection: honeypot, same-origin check and rate limit.
- 410s come from one on-demand route.
- Analytics IDs carried over; no cookie banner.
- D1: the Google tag loads asynchronously and counts separately from the 15 KB first-party budget, as a recorded exception. LCP, CLS and INP still apply with the tag loaded (owner, 4 Oct 2026).
- D2: everything (R1–R18) is done before DNS cutover (owner, 4 Oct 2026).
- D3: PR #6 is closed as superseded by R1, carrying over its Codex-review and SPF notes (owner, 4 Oct 2026).
- D4: implementation uses Kiro `spec/<slug>` branches, one per milestone, each in its own `zinc-digital-web-wt-<slug>` worktree. This replaces the `codex/` naming in D3 (owner, 4 Oct 2026).
- D5: the native Kiro flow. One Kiro spec branch and worktree, milestones as task groups in `tasks.md`, a PR per milestone, and the branch reset to `main` after each merge. This replaces the per-milestone worktrees in D4 (owner, 4 Oct 2026).
- Fonts: 800/400/400.
- Four case pages.
- Cutover on the owner's go, with a 30-day rollback.

**Open:** none.

**Owner inputs** (content and credentials, not decisions):
- **Content:**
  - OUABC and U.S. Oil results and before images;
  - confirmation of the Las Vegas Safety and Summit claims;
  - client logo files;
  - Privacy and Terms copy;
  - live thanks and contact copy;
  - the "Team ZINC" author lines;
  - SMS number confirmation;
  - the initial owner and staff list.
- **Credentials and settings:**
  - Workspace App Password;
  - the Supabase database connection string, kept in the git-ignored local `.env` for the rolled-back test runs;
  - Google service account;
  - Vercel token and deploy hook;
  - optional Anthropic, OpenAI and SERP keys;
  - Supabase Auth SMTP, signup and redirect settings;
  - Vercel Deployment Protection.
