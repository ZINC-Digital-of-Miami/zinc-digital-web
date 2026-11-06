# Tasks — Finish and launch the ZINC Digital website

## Topic subscriptions — deployed and signup verified, 5 November 2026 CT

Owner requested Subscribe access throughout the site, blogs and segments, with readers receiving only chosen subjects. The later “finish this up” direction resumed account integration. Owner approved one Web Design signup test using **jaymie@zincdigital.co** and directed leads to Jaymie. Results were coordinated with **Fix verified SEO review issues** (`01a1a6c1-2da2-7291-a269-7681e1d2fd4b`).

- **Released:** PR #88 squash-merged as `d6ef3470d790075c7dcfa8623bad7be59522c593`, including PR #87's explicit article service ownership. Vercel production `dpl_2BNzqhVpQA91DDsm48fSBWV7WHsx` is READY and aliased to `www.zincdigital.co`; `/subscribe/` returns 200. Git deployment did not start automatically, so the existing authenticated CLI created one production deployment from that exact merged Git commit. No infrastructure, secret or protection changes were made; no Docker/Actions execution was requested by this task.
- Shared desktop/mobile navigation/footer Subscribe links and callouts cover home, services, service details, blogs, categories, articles and authors. All 11 topics match registered services. Each service/category/article selects its explicit topic; general pages open the chooser. All 45 repository article's exact primaryService subscription URL was verified live. No inference from related ordering or inquiry-to-marketing enrollment. The signup utility stays noindex/absent from sitemap.
- **Constant Contact:** form **ZINC | Topic how-to subscriptions**, ID `2781d4d0-5120-4d57-90aa-85d5fda4775c`, is active. Its 11 dedicated **How-tos:** lists are mapped in `src/lib/subscription-topics.ts`. Client/general lists are excluded. Subscriber profile preferences expose these 11 choices; the Update Profile email-footer link is enabled. Daily subscriber notices are saved to **jaymie@zincdigital.co only**, reopened and visually verified (`.scratch/cc-notifications-saved.png`). Existing proposal/general inquiry source routes to Jaymie; editorial questions remain Wendy's.
- Native signup loads only after **Open signup form** and disclosure. Local jQuery/Underscore avoid the provider's Cloudflare fallback. Only selected subjects are checked; exact list IDs/count/uniqueness are validated before native button submission. Provider/reCAPTCHA CSP permissions are scoped to the signup page; optional site analytics/advertising remain independent. Privacy wording describes the actual integration. No campaign blast, bulk import, purchase, migration or new API credential occurred.
- **Real test succeeded:** owner Chrome submitted `jaymie@zincdigital.co` with only Web Design checked and displayed **Thanks for signing up!**. Account profile readback shows **Email subscribed • express** and exactly one list, **How-tos: Web Design**. Receipt `.scratch/jaymie-live-success.txt`, `.scratch/jaymie-live-success.png`, `.scratch/jaymie-membership-verified.txt`. The profile was originally added 27 August 2025; the earlier empty search result did not establish that no contact existed, so this is an existing-contact opt-in/update, not a proven new-contact creation test. Identity fields remain present. The earlier headless attempt stopped at CAPTCHA with zero signup POSTs. No CAPTCHA was solved or bypassed. Provider UI briefly displayed a reCAPTCHA quota notice, but the live signup completed successfully.
- **Verification:** fresh scoped source/integration review passed at final PR head `bfdedb8`; Node 24 Astro check: 0 errors, 0 warnings, 12 existing hints; 261 tests; build/static checks across 103 HTML pages; 250 local browser assertions; 13 native integration assertions; 55 production assertions. Covered exact chosen topics, every article's destination, no pre-open provider requests, no Cloudflare requests, CSP violations or JavaScript errors; mobile fit, scoped dark accessibility, visible simulated success, invalid-list blocking and provider failure. Actual live success was separately observed in dark theme. Receipts `.scratch/{tests-final,check-final,build-final,static-final,browser-final,native-final,live-subscription}.log`, `live-subscription-results.json`, and live screenshots.
- **Evidence limits/operating rule:** contact membership and live form success are verified; Jaymie's inbox receipt is not. Contact Activity showed no recent activity, and the hub's active Welcome label alone does not establish delivery. No automated blog-email campaign was created. Send each topic campaign only to its corresponding How-tos list(s); do not broaden recipients to all contacts. The native provider collects checked list inputs globally, so adding other widgets/pop-ups requires renewed consent-scope checks. Current configuration has two INLINE forms; this site mounts only this one.
- **Follow-up delivery verification, 5 November 2026 CT:** the subscription worker reports a repeated 55-assertion pass. The parent independently inspected the worker’s `topic-subscriptions/.scratch/all-topics-live-results.json`: all 11 topic URLs opened the native form with only the exact corresponding How-tos list selected; signup POSTs were blocked for this read-only check. Current public form remains ACTIVE with the 11 canonical list IDs. Inbox receipt remains open: connected Gmail belongs to Kirk, not Jaymie, and no copied message was found; the Mailopoly connector returned subscription_inactive. Current Constant Contact activity/welcome-trigger inspection awaits an uninterrupted Chrome window because another active owner workflow is using it. No further signup, newsletter or campaign was sent. Next: inspect the actual welcome trigger/list scope and delivery activity, then verify Jaymie inbox receipt or an authoritative delivery log.
- All owned build/test/browser/server/CLI processes exited or were explicitly stopped and verified; the task-created test tab was closed, while owner and social-work tabs were preserved. No persistent task service remains.

## Case-study graphic numbering and row layouts — 5 November 2026 CT

Owner requests the large numbered circles and connected approach graphic across all 17 case studies, plus correction of underfilled rows like Bear Claw’s one-layer row. Reuse the circle/step treatment in approach lists, detail rows and chapter headings while preserving each case’s content and approved imagery. Match each case’s approved accent. The source audit found one/two active layers in a fixed three-column grid, three Bear Claw facts in a four-column grid, and one U.S. Oil brand image in a three-column grid. Adapt these actual rows to their contents. Existing Las Vegas logo, website detail and enterprise context rows have the expected item counts and require numbering only. Rendered review also found an unconstrained standalone Summit case image causing horizontal overflow; constrain shared case images to their containers and balance the tall Summit brand-book row with a bounded portrait and vertically centered copy. Square/Google accounts and other sessions remain excluded. At intermediate desktop widths, three-layer headings place the circle above the title so Intelligence retains its space without shrinking or breaking the label. Release and rendered verification follow in the milestone PR.

## Hero lettering direction — 5 November 2026 CT

Owner requests more distinctive lettering after the larger-title/smaller-laptop release: outlines or a visual texture inside the letters. Apply solid fuchsia ZINC, outlined and diagonally hatched DIGITAL, and a closer teal accent dot. The owner flags period spacing: place the dot inside the reserved word span, after the actual DIGITAL lettering, as an inline baseline-aligned circle with a defined gap; remove the manually translated glyph. Preserve the larger/higher placement, smaller right-side laptop, original Summit artwork, BI scene and mobile fit. Keep this as accessible HTML/CSS within the existing hero.

## Homepage title sizing — 5 November 2026 CT

Owner requests a larger “ZINC DIGITAL” title extending past the window center. Increase desktop type from 7vw to 11.2vw and remove its smaller short-window override. Preserve the approved grouped layout, artwork, lane headings and existing mobile sizing. Owner also confirms the laptop should sit farther right beside the text. The owner subsequently asks that laptop artwork be smaller and the title slightly higher. Contain the Build scene in a right-aligned 84%-width desktop region and lift the desktop text group to 40% of the stage; preserve mobile artwork and compact-height safeguards. The remaining Summit Demand hero/scene is rejected: replace every rendered instance of that scene with the retained `smd-devices` source, including homepage, lane, service and case presentations. Preserve source pixels rather than generating a replacement website. This checkpoint records implementation intent; release verification follows in the milestone PR.

## Full-window graphic correction — 4 November 2026 CT

Owner requests a full-window homepage hero with artwork off to the right and an extended background, rather than a graphic moved below the title. Keep the main/lane headlines together, vertically centered and farther left; overlap over the image is approved. The grouped desktop text and BI scene were explicitly accepted. Optimize mobile during the work and blur the bottom lane controls. These decisions supersede the earlier constrained 82%-width picture and tall stacked layout. No Google/Square operations.

- Source cause: the original image was constrained inside a padded wrapper, with an 82%-width desktop rule and a separate mobile cover/crop. The hero now uses the available viewport below navigation, a unified left text group and expanded scenes. Responsive candidates include the actual native source width, with hero quality 100. Source images are 1672×941; no 4K or artificial-upscaling claim is made. Narrow layouts keep the artwork and all controls in view.
- One necessary local preview uses the installed Astro CLI on 127.0.0.1:4173, PID 59175. Stop and verify its process tree at completion. No duplicate server, npx service, app startup change or other-session cleanup is authorized.
- Summit correction: the owner confirms the business left ZINC and its newer site is another provider's work. Portfolio rendering excludes later `case-smd-*` captures and current-site links. It uses retained ZINC presentations `smd-devices` (1930×815) and `smd-hero` (1369×1149), both recorded as published in March 2025. No exact engagement end date or claim that these are the newest possible surviving captures is invented. Additional later ZINC-era originals were not established by the scoped archive lookup. The unsupported comparison and newer-provider page views are replaced by the retained ZINC website detail; branding/campaign materials remain. Static guards reject the later captures/current-site attribution while preserving other clients' source-backed comparison checks.
- Verification: 256/256 tests pass; Astro check reports zero errors/warnings and 12 hints; the production build and static checks across 101 HTML pages pass. The structural image scan covers 1040 rendered image instances with no missing dimensions. All three homepage scenes were inspected at 393×852 and 1920×1080, including the grouped text and blurred controls. An obsolete 1700px headline override was removed. Representative rendered checks cover Work overview/lanes, Services hub/Web Design/BI, About, Contact, Blog/article, Miami and the corrected Summit case. Receipts are under `.scratch/hero-*.png`, `.scratch/graphics-mobile-*.png` and `.scratch/full-width-*.txt`. These are representative layout checks, not an exhaustive visual claim for every route. Final release is pending at this checkpoint.


## Current closeout — 4 November 2026, 4:23 PM CT

This is the current completion record. Dated checkpoints and unchecked historical acceptance items below preserve their original evidence; they do not mean the released functionality must be rebuilt. Latest owner scope excludes Square and Google operations and limits process/window cleanup to this work, preserving other sessions.

**Released and verified:** PR75 merged to `a74e1c9051d6134441e9317ea4644f5597c4ab85`; production `dpl_B7ActYHNN9w5N1czRSkXSYnXjUdX` is READY with its alias assigned. The visible consent bar supersedes the previous no-banner decision. Purpose-specific default-off consent, GPC/DNT precedence, plain descriptions, the approved manual retention schedule and Kirk's request-handling responsibilities are live. Existing evidence: 256 tests, 101 static HTML checks and 568/568 live deployment checks across 100 public pages. Desktop/400px inspection, keyboard Save, reject/reopen and selective-choice persistence passed. Live network-filter inspection was interrupted by owner browser activity; do not turn the executed loader tests into a claimed browser-network trace.

**Retention batch complete:** the owner explicitly approved clearing the exact five old inquiry hashes. The reviewed transaction committed November 4 at 4:09 PM CT; before/after fingerprints preserved all inquiry business content and associated history. Independent readback confirms five null target hashes, all seven inquiries, all 21 history events and zero remaining hashes older than seven days at that check. Normal modification timestamps may advance. No inquiry was deleted. Receipts are retained in the isolated checkout's restricted `.scratch/privacy-hash-batch.json`, `privacy-hashes-applied.txt` and `privacy-hashes-verified.txt`; the operational outcome is also recorded in PR75. The earlier pending-batch and pending-release statements are historical.

**Existing backend functionality:** core CRM and first Publish were verified in PR70/72; PR73 repaired Research source retrieval/citations, connection-check results through refresh, date gaps in Stats and private redirect headers. PR74 cleared the dependency audit. Those implementations exist in the current source; historical broader visual/permission/performance acceptance claims are limited to the actual retained checks. The public content digest remains `0c75e89f050b6a7795ad54188874943c3e8bf04295ad9fe922a89bb7e06e1975`, and Backend last showed zero unpublished changes with the approved 1:52 PM CT publish ready.

### Actual remaining work

- **Verification work still open:** the historical exhaustive public/admin visual, accessibility, theme/width and performance acceptance matrix is not fully evidenced. Existing targeted visual/static/live checks do not certify every historical gate. Preserve approved image quality. No new functional defect was established by this scoped status/source audit.
- **Source-dependent feature:** Stats AI-citation counts still have no approved measurement source. Keep the honest unavailable state; no proxy, invented zero, paid provider or new account is authorized here.
- **Operational work:** Kirk owns the approved monthly manual retention review and individual privacy requests. Actual provider backup expiry, downstream copies and all-system erasure remain unverified; Google/Square copies are excluded from this slice. No new request was read or sent. Future deletion batches still need their exact approval. No automatic erasure job is required by the approved manual process.
- **Evidence over time:** scheduled editorial operations and 30/60/90-day performance/business outcomes require the actual review windows and supported observations. A deployed technical change is not evidence of rankings, revenue or inquiries caused by it.
- **Excluded work:** Square activation/invoice/payment checks and Google profile moderation/field approvals remain paused. Other worktree/content changes and destructive infrastructure/file retirement are outside this exact cleanup scope.

### Process and window cleanup

Stopped and verified exits for abandoned ZINC preview servers PID17247 (4336), PID17950 (4346) and PID81477 (4328), after checking parent, working directory and lack of active connections. The old scratch preview PID92207 had already exited before a signal was sent; no credit is claimed for stopping it. Ports4173/4328/4336/4346 have no listener. The task's privacy verification window was no longer listed during final window inspection; no owner trading/other-session tab was intentionally closed. Preserve Chrome and the permanent Research runner PID892. Other sessions' host-managed MCP/runtime processes, the active AI Visibility preview and the application engine were left alone. Cleanup receipt: `.scratch/orphan-cleanup.json`. No new preview/server or background polling is needed for this documentation closeout.


