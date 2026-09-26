# Phase 01 — External API Coverage

Scope measured from source on 2026-09-25 (CT): `scripts/prepare-mockup.mjs` lines 85–97 are the phase's only external API calls. Both are unauthenticated, build-prep-only reads of the current public WordPress site; builds read the committed snapshot (`src/data/posts.preview.json`), never a live fetch. Vercel CLI/API calls in 01-01 are deployment operations, not a product integration.

| capability | decision | reason |
|---|---|---|
| WordPress REST posts list (`/wp-json/wp/v2/posts`, published, per_page=100) | INTEGRATE | |
| WordPress REST single user (`/wp-json/wp/v2/users/{id}`, name/description/link) | INTEGRATE | |
| WordPress REST pages | OPT-OUT | New site pages are written fresh per the approved spec; legacy Elementor pages are not migrated as content |
| WordPress REST media / attachments | OPT-OUT | Imagery comes from the owner-supplied V2 zip and brand sources, converted locally with sharp |
| WordPress REST categories and tags | OPT-OUT | Spec forbids importing the legacy taxonomy; layer/service mappings are assigned from each article's subject |
| WordPress REST comments | OPT-OUT | The new site has no comments feature |
| WordPress REST search, settings, menus and all authenticated/write endpoints | OPT-OUT | Mockup is read-only and sends nothing; no credentials are held |
