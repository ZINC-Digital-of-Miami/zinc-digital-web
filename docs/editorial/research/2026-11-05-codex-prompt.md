# Codex prompt: ZINC site SEO, content pillars and Claude review refinement

You are working in the ZINC Digital website repository. The live site is https://www.zincdigital.co, deployed from `origin/main` on Vercel. Main checkout: `/Volumes/Satechi Hub/zinc-digital-web`. Worktrees: `/Volumes/Satechi Hub/zinc-digital-web-worktrees/`.

Your job is to deliver every workstream below through reviewed pull requests, in the order given. Some workstreams are gated on owner decisions. Prepare everything that is not gated, ask the owner once for the open decisions (§4), and build each gated workstream as soon as its decision arrives. Do only what this prompt describes.

---

## 1. Read first, in this order

1. **`AGENTS.md` on `origin/main`.** It overrides everything else here, including its git, review, merge and release rules. Do not use the local `main` checkout as a source: it is 76 commits behind and holds a 25 September mockup. Start every branch from a fresh `origin/main`.
2. **`docs/editorial/schedule.md`.** This is the editorial register: cadence, author lanes, standards and release rules.
3. **PR #84** (`docs/content-strategy-codex-brief`), the reference set. If it isn't merged yet, read it with `git show origin/docs/content-strategy-codex-brief:<path>`.
   - `docs/editorial/research/2026-11-05-seo-onpage-codex-brief.md`: the on-page SEO runbook. It defines findings F1–F14, decisions D2–D13 and tasks 0–8, plus a per-page appendix measured on the live site.
   - `docs/editorial/research/2026-11-05-content-pillar-handoff.md`: pillar coverage, link-graph findings L1–L6, decisions D14–D17, and the editorial queue extension. Its queue replaces Task 7 of the SEO runbook.
   - If PR #84's copy of the SEO runbook still says "D8 add AI SEO" or "keep the Claude review off", it is stale. This prompt wins: D8 is withdrawn, and D13 is resolved as "stays on" (§3, WS1).
4. **Crawl evidence:** `/Volumes/Satechi Hub/CodexScratch/zinc-seo-onpage-2026-11-05/`.
   - `html/`: the 99 live pages as fetched about 10:00 CT on 5 Nov.
   - `pages.json`: the extracted fields.
   - `bin/extract.py`: re-runs the extraction.
   - `bin/appendix.py`: rebuilds the per-page table.
   Re-crawl the preview or production site to verify each PR.

Ignore these superseded files in the root of the main checkout:
- `content-strategy-codex-brief-2026-11-05.md`
- `internal-linking-plan-2026-11-05.md`

---

## 2. Hard rules (owner and repository)

**Content and claims:**
- **OUABC is removed from the public site.** `/work/once-upon-a-book-club/` returns 410 by design. Add no OUABC case, link, logo, copy, caption, image or data anywhere.
- **No invented numbers, results, testimonials, profile URLs or author assignments.** Content waiting on the owner renders nothing. No placeholder markers such as `[RECEIPT: …]` on pages.
- **Voice:**
  - Kirk/ZINC first-person articles use `kirk-voice`.
  - Client bylines use `zinc-author-voice`.
  - General site copy follows the approved Design voice: no cursing, no sales devices.
  - Never write "GEO".
  - "AI search optimization" is the owner-approved service phrase (3 Nov).
- **Proof rule:** a page may cite or link a case study only when that case's own `services` list includes the service in question.
- **No legacy (owner rule):** do not read, extend, alias or fall back to legacy tables, files, endpoints or jobs. New work never depends on them.

**URLs and routes:**
- Keep every public URL, slug, redirect and route unless an owner decision changes it.
- A merge or consolidation needs a 301 and the owner's explicit go.