## Privacy and retention completion — 4 November 2026, 3:44 PM CT

**Owner scope:** finish remaining privacy/retention work, make recommendations concrete, identify necessary owner decisions; leave Square and Google alone. Owner approved the proposed retention schedule with manual review, and confirmed Kirk, hello@zincdigital.co, the listed legal business name/address and the 3-business-day/30-calendar-day response targets. Owner subsequently requested a **visible consent bar**, superseding the earlier no-banner requirement, and rejected “replay” jargon. Implement the bar with plain descriptions and keep optional tracking off until a choice. No personal records, provider account settings or mailboxes were changed. Baseline is released main `a4eb061` (PR74); its security deployment and 568 live checks completed after the previous checkpoint.

### Verified implementation and actual gaps

- Baseline `a4eb061` public tracking defaults on when storage works and no opt-out/GPC/DNT exists (`src/lib/tracking-privacy.ts`). Footer opt-out and privacy signals were released in PR73; the older statement that no site controls exist is superseded. At that baseline analytics, advertising and activity recordings share one preference. A general opt-out does not establish informed, purpose-specific opt-in.
- Inquiry updates support archive, not erasure (`src/pages/api/admin/inquiries.ts`). Personal data also appears in `inquiry_events.payload`, quote scope/history, and notification email. The anti-abuse hash is stored on inquiries; the longest application rate window is 24 hours (`src/lib/inquiry.ts`). No retention cleanup exists.
- Research stores original files in the private `research` Storage bucket, extracted `documents.content`, indexed `chunks.content`, messages/citations and chat titles. Deleting a project cascades documents/chunks but sets chats' project reference to NULL; it does not delete their messages. Original files need separate Storage API handling. Source: current migration chain and `src/lib/research/ingest.ts`, `src/pages/api/admin/research/source.ts`.
- `codex_jobs.payload` and `result` duplicate prompts, excerpts and answers. A completed job can still be needed to reconcile a streaming assistant message (`research/chat.ts`, `research/pending.ts`); status/age alone is not sufficient for safe removal. The runner requests ephemeral threads; that does not establish upstream zero retention.
- Quote history and quotes have restrictive parent references; deleting an inquiry is not an all-related-records erasure. Accepted quotes/contractual evidence must be reviewed separately. No provider transaction access is part of this work.
- The schema has no authoritative last-substantive-contact or project-closure date, no legal-hold register and no erasure workflow. Generic `updated_at` can change for operational reasons and is not proof of client contact. Automated expiration must not guess these facts.
- Baseline public privacy wording accurately says records have no automatic expiry. This release replaces it with the adopted monthly manual-review schedule and explicitly states that review periods are not automatic deletion deadlines. Google mail/measurement copies, provider settings and actual backup retention remain outside this slice's verified state; do not claim all-system deletion.

### Owner decisions — approved in this chat

1. **Tracking — visible bar authorized:** show Accept all, Reject optional and Choose settings in a visible bottom bar; default optional tracking OFF worldwide with separate, unselected choices for measuring visits, recording clicks/scrolling and advertising. The footer reopens Privacy settings. This records the owner’s correction; do not restore the superseded no-banner design or customer-facing “replay” wording. Explain purpose/provider before each choice; save an explicit, dated/versioned browser preference, with a 180-day renewal interval. Expired/invalid choices, storage failure, GPC or DNT keep tracking off. Do not convert the existing combined permission into new purpose-specific consent. Withdrawal must be as easy as enabling. Website loader changes only: no Google/Square account access or settings. Tradeoff: fewer measured sessions/conversions because most visitors may never opt in. Use the documented provider consent signals before configuration, configure only selected destinations, and guard application events by purpose. Verify all eight combinations locally. Provider account settings are not inspected or certified.
2. **Retention — approved:** use the following business schedule with owner-reviewed batches. These are business review periods, not statements of statutory minima or automatic deletion deadlines. Applicable obligations, an existing client agreement or a documented legal/security hold override ordinary expiry only for the necessary records.

| Record | Approved review trigger/period | Qualification |
|---|---|---|
| Closed or unconverted inquiries, related notes/events and unaccepted quotes | 12 months after last substantive client contact | Active negotiations are reviewed, not silently expired; operator verifies the trigger |
| Confirmed spam | 30 days after receipt | Human classification; do not label every short/general message spam |
| Project-specific private research files, extracts, chats and citations | 90 days after confirmed project closure | Preserve authorized ongoing reference material; review mixed-subject documents individually |
| Completed/failed AI job payloads/results | 30 days after completion/failure | First reconcile durable answers and resolve streaming references; exclude queued/running jobs |
| Inquiry anti-abuse hashes | 7 days after submission | Clear only the hash; preserve the first 24-hour rate window and any specifically documented security hold |
| Essential accepted agreements/accounting evidence | 7 years after the relevant fiscal year ends | Confirm necessary record classes with accounting/legal obligations; not blanket retention of every message or research file |
| Minimal privacy-request/erasure receipts | 24 months after resolution | Case ID, dates, scope, outcome, exception and expiry; omit raw documents/message bodies and unnecessary identity evidence |

Review long-lived records monthly, looking ahead to upcoming deadlines. Short windows (7/30 days) need a suitably frequent operational review; monthly batches cannot truthfully enforce a seven-day limit. The owner approved monthly manual review, so the notice explicitly describes review targets and manual batches, not guaranteed automatic expiry. Individual requests can be assessed sooner. Policy approval does not authorize a scheduled deletion or the first exact batch. Each exact batch still needs owner approval under AGENTS.md.

3. **Accountability and public identity — confirmed:** Kirk is the accountable owner using existing `hello@zincdigital.co`; acknowledge within 3 business days and target resolution within 30 calendar days, with earlier applicable deadlines taking priority and any permitted extension explained. Owner confirmed the legal business name and privacy mailing address: ZINC Digital, 97 Oak Ave, Suite 7, Panama City, FL 32401; do not replace that with a guessed Miami address. No further identity decision is pending. No mailbox access or messages are authorized here.

### Manual erasure procedure — policy adopted; exact execution approval required

1. Receive via the existing privacy address; assign a minimal case record. Verify control of the original contact channel and proportionate interaction details; do not routinely collect government ID. Record requested scope and the applicable deadline. Confirm agent authority where relevant. No new ticketing service is needed.
2. Locate the subject's exact inquiry IDs and related event/quote IDs, research document/chunk/chat/message IDs, private file paths and job references. Review free text and copies as well as email-address fields. Record counts and categories in a restricted manifest, avoiding another full personal-data export. A shared project match is not permission to delete unrelated client data. Mail, local exports and provider copies are separate dependencies; Google/Square remain excluded and are explicitly marked unresolved.
3. Review accepted agreements, fiscal records, disputes/security incidents and contractual holds. Record the precise subset retained, reason, review date and access restriction. Do not retain everything indefinitely under a vague legal exception. Access/portability exports must omit other people's records and use an approved secure delivery route with an expiry; no external delivery is performed by this work.
4. Present exact target IDs/paths, affected counts, dependencies, exclusions and practical recovery limitations for owner approval. Revalidate timestamps and running/reconciling jobs immediately before mutation. Do not broaden service-role grants, delete entire users/projects or directly delete Storage metadata as a shortcut. Any necessary migration requires separate exact approval after review/rehearsal.
5. Apply only approved targets through supported database/Storage routes. Use a database transaction for related row changes; Storage and provider operations are not atomic with that transaction, so preserve a restricted retry manifest until both are verified. Handle file objects separately; handle chat/message chains explicitly rather than relying on project deletion; handle copies in job payloads/results and quote/event snapshots. Deletion and anonymization are distinct outcomes. No production delete SQL or executable eraser is introduced before scope and policy are approved.
6. Read back every target and related copy, reconcile before/after counts and confirm unrelated data remains. Mark each system complete, retained-on-hold, failed/retry or outside-authorized-scope. Do not tell a requester all-system erasure is done while email/provider copies remain unresolved.
7. For backups, verify this project's actual plan, PITR/off-site exports and expiry before promising a date. Restrict erased data from normal use pending expiry. Keep only the minimal approved suppression receipt and reapply deletions before a restored backup is reopened to staff/traffic. Database backups do not contain original Storage files, so verify those separately. No backup/project deletion is authorized.
8. Publish the approved ownership, periods and manual-review process, explicitly distinguishing review targets from automatic deletion; verify after release. Record the actual policy decisions and any still-excluded providers here; never mark implementation complete merely because this proposal is saved.

### Evidence and next action

Local verification: 256 tests passed; Astro check 0 errors/0 warnings (11 existing hints); production-flag build passed; static checks passed across 101 HTML files using `--analytics=on`. Existing-tab desktop and 400px inspection confirmed readable separate choices and working reject/reopen. Keyboard navigation reached Save; saving analytics-only survived reload with recording/advertising still unchecked. Read-only retention SQL verified `transaction_read_only=on`; five hash candidates, no 12-month inquiry candidates and no 30-day terminal-job candidates. Release/production verification remains pending this checkpoint.

