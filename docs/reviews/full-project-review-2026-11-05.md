# ZINC full project review — 5 November 2026 CT

**Original review verdict: the project did not pass a full completion review.** Nine findings required correction, retirement or release verification. See the remediation status below for subsequent verified changes; the broader plan still has explicit evidence gaps. This is a source/configuration review with bounded native and local reproduction evidence, not a penetration-test or accessibility certification.

Audited product: `origin/main` **2ad517f1273c1f538531f7fae07d1a90259f250d** (PR90). Production **dpl_2GYVRwRSxLtDijtShj2pAXhUkAVV** was READY with the matching SHA and www/apex aliases. Nine corrected articles matched the reviewed text and links; six PDFs/SVGs/CSV resources matched byte-for-byte.

Three independent reviewers covered backend/security, public site/funnel, and release/AI operations. The parent checked native GitHub rules, Vercel project/deployment state, current database policies and runner status, reproduced two pure local failures, and inspected the existing homepage tab. Root checkout is stale and dirty; it was preserved. Unreleased work was assessed separately from main.

## Findings

### 1. P1 — Passing checks are not enforced by GitHub

The active main ruleset24024093 contains only `deletion`, `non_fast_forward` and `pull_request`. Pull requests and squash merges are enforced; **there is no required-status-check rule**. An authorized merger can merge while Actions or Vercel is pending or failing. Previous releases manually waited for checks; that does not create enforcement.

Fix: prepare the exact required-check configuration for the owner's approval, preserving the existing rules and normal PR path. Do not bypass or silently change protections.

Evidence: native `/repos/ZINC-Digital-of-Miami/zinc-digital-web/rules/branches/main`; retained ownership `.scratch/full-review-main-rules.json`.

### 2. P2 — Deployed Google configuration permissions are weaker than the application

