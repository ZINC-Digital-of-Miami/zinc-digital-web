# External Integrations

**Analysis Date:** 2026-09-25

## APIs & External Services

**Fonts:**
- Fontsource — configured font acquisition for Big Shoulders Display 800 in `astro.config.mjs`.
  - SDK/Client: Astro built-in `fontProviders.fontsource()`; consumed by `Font` from `astro:assets` in `src/layouts/PreviewLayout.astro`.
  - Auth: no environment variable or credential reference in the authored configuration.
- Google Fonts — configured font acquisition for Inter 400 and JetBrains Mono 400 in `astro.config.mjs`.
  - SDK/Client: Astro built-in `fontProviders.google()`; consumed by `Font` in `src/layouts/PreviewLayout.astro`.
  - Auth: no environment variable or credential reference in the authored configuration.
- These are build font-provider configurations. The source uses Astro-managed font assets, not an authored Google Fonts stylesheet URL in browser markup; actual build requests, emitted font URLs, and browser network behavior were not measured. Evidence: `astro.config.mjs`, `src/layouts/PreviewLayout.astro`.

**Hosting:**
- Vercel — adapter enabled by `adapter: vercel()` in `astro.config.mjs`.
  - SDK/Client: `@astrojs/vercel` 11.0.11 in `package.json` and `package-lock.json`.
  - Auth: no deployment credential reference in authored application code; provider settings and `.vercel` state were excluded.

**Application APIs:**
- No HTTP fetches, API clients, analytics SDK calls, form submissions, or runtime service requests are authored in `src/pages/design-preview/a.astro`, `src/layouts/PreviewLayout.astro`, `src/components/MockupBands.astro`, or `src/components/bands/Hero.astro`.
- `src/components/bands/Hero.astro` links to `/contact/`; no contact route or submission endpoint exists in `src/pages/`. This is a navigation target, not an implemented inquiry integration.
- `src/components/bands/Hero.astro` labels a link “Text” but uses a `tel:` URI. This invokes the device's telephone handler; it is not an SMS API integration.

## Data Storage

**Databases:**
- Not detected: `package.json` declares no database client/ORM, and the current `src/` implementation contains no database access.
  - Connection: no application connection-variable reads in `src/` or `astro.config.mjs`.
  - Client: not applicable to the implemented preview.

**File Storage:**
- Local authored files only: copy is embedded in `src/components/bands/Hero.astro`; no object-storage client or CMS reader is present in `package.json` or `src/`.
- Build/font assets are configured through Astro in `astro.config.mjs` and `src/layouts/PreviewLayout.astro`; generated outputs were excluded from this map.

**Caching:**
- No application cache service or custom caching implementation is present in `src/` or `package.json`. Hosted CDN behavior was not measured; `vercel.json` specifies robots headers, not application cache policy.

## Authentication & Identity

**Auth Provider:**
- Not detected in the application: no auth client, protected-route middleware, session logic, or sign-in route is authored in `src/` or declared in `package.json`.
- `src/layouts/PreviewLayout.astro` and `vercel.json` configure noindex, which is search-engine guidance rather than authentication. Deployment protection is a provider setting and was not inspected.

## Monitoring & Observability

**Error Tracking:**
- None detected in authored source or direct dependencies: `src/`, `package.json`.

**Logs:**
- No application logger or authored console calls occur in `src/`; `package.json` exposes ordinary Astro CLI commands. Runtime logs were not queried.
- `@axe-core/cli` and `@lhci/cli` are declared local audit tools in `package.json`, not implemented monitoring integrations; no checked-in audit automation is present.

## CI/CD & Deployment

**Hosting:**
- Vercel is configured in `astro.config.mjs`; output is static. `vercel.json` requests `X-Robots-Tag: noindex, nofollow` for every path.
- `.vercelignore` excludes documentation, planning, scratch, environment files, dependencies, and generated directories from upload.
- Source configuration does not establish the live deployment commit, Git integration, active domains, build environment, or actual response headers; these were not measured.

**CI Pipeline:**
- No tracked `.github/workflows/` pipeline or other CI configuration is present in the repository inventory. `package.json` provides `build` and `check` commands but no CI orchestration or test command.
- `AGENTS.md` requires PR delivery and Copilot review; this policy does not establish that remote branch protection or review automation is configured.

## Environment Configuration

**Required env vars:**
- None referenced by the implemented preview in `src/` or `astro.config.mjs`.
- `.planning/STATE.md` describes owner-provided Workspace App Password and Turnstile keys for an inquiry feature. They remain planning requirements: `package.json` and `src/` contain no mail transport, Turnstile widget, verification handler, or inquiry submission implementation. No exact environment names are invented here.
- `.planning/STATE.md` also mentions a Gmail API fallback, Route 53/SPF work, and WordPress/Search Console export needs. These are not current application calls or configured integrations in `src/` and `astro.config.mjs`.

**Secrets location:**
- `.gitignore` and `.vercelignore` exclude environment files; `.planning/STATE.md` places proposed inquiry credentials in owner-managed Vercel environment variables.
- Actual secret existence, values, and provider storage were not inspected. No secret-file contents were read.

## Webhooks & Callbacks

**Incoming:**
- None implemented. `src/pages/design-preview/a.astro` is the only authored page route; no API endpoint, webhook handler, form action, or authentication callback is present under `src/`.

**Outgoing:**
- None implemented. The current Astro components contain ordinary navigation and a telephone URI, with no webhook producer or outbound application API client; `src/components/bands/Hero.astro`, `src/layouts/PreviewLayout.astro`.
- `/` redirects to `/design-preview/a/` through `astro.config.mjs`. The layout's `/design-preview/` link and hero's `/contact/` link have no corresponding authored page route; they do not demonstrate connected service flows.

---

*Integration audit: 2026-09-25*