**Engineering:**
- Static-first: zero added client JS for every template change.
- Spec §10 performance gates hold.
- Run checks with Node 24 locally (`npm test`, `npm run check`, `npm run build`, plus the repo's verify scripts where `AGENTS.md` requires them). No Docker.

**Data and spending:**
- No paid tools or services.
- Search Console and GA4 data come only from the native APIs, through the repo's existing integration (`src/lib/google.ts`, `src/lib/seo-review-google.ts`).
- HYPD is research only, never a platform data source.
- Never print or commit secrets.
- Never change Vercel environment variables or production settings. Report what the owner needs to set.

**Storage and times:**
- Scratch, worktrees and raw data stay under `/Volumes/Satechi Hub/`. Raw CSVs go to the crawl evidence folder above.
- All times shown to the owner are America/Chicago, labelled CT.

**Copy approval:** every title, H1, meta description or body sentence you write is a draft for owner approval. Put a before/after table in the PR body.

**Reviews:**
- Request the repository's review once, on the final head of each PR.
- Fix only confirmed P0/P1 findings, in one batch, then re-request once.
- Answer every other finding on its thread.
- At most two review rounds per PR. Anything still open goes to the owner.

---

## 3. Work already in flight: don't collide

- **PR #83** (`codex/seo-article-intent-map`) records the distinct intents of the search-update, Merchant Center, Shopping and Search Console articles in `docs/editorial/schedule.md`. Let it land first. Build on it for F4 and WS10; don't duplicate it.
- **PR #84** is the docs reference set. It doesn't change code.
- **Worktree `content-hub-plain-language`** (`codex/content-hub-plain-language`) has uncommitted work. Leave these files alone until that work lands:
  - `docs/editorial/articles/build-a-content-hub-people-can-use.md`
  - `public/downloads/content-hub-*.pdf`
  - `public/media/content-hub/*`
  - `scripts/build-content-hub-resources.py`
  - `src/data/article-features.ts`
- **Worktree `claude-review-refinement`** (`codex/claude-review-refinement`, from `origin/main` `b314bdd`) holds uncommitted drafts for WS1. Continue there; see WS1.

---

## 4. Owner decisions

Send these to the owner in **one** message at the start, each with your recommendation. Start the ungated workstreams while you wait.

| ID | Decision | Gates |
|---|---|---|
| D2 | Primary service for `google-search-console-the-operators-guide` (`seo` or `business-intelligence`) | WS4 for that post |
| D3 | Show 3 direct guide links on each service page (spec §6.2 change) | WS4 step 4 |
| D4 | Approve the queue extension (handoff §3) | WS10 |
| D5 | Named Person authors for `content-marketing-plan-that-produces-pipeline` and `when-web-design-trends-actually-matter` (now Organization "Team ZINC") | WS8 |
| D6 | Group A: separate the intents of `how-to-read-a-google-algorithm-update` and `google-core-update-review` (recommended), or merge with a 301 | WS9 |
| D7 | Confirm the proof rule, and which cases count for Shopify/Shopping (does Las Vegas Safety & Supply list them?) | WS7 |
| D9 | H1 wording for the 11 service pages, `/services/` and `/blog/` (proposals in runbook F1, F9, F10) | WS6 |
| D10 | Thin hubs `/blog/category/apps/` and `/blog/category/local-seo/`: intro copy or `noindex, follow` until 3 posts; TikTok category label | WS5 |
| D11 | Real profile URLs (`sameAs`) for Kirk, Jaymie, Wendy and the company | WS8 |
| D12 | One location statement (Panama City base / Miami) for copy, schema order and assistant instructions | WS5, WS8, WS1 |
| D14 | Category ordering: primary-pillar posts first (recommended), or trim `related` | WS9 |
| D15 | Reorder or split the "Channels & measurement" guide | WS2 step 2 |
| D16 | Does ZINC Fusion v16 count as proof for the BI service? | WS7 |
| D17 | Remove the public footer link to `/admin/`? | WS2 step 5 |

Already settled; don't ask again:
- **D1:** the pillar model is live.
- **D8:** withdrawn.
- **D13:** the Claude review stays on, per WS1.

---

## 5. Workstreams

One branch and one PR per workstream, each from fresh `origin/main`.

**Can run in parallel:** WS1, WS2, WS3 and WS4-read-only. They touch different files.

**Must run in sequence:**
- WS2 and WS6 both touch `src/components/Page.astro`. Merge WS2 first.
- WS5 and WS6 both touch `src/data/site.ts`. Merge them one after the other and rebase between.

### WS1: Claude weekly review refinement (ungated; aim to merge before Monday 9 Nov 08:00 CT)

**Owner direction, 5 Nov:**
- "claude reviews stay on, and get full refinement based off all these reports"
- "all this get baked into claudes understanding and instructions"
- "open up the cap, but keep the token burn low"
- "do not alllow overlap with any scheduled gpt subscription work in the backend"

**Branch:** `codex/claude-review-refinement`. Continue in its existing worktree, which holds these uncommitted drafts:
- `src/data/seo-review-baseline.ts` (new): the dated baseline. Findings B1–B11, overlap groups, rules, pending decisions.
- `src/lib/seo-review-structure.ts` (new): `siteStructure()`, which computes service-page depth and links, hub depth, posts without case or service links, Organization bylines, links outside the inventory, missing links inside overlap groups, and duplicate saved focus keywords.
- `src/lib/seo-review-signals.ts` (edited): adds `schemaTypes` and `articleAuthorTypes`, read from JSON-LD without returning script bodies.

Review these drafts; fix, finish or replace them as needed. Don't change the model (`claude-opus-5-5`), effort (`high`) or `max_tokens` (48000). Saved-review validation and the tests depend on them.

1. **Baseline (the understanding).**
   - Extend `seo-review-baseline.ts` with handoff items L1–L6 and decisions D14–D17.
   - Make sure every path it lists exists in the route inventory.
   - Add it to the evidence in `collectReviewEvidence` (`src/lib/seo-review-evidence.ts`) as one evidence item, `review-baseline`.
2. **Open the caps.** In the page scan, replace `content.internalLinks.slice(0,20)` (href plus anchor text) with:
   - `internalTargets`: all deduplicated internal paths, query and hash stripped.
   - `weakAnchors`: anchor texts such as "read more" or "click here", listed only when present.
   - `headings`: all headings (`pageEvidence` already caps at 60) as compact strings, e.g. `"h2 Text"`, each cut at 160 characters.
   Keep the 1,800-character text excerpt. Word counts already come from `analysis.counts.words`.
3. **Site structure.**
   - Build `PageFacts` from each scanned page: path, template, words, H1s, targets, and `articleAuthorTypes`.
   - Call `siteStructure()` with:
     - the published posts' `related` lists;
     - `services` from `src/data/site.ts`;
     - the route inventory;
     - saved focus keywords: the `pages` and `posts` tables, mapping post slugs to `/blog/<slug>/`;
     - the baseline's overlap groups.
   - Push the result as evidence item `site-structure`.
   - Add unit tests for `siteStructure()` and for the new signal fields.
4. **Keep token burn low.**
   - In `reviewContext()` (`src/lib/seo-review-context.ts`), replace the per-page `passedCheckIds` with `passedCount`.
   - Attach the deduplicated check catalog once, to the existing `crawl-coverage` item. Don't create new evidence IDs in the context only: validation checks every cited ID against the collected evidence.
   - Update `tests/seo-review-context.test.ts`.
   - Measure the JSON payload before and after with the real `collectReviewEvidence` scan pieces. Use the 99 saved HTML files or a production-like run, with Google and Supabase stubbed as in `tests/seo-review-evidence.test.ts`.
   - Report the byte counts in the PR. The total must not grow, and should shrink.
   - Don't add prompt caching. A weekly run outlives the cache, so it would only add cache-write cost.
5. **No overlap with backend GPT subscription work.** Codex jobs of kind `research` and `seo` are processed from `codex_jobs` by the Mac runner.
   - Add `src/lib/ai-work-lock.ts` with:
     - `codexWorkActive(sb)`: count of `codex_jobs` where `kind` is `research` or `seo` and `status` is `queued` or `running`.
     - `claudeReviewActive(sb)`: true if any `admin_cache` row keyed `seo_review:%` (excluding `seo_review:scan:%`) has `value.status='running'` and `fetched_at` within the last 15 minutes.
   - **In `runSeoReview()`:** before `storeReview()` claims the run, check `codexWorkActive`. If it is greater than 0, throw a dedicated error. The cron route (`src/pages/api/cron/seo-review.ts`) returns `{skipped:'Codex subscription work is queued or running.'}` with status 200, so a later hour retries. The manual route returns the same message.
   - **In `enqueueCodexJob()`** (`src/lib/codex-jobs.ts`): for `research` and `seo`, refuse while `claudeReviewActive` with: "A Claude SEO review is running. Start this after it finishes, usually within 10 minutes." `connect` and `verify` are unaffected.
   - **Window:** change the cron in `vercel.json` to `0 13-16 * * 1`, and `reviewSlot()` to accept Monday 08:00–10:59 CT (returns the date). The per-date key in `storeReview` already prevents a second paid run.
   - Update the reviewSlot test and the `settings` evidence text (`review.schedule`).
   - Test the lock helpers as pure functions over row data.
6. **Scope boundary and recent GPT activity.**
   - Add evidence item `codex-activity`: `codex_jobs` of kind `research` and `seo` from the last 14 days. Select only `kind`, `status`, `created_at` and `payload->target->>path`. Never payload content.
   - If it can't be read, set `available:false` with a gap.
7. **Instructions.** Edit `reviewInstructions()` in `src/lib/seo-review.ts` and add `REVIEW_INSTRUCTIONS_VERSION='2026-11-05.1'` to the `settings` evidence. Keep it short. Add:
   - **Baseline:** use `review-baseline` as leads only. Each week, report every baseline finding as resolved, open or regressed in the matching area's check detail. Cite current evidence IDs. Never repeat a finding without current evidence. Name the pending decision ID instead of presenting a gated change as approved.
   - **Site structure:** use `site-structure` for page depth, case, service and peer links, bylines, links outside the inventory and duplicate focus keywords.
   - **Rules:** the baseline rules (OUABC ban and intended 410, proof rule, no placeholders, never "GEO", the approved phrase, URL retention). Mark the existing Wendy line as a style reference only: OUABC never appears publicly.
   - **Boundary:** per-page metadata drafting (titles, descriptions, focus keywords) and editorial research belong to the Codex SEO specialist in Backend. Identify and rank metadata problems, and route them as "regenerate with the SEO specialist"; don't write replacement metadata text. Skip re-reviewing pages listed in `codex-activity` within 14 days, except to check published outcomes.
   - **Evidence basis:** earlier reports built from stale repository checkouts produced obsolete findings. Base every conclusion on the deployed evidence supplied.
   - **Location:** align with D12 when answered. Until then, keep "Panama City principal base; Miami priority growth market".
8. **Done when:**
   - `npm test`, `npm run check` and `npm run build` pass.
   - Model, effort and `max_tokens` are unchanged.
   - The payload measurement shows no growth.
   - Overlap is blocked in both directions, with tests.
   - No new paid call path exists.
   - The PR body lists any env or Vercel settings the owner must confirm, without changing them.

### WS2: Link-graph fixes (ungated except steps 2 and 5)

Branch `codex/link-graph-fixes`.

1. **L1:** in `readingPath()` (`src/data/blog-strategy.ts`), non-hub members return the hub plus the previous and next member in editorial order, wrapping at the ends. Keep the published-only filter, and add a unit test. Rebuild and report each post's inbound links from other posts, before and after. **Done when:** every guide member has at least 3.
2. **L2** (gated D15): reorder or split the "Channels & measurement" guide into topic runs. URLs are unchanged.
3. **L3:** on each case page, add "Read our {Service} articles" links to the category of every service in that case's `services` list that has articles. Static HTML.
4. **L5:** blog index and category cards currently link each post three times (image, title, "Read the full article"). Make the title the only crawlable link, and keep the whole card clickable by stretching the title link over the card in CSS. Keyboard and screen-reader behaviour stays the same; include an accessibility check in the PR.
5. **L6** (gated D17): remove `/admin/` from the public footer only.
6. Re-measure runbook F4's ✗ gaps. Add only the in-body links that are still missing, in existing sentences where one fits. Otherwise use the template's related block.
7. **Done when:**
   - 0 broken internal links (lychee on `dist/`).
   - The before/after link-count table is in the PR.
   - Checks pass.

### WS3: Codex SEO specialist (ungated)

Branch `codex/seo-specialist-refinement`. Files: `src/lib/seo-agent.ts`, `src/pages/api/admin/seo-fix.ts`.

1. Allow `{"category":"local","problem":"not applicable","evidence":"…"}` style entries instead of forcing a recommendation in all six categories.
2. Add `focus_keyword` to `metadataCatalog`. Reject a proposal whose focus keyword duplicates another page's, the same way duplicate titles and descriptions are rejected.
3. When Search Console evidence is unavailable, return the focus keyword as empty or mark it unverified. Never present it as demand-backed.
4. Add the baseline's overlap-group intents to the specialist input, so drafts keep each post's intended intent.
5. Align the location line with D12 when answered.
6. Bump `SEO_SPECIALIST_VERSION` and update `tests/seo-agent.test.ts`.
7. Keep `gpt-6.1-sol` and `medium` as they are.

### WS4: Demand baseline (read-only first) and service guide links

1. Run runbook Task 0 and Task 1. The output is `docs/content/demand-baseline-2026-11.md`, with source, date range in CT, row counts, the query→page map and cannibalization evidence.
2. If Search Console access fails, record the exact gap and continue. Don't estimate.
3. Use the result to confirm or adjust the F4 intents and the WS10 queue order.
4. If D3 = yes: add 3 direct guide links per service page, derived from category data. An empty list renders nothing.
5. If D2 is answered: apply it to the Search Console guide's `related` order.

### WS5: Metadata (ungated drafts; owner approves copy in the PR)

Branch `codex/metadata-lengths`. Apply runbook F6 and F7.
- Page meta lives in `src/data/page-editorial.ts`; category and author meta come from `src/data/site.ts`; posts come from `src/data/article-*.ts` and `article-guides.json`.
- First confirm whether admin-published Supabase snapshots override repository post metadata, and edit through the path that actually renders.
- Add an optional post meta-title field if needed, so H1s don't change.
- Apply D10 and D12 when answered.
- **Done when:**
  - Titles are ≤ 62 characters including " | ZINC".
  - Descriptions are 120–160 characters.
  - All are unique.
  - A re-crawl shows the new values.

### WS6: Service, `/services/` and `/blog/` H1s and service depth (gated D9 for wording)

Branch `codex/service-h1-depth`, after WS2 merges.
- Add an optional `h1` to the `services` entries in `src/data/site.ts`. Render it in the service hero (`src/components/Page.astro`; for BI, `BusinessIntelligence.astro` / `IntelligenceHero.astro`). Keep `title` for nav, cards and categories.
- Apply the approved H1s for `/services/` and `/blog/`. Keep the `<insights.py/>` mark as a decorative kicker.
- Build the runbook F2 section structure for service pages: included work, who it's for, engagement steps, proof, guides, FAQ. Fill only owner-confirmed facts; empty sections render nothing.
- Verify at the repo's responsive sizes, and run Lighthouse on 2 service templates against §10.

### WS7: Post → case and BI proof (gated D7, D16)

Branch `codex/case-links`.
- One in-body case link per post, only where the case lists the post's primary service. Verify the case's services in `src/data/site.ts` before each link.
- Apply D16 for `zinc-fusion-v16` on the BI service page and BI posts. `BusinessIntelligence.astro` currently doesn't render `serviceCase`.
- Never link OUABC.

### WS8: Author and organization entities (gated D5, D11, D12)

Branch `codex/entity-schema`.
- Set the named authors.
- Add `sameAs` and `knowsAbout` to Person (`src/data/authors.ts`), and `sameAs` and `areaServed` to ProfessionalService (`src/lib/public-seo.ts`). Owner-supplied values only.
- Validate one post, one author page and the homepage with Schema Markup Validator and Rich Results Test. Save screenshots to the evidence folder.

### WS9: Overlap separation and category ordering (gated D6, D14)

Branch `codex/intent-and-category-order`, after PR #83 merges.
- **D6:** retitle and adjust the openings of the two update-investigation posts to the split recorded in #83 or runbook F4. Flag body sections that contradict the split instead of rewriting them. If the owner chooses a merge instead: add the 301 in `astro.config.mjs`, update links and the sitemap, and verify on the deployed preview.
- **D14:** order category pages with primary-pillar posts first (`proposalPillar(related)`, `src/lib/proposal-pillar.ts`), then the rest under a quieter "Related from other topics" heading. No URL or `related` changes.

### WS10: Editorial queue extension (gated D4)

Branch `codex/editorial-queue-19-plus`, after PR #83 merges.
- Add the approved handoff §3 items to `docs/editorial/schedule.md` as planned rows, following the register's slotting, author-lane and cadence rules.
- Drafts stay unpublished until the owner approves each one.

---

## 6. Reporting

- **Each PR body:** scope, files, before/after table, checks run with their exit status, owner decisions applied, and anything still open.
- **Owner-facing times:** CT.
- **Final report to the owner,** one message:
  - PR links and states.
  - Which decisions are still open.
  - Measured outcomes: link counts, title and meta pass rates, WS1 payload bytes before and after.
  - Any access gaps, exactly as observed.
- Don't claim a workstream is done without its "done when" evidence.
- Clean up your own scratch and worktrees after merge. Keep the evidence folder.
