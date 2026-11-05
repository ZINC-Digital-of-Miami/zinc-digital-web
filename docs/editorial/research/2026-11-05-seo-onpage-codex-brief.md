# ZINC Digital: on-page SEO review, synthesis and Codex runbook

Prepared 5 November 2026 CT. This document replaces the action lists in `content-strategy-codex-brief-2026-11-05.md` and `internal-linking-plan-2026-11-05.md` wherever they conflict. Section 1 explains why.

**What was measured.** The live site at about 10:00 CT on 5 November 2026: all 99 URLs in `https://www.zincdigital.co/sitemap.xml`, each fetched and parsed for title, meta description, canonical, robots, headings, words inside `<main>`, images, in-body internal links and JSON-LD. The live build is `origin/main` at `b314bdd` (PR #82). Optimizer settings were read from `origin/main` source.

**Evidence.** Raw HTML, `pages.json`, the extraction scripts and the per-page table are in `/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/`. Re-run with:

```bash
python3 -I "/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/bin/extract.py" "<html dir>" "<urls.txt>"
```

**Not measured.** Search demand, rankings and Search Console queries. No keyword volume below is new: the only volumes quoted come from `docs/editorial/research/2026-11-03-ai-search-keyword-volume.json`, already in the repo. Every title and copy proposal below is a draft and needs owner copy approval.

---

## 1. The two companion documents were built on a stale checkout

Both were built from the local checkout at `/Volumes/Satechi Hub/zinc-digital-web`, which is on `main` `1a2ea8b`, **76 commits behind `origin/main`**. That checkout still has the 25 September mockup: 18 posts from `posts.preview.json`, `mockup.ts` and `articleMap`. The live site has 45 posts, 10 blog category hubs, 3 author pages, 2 location pages, a different case set, and data in `src/data/site.ts`, `src/data/page-editorial.ts` and `src/data/article-*.ts`.

| Companion claim | Live status (5 Nov) | Action |
|---|---|---|
| 11/18 posts have 0 internal links; 12/18 link to no other post | **Fixed.** 0 of 45 posts link to no other post; every post has inbound links from other posts. | Drop |
| 12 bare `/services/` prose links in 3 posts | **Fixed.** 0 bare `/services/` anchors in those posts' `<main>`. | Drop |
| No post links to `/contact/` | **Fixed.** 45/45 posts link `/contact/` in the body. | Drop |
| Home "Read the case →" anchors | **Gone.** Home anchors are descriptive. | Drop |
| `/about/` is a dead end | **Partly fixed.** It links to `/` and 2 case studies, but not to `/services/` or `/work/`. | Minor, P3 |
| Link posts to `/work/once-upon-a-book-club/` | **Forbidden.** That URL returns **410**. `origin/main` `AGENTS.md`: OUABC is removed from the public site, "do not restore it". | **Remove from every task** |
| D7: local-seo and ai-search-optimization cite U.S. Oil; google-search-ads cites OUABC | **Superseded.** Live: seo → Ballad Health, local-seo → Meade Tractor, google-search-ads and social-ads → Summit Marine, web-design and apps → U.S. Oil, ai-search-optimization → no case. | Re-ask as D7 below |
| Use `[RECEIPT: …]` markers in copy | **Conflicts.** `origin/main` `AGENTS.md`: "Content waiting on the owner renders nothing; no placeholder markers in pages." | Use no markers. Omit until confirmed. |
| "No `kirk-voice`" | **Conflicts.** `origin/main` `AGENTS.md` (owner, 6 Oct): first-person Kirk/ZINC articles use `kirk-voice`; client bylines use `zinc-author-voice`. | Follow `origin/main` `AGENTS.md` |
| Don't touch the 18-post set or `src/lib/redirects.ts` | Stale. There are 45 posts, and redirects live in `astro.config.mjs`. | Don't change slugs or redirects |
| Services with no primary post: shopify, apps, social-ads, tiktok-ads | **Partly stale.** Live posts now cover Shopify (product page SEO, Merchant Center), Meta (`meta-ads-basics`) and TikTok (`tiktok-ads-basics`). Apps still has only `business-intelligence-basics`. | Re-scope the gap queue (§4, Task 7) |
| Two "Team ZINC" bylines (D5) | **Still true.** `content-marketing-plan-that-produces-pipeline` and `when-web-design-trends-actually-matter` use Article author `Organization: Team ZINC`. | Keep D5 |
| Overlap groups A–D | **Still true, and wider.** Newer posts added overlaps (§3, F4). | Keep, expanded |
| Service pillars never link to posts | **Partly true.** Each service page links its `/blog/category/<slug>/` hub, but 10 of 11 link no post directly. Only `/services/tiktok-ads/` links a post. | Keep D3, at lower priority |
| Posts never link to case studies | **Still true.** 0 of 45 posts link a `/work/<case>/` page. | Keep, with the OUABC rule |
| Demand baseline from the native Search Console API | Still valid. The repo already has a Search Console integration (`src/lib/google.ts` → `seoSearchEvidence`, `src/lib/seo-review-google.ts`). | Reuse it before writing new code |

---

## 2. What already passes on every page (don't touch)

| Check | Result |
|---|---|
| HTTP 200 for all sitemap URLs | 99/99 |
| Self-referencing canonical | 99/99 |
| `index, follow, max-image-preview:large` | 99/99 (the 404 page is `noindex`) |
| Unique title and unique meta description | 99/99 and 99/99 |
| Exactly one H1, no skipped heading levels | 99/99 |
| JSON-LD parses | 99/99. Organization, ProfessionalService, WebSite, WebPage and BreadcrumbList on all pages. Service + FAQPage on 11 service pages. Article with author, dates, image and publisher on 45 posts. ProfilePage on authors, CollectionPage on hubs. |
| `width` and `height` on images | 100% |
| Weak anchors ("click here", "read more") in `<main>` | 0 |
| Sitemap | 99 URLs. Posts carry `lastmod`. |
| robots.txt | Allows the site, blocks `/admin/` and `/api/`, points to the sitemap |
| Images with an empty `alt` | Decorative thumbnails next to linked titles, and author photos next to the name. That's correct; leave them. |

The site's technical base is sound. The remaining gains are in **service-page depth, H1 wording, overlapping posts, post → case links, a few long titles, author entity data, and the two AI optimizers' settings**.

---

## 3. Findings, ranked, with exact fixes

### P1: commercial pages

**F1. Service-page H1s are bare labels.** Titles are keyword-led, but the H1s read like nav labels. The H1 is the strongest on-page heading signal and is what AI answer systems quote.

| Page | Current H1 | Proposed H1 |
|---|---|---|
| `/services/shopify/` | Shopify Ecommerce | Shopify Ecommerce Development |
| `/services/web-design/` | Web Design | Custom Web Design and Development |
| `/services/apps/` | Apps | Business App and Workflow Development |
| `/services/seo/` | SEO | SEO Services |
| `/services/local-seo/` | Local SEO | Local SEO Services |
| `/services/ai-search-optimization/` | AI Search Optimization | AI Search Optimization Services (or "AI Search Optimization and AI SEO" if D8 = yes) |
| `/services/google-search-ads/` | Google Search Ads | Google Search Ads Management |
| `/services/shopping-ads/` | Shopping / Merchant Center Ads | Google Shopping and Merchant Center Management |
| `/services/social-ads/` | Social Ads (Meta) | Meta Ads and Paid Social Management |
| `/services/tiktok-ads/` | TikTok Ads | TikTok Ads Management |
| `/services/business-intelligence/` | Your next move is in your data. | Business Intelligence Platforms and Reporting. Keep "Your next move is in your data." as the line under it. |

How to build it: add an optional `h1` field to the `services` entries in `src/data/site.ts` and render it in the service hero in `src/components/Page.astro`. Keep `title` for nav, cards and categories so those labels don't change. The BI page uses its own hero in `src/components/BusinessIntelligence.astro` and `src/components/IntelligenceHero.astro`. Check the longer H1s at the repo's responsive sizes.

**F2. Service pages are thin.** Inside `<main>` the pages run 257–304 words; `/services/business-intelligence/` runs 1,393. These are the pages that should rank for commercial queries, and each is shorter than any post that links to it. Add these sections, using only facts the owner confirms (no invented numbers, no placeholders):

1. **What's included**: deliverables as a list.
2. **Who it's for**: ecommerce-first, established brands (spec positioning).
3. **How an engagement runs**: steps, plus who does what on ZINC's side and the client's side.
4. **Proof**: the matching case, where the case lists the service (D7).
5. **Guides**: 3 direct post links (D3).
6. **FAQ**: already present; extend it where buyers ask more.

Set no word target. Length follows from these sections.

**F3. No post links to a case study (0/45).** That leaves real proof uncited and wastes link equity to the `/work/` pages. The rule:

- One in-body link per post, to a case whose own service list includes the post's primary service.
- Before linking, confirm the case's services in `src/data/site.ts` and the case page.
- Never link `/work/once-upon-a-book-club/` (410).
- Candidates to verify:

| Post topic | Candidate case |
|---|---|
| SEO posts | `/work/ballad-health/`, `/work/general-shale/` |
| Local SEO | `/work/meade-tractor/` |
| Google Search Ads and Meta posts | `/work/summit-marine-development/` |
| Web design and Astro migration posts | `/work/us-oil-solutions/`, `/work/bear-claw-usa/` |
| Ecommerce posts | `/work/las-vegas-safety/`, but only if that case lists Shopify or Shopping |
| AI search and BI posts | No eligible case today. Leave them without one. |

**F4. Overlapping posts (cannibalization).** For each group: give each post one distinct intent, retitle where needed, and add the missing two-way links. Measured link gaps are marked ✗.

| Group | Posts (live title) | Overlap | Fix |
|---|---|---|---|
| A. Google updates | `how-to-read-a-google-algorithm-update` ("How to Investigate a Google Search Update") · `google-core-update-review` ("Google Core Update Review: Find What Changed") · `three-years-of-algorithm-updates-what-moved-rankings` · `seo-in-2026-what-changed-what-to-ignore` | **The first two target the same task** (investigate an update with Search Console). core-update-review → how-to-read ✗. | Split: **how-to-read** = what to do while an update rolls out (baseline, rollout watch, when to act); proposed title "Google Search Update Response: The First Week". **core-update-review** = the before/after Search Console comparison after rollout; proposed title "Core Update Review: Compare Search Console Data". Link both ways. If the bodies can't support the split, merging is D6. |
| B. AI search | `ai-search-results-and-generative-search-optimization` (overview) · `ai-search-content-strategy` · `what-ai-discovery-changes-editorial-plan` | Content strategy and editorial plan overlap. ai-search-results → content-strategy ✗. content-strategy → editorial-plan ✗. | Overview = sub-hub that links both. content-strategy = what to publish and how to evidence it. editorial-plan = calendar, maintenance and measurement. |
| C. Seasonal ecommerce | `holiday-ecommerce-preparation` · `ecommerce-seasonal-campaign-plan` | Neighbouring intents, and **no link in either direction** ✗✗. | holiday = pre-launch QA (stock, feed, checkout); seasonal = planning calendar. Link both ways. |
| D. Merchant Center and Shopping | `merchant-center-basics` · `merchant-center-feed-diagnostics` · `google-shopping-variant-feed-checklist` · `shopify-google-merchant-center-checklist` · `google-shopping-ad-management-2026` | basics → variant checklist ✗; diagnostics → basics ✗; variant checklist → basics ✗. | basics = setup sub-hub that links all four; each spoke links back to basics. |
| E. Shopify SEO | launch checklist · problems · product page SEO | Already cross-linked. | Keep. |
| F. Search Console | the guide · query/page review · canonical debugging | Already cross-linked. | Keep. |

**F5. Two posts have an organization byline.** `content-marketing-plan-that-produces-pipeline` and `when-web-design-trends-actually-matter` use `Organization: Team ZINC` (source `src/data/article-guides.json`). A named Person author with a profile page is a stronger expertise signal. The owner names the author (D5); never assign one without that.

### P2: metadata and hubs

**F6. Titles likely to truncate (>62 characters including " | ZINC").** Change the **meta title only** and leave the visible H1 unchanged. If article data has no separate meta-title field, add an optional one. Lengths include " | ZINC".

| Page | Now | Proposed (chars) |
|---|---|---|
| `shopify-google-merchant-center-checklist` | 69 | Shopify to Merchant Center: Fix Product Mismatches (57) |
| `google-search-console-the-operators-guide` | 68 | Google Search Console Guide for Business Owners (54) |
| `/blog/category/shopping-ads/` | 67 | Google Shopping & Merchant Center Guides (47) |
| `ai-search-results-and-generative-search-optimization` | 66 | AI Search Visibility: A Guide for Business Owners (56) |
| `content-briefs-search-intent-internal-links` | 65 | How to Write a Content Brief Around Search Intent (56) |
| `/locations/panama-city/` | 65 | Panama City AI Search & Business Intelligence (52) |
| `ga4-utm-naming-conventions` | 64 | GA4 UTM Naming Conventions for Clean Campaign Data (57) |
| `duplicate-content-isnt-a-penalty-but-its-a-tax` | 64 | Duplicate Content: Canonical or Redirect? (48) |
| `merchant-center-feed-diagnostics` | 63 | Merchant Center Feed Diagnostics: Fix Product Issues (59) |
| `google-shopping-variant-feed-checklist` | 63 | Google Shopping Variant Feed Checklist (45) |

Twelve more posts are at 61–62 characters. They are borderline; leave them unless Search Console shows a rewritten title.

**F7. Meta descriptions out of range.**

| Page | Now | Proposed (chars) |
|---|---|---|
| `/services/local-seo/` | 167 | Local SEO for service businesses: accurate business profiles, useful location pages and local search measurement. Panama City, Miami and nationwide. (148) |
| `/services/ai-search-optimization/` | 166 | Help search and AI answer systems understand your business through clear entities, useful content and technical access. ZINC’s AI search optimization service. (158) |
| `/blog/category/shopify/` | 161 | Shopify guides for product pages, search visibility, Merchant Center feeds and ecommerce events, connecting store changes with how customers buy. (145) |
| `/blog/category/social-ads/` | 161 | Set up and review Meta and TikTok campaigns, choose channels and check landing pages. Paid-social guides that tie creative tests to business outcomes. (150) |
| `/work/demand/` | 108 | Expand with the same facts. Name only the cases the lane actually lists. |
| `/authors/kirk-musick/` | 112 | Kirk Musick, MS, MBA, leads ZINC Digital. Read his articles on technical SEO, measurement, AI search and the decisions behind digital work. (139) |
| `/authors/jaymie-wilhoit/` | 121 | Jaymie Wilhoit is ZINC Digital’s Managing Partner. Read her guides to SEO, paid media, Shopify, Merchant Center and local search execution. (139) |

Page meta lives in `src/data/page-editorial.ts`. Category and author meta are built in `src/data/site.ts`.

**F8. AI search service wording (owner decision D8).** Repo research (3 Nov, US monthly volumes):

| Term | Volume |
|---|---|
| "ai seo" | 6,600 |
| "ai search optimization" | 1,300 |
| "ai seo services" | 1,000 |
| "ai search optimization agency" | 480 |

The page uses only "AI search optimization". If D8 is yes, add "AI SEO" as the secondary phrase:

- Title: "AI Search Optimization & AI SEO Services | ZINC" (47).
- Meta: "AI search optimization (AI SEO) that helps search and AI answer systems understand your business through clear entities, useful content and technical access." (157).
- One body mention.

Never use "GEO" (owner rule).

**F9. The `/services/` hub is thin: 82 words, H1 "Services".** Add one short paragraph per layer (Build · Demand · Intelligence) that names its services and links each one. Proposed H1: "Web Design, SEO, Paid Media and Business Intelligence Services". This is an owner design call (D9).

**F10. The blog index H1 is `<insights.py/>`.** It names nothing searchable. Keep the code-style mark as a decorative kicker and make the H1 "SEO, Ecommerce and Business Intelligence Articles" (D9). Source: `src/components/Page.astro`.

**F11. Two thin category hubs.** `/blog/category/apps/` has 1 post and 105 words; `/blog/category/local-seo/` has 1 post and 113 words. D10 options:

1. Add a 100–150-word intro, and posts from the gap queue.
2. Set `noindex, follow` until the hub has 3 or more posts.

Also, the TikTok post sits under "Social Ads (Meta)" because no TikTok category exists. The category label could become "Paid Social (Meta & TikTok)" (D10).

**F12. Author entity data.**

- Person schema on `/authors/*` has `jobTitle` but no `sameAs` or `knowsAbout`. Add `sameAs` (LinkedIn or other real profiles, supplied by the owner, D11) and `knowsAbout` (topics the person actually writes on).
- Title "Articles by X | ZINC" (30–33 chars) could carry the role: "Kirk Musick, MS, MBA · CEO | ZINC".
- Source: `src/data/authors.ts` and the author route in `src/data/site.ts`.

**F13. ProfessionalService schema** has no `sameAs`, `areaServed` or `telephone`. Add `sameAs` (owned social profiles) and `areaServed` (`US`, plus Miami and Panama City for the studios) from confirmed facts only. Source: `src/lib/public-seo.ts`.

**F14. Location identity wording varies.**

- Homepage and local-seo meta: "Based in Panama City, serving Miami".
- The first `ProfessionalService` entity: "ZINC Digital — Miami".
- An older review said "Miami HQ, Panama City satellite".
- The Codex SEO specialist prompt says "Panama City, Florida is the principal base; Miami is a priority growth market."

Confirm the owner's wording once (D12) and make page copy, schema order and the specialist prompt agree.

### P3

- `/work/` lane H1s "Build." "Demand." "Intelligence." could add a descriptor in the line below.
- `/about/` could link to `/services/` and `/work/` where the copy mentions the work.
- Home H1 "ZINC DIGITAL" is the approved hero (PR #79). Leave it.
- 19 pages share `og/home.png` (hubs, authors, legal). This is low value; skip it unless the owner wants per-hub social images.

---

## 4. The site's AI optimizers: review and recommended settings

Two separate systems on `origin/main` produce SEO advice.

### 4a. Weekly Claude review (Anthropic API, paid)

| Setting | Current (source) | Recommended |
|---|---|---|
| Trigger | Vercel cron `0 13,14 * * 1`, gated by `reviewSlot()` to Monday 08:00 CT. A manual run is also possible. (`vercel.json`, `src/pages/api/cron/seo-review.ts`) | **Keep `SEO_REVIEW_ENABLED` unset or `false`.** The owner's rule: no analysis a Claude Code session can do runs on API credit, and each credit-billed run needs the owner's explicit approval. A weekly automatic run breaks that rule by design. |
| Free alternative | `runSeoScan()` already measures the full evidence and scorecard **without calling Claude** (`src/lib/seo-review-runner.ts`) | Schedule the **scan** weekly instead, then have a Claude Code session (subscription) read the saved scan when analysis is wanted. |
| Billing | `ANTHROPIC_API_KEY` in Vercel. Every run bills the API allowance. | If the owner approves runs: use a **dedicated key** for this workload so usage is attributable, and keep the Console monthly limit at or below the allowance. |
| Model and effort | `claude-opus-5-5`, effort `high`, `max_tokens: 48000`, streaming, 480 s timeout, no fallback (`src/lib/seo-review.ts`) | If enabled: effort `medium` and `max_tokens` around 16k for the weekly digest. Keep Opus only for an owner-requested deep review. |
| Input size | Full evidence set every run (`reviewContext`) | Send only pages and metrics that changed since the last comparable scan, plus the scorecard delta. |
| Caching | The system prompt (`reviewInstructions(register)`) is resent each run with no `cache_control` | Mark the static system block for prompt caching. |
| Receipts | Usage, model, stop reason and message ID are stored for every run, failures included | Good. Review them monthly against the allowance. |

**Access gap.** This session could not confirm whether `SEO_REVIEW_ENABLED` is `true` in production or how many paid runs have happened:

- Vercel env listing returned 404 for `zinc-digital-web` under the connected team.
- The connected Supabase account shows only the OUABC project, not the ZINC site's database (`admin_cache` rows `seo_review:%` hold the receipts).

The owner can check **Backend → SEO / Analysis** for saved Claude reviews, or Vercel → Project → Settings → Environment Variables for `SEO_REVIEW_ENABLED`.

### 4b. On-demand Codex SEO specialist (ChatGPT subscription, no API key)

How it runs: `POST /api/admin/seo-fix` → `codex_jobs` → the runner on the Mac (`scripts/codex-runner/`), using `gpt-6.1-sol` at `medium` effort with a read-only sandbox and web search disabled (`src/lib/seo-agent.ts` v`2026-11-04.1`, `docs/codex-runner.md`). It returns a metadata patch, plus body and excerpt only for admin-origin posts, along with recommendations. Its safety design is good: untrusted-input framing, a revision check, a duplicate title/meta check, model verification, and no publishing.

| Issue | Evidence | Recommended change |
|---|---|---|
| Every response must cover all six categories (`content`, `internal links`, `schema`, `local`, `ai search`, `technical`) or it is rejected | `validateSeoProposal` | Allow `{"category":"local","problem":"not applicable","evidence":"…"}`. Forcing a "local" fix on a GA4 UTM post invites filler and city-stuffing. |
| No check on focus keywords across pages, which is how cannibalization starts | `metadataCatalog` sends only path, title and description | Add `focus_keyword` to `metadataCatalog`. Reject a proposal whose focus keyword matches another page's (same pattern as the duplicate title/meta check). Pre-load the F4 intent splits as owner revision instructions. |
| A focus keyword is chosen even without query data | `searchConsole.available:false` still produces a patch | When Search Console is unavailable, return `focus_keyword` as empty, or mark it "unverified". Never present it as demand-backed. |
| It can't propose H1 or schema patches, only recommend them | Patch fields are `meta_title`, `meta_description`, `focus_keyword`, `body`, `excerpt` | Fine for safety. Route F1, F12 and F13 through code PRs (this runbook), not the specialist. |
| Location fact differs from page copy | Prompt: "Panama City … principal base" | Align with D12 once decided, then bump `SEO_SPECIALIST_VERSION`. |
| Availability | The runner needs the Mac awake, online and with the drive mounted. Jobs expire after 30 min queued, 15 min running. | Fine. Note it in Backend help text. |
| Effort | `medium` | Keep. Metadata work doesn't need more. |

**Division of labour.**

| Work | Where it runs |
|---|---|
| Per-page metadata drafting | Codex specialist (subscription, on demand) |
| Weekly measurement | `runSeoScan` (free, deterministic) |
| Structural fixes in this brief | Codex PRs in the repo |
| Weekly Claude API review | Off, unless the owner approves a specific run |

---

## 5. Owner decisions (merged and renumbered)

| ID | Decision | Status vs. companion docs | Gates |
|---|---|---|---|
| D1 | Pillar model | **Resolved by the live site**: categories mirror services, and posts link their services and category. No decision needed. | — |
| D2 | Search Console guide's primary pillar (`seo` or `business-intelligence`) | Open. Live, it links both. | Task 4, that post |
| D3 | Add 3 direct "Guides" links on each service page (spec §6.2 change) | Open, lower priority now that service pages link their category hub | Task 4 |
| D4 | Approve the re-scoped gap queue (Task 7) | Open | Task 7 |
| D5 | Named authors for the 2 "Team ZINC" posts | Open | Task 6 |
| D6 | Group A: split intents (default) or merge `how-to-read-a-google-algorithm-update` and `google-core-update-review` (a merge needs a 301 and the owner's go) | Open, widened | Task 5 |
| D7 | Proof rule: a case is shown or linked only where the case lists that service. Confirm the case for ai-search-optimization (none today) and whether Las Vegas Safety & Supply counts as Shopify/Shopping proof. | Replaces the old D7 | Tasks 3–4 |
| D8 | Add "AI SEO" as secondary wording on the AI search service | New | Task 2 |
| D9 | H1 wording on service pages, `/services/` and `/blog/` | New | Task 3 |
| D10 | Thin categories (apps, local-seo): intro copy or `noindex, follow`; TikTok category label | New | Task 2 |
| D11 | Author `sameAs` profile URLs | New | Task 6 |
| D12 | One location statement (Panama City base / Miami) for copy, schema and the specialist prompt | New | Tasks 2, 6, 8 |
| D13 | Weekly Claude API review: stay off (recommended), or approve specific runs with the 4a settings | New | Task 8 |

---

## 6. Codex runbook

### Guardrails (every task)

- **Work from `origin/main`, not the local `main` checkout.** The local checkout is 76 commits behind and has uncommitted owner edits. Create a fresh worktree under `/Volumes/Satechi Hub/zinc-digital-web-worktrees/` from `origin/main`.
- Read **`origin/main` `AGENTS.md`** first. It overrides both companion docs. In particular:
  - OUABC never appears (`/work/once-upon-a-book-club/` is 410).
  - No placeholder markers in pages.
  - Article voice rules.
  - Node 24, no Docker.
  - Its review and merge rules.
- One branch and PR per task. Don't change slugs, redirects, routes or the post set.
- No invented numbers, no "GEO", no sales devices. All title, H1 and body copy is owner-approved before merge; put a before/after table in the PR body.
- No paid tools and no HYPD as a platform data source. Search Console comes only from the native API, through the repo's existing integration.

### Task 0: Orient (read-only)

1. Confirm where each kind of metadata is edited:
   - Pages: `src/data/page-editorial.ts`.
   - Services, categories, authors and locations: `src/data/site.ts`.
   - Posts: `src/data/article-*.ts` and `article-guides.json`.
   - Schema: `src/lib/public-seo.ts`.
2. Check whether admin-published Supabase snapshots override repository post metadata. See `docs/codex-runner.md` §"Published SEO date provenance" and the admin publish path. Edit through the mechanism that actually renders.
3. **Done when:** the PR body names the edit path for each content type.

### Task 1: Demand baseline (read-only)

1. Use the repo's Search Console integration to pull the last 16 months, `query × page`.
2. Map queries to pages, and mark queries that land on two or more posts (this checks F4).
3. If access fails, record the exact gap. Don't estimate.
4. **Done when:** `docs/content/demand-baseline-2026-11.md` exists. Raw CSVs go to `/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/`.

### Task 2: Metadata (F6, F7, F8 after D8, F11 after D10, F14 after D12)

1. Apply the approved titles and metas from §3.
2. Add an optional post meta-title field if one doesn't exist, so H1s stay as they are.
3. **Done when:**
   - Every title is ≤ 62 characters with " | ZINC".
   - Every meta is 120–160 characters.
   - All are still unique.
   - `npm run build` and the repo checks pass.
   - A re-crawl with `bin/extract.py` against the preview shows the new values.

### Task 3: Service-page H1s and depth (F1, F2, F9, F10; gated by D9 for copy)

1. Add the `h1` field (F1) and the hub H1s (F9, F10).
2. Draft the F2 sections for the 10 short service pages from owner-confirmed facts. Sections without confirmed facts render nothing.
3. **Done when:**
   - Each service H1 contains its service phrase.
   - No layout regressions at the repo's responsive sizes.
   - Spec §10 performance gates hold on 2 service templates.

### Task 4: Internal links (F3, F4 links, D3)

1. Post → case: one link per post, per the D7 rule. Verify the case's services first. Never link OUABC.
2. Add every ✗ link from the F4 table, two-way. Use descriptive anchors that state each page's distinct intent.
3. If D3 is approved: render 3 direct guide links on each service page, derived from the category data. Static HTML with zero client JS; an empty list renders nothing.
4. **Done when:**
   - 0 broken internal links (lychee on `dist/`).
   - Posts with a case link = all eligible posts.
   - The F4 gaps are closed.
   - A before/after link-count table is in the PR body.

### Task 5: Overlap separation (F4 group A, after D6)

1. Retitle `how-to-read-a-google-algorithm-update` and `google-core-update-review` to the split in F4.
2. Adjust each one's opening paragraph to match its intent. Flag body sections that contradict the split instead of rewriting them.
3. If the owner picks a merge instead: 301 one page into the other through `astro.config.mjs` redirects, update the sitemap and internal links, and verify the redirect on the deployed preview.

### Task 6: Author and organization entities (F5, F12, F13; needs D5, D11, D12)

1. Set the named authors and add `sameAs`/`knowsAbout` to Person, and `sameAs`/`areaServed` to ProfessionalService, using supplied values only.
2. **Done when:** the Schema Markup Validator and Rich Results Test pass on one post, one author page and the homepage. Save screenshots to the scratch folder.

### Task 7: Content gap queue (re-scoped; needs D4)

Coverage was judged from live titles and descriptions only; read the bodies before drafting.

| Companion item | Live coverage | Status |
|---|---|---|
| Shopify/GA4/ad-platform revenue mismatch | `ga4-ecommerce-event-validation` covers validation, not reconciliation | Open |
| Attribution windows for finance | — | Open |
| What an ecommerce reporting system must answer | `business-intelligence-basics` (partial) | Narrow the angle |
| Meta ads for ecommerce | `meta-ads-basics` (setup) | Go ecommerce-specific, or skip |
| TikTok ads for ecommerce | `tiktok-ads-basics` (setup) | Same |
| Creative fatigue from delivery data | — | Open |
| Google Search Ads for ecommerce | `paid-media-landing-page-checklist`, `ga4-utm-naming-conventions` (adjacent) | Open |
| Performance Max vs Standard Shopping | `google-shopping-ad-management-2026` (adjacent) | Open |
| Shopify migration without losing search | `wordpress-php-security-moving-to-astro` (different platform) | Open |
| Shopify app stack audit | — | Open |
| Custom app vs SaaS | Apps category has 1 post | Open (also fixes F11) |
| Redesign URL map | — | Open |

**Rule for every Intelligence draft:** no OUABC data, screenshots or story.

### Task 8: Optimizer settings (§4; needs D13)

1. Codex specialist (`src/lib/seo-agent.ts`, `src/pages/api/admin/seo-fix.ts`):
   - Allow "not applicable" categories.
   - Add `focus_keyword` to the catalog and reject duplicates.
   - Mark the keyword unverified when Search Console is absent.
   - Align the location line with D12.
   - Bump `SEO_SPECIALIST_VERSION` and update the tests in `tests/`.
2. Claude review: don't enable it. If the owner approves runs, apply the 4a settings (effort `medium`, about 16k `max_tokens`, delta-only evidence, cached system block, dedicated key). Otherwise, schedule the free `runSeoScan` in place of the paid review: a separate cron path, or the existing route calling the scan when `SEO_REVIEW_ENABLED` is not `true`.
3. **Done when:** `node --test` passes for the touched modules, and no new paid call path exists.

### Success measures (targets are set after Task 1; no invented numbers)

- Search Console clicks and impressions for `/services/*` and `/blog/*`, by service.
- Queries that land on more than one post, trending to 0.
- Inquiries by `/contact/?service=<slug>`.
- Claude API usage receipts at or below the owner's allowance.

---

## Appendix: per-page measurements (live, 5 Nov 2026 ~10:00 CT)

Flags: `title long` > 62 chars · `meta long` > 160 · `meta short` < 120 · `thin` service page < 400 words in `<main>` · `thin hub` · `no direct post links` (service page) · `no case link` (post) · `org byline` (post).

| Path | Title chars | Meta chars | H1 | Words in main | Internal links | Flags |
|---|---|---|---|---|---|---|
| `/` | 44 | 149 | ZINC DIGITAL | 638 | 27 | — |
| `/services/` | 56 | 149 | Services | 82 | 12 | thin hub |
| `/services/shopify/` | 36 | 157 | Shopify Ecommerce | 304 | 7 | thin, no direct post links |
| `/services/web-design/` | 38 | 152 | Web Design | 284 | 8 | thin, no direct post links |
| `/services/apps/` | 43 | 144 | Apps | 292 | 8 | thin, no direct post links |
| `/services/seo/` | 49 | 155 | SEO | 273 | 8 | thin, no direct post links |
| `/services/local-seo/` | 50 | 167 | Local SEO | 257 | 8 | meta long, thin, no direct post links |
| `/services/ai-search-optimization/` | 29 | 166 | AI Search Optimization | 258 | 7 | meta long, thin, no direct post links |
| `/services/google-search-ads/` | 35 | 152 | Google Search Ads | 278 | 8 | thin, no direct post links |
| `/services/shopping-ads/` | 51 | 154 | Shopping / Merchant Center Ads | 266 | 7 | thin, no direct post links |
| `/services/social-ads/` | 45 | 149 | Social Ads (Meta) | 269 | 8 | thin, no direct post links |
| `/services/tiktok-ads/` | 36 | 156 | TikTok Ads | 273 | 8 | thin |
| `/services/business-intelligence/` | 50 | 154 | Your next move is in your data. | 1393 | 3 | no direct post links |
| `/work/` | 47 | 146 | Selectedwork. | 209 | 21 | — |
| `/work/build/` | 49 | 139 | Build. | 287 | 18 | — |
| `/work/demand/` | 34 | 108 | Demand. | 151 | 10 | meta short |
| `/work/intelligence/` | 45 | 132 | Intelligence. | 95 | 6 | — |
| `/work/carla-funk-photography/` | 56 | 147 | Carla Funk Photography. | 365 | 9 | — |
| `/work/ballad-health/` | 37 | 147 | Ballad Health. | 305 | 5 | — |
| `/work/meade-tractor/` | 43 | 154 | Meade Tractor. | 265 | 6 | — |
| `/work/general-shale/` | 46 | 151 | General Shale. | 296 | 5 | — |
| `/work/us-oil-solutions/` | 52 | 144 | U.S. Oil Solutions. | 1085 | 23 | — |
| `/work/las-vegas-safety/` | 51 | 150 | Las Vegas Safety & Supply. | 807 | 28 | — |
| `/work/summit-marine-development/` | 56 | 146 | Summit Marine Development. | 929 | 20 | — |
| `/work/zinc-fusion-v16/` | 43 | 145 | ZINC Fusion v16. | 506 | 10 | — |
| `/work/the-lampstand-va/` | 50 | 143 | The Lampstand VA. | 545 | 16 | — |
| `/work/straight-street-ministries/` | 60 | 150 | Straight Street Ministries. | 398 | 16 | — |
| `/work/bear-claw-usa/` | 45 | 157 | Bear Claw USA. | 866 | 22 | — |
| `/work/felon-motorwerk/` | 56 | 150 | Felon Motorwerk. | 892 | 61 | — |
| `/work/miami-tactical/` | 45 | 157 | Miami Tactical. | 385 | 5 | — |
| `/work/fraim-cawley-company/` | 47 | 155 | Fraim, Cawley & Company. | 238 | 6 | — |
| `/work/smoky-mountain-survival/` | 47 | 147 | Smoky Mountain Survival. | 220 | 6 | — |
| `/work/andrew-neese/` | 48 | 158 | Andrew Neese. | 227 | 6 | — |
| `/work/porsche-roanoke/` | 56 | 139 | Porsche. Roanoke. | 229 | 6 | — |
| `/about/` | 37 | 144 | The people behind the work | 226 | 3 | — |
| `/contact/` | 41 | 144 | Request a proposal | 285 | 3 | — |
| `/locations/miami/` | 59 | 155 | AI Search & Business Intelligence in Miami | 397 | 12 | — |
| `/locations/panama-city/` | 65 | 158 | AI Search & Business Intelligence in Panama City | 407 | 11 | title long |
| `/blog/` | 54 | 147 | <insights.py/> | 1906 | 56 | — |
| `/blog/category/shopify/` | 54 | 161 | Shopify Ecommerce articles | 551 | 23 | meta long |
| `/blog/category/web-design/` | 47 | 155 | Web Design articles | 524 | 22 | — |
| `/blog/category/apps/` | 41 | 145 | Apps articles | 105 | 13 | thin hub |
| `/blog/category/seo/` | 40 | 152 | SEO articles | 1272 | 40 | — |
| `/blog/category/local-seo/` | 46 | 136 | Local SEO articles | 113 | 13 | thin hub |
| `/blog/category/ai-search-optimization/` | 59 | 159 | AI Search Optimization articles | 514 | 22 | — |
| `/blog/category/google-search-ads/` | 54 | 147 | Google Search Ads articles | 342 | 17 | — |
| `/blog/category/shopping-ads/` | 67 | 153 | Shopping / Merchant Center Ads articles | 409 | 20 | title long |
| `/blog/category/social-ads/` | 54 | 161 | Social Ads (Meta) articles | 300 | 16 | meta long |
| `/blog/category/business-intelligence/` | 58 | 158 | Business Intelligence articles | 766 | 29 | — |
| `/blog/what-ai-discovery-changes-editorial-plan/` | 58 | 160 | What AI discovery changes about your editorial plan | 2325 | 16 | no case link |
| `/blog/what-can-you-afford-to-spend-on-an-order/` | 48 | 154 | What can you afford to spend on an order? | 2349 | 19 | no case link |
| `/blog/build-a-content-hub-people-can-use/` | 50 | 130 | Build a content hub people can actually use | 2856 | 22 | no case link |
| `/blog/wordpress-php-security-moving-to-astro/` | 56 | 147 | WordPress security—and why we moved ZINC to Astro | 1531 | 15 | no case link |
| `/blog/google-core-update-review/` | 51 | 153 | Google Core Update Review: Find What Changed | 1179 | 16 | no case link |
| `/blog/holiday-ecommerce-preparation/` | 56 | 159 | Holiday Ecommerce Preparation: Test Before Launch | 1034 | 16 | no case link |
| `/blog/ecommerce-seasonal-campaign-plan/` | 51 | 155 | A Seasonal Ecommerce Campaign Plan That Fits | 1190 | 19 | no case link |
| `/blog/research-consensus-report/` | 52 | 153 | Build a Research Consensus Report You Can Use | 1194 | 15 | no case link |
| `/blog/ai-research-workflow/` | 48 | 160 | AI Research Workflow: Find, Check, Decide | 1190 | 15 | no case link |
| `/blog/ai-competitor-research-prompts/` | 57 | 157 | AI Competitor Research: Prompts That Require Proof | 1014 | 15 | no case link |
| `/blog/ga4-ecommerce-event-validation/` | 54 | 151 | GA4 Ecommerce Event Validation: Trace the Order | 1240 | 15 | no case link |
| `/blog/search-console-canonical-indexing-debugging/` | 62 | 147 | Search Console Canonical Debugging: Follow the Evidence | 1141 | 17 | no case link |
| `/blog/merchant-center-feed-diagnostics/` | 63 | 155 | Merchant Center Feed Diagnostics: Fix the Product Record | 1109 | 16 | title long, no case link |
| `/blog/content-briefs-search-intent-internal-links/` | 65 | 160 | Content Briefs: Search Intent, Evidence and Internal Links | 1534 | 20 | title long, no case link |
| `/blog/ga4-utm-naming-conventions/` | 64 | 153 | GA4 UTM Naming Conventions: Build a Clean Campaign Record | 1137 | 15 | title long, no case link |
| `/blog/search-console-query-page-review/` | 62 | 154 | Search Console Query and Page Review: A Working Routine | 1004 | 17 | no case link |
| `/blog/shopify-product-page-seo/` | 62 | 158 | Shopify Product Page SEO: A Practical Editing Checklist | 1239 | 15 | no case link |
| `/blog/google-shopping-variant-feed-checklist/` | 63 | 153 | Google Shopping Variant Feed Checklist: Test Each Option | 984 | 16 | title long, no case link |
| `/blog/internal-link-audit/` | 58 | 156 | Internal Link Audit: Find the Pages Your Site Hides | 1339 | 17 | no case link |
| `/blog/content-refresh-review/` | 62 | 155 | Content Refresh Review: Update the Answer, Not the Date | 1002 | 16 | no case link |
| `/blog/service-page-content-checklist/` | 59 | 154 | Service Page Content Checklist: Make the Offer Clear | 1035 | 17 | no case link |
| `/blog/paid-media-landing-page-checklist/` | 61 | 152 | Paid Media Landing Page Checklist: Test the Whole Path | 993 | 18 | no case link |
| `/blog/merchant-center-basics/` | 61 | 149 | Merchant Center Basics: Set Up a Reliable Product Feed | 1087 | 17 | no case link |
| `/blog/tiktok-ads-basics/` | 61 | 148 | TikTok Ads Basics: Build and Check Your First Campaign | 1486 | 19 | no case link |
| `/blog/meta-ads-basics/` | 60 | 150 | Meta Ads Basics: Match the Goal, Creative and Outcome | 1533 | 17 | no case link |
| `/blog/ai-search-content-strategy/` | 62 | 159 | AI Search Content Strategy: Build Answers With Evidence | 1060 | 21 | no case link |
| `/blog/business-intelligence-basics/` | 62 | 157 | Business Intelligence Basics: From Records to Decisions | 1104 | 15 | no case link |
| `/blog/ai-search-results-and-generative-search-optimization/` | 66 | 152 | AI Search Visibility: A Practical Guide for Business Owners | 1787 | 18 | title long, no case link |
| `/blog/google-shopping-ad-management-2026/` | 62 | 154 | Google Shopping Management: Fix the Feed Before Scaling | 1173 | 16 | no case link |
| `/blog/shopify-seo-launch-checklist/` | 35 | 155 | Shopify SEO Launch Checklist | 1196 | 23 | no case link |
| `/blog/four-pillars-of-seo-operators-view/` | 50 | 156 | The Four Pillars of SEO: A Practical Review | 1132 | 26 | no case link |
| `/blog/technical-seo-ten-fixes-that-move-rankings/` | 59 | 153 | Technical SEO: Ten Checks Before You Expand the Site | 1090 | 15 | no case link |
| `/blog/local-seo-2026-operators-manual/` | 58 | 155 | Local SEO: Build an Accurate, Useful Local Presence | 1252 | 17 | no case link |
| `/blog/content-marketing-plan-that-produces-pipeline/` | 50 | 153 | A Content Marketing Plan Connected to Sales | 1608 | 17 | no case link, org byline |
| `/blog/when-web-design-trends-actually-matter/` | 45 | 157 | When a Web Design Trend Is Worth Using | 1065 | 16 | no case link, org byline |
| `/blog/shopify-seo-problems-real-fixes/` | 55 | 156 | Shopify SEO Problems: Diagnose Before You Change | 1102 | 18 | no case link |
| `/blog/seven-digital-channels-which-to-skip/` | 55 | 155 | Which Digital Marketing Channels Should You Use? | 1022 | 29 | no case link |
| `/blog/three-years-of-algorithm-updates-what-moved-rankings/` | 62 | 156 | Google Search Updates, 2023–2026: What the Record Shows | 1355 | 17 | no case link |
| `/blog/shopify-google-merchant-center-checklist/` | 69 | 154 | Connect Shopify and Merchant Center Without Product Mismatch | 1342 | 17 | title long, no case link |
| `/blog/marketing-budgets-during-economic-stress/` | 51 | 151 | Review a Marketing Budget When Cash Is Tight | 1150 | 18 | no case link |
| `/blog/how-to-read-a-google-algorithm-update/` | 48 | 156 | How to Investigate a Google Search Update | 1100 | 18 | no case link |
| `/blog/google-search-console-the-operators-guide/` | 68 | 156 | Google Search Console: A Practical Review for Business Owner | 1637 | 17 | title long, no case link |
| `/blog/how-long-seo-actually-takes/` | 62 | 159 | How Long Does SEO Take? Track the Work and the Evidence | 1028 | 16 | no case link |
| `/blog/seo-in-2026-what-changed-what-to-ignore/` | 48 | 158 | SEO in 2026: What Deserves Your Attention | 1108 | 17 | no case link |
| `/blog/duplicate-content-isnt-a-penalty-but-its-a-tax/` | 64 | 156 | Duplicate Content: Choose the Right Canonical or Redirect | 1301 | 16 | title long, no case link |
| `/authors/kirk-musick/` | 30 | 112 | Kirk Musick, MS, MBA | 780 | 22 | meta short |
| `/authors/jaymie-wilhoit/` | 33 | 121 | Jaymie Wilhoit | 706 | 20 | — |
| `/authors/wendy-funnell/` | 32 | 156 | Wendy Funnell | 228 | 7 | — |
| `/privacy/` | 21 | 94 | Privacy Policy | 1552 | 2 | — |
| `/terms/` | 25 | 132 | Terms & Conditions | 801 | 3 | — |