Official sources checked November 4, 2026: [FTC business data minimization and written retention guidance](https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business); [ICO storage/access exceptions, including advertising requiring consent](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/); [Supabase database backup scope and plan-dependent windows](https://supabase.com/docs/guides/platform/backups). These support the approach, not a conclusion that every privacy law applies to ZINC or that a seven-year period is mandatory.

Implementation: `scripts/privacy-retention-review.sql` is a read-only review for the approved schedule. It reports exact hash IDs, age-screened inquiry IDs/dependent counts and old terminal jobs with unresolved-answer flags. It never invents project closure, spam classification or last substantive contact. Use the existing authorized native Supabase connection; retain the restricted result with the exact proposed batch. No new service, cron job, migration or automatic eraser is introduced. Next action: release and verify the authorized visible consent bar and approved manual-review notice, then present any exact deletion batch separately for approval. Square and Google stay untouched. Native read-only database inventory: 7 inquiries, 21 inquiry events, no quotes/quote events, 2 research documents, 4 messages, 1 private file and 9 completed Codex jobs. Five inquiry hashes are older than seven days; this identifies candidates only, not authorization to clear them. Receipt: `.scratch/privacy-inventory-live.txt`; connector permission was unavailable, so the existing authenticated native Supabase/psql read-only route was used. No personal field values were emitted. No subscription purchase, external message, account-setting change, deletion or migration occurred.


## Verified completion and security follow-up — 4 November 2026, 2:24 PM CT

PR [#73](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/73) is merged as `fb4968e7cd7a6e12028ca36256f8882dcb9ab09f`; production `dpl_9N1kjL4k1gtXKsdfbM7FQZWpCZpH` is READY with alias assigned. All **568/568 live deployment checks** pass across 100 public pages, including all ten previously missing admin redirect headers. Stats renders the full calendar and accessible daily table with explicit unreported dates. The deployed Research check completes on `gpt-6.1-sol`/Medium with **eight retrieved passages**, cited answers and a working saved-source drawer; its initial zero-source result is retained in the same verification conversation rather than erased. No client message or paid Claude request was sent. These receipts supersede the pre-release status in the audit below.

A current dependency audit found 15 production dependency findings (11 high / 4 moderate) plus development-tool findings. The separate `codex/site-security-patches` slice updates the existing Astro/Vercel/Nodemailer/Lighthouse stack within the current architecture and resolves affected transitive versions. No framework downgrade, `--force` fix, service purchase or production credential change. npm's full audit now reports **zero vulnerabilities**. Compatibility verification is complete: all 254 tests pass, Astro check reports 0 errors/0 warnings/11 existing hints, the production-flag build regenerated 2,378 images with unchanged quality settings, and static checks pass across 101 HTML pages. The tests exposed a previously undeclared `esbuild` import after an upstream removed that transitive dependency; it is now explicitly pinned at 0.28.2 for the test harness. Lighthouse and axe CLI version checks pass. Independent package/lock review passed. The protected release and production verification are the next step; this checkpoint does not claim the dependency slice deployed.

Remaining scope is operational/evidence-dependent: Square and Google approvals are excluded; retention/erasure and regional legal applicability need an actual owner policy; AI-citation counts have no approved data source and remain unavailable; real-user performance and 30/60/90-day outcomes await actual observations. No invented zero, inferred revenue or blanket “fully optimized” claim. Other active worktrees and destructive infrastructure retirement remain outside this slice's exact authorization.

## Site completion audit — 4 November 2026, 2:15 PM CT

Owner directs finishing everything available without Square or Google approval, and explicitly approves **footer privacy controls honoring Global Privacy Control and Do Not Track, preserving the no-banner design**. Work starts from production/main `0cba4fd` in the existing clean isolated checkout, branch `codex/site-completion`. Other dirty worktrees and owner browser tabs are preserved.

The earlier timeout/error-refresh release is complete: PR [#72](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/72), main `0cba4fdd56d78339043c2908bc04dde8e6994544`, production `dpl_8U7o9TvdnSC16FDUkR6ZaXwTo9xi` READY/alias assigned. Backend and the exact approved content digest were verified live. The 1:58 PM checkpoint below is historical.

Actual gaps found and repaired locally in this slice:
- Public tracking lacked visitor controls. Add a footer Privacy choices disclosure, saved browser opt-out, GPC/DNT precedence and default-off behavior when browser storage cannot be read or written. Both Google and Clarity loaders require the bootstrap's explicit allowed flag. The exact bootstrap hash is registered in CSP and checked in every built HTML page. No banner, provider change, client data transmission or compliance certification is introduced. The Privacy Policy describes current behavior and its limits.
- Ten anonymous admin redirects lacked `X-Robots-Tag`. Add `noindex, nofollow` before the login redirect; test the actual middleware against every private admin page.
- Connection-check results disappeared on shell refresh or could land in a detached card. Preserve the latest dated result and render into the current card, including during an in-flight request.
- The real Research smoke question reached `gpt-6.1-sol`/Medium but retrieved zero sources. Native read-only queries confirmed zero full-question matches and eight term matches from the ready project documents. Preserve exact matches first, then use bounded quoted terms through the same project-scoped/RLS search function only when the original query has no matches. Search failures remain errors; source IDs/citations stay intact. Remove the stale empty-chat prompt when the first message appears. No migration, new provider or paid Claude run.
- Sparse Google daily reports compressed calendar spacing. Preserve every reporting day, distinguish unreported values from observed zero, and provide an expandable exact-values table usable without hover.

Verification so far: original live deployment check passed 558/568 assertions across 100 public pages, with only the ten missing redirect headers failing. The built redirect inventory passes 860 requests, including 36 live targets and 20 unknown-path 404s. All 254 tests pass, including the actual-middleware redirect regression. Astro check has 0 errors, 0 warnings and 11 existing hints. Current Astro check/build/static receipts are in `.scratch/site-completion-*`; built static checks pass across 101 HTML files. Footer opt-out persists across a real browser reload; desktop and 400px layouts are readable. Actual Research shows one project, two ready sources and the available Codex subscription. No paid Claude review is needed: the completed November 4 review remains authoritative. Specific review found a readable-but-unwritable storage edge and it was repaired with a startup write probe and regression. A separate built-artifact check exposed the missing bootstrap CSP hash; explicit registration and the static gate now verify it, and independent re-review passed. Release/production verification of this slice remains the next action.

Backlog reconciliation: the implementation is substantially ahead of the original October milestone checkboxes. Admin source and public/private-route tests exist; first Publish, native Google connections, CRM and live rendering are verified above/below. Research shipped in PR13; M6 launch preparation shipped in PR16/17, and the current live domain, routing, headers and legal pages can be verified directly. Privacy/Terms shipped in PR71. These facts do not retroactively certify every historical visual state, exact performance threshold, external notification receipt or deletion approval. Do not rerun DNS cutover, recreate accounts, republish saved content or invoke a paid review to satisfy stale wording.

Remaining items requiring evidence or an owner decision, separate from this implementation:
- Square activation and Google moderation/approval are excluded by current direction.
- Regional consent/business applicability, provider advertising settings, record-retention duration and all-system erasure procedures remain unestablished. The approved opt-out control does not by itself establish worldwide legal compliance or automatic deletion. No retention/destructive policy is invented.
- Real-user performance and the scheduled 30/60/90-day outcomes require their actual measurement windows. Do not infer ranking gains, qualified RFPs or collected revenue from the HTML checklist or submission events.
- Historical cleanup of other worktrees, obsolete artifacts, accounts or infrastructure requires its exact approved deletion scope; this task does not discard other active work.

## Active completion checkpoint — 4 November 2026, 1:58 PM CT

Latest owner correction: **stop all Square account/setup work and finish the remaining backend**. Leave the existing connection alone. No further Square activation, Google test posts, support messages or client invoices were attempted. CRM and backend scope remains delivered as described below; provider activation is paused by the owner, not silently removed from scope.

**Core backend and CRM are deployed.** PR [#70](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/70) merged to `385978f2cd540d7920830b3b5407127d7b5ac385` at 1:50 PM CT. Production deployment `dpl_DzxB1RUfw22shswopJt5JoQ2h1P7` reached READY with its alias assigned. The independent privacy/terms release #71 was preserved. The board includes proposal, won and lost, while existing closed records retain an unspecified outcome. Saved quotes, dated quote history, integer-cent amounts, immutable invoice terms and optimistic saves are implemented. Provider operations remain inactive without website credentials; no live provider invoice/payment completion is claimed.

Owner explicitly approved **“Apply the CRM migration.”** The exact reviewed `0011_crm_square.sql` committed through the native Supabase route to `zeetlqskfvsfbllrhzre`. All 6 inquiry rows and 20 inquiry-event rows matched their pre-migration hashes. Both new tables have RLS enabled. The applied schema's permission suite passed in a rollback transaction, with zero quote/event sample rows left in production. The first attempt rolled back on an invalid assertion row comparison; the corrected assertion passed before COMMIT. Receipts: `.scratch/crm-applied.txt` and `.scratch/crm-live-permissions.txt` in the isolated checkout.

Owner explicitly approved **“Publish and verify.”** The sole pending homepage metadata record was published at 1:52 PM CT. Vercel deployment `dpl_8MrMFxSJidLM8cV63TTRzqeuNzPa` reached READY with the production alias assigned. Production `/content-revision.json` returned HTTP 200 and exactly matched the saved snapshot digest `0c75e89f050b6a7795ad54188874943c3e8bf04295ad9fe922a89bb7e06e1975`, with `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`. Backend displays **0 unpublished changes** and **Last publish: Nov 4, 1:52 PM CT · ready**. The hook response exceeded its former ten-second timeout, but the build completed; no duplicate Publish was submitted. The persisted receipt remains pending/unconfirmed, while its current ready status is correctly derived from the matching live digest. The publish lease was released. Receipts: `.scratch/first-publish-read.txt`, `first-publish-deployment.json`, `published-receipt.json`, and `published-receipt-headers.txt`.

Publishing now verifies the exact opaque digest of the snapshots actually used by the public build, rather than attributing an unrelated later deployment to Publish. A UUID/CAS lease serializes snapshot/read/hook operations, uses bounded calls and expires after two minutes. Failed content reads display unavailable, never a false zero. The local build without content credentials correctly emits a null receipt.

Production connection checks at **1:58 PM CT** verified Supabase/staff access, GA4 property 494489814, Search Console `https://www.zincdigital.co/`, Vercel deployment reporting, the existing completed Codex subscription verification and Workspace SMTP login. No email was sent. The first real Publish separately established end-to-end publishing. The existing runner PID 892 belongs to the owner and remains running.

Validation: #70 passed all 244 tests, Astro check (0 errors, 0 warnings, 11 hints), production build, all 101 HTML static checks, permission tests and specific independent source review. Desktop and 400px CRM/quote layouts were rendered using the actual templates with explicitly labelled local samples. Production board and quote drawer rendered correctly with existing records, and an anonymous quote mutation returned 401. Temporary fixtures and task-owned preview servers (PIDs 92796 and 22885) were removed/stopped. Screenshot receipts are `.scratch/crm-desktop.png`, `crm-quote-desktop.png`, `crm-quote-narrow.png`, `crm-narrow.png` and `crm-production.png`.

A small follow-up on `codex/backend-release-receipt` increases the hook timeout to thirty seconds (still within the lease) and refreshes after an action error to reconcile operations that may have completed. Its eight focused regression tests, Astro check, build and 101 HTML checks pass. Specific independent review passed: the worst-case operation budget is 110 seconds within the 120-second lease, dirty drafts remain protected and the regression executes the actual shell. The protected PR release is the immediate next step; this paragraph does not claim the follow-up is already deployed. Effective release instructions are local Node 24, no Docker and no GitHub Actions, per the current owner-approved AGENTS.md.

Completion scope:
- [x] Core backend operational checks, protected CRM release and production verification.
- [x] CRM proposal/won/lost stages, saved quotes, history and concurrency protection, preserving existing records.
- [x] Approved migration application, row preservation, RLS/permission verification and desktop/narrow rendering.
- [x] Owner-approved first Publish, matching live snapshot receipt and current ready status.
- [x] Release the reviewed timeout/error-refresh follow-up and verify its production revision — PR72, verified above.
- [ ] Provider activation and live invoice/payment verification: **paused by the owner's explicit stop**, not required for the completed core CRM/Publish verification. Do not resume account/setup work or request credentials.
- [ ] Google approvals, profile posting restriction and public personal-number removal: external pending states below; no full local-search-completion claim.

Google local-search blocker, verified November 4: all four moderation emails (11:36, 12:14, 12:38 and 12:48 PM CT) explicitly state that Google turned off posting for this Business Profile to prevent policy-violating edits; routing ID DPNB. The earliest notice predates the authorized plain-text test. Message IDs: `1a1a7a23231618e8`, `1a1a7c4d27a83928`, `1a1a7db4359d5589`, `1a1a7e44f5d20b5a`. The test was submitted once, rejected, and testing stopped. Google's account restrictions page reports the Google account is not restricted. The native appeals tool for exact profile 1858572599686865380 says “No rejected content to appeal.” This establishes a profile posting restriction, not an account-wide suspension or a specific policy trigger. No expiry or self-service removal action was exposed; support remains prohibited by owner direction.

Google profile recheck around 1:51 PM CT: description, Website Designer secondary category, local website tracking URL and appointment-required edits remain pending (Google states up to seven days). Phone settings say not publicly visible, while public search still exposes a call action/old personal number, so public removal is unverified. Google had restored the personal number as SMS chat; its removal was resubmitted under the existing privacy instruction and now shows removed/pending. Do not resubmit while pending. No post, support request or appeal was sent.

Browser constraint: reuse existing tabs. The owner's Ads tab was temporarily navigated for verification; restore `https://ouabc-bi-fusion.vercel.app/ads` at completion. Preserve the owner's second Tradovate tab. No task-created tab exists. Earlier assumptions that an existing unrelated tab could never be reused were too restrictive; temporary navigation and restoration satisfy the owner's instruction.

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

- [ ] M4 — Admin · implementation and live Publish/Google verification complete; historical exhaustive visual/performance evidence remains qualified by the current completion audit
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
    - [x] 18.3 Build `src/lib/vercel.ts` and the Publish route (owner only): `publish_all`, then the deploy hook, then publish status in the admin.
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
  - [x] 26. M5 PR · merged as #13 (`8473e81`)
    - [x] 26.1 Run the milestone PR steps.
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

### Claude recommendation follow-up — 5 November 2026 CT (work in progress)

Owner requested completion of the remaining recommendations and verification of the next scheduled run. The Monday 9:15 AM CT verification heartbeat `verify-monday-claude-seo-review` is active; it checks the November 9 scheduled receipt without making a duplicate paid call. Cron configuration is not proof of execution.

In `codex/remaining-seo-recommendations`, a reporting change aligns GA4 summary calendar dates with the Search Console windows while preserving the independently dated RFP funnel; it increases the landing-page fetch to 1,000 rows and discloses timezone boundaries and limits. Focused tests pass, including the Pacific-midnight boundary and a landing page beyond the prior 100-row limit. The change is not released. On November 5 the owner directed GitHub Actions for checks and release because organisation credits are restored, superseding the Docker requirement. The site checks workflow is being restored; its actual run and release remain to be verified. Remaining review recommendations, including content/evidence and performance work, remain open; do not treat this partial change as completion.

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

### Panama City Google Business Profile and recurring updates — 4 November 2026 CT

Owner authorizes optimizing the existing listing and recurring updates adapted from published blogs or other approved content. Goal: genuine prospective-client inquiries, relevant organic traffic and local leads; vendor solicitation, recruiting, spam and support are not qualified leads. Existing SEO Monday 8 AM CT and article Monday/Wednesday/Friday 9 AM CT schedules are unchanged. A narrow Astra High researcher checked current official local-profile/post guidance; native signed-in Google UI supplies account/settings evidence.

- [x] Confirm correct existing verified profile: **ZINC Digital**, 97 Oak Avenue, Suite 7, Panama City, Florida 32401; management identity `1858572599686865380`, place/fid `10490689812028155340`. No replacement profile or access change. Primary category remains Marketing agency. Website designer submitted as a relevant secondary category; pending Google review.
- [x] Submit a factual description focused on websites, local SEO, AI search optimization, paid media and business intelligence. Native editor readback retains the new description as pending; Google says review may take up to seven days. The old text was intact in the editor; the initial apparent truncation was the summary preview, not missing stored text.
- [x] Submit website destination `https://www.zincdigital.co/locations/panama-city/?utm_source=google&utm_medium=organic&utm_campaign=gbp_panama_city&utm_content=profile_website`. Destination returned HTTP200; native saved pending readback matches. Google says review may take up to seven days. GA4 campaign tagging supports traffic attribution; current inquiry rows do not store UTMs or a campaign-to-qualified-lead join.
- [x] Enable Advanced settings → Phone number → Don't show. Native readback is on, and Business information says **Not publicly visible**. SMS removal was submitted but Google subsequently restored the personal-number messaging option as a Google update. Removal was resubmitted; current state is still pending with Google's support-delay message. **Complete public SMS removal remains open.** A full Google Search reload at 11:41 AM CT still displayed the old call link despite the saved privacy setting; public propagation is also unverified. Do not claim personal-number exposure is removed or substitute another personal number.
- [x] Consolidate six redundant service entries (Advertising Branding, Corporate Logos, Logo Design, Paid Ads, Paid Advertising, Web Design And Development Services); corresponding branding/logo/PPC/website offerings remain. Add AI Search Optimization and Business Intelligence. Rename Google My Business Optimization to Google Business Profile Optimization. Save substantive descriptions for those three and Local SEO Services. Final native service-list readback confirms the additions/name change and absence of the six duplicates; all four saved descriptions were reopened and matched. Service edits remain pending Google review, stated as up to one day. No fabricated prices.
- [x] Create and read back active Codex heartbeat `zinc-google-business-local-updates`: **Tuesday and Thursday, 10 AM CT**, attached to this chat. It selects fresh eligible published content, uses approved imagery, checks for duplicates, uses tagged CTA links, verifies Google's actual status and retains receipts. It does not repeat one promotional post indefinitely. This cadence is an operational starting point, not a Google ranking rule. Review usefulness after four weeks, using native tagged traffic and actual staff-confirmed buyer inquiries where available; qualification/revenue remain unavailable until connected.
- [x] Prepare and submit the first Update with approved article illustration. Google post ID `746584289055578525`. Saved edit readback confirms schedule **5 November 2026, 10 AM** on the CT-configured Mac, correct copy, image and CTA; list status is **Pending**, not Live. The recurring task must inspect this starter post before creating anything for November 5.
- [ ] Verify Google's eventual approval/public readback for description, website, secondary category, service edits, SMS removal and starter post. No publication or ranking improvement is inferred from successful submission.
- [ ] Confirm real customer-facing office arrangements before changing hours, appointment requirement or address visibility. Existing Monday–Friday 9 AM–5 PM and appointment-not-required settings were left unchanged; a focused owner question is pending. Google-added physical-accessibility attributes are unverified and were not acknowledged as accurate.

**Saved business description**

ZINC Digital is a digital agency in Panama City, Florida, helping businesses connect their websites, search visibility and business reporting. We provide web design and development, Shopify development, local SEO, AI search optimization, paid media and business intelligence. Our work brings together clear service pages, conversion tracking and reporting so business owners can understand where inquiries come from and what happens next. We work with businesses in Panama City, Panama City Beach and the surrounding area, as well as clients nationwide. Visit our website to explore our work or request a proposal for your project.

**Starter post receipt**

Source: [Jaymie's local SEO guide](https://www.zincdigital.co/blog/local-seo-2026-operators-manual/), read from current content and verified public HTTP200. Approved image: `src/assets/articles/local-seo-business-profile.png`, inspected at full size and in Google's composer, 1,941,746 bytes. It is an illustrative device/profile mockup, not a photograph of ZINC's office or a claimed client. CTA: Learn more, linking to `https://www.zincdigital.co/blog/local-seo-2026-operators-manual/?utm_source=google&utm_medium=organic&utm_campaign=gbp_panama_city&utm_content=20261105_local_seo_guide`. Native edit receipt: `https://www.google.com/local/business/1858572599686865380/promote/updates/746584289055578525/edit` (requires authorized manager sign-in).

> Can a customer in Panama City tell what you do, where you work and how to request a proposal? Start your local SEO review there.
>
> Check that your Google Business Profile and website agree on services, customer-facing hours and contact options. Give each service a useful page, keep business information accurate and invite honest reviews from real customers. Track genuine project inquiries separately from profile views and clicks.
>
> Jaymie Wilhoit’s local SEO guide explains what to check, what evidence to keep and how to measure progress. Read the guide, then use our website to discuss local search support for your business.

**Publishing rules and evidence**

Use useful Update posts for Panama City/Bay County business owners, marketing leads and operations decision-makers. These are editorial audiences, not age/gender/income targeting settings. Start with one buyer problem and one practical insight; roughly 80–140 words is house style, not a Google requirement. Use the relevant approved article image or permission-cleared project work, without private dashboards, unsupported numerical claims, fabricated offices or removed clients. Link to the promised article or relevant service/location page. Genuine offers/events require their actual facts; do not recycle old discounts as current offers. Existing older posts contain outdated positioning and promotional offers; no blanket removal or unsupported renewal occurred in this slice.

Google's current [posting instructions](https://support.google.com/business/answer/7342169?hl=en) document native scheduling and recurring posts, but this profile's observed composer exposed scheduling without a recurrence control. [Post policy](https://support.google.com/business/answer/7213077?hl=en) governs content. [Photo guidance](https://support.google.com/business/answer/6103862?hl=en) gives JPG/PNG, 10 KB–5 MB, minimum 250×250 and recommended 720×720 for profile photos; this is not a mandatory post aspect ratio. [Local ranking guidance](https://support.google.com/business/answer/7091?hl=en) distinguishes relevance, distance and prominence; post frequency is not a guaranteed ranking improvement. [Profile performance](https://support.google.com/business/answer/9918094?hl=en) is discovery/interaction evidence, not a count of qualified leads.

**Claude explanation checkpoint**

The completed November 4, 6:27 AM CT Opus 5.5 High report predates the new conversion release. Claude receives collected public page excerpts, deterministic checks, retained research and native GA4/GSC aggregates, then returns a validated 15-area review with evidence-linked recommendations. It has no publishing tools or configuration-write authority. Native Refresh site checks uses no Claude tokens. Clarity behavior, US-segmented conversion denominators, staff-confirmed lead qualification and Square revenue are not currently model inputs; keep those gaps distinct from implemented tracking. The service-specific proposal drawer and private message flow remain live, with qualification/Square CRM work in the later phase.

Hero correction production receipt: [PR67](https://github.com/ZINC-Digital-of-Miami/zinc-digital-web/pull/67) merged as `f766bc9c88d810f11545eb0c0394ca47f3e51172`; production `dpl_7KAgsb6AUz7Z95gtEVa3jjYva8a9` READY. Actual desktop/mobile browser readback verified the original dynamic composition with Bear Claw only in the mockup screens, working three-lane tabs, matching preload and no narrow overflow. This supersedes the white-backed PR65 hero result, not the conversion/messaging release.

### Full agency positioning and case-study posting checkpoint — 4 November 2026 CT

This checkpoint supersedes the earlier pending appointment question, saved description and Pending starter-post status above. Earlier receipts describe the state at the time, not the current publication state.

Owner clarified: visits by appointment; position ZINC as a digital marketing agency with AI, BI apps, web design, branding and local SEO/AI optimization, cover the broader service offering, and post recent case studies. Current site sources establish eleven main service pages plus detailed capabilities and branding case work; this does not assert exactly twenty service pages.

- [x] Primary category remains **Marketing agency** in Google's taxonomy; Website designer is secondary. Submitted the expanded description below, pending Google review.
- [x] Submitted Planning → **Appointment required: Yes**. Native readback showed the existing Appointment not required as current and its removal/replacement as pending. Existing Monday–Friday 9 AM–5 PM hours were not changed or newly confirmed. Physical-accessibility attributes remain unverified.
- [x] Added Custom Business App Development, Google Shopping & Merchant Center Management, TikTok Advertising and Data Integration & Reconciliation. Saved fourteen revised names/descriptions below; **all fourteen were reopened and matched exactly**. Native list still states service edits pending review, up to one day. Other detailed offerings remain; no invented prices or arbitrary twenty-entry cap.
- [x] Submitted Bear Claw USA case-study Update for immediate publication using approved project artwork and the tagged case-study URL. Native editor readback matched copy, image and destination. Post `5456929169569474902` changed from Pending to **Rejected** on November 4.
- [ ] **Neither new post is published.** Starter guide `746584289055578525` also changed from Pending to **Rejected**. Its requested November 5, 10 AM CT slot is not an approved scheduled publication. Native list and individual menus expose no reason; the list has no question-mark explanation. No duplicate resubmission or speculative cause is asserted.
- [x] Existing heartbeat `zinc-google-business-local-updates` remains active Tuesday/Thursday 10 AM CT, now rotates published case studies and articles, and checks/reconciles rejected posts before any further submission. It retains drafts while rejection is unresolved. Existing SEO/article schedules are unchanged.
- [x] Prepared the U.S. Oil Solutions app post below for the next available slot, initially November 10 at 10 AM CT. **Draft only; no Google submission.** Recent publication/refresh of a case study is not proof of newly delivered client work; the app dates to 2024–2025 and the next public website remains in progress.
- [ ] Review Google's rejection and complete publication. Official [appeal guidance](https://support.google.com/business/answer/13597551?hl=en) routes U.S. rejected media/content to Contact us. The concrete support request below is prepared; sending is awaiting the owner's separate external-message authorization. No appeal or support message has been sent.
- [ ] Google approval/public readback of description, category, website, services and appointment requirement remains open. Personal-number public call-link propagation and pending SMS removal remain open; saved privacy settings alone do not prove public removal. Qualification/Square attribution remains in the later CRM phase.

**Revised description submitted**

ZINC Digital is a digital marketing agency in Panama City, Florida, focused on local SEO and AI search optimization, custom business intelligence platforms and apps, web design and branding. We connect search visibility with the websites, software and data businesses use to win and manage work. Services include technical and enterprise SEO, Google Business Profile optimization, Shopify ecommerce, Google Search and Shopping ads, Meta and TikTok advertising, brand identity, content strategy, analytics and data integration. Our AI-supported BI work connects business data, explores patterns and supports decisions with evidence. Serving Panama City, Bay County and businesses nationwide. Office visits are by appointment.

**Saved and reopened service descriptions**

- **Business Intelligence Platforms & Apps:** Custom BI platforms and applications connect business data, surface patterns and anomalies, and support decisions. AI-assisted analysis links findings to evidence. We build the data models, dashboards and workflows around your industry and operating needs.
- **Custom Business App Development:** Business software built around the work your team needs to complete: workflow and data models, user interfaces, role-based permissions, approved integrations and operational handover. Examples include field-service scheduling, assignments and service reporting.
- **AI Search Optimization:** Help search and AI answer systems understand your business through clear entities, reliable source information and answer-focused content. We assess technical discoverability and observe mentions and citations against documented queries, with coverage limits stated.
- **Local SEO Services:** Local SEO for Panama City, Bay County and multi-location businesses: eligible business profiles, accurate listings, distinct service and location pages, and local inquiry measurement. We distinguish Maps interactions from genuine prospective-client leads.
- **Brand Strategy & Visual Identity:** Brand positioning and visual identity carried across logos, color, typography, websites and campaign graphics. Our published work includes the Summit Marine identity and website in Panama City, plus brand applications for other businesses.
- **Website Design & Development:** Custom websites built around clear services, useful content and a direct inquiry path. Work includes information architecture, responsive design and development, accessibility, page performance and tested proposal or quote journeys.
- **Shopify Ecommerce Development:** Shopify storefront architecture, theme development, product and collection structure, navigation, checkout and app configuration. We connect the store experience with search, Shopping campaigns and reporting, with third-party costs and access agreed in scope.
- **Meta Advertising:** Facebook and Instagram advertising with account and tracking review, campaign and audience structure, creative test planning, and delivery analysis. Reporting identifies attribution windows and separates platform claims from confirmed business outcomes.
- **Google Shopping & Merchant Center Management:** Merchant Center feed review, product eligibility and issue triage, Shopping campaign structure and product-level performance analysis. We check catalog, storefront and measurement issues before recommending changes to spend.
- **TikTok Advertising:** TikTok advertising built around channel-specific creative and reliable event measurement. Services include campaign structure, creative testing, delivery and fatigue analysis, and purchase-journey reporting with attribution limits stated.
- **Data Integration & Reconciliation:** Connect approved APIs, databases and exports for business intelligence applications. Define source ownership, metric meaning, refresh schedules and reconciliation checks so reporting exposes missing or inconsistent data.
- **Conversion Tracking & Analytics:** Measurement planning, conversion-event setup and customer-journey reporting for websites and campaigns. Separate traffic, form activity, saved inquiries and confirmed sales outcomes, with source, period and attribution limits visible.
- **Search Engine Optimization:** Technical search audits, search intent and page mapping, on-page content recommendations, indexation review and organic landing-page analysis. Prioritize pages with a business purpose and verify changes against search evidence.
- **Google Search Ads Management:** Google Search campaign and conversion review, intent-led keywords and ads, landing-page alignment, search-term analysis and budget review. Measure spend and useful business outcomes with the reporting and attribution basis stated.

**Bear Claw case-study receipt — Rejected**

Source: https://www.zincdigital.co/work/bear-claw-usa/ . Approved image `src/assets/approved/build-bear-claw.png`, inspected full-size and in the composer, 1536×1024 and 2,036,767 bytes. The dark mockup composition is preserved. CTA Learn more: `https://www.zincdigital.co/work/bear-claw-usa/?utm_source=google&utm_medium=organic&utm_campaign=gbp_panama_city&utm_content=20261104_bear_claw_case`. Native editor: https://www.google.com/local/business/1858572599686865380/promote/updates/5456929169569474902/edit .

> Case study: Bear Claw USA.

> A product website needs to make the product, its uses and the quote process easy to understand. ZINC designed and developed Bear Claw’s website around those decisions, using the company’s existing brand identity.

> The work connects product and application pages with a dedicated quote request across desktop, tablet and mobile. It also includes packaging labels and product renders, plus a private lead-management backend.

> Explore the case study to see the website and supporting work. For a similar website project, send ZINC your business, project goals and timing through our proposal form.

**U.S. Oil Solutions app — draft, not scheduled**

Source: https://www.zincdigital.co/work/us-oil-solutions/ . Image `src/assets/work/uos-current-technicians-desktop.png`, inspected; existing approved public screenshot with names and location identifiers redacted, 1424×1105 and 1,086,424 bytes. CTA Learn more: `https://www.zincdigital.co/work/us-oil-solutions/?utm_source=google&utm_medium=organic&utm_campaign=gbp_panama_city&utm_content=20261110_uos_app_case`. Update date/topic campaign parameter if actual publication moves.

> Case study: U.S. Oil Solutions.

> A field-service app needs to connect the office with the people doing the work. ZINC developed a dedicated operations app for U.S. Oil Solutions, separate from its public website.

> Technicians and supervisors use workflows for restaurant assignments, scheduling, check-ins, fryer records, service photos and reporting. The application also supports rescheduling and issue handling, bringing the service record into the same working environment.

> Explore the case study and its redacted interface examples. If your business needs software built around an operational workflow, send ZINC the process you want to improve and the systems it needs to connect.

**Prepared Google support review request — not sent**

> Please review two rejected Update posts on the verified ZINC Digital Business Profile in Panama City, Florida (97 Oak Avenue, Suite 7, 32401; management ID 1858572599686865380; place/fid 10490689812028155340).

> Post 5456929169569474902 describes our Bear Claw USA website project, with an approved project mockup and a Learn more link to https://www.zincdigital.co/work/bear-claw-usa/ . Post 746584289055578525 summarizes our published local SEO guide, with an approved illustration and a Learn more link to https://www.zincdigital.co/blog/local-seo-2026-operators-manual/ . The actual CTA URLs include Google Analytics campaign parameters.

> Both posts changed from Pending to Rejected on November 4, 2026. The manager's post list gives no policy reason or question-mark explanation. Neither post copy contains a telephone number, email address, discount, or guaranteed results. Please identify the specific policy issue and review whether these posts can be approved. We have not resubmitted duplicates or filed another appeal for this issue.


### Privacy and website Terms implementation — 4 November 2026 CT

Owner explicitly requested current Privacy/Terms built from the actual stack and confirmed commercial details remain in each client agreement and accepted quote/invoice. This supersedes the earlier instruction to leave both legal bodies empty awaiting supplied copy. `codex/privacy-terms-update` owns the current notices, directly necessary form disclosures/links and verification; the other active backend chat retains CRM/Square implementation ownership.

- [x] Inspect production/main `abd7a84`, current intake/SMTP, Supabase staff inquiry board, US form gates, Google tags, Clarity masking/replay, Claude SEO inputs and private Anthropic/OpenAI research paths.
- [x] Draft dated Privacy Policy and website Terms grounded in those flows; separate proposal requests from binding engagements and external Square transactions. Add provider choices/privacy-request links and notices to all proposal/message forms. Preserve accepted design, dynamic hero and all commercial agreements.
- [x] Fresh scoped review; name OpenAI/Codex explicitly after verifying its current private-research route. No invented no-sale, consent, retention, certification or AI training guarantees.
- [x] Protected Privacy/Terms release completed as PR71; production legal pages are live, and the current completion slice inspected the Privacy layout at desktop/400px. Historical pre-release receipt follows: Current 225 tests pass; final Astro check has zero errors/warnings. Production-configured Vercel build and static checks across 101 HTML pages pass; legal content/date/metadata/link readback passes. Final fresh scoped review reports no actionable findings. Local HTTP/internal-link and collection-notice checks also pass for Privacy, Terms, Contact and a representative service. Owner confirmed Node 24 with no Docker/Actions and directed completion of Privacy/Terms only, then stop; no CRM work. Rendered inspection remains unavailable unless an appropriate existing tab can be reused. No tab/window was opened, and no push/PR/merge/deployment is claimed.
- [x] Approved website privacy controls and manual retention process are released through PR75, including the separately approved first five-hash cleanup. Current closeout above distinguishes this completion from unverified provider settings, all-system erasure and broader legal applicability.

Official regulator/provider evidence and current release state are recorded in `.planning/STATE.md`'s matching checkpoint. No paid research, email, inquiry, migration, production secret or tracking change is part of this slice.

### Content hub wording correction — 5 November 2026 CT

Owner requested natural, useful language throughout the content-hub article and its downloads. Replaced commissioning/page-job metaphors and awkward planning jargon in article 94002, its retained manuscript, two PDF resources and two SVG illustrations. Preserve the existing article URL, byline, published date, examples, sources, 24 checks and 111 fillable workbook fields. Fresh scoped source review passed; relevant article/resource tests passed (18 tests), Astro check has zero errors/warnings. PDFs rendered and inspected. Local production build and static checks passed across 101 pages. Owner then requested a clearer title; revised to “How to plan useful blog content for your business” with a direct introduction. Final build/release verification pending. User direction: say “before you write that next article” and give each article a real purpose. Existing editorial and Google Business schedules unchanged; email remains deferred.

Owner semantic correction: a content hub describes the organisation of a website’s blog section, not a separate tool. Final title: “How to organise your website’s blog.” The introduction now defines categories, articles and links explicitly, distinguishes the downloadable workbook as the planning tool, and uses “article” for individual posts. PR85 handled the first wording pass; this follow-up completes the semantic correction.


## Owner-approved service-pillar implementation — 5 November 2026 CT

Active scope: 11 primary services and 11 matching blog pillars, including separate Meta and TikTok. Every article explicitly owns one primary service, used by category membership, direct service links, proposal drawer, analytics, admin save/publish and Claude checks. Secondary references are links, not equal pillar membership.

- PR83 intent map merged as `5bcd5f1` after exact-head Actions and Vercel passed; PR85/86 plain-language changes are retained.
- Implementation branch `codex/service-pillar-ownership`, based on `5bcd5f1`. Initial primary-assignment behavior tests reproduced all three defects and pass after the first corrections. Full verification/review/release remain open.
- Migration `0012_post_primary_service.sql` is prepared only. It preserves timestamps and backfills reviewed repository assignments; unknown published admin posts stop the migration. Production application requires exact approval after rehearsal/review.
- Required follow-on: full-body review of all live pillar/cluster/hub strategy articles and linked resources; all L1–L6 findings; substantive service/pillar content; native demand evidence and editorial queue; 26-recommendation reconciliation. Preserve actual bylines and dates, dark dynamic hero, approved badge, resources and existing schedules.
- Claude refinement drafts in the existing worktree remain untouched pending integration. Keep Monday 08:00 CT review and 09:15 CT verification; no paid test call. Implement atomic coordination with Codex research/SEO jobs before declaring non-overlap.
- User confirmed ZINC Fusion may be linked as an in-development BI example, without results claims.
- General pillar guidance must distinguish ZINC’s service-category structure from the valid comprehensive-pillar-page convention used by HubSpot.

Ownership/link implementation checkpoint: all 45 full repository bodies (287,569 characters) independently reviewed. The parent verified the two recommendations against full text and assigned channel selection and order economics to BI. All other proposed assignments were supported; Apps remains empty. Native read-only ZINC Supabase inventory (`zeetlqskfvsfbllrhzre`) returned zero saved posts, so current article bodies come from the repository; public byte/render parity remains to be verified. Local Node24:259tests passed; Astro0errors/0warnings. Migration rehearsal on the existing local PostgreSQL server passed backfill/snapshot/date/permission/publish-gate checks and rolled back; follow-up found0public/private tables. No production migration applied. Full build in progress.

Read-next now uses published peers from the explicit service, in retained editorial order; three unique peers where available, fewer for sparse pillars. Guides remain optional cross-topic references. Case footers link only service pillars with articles; BI links Fusion with “in development”; public admin footer link removed; repeated article-card anchors consolidated. No homepage hero/image edits.

Content review confirmed corrections still required in pillar definitions, content-refresh example, the organisation article’s SEO-vs-AI membership list, explicit article-to-service requirements, content-brief SVG/worksheet, hub PDF/SVGs and publication-plan CSV. These are open follow-on content work, not completed by the ownership release.

Ownership release validation: final production-configured build and static checks passed across102HTML pages; Node24 259tests and Astro0errors/0warnings. Fresh review found a publish/edit race, corrected by holding the posts lock through validation and snapshot creation. A two-connection regression reproduced the old null snapshot and verified the corrected snapshot retains tiktok-ads; clients exited and temporary databases were removed. Migration 0012 explicitly approved and applied through the authenticated native connection to zeetlqskfvsfbllrhzre. Readback confirms the column, history entry, publication lock and unchanged row security; zero saved posts. The first post-commit readback omitted SET ROLE and failed; the corrected read-only transaction verified the committed result without reapplying. Full RLS suite and rendered browser inspection are not established by the reduced migration fixture.

Claude/Codex refinement checkpoint (5 November): preserved the existing refinement drafts and aligned them to the approved11-service mapping. Added current rendered structure, exact primary-service/pillar checks, case eligibility, inbound article distribution, one checklist catalog and limited recent subscription job status. HistoricalF1–F14/L1–L6 are leads to recheck; organization bylines, metadata length and query overlap are not automatic failures. In the same101-page generated-HTML fixture, serialized instructions+evidence fell from 622,138 to 602,320 bytes (19,818 bytes saved, 3.2%) while retaining1800-character excerpts and adding structural coverage. Google/provider calls were stubbed; this is input-size proof, not native analytics or paid-model execution.

Prepared migration0013 coordinates both starts under one advisory transaction lock. Local two-connection tests passed both start orders and rollback release, failure recovery, paid-key duplication and unchanged connect/verify/scan behavior; owned clients exited and test database removed. Deferrals save a separate receipt without reserving a paid key. Monday08:00CT remains primary,09:00/10:00 are pre-paid deferral retries using the same weekly key. At preparation, no production application or paid test call; see the later approved application receipt below. Fresh review/build/release remain pending; Monday09:15 verification must inspect paid reservation first, then the matching deferred receipt if no reservation exists, without starting a review.

Fresh Claude refinement review passed through 4d488a9 after fixing later-slot eligibility and immediately starting the lazy subscription-activity query. Exact historical transitive dependencies are pinned in the corrected input comparison; the earlier 6.1% figure is superseded. Migration 0013 explicitly approved and applied through the authenticated native connection to zeetlqskfvsfbllrhzre. Readback confirms both enabled coordination triggers, migration history, private function permissions and row security on both existing tables. No paid model execution or production test job was started. Monday 09:15 CT verification remains ACTIVE with deferred/running/failed/complete distinctions and no paid rerun. PR87 ownership CI passed and the protected PR merged as fd8d0b5.

Final refinement checks: 269 Node24 tests pass, Astro reports0errors/0warnings, production-configured build and static checks pass across102HTML pages. Source wording avoids the banned acronym while retaining the approved terminology requirement. No new background service or browser tab was created.

Owner-requested full audit found that complete link evidence omitted case-local footers, concealing the new case-to-pillar links from Claude. The structural walker now includes navigation and footers inside main while keeping global chrome and those elements out of prose excerpts. A rendered-shape case fixture reproduces the missing link before the change and passes afterward. Full audit/release remains in progress.


Independent full-plan audit — 5 November 2026 CT: the owner-requested fresh read-only audit found the plan incomplete. PR87 ownership is released; PR89/90 and commercial/editorial work are not yet all released. Current production receipt is dpl_2BNzqhVpQA91DDsm48fSBWV7WHsx at d6ef347 (PR87 plus PR88), READY with www/apex aliases. The earlier pillar-static.log failure is superseded by PR87's successful exact-head Actions42076853007; it is not passing evidence.

- Corrected the review extractor to retain local navigation/footer links inside main (including case-to-pillar links), while excluding global chrome and keeping prose extraction unchanged. The representative case-footer regression failed before the correction and passes after it. Source correction is not yet released.
- Re-measured with the proposed full editorial queue: 622,138 baseline bytes versus 613,668 candidate bytes, 8,470 bytes saved. Both use the same101 generated pages and empty saved/native-Google fixtures; the candidate includes the footer correction and E's proposed register. No paid or network calls. This supersedes the earlier fixture size for these inputs, but final combined commercial/article production input remains to verify.
- Offline-runner recovery tested using the unchanged claim_codex_job and finish_codex_job definitions with reduced local tables: expired queued31-minute and running16-minute jobs block Claude while offline, are failed rather than replayed when the runner resumes, reject late results, then allow exactly one weekly reservation. A fresh claimed job continues blocking until finished. This is not a production role/permission test. Keep fail-closed coordination; if Monday verification finds stranded work, report the runner/job state and restore the existing runner through its approved operation instead of starting another paid review or bypassing the gate. Temporary test database removed; no helper left running.
- Remaining audit findings: homepage repository metadata is overridden by its published database snapshot and requires scoped publication/readback; descriptive homepage H1 remains unresolved without changing the approved hero; all26 recommendations need a reconciled final disposition. Native query/page overlap, current conversion/filter readback, controlled conversion execution, performance evidence and full affected-layout verification remain open. Native Google connection is healthy; a local fallback credential failure is not a live access failure. Monday execution can only be verified at its scheduled run.

Audit-fix verification:270 Node24 tests pass, Astro0errors/0warnings. Fresh independent follow-up review passed the scoped extractor/test/record correction and its recovery/input-size receipts. New-head hosted checks and deployment remain required.

### Commercial-page and entity refinement — 5 November 2026 CT

Prepared service-specific headings and two short sections explaining suitability and preparation from the already published deliverables, ownership, cadence and FAQ facts. The service directory now explains each layer; the blog has a descriptive H1 while retaining its decorative mark. BI retains its existing tagline and artwork beneath an explicit service heading. Company profiles and US service area are reused on location entities; Person topics derive only from actual published bylines and primary services. No personal profile URLs, phone numbers, author assignments or numerical results were invented. Homepage search wording now names the services and both markets; its hero and machine-head social asset are untouched. Copy remains reviewable in the scoped PR. Current owner instruction treats character counts as guidance; clear existing article titles are not shortened solely to meet a length threshold.

Release checkpoint: PR87 merged fd8d0b5 after Actions42076853007 passed on a836689 and the matching preview was READY; existing-tab desktop article rendering and HTTP assignment metadata were checked. PR88 subsequently merged as d6ef347 in the subscription chat. Production for that main is still being verified there; do not claim either change live solely from merge. Approved migrations0012 and0013 are applied and read back, with enabled coordination triggers, preserved RLS and migration history; no production test jobs or paid model calls were made. PR89 (Claude refinement) and PR90 (article/resource corrections) are open with checks running. Local Vercel environment reads omit the sensitive active Google OAuth credential; the fallback account's403/empty-sites does not establish live connection failure. Retained November4 native review evidence is available for bounded analysis; fresh query/page/country overlap and current GA4 Admin settings remain to be checked through the authenticated native route.

Homepage heading audit correction prepared: give the existing brand H1 a descriptive accessible name identifying web design, AI search optimization, BI and both markets. Visible typography, images, composition, motion and machine-head social image are unchanged. Existing-tab accessibility-tree and rendered readback remain required; this is not a production claim. Published homepage metadata still overrides repository defaults and remains a separate scoped-publication task.

First-website intake correction prepared in the commercial slice: website is optional in the shared contact/drawer form and server validation; supplied URLs retain HTTP(S)/length validation. Company, service, email, US/origin/honeypot and rate controls are unchanged. Two regressions failed before;30 targeted tests and263 full Node24 tests pass afterward, Astro0errors/0warnings. Fake storage/notification tests cover JSON and no-JavaScript paths to Jaymie; no real inquiry or email sent. Fresh backend review passed. Rendered/hosted/production checks remain open. No database migration is needed for the existing nullable website field.

Live pillar-content corrections prepared on codex/live-pillar-corrections: revised the content-marketing plan, briefs, refresh review, AI overview/strategy, SEO framework, internal-link audit, service-page checklist and blog-organisation article. Preserve original URLs, bylines and publication dates; modification dates changed only with substantive edits. ZINC’s explicit primary-service organisation is distinguished from comprehensive pillar guides; the organisation article now labels AI guidance as cross-pillar reading. Retained manuscript, three PDFs, two SVG references and publication-plan CSV updated together. HubSpot’s current pillar definition and Google’s crawlable-link guidance checked directly on5November. Full45-body review was recorded in the ownership slice; incidental references and Wendy’s live editorial-planning article remain valid without unrelated rewrites.

Resource verification: 6-page workbook/111fields, 2-page architecture reference and4-page brief/27fields preserved. All12PDF pages rendered and inspected; no text overlap/clipping found. Seven existing article/resource tests pass; Astro0errors/0warnings. Browser/preview/protected release pending. Source generators retained for reproduction. No homepage or approved featured-image changes.


### Original Claude review reconciliation — 5 November 2026 CT

Source: native `admin_cache` review `seo_review:manual:5b014cb7-e4b8-4f50-9fcd-84f73ab6055c`, completed4November at06:27CT,26 recommendations. Retained exact response/evidence: ownership worktree `.scratch/seo-recommendations-native.log` and `google-evidence-read.log`. These are historical observations to recheck, not26 permanent defects. The independent owner-requested audit found the full plan incomplete. This table records the current disposition; a prepared change is not a release, a connection is not a measured result, and a scheduled review is not an executed review.

| # | Recommendation | Current disposition and remaining proof |
|---|---|---|
|1|Panama City principal base / Miami growth market|Earlier remediation removed unsupported HQ/satellite wording. November5 5:52PM CT live About, Local SEO, AI Search and llms.txt all returned200, retained both locations and contained neither headquarters nor satellite-office wording. Source identifies Panama City as the base. Receipt `.scratch/current-local-identity-readback.json` in seo-evidence-editorial; published settings inventory and actual office operation are separate checks.|
|2|Homepage metadata reflects offer and both markets|Released and live. PR91 commercial fallback plus scoped owner publication of the homepage database title at3:24PM CT. Deployment dpl_ANcZ9ZYSM6wQ7WZLKqrJK2zmiqKU READY at6f13e76; document title, Open Graph and Twitter read back the reviewed AI search/websites/BI wording and both markets. Only meta_title changed; zero unpublished changes.|
|3|Proposal conversion/key-event verification|Native November5 GA4 readback verifies generate_lead is a key event, Once per event, with ZINC STREAM activity in the last28days. Existing November4 collection evidence is retained. Current controlled proposal execution and intent separation remain to verify. A submission is not a qualified lead or Square revenue. Receipts and boundaries appear in the native GA4 follow-up below.|
|4|Privacy and Terms|Released through PR71/75 with subsequent PR88 subscription disclosure. Preserve source-grounded terms and privacy controls; provider settings and broader legal applicability are separate proof limits.|
|5|Exclude internal QA traffic / annotate releases|Explicit QA exclusion and release receipts exist. Native November5 readback verifies Internal Traffic and Developer Traffic are Exclude/Active. Actual staff-device/IP matching and controlled collection remain open. Do not infer correct matching solely from an active filter or low-volume traffic.|
|6|AI search optimization naming|Approved AI Search Optimization service/category/navigation wording is released. November5 live service and llms.txt naming readback passed; all11 service headings/pillar links have separate HTTP/source parity evidence. Actual visual truncation/layout remains a rendering check. Incidental explanatory language is not automatically a naming defect.|
|7|Separate TikTok pillar and service path|PR87 released explicit TikTok ownership, own pillar, service/drawer/measurement IDs. Production HTTP and existing-tab drawer checks passed. One article remains a coverage gap.|
|8|Case contextual links|PR80/87 supply eligible service/context and case-to-pillar links. PR89 now includes local case-footer links in Claude evidence. PR94 adds two useful Fusion links in BI/research articles, explicitly in development; production189c432 and both live paragraphs verified. No delivered-result or research-accuracy claim.|
|9|Relevant service proof|PR80/87 correct related engagements and render Fusion as an in-development BI example. Preserve actual project status and scope; no delivered-result inference.|
|10|Local SEO / Apps coverage|Explicit ownership reveals Local SEO1 and Apps0 current articles. Existing scheduled briefs and proposed queue address coverage; planning is not published coverage. Preserve cadence.|
|11|Planned-intent overlap|PR83 intent map and the PR91 editorial register extension are released. Planned briefs have one service, distinct reader questions and supporting links. No automatic consolidation or URL change; future articles remain queued, not published.|
|12|Overlapping pillar membership|PR87 released one primary service for all45 published articles and matching11 pillars. Secondary links do not confer membership. Native stored-post inventory was empty at migration; later admin publishing behavior still needs rendered verification.|
|13|Adjacent existing article intents|Preserve distinct how-to, review and retrospective purposes and existing URLs. Peer links improved in PR87. Five native exact-query/page samples on November5 each returned one page; this sample supplies no consolidation justification. Broader adjacent-intent query/page analysis remains open; no comprehensive cannibalization conclusion is claimed.|
|14|Full reader-standard audit|All 45 unique article bodies now have directly attested independent full-reader review. The reviewer read all nine PR90 bodies in full, adding eight to its prior 37 and rereading the one overlap. Nine strategy articles/resources were corrected and verified live. Primary-source reads, PDF renders and workbook formulas supplied separate checks. WordPress retained-manuscript parity correction is released in PR95; the public article body is unchanged. Current official Shopify documents support the checked product-SEO and Merchant Center setup instructions. The live order calculator passed LibreOffice recalculation for defaults and four adverse cases; Microsoft Excel compatibility, some Meta account-specific controls, every illustration crop and first-hand case provenance remain bounded gaps.|
|15|Business/author entities|PR91 released company-profile reuse and author topics derived from actual published bylines. Current graph retains actual listed locations and identities; staff membership never establishes authorship. HTTP readback across28 service/pillar/author/location/About pages matched H1s, five metadata fields and complete Organization/ProfessionalService/Person objects to the build; author topics matched actual article bylines. This does not prove external profile ownership, office operation, credentials or mobile rendering.|
|16|Query-mix versus rank change|Native US/Web Search Console comparison October6–November2 versus September8–October5 now covers all207 displayed rows:36 both periods (14position improvements,17 declines,5unchanged),127current-only,44prior-only. Derived receipts normalize zero-impression positions to null; native UI displays0. Five query/page samples each returned one page. This is displayed-query evidence, not complete search demand, universal ranking loss or an effect of November5 releases. Raw and derived receipt paths appear below.|
|17|Performance and accessibility|November5 native PageSpeed UI measured8distinct representative templates on both devices after public API429. Home mobile84/LCP4.2s, desktop98/LCP1.1s/CLS0.014; blog mobile98/LCP1.3s; article mobile100/LCP1.5s. All16 attributed lab runs had0msTBT; field data unavailable. Case audit found96accessibility/92SEO from clipped-image hitboxes/related-link spacing and an initially href-less gallery control; scoped fixes prepared below. Physical-device, field-INP, full conformance and performance improvement remain open. Preserve approved image quality/composition.|
|18|Long metadata titles|PR91 commercial metadata is released; homepage database override was separately published and read back. Character counts remain guidance, not automatic failure. Preserve meaning and URLs; measured mobile preview can truncate without establishing a ranking defect.|
|19|Useful contextual peer links|PR87 improves relevant peer distribution:40/45 articles have at least3 inbound article links versus24/45 before. Local SEO/Meta/TikTok have0 and the web-design pair1/2. Shared guides already provide links; assess prose usefulness instead of forcing unrelated links to meet a quota.|
|20|Distinct pillar descriptions and introductions|The11-service registry supplies differentiated pillar introductions and commercial destinations. Final live HTTP readback verified all11 pillar ItemLists/member counts against the integrated build and each commercial service link, with sparse/empty states preserved. Actual mobile rendering remains open.|
|21|Descriptive headings and service depth|PR91 service/blog/BI headings and factual scope/preparation guidance are live. All11 service headings, substantive copy and pillar links passed HTTP/source comparison. Homepage accessible-name H1 and approved visible hero were inspected in the preview; service desktop/400% zoom and blank-website proposal steps1–3 were checked. Actual mobile and real submission remain unverified.|
|22|Summit claims provenance|Retain owner-supplied factual case content and attribution. Date, query set and comparison basis for strong outcome claims remain a provenance gap; do not fabricate measurements or rewrite claimed results as independently verified.|
|23|Publication/modification dates|Original publication dates/bylines preserved. PR90 changes modification dates only for nine substantive revisions; downloads/manuscript updated together. Lack of old analytics is not proof a publication date is wrong. Final live HTTP comparison verified all45 Article publication/modification dates and authors against the integrated build, plus sitemap lastmod parity. Nonempty visible date/byline metadata matched the build; this is not a visual layout check.|
|24|Social image availability and alt|PR82 exact black footer machine-head image remains production-verified; homepage publication preserved its byte hash. PR95 maps generic social alternatives to the five visually inspected text cards and preserves article/case/home image precedence; production readback verified the Home, Build, Demand and Intelligence card alternatives. The article fallback is covered by source review because assigned article illustrations take precedence.|
|25|Matched Google windows / landing rows / UTMs|PR80 matched GA4/GSC dates and expanded landing-page requests are live. Native free scan at3:28PM CT confirms both sources available and matching aggregate dates October6–November2 versus September8–October5. RFP event windows are separately stated; ordered funnel correctly awaits the first full November5 reporting day. Returned landing paths outside the current inventory remain explicitly omitted; unassigned traffic is not proof of a tagging defect.|
|26|Refresh comparable demand research|3November provider receipt remains dated context, with refresh due after3December before further positioning decisions. No paid test or invented refreshed demand. Future obligation remains in the register; current native impressions are not market volume.|

Operational verification remains separate: Monday08:00CT Claude review and09:15 verification stay active.09:00/10:00 retries are only for a recorded deferral before paid execution, with the same weekly key. The historical full-collector comparison at production189c432 used the same frozen public HTML/native snapshot and measured760119→723678bytes. A fresh comparison at productione9d9c1a includes the current archive/signup/register and measures759564→728943bytes (30621saved,4.03%) across102pages with no unavailable pages. Both retain the November5 3:28PM CT native Google/settings/job snapshot; neither is a new native-data refresh, paid-run receipt or token/billing measurement. Current receipt: claude-review-refinement `.scratch/review-input-size-current-collectors.json`, script `measure-current-collectors.mjs`. Actual Monday execution and complete production role/permission behavior remain separate verification requirements. Existing published metadata precedence and the reviewed Claude case-footer correction are tracked above.


Full project review,5November2026CT: [review](../../../docs/reviews/full-project-review-2026-11-05.md) records nine ranked findings from three independent source reviewers plus native policy/rules/runner/deployment reads. Main2ad517f is live; PR89 remains pending exact-head Actions. Required-check enforcement, Google owner-policy drift, first-website intake, publication/chat consistency, stale browser verification, Lighthouse cleanup and old research aliases remain open. Do not treat the review as approval to bypass protections or apply a new migration. The accidentally created empty Vercel project was deleted with explicit owner approval and native not-found verification; real zinc-digital-web remains intact.

Current release reconciliation: PR90 is merged as2ad517f and production dpl_2GYVRwRSxLtDijtShj2pAXhUkAVV is verified READY on www/apex; ninearticle texts/links and sixresource files matched. Both migrations0012/0013 are applied and read back; older preparation/pending notes above are superseded. PR89 integrated this main and the full proposed editorial queue fixture:273tests,Astro0errors/0warnings,103HTMLstaticchecks; reviewed headingtuple compaction measured634651→607412bytes on matched102-page fixtures without a paid call. Current PR89headf81e232 requires new hosted checks. Commercial and editorial preparation are combined here to preserve one service/content model and all audit gaps; they are not yet released.

Required-check enforcement repaired5November after explicit owner approval: native ruleset24024093 now requires build from GitHub Actions15368 and Vercel from8329. Full readback matched the reviewed payload and preserved existing rules, conditions, enforcement and administrator bypass settings. gh pr checks89 --required lists both contexts. Baseline/approved payload/after receipts retained in ownership .scratch/main-ruleset-before.json, main-required-checks-proposed.json and main-ruleset-after.json. This closes full-project review finding1 for ordinary merges; the pre-existing administrator PR bypass remains. Combined commercial/editorial source now passes263Node24tests,Astro0errors/0warnings and103HTMLbuild/staticchecks. Source review and hosted/rendered/publication gates remain distinct.

Combined commercial/editorial input fixture with PR89 heading encoding: 636556 → 609269 serialized bytes (27287 saved), 102 pages and zero unavailable pages for both algorithms. This includes the proposed register and case-footer fix. No paid or network call; saved metadata is empty and Google data unavailable in the fixture, so populated production input remains unverified. Receipt: Claude worktree .scratch/review-input-size-commercial-editorial.json.
PR90 release supersedes its preparation notes above: protected merge2ad517f1273c1f538531f7fae07d1a90259f250d, production dpl_2GYVRwRSxLtDijtShj2pAXhUkAVV READY with matchingSHA and www/apex aliases. Nine revised article texts/links and six PDFs/SVGs/CSV files verified against the reviewed source/build. PR89 required a documentation-only conflict resolution after this release; both implementation scopes are preserved. New combined-head Actions/preview checks remain required.

Combined-main refinement verification:273 Node24 tests pass, Astro0errors/0warnings and production-configured build/static checks pass across103HTML pages. With current-main article/subscription HTML and the full proposed editorial queue, the matched102-page model-input fixture is634,651 baseline bytes versus607,412 candidate bytes (27,239 saved); candidate also stays14,726 bytes below the original622,138-byte fixture. Lossless headingRows tuples retain level/text/order/duplicates and leave stored evidence untouched; prompt contract/version updated to2026-11-05.2. No model/effort/output change or paid call. Fresh independent review passed the merge resolution and tuple encoding. Native-populated final commercial input remains to verify.

PR89 protected merge completed 5 November 2026 at 2:34 p.m. CT as 30ecc20ace5890f8640c14087938fa7737eab5fd after exact f81e232 Actions and Vercel passed. Production deployment dpl_CJgyJu7hdN1v61QszMhwxknjk1QY is building; deployment/readback remains pending. Commercial integration preserves both documentation records and the released Claude source.

Audit integrity repair prepared, 5 November 2026 CT: migration0014 restores owner-only INSERT/UPDATE for google_connection without changing ordinary metrics or restrictive SEO-receipt rules, and adds service-only read_published_content() with a single-statement MVCC snapshot. Build/publish readers use the RPC and fail closed on unavailable/malformed/mixed publication evidence. Research history is bounded to the initiating message_id before either provider receives it. Native read-only inventory confirms one current snapshot timestamp, no missing timestamps and the owner-policy drift; no production mutation performed. 277 Node24 tests and Astro zero errors/warnings passed. Local migration rollback, editor/owner/anonymous/service permissions, exact SQL test101, concurrent publication and empty-collection checks passed against isolated fixtures using the existing PostgreSQL instance; temporary database removed. History regression fails without the bound and passes with it. Fresh independent source review passed; production migration approval and hosted release remain required. Apply reviewed0014 before deploying the RPC caller; it deliberately has no split-read fallback. Receipts are in audit-content-integrity/.scratch/content-integrity-rehearsal.json and ownership/.scratch/integrity-native-read.log.

0014 production application, 5 November 2026 CT: after the owner's direction to verify the exact target, repository remote, Supabase project zeetlqskfvsfbllrhzre (ZINC Digital Website) and real Vercel production PUBLIC_SUPABASE_URL were cross-checked and matched. Applied reviewed SHA25623cd29aec30efd8581402be4fdcfa002df73b3e7b3dbfcc627b175befa318e0f in one transaction. Page/post/inquiry row fingerprints matched before/after. Independent read-only readback confirms owner conditions on Google INSERT/UPDATE, unchanged restrictive SEO policies, RPC execution denied to anon/authenticated and allowed to service_role, invoker/STABLE/empty search_path definition, and successful service-role snapshot read. No content, dates, leads, credentials or publication functions changed. Never reapply0014. Native receipts: ownership .scratch/integrity-production-apply.log and integrity-production-readback.log. Application release remains pending.

Audit verification repairs prepared, 5 November 2026 CT: the browser verifier now derives its 102-route inventory and noindex set from the canonical site registry, including all11 pillars, both locations, subscriptions and the omitted cases. It accepts valid approved generated social images, specifically requires the homepage zinc-badge WebP and checks the current Request a proposal button label. Inventory-only execution verified the destinations without starting a browser. Lighthouse startup is inside the cleanup boundary; injected directory-creation and Chrome-launch failures each terminated and awaited their positively identified local server (PIDs43600/43603). No Chrome process/tab was started. This corrects audit findings6/7 in source but does not claim a full browser or performance pass. Existing-tab preview inspection verified the PR91 BI desktop heading and in-development case wording; user activity interrupted narrow inspection. Receipts: Claude worktree .scratch/browser-inventory.json and lighthouse-cleanup-receipt.json.

Owner approved retirement of the two obsolete research forwarding endpoints on5November. Removed only `/api/research/chat/`, `/api/research/ingest/` and their inventory references; current `/api/admin/research/` callers, staff checks and stored content/jobs remain. Three private-route tests pass, Astro0errors/0warnings, production-configured build/static checks pass across103HTML pages; oldpath references are absent from src/scripts/tests. Hosted final-head checks and live404/canonical-auth readback remain required.

Image-cache improvement in the same verification slice: observed local cached build8.28seconds while hosted clean builds repeated image transformations for more than35minutes. Cache only `node_modules/.astro/assets`, with OS/dependency/config isolation and commit-specific saves; Astro's image identity includes source/transform inputs. Official actions/cachev5 is pinned to commitcaa296126883cff596d87d8935842f9db880ef25 and uses Node24. Every test, Astro check, full build and static check still runs; no page/content/environment output is cached. First hosted cache fill and later reuse are not yet verified.

### Verified release and native evidence checkpoint — 5 November 2026 CT

PR89 is production verified at30ecc20, deployment dpl_CJgyJu7hdN1v61QszMhwxknjk1QY READY with www/apex aliases. Model/effort/output remain Opus5.5/high/48000; transactional coordination and recorded pre-paid deferral handling are live. Native cron configuration and unauthorized401 were checked without a paid call. Monday08AM CT review and Monday09:15AM CT verification remain active; future scheduled execution is not yet proven.

PR91 merged6f13e76 after exact-head Actions/Vercel passed; production dpl_AqGFPR6MBcU7uNsJmMkovwdEHK3C READY. The homepage title required a separate database publication: native draft readback showed only meta_title changed, then owner UI published one change. Job zQKPkVxhu0gaUlqTeWBP completed ready; deployment dpl_ANcZ9ZYSM6wQ7WZLKqrJK2zmiqKU READY at the same commit. Document title appends the normal ZINC suffix; OG/Twitter use the approved title. Machine-head WebP hash remains37c15888c85f638e97e76700e7d31876efcd74bbfecbe3e2d8ea064e64885d4d. Receipts: ownership .scratch/homepage-publication-draft-readback.log, homepage-publish-readback.log and homepage-title-production-receipt.json; commercial .scratch/pr91-production-receipt.json.

PR94 merged189c432342e0172348571d05f59d5ed832575464 after Actions42108701817 and matching Vercel preview passed. Existing-tab desktop inspection confirmed the new BI paragraph is legible and qualified as in development. Production dpl_71jAMgnq1YgBGDiCsZjeFpzP2Fa8 READY with www/apex aliases; BI basics and AI research workflow paragraphs and Fusion links returned200 and matched source. Receipt: live-pillar-corrections .scratch/pr94-production-receipt.json.

The live free scan seo_review:scan:44eed0b3-cda8-4fd8-85b8-4e0c30730cfd completed3:28PM CT against6f13e76:102/102 targets scanned, native GA4/GSC available, model and usage absent. Matched aggregate dates and separate RFP dates are explicit. This is a measurement scan, not a Claude execution or qualified-lead proof. Native receipt: ownership .scratch/current-scan.json. Native Search Console query receipts retain100 of207 returned US rows in gsc-us-matched-query-readback.json; query-page analysis paused when the owner used Chrome. Search Console reports no mobile/desktop field Core Web Vitals data. The parent native-UI observation is transcribed in ownership `.scratch/native-gsc-cwv-ui-receipt.json`; it is not an independent API measurement. The reader-audit report is summarized in live-pillar-corrections `.scratch/article-reader-review-receipt.json`, with reviewer and source-version boundaries.

The owner explicitly approved retiring /api/research/chat/ and /api/research/ingest/. PR92 removes both forwarding files and inventory references; exact-head preview returns404 for both. Canonical protected admin routes and storage remain unchanged. PR92 also repairs verifier inventory/Lighthouse cleanup and adds an image-only Actions cache without conditionally skipping checks. PR93 contains the atomic publication reader and concurrent research-history bound; production0014 was already applied and read back against verified ZINC databasezeetlqskfvsfbllrhzre with content/inquiry fingerprints unchanged. Never reapply0012/0013/0014. PR92 subsequently passed its integrated exact-head Actions and protected release; see the final receipt below. PR93 passed Actions42111623142 and its matching preview, then protected-squash merged as98ceeeec5701292c513edf923c6062287fda983f at3:43PM CT. Production dpl_71Lp2mrCyNcpCJgJmzhFLp66D9Jz is READY with www/apex aliases; its content revision matches the published database snapshot4ae096119c8b65c62834e4c12e12ebcccd29d4d6009d5ac89957c9f06d124421. Unauthenticated publish/research requests returned401. Local concurrency/permission tests remain distinct from production mutation tests; no test job or publication was created. Receipt: audit-content-integrity `.scratch/pr93-production-receipt.json`.

The populated-input comparison now exercises both full collectors and their respective parsers/registers against the same frozen current public HTML and retained native Google/settings/activity evidence: **760,119 → 723,678 serialized request bytes**, a reduction of **36,441 bytes (4.79%)**. Both collected 102 pages with zero unavailable; each of 105 public paths was fetched once and reused. The shared current scorecard and page-performance snapshot are held constant, and score-history is omitted identically. This verifies no growth for the controlled current snapshot, not token billing or every future input. Fresh independent review reproduced the retained-file sizes and checked actual old/new structural differences. Claude worktree receipts: `.scratch/measure-native-collectors.mjs` and `.scratch/review-input-size-native-collectors.json`. The earlier 37,476-byte result measured serializers/registers on already-expanded evidence and is not the full-collector comparison.

Demand priority implication: the inspected US sample supplies a concrete reason to commission the existing local-location-page brief before another unscheduled generic marketing overview. It does not justify changing established publication dates, creating duplicate location articles, merging URLs or treating impressions as market volume. Keep the Apps and TikTok coverage gaps explicit; query-to-page validation remains necessary before any consolidation decision.

PR95 passed Actions42110933649 and its exact preview, then protected-squash merged as c74b7fcaa844734685557ec1fa83361a6a635e90 at3:55PM CT. Production dpl_HTu7DSCDE6vTCCvdkHffYf2318ex is READY on www/apex. Live homepage, About and three service pages returned200 with matching OG/Twitter image alternatives; all referenced images returned200. The homepage machine-head bytes and approved title remained unchanged. Receipt: remaining-seo-recommendations `.scratch/pr95-production-receipt.json`. PR92 local integration46072aa preserves PR93/94/95, passed279 tests before the social-only integration, then Astro0errors/0warnings, build and103HTMLchecks, with fresh narrow merge review PASS. The older remote79b56a7 run cannot validate46072aa.

Final public structure/date readback at4:03PM CT:45article pages and11pillar pages returned200. Every Article entity matched integrated source dates, author, headline, section and primary pillar; proposal-bar/drawer service attributes, direct service/pillar/contact links agreed. All11 ItemLists matched build membership/counts; all56 paths appeared in the sitemap and45article lastmod dates matched schema. Receipt and reproducible script: claude-review-refinement `.scratch/live-pillar-parity-receipt.json` and `.scratch/verify-live-pillar-parity.py`. This checks HTTP output, not browser execution, analytics delivery, a real inquiry or stored-post publishing.

PR92 protected release completed4:04PM CT as9f00a0ebc5af6c9628c7270e077e806960bfa42a after Actions42117894272 and exact preview passed on46072aa. Production dpl_7keNGUUYyEX3DWFZvgTfnkZCcC4X is READY on www/apex. At4:06PM CT both retired endpoints returned404 for GET and POST; canonical research chat/ingest and publish returned401 without authentication; published content revision remained4ae096119c8b65c62834e4c12e12ebcccd29d4d6009d5ac89957c9f06d124421. Receipt: Claude worktree `.scratch/pr92-production-receipt.json`. Hosted image cache restored successfully and all2305 transformations reused entries; the job completed80seconds with every required check executed. This is observed reuse, not a promised future duration.


### Continued verification after PR96 — 5 November 2026 CT

PR96 passed exact-head Actions42118686558 and Vercel, then protected-squash merged at4:36PM CT as52c0b9d62931b866e8e562ac9e63b83cda6a5b06. Production dpl_Ei6nQsc4sZp7v6PiiWBi74UwE5kc is READY on www/apex. The merged two documentation files exactly match reviewed721c41f. Live home returned200 with unchanged title, exact machine-head image hash and published content revision. Receipt: seo-evidence-editorial `.scratch/pr96-production-receipt.json`.

Additional verification completed while CI ran:28 HTTP pages matched current H1, description/OG/Twitter text and complete business/author entities; three author-topic sets derive from actual published bylines, and compared entities contain no telephone. Receipt/script: Claude worktree `.scratch/live-entity-metadata-receipt.json` and `.scratch/verify-live-entities.py`. This excludes document-title/social-image comparison, account ownership, credentials, office operations and browser-layout proof. Independent evidence review passed.

The live order calculator equals source SHA25602c0ef0bf5f85077d06b274ca5cf384fbca52a2204050b0c1a573a31030a033d. Installed LibreOffice recalculated the default and zero-denominator, negative-media-ceiling, overspend and mismatched-order scenarios with expected arithmetic/statuses. Receipt and script: live-pillar-corrections `.scratch/order-workbook-recalculation/receipt.json` and `.scratch/recalculate-order-workbook.py`. The original public workbook is unchanged. PID93315 exited0; the parent confirmed no profile-scoped descendants remained. Independent evidence review passed; this is LibreOffice proof, not Microsoft Excel or interactive visual proof.

Primary-source follow-up: current Shopify Help supports the checked product search-listing/alt-text instructions and Google & YouTube connection, ownership, eligibility and feed-overwrite warning. Meta Blueprint public summaries support the objective/conversion-setting distinction, but detailed lessons require sign-in and the dated2023 PDF exceeded the web-tool size limit. No contrary source established a defect; current account controls remain unverified. Exact seven source/claim findings: live-pillar-corrections `.scratch/shopify-meta-source-verification.json`. No article wording/date was changed from this review.

Native Search Console/GA4 and actual narrow-screen checks remain waiting for the existing Chrome window: direct inspection briefly reported Search Console, then showed another active Constant Contact workflow, so no navigation was performed. Monday08AM CT review and ACTIVE09:15AM CT verification remain unchanged. No paid call, test inquiry, new browser tab or persistent task helper was used.


### Main article archive simplification — 5 November 2026 CT

Owner direction in the subscription/blog chat: remove the redundant upper service-navigation row on `/blog/` and start the archive at the existing Layer/Topic filters and article grid after its heading. The root archive now includes all45 articles, with the former featured article first. Its separate featured/framework blocks are removed only from the root presentation; category pages retain their navigation, featured article and reading guides. Article URLs, assignments, subscriptions, service/pillar pages and homepage hero/social image are unchanged.

Prepared on current main238f8fd in `codex/blog-topic-tab-padding`. Worker reports Node24 Astro0errors/0warnings and fresh scoped source review with no findings. Retained `.scratch/blog-verification.json` covers all topic counts, empty/reset behavior and no narrow overflow; parent inspected the390px `.scratch/blog-mobile.png` showing readable wrapped filters,45count and firstarticle. The worker reports all owned preview/browser processes stopped, including last AstroPID38253. Protected exact-head Actions/Vercel and production readback remain required before calling this live.

Release review caught old checker expectations for44cards and the removed root navigation. Updated the static and browser reset assertions to require all articles, all root article destinations and the approved root presentation. Pillar coverage remains checked through all11 service-to-pillar links and the existing category route/membership checks. The initial hosted run failed these old assertions; corrected-head checks are required.


Owner subsequently selected categorical dropdowns for both the blog filters and email interests. The prepared PR99 revision uses labelled native Layer/Topic selects, grouped topic options, a visible result count and reset; all root articles remain directly linked. Email interests use three native expandable Build/Demand/Intelligence groups with explicit multi-selection and counts, including the original provider checkbox nodes after load. The five independently approved interests (Analytics, Market Analysis, Databases, Content Marketing, Brand Development) map to verified native list IDs; the 11 service pillars are unchanged. Signup and contextual callouts retain the generic “Choose your how-to topics” heading; a query suggests only one selected interest. No subscription is submitted by opening or choosing a group.

Local candidate validation: Node24 280 tests pass; Astro reports 0 errors/0 warnings (12 hints); production-mode build and static checks across 103 HTML files pass. The original root guide-navigation assertion was also stale and is replaced with category guide-navigation validation, consistent with the owner's root simplification. Fresh source review and actual rendered checks are in progress; this is not yet live. Native form currently remains at its working 11-list inventory until coordinated cutover: the new website strictly requires the approved 16 IDs and must be verified against that published native inventory at release. No unknown-list compatibility path is introduced.

Rendered local preview in the existing Chrome tab confirms desktop light/dark controls, native grouped topic menu, keyboard topic selection, zero-result intersection and reset to45. Email group keyboard expansion and cross-group selection retained Web Design plus SEO; generic heading remained intact. At393px emulated width, signup choices and labels were readable with no visible collision. Screenshots: `.scratch/dropdown-blog-desktop.png`, `dropdown-signup-desktop.png`, `dropdown-signup-mobile-light.png`; reset AX receipt `dropdown-blog-reset.txt`. Owner approved the white blog/dropdown treatment (“clean”). Existing theme choice remains available; homepage hero is unchanged. Loaded native16 form and narrow blog verification still await coordinated provider cutover/browser availability. No signup was submitted.


### Dropdown release and how-to coverage handoff — 5 November 2026 CT

PR99 exact head4f3f842 passed Actions42127102950 and Vercel after fresh independent source review. Protected squash merge9fdaa6668ec76b103da4177285afabf0e887d863 completed5:09PM CT. Production dpl_GPT6RL7Vgc551ZGzTtMgKQ2uPUJR is READY at that SHA with www/apex aliases. Live HTTP readback5:11PM CT verifies45 archive cards, Layer/Topic selects, absence of the removed root navigation,16 email choices in3groups and the generic signup heading. The approved machine-head image retains SHA25637c15888c85f638e97e76700e7d31876efcd74bbfecbe3e2d8ea064e64885d4d. Receipt: blog-topic-tab-padding `.scratch/pr99-production-receipt.json`. Native provider16 cutover and loaded-form readback are being coordinated with the owner-authorized Constant Contact chat; do not claim that step complete from static HTML.

Existing-tab rendered checks additionally verified the light blog strip at393px with all45articles, usable widths and no visible collision (`.scratch/dropdown-blog-mobile-light.png`). Owner approved the white blog/dropdown treatment. Desktop dark/light and signup393px checks were retained earlier. Device emulation and DevTools were closed, the owner's blog tab restored, and task-owned local serverPID58283 stopped and verified absent. No new tab/window or test signup was created. Monday09:15CTverification was read back ACTIVE; Monday08review remains unchanged.

The existing editorial register now includes the owner's nine-interest coverage map and four explicitly unscheduled how-to briefs: Market Analysis (BI/Kirk), Databases (Apps/Kirk), Brand Development (Web Design/Wendy), and practical Shopping/Performance Max launch verification (Shopping/Jaymie). Existing related bodies were rechecked; the additions distinguish their practical tasks from existing guides and backlog7's campaign comparison. All added article links resolve, dates/cadence and11primaryservices are preserved, and independent source review passed. These are commissioning briefs, not written or published articles. Broader native query/page, GA4 collection, performance, admin-publication and Monday-execution verification gaps remain open.


Native cutover completed after PR99 production readiness. Parent independently fetched the public Constant Contact form JSON: ACTIVE, “Choose your how-to topics”,16 approved list IDs. The coordinated account chat's retained existing-Chrome AX and `.scratch/live-sixteen-ui-results.json` verify loaded native16-checkbox forms with only the requested interest selected for Analytics, Market Analysis, Databases, Content Marketing and Brand Development. Parent inspected the Analytics AX evidence and five result rows; no new submission was made. Original provider checkbox nodes remain inside their native fieldset, grouped for display. Provider JSON receipt: blog-topic-tab-padding `.scratch/pr99-provider-readback.json`; actual UI receipts remain in topic-subscriptions `.scratch/`. This completes the earlier pending five-interest cutover; it does not prove a new submission for every interest.

Separate account-work evidence: the owner-approved real Web Design signup restored Jaymie's sole topic membership, triggered one welcome send at4:50:56PM CT, and the owner confirmed receipt in the Constant Contact chat. That chat reports the existing welcome path and self-service preferences extended to16 lists. This is signup/welcome evidence, not a broadcast, an automated article campaign or revenue attribution; none of those is claimed. Preserve the native account receipts and do not repeat the test email.


Independent review identified a provider warning in the retained loaded-form AX receipt (Analytics, lines121–122): “This site is exceeding reCAPTCHA Enterprise free quota.” Current submission impact is unverified; it is not evidence that the earlier successful welcome failed, and no billing/access change or support message is authorized by this observation. Keep this provider dependency open for bounded read-only diagnosis. The account chat's final result file now contains all16 query/preselection checks, each showing16 native choices and the requested selection only. These are loaded-form checks, not16 delivered emails or a new post-cutover submission test.


Follow-up readback: PR100 protected-squash merged20bf7659d0c60d37aa4d201000e42bbf87882906 at5:16PM CT after exact3173095 Actions42128108758/Vercel and independent review passed. Production dpl_7YiucgoDmCEhAK3uq7iMcDuzNFx5 is READY on www/apex; reviewed schedule/tasks match main,45cards/16choices and badgehash unchanged. Receipt: seo-evidence-editorial `.scratch/pr100-production-receipt.json`. Account chat additionally retained generic signup with no selection/disabled Open, and Shopify+Analytics carrying exactly those two into the loaded form without submission (`topic-subscriptions/.scratch/live-generic-none-ui.txt`, `live-generic-multi-ui.txt`). Parent inspected those AX receipts. Live light blog dropdowns/count were read back directly. Provider warning timing cannot be established from the earlier successful signup artifacts; current submission impact stays unverified. The task-owned CCtab was closed; owner tabs remain.


Native Search Console follow-up used the existing tab with unchanged US/Web filters and Oct6–Nov2 versus Sep8–Oct5. Expanded the table to all207 displayed queries:36 observed in both periods (14improved/17worsened/5same position),127current-only and44prior-only; the derived receipt treats position as null when a period has no impressions (the native table displays 0). Five exact-query→page checks each showed one page: Panama City SEO→Local SEO service (7current impressions); leading Panama City internet-marketing query→home (88/9impressions,53.2/48.8position); interdependent SEO-pillars question→four-pillars article (30current impressions,7.2position); generative AI search→AI-search-results article (19,95.8); Shopify issue question→Shopify-fixes article (2,73.5). All five had0clicks. No consolidation is justified by this sample. It supports retaining distinct reader tasks and prioritising local usefulness; it does not establish market volume, comprehensive overlap, or an effect of November5 releases. Raw AX,207rowJSON and derived receipt: seo-evidence-editorial `.scratch/gsc-us-all-query-ax.txt`, `.scratch/gsc-us-all-query-rows.json`, and `.scratch/gsc-query-page-followup.json`.


Native GA4 readback in the existing tab confirmed property494489814: `generate_lead` remains a key event with ZINC STREAM activity in the last28days; its counting method is Once per event. Internal Traffic and Developer Traffic are both Exclude/Active. Event and user data retention are both14months, with reset on new user activity enabled. No setting was changed. Receipts: seo-evidence-editorial `.scratch/ga4-key-events-current.txt`, `ga4-lead-counting-current.txt`, `ga4-data-filters-current.txt`, and `ga4-retention-current.txt`. These prove current configuration and reported stream activity, not filter matching on every staff device, controlled collection, qualified buyers or revenue. The default purchase key event shows no stream data; no purchase/revenue claim follows. Search Console was restored in the same tab. Monday09:15CTverification remains ACTIVE; no paid review was triggered.


### Remaining verification reconciliation — 5 November 2026 CT

PR101 protected release is verified at mergee9d9c1ac5bf1b06709cffbf1b70aee3e8108a22f, productiondpl_GFuzqTfmkyANmzmqQcdkg4cJAgxC READY on www/apex. Exactad4dc1c Actions42129433479/Vercel and independent evidence review passed. Reviewed tasks match main; live45archive cards,16signup choices and approved badgehash remained unchanged. Receipt: seo-evidence-editorial `.scratch/pr101-production-receipt.json`. The original26-row table above now incorporates the later native query/GA4 evidence rather than leaving superseded gaps as current.

The owner-directed Constant Contact chat independently owns the provider warning and authorized support request, with no plan upgrade or added charges. Parent inspected retained native receipts for one new Analytics-only signup with express consent and its automatic welcome reaching the inbox at5:41:32PM CT; contact/activity identifiers match and SPF/DKIM/DMARC pass. This closes one post-cutover signup-to-welcome proof gap, not16 separate deliveries or normal CAPTCHA risk evaluation. Receipts remain in topic-subscriptions `.scratch/kirk-analytics-*` and `recaptcha-provider-headers.json`; the account chat's six-bullet local verification block retains fuller provenance. The supplied CAPTCHA key's Google usage/billing and verification method remain inaccessible. Provider warning repair is unresolved; a support request is not a repair. This SEO chat made no provider, billing or code change and will not duplicate that work.

Current remaining work: broader adjacent-intent query/page checks; controlled proposal/analytics execution and staff-filter matching; later mobile proposal steps and stored-post publishing; measured performance and remaining affected-layout/crop checks; bounded external-source and Summit outcome provenance. Sparse-pillar articles remain scheduled or unscheduled briefs, not published coverage. Qualified leads and revenue attribution are not inferred. Monday08AM CT review and09:15verification remain active for November9; December3 demand refresh is future work. Chrome remains with the account-support chat; no new browser, paid model call, inquiry or persistent helper was started.


### Live browser and measured template follow-up — 5 November 2026 CT

After the account chat released Chrome, the existing blog tab was reused for live proposal checks. An AI-search article opened its assigned drawer; blank website accepted; only AI Search Optimization preselected; budget/timeline selection reached step3. Back navigation retained dummy business fields. At393×852 Chrome iPhone16 emulation, all3steps, scrollable timing controls and the context/submit controls were visually inspected. Escape returned focus to the proposal link. Dummy values were cleared; submit was never clicked. Receipt `.scratch/proposal-live-browser-receipt.json` and screenshots/AX listed there. Initial navigation mistakenly used `qa=1`; corrected to actual `zinc_qa=1` before retained step3/mobile checks. Do not claim every initial interaction was excluded from analytics. This verifies browser emulation and progression, not physical-device behavior, a stored inquiry, notification or conversion.

Google's public PageSpeed UI succeeded despite the direct API's daily-quota429. Retained native UI reports cover8distinct representative production URLs on mobile and desktop at14d162b; single lab runs with no field data. All had0msTBT. Automated accessibility/best-practices/SEO scores were100 except the Bear Claw case's accessibility96/SEO92. These scores do not establish full WCAG conformance, field INP or ranking effects. Raw UI receipts and report URLs are retained in `.scratch/pagespeed-template-summary.json`; source `.scratch/pagespeed-*-ui.txt`.

|Template|Mobile performance / LCP|Desktop performance / LCP|
|---|---|---|
|home|84 / 4.2 s|98 / 1.1 s|
|services|100 / 1.2 s|100 / 0.3 s|
|service|100 / 1.2 s|100 / 0.4 s|
|work|100 / 1.7 s|100 / 0.5 s|
|case|96 / 2.7 s|100 / 0.6 s|
|contact|100 / 1.2 s|100 / 0.3 s|
|blog|98 / 1.3 s|100 / 0.3 s|
|article|100 / 1.5 s|100 / 0.4 s|

Home mobile LCP4.2seconds remains a measured gap; desktop CLS0.014 differs from the zero target. Native LCP details identify the approved Bear Claw image with render delay1830ms and an image-delivery diagnostic. This does not establish a single cause or authorize reducing image quality, resolution or changing the hero. Other illustrated pages also exceed the strict1.2second target; scores alone are not a gate waiver. The designed404 is excluded from scored runs.

Case audit details (`.scratch/pagespeed-case-failing-elements.txt`) identify the initially href-less hidden gallery control, clipped full-length screenshot hitboxes overlapping later disclosures, and related article links beside the next project. Prepared fixes give the gallery's existing anchor a real initial image URL (selected URL still replaces it on opening), bound screenshot anchors to their existing clipped frames, and give related-article links44px minimum height. Image sources/quality, hero, social image and gallery script are unchanged. Static checking now requires a crawlable original-image destination for every case before interaction.

Local validation:280tests,Astro0errors/0warnings/12hints,production-configured build and103HTMLchecks passed. First static attempt used a nonproduction build against analytics-on expectations and failed; rebuilding with the required production environment resolved it without changing checks. Existing-tab393px inspection verified screenshot/disclosure spacing, viewer opening, next-image title/count and Escape return focus, plus related/next-project spacing. Screenshots/AX `.scratch/case-patch-*`. The task-owned preview servers85806/87258 exited and were verified stopped; live light blog restored, emulation/DevTools closed. Protected checks, release and post-release native case audit remain required; local source/rendering is not a live score pass.

Independent final evidence review rejected four misattributed report filenames (About, Thanks, Privacy, Terms): their native URL fields still identified Work. Those four rows and12-template claim were removed before release. The8distinct-template baseline remains supported. Preserve raw mistaken receipts for diagnosis; filenames alone never establish the measured target. Future captures must assert native input URL, report path and device before inclusion.
The next-image AX receipt updates the title/count to tablet2/12 but retains the prior desktop href. Source changes that href synchronously; the receipt does not prove its current destination. Selected-image URL after navigation remains a rendering/evidence recheck, not a verified behavior claim.
