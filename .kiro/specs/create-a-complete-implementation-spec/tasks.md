# Tasks — Finish and launch the ZINC Digital website

Spec `create-a-complete-implementation-spec` · Phase 3 (tasks) · 4 October 2026 (CT) · Implements requirements.md R1–R18 using design.md

## How these tasks run

**Kiro flow (D5):**
- Every task runs in `/Volumes/Satechi Hub/zinc-digital-web-wt-create-a-complete-implementation-spec` on branch `spec/create-a-complete-implementation-spec`, in order.
- The six milestones (M1–M6) are the top-level items below. Each milestone ends with its PR task, and the milestone is ticked when that PR has merged.

**Milestone PR steps** (the last task of every milestone):
- Push the branch (`git push origin spec/create-a-complete-implementation-spec`) and open the PR to `main`.
- Request one Codex review on the final head. Fix only confirmed P0/P1 findings, in one batch, and re-request once: two review rounds at most. Answer every other finding on its thread.
- Merge by squash once the required checks pass and the review is answered. Milestone merges are automatic (owner, 4 Oct 2026).
- Reset the Kiro branch (design section 2): confirm `git diff origin/main spec/create-a-complete-implementation-spec` is empty, rebuild the branch on `origin/main`, and merge the old remote head into it so the next push fast-forwards. Never force-push.

**Node 24:**
- Every command runs with `PATH="/opt/homebrew/opt/node@24/bin:$PATH"`. The machine default is Node 26.
- Confirm `node --version` prints v24 at the start of each milestone.

**Live preview (R18.2):**
- From task 2.3 on, `npx astro dev --host 127.0.0.1 --port 4321` stays running in the background.
- The dashboard Browser panel shows it.
- Restart it after dependency or config changes.

**Evidence:**
- Each task ends with its **Verify** step.
- Commands and exit codes are recorded in the milestone PR description.
- Local, CI, preview and production results are listed separately.
- Times are in CT.

**Owner go:**
- Steps marked **Owner go** stop and wait for the owner's explicit approval of that exact action: applying migrations, pushing Auth config, the first real Publish, deleting files or test data, the HSTS merge and DNS cutover.
- Secret values are entered by the owner only.

**Scratch:** screenshots, reports and temporary files go under `/Volumes/Satechi Hub/zinc-digital-web-review/`, never the home directory.

## Milestones

- [x] M1 — Authority · merged as #7 (`ce34273`)
  - [x] 1. Reconcile repository instructions with the approved authority
    - [x] 1.1 Update `AGENTS.md`, `CLAUDE.md` and `.claude/CLAUDE.md`. They must:
      - state the authority order;
      - name this spec as the execution plan;
      - describe the Kiro flow (D5);
      - keep the operational invariants: Node 24, performance targets, external drive, no paid services, owner go for irreversible actions, CT times.
      - **Verify:** `grep -n -i "all-white\|circuit\|RECEIPT\|noindex, nofollow on every page" AGENTS.md CLAUDE.md .claude/CLAUDE.md` shows no superseded rule stated as active.
      - _Requirements: R1.1_
    - [x] 1.2 Add dated "Superseded (owner, 4 Oct 2026)" notes. Delete no files. Notes go in:
      - `docs/superpowers/specs/2026-09-25-zinc-site-redesign-design.md`, sections 6.1, 8, 9, 12 (Summit/LVS), 13 (markers) and 16–17;
      - `.planning/REQUIREMENTS.md` for DSGN-01..03, HOME-01..08, LOOP-02, WORK-04 and the dark-toggle exclusion;
      - `.planning/ROADMAP.md`, `.planning/STATE.md` and `.planning/HANDOFF.json`;
      - also carry over PR #6's Codex GitHub review rule and its SPF measurement note.
      - **Verify:** each listed item carries a superseded note. `git diff --stat` shows only documentation files.
      - _Requirements: R1.2, R1.3_
    - [x] 1.3 Commit the spec (`.kiro/specs/create-a-complete-implementation-spec/`) and the reconciliation.
      - Run the existing gate locally: `npm ci && npm run check && npm run build && node scripts/check-site.mjs`.
      - **Verify:** every command exits 0. The U+00A7 and banned-abbreviation scans pass on the changed files.
      - _Requirements: R1.1–R1.3_
    - [x] 1.4 Open the M1 PR and get it merged.
      - Push `spec/create-a-complete-implementation-spec`, open the PR to `main` and request one Codex review on the final head.
      - Merge after the required `build` check passes.
      - Close PR #6 with a comment linking the merged PR.
      - Reset the Kiro branch to `main`.
      - **Verify:** PR merged; PR #6 closed; `git diff origin/main spec/create-a-complete-implementation-spec` was empty before the reset.
      - _Requirements: R1.4, R18.1_

