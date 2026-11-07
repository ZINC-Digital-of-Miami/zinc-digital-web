# Codex handoff: ZINC site SEO, content pillars and Claude review refinement

**One report.** This is the only document Codex needs. It merges three sources:
- the on-page SEO runbook (`2026-11-05-seo-onpage-codex-brief.md`)
- the content pillar handoff (`2026-11-05-content-pillar-handoff.md`)
- the Codex prompt drafted by the on-page SEO session

Those three stay in PR #84 as supporting detail. Where they differ from this report, this report wins.

**Prepared:** 5 November 2026 CT.

**Measured:**
- The live site at about 10:00 CT on 5 Nov: all 99 sitemap URLs, deployed from `origin/main` `b314bdd` (#82).
- A local build of the same commit: 101 HTML pages, 5,648 links.
- `origin/main` has since moved to `b77cb57` (#85, "Clarify the blog planning guide title and wording"). Re-measure before acting on any title or link count.

**Not measured:** search demand, rankings and Search Console queries. The only volumes in the repo are in `docs/editorial/research/2026-11-03-ai-search-keyword-volume.json`.

---

## 0. Your job

You are working in the ZINC Digital website repository. The live site is https://www.zincdigital.co, deployed from `origin/main` on Vercel. Paths:
- Main checkout: `/Volumes/Satechi Hub/zinc-digital-web`. Don't use it as a source: it is far behind `origin/main` and still holds the 25 September mockup.
- Worktrees: `/Volumes/Satechi Hub/zinc-digital-web-worktrees/`.

Deliver every workstream in §7 through reviewed pull requests, in the order given. Some workstreams are gated on owner decisions.
1. Send the owner the open decisions (§6) once, in one message, at the start.
2. Start the ungated workstreams right away.
3. Build each gated workstream as soon as its decision arrives.
4. Do only what this report describes.

---

## 1. Read first, in this order

1. **`AGENTS.md` on `origin/main`.** It overrides this report, including its git, review, merge and release rules. Start every branch from a fresh `origin/main`. Node 24: this Mac's default `node` is 26, so put `/opt/homebrew/opt/node@24/bin` first on `PATH`.
2. **`docs/editorial/schedule.md`.** The editorial register: cadence (Mon/Wed/Fri 09:00 CT), author lanes, editorial standard and release rules.
3. **`docs/editorial/research/2026-11-03-content-marketing-pillars.md`.** The owner's pillar model: **a pillar is a service-aligned blog category** (`/blog/category/<service>/`). Reading guides sit inside categories and are not pillars.
4. **PR #83** (`codex/seo-article-intent-map`, open). It records the distinct intents of the search-update, Merchant Center, Shopping and Search Console articles. Build on it; don't duplicate it.
5. **Crawl evidence** in `/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/`:
   - `html/`: the 99 live pages
   - `pages.json`: extracted fields
   - `appendix.md`: the per-page table
   - `bin/extract.py`: re-runs the extraction
   - `bin/appendix.py`: rebuilds the table

   Re-crawl the preview or production site to verify each PR.

Ignore these superseded files in the main checkout root: `content-strategy-codex-brief-2026-11-05.md` and `internal-linking-plan-2026-11-05.md`. Both were built from the stale checkout.

---

## 2. Hard rules (owner and repository)

**Content and claims**
- **OUABC is removed from the public site.** `/work/once-upon-a-book-club/` returns 410 by design. Add no OUABC case, link, logo, copy, caption, image or data anywhere, including article drafts and BI examples.
- **No invented numbers, results, testimonials, profile URLs or author assignments.** Content waiting on the owner renders nothing. No placeholder markers such as `[RECEIPT: …]` on pages.
- **Voice:**
  - Kirk/ZINC first-person articles use `kirk-voice`.
  - Client bylines use `zinc-author-voice`.
  - General site copy follows the approved Design voice, with no cursing and no sales devices.
  - Never write "GEO".
  - "AI search optimization" is the owner-approved service phrase (3 Nov; `src/data/seo-review-research.ts`).
- **Proof rule:** a page may show or link a case study only when that case's own `services` list includes the service in question.
- **No legacy (owner rule):** do not read, extend, alias or fall back to legacy tables, files, endpoints or jobs. New work never depends on them.

**URLs and routes**
- Keep every public URL, slug, redirect and route unless an owner decision changes it.
- A merge or consolidation needs a 301 and the owner's explicit go.

**Engineering**
- Static-first: zero added client JS for every template change.
- Performance gates per `AGENTS.md`. WCAG 2.2 AA.
- Run checks with Node 24 locally (`npm test`, `npm run check`, `npm run build`, plus the verify scripts `AGENTS.md` requires). No Docker.

**Data and spending**
- No paid tools or services.
- Search Console and GA4 data come only from the native APIs, through the repo's existing integration (`src/lib/google.ts`, `src/lib/seo-review-google.ts`).
- HYPD is research only, never a platform data source.
- Never print or commit secrets.
- Never change Vercel environment variables or production settings. Report what the owner needs to set.

**Storage and times**
- Scratch, worktrees and raw data stay under `/Volumes/Satechi Hub/`. Raw CSVs go to the evidence folder above.
- Times shown to the owner are America/Chicago, labelled CT.

**Copy approval:** every title, H1, meta description or body sentence you write is a draft for owner approval. Put a before/after table in the PR body.

**Reviews (per `AGENTS.md`)**
- Review each PR with a fresh agent, on its final head, using specific instructions that name the change scope, owner requirements, known risks and behaviours to verify.
- **Never request Codex or Copilot reviews.**
- Fix only confirmed P0/P1 findings, in one batch, then re-review once.
- Answer every other finding on its thread.
- At most two review rounds per PR. Anything still open goes to the owner.

---

## 3. Work already in flight: don't collide

| Item | State | Rule |
|---|---|---|
| PR #83 `codex/seo-article-intent-map` | Open | Let it land first. WS9 and WS10 start after it merges. |
| PR #84 `docs/content-strategy-codex-brief` | Open; docs only | Holds the two supporting docs. This report itself stays local and is not in the repo. |
| PR #86 `codex/blog-structure-semantics` (worktree `content-hub-plain-language`) | Open since 10:32 CT; committed, nothing left uncommitted | Leave these files alone until #86 merges (WS10 edits `schedule.md`, so it waits):<br>`docs/editorial/schedule.md`<br>`docs/editorial/articles/build-a-content-hub-people-can-use.md`<br>`public/downloads/content-hub-*.pdf`<br>`public/media/content-hub/*`<br>`scripts/build-content-hub-resources.py`<br>`src/data/article-features.ts`<br>`.kiro/specs/create-a-complete-implementation-spec/tasks.md` |
| Worktree `claude-review-refinement` (branch `codex/claude-review-refinement`, at `b314bdd`) | Uncommitted WS1 drafts:<br>`src/data/seo-review-baseline.ts` (new)<br>`src/lib/seo-review-structure.ts` (new)<br>`src/lib/seo-review-signals.ts` (edited) | Continue WS1 there. Rebase onto current `origin/main` first. |

---

## 4. Current state (live, 5 Nov)

### 4a. Already passing: don't touch

| Check | Result |
|---|---|
| HTTP 200 / self-canonical / `index, follow` | 99/99 (the 404 page is `noindex`) |
| Unique title, unique meta description | 99/99 each |
| One H1, no skipped heading levels | 99/99 |
| JSON-LD | Parses on 99/99:<br>• Organization, ProfessionalService, WebSite, WebPage and BreadcrumbList on all pages<br>• Service + FAQPage on 11 service pages<br>• Article on 45 posts<br>• ProfilePage on authors<br>• CollectionPage on hubs (plus ItemList on categories) |
| Images | 100% have `width`/`height`. The empty `alt` on decorative thumbnails and author photos is correct. |
| Weak anchors in `<main>` | 0 |
| Sitemap, robots.txt | 99 URLs with `lastmod` on posts. `/admin/` and `/api/` are disallowed. |
| Internal links | Done on all pages:<br>• service ↔ category on all 11 services<br>• post → primary service, category and `/contact/?service=<pillar>` on 45/45 posts<br>• no orphans; max click depth 3<br>• no bare `/services/` anchors |

### 4b. Pillar coverage

Source: the article links on each `/blog/category/*` page. `categoryPosts()` lists a post in every category named in its `related` list, so one post appears in several pillars.

| Pillar (category) | Posts listed | Planned in register | State |
|---|---|---|---|
| `seo` | 28 of 45 | 05, 08, 11 | Saturated |
| `business-intelligence` | 17 | 06, 12, 16 | **Diluted.** Most members are mainly about something else (e.g. `meta-ads-basics`, `tiktok-ads-basics`, `google-core-update-review`). |
| `shopify` | 11 | 14 | Healthy |
| `ai-search-optimization` | 10 | 08, 10 | Healthy |
| `web-design` | 10 | 13 | Diluted by SEO posts |
| `shopping-ads` | 8 | 07, 09 | Healthy |
| `google-search-ads` | 5 | — | Thin; no post about running Search campaigns |
| `social-ads` | 4 | — | Thin. TikTok has no category of its own. |
| `apps` | 1 | 18 | **Thin hub** (105 words); only post is `business-intelligence-basics` |
| `local-seo` | 1 | 17 | **Thin hub** (113 words) |

### 4c. Service → case mapping (`src/data/site.ts`)

| Service | Case |
|---|---|
| `seo` | Ballad Health |
| `local-seo` | Meade Tractor |
| `google-search-ads`, `social-ads` | Summit Marine Development |
| `web-design`, `apps` | U.S. Oil Solutions |
| `business-intelligence` | `zinc-fusion-v16`, which lists `apps` and `business-intelligence`. **It is never rendered:** `BusinessIntelligence.astro` doesn't output `serviceCase`. |
| `ai-search-optimization`, `shopping-ads`, `tiktok-ads`, `shopify` | None |

---

## 5. Findings

### P1: commercial pages and links

**F1. Service-page H1s are bare labels.** The H1 is the strongest on-page heading signal and is what answer systems quote. Proposed H1s (wording is D9):

| Page | Current H1 | Proposed H1 |
|---|---|---|
| `/services/shopify/` | Shopify Ecommerce | Shopify Ecommerce Development |
| `/services/web-design/` | Web Design | Custom Web Design and Development |
| `/services/apps/` | Apps | Business App and Workflow Development |
| `/services/seo/` | SEO | SEO Services |
| `/services/local-seo/` | Local SEO | Local SEO Services |
| `/services/ai-search-optimization/` | AI Search Optimization | AI Search Optimization Services |
| `/services/google-search-ads/` | Google Search Ads | Google Search Ads Management |
| `/services/shopping-ads/` | Shopping / Merchant Center Ads | Google Shopping and Merchant Center Management |
| `/services/social-ads/` | Social Ads (Meta) | Meta Ads and Paid Social Management |
| `/services/tiktok-ads/` | TikTok Ads | TikTok Ads Management |
| `/services/business-intelligence/` | Your next move is in your data. | Business Intelligence Platforms and Reporting. Keep the current line beneath it. |

**F2. Service pages are thin.** They run 257–304 words in `<main>`; BI runs 1,393. Each is shorter than every post that links to it. Build these sections from owner-confirmed facts only, and let empty sections render nothing. Set no word target.
1. What's included
2. Who it's for (ecommerce-first, established brands)
3. How an engagement runs (who does what on each side)
4. Proof (proof rule)
5. Guides (D3)
6. FAQ (extend the existing one)

**F3. No post links to a case study (0/45).** One in-body link per post, only to a case whose `services` include the post's primary service. Verify in `src/data/site.ts` and on the case page first. Never link OUABC.

| Post topic | Candidate case |
|---|---|
| SEO | `/work/ballad-health/`, `/work/general-shale/` (verify its services) |
| Local SEO | `/work/meade-tractor/` |
| Google Search Ads, Meta | `/work/summit-marine-development/` |
| Web design, Astro migration | `/work/us-oil-solutions/`, `/work/bear-claw-usa/` (verify) |
| Ecommerce | `/work/las-vegas-safety/`, only if it lists Shopify or Shopping (D7) |
| BI | `/work/zinc-fusion-v16/` if D16 = yes |
| AI search | None eligible; leave without one |

**F4. Overlapping posts.** Give each post one distinct intent, retitle where needed and add the missing two-way links (✗ = missing).

**Fix L1 first, rebuild and re-measure.** Most ✗ gaps share L1's root cause. Reconcile with PR #83.

| Group | Posts | Overlap | Fix |
|---|---|---|---|
| A. Google updates | `how-to-read-a-google-algorithm-update` · `google-core-update-review` · `three-years-of-algorithm-updates-what-moved-rankings` · `seo-in-2026-what-changed-what-to-ignore` | The first two target the same task. core-update-review → how-to-read ✗. | **how-to-read** = the first week while an update rolls out (proposed title "Google Search Update Response: The First Week").<br>**core-update-review** = the before/after Search Console comparison after rollout ("Core Update Review: Compare Search Console Data").<br>Link both ways. A merge is D6. |
| B. AI search | `ai-search-results-and-generative-search-optimization` · `ai-search-content-strategy` · `what-ai-discovery-changes-editorial-plan` | ai-search-results → content-strategy ✗; content-strategy → editorial-plan ✗ | **Overview** = sub-hub linking both.<br>**content-strategy** = what to publish and how to evidence it.<br>**editorial-plan** = calendar, maintenance and measurement. |
| C. Seasonal ecommerce | `holiday-ecommerce-preparation` · `ecommerce-seasonal-campaign-plan` | No link either way ✗✗ | **holiday** = pre-launch QA.<br>**seasonal** = planning calendar.<br>Link both ways. |
| D. Merchant Center / Shopping | `merchant-center-basics` · `merchant-center-feed-diagnostics` · `google-shopping-variant-feed-checklist` · `shopify-google-merchant-center-checklist` · `google-shopping-ad-management-2026` | basics → variant ✗; diagnostics → basics ✗; variant → basics ✗ | basics = the setup sub-hub linking all four; each spoke links back |
| E. Shopify SEO | launch checklist · problems · product page SEO | Already cross-linked | Keep |
| F. Search Console | guide · query/page review · canonical debugging | Already cross-linked | Keep |

**F5. Two posts have an Organization byline** ("Team ZINC", from `src/data/article-guides.json`): `content-marketing-plan-that-produces-pipeline` and `when-web-design-trends-actually-matter`. The owner names the author (D5).

**L1. Root cause of thin post-to-post links.** In `src/data/blog-strategy.ts`, `readingPath()` returns `available.slice(0, 3)` for every non-hub member: the hub plus the guide's first two members. The effect:
- 18 of 45 posts get exactly one in-page link from another post.
- `four-pillars-of-seo-operators-view` gets 18, `ga4-ecommerce-event-validation` 17, and `technical-seo-ten-fixes-that-move-rankings` and `wordpress-php-security-moving-to-astro` 13 each.

Fix: a non-hub member returns the hub plus the previous and next member in editorial order, wrapping at the ends.

**L2. The "Channels & measurement" guide (14 members) mixes topics:** paid social, GA4, research, budgets and web design. `tiktok-ads-basics` reads next into the seven-channels, content-marketing-plan and GA4 posts, not `meta-ads-basics`. With L1 in place, member order decides these links. Reorder into topic runs or split the guide (D15).

**L3. Case pages link to 0 posts and 0 categories.** Add "Read our {Service} articles" links to the category of each service in the case's `services` list that has articles, the same pattern as service pages.

**L4. The BI case is mapped but not rendered** (see §4c). This depends on D16.

**D14. Pillar dilution.** Category pages list every post that names the service anywhere in `related`. Recommended: list primary-pillar posts first (`proposalPillar(related)`, `src/lib/proposal-pillar.ts`), then the rest under a quieter "Related from other topics" heading. No URL or `related` changes.

### P2: metadata, hubs, entities

**F6. Titles over 62 characters, including " | ZINC".** Change the meta title only and keep the H1. Add an optional post meta-title field if none exists.

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

Twelve more posts sit at 61–62 characters. Leave them unless Search Console shows a rewritten title. #85 may have changed a blog title, so re-measure first.

**F7. Meta descriptions outside 120–160 characters.**

| Page | Now | Proposed (chars) |
|---|---|---|
| `/services/local-seo/` | 167 | Local SEO for service businesses: accurate business profiles, useful location pages and local search measurement. Panama City, Miami and nationwide. (148) |
| `/services/ai-search-optimization/` | 166 | Help search and AI answer systems understand your business through clear entities, useful content and technical access. ZINC’s AI search optimization service. (158) |
| `/blog/category/shopify/` | 161 | Shopify guides for product pages, search visibility, Merchant Center feeds and ecommerce events, connecting store changes with how customers buy. (145) |
| `/blog/category/social-ads/` | 161 | Set up and review Meta and TikTok campaigns, choose channels and check landing pages. Paid-social guides that tie creative tests to business outcomes. (150) |
| `/work/demand/` | 108 | Expand with the same facts; name only cases the lane lists |
| `/authors/kirk-musick/` | 112 | Kirk Musick, MS, MBA, leads ZINC Digital. Read his articles on technical SEO, measurement, AI search and the decisions behind digital work. (139) |
| `/authors/jaymie-wilhoit/` | 121 | Jaymie Wilhoit is ZINC Digital’s Managing Partner. Read her guides to SEO, paid media, Shopify, Merchant Center and local search execution. (139) |

Where each page's meta is edited:
- Pages: `src/data/page-editorial.ts`.
- Categories and authors: `src/data/site.ts`.
- Posts: `src/data/article-*.ts` and `article-guides.json`.

First confirm whether admin-published Supabase snapshots override repository metadata, and edit through the path that actually renders.

**F8. AI search wording: no change** (owner-approved phrase; D8 withdrawn).

**F9. The `/services/` hub is thin** (82 words, H1 "Services"). Add one short paragraph per layer (Build · Demand · Intelligence), naming and linking its services. Proposed H1: "Web Design, SEO, Paid Media and Business Intelligence Services" (D9).

**F10. The `/blog/` H1 is `<insights.py/>`.** Keep the mark as a decorative kicker. Proposed H1: "SEO, Ecommerce and Business Intelligence Articles" (D9). Source: `src/components/Page.astro`.

**F11. Thin category hubs** (`apps`, `local-seo`): a 100–150-word intro, or `noindex, follow` until there are 3 posts. TikTok category label: "Paid Social (Meta & TikTok)"? (D10)

**F12. Author entities.** Person schema has `jobTitle` only. Add `sameAs` (owner-supplied, D11) and `knowsAbout` (topics actually written). Optional title: "Kirk Musick, MS, MBA · CEO | ZINC". Sources: `src/data/authors.ts`, `src/data/site.ts`.

**F13. ProfessionalService schema** has no `sameAs`, `areaServed` or `telephone`. Add confirmed values only (`src/lib/public-seo.ts`).

**F14. Location wording varies** across the homepage, local-seo meta, schema order and the specialist prompt. One statement is needed (D12). Until then: "Panama City principal base; Miami priority growth market".

### P3 (only if time allows)

- `/about/` → `/services/` and `/work/` links.
- `/work/` lane H1 descriptors.
- **L5:** cards link each post three times ("Read the full article" ×129); make the title the only crawlable link.
- **L6:** the public footer links `/admin/` on every page (`ADMIN_PATH`), which `robots.txt` disallows (D17).
- 19 pages share `og/home.png`; skip unless the owner asks.

---

## 6. Owner decisions: send once, with your recommendation

| ID | Decision | Recommendation | Gates |
|---|---|---|---|
| D2 | Primary service for `google-search-console-the-operators-guide` (`seo` or `business-intelligence`) | `seo` | WS4 |
| D3 | Show 3 direct guide links on each service page (spec §6.2 change) | Yes | WS4 |
| D4 | Approve the queue extension (§8) | Approve, after the WS4 demand check | WS10 |
| D5 | Named Person authors for the two "Team ZINC" posts | Owner names them | WS8 |
| D6 | Group A: separate intents or merge with a 301 | Separate | WS9 |
| D7 | Confirm the proof rule; does Las Vegas Safety & Supply count for Shopify/Shopping? | Confirm the rule | WS7 |
| D9 | H1 wording for 11 service pages, `/services/` and `/blog/` (F1, F9, F10) | As proposed | WS6 |
| D10 | Thin hubs: intro copy or `noindex, follow`; TikTok category label | Intro copy | WS5 |
| D11 | Real `sameAs` URLs for Kirk, Jaymie, Wendy and the company | Owner supplies | WS8 |
| D12 | One location statement for copy, schema and assistant instructions | Owner states | WS1, WS3, WS5, WS8 |
| D14 | Category ordering: primary-pillar first, or trim `related` | Primary-pillar first | WS9 |
| D15 | Reorder or split the "Channels & measurement" guide | Reorder | WS2 |
| D16 | Does ZINC Fusion v16 count as proof for BI? | Owner decides | WS7 |
| D17 | Remove the public footer `/admin/` link | Yes | WS2 |

**Settled; don't ask again:**
- D1: the pillar model is live.
- D8: withdrawn.
- D13: the weekly Claude review stays on, per WS1 (owner, 5 Nov).

---

## 7. Workstreams

One branch and one PR per workstream, each from fresh `origin/main`.

- **Can run in parallel:** WS1, WS2, WS3, and the read-only part of WS4.
- **Must run in sequence:**
  - WS2 and WS6 both touch `src/components/Page.astro`. Merge WS2 first.
  - WS5 and WS6 both touch `src/data/site.ts`. Merge them in turn, rebasing between.
  - WS9 and WS10 wait for PR #83. WS10 also waits for PR #86, which edits `schedule.md`.

### WS1: Claude weekly review refinement (ungated; aim to merge before Monday 9 Nov 08:00 CT)

**Owner direction, 5 Nov:**
- "claude reviews stay on, and get full refinement based off all these reports"
- "all this get baked into claudes understanding and instructions"
- "open up the cap, but keep the token burn low"
- "do not alllow overlap with any scheduled gpt subscription work in the backend"

**Branch:** `codex/claude-review-refinement`, in its existing worktree. Rebase it first. Review the drafts there and fix, finish or replace them as needed.

**Don't change** the model (`claude-opus-5-5`), effort (`high`) or `max_tokens` (48000). Saved-review validation and the tests depend on them.

1. **Baseline (the understanding).**
   - Extend `src/data/seo-review-baseline.ts` with all of §5: F1–F14, L1–L6, D14, the overlap groups, the §2 rules and the open decisions in §6.
   - Check that every path it names exists in the route inventory.
   - Add it as one evidence item, `review-baseline`, in `collectReviewEvidence` (`src/lib/seo-review-evidence.ts`).
2. **Open the caps.** Replace `content.internalLinks.slice(0,20)` with:
   - `internalTargets`: all deduplicated internal paths, query and hash stripped.
   - `weakAnchors`: listed only when present.
   - `headings`: all headings as compact strings such as `"h2 Text"`, each cut at 160 characters.

   Keep the 1,800-character text excerpt.
3. **Site structure.**
   - Build `PageFacts` (path, template, words, H1s, targets, `articleAuthorTypes`).
   - Call `siteStructure()` (`src/lib/seo-review-structure.ts`) with the published posts' `related` lists, `services`, the route inventory, saved focus keywords from the `pages` and `posts` tables (post slugs mapped to `/blog/<slug>/`) and the overlap groups.
   - Add the result as evidence item `site-structure`.
   - Add unit tests for `siteStructure()` and the new signal fields (`schemaTypes`, `articleAuthorTypes` in `src/lib/seo-review-signals.ts`, read from JSON-LD without returning script bodies).
4. **Keep token burn low.**
   - In `reviewContext()` (`src/lib/seo-review-context.ts`), replace per-page `passedCheckIds` with `passedCount`.
   - Attach the deduplicated check catalog once, to the existing `crawl-coverage` item. Validation checks every cited ID against collected evidence, so create no context-only IDs.
   - Update `tests/seo-review-context.test.ts`.
   - Measure the JSON payload before and after on the 99 saved pages, with Google and Supabase stubbed as in `tests/seo-review-evidence.test.ts`.
   - Report the byte counts. The total must not grow, and should shrink.
   - **No prompt caching:** a weekly run outlives the cache, so caching would only add write cost.
5. **No overlap with backend GPT subscription work.** Add `src/lib/ai-work-lock.ts` with:
   - `codexWorkActive(sb)`: the count of `codex_jobs` where `kind` is `research` or `seo` and `status` is `queued` or `running`.
   - `claudeReviewActive(sb)`: true if any `admin_cache` row keyed `seo_review:%`, excluding `seo_review:scan:%`, has `value.status='running'` and `fetched_at` within 15 minutes.

   Then wire them in:
   - **`runSeoReview()`:** check `codexWorkActive` before `storeReview()` claims the run. If it is greater than 0, throw a dedicated error. The cron route (`src/pages/api/cron/seo-review.ts`) returns 200 `{skipped:'Codex subscription work is queued or running.'}` so a later hour retries. The manual route returns the same message.
   - **`enqueueCodexJob()`** (`src/lib/codex-jobs.ts`): for `research` and `seo`, refuse while `claudeReviewActive` with "A Claude SEO review is running. Start this after it finishes, usually within 10 minutes." `connect` and `verify` are unaffected.
   - **Window:** set the `vercel.json` cron to `0 13-16 * * 1`. Make `reviewSlot()` accept Monday 08:00–10:59 CT. The per-date key in `storeReview` already prevents a second paid run.
   - Update the reviewSlot test and the `settings` evidence text (`review.schedule`). Test the lock helpers as pure functions over row data.
6. **Recent GPT activity.**
   - Add evidence item `codex-activity`: `codex_jobs` of kind `research` and `seo` from the last 14 days.
   - Select only `kind`, `status`, `created_at` and `payload->target->>path`. Never payload content.
   - If it can't be read, set `available:false` with a gap.
7. **Instructions.** Edit `reviewInstructions()` (`src/lib/seo-review.ts`) and add `REVIEW_INSTRUCTIONS_VERSION='2026-11-05.1'` to the `settings` evidence. Keep the text short. Add:
   - **Baseline:** use `review-baseline` as leads only. Each week, report each baseline finding as resolved, open or regressed, citing current evidence IDs. Never repeat a finding without current evidence. Name the pending decision ID instead of presenting a gated change as approved.
   - **Site structure:** use `site-structure` for depth, case, service and peer links, bylines, links outside the inventory and duplicate focus keywords.
   - **Rules:** the §2 rules. Mark the existing Wendy line as a style reference only: OUABC never appears publicly.
   - **Boundary:** metadata drafting and editorial research belong to the Codex SEO specialist. Rank metadata problems and route them as "regenerate with the SEO specialist"; don't write replacement text. Skip pages in `codex-activity` within 14 days, except to check published outcomes.
   - **Evidence basis:** earlier reports built from stale checkouts produced obsolete findings. Base every conclusion on the deployed evidence supplied.
   - **Location:** apply D12 when answered.
8. **Done when:**
   - `npm test`, `npm run check` and `npm run build` pass.
   - Model, effort and `max_tokens` are unchanged.
   - The payload shows no growth.
   - Overlap is blocked in both directions, with tests.
   - No new paid call path exists.
   - The PR lists any env or Vercel settings the owner must confirm, without changing them.

### WS2: Link-graph fixes (ungated except steps 2 and 5)

Branch `codex/link-graph-fixes`.

1. **L1:** change `readingPath()` as described in §5. Keep the published-only filter and add a unit test. Report each post's inbound links from other posts, before and after. Every guide member must have at least 3.
2. **L2** (gated D15): reorder or split "Channels & measurement". URLs are unchanged.
3. **L3:** add case → category links. Static HTML.
4. **L5:** make the title the only crawlable card link, and keep the card clickable by stretching the title link in CSS. Keyboard and screen-reader behaviour stays the same; include an accessibility check in the PR.
5. **L6** (gated D17): remove `/admin/` from the public footer only.
6. Re-measure the F4 ✗ gaps. Add only the links still missing, in existing sentences where one fits. Otherwise use the template's related block.
7. **Done when:**
   - 0 broken internal links (lychee on `dist/`).
   - A before/after link-count table is in the PR.
   - Checks pass.

### WS3: Codex SEO specialist (ungated)

Branch `codex/seo-specialist-refinement`. Files: `src/lib/seo-agent.ts`, `src/pages/api/admin/seo-fix.ts`.

1. Allow "not applicable" category entries (e.g. `{"category":"local","problem":"not applicable","evidence":"…"}`) instead of forcing all six categories.
2. Add `focus_keyword` to `metadataCatalog`, and reject a proposal whose focus keyword duplicates another page's.
3. When Search Console is unavailable, return the focus keyword empty or marked unverified. Never present it as demand-backed.
4. Supply the baseline's overlap-group intents to the specialist.
5. Apply D12 when answered.
6. Bump `SEO_SPECIALIST_VERSION` and update `tests/seo-agent.test.ts`.
7. Keep `gpt-6.1-sol` and `medium` effort.

### WS4: Demand baseline, then service guide links

1. **Orient (read-only).** Name the edit path for each content type: pages, services, categories, authors, locations, posts, schema, and any Supabase snapshot override (`docs/codex-runner.md`).
2. **Demand baseline.** Use the repo's Search Console integration to pull the last 16 months, `query × page`.
   - Map queries to pages, and mark queries that land on two or more posts (this checks F4).
   - Output `docs/content/demand-baseline-2026-11.md` with source, date range in CT, row counts, the query→page map and cannibalization evidence. Raw CSVs go to the evidence folder.
   - If access fails, record the exact gap and continue. Don't estimate.
3. Use the result to confirm or adjust the F4 intents and the §8 queue order.
4. If D3 = yes: add 3 direct guide links per service page, derived from category data. An empty list renders nothing.
5. If D2 is answered: apply it to the guide's `related` order.

### WS5: Metadata (ungated drafts; copy approved in the PR)

Branch `codex/metadata-lengths`.

1. Apply F6 and F7 through the path that actually renders. Add an optional post meta-title field if needed.
2. Apply D10 and D12 when answered.
3. **Done when:**
   - Titles are ≤ 62 characters including " | ZINC".
   - Descriptions are 120–160 characters.
   - All are unique.
   - A re-crawl shows the new values.

### WS6: H1s and service depth (gated D9 for wording)

Branch `codex/service-h1-depth`, after WS2 merges.

1. Add an optional `h1` to the `services` entries in `src/data/site.ts`. Render it in the service hero (`src/components/Page.astro`; for BI, `BusinessIntelligence.astro` / `IntelligenceHero.astro`). Keep `title` for nav, cards and categories.
2. Apply the `/services/` and `/blog/` H1s (F9, F10).
3. Build the F2 section structure, filled with owner-confirmed facts only.
4. Verify at the repo's responsive sizes, and run Lighthouse on 2 service templates.

### WS7: Post → case and BI proof (gated D7, D16)

Branch `codex/case-links`.

1. Apply F3: one in-body case link per post, only where the proof rule allows. Verify each case's services first.
2. Apply D16 for `zinc-fusion-v16` on the BI service page and BI posts. `BusinessIntelligence.astro` must render the case if D16 = yes; remove the `caseSlug` if D16 = no.
3. Never link OUABC.

### WS8: Author and organization entities (gated D5, D11, D12)

Branch `codex/entity-schema`.

1. Apply F5, F12 and F13 with owner-supplied values only.
2. Validate one post, one author page and the homepage with Schema Markup Validator and Rich Results Test. Save screenshots to the evidence folder.

### WS9: Overlap separation and category ordering (gated D6, D14)

Branch `codex/intent-and-category-order`, after PR #83 merges.

1. **D6:** retitle and adjust the openings of the two update-investigation posts to the split in PR #83 or F4. Flag body sections that contradict the split instead of rewriting them.
2. If the owner chooses a merge instead: add the 301 in `astro.config.mjs`, update links and the sitemap, and verify on the deployed preview.
3. **D14:** primary-pillar-first category ordering. Static HTML, zero added JS.

### WS10: Editorial queue extension (gated D4)

Branch `codex/editorial-queue-19-plus`. Start it after PR #83 merges and after the content-hub worktree's `schedule.md` edits land.

1. Add the approved §8 items to `docs/editorial/schedule.md` as planned rows (register items 19 and on), following the register's slotting, author-lane and cadence rules.
2. Read the related live article bodies first, and cut any item that repeats an existing intent.
3. Drafts stay unpublished until the owner approves each one.

---

## 8. Queue extension (register items 19+, gated D4)

**Goal:** bring every thin pillar to at least 3 posts that are mainly about it, and answer the ecommerce buyer's measurement questions. The list avoids the 45 live posts and planned items 05–18; coverage was judged from titles and descriptions only.

**Slotting:**
- Mon/Fri are how-tos and Wednesday is industry analysis.
- Fill four weeks ahead.
- Assign authors by expertise:
  - **Kirk:** BI, measurement and technical web.
  - **Jaymie:** ecommerce, Shopify, paid media and local execution.
  - **Wendy:** content-led subjects.
- Keep Wendy's roughly half share with content-led items placed between these. Don't reassign topics to balance bylines.

| Priority | Pillar | Author | Working title and practical deliverable | Why |
|---|---|---|---|---|
| 1 | `apps` | Kirk | Decide who can see, change and approve each record in a business app: a roles-and-permissions worksheet with a labelled example | Apps reaches 3 posts with item 18 |
| 2 | `local-seo` | Jaymie | Build location pages that help customers, not doorway pages: page facts, distinct content and a review checklist | Local reaches 3 posts with item 17 |
| 3 | `business-intelligence` | Kirk | Why Shopify, GA4 and ad-platform revenue don't match: a reconciliation worksheet by cause (timing, attribution, refunds, tax, currency) | First post mainly about BI; link to item 06 and `ga4-ecommerce-event-validation` |
| 4 | `google-search-ads` | Jaymie | Review search terms without cutting real demand: exclusions, match types and a weekly review template | First post on running Search campaigns |
| 5 | `social-ads` | Jaymie | Plan Meta and TikTok creative tests that answer one question: test design, creative fatigue from delivery data, and a decision log | Follow-on to the two basics posts |
| 6 | `shopify` (+ `web-design`) | Jaymie | Move an ecommerce store to Shopify without losing search or orders: a URL, redirect, product-data and checkout test map | Distinct from the WordPress→Astro post |
| 7 | `shopping-ads` (Wednesday) | Jaymie | Performance Max or Standard Shopping for a catalog brand: what current controls and reporting allow | Comparison intent; check current Google documentation |
| 8 | `business-intelligence` | Kirk | Attribution windows explained for the finance team: one order seen by three platforms, with a labelled example | A question CFOs ask |
| 9 | `local-seo` | Jaymie | Separate local calls and form leads from profile interactions: tracking setup and a monthly check | Matches the service-page FAQ |
| 10 | `apps` (Wednesday) | Kirk | Custom app, no-code platform or another SaaS subscription: a decision framework by workflow, data and ownership | Apps depth |
| 11 | `shopify` | Jaymie | Audit a Shopify app stack: keep, replace or remove, with a cost-and-data-access worksheet | Matches the service-page FAQ |
| 12 | `web-design` | Kirk | Map URLs before a redesign: keep, redirect or retire, with a mapping template and launch checks | First post mainly about web design; distinct from the duplicate-content post |

**Every item:**
- Follows the register's editorial standard.
- Uses anonymised real client experience only where documented.
- Contains no OUABC.
- Contains no invented results.
- Links up to its pillar and across to 2–3 posts in the same pillar.

---

## 9. Reporting

**Each PR body:**
- scope and files
- a before/after table
- the checks run, with their exit status
- the decisions applied
- anything still open

**Final report to the owner, in one message, times in CT:**
- PR links and states
- open decisions
- measured outcomes: inbound-link counts, title and meta pass rates, WS1 payload bytes before and after, posts with case links
- access gaps exactly as observed

Don't claim a workstream is done without its "done when" evidence. Clean up your own scratch and worktrees after merge, and keep the evidence folder.

## 10. Success measures (targets are set after WS4; no invented numbers)

- Search Console clicks and impressions for `/services/*` and `/blog/*`, by pillar.
- Queries landing on more than one post, trending to 0.
- Every guide member with at least 3 inbound links from other posts; posts with case links equal to all eligible posts.
- Inquiries by `/contact/?service=<slug>`.
- Claude review usage receipts within the owner's allowance.