The [Google settings route](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/src/pages/api/admin/google.ts#L21) requires an owner. Source migration0005 also restricts `admin_cache.google_connection` to owners. Fresh native database readback shows the deployed staff INSERT/UPDATE policies omit that owner clause. Authenticated table INSERT/UPDATE privileges are present, and no separate Google-key restriction appears.

An authenticated editor can bypass the screen through direct database access and change or invalidate the reporting property/site. This is an editor-to-owner configuration boundary failure; no anonymous exploit or credential exposure is claimed.

Fix: prepare a narrow reviewed migration, prove editor denial and owner success locally, obtain the required production approval, and read the resulting policies back.

Evidence: ownership `.scratch/full-review-live-policies.log` and `full-review-runner-policies.log`. The separate SEO-report policies are RESTRICTIVE and correctly block staff writes to `seo_review:%`; that preliminary concern was closed.

### 3. P2 — The proposal form excludes buyers without a website

[Server validation](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/src/lib/inquiry.ts#L48) and the shared contact form require an existing HTTP(S) website for every proposal, including Web Design. A first-website prospect must invent a URL or abandon the proposal flow.

A local pure validation reproduction rejected an otherwise valid Web Design request with `field: website`; adding a valid URL passed. No inquiry, email or database row was created.

Fix: make the website optional or offer an explicit no-existing-website choice, keeping URL validation when a value is supplied. Apply consistently to contact and article drawers.

### 4. P2 — A build can mix two publication versions

[readContentSnapshots](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/src/lib/content-revision.ts#L11) reads pages and posts in separate requests. Its timestamp check runs only when `at` is supplied; the build caller omits it. A publication between the reads can mix versions and still produce a normal revision hash.

The local no-network reproduction accepted pages stamped18:00UTC and posts stamped19:00UTC. This proves the missing consistency check; it does not prove live content was corrupted. The previously empty saved-post inventory limits current exposure but does not remove the supported admin-post workflow.

Fix: use an atomic snapshot read or enforce publication consistency in the build path, with a regression for the reproduced mixed input.

### 5. P2 — Concurrent research questions can cross into the wrong prompt

The [research chat route](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/src/pages/api/admin/research/chat.ts#L40) receives the current user-message ID, then discards it. After awaiting source retrieval it loads the newest12 completed messages without bounding history to that request.

If two questions overlap in one chat, the first request can include the second question in its prompt. Both model paths consume that history. This is a source-confirmed race; occurrence in private production chats was not inspected.

Fix: bound history to the returned message ID and test overlapping requests with stubbed providers.

### 6. P2 — The browser verifier is outdated, and CI does not run it

The retained [browser verifier](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/scripts/verify-site.mjs#L132) demands `/og/[a-z]+.png` for every non-article social image. This rejects the approved machine-head WebP and custom case images. Line274 expects “Send inquiry”; current form code correctly uses “Request a proposal.” Its fixed inventory also omits categories, locations and subscription pages.

Actions currently runs install, unit tests, Astro checking, build and static checks. A passing build therefore does not establish current browser, accessibility or interaction coverage.

Fix the verifier and derive its destinations from the canonical inventory. **Preserve the approved social image and proposal wording.** Run appropriate browser checks through the authorized workflow; do not create new browser tabs or claim field performance from static tests.

### 7. P2 — Lighthouse startup failure can leave a server behind

[scripts/lighthouse.mjs](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/blob/2ad517f1273c1f538531f7fae07d1a90259f250d/scripts/lighthouse.mjs#L22) starts its server before entering the cleanup `try/finally`. Directory preparation or Chrome launch can throw before cleanup is active.

Fix: put startup inside the cleanup boundary and verify process exit on startup failure. No Lighthouse helper was launched during this review.

### 8. P2 — Two obsolete research aliases conflict with the no-legacy direction

`src/pages/api/research/chat.ts` and `src/pages/api/research/ingest.ts` explicitly retain original paths as aliases to the admin endpoints. Current UI requests use `/api/admin/research/...`; the old paths remain in route/test inventories, with no current UI consumer found.

Prepare their retirement together with the route/check inventory and inspect any external-consumer evidence needed for a safe retirement. They remain session-protected; this is not an authentication-bypass claim. Do not extend or add dependencies on the aliases. Removal remains open until completed through the approved path.

### 9. P2 — Claude's applied coordination migration is ahead of deployed retry handling

Migration0013 is applied, but current main still has only the08:00CT cron handling and a generic reservation error. PR89 adds deferred receipts and the09:00/10:00 retries restricted to pre-paid deferrals. It remains open at reviewed head **4ccb65792c3465dba1ade65767924a97fabc8099**; the latest inspected Actions run was in progress and its preview passed.

If Codex blocks a review before that application code is deployed, main cannot retain the approved deferral/retry state. This is a release dependency, not evidence Monday already failed.

Finish the protected exact-head release after checks pass, then verify deployed schedules and status handling without a paid test call. Keep the separate Monday09:15CT verification active.

## What was verified and what remains open

- The actual Vercel project is `zinc-digital-web`, Node24, connected to main. PR90's article/resource correction is live.
- Native Codex runner status was `ready`, with heartbeat age8seconds and no queued/running jobs. Installed runner files match the reviewed candidate. A heartbeat is not proof of a completed paid review.
- Monday09:15CT verification is ACTIVE. CodeQL default setup is `not-configured`; an old active-looking workflow registry record does not prove current scanning.
- Article ownership consistently drives pillar membership, service links, proposal context and analytics. Stable originating `service_slug` is intentional. Requested-service checkbox measurement is a separate coverage gap, not justification to overwrite source attribution.
- The exact machine-head asset remains wired as the homepage social image; the current footer badge was visually inspected. Approved hero source/assets are preserved. Chrome was changed by the owner during the attempted top-of-page inspection, so this review does not claim a new complete hero/layout verification.
- Production role tests, controlled live form delivery and Google event delivery, native query/page overlap, current GA4 filters, Square payment reconciliation, field Core Web Vitals and complete accessibility verification remain unproved.
- Commercial copy/schema, homepage metadata publication and accessible-heading work, editorial queue publication and the final26-recommendation closeout are unfinished. Repository homepage metadata alone cannot override the published database snapshot. The26-row reconciliation is prepared in the existing Kiro record; it does not mark these gaps complete.
- Matched Google windows and expanded landing rows were already released in PR80, not PR89. The reconciliation was corrected accordingly.

## Execution error and cleanup

During PR90 preview verification, I accepted Vercel auto-link confirmation from an unlinked worktree and accidentally created the empty `live-pillar-corrections` project. That was an execution error. It had no deployments or repository connection. After the owner's explicit approval, project `prj_absWkvVNVONSX8In2qxUHxBZscbx` was deleted and a native read returned not-found. The real project was independently reread and is intact. The local worktree link and assistant-added `.gitignore` change were corrected. Future preview commands must first verify the existing project ID; a missing link is not permission to auto-create a project.

No new browser tab/window, paid model test, support message or production test inquiry was created in this review. No persistent task-owned helper was started. Native reads used read-only transactions; the only cloud deletion was the specifically approved accidental project cleanup.

## Post-review remediation receipt

5November2026CT: finding1 is corrected for ordinary merges. The owner approved the exact required-check payload; native readback confirms build/GitHubActions15368 and Vercel8329 are required, with existing rules and administrator PR bypass preserved. GitHub lists both as required on PR89. Finding3 is fixed in the reviewed commercial candidate and passes local JSON/no-JavaScript intake tests; it is not yet released. Other findings remain open or awaiting the release/verification described above.


### Protected remediation releases — 5 November 2026 CT

| Finding | Current disposition | Evidence boundary |
|---|---|---|
|1. Required checks|Owner-approved ruleset now enforces `build` and `Vercel`; exact-head passing checks preceded each protected merge.|Existing administrator bypass settings were preserved, not expanded.|
|2. Google settings permissions|Reviewed migration0014 applied to verified ZINC project `zeetlqskfvsfbllrhzre`; native readback restored owner conditions.|Local role tests and production policy readback; no production editor mutation test.|
|3. First-website intake|PR91 released optional website input with validation when supplied; blank-website drawer steps1–3 inspected.|No real test inquiry or inbox-delivery claim.|
|4. Publication consistency|PR93 released the single-snapshot reader; live revision matches the published database snapshot.|Local concurrency/rollback proof; no production competing-publication test.|
|5. Concurrent research history|PR93 bounds provider history to the initiating message; regression tests passed.|No paid production model test.|
|6. Browser verifier|PR92 exact-head checks passed and protected merge completed; canonical inventory and current image/button assertions released in source.|Full browser execution remains open; inventory-only verification is not visual proof.|
|7. Lighthouse cleanup|PR92 encloses startup in cleanup; injected startup failures terminated and awaited the owned server.|No new Lighthouse performance score claimed.|
|8. Obsolete endpoints|Owner approved both deletions; PR92 preview returned404 for each and protected merge completed.|Production GET/POST404 verified for both; canonical research/publish routes still require authentication (401). Storage is unchanged.|
|9. Coordination release|PR89 production verified; atomic gate, paid-key deduplication and pre-paid deferral handling live.|Monday execution remains future evidence;09:15CT verification stays active without starting a review.|

PR92 merged as `9f00a0ebc5af6c9628c7270e077e806960bfa42a` after reviewed head `46072aa` passed Actions42117894272 and its matching Vercel preview. The hosted job completed in80seconds, restored the image cache and reused all2,305 generated images. Tests, Astro check, full build and103HTMLchecks still executed. Prior cold run42111864628 completed in about39minutes and saved the cache. This demonstrates reuse for this pair of runs, not a guaranteed future duration. Retained log: Claude worktree `.scratch/pr92-final-actions.log`.

The canonical26-row reconciliation now records released commercial/entity/editorial work, the separately published homepage title,45 direct full-reader reviews and final45article/11pillar HTTP parity. Later native evidence verifies current GA4 key-event/counting/filter/retention configuration, all207 displayed comparison queries and five exact-query/page samples. Still open: broader query-to-page overlap, controlled event execution/staff-filter matching, actual mobile/performance/layout verification, stored-post publishing, some external-source/resource/provenance checks and qualification/revenue attribution. Source facts, rendered behavior, delivery and Monday execution remain distinct.

Final PR92 deployment `dpl_7keNGUUYyEX3DWFZvgTfnkZCcC4X` is READY at the exact merge SHA with www/apex aliases. Production readback at4:06PM CT confirmed both retired paths return404 for GET/POST, protected research/publish routes return401 unauthenticated and the published content revision is unchanged. Receipt: Claude worktree `.scratch/pr92-production-receipt.json`. All nine identified repairs now have the source/configuration/release evidence stated above; the broader evidence gaps remain open.