- [x] M2 — Public site · merged as #8 (`0c0718c`)
  - [x] 2. Integrate the Design package and the build foundation
    - [x] 2.1 Integrate the port from `/Volumes/Satechi Hub/zinc-digital-web-review/2026-10-04-packaged-design/current-design/astro/`.
      - Confirm the source archive's SHA-256 is `a624cfec…d42d0`.
      - Copy the files in PORT.md section 5.1 (add) and 5.2 (replace).
      - Rename `src/pages/-...path-.astro` to `src/pages/[...path].astro`, replacing the existing file.
      - Add `.nvmrc` containing `24`.
      - Keep all old preview files.
      - Record the per-file mapping (added, replaced, adapted or not taken, with the reason) in `docs/port-integration.md`.
      - **Verify:** `npm ci` exits 0 and `git status` shows no `package-lock.json` change.
      - _Requirements: R1.5, R1.6, R1.7_
    - [x] 2.2 Make the type check and the build pass.
      - Fix every `astro check` error.
      - Record where the build writes static pages and the function (design section 4.1). Point `check-site.mjs` at the actual static directory.
      - **Verify:** `npm run check` exits 0 with 0 errors; `npm run build` exits 0; the font guard passes.
      - _Requirements: R1.8, R4.3_
    - [x] 2.3 Start the live preview and keep it running (`npx astro dev --host 127.0.0.1 --port 4321`), then point the dashboard Browser panel at it.
      - **Verify:** `curl -sI http://127.0.0.1:4321/` returns 200.
      - _Requirements: R18.2_
    - [x] 2.4 Fetch and serve the 17 WordPress case images.
      - Run `npm run assets`.
      - Check every file against the dimensions in `assets.site.json`.
      - Move the images into `src/assets/work/` and render them with `<Picture formats={['avif','webp']}>`, with width, height, alt and lazy loading below the fold.
      - Commit them.
      - **Verify:** the script reports `failed 0`; the built HTML has no `wp-content` URL; every case image has width and height.
      - _Requirements: R4.1, R4.2_
  - [x] 3. Fix the public-site defects (design section 4.2)
    - [x] 3.1 Add `[hidden]{display:none !important}` to `site.css` and `home.css`.
      - **Verify:** in the browser, a blog layer filter hides non-matching cards; the empty state appears only at zero results; step controls follow their `hidden` state with and without JavaScript.
      - _Requirements: R3.4_
    - [x] 3.2 Make pinned and scroll-driven sections fall back to normal flow. Move the sticky and clip rules under `html.js`, `prefers-reduced-motion: no-preference` and support for scroll timelines or the script class. Set the before/after default to `--ba:50%`.
      - **Verify:** with reduced motion and with JavaScript off, at 375 and 1440 px, every case screenshot, homepage layer panel, U.S. Oil stamp and loop service list is reachable, and both before/after images show.
      - _Requirements: R3.3_
    - [x] 3.3 Correct the port toward the Design:
      - the `local-seo` and `google-search-ads` case links (`ZINC Site.dc.html:411,413`);
      - the homepage contents line (`ZINC Home Blend.dc.html:289`);
      - the homepage title;
      - `.c-quote` set in upright Inter 400.
      - **Verify:** the strings match the Design source, and the screenshots for task 5 show it.
      - _Requirements: R2.3, R4.3_
    - [x] 3.4 Fix the remaining content defects:
      - JSON-LD authors: `Person` with name only; `Organization` for "Team ZINC"; no `jobTitle`;
      - `robots.txt`: disallow `/admin/` and `/api/`; remove the `/thanks/` disallow;
      - rewrite the `admin/index.astro` comment without the section-sign character;
      - live-mode copy from owner-approved text, with demo strings only in demo mode.
      - **Verify:** JSON-LD parses on every article; `robots.txt` content matches; a U+00A7 scan of `src/` finds nothing; a live-mode build contains none of "design preview", "Inquiry preview", "Demo inquiry" or "sample information".
      - _Requirements: R2.4, R2.5, R14.1, R14.2_
    - [x] 3.5 Rework the contact form for no-JS use:
      - extract `src/components/ContactForm.astro`;
      - add `src/pages/contact/send.astro` (`prerender = false`) as the no-JS form target, which re-renders the form with escaped values and the error (status 422);
      - add `src/lib/inquiry.ts` with `validate()` and demo-mode handling;
      - remove all Turnstile code and variables.
      - **Verify:** `tests/inquiry-validate.test.ts` covers every field limit, the 11 slugs, the 4 budgets and the 4 timelines; with JavaScript off, a bad submission shows the error with the values kept; in demo mode nothing is sent.
      - _Requirements: R5.1, R5.2, R5.3, R5.5_
    - [x] 3.6 Add the response headers:
      - security headers in `vercel.json`: `nosniff`, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'`;
      - Astro `security.csp` with the origins in design section 10;
      - a secret-pattern scan of the static output in `check-site.mjs`.
      - **Verify:** the built HTML carries the CSP meta tag; the scan fails on a planted test string and passes when it is removed.
      - _Requirements: R15.1, R15.2_
  - [x] 4. Checks and CI
    - [x] 4.1 Update `scripts/check-site.mjs` to the Design contracts and the fixes in design section 4.2:
      - the Summit alias;
      - the wider placeholder scan;
      - JSON-LD parsing;
      - sitemap and robots content;
      - the secret scan;
      - the 15,360-byte gzip first-party JavaScript budget;
      - the 43-page set.
      - **Verify:** `node scripts/check-site.mjs` exits 0 on the build and fails when one page is removed.
      - _Requirements: R2.1, R16.2, R17.1_
    - [x] 4.2 Update `scripts/verify-site.mjs` and add `scripts/serve-static.mjs` (Node static server on 127.0.0.1). Apply these fixes:
      - decode entities before comparing text;
      - skip `/admin/` and `/api/` in the crawl;
      - check what is actually displayed instead of the `hidden` property;
      - a real before/after assertion;
      - reduced-motion checks at 375 and 1440 px;
      - Event Timing INP measurement;
      - the matched-chromedriver install.
      - **Verify:** `--mode quick` and `--mode full` both exit 0. The full run covers the 320–2560 px overflow sweep, no-JS, reduced motion, axe in both themes, and INP under 100 ms.
      - _Requirements: R3.1–R3.6, R16.1, R16.5, R17.2_
    - [x] 4.3 Add a `test` script running `node --test 'tests/*.test.ts'` (the quoted glob; `node --test tests/` finds no `.ts` files).
      - **Verify:** `npm test` exits 0.
      - _Requirements: R17.3_
    - [x] 4.4 Update `.github/workflows/ci.yml`:
      - keep the `build` job and add `npm test`;
      - `browser-verify` runs `node scripts/verify-site.mjs --mode quick`.
      - **Verify:** both jobs pass on the M2 PR (ticked during task 7.1).
      - _Requirements: R1.9_
  - [x] 5. Public visual review rounds
    - [x] 5.1 Write `scripts/capture.mjs`. It captures every public template and its Design reference, rendered from `current-design/` served on 127.0.0.1 via each file's hash route, in light and dark at 375, 768 and 1440 px. It also captures the interaction states. Output goes to `/Volumes/Satechi Hub/zinc-digital-web-review/visual/m2/round-<n>/`.
      - **Verify:** round 1 contains every template × theme × width pair.
      - _Requirements: R17.6_
    - [x] 5.2 Run review rounds until one finds no mistakes.
      - Round 1 is reviewed by the implementer. Every later round is reviewed by fresh KiroCrew reviewers (`task_run`), given only the screenshot pairs, the Design files and the checklist.
      - Each round writes `findings.md`; each mistake is fixed and re-captured.
      - **Verify:** the final round's `findings.md` reads "No mistakes found". Earlier rounds list every fixed item.
      - _Requirements: R2.3, R3.5, R17.6_
  - [x] 6. Lighthouse after M2
    - [x] 6.1 Write `scripts/lighthouse.mjs` (mobile preset, one URL per public template) and run it on the M2 preview.
      - Review the reported issues and fix the real defects.
      - **Verify:** the report is saved under `/Volumes/Satechi Hub/zinc-digital-web-review/lighthouse/m2/`. Scores are reported and nothing fails on them.
      - _Requirements: R16.3_
  - [x] 7. M2 PR
    - [x] 7.1 Run `node scripts/verify-site.mjs --mode full`, then the milestone PR steps. Tick 4.4 when `build` and `browser-verify` pass on the PR.
      - **Verify:** PR merged; the empty diff was confirmed before the branch reset.
      - _Requirements: R18.1_

