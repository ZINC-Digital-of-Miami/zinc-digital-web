# Port integration record

Source: `Zinc Digital redesign ASTRO.zip` (SHA-256 `a624cfec445d67ee9ad36d253f51100dc11c030795be66ec58e3295b817d42d0`), extracted to `current-design/astro/`. Integrated 4 Oct 2026 (CT), Kiro spec task 2.1.

| File | Disposition | Reason |
|---|---|---|
| `.env.example` | added | PORT.md section 5.1 |
| `astro.config.mjs` | replaced | PORT.md section 5.2 |
| `package.json` | adapted | package scripts taken; `version` kept at 0.0.1 so `package-lock.json` stays unchanged |
| `public/brand/zinc-badge.png` | added | PORT.md section 5.1 |
| `public/logos/general-shale.png` | added | PORT.md section 5.1 |
| `public/logos/google-partner.png` | added | PORT.md section 5.1 |
| `public/logos/ouabc.webp` | added | PORT.md section 5.1 |
| `public/logos/us-oil.png` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/bethany-mckinzie.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/dr-basset.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/jaymie-wilhoit.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/kirk-musick.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/martin-stewart.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/priya-nahar.webp` | added | PORT.md section 5.1 |
| `public/mockup/team-bw/wendy-funnell.webp` | added | PORT.md section 5.1 |
| `public/og/article.png` | added | PORT.md section 5.1 |
| `public/og/build.png` | added | PORT.md section 5.1 |
| `public/og/demand.png` | added | PORT.md section 5.1 |
| `public/og/home.png` | added | PORT.md section 5.1 |
| `public/og/intelligence.png` | added | PORT.md section 5.1 |
| `public/og/work.png` | added | PORT.md section 5.1 |
| `scripts/check-site.mjs` | replaced | PORT.md section 5.2 |
| `scripts/fetch-live-assets.mjs` | added | PORT.md section 5.1 |
| `scripts/verify-site.mjs` | added | PORT.md section 5.1 |
| `src/components/Page.astro` | added | PORT.md section 5.1 |
| `src/components/home/HomeBands.astro` | replaced | PORT.md section 5.2 |
| `src/data/assets.site.json` | added | PORT.md section 5.1 |
| `src/data/redirects.ts` | added | PORT.md section 5.1 |
| `src/data/site.ts` | added | PORT.md section 5.1 |
| `src/layouts/SiteLayout.astro` | added | PORT.md section 5.1 |
| `src/lib/supabase.ts` | added | PORT.md section 5.1 |
| `src/middleware.ts` | added | PORT.md section 5.1 |
| `src/pages/[...path].astro` | replaced | renamed from `-...path-.astro` (Design workspace cannot store brackets); replaces the old catch-all |
| `src/pages/404.astro` | replaced | PORT.md section 5.2 |
| `src/pages/admin/callback.astro` | added | PORT.md section 5.1 |
| `src/pages/admin/index.astro` | added | PORT.md section 5.1 |
| `src/pages/admin/login.astro` | added | PORT.md section 5.1 |
| `src/pages/api/inquiries.ts` | added | PORT.md section 5.1 |
| `src/pages/api/inquiries/email.ts` | added | PORT.md section 5.1 |
| `src/pages/api/research/chat.ts` | added | PORT.md section 5.1 |
| `src/pages/api/research/ingest.ts` | added | PORT.md section 5.1 |
| `src/pages/robots.txt.ts` | added | PORT.md section 5.1 |
| `src/pages/sitemap.xml.ts` | added | PORT.md section 5.1 |
| `src/scripts/home.ts` | added | PORT.md section 5.1 |
| `src/scripts/page.ts` | added | PORT.md section 5.1 |
| `src/scripts/shell.ts` | added | PORT.md section 5.1 |
| `src/styles/home.css` | replaced | PORT.md section 5.2 |
| `src/styles/site.css` | added | PORT.md section 5.1 |
| `src/styles/themes.css` | replaced | PORT.md section 5.2 |
| `src/styles/tokens.css` | replaced | PORT.md section 5.2 |
| `vercel.json` | adapted | package headers kept; site-wide `X-Robots-Tag: noindex, nofollow` kept until launch (R14.7, task 28.2) |
| `.nvmrc` | added | pins Node 24 (R1.6) |

Not taken: `PORT.md` and `handoff/**` (Design reference copies; they stay in the extracted package).

Kept for now (retired only after the new checks pass, task 30.1): `src/layouts/PreviewLayout.astro`, `src/components/MockupPage.astro`, `SiteFooter.astro`, `TeamBand.astro`, `CircuitThread.astro`, `src/styles/base.css`, `src/data/mockup.ts`, `scripts/verify-mockup.mjs`, `scripts/verify-local.mjs`, `scripts/gate-preview.mjs`, `scripts/prepare-mockup.mjs`.
