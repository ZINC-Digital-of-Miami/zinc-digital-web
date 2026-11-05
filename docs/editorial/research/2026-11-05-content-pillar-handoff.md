# Content pillars: handoff to Codex

Prepared 5 November 2026 CT against `origin/main` `b314bdd` (PR #82) and the live site. This file covers pillar coverage and the editorial queue. The companion runbook, `2026-11-05-seo-onpage-codex-brief.md`, covers on-page SEO, internal links, metadata, schema and the AI optimizers.

## Read in this order

1. `AGENTS.md` on `origin/main`. It overrides everything below. In particular:
   - OUABC is removed (`/work/once-upon-a-book-club/` is 410).
   - No placeholder markers in pages.
   - Kirk's first-person articles use `kirk-voice`; client bylines use `zinc-author-voice`.
   - Node 24, no Docker.
   - Never "GEO".
   - The Kiro git flow.
2. `docs/editorial/schedule.md`, the editorial register. Its cadence, author lanes, standards and release rules govern every new article.
3. `docs/editorial/research/2026-11-03-content-marketing-pillars.md`. Owner model: **a pillar is a service-aligned blog category** (`/blog/category/<service>/`). Guides sit inside categories, and they are articles, not pillars.
4. `docs/editorial/research/2026-11-05-seo-onpage-codex-brief.md`, the on-page SEO runbook (Tasks 0–8, decisions D1–D13).
5. This file: pillar coverage (§1), D14 (§2) and the queue extension (§3). §3 replaces Task 7 of the SEO runbook.
6. Open PR #83 (`codex/seo-article-intent-map`), which already maps intent across the search-update, Merchant Center, Shopping and Search Console articles. Reconcile with it before touching SEO-runbook F4 or Task 5. Do not duplicate it.

**Superseded and not committed:** `content-strategy-codex-brief-2026-11-05.md` and `internal-linking-plan-2026-11-05.md` at the root of the main checkout. Both were built from local `main` `1a2ea8b`, which is 76 commits behind `origin/main` and still holds the 25 September mockup. Ignore them.

## 1. Pillar coverage (live, 5 November ~10:00 CT)

**Source:** the article links in `<main>` of each saved `/blog/category/*` page from the on-page SEO crawl (`/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/html/`). There are 45 published posts and 10 categories. `categoryPosts()` lists a post in every category named in its `related` list, so one post appears in several pillars.

| Pillar (category) | Posts listed | Planned in register | State |
|---|---|---|---|
| `seo` | 28 | 05, 08, 11 (content-led) | Saturated. 62% of all posts sit here. |
| `business-intelligence` | 17 | 06, 12, 16 | **Diluted.** Most members are mainly about something else, for example `meta-ads-basics`, `tiktok-ads-basics`, `google-core-update-review` and `how-to-read-a-google-algorithm-update`. |
| `shopify` | 11 | 14 | Healthy |
| `ai-search-optimization` | 10 | 04 (live), 08, 10 | Healthy |
| `web-design` | 10 | 13 | Diluted by SEO posts (`how-long-seo-actually-takes`, `four-pillars-of-seo-operators-view`, `duplicate-content-isnt-a-penalty-but-its-a-tax`) |
| `shopping-ads` | 8 | 07, 09 | Healthy |
| `google-search-ads` | 5 | — | Thin. There is no post about running Search campaigns. |
| `social-ads` | 4 | — | Thin. TikTok has no category of its own (SEO runbook D10). |
| `apps` | 1 | 18 | **Thin hub.** Its only post is `business-intelligence-basics`. |
| `local-seo` | 1 | 17 | **Thin hub.** |
| *(no `tiktok-ads` category)* | — | — | Service page exists; see D10 |

## 2. Owner decision D14: pillar dilution

Category pages list every post that names the service anywhere in `related`. As a result, the BI pillar shows 17 posts while only a handful are mainly about BI, and the web-design pillar is mostly SEO posts. Both send a weaker topic signal and give readers less obvious next steps.

- **Recommended:** keep multi-membership, which is the owner's current model. Order each category page with posts whose primary pillar is that category first (`proposalPillar(related)`, `src/lib/proposal-pillar.ts`), then list the others under a quieter "Related from other topics" heading. This needs no URL, slug or `related` changes.
- **Alternative:** trim `related` on the posts that are only adjacent. This changes editorial data across many posts and needs owner review post by post.
- **Gates:** the category template change. Static HTML, zero added client JS, verified at the repo's responsive sizes.

## 3. Queue extension: register items 19 and on (replaces SEO runbook Task 7)

**Purpose:** bring every thin pillar to at least 3 posts that are mainly about it, and cover the ecommerce buyer's measurement questions.

**Exclusions:** the queue avoids the 45 live posts and planned items 05–18. Coverage was judged from titles and descriptions only, so read the related live bodies before drafting and cut any item that repeats an existing intent.

**Owner approval (D4)** is needed before any item enters the register.

**Slotting rules:** follow the register.
- Mon/Fri are practical how-tos and Wednesday is industry analysis.
- Fill four weeks ahead.
- Assign authors by expertise: Kirk for BI, measurement and technical web; Jaymie for ecommerce, Shopify, paid media and local execution; Wendy for content-led subjects.
- These gaps fall mostly in Kirk's and Jaymie's lanes. Keep Wendy's roughly half share with content-led items between them, and don't reassign topics to balance the byline count.

| Priority | Pillar (primary) | Author lane | Working title and practical deliverable | Why now |
|---|---|---|---|---|
| 1 | `apps` | Kirk | Decide who can see, change and approve each record in a business app: a roles-and-permissions worksheet with a labelled example | Apps reaches 3 with item 18 |
| 2 | `local-seo` | Jaymie | Build location pages that help customers, not doorway pages: page facts, distinct content and a review checklist | Local reaches 3 with item 17 |
| 3 | `business-intelligence` | Kirk | Why Shopify, GA4 and ad-platform revenue don't match: a reconciliation worksheet by cause (timing, attribution, refunds, tax, currency) | Gives the BI pillar a post mainly about BI. Link to item 06 (KPI dictionary) and `ga4-ecommerce-event-validation`. |
| 4 | `google-search-ads` | Jaymie | Review search terms without cutting real demand: exclusions, match types and a weekly review template | First post about running Search campaigns |
| 5 | `social-ads` | Jaymie | Plan Meta and TikTok creative tests that answer one question: test design, reading creative fatigue from delivery data, and a decision log | Social pillar. Follow-on to the two basics posts. |
| 6 | `shopify` (+ `web-design`) | Jaymie | Move an ecommerce store to Shopify without losing search or orders: a URL, redirect, product-data and checkout test map | Gap. Distinct from `wordpress-php-security-moving-to-astro`. |
| 7 | `shopping-ads` (Wednesday analysis) | Jaymie | Performance Max or Standard Shopping for a catalog brand: what current controls and reporting allow | Comparison intent. Check current Google documentation when drafting. |
| 8 | `business-intelligence` | Kirk | Attribution windows explained for the finance team: one order seen by three platforms, with a labelled example | Measurement question a CFO would ask |
| 9 | `local-seo` | Jaymie | Separate local calls and form leads from profile interactions: tracking setup and a monthly check | Local pillar depth. Matches the service-page FAQ. |
| 10 | `apps` (Wednesday analysis) | Kirk | Custom app, no-code platform or another SaaS subscription: a decision framework by workflow, data and ownership | Apps pillar depth |
| 11 | `shopify` | Jaymie | Audit a Shopify app stack: keep, replace or remove, with a cost-and-data-access worksheet | Matches the service-page FAQ |
| 12 | `web-design` | Kirk | Map URLs before a redesign: keep, redirect or retire, with a mapping template and launch checks | Gives the web-design pillar a post mainly about web design. Distinct from the duplicate-content post (canonical vs redirect). |

**Rules for every item:**
- Use the register's editorial standard.
- Anonymised real client experience only where documented.
- No OUABC data, screenshots or story.
- No invented results.
- Link up to the pillar and across to 2–3 posts in the same pillar, as the SEO runbook F3/F4 rules require.

## 4. Done when (for this file's scope)

- D14 is answered. If the recommended option is chosen, its template PR passes the repo's Node 24 checks and the category pages render primary-pillar posts first.
- The approved D4 items are added to `docs/editorial/schedule.md` as planned rows, with dates, authors and formats, following the register's rules. They are not published early.
- After 2 more posts each, `apps` and `local-seo` each have at least 3 posts whose primary pillar is that category. After that, SEO runbook D10 (`noindex` or intro copy for thin hubs) can be closed.