- [x] M3 — Data, auth, contact · merged as #9 (`98d2fdf`)
  - [x] 8. Database baseline, tests and the first migration
    - [x] 8.1 The owner puts `SUPABASE_DB_URL` in the git-ignored `.env`. Produce `supabase/migrations/0001_baseline.sql` with the `pg_dump` command in design section 7.1.
      - **Verify:** the file contains the tables, policies and functions listed in requirements 1.2.
      - _Requirements: R9.1_
    - [x] 8.2 Write `scripts/db-test.mjs` and the `supabase/tests/*.sql` permission tests. Identities: anonymous, authenticated non-staff, editor, owner and offboarded. Assertions use `DO` blocks that raise.
      - **Verify:** run against the current schema, the tests report the known gaps in requirements 1.2 as failures, and the rehearsal leaves no change behind (re-check with `list_tables`).
      - _Requirements: R17.4_
    - [x] 8.3 Write `supabase/migrations/0002_site_fixes.sql` per design section 7.2 and rehearse it with `db-test.mjs`.
      - **Verify:** all permission tests pass inside the rehearsal.
      - _Requirements: R6.2, R9.2, R9.3_
    - [x] 8.4 **Owner go:** apply `0002_site_fixes` to the project (design section 7.1).
      - **Verify:** read-only SQL confirms on the live database the new columns, the dropped policy and the new grants, `staff_role()` and the `security_invoker` view; `get_advisors` (security) returns nothing; `supabase gen types --project-id zeetlqskfvsfbllrhzre` regenerates `src/lib/database.types.ts`, and `npm run check` exits 0.
      - Exception (5 Oct 2026, pending the owner's confirmation): the advisor's leaked-password-protection warning stays, because that setting needs the Supabase Pro plan and the site has no password sign-in (signup disabled, one-time links only).
      - _Requirements: R9.2, R9.4_
  - [x] 9. Auth configuration
    - [x] 9.1 Add `supabase/config.toml` and the invite and magic-link email templates (design section 6.1), with SMTP via `env()`.
      - **Owner go:** run `supabase config push`.
      - **Verify:** the Management API read-back shows signup disabled, the redirect URLs, the templates and SMTP; a sign-in attempt for an uninvited address creates no user (checked with read-only SQL on `auth.users`).
      - _Requirements: R7.1, R7.5_
  - [x] 10. Server foundations
    - [x] 10.1 Add the dependencies `@supabase/supabase-js` and `@supabase/ssr`, with the lockfile in the same commit.
      - **Verify:** `npm ci` and `npm run build` exit 0.
      - _Requirements: R7.8_
    - [x] 10.2 Write the helpers and middleware:
      - `src/lib/env.ts`;
      - `src/lib/supabase.ts` (server client plus admin client);
      - `src/lib/auth.ts` (`requireStaff`, `safeNext`);
      - `src/middleware.ts`: session refresh, `locals.staff` from `staff_role`, and the headers in design section 6.3;
      - `src/data/private-routes.ts`.
      - **Verify:** `tests/auth.test.ts` covers `safeNext` with `//evil`, `/\evil`, `%2f`, `:` and valid admin paths; `npm run check` exits 0.
      - _Requirements: R7.8, R8.1–R8.8_
  - [x] 11. Sign-in, sign-out and the first owner
    - [x] 11.1 Build the auth routes:
      - `src/pages/admin/login.astro`: no enumeration, the `zinc-next` cookie, and a rate limit;
      - `src/pages/admin/auth/confirm.astro` (`verifyOtp`);
      - `POST /api/admin/signout`;
      - remove the old callback page and the localStorage token code.
      - **Verify:** on local dev, a staff sign-in sets HttpOnly session cookies; sign-out clears them; a link opened in a second browser lands on `/admin/`.
      - _Requirements: R7.5, R7.6, R7.7_
    - [x] 11.2 Write `scripts/bootstrap-owner.mjs`. **Owner go:** the owner runs it for their own address.
      - **Verify:** the owner signs in on the preview and `staff_role()` returns `owner` for them.
      - _Requirements: R7.4_
  - [x] 12. Live contact path
    - [x] 12.1 Add the `nodemailer` dependency. Write `src/lib/mail.ts` and complete `src/lib/inquiry.ts`: rate-limit count, insert, `notify()` with an 8-second timeout, and the status update.
      - Wire them into `/api/inquiries/` and `/contact/send/`.
      - Remove the Resend and `api/inquiries/email.ts` code.
      - **Verify:** `tests/inquiry.test.ts`, with fake database and mailer, covers validation, the size limit, the origin check and the honeypot; the rate limit (5 per 10 minutes, 20 per day); database failure, which returns a retryable error and sends no email; email failure, which keeps the inquiry and marks it `failed`; and the no-JS 303 and error paths.
      - _Requirements: R5.4–R5.7, R6.1, R6.3–R6.5, R15.3_
    - [x] 12.2 Add `POST /api/admin/notify`, which re-sends a failed inquiry notification through `src/lib/mail.ts`.
      - **Verify:** a unit test shows a `failed` row becoming `sent` and `notify_attempts` incrementing.
      - _Requirements: R6.6_
  - [x] 13. Deployment checks and the live smoke test
    - [x] 13.1 Write `scripts/check-deploy.mjs` (design section 11) and run it on the M3 preview with the bypass secret.
      - **Verify:** pages and unknown-path statuses as expected; admin pages 302 and staff APIs 401 without a session; noindex, `no-store` and `frame-ancestors` headers; the function runs on Node 24.
      - _Requirements: R8.1, R8.2, R8.7, R17.4_
    - [x] 13.2 **Owner go:** the owner enters the Vercel environment variables, then one smoke inquiry is submitted:
      - Supabase keys;
      - SMTP user, App Password and notification recipient;
      - hash salt;
      - **Verify:** the email arrives at the recipient; the row shows `sent`; the test row is removed afterwards with the owner's go.
      - _Requirements: R6.4, R18.6_
    - [x] 13.3 Check the SPF and DKIM state by DNS query and report it to the owner. The DNS change itself is the owner's.
      - **Verify:** one SPF record includes `_spf.google.com`, and the DKIM selector record resolves.
      - _Requirements: R6.7_
  - [x] 14. M3 PR
    - [x] 14.1 Run the milestone PR steps.
      - **Verify:** PR merged; the empty diff was confirmed before the branch reset.
      - _Requirements: R18.1_

- [ ] M4 — Admin · implementation merged as #12; first Publish and granted Google data still require live verification
  - [x] 15. Admin migration
    - [x] 15.1 Write `0003_admin.sql` per design section 7.2 and rehearse it with `db-test.mjs`. **Owner go:** apply it.
      - **Verify:** read-only SQL confirms the `live` columns, `publish_all`, `admin_cache` and the foreign-key changes; the advisors return nothing; generated types updated; `npm run check` exits 0.
      - _Requirements: R9.3, R9.4_
  - [ ] 16. Admin shell
    - [ ] 16.1 Port `ZINC Admin.dc.html` into `AdminLayout.astro` and `src/components/admin/*`, `admin.css`, and `src/scripts/admin/{shell,drawer,toast,board}.ts`:
      - the sidebar (8 views with live counts), the theme toggle, View site, the connection-status chip and sign-out;
      - a URL per view, and loading, empty and error states.
      - **Verify:** axe passes in both themes at 375 and 1440 px; the drawer closes with Escape and returns focus; the toast's Undo works by keyboard; nothing shows sample or invented figures.
      - _Requirements: R3.1, R3.6, R10.1–R10.4_
  - [ ] 17. Inquiries and Staff
    - [ ] 17.1 Build the Inquiries view and its APIs:
      - the four stages with counts;
      - cards showing notification status;
      - the drawer: stage chips, notes, next step, Email (SMTP or `mailto:`), Archive with Undo, Restore, re-send notification;
      - refresh on focus and every 60 seconds.
      - **Verify:** on the preview, an inquiry moves through all stages, archives and restores, and each change appears in `inquiry_events` with the actor.
      - _Requirements: R10.6–R10.9, R6.6_
    - [ ] 17.2 Build the Staff view and its APIs: list, invite, resend invite, revoke, role change and offboard (owner only).
      - **Verify:** an editor gets 401/403 on owner actions; removing the last owner is blocked; an offboarded test user's next request is denied while their token is still valid; test users are deleted afterwards.
      - _Requirements: R7.2, R7.3, R7.9, R8.5, R10.5_
  - [ ] 18. Pages, Posts, SEO and publishing
    - [ ] 18.1 Build the Pages, Posts and SEO views and the content APIs:
      - `src/lib/seo-score.ts`, ported from `ZINC Admin.dc.html:140`;
      - New post (title, slug, layer, excerpt, Markdown body).
      - **Verify:** a saved edit persists, and the live site does not change.
      - _Requirements: R11.1–R11.4_
    - [ ] 18.2 Add the `marked` dependency and write `src/lib/content.ts`, which loads published content at build (design section 7.3). Render published admin posts in the article layout.
      - **Verify:** a build with a published test post produces its page and sitemap entry; a build with a deliberately wrong key fails.
      - _Requirements: R11.3, R11.6, R2.1_
    - [ ] 18.3 Build `src/lib/vercel.ts` and the Publish route (owner only): `publish_all`, then the deploy hook, then publish status in the admin.
      - **Owner go:** run the first real Publish.
      - **Verify:** the published change is live on the production alias after the triggered deployment; the admin shows the publish time and result.
      - _Requirements: R11.5, R8.5_
  - [ ] 19. Dashboard, Stats and Backend
    - [ ] 19.1 Build `src/lib/google.ts` (service-account JWT via `node:crypto`; GA4 and Search Console) and `/api/admin/metrics` with `admin_cache`. Use them in the Dashboard and Stats views.
      - **Verify:** with the owner-provided service account, the KPIs match the GA4 and Search Console interfaces for the same range; without it, the cards say what is needed; "AI citations" shows "No data source".
      - _Requirements: R12.1, R12.2, R12.5_
    - [ ] 19.2 Build the Backend view: deployments, publish status, the contact form card, and Redeploy (owner only, with confirmation).
      - **Verify:** the deployment list matches `vercel ls`; Redeploy creates a production deployment.
      - _Requirements: R12.3, R12.4_
  - [ ] 20. Admin visual review and checks
    - [ ] 20.1 Run capture and review rounds for every admin view (as in task 5) until a round finds no mistakes. Output goes to `/Volumes/Satechi Hub/zinc-digital-web-review/visual/m4/`.
      - **Verify:** the final round reads "No mistakes found".
      - _Requirements: R17.6_
    - [x] 20.2 Re-run `db-test.mjs` and `check-deploy.mjs` on the M4 preview.
      - **Verify:** both exit 0.
      - _Requirements: R17.4_
  - [x] 21. M4 PR
    - [x] 21.1 Run the milestone PR steps.
      - **Verify:** PR merged; the empty diff was confirmed before the branch reset.
      - _Requirements: R18.1_

- [ ] M5 — Research · migration applied; projects and private file ingestion verified against production Supabase
  - [x] 22. Research migration
    - [x] 22.1 Write `0004_research.sql` per design section 7.2: the `tsv` column and index, `search_chunks`, and the private `research` bucket with its policies. Rehearse it. **Owner go:** apply it.
      - **Verify:** read-only SQL confirms the column, index, function and bucket; the advisors return nothing; `npm run check` exits 0.
      - _Requirements: R9.3, R9.4_
  - [x] 23. Projects, sources and ingestion
    - [x] 23.1 Build the Research view and its APIs:
      - projects;
      - sources with status;
      - Note ingestion (up to 200,000 characters), with `chunk()` producing at most 120 chunks.
      - **Verify:** a note becomes `ready` with chunks; a blank project name shows a message; an anonymous user cannot read research tables (`db-test.mjs`).
      - _Requirements: R13.1–R13.3, R13.9_
    - [x] 23.2 Write `src/lib/research/fetch.ts` (design section 9), with `RESEARCH_URL_ENABLED` off until the tests pass.
      - **Verify:** `tests/research-fetch.test.ts` rejects every case in requirement R17.5 and accepts a public test page through the stub resolver. The flag is turned on in the same commit as the passing tests.
      - _Requirements: R13.4, R17.5_
    - [x] 23.3 Add the `unpdf` and `mammoth` dependencies. Build the signed upload-URL route, the browser upload script and file extraction.
      - **Verify:** fixture PDF, DOCX, TXT and MD files become `ready`; an encrypted PDF and an 11 MB file end in `error`.
      - _Requirements: R13.2, R13.3_
    - [x] 23.4 Build SERP ingestion through SerpAPI (`SERPAPI_KEY`), disabled while the key is unset.
      - **Verify:** a mocked response stores the top 20 results; without the key, the source option shows "not enabled".
      - _Requirements: R13.2, R15.4_
  - [x] 24. Chat
    - [x] 24.1 Build `src/lib/research/chat.ts` and the chat route:
      - retrieval through `search_chunks`;
      - numbered, quoted sources;
      - subscription-backed GPT-6.1 Sol/Medium requests and the separately configured Claude adapter, with no tools;
      - citation mapping;
      - message persistence and a per-staff rate limit.
      - **Verify:** `tests/chat.test.ts` with mocked providers covers streaming, `[n]` mapped only to supplied sources, invented numbers dropped, the `error` status, and the 8,000-character limit.
      - _Requirements: R13.5, R13.6, R13.8_
    - [x] 24.2 Build the chat client script: streaming log, Send disabled while streaming, Cmd/Ctrl+Enter, auto-scroll, a model picker with disabled states, and source chips.
      - **Verify:** Codex availability reflects the local runner and completed subscription verification; GPT requires no API key. Existing research conversations and citations remain intact.
      - _Requirements: R13.5, R13.7_
  - [ ] 25. Research visual review
    - [ ] 25.1 Run capture and review rounds for the research view, including the empty, loading, streaming and error states, until a round finds no mistakes.
      - **Verify:** the final round reads "No mistakes found".
      - _Requirements: R17.6_
  - [ ] 26. M5 PR
    - [ ] 26.1 Run the milestone PR steps.
      - **Verify:** PR merged; the empty diff was confirmed before the branch reset.
      - _Requirements: R18.1_

- [ ] M6 — Launch
  - [ ] 27. Redirects and 410
    - [ ] 27.1 Write `scripts/redirect-map.mjs` and generate the proposed map at `/Volumes/Satechi Hub/zinc-digital-web-review/redirects/proposed.json` from:
      - the WordPress REST API (paginated);
      - the live sitemaps;
      - Search Console pages (16 months).
      - **Owner go:** the owner reviews the map.
      - **Verify:** every inventoried old URL has a 301 target or is marked 410.
      - _Requirements: R14.4_
      - 5 Oct CT: read-only script completed against live WordPress, live sitemaps and the existing Google connection (5 Jun 2025–5 Oct 2026). Inventory: 425 paths, 3 unchanged canonicals, 18 proposed article redirects matched by WordPress post ID, 404 paths awaiting classification/review. No old URL was retired or routing applied. Task remains open until the complete map is reviewed.
    - [ ] 27.2 Commit `src/data/redirects.ts`. Add the 301s to the Astro config and the `src/pages/[...gone].astro` handler. Rewrite internal links inside the migrated posts.
      - **Verify:** `scripts/check-redirects.mjs` on the preview passes for every entry (single hop, correct status and `Location`) and for 20 unknown paths (404).
      - _Requirements: R14.5, R17.7, R2.2_
  - [ ] 28. Analytics, `llms.txt` and indexing
    - [ ] 28.1 Add the Google tag (`GT-NNZRWNCF`, `G-BV43HRVJ18`, `AW-17071018445`), loaded asynchronously, Production only, with the `generate_lead` event. Exclude it from the first-party budget (D1). Add the `llms.txt` endpoint and the privacy disclosure (owner copy).
      - **Verify:** the tag appears only in Production builds; the budget check stays under 15,360 bytes; `/llms.txt` returns 200.
      - _Requirements: R14.2, R14.3_
      - 5 Oct CT: tracking, saved-inquiry lead event, optional explicit Ads conversion label, CSP resources and `llms.txt` implemented. The loader is asynchronous and checks the live hostname before loading, so Production's Vercel aliases do not collect test visits. Production `PUBLIC_ANALYTICS=on` configured. Preview/Production static checks and the real Google library browser check pass; test collection was blocked. Privacy/Terms remain empty pending owner-approved copy; task is not complete.
    - [ ] 28.2 Add the `X-Robots-Tag: noindex, nofollow` rule for `*.vercel.app` hosts in `vercel.json`. Confirm Deployment Protection is on for previews.
      - **Verify:** a preview and `zinc-digital-web.vercel.app` both send the header; an unauthenticated preview request is challenged.
      - _Requirements: R14.6, R14.7_
  - [ ] 29. Release candidate
    - [ ] 29.1 Run the full set on the release-candidate preview, and fix any LCP, CLS or INP miss:
      - `verify-site.mjs --mode full`;
      - `check-deploy.mjs`;
      - `db-test.mjs`;
      - `lighthouse.mjs` on every public template.
      - **Verify:** every script exits 0; LCP ≤ 1.2 s, CLS 0 and INP < 100 ms on every public template; the Lighthouse report is saved.
      - _Requirements: R16.1–R16.4, R17.1–R17.4_
    - [ ] 29.2 Run a final full-site visual round over every public template and admin view until a round finds no mistakes. Deliver the screenshot set and the fixed-mistakes list to the owner.
      - **Verify:** the final round reads "No mistakes found"; the owner has the folder path.
      - _Requirements: R17.6_
  - [ ] 30. Retirement
    - [ ] 30.1 List the obsolete preview files and scripts (design section 2 and PORT.md section 5.4) with their reasons, as a PR comment.
      - **Owner go:** approve the list. Then delete exactly the approved files.
      - **Verify:** CI passes after deletion; `check-site.mjs` and `verify-site.mjs` pass.
      - _Requirements: R18.3, R18.4_
  - [ ] 31. Launch readiness and the M6 PR
    - [ ] 31.1 Record the launch checklist in the M6 PR:
      - owner content approvals (results, logos, legal copy, live copy, authors, SMS number);
      - live mode approved and set on Production;
      - smoke inquiry received;
      - SPF and DKIM verified;
      - owner staff accounts present.
      - **Verify:** every item is checked, with evidence or the owner's written approval.
      - _Requirements: R2.7, R18.5, R18.6_
    - [ ] 31.2 Run `node scripts/verify-site.mjs --mode full`, then the milestone PR steps for M6.
      - **Verify:** PR merged; the empty diff was confirmed before the branch reset.
      - _Requirements: R18.1_
  - [ ] 32. Cutover
    - [ ] 32.1 **Owner go:** cut over DNS, in this order:
      - confirm the DNS host for `zincdigital.co` and `www`;
      - lower the TTLs a day ahead;
      - add the domain to the Vercel project;
      - switch the records, leaving mail records unchanged;
      - add HSTS for `www.zincdigital.co` in a follow-up PR to `main` (**Owner go:** merge, because HSTS is cached by browsers).
      - **Verify:** `dig` shows Vercel targets, and TLS is valid.
      - _Requirements: R18.7, R15.1_
    - [ ] 32.2 Within one hour, run the checks on the live domain:
      - `check-redirects.mjs` and `check-deploy.mjs`;
      - submit the sitemap in Search Console;
      - GA4 real-time hit;
      - a test inquiry delivered and visible in the admin;
      - `lighthouse.mjs` and the Web Vitals;
      - staff sign-in.
      - **Verify:** every check passes and the results are reported to the owner in CT.
      - _Requirements: R18.8, R16.3_
    - [ ] 32.3 Record the rollback (repoint DNS to the WordPress host within the lowered TTL) and leave WordPress running for about 30 days.
      - **Verify:** the rollback steps and the WordPress retirement date are in `docs/launch.md`.
      - _Requirements: R18.9_
  - [ ] 33. Cleanup
    - [ ] 33.1 After the last merge, remove the Kiro worktree and branch, and the scratch folder `/Volumes/Satechi Hub/zinc-spec-scratch/` (**Owner go:** for deletion). Keep the review evidence under `zinc-digital-web-review/`.
      - **Verify:** `git worktree list` no longer shows the spec worktree; a report of what was kept and removed is sent to the owner.
      - _Requirements: R18.1_


## Owner correction — Admin subscription and SEO, 16 Oct 2026 CT

- [ ] Subscription connection: remove GPT API-key wiring; Backend Connect/Reconnect; Mac runner starts at login; actual `gpt-6.1-sol`/Medium completion verifies readiness. Preserve Research and sources.
- [ ] Connection repairs: check staff/Supabase, GA4, Search Console, SMTP authentication, Vercel reporting and publishing; distinguish configuration from verified operation.
- [ ] SEO assistance: saved drafts, regeneration/comments, manual editing, comparison/restoration, measured title/description previews, both Florida locations, AI search/content/schema/technical recommendations, conflict protection; Publish remains separate.
- [ ] Delivery: focused tests, preview and fresh-agent review. Migration 0006 and production activation remain pending exact owner approval; source/test completion does not imply deployed functionality.

Owner expansion, 16 Oct 2026 CT: optimize the complete public site for SEO and AI search. Search-only metadata, linked factual structured data, safe JSON-LD, published-content-aware discovery and accurate article lastmod are implemented in the admin/SEO task. Migration 0007 preserves actual edit timestamps across publishing without inventing dates for unchanged or legacy content; application and SQL verification remain approval-dependent. Approved Privacy/Terms bodies remain required owner content, not generated or retired.


### Owner-authorized editorial cadence — 27 October 2026 CT

- [x] Configure three weekly editorial runs (Monday/Wednesday/Friday09:00 CT), beginning28October, using the existing app heartbeat mechanism. Automation: zinc-three-weekly-articles.
- [x] Establish twelve dated article briefs, with Wendy6/Kirk3/Jaymie3 and author-specific voice/scope in docs/editorial/schedule.md.
- [x] Draft Kirk's WordPress/PHP security and Astro migration article with current primary sources.
- [x] Rewrite the first article for business owners in Kirk Voice, verify current PHP/Astro claims, and create distinct on-brand studio artwork.
- [x] Publish the first article early on 27 October through Docker/protected release and verify live (PR40, 166tests/86HTMLchecks, live desktop/mobile); this fulfills the 28 October slot. Preserve every later date.
- [ ] Continue the scheduled mix, recording actual publication URLs, dates and checks separately from target dates.

- [x] Prepare Wendy’s30October content-hub draft and distinct studio artwork; inspect unpublished desktop/mobile preview.
- [x] On30October, publish retained Wendy draft/art through fresh scoped review, Docker and protected PR41; verify live author/schema, desktop/mobile and featured listing.

### Owner-approved blog remediation and local growth — 2 November 2026 CT

Scope/evidence: existing State and docs/editorial/research/2026-11-02-blog-repair.md; preserve editorial schedule and original bylines/dates/URLs. No push until the complete remediation audit passes.

- [x] Reconcile44published articles and record per-article repair/preservation decisions; retain explicit external-access and business-identity gaps.
- [x] Repair shared summaries, content visibility, illustration fit and connected publishing/discovery metadata.
- [x] Complete and substantively verify the eight priority article repairs with useful examples and resources; fresh correction review2November, local validation passed.
- [x] Complete and substantively verify remaining33article repairs; preserve the three recent feature bodies and approved resources; all44specific decisions retained.
- [ ] Recheck metadata/schema/resource and rendered completeness against the full owner plan; fresh independent editorial/source review remains part of the final-head release gate.
- [x] Complete distinct Miami and PanamaCity pages and required category connections; prepare listing corrections and neutral review process. Owner confirmed websitephone/addresses; external profile edits and visitorhours remain unverified.
- [x] Fresh scoped final-head review, Node24Docker, protected PR47 merge, production readback and bounded discovery submission (IndexNow202; indexing unverified).
- [x] Record actualrelease date2November2026 and follow-up dates2December2026,1January2027,31January2027 CT; distinguish deployed,indexed,cited and qualifiedinquiries.
- [ ] Perform the30/60/90day measurement reviews when due; native ZINC access and verified business-profile facts remain open dependencies.

Owner rejected completeness after PR47. The recorded technical release remains factual, but the affected content/local milestones are reopened. Every article needs a specific observed finding and reader-task acceptance result, not a shared generic repair description.

2November latestowner: STOP USING DOCKER. Correction uses localNode24 tests/check/build/siteaudit; retainprotectedPR/Vercelrelease. Approved16file retirementcomplete; all44blogsretained. Localacceptance passed176tests/237Astrofiles/100HTML,44metadata/schema checks,19downloads and264structuralviewport/themechecks. Corrected sevenadditionaleditorialfindings and assetvalidatorregressions. Correction protectedrelease/productionreadback remains open; earlierPR47receipt is not this correctionreceipt.

### Owner expansion — Claude weekly SEO review, 3 November 2026 CT

- Requested backend: Claude Opus 5.5, High effort; review all SEO settings, public pages/blogs and native ZINC traffic evidence; suggest specific fixes awaiting approval.
- Separate schedule: Monday 8 AM America/Chicago, including daylight saving changes. Preserve the Monday/Wednesday/Friday 9 AM CT article automation and Wendy's unpublished November 4 draft.
- Use existing Google connections and `admin_cache` reports, bounded public-host reads and one idempotent scheduled review. No Docker, GitHub Actions, new reporting service or automatic publishing/settings changes.
- [x] Implement and independently review the report, protected endpoints, evidence/usage receipts and existing-admin display; validate with local Node 24 and rendered inspection.
- [x] Owner approved production activation on 3 November CT. Applied only the report policy (history version `20261103222000`); all five existing cache rows and unrelated policies remained unchanged. Configured dedicated ZINC `ANTHROPIC_API_KEY` and random `CRON_SECRET` as production-only Vercel Secrets. Opus 5.5 model access returned HTTP 200. PR52 merged at `24989b3d2561138eefc781e9a3b994e65b234e47`; deployment `dpl_6rMccxJuuX5ELCpryGFdmEkEZLmX` is promoted on the live domains. Cron definitions and authenticated Monday-08:00-CT gating verified; unauthenticated requests return 401.
- [x] Complete and verify the first live review. Completed 4 November 2026 at 6:27 AM CT; canonical receipt and qualifications below supersede the earlier open checkpoint. Historical first manual attempt `seo_review:manual:7fc5e94e-7e96-48d4-b2af-1ffbc2653aa8` failed safely with an incomplete response and accepted no recommendations. Claude Console request `req_011CggnHxWtJ2HFeAjYL7a5j` reports model `claude-opus-5-5`, 263301 input / 16000 output tokens and 157.473-second latency. No page, post or article schedule changes were applied.
- Prepared in `codex/claude-weekly-seo`: existing SEO admin panel, native GA4/GSC aggregates, bounded public HTML/settings checks, service-written `admin_cache` reports, idempotent weekly claims, provider model/effort/usage receipts and migration `0009_seo_review_reports.sql`. No content, publication or article-schedule writes.
- Local proof: 182 Node tests; Astro check with zero errors/warnings; build; site check across 100 HTML files; live public scan of 98 sitemap pages (44 article URLs), all HTTP 200; actual panel rendered with simulated setup/completed/failed/corrupt states at 1440px/390px; native local PostgreSQL cache-policy rehearsal passed the 12 permission assertions in `99_seo_reviews.sql`. Local auth fixtures do not verify deployed RLS or native Google account access. Evidence is in the worktree's ignored `.scratch/`.
- Pre-activation audit: the Supabase connector denied the read; the existing native CLI/psql route verified the production policies and ZINC properties. The separate 0005 Google-owner predicate is not deployed and remains outside this slice. Applied only the two restrictive report policies, preserving current permissions. The screenshot's expiring architect key was not used: a dedicated `zinc-website-seo-production` key is stored as a Vercel production Secret.
- Preparation review at `a25efc4cdb8851f582af1dfe9fa2612ac613b960` found no source blockers; final packaging-only review at `52a2ed61fdaaea2769f20cfe4f245708d1f740b5` passed before the protected PR52 merge. Those source reviews did not establish a completed weekly run; current activation and first-run states are recorded above.

### First-review completion repair — 3 November 2026 CT

The first High-effort response used the entire 16000-token allowance, which includes thinking and report text; the Console did not expose its stop reason. PR53 merged the repair at `efe2d8f9866852589eee0e82094f16ad53f9164d`: preserve Opus 5.5 High, allow 32000 output tokens and a 420-second bounded provider call within the shared 600-second Astro function ceiling. Save provider model/stop reason/message/usage receipts before completion/JSON validation, including rejected responses. No automatic paid retries or fallback. The owner's subsequent instruction holds further Claude calls until the researched review contract receives approval. First successful report remains open.

### Owner expansion — Analysis and review contract, 3 November 2026 CT

- Paid reviews remain paused (`SEO_REVIEW_ENABLED=false`, default closed). Preserve Opus 5.5 High and Monday 8 AM CT; token-free owner site checks establish the baseline independently. No Docker or GitHub Actions. Article automation and Wendy's unpublished draft remain unchanged.
- Dedicated Analysis area: versioned deterministic checklist gauges and comparable score history, anomalies, native traffic comparisons, separate article/service sparklines, and a separate performance area for each canonical category/service pillar. Match the actual ZINC site fonts (Manrope 800, DM Sans, IBM Plex Sans), palette and admin shell; inspect desktop/mobile rendering.
- Pillar means the owner's category of articles supporting its mapped service, not a long guide. Review distinct customer questions, useful answers/examples/actions, coverage and intent overlap, peer links and contextual service next steps. Measure native referred service-page views separately from article traffic, unique clicks and qualified enquiries. Never add overlapping pillars as disjoint audiences.
- Review all 15 areas: SEO scores, anomalies, search demand, metadata, indexing, structured data, images, internal links, content, local search, AI search, technical, performance, traffic behavior and settings. Scores describe HTML heuristics; they do not certify writing, facts, rankings or AI citations. Missing field-performance/full-editorial evidence remains explicit.
- Triangulate dated Ahrefs, Semrush, Search Engine Journal and Search Engine Land research; native ZINC query groups describe site visibility. Retained US/English keyword estimates in `docs/editorial/research/2026-11-03-ai-search-keyword-volume.json` identify AI SEO as highest among the nine tested phrases (6600 reported monthly), while AI search optimization has clearer buyer-language evidence. The backend provider/averaging method were not returned. Do not merge incompatible vendor estimates or treat survey preferences as search counts. Refresh market research after 30 days; no automatic paid lookup.
- Homepage description remains a proposal until the owner settles positioning. No public metadata was changed in this preparation. Weekly analysis can flag unsupported wording/business facts even when the length/checklist score is 100.
- [x] Local integrated proof: 198 tests, zero Astro errors/warnings, successful production build/static checks across 100 HTML files, actual-font admin fixtures at desktop/mobile widths and corrupt/baseline states. Reproduce and fix the fresh review's malformed pillar-referral guard finding.
- [x] PR54 merged at `cdfafe57baf54eb8c50e599c82f7ffeca2c28f21`; production deployment `dpl_3V6DKKLy69nGN6yCBmvkXrRDAQdd` is promoted. First token-free owner scan `seo_review:scan:f032cf4c-92e0-4b8b-888e-90959dbe50f8` completed at 5:24 PM CT with no model/usage receipt; all 99 targets scanned, native GA4/GSC/query/referrer access verified, 44 articles / 11 services / 10 populated pillars. Fresh review PASS and runtime receipts are in PR54.
- [x] PR55 corrected the live scan's false block on `/thanks/` using the same canonical `noindexPaths` policy as `SiteLayout`, retaining the intentional exclusion and versioning the method as `.2`. Regression preserves unexpected public noindex failures; final-head review, protected release and the corrected production baseline are verified in PR55.
- Real-data preparation found the first review envelope near the existing input-size guard. Group identical head values with original names/positions, and state repeated daily-summary limitations once; retain full saved evidence and every supplied measurement. Regression reconstructs duplicate/conflicting head fields and preserves malformed input. Do not raise the input allowance or trigger a paid call to test this.
- [x] Owner approved the researched instructions, exact proposed homepage wording and first Opus 5.5 High run on 3 November 2026 CT. PR55’s corrected production scan verified `.2`, 98 scored / 0 blocked / 1 excluded, native sources and preserved editorial boundaries.
- [x] Release the exact approved homepage description and approved research state through a fresh review/protected PR; align only the homepage’s saved description, enable production `SEO_REVIEW_ENABLED=true`, then run and verify the first complete Claude review with model/effort/message/usage receipts. No automatic content changes or fallback. Preserve both schedules and Wendy unpublished.

### Approved activation and transport correction — 3 November 2026 CT

PR56 merged at `25895be`; production deployment `dpl_D37so4XQDFGWg1JUJ4Ng8iPaqa9K` is promoted. Exact accepted homepage description is verified in search/OG/Twitter metadata and the saved homepage field; all other homepage fields/publication state remained unchanged. Production activation is true; both schedules and Wendy draft/art hashes are unchanged.

Manual run `seo_review:manual:797bfea5-b689-4ba5-a74c-5d64a430f08f` failed with `fetch failed`. Claude Console request `req_011CggzhFCX54hj9wMhWoFSm` records Opus 5.5, 262496 input / 31898 output tokens, Error 499 and client disconnection after 300.064 seconds; no completed response or stop reason is exposed in the available Console view. This matches Undici’s default 300-second header wait despite the caller’s 420-second abort deadline. Primary references: [Undici Client](https://github.com/nodejs/undici/blob/main/docs/docs/api/Client.md), [Claude streaming](https://platform.claude.com/docs/en/build-with-claude/streaming).

`codex/seo-review-stream` changes only provider transport to SSE, retains early identity and explicitly partial usage, rejects missing terminal/error/abort responses, and saves final usage before validation. Thinking/signature deltas are discarded. Terminal text is retained before validation so a completed response rejected by the validator can be inspected without a duplicate paid request. Preserve Opus 5.5 High, 32000 output allowance, 420-second provider/600-second function limits, approved instructions and no automatic retries/fallback. First complete review remains open; another manual verification follows the protected repair, with every attempt preserved.

### Completion allowance and response normalization — 3 November 2026 CT

PR57 is merged/promoted at `eb51faa`. Streaming run `seo_review:manual:e01744b7-ca5c-40a2-93a8-e8e8528a8cb0` retained real provider identity/usage (`msg_011Cgh2ftwZry6UXAQwTnEGJ`, `req_011Cgh2ftBgFVUCrYodsZfCG`, Opus 5.5 High, 262419 input / 32000 output tokens) and ended with `max_tokens`. Its retained text is cut midway through an optional recommendation; it is not accepted as a completed report. Offline inspection found 15 complete checks and 11 complete recommendations, a JSON fence and references to the already-supplied nested research source IDs. No additional paid request was used to diagnose these issues.

`codex/complete-seo-review` raises the completion allowance to 48000 tokens and provider deadline to 480 seconds within the unchanged 600-second function ceiling; model, High effort and all researched instructions remain unchanged. Only complete JSON fences are normalized; truncation/prose remain invalid. Existing research entries become first-class evidence IDs without duplicating their facts, preserving strict citation validation and working source anchors. Both schedules, homepage wording, register and Wendy remain unchanged. First full completion is still required after the protected correction; no automatic retries or fallback.


### Verified review corrections and RFP goal — 4 November 2026 CT

Owner direction: fix verified defects through the protected PR process; keep SEO Monday 8 AM CT and articles Monday/Wednesday/Friday 9 AM CT unchanged; keep Wendy unpublished; no Docker or Actions. The site’s business goal is requests for proposals (owner, 4 November). Service and case-study paths should support a proposal request. Submission events, qualified RFPs and won projects are distinct measures.

- [x] First Opus review is complete, independently reread from canonical `admin_cache`: `seo_review:manual:5b014cb7-e4b8-4f50-9fcd-84f73ab6055c`, commit `7e3174e15dc9a97281af2152f30a772736fdad56`, `claude-opus-5-5` / high, terminal `end_turn`, 262561 input / 32055 output, 15 checks / 26 recommendations. Completed 6:27 AM CT. [PR58 runtime receipt](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/58#issuecomment-6630665143). Earlier failure/open notes are history, not instructions to repeat a paid run.
- [x] Revalidate source defects: incorrect Panama City/Miami roles, AI-search naming, generic category copy, TikTok’s missing direct service route, unrelated search-service proof, and asset links passing the contextual-navigation check.
- [x] Deliver `codex/verified-seo-corrections` through scoped final-head review, protected PR and production desktop/narrow readback. Preserve all URLs, article authors/dates, category memberships, approved homepage description and existing design. The link-scoring method becomes `seo-html-2026-11-04.1`; comparisons across versions are not improvements.
- [x] Align only the saved homepage title with the deployed title and focus keyword with approved AI-search positioning. Preserve description, all unrelated fields and null live snapshot; do not invoke `publish_all`.
- [x] Mark existing `generate_lead` as a GA4 key event, explicitly approved by the owner in this chat. Read back through the native Admin API. This is prospective submission reporting, not qualification or a historical rewrite.

Pre-change native investigation, 4 November, 7:36 AM CT: property 494489814 contains tag G-BV43HRVJ18. Its key events are `purchase` and `TY`; `generate_lead` is not marked. For September 9–October 6 versus October 7–November 3 (America/New_York, ZINC hosts), `TY` supplies the earlier five key events; the later window records six `generate_lead` events with zero key events. This establishes a configuration mismatch, not six qualified RFPs. No test inquiry was sent.

Search Console, homepage only, final web data September 7–October 4 versus October 5–November 1 (America/Los_Angeles): 35 query/page pairs appear in both returned datasets. Their impression-weighted position moves 11.31 to 49.43; 52 newly returned current pairs average 54.75. Broader query mix alone does not explain the observed change. Query omissions, location/device mix and causation remain unresolved. Raw query text is not retained in the receipt. October 27 has 332 Direct desktop views in 14 sessions, six engaged; this pattern does not identify bots or internal users. No filters or access changed.

Open content/evidence dependencies: `src/data/legal.ts` still contains empty approved Privacy/Terms bodies and descriptions, matching task 28.1; no approved replacement was found in current content or saved page rows. Owner-approved legal text is required. No legal promises were invented. Summit outcome/provenance claims, broader manuscript compliance, category intent/coverage, genuine crawler/indexing checks and field performance remain unverified or separate editorial work. The original model report remains untouched: actual count 44, not 43; privacy filtering is not a proven explanation for the device discrepancy; filters are prospective; public case-study excerpts do not prove every outcome. The 99/100 historical HTML checklist is not a traffic or ranking result.


SEO and measurement implementation checkpoint, 4 November 2026 CT:
- Owner's latest priority is SEO, metrics and goals. The requested database-backed CRM and Square quotes/invoicing remain a subsequent phase; qualification, proposal, won/lost and collected-revenue measures are not available yet.
- Native GA4 key event `properties/494489814/keyEvents/16271118961` is verified as `generate_lead`, once per event. The change is prospective. Existing historical key-event totals are not used as the proposal-submission measure.
- Saved homepage title and focus keyword were narrowly corrected with optimistic row matching; approved description and null live snapshot are unchanged. No bulk publication.
- Search Console accepted `/sitemap.xml` at 7:50 AM CT: 98 submitted pages, zero errors/warnings. Native URL inspection returned indexed/PASS with matching Google/user canonicals for home, SEO, local SEO and contact. This does not establish all 98 pages are indexed. The obsolete sitemap submission is still present; removal is unresolved under the exact-deletion approval requirement.
- GA4 retention is already 14 months, attribution data-driven paid/organic, windows 30/90 days. Preserve its America/New_York reporting timezone to avoid an unexplained period discontinuity; user-facing timestamps remain CT. No unsupported bot/IP exclusion was applied.
- Event-scoped page_type, service_slug, contact_method and error_type definitions are configured. Full public-page context, ordered RFP steps, CTA and contact-method events are implemented locally. Successful saved requests alone emit generate_lead; validation/server/network errors remain separate. Explicit `zinc_qa=1` visits and preview hosts do not load analytics. No names, email addresses, messages or raw error text enter the new event payloads.
- Existing Clarity project ZINC Co (`p6dd6jjhx3`) and its GA4 integration are verified. Direct tagging is implemented locally, with proposal form masking and private/admin/preview exclusion. Regional consent behavior is preserved; no consent is fabricated. Production collection remains unverified until release.
- Analysis now includes proposal-event counts for matched 28-day windows, native ordered-user funnel and acquisition-channel counts. Source denominators, reporting timezone, coverage and unavailable historical steps remain explicit. The native funnel API returned successfully; its pre-instrumentation 460 visitors do not establish form abandonment.
- Local verification: 214 tests, Astro check zero errors/warnings, production-flag build and static checks across 100 HTML files passed. Intercepted browser tests verified ordered events, one classified server failure and one saved-success conversion; no external test inquiry was sent. Final rendered/review/release verification remains pending.

- Native UI also confirms Search Console is already linked to ZINC STREAM 11402019356. Internal Traffic and Developer Traffic exclusion filters are already active; no filters were changed. Four new event-scoped definitions were reread through the native Admin API. Actual funnel rendering was inspected at 1440px and 390px; mobile keeps stage counts/rates visible without page overflow.

Fresh scoped review of 490af4a found one issue: the full trailing window would include visitors from before step instrumentation. Corrected to use a separately labelled funnel period beginning November 5, the first complete GA4 day after release; pre-instrumentation and partial launch-day visitors never enter the funnel denominator. Submission comparisons retain matched 28-day windows. Boundary regression added. Final-head recheck pending.


Release receipt, 4 November 2026 CT: [PR59](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/59) squash-merged as `e7ffb3a`; Vercel production `dpl_7YN3SfR2dSaS8htE2VGPA6vyYGCj` is READY for that commit. Live SEO copy, proposal heading, masked form and explicit QA exclusion verified. Real public-page GA4 collection returned 204; existing Clarity loader/SDK returned 200 and collection returned 204, with no CSP violations. No test inquiry or paid model call. Native sitemap readback now contains only `/sitemap.xml` after owner-approved removal of the obsolete submission. Four new custom dimensions and the correct key event were verified natively. Schedules and all seven Wendy files match their original hashes.

Live verification exposed an existing Analysis refresh defect: admin focus/minute refresh replaces the region, discarding directly attached scan/review handlers. `codex/seo-refresh-verification` delegates controls to the current region and marks an in-flight request active so the shell preserves it. Browser regression reproduced zero requests before the fix and one after replacement with the fix; failure clears busy state and preserves disabled Claude controls. Scoped correction/release and a production native-only scan remain open. Similar stale configuration cleanup is explicitly authorized by the owner; obsolete TY key-event status and its old `/thank-you/` generation rule are being retired without deleting collected events.


Final settings and release checkpoint — 4 November 2026 CT (supersedes the pending settings/release notes above):
- [x] PR60 merged at `fe536711c3abbcd3c3e63e5b534847e232d43c5a`; production `dpl_4dausGu88emJcr3Dd5EKwP1JWoky` READY. Fresh scoped review found no issues. Local region-replacement regression, Astro check and production build/static checks passed.
- [x] Owner authorized obsolete sitemap removal and similar stale settings cleanup. Native reread confirms only canonical `/sitemap.xml` remains, with 98 submitted URLs and zero errors/warnings. `generate_lead` remains the once-per-event key event; obsolete `TY` key-event designation and old `/thank-you/` event-creation rule are removed. The provider's default `purchase` definition remains; it is not used as an RFP or revenue measure.
- [x] Both unused Site Kit custom dimensions are archived. Available native daily historical aggregates through November 3 were preserved and reconciled first: post date 358 rows / 545 events; post type 7,704 rows / 22,902 events. Canonical `admin_cache` key `ga4_retirement:2026-11-04:sitekit` retains original definitions, period, metadata, daily observations, provenance and reconciliation; exact JSON readback matched. These are native aggregate observations, not raw user/event exports. Native audiences had no dependency on either definition. Collected GA4 events were not deleted. Native Admin API now returns only `page_type`, `service_slug`, `contact_method`, `error_type`.
- [x] Final-head review of the mixed-period fix passed before PR59 release. Ordered funnel reporting begins November 5 (first full GA4 day after deployment); earlier/partial launch-day visits are excluded from the denominator. Submission-event comparisons retain matched 28-day windows.
- [x] Final signed-in production **Refresh site checks** and saved/rendered metrics verified at 10:07 AM CT: canonical `seo_review:scan:520d1ca2-2ba8-4fdf-99c0-7bc72087aa21`, current production commit `fd59b40d1a782659521f95aaee8088680e990a8b`. Native GA4/GSC available; 6 recorded submission events (October 7–November 3) versus 0 (September 9–October 6), Direct 4 / Referral 2; no RFP evidence gaps. Ordered funnel correctly awaits November 5. 100 targets / 99 scored / 0 blocked / 1 intentional exclusion / 0 unavailable, mean 99.2 under `seo-html-2026-11-04.1`; this inventory includes the separately published Wendy article. No model/usage, paid Claude rerun or external test inquiry. The earlier login blocker was mistaken: the existing Analysis session worked after a full reload loaded the deployed controls. Check that session before inferring an access blocker from another sign-in tab.

Release and settings readback: [PR60](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/60). CRM qualification/proposal/won/lost and Square invoicing/revenue remain the subsequent phase under the owner's SEO-first direction. Approved legal text and the separate editorial/provenance/performance gaps remain open.

### Service-specific article proposals and US-only intake — 4 November 2026 CT

Owner selected a floating article bar opening a right-side proposal drawer. Reuse the existing form, with the article's first valid assigned service as its primary pillar, stable service slug on the bar/drawer/events, that service preselected, and the article path saved with the inquiry. Existing category memberships remain unchanged. The alternative contact-page navigation was considered; it remains the no-JavaScript fallback. Desktop uses a restrained fixed bottom bar and a white right-side drawer; narrow screens use the full width. Keep dismissal, Escape, focus restoration, scrolling, mobile safe areas, and Clarity field masking. A closed drawer emits no form-view or form-step events. Only saved submissions emit a conversion.

The existing form's honeypot, field/origin/body checks and atomic per-IP submission limits remain the spam controls. Add strict US country checks to both submission routes before persistence/notification, including unknown-country rejection, plus a narrowly scoped Vercel firewall country rule for those POST endpoints. Readable public articles and staff routes remain outside that rule. No paid provider or new CAPTCHA account; IP country is not proof of physical location and cannot exclude every VPN user.

Implementation plan (existing Astro/TypeScript stack, Node 24; scoped protected PR):
- [x] Add stable pillar selection and service copy; reuse ContactForm inside an accessible native-dialog drawer and fixed article bar, with ordinary contact-link fallback.
- [x] Initialize forms only when visible; retain service/article context through steps, validation, successful submission and GA4/Clarity, without recording visitor fields.
- [x] Verify existing spam safeguards; add US-only shared intake gate and narrow native firewall rule with an inspected draft and readback.
- [x] Test mixed-pillar mappings, closed/open/reopened drawer events, keyboard/mobile behavior, form errors/success without real inquiries, US/non-US/missing-country rejection, and existing rate/honeypot behavior. Run local checks/build, scoped fresh review, protected release and production readback.


Owner extension: replace the personal phone with private “Message Jaymie” and “Message Wendy” forms. Jaymie handles every proposal and general message; Wendy receives content questions. Owner selected existing ZINC email delivery with phone notifications (SMS/WhatsApp/provider setup declined). Phone notification settings remain on each recipient’s email app. Remove public phone text/links, JSON-LD and llms.txt, and current SEO-generation facts. Use the current inquiry table, mail transport, spam gates and staff board; distinguish message intent from proposal conversions, including resends. Existing six inquiries retain their original data and no invented classification. Add one nullable intent column plus an atomic submission-function update; exact production migration approval remains required under AGENTS.md. Short forms require name, email and message, preserve article source, and have a no-JavaScript contact-page fallback. Desktop/mobile drawers use the accepted brand tokens and accessible native dialogs. This is the owner-selected email approach; click-to-call was rejected because it exposes the number, and no paid messaging provider is introduced.
- [x] Verify private message routing, phone removal, non-RFP measurement, staff labels, migration rehearsal/review and production release/readback.


Owner selected Bear Claw for the homepage hero during this milestone. Use the existing approved `bear-white-devices.png` composition for the initial Build pane with the Bear Claw case-study link, retaining the accepted three-lane hero and other two panes. Existing approved asset, no regenerated imagery.

Production preparation, 4 November 2026 CT: owner explicitly approved migration 0010; applied and reread. All six original inquiries reconcile byte-for-byte on their original fields (including dates), with new intent null. Column nullable/no default; RPC stores new intent; only service_role retains execution. Existing production INQUIRY_NOTIFY_TO is jaymie@zincdigital.co and SMTP is configured. US-only form POST firewall draft contained exactly the reviewed rule and was published; active readback verified: firewall version 1, enabled, exactly the reviewed valid rule, no draft or bypass changes. Local 225 tests, zero Astro errors/warnings, 101-page static checks, database permission/rate/intent rehearsal passed and rolled back. Browser message routing payloads, non-RFP events, Clarity masking, mobile overflow, Escape/focus, US denial and no-JS contact fallback verified without real mail. No-JS article-to-contact fallback retains contact rather than originating article path; scripted drawer preserves article path.

Final visual checks: Bear Claw Build hero verified at 1440px and 390px with the approved composition and case link; mobile displays the full device composition without cropping or a covering gradient. Demand/Intelligence tab behavior remains intact. Mobile-menu → Message Jaymie → Escape restores the visible menu toggle and clears the scroll lock. Existing static check confirms the 15 KB gzip per-page first-party script budget. Production migration receipt: six rows, original-field digest `2690438d12dbc695a28dbfda6c4819a8` unchanged; no historical intent assigned. All message submissions in browser verification were intercepted, so no test lead/email was created.


Final release receipt — 4 November 2026, 10:51 AM CT: [PR65](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/65) protected squash merge `936531b781de7924b2f2ad637396a896ef5cb539`; final source head `44c7a900fd3c2cca132c0fd5f3d7244fb72022c3` passed scoped review. Production `dpl_83mroRvaZdMAZPBmUWLEheL3N3y6` is READY at the merge SHA with www/apex aliases. Homepage Bear Claw hero, matching high-priority preload/social image, both private contact forms, article service drawer and llms.txt read back HTTP200 without phone fields/links. Live browser confirmed loaded Bear Claw/link, AI-search preselection and original article source, Wendy intent/Clarity masking, and mobile layout without overflow. Existing signed-in Chrome inquiry board loaded the four active historical cards with “Inquiry · Jaymie”; no access or load error.

Both live submission routes accepted US-connection honeypot probes without persistence, notification or lead conversion (API200 `{ok:true}`; no-JS303 `/thanks/`). Supplying a forged GB country header did not change that result, consistent with the platform overwriting client geography headers. Non-US/missing-country rejection is covered by shared-handler tests and the active, reread firewall rule; no actual foreign-network probe was performed. No external test email was sent. Phone push notifications depend on each recipient’s existing email-app settings and were not enabled or verified on their devices. The production sender/recipient configuration and server-side route logic were verified. Required CRM qualification/proposal/won/lost and Square/revenue work remains the subsequent phase, as previously recorded; no downstream sales outcome is inferred from a submission.


### Owner correction — preserve the dynamic hero, 4 November 2026 CT

The owner explicitly rejected the white-background Bear Claw composition and corrected scope: **keep the existing dynamic design hero and only update the images inside its mockup screens**, using https://www.bearclawusa.com/. The earlier white-backed choice and mobile layout change were assistant errors, not an approved redesign. Restore the original hero markup, three-lane tab script, layout, motion, masking and mobile rules from the pre-change source; change only the Build mockup asset/alt and matching preload/social source. The new image retains the original dark laptop/phone/stone composition with Bear Claw’s currently rendered desktop/mobile site inside the displays. No changes to Demand/Intelligence or other uses of the original UOS artwork. This correction supersedes the earlier white-composition selection above; its prior release receipt remains historical evidence. For future image substitutions, preserve the existing hero design and change screen contents only unless the owner explicitly asks for a layout change.
