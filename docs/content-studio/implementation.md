# Content Studio implementation

Owner approved 9 November 2026. Existing admin, three voices, topic research, native article/pillar/query metrics, instructional resources and evidence-based editorial review. Wendy's article-cluster rewrite remains held for separate owner approval. No Docker. No changes to public articles or automatic publishing.

Architecture: add /admin/content-studio/ within AdminLayout and link Posts. Reuse native Google and existing SEO evidence. Store private versioned working documents in existing staff-only admin_cache, never public posts/live snapshots. GPT writes; Claude interprets evidence and reviews. Arithmetic remains deterministic. Use existing authenticated server transports; no credentials in browser.

- [x] Build strict document/check/voice model; optimistic saves and retained revisions; prohibit publication from Studio.
- [x] Reuse article performance collection, add native GSC query/current/previous position and daily observations; retain provenance and completeness.
- [x] Build responsive dashboard, pillar tracking, article inventory, topic brief, manuscript, resource/check review and history.
- [ ] Integrate GPT connection and Claude interpretation with idempotency, saved usage and explicit failure states. No model automatically approves work.
- [ ] Test authorization, stale writes, source gaps, weighted arithmetic, revision invalidation, hold preservation and rendered narrow/light/dark layouts.
- [ ] Fresh scoped review, Node24 checks, protected GitHub release and production verification.

Open access decision: current GPT transport is Codex subscription runner, not standard OpenAI API. Owner asked which current account transport to use. No credential/configuration changes authorized. Existing Claude API configuration must be verified without exposing keys.

Research rules: preserve eleven service categories; substantive pillar overview plus supporting articles; no all-to-all links. Every new-topic proposal receives existing inventory, exact measurement periods/gaps and primary service. No invented demand or causal claims.

Visuals: approved admin shell, modern sans type, charcoal/off-white/teal with restrained magenta, sparklines preserving date gaps, gauges only for defined review completion. Mockup is reference, not proof of implementation.

## Verified checkpoint — 9 November 2026 CT

Implemented locally on codex/content-studio, based on d9385ca. 46 repository articles and eleven service categories; effective admin overrides are read through loadPublished at runtime. Native GA4/GSC observations, source/date limitations, sparklines, service referrals, query comparisons/history and sorting are integrated. GPT requests currently use the existing Codex subscription runner provisionally; choosing that connection versus a separately billed OpenAI API project remains pending. Claude uses the existing server-only API and transactional execution receipts. Arithmetic remains deterministic.

Three complete canonical voice instructions and the adapted editorial workflow ship server-side. Private working drafts retain revisions, comments and side-by-side comparisons; edits invalidate checks. Every mandatory check must pass before owner-only JSON handoff. Wendy's article-cluster slug has an explicit handoff hold. No public manuscript was changed. No model request was executed during this task.

Scoped review identified stale response mixing, missing query history, oversized context and review-history namespace issues. These were corrected. Node24: 312 tests pass; Astro check zero errors/warnings (13 hints); final build passes; check-site passes104HTMLfiles. Tests include actual editor handlers for delayed document loads, typing, saves and comments, plus mandatory gate and Wendy-hold rejection. Temporary rendering fixture inspected desktop light/dark and initial390/320 layouts. This does NOT establish authenticated full-flow/mobile editing or provider execution. Task preview server and temporary browser tabs stopped; fixture routes removed.

Vercel's existing signed-in browser shows zinc-digital-web, production d9385ca, and ANTHROPIC_API_KEY configured for Production only. No key values were revealed. No OpenAI API key appears in its project variable list. Native connectors expose different projects; no other project was changed. The website admin currently presents staff sign-in, so authenticated save/readback, native metric refresh, model execution and deployed UI verification remain open. Automatic review rejected a proposed credential read from another worktree; it was not executed. Safer browser inspection resolved project/configuration visibility without that token.

Release remains pending: resolve GPT transport selection, obtain a signed-in website admin session, verify authenticated workflows and provider execution, then protected GitHub checks/merge and production readback. Standard API billing is not implied by a ChatGPT subscription. Fixed-location city ranks, AI-citation measurements and qualified-lead attribution remain unavailable unless their actual sources are connected; they are not inferred from GSC average position.

Work add: this is private agency admin/editorial infrastructure, excluded by prepare-work-adds. No client-facing Work entry or invented time was created.

PR119 preview caught Vercel upload exclusion of the runtime voice/workflow files (the local build had the files). Added narrow .vercelignore exceptions for workflow.md and voices/ only; implementation notes remain excluded. Await the replacement deployment result before claiming preview success.

## Superseding API decision — 9 November 2026 CT

Owner selected a separate OpenAI API account and GPT-6.1 Terra with High reasoning. Removed the provisional subscription writer integration and restored the shared codex-jobs module to its original implementation. Content Studio now uses the server-only Responses API with OPENAI_API_KEY and OPENAI_WRITING_MODEL=gpt-6.1-terra, reasoning.effort=high, store=false, no tools, no implicit retries or subscription fallback. Existing transactional admin-cache receipts retain provider/request/response identity, configured and returned model, reasoning setting and actual token usage. Known terminal receipts are persisted immediately; incomplete/refused responses cannot be applied. Source: https://developers.openai.com/api/docs/models/gpt-6.1-terra and https://developers.openai.com/api/docs/guides/streaming-responses .

Owner has the new key and authorized clipboard-assisted configuration. Prepared Vercel Secret input with Production+Preview selected; computer control of Codex and clipboard reading both failed. No key was read, pasted, printed or saved by this task. At last readback no OPENAI variable was listed. Owner sign-in and secure key/model save remain pending; never claim provider execution from configuration alone. Prior preview after the upload-exclusion fix succeeded; latest direct-API changes require new checks/deployment.

Direct-API validation checkpoint:320tests pass, Astro check zero errors/warnings (13hints), build and104HTMLchecks pass. Fresh scoped API review findings corrected: exact completed-request Apply binding, terminal receipt persistence, stream cancellation on receipt-storage failure, and refusal rejection. OPENAI_WRITING_MODEL=gpt-6.1-terra saved through Vercel UI for Production+Preview; save confirmation and environment readback observed. High reasoning is explicit in the request. A newly added generated-name secret appeared; awaiting owner confirmation before renaming it to OPENAI_API_KEY. No secret value read or API execution claimed.

## Current routing and release checkpoint — 9 November 2026 CT

Owner superseded the earlier provider split: Fable5.1 High handles SEO, research, planning, development and orchestration; Terra6.1 High handles content writing, creative work, image-tool direction and site chat. Active SEO review/specialist and Research requests now use direct provider APIs. Studio planning/development/orchestration actions produce explicit proposals, not arbitrary code execution or deployment. Existing public content and Wendy's owner-review hold remain unchanged.

Claude ZINC_ANTHROPIC_API_KEY save confirmed in Vercel for Production and Preview. Vercel rejects renaming sensitive variables. Owner explicitly approved OPENAI_API_KEY_VARIABLE referencing the existing generated-name secret; server resolves its value, never uses its name as the credential, and never silently falls back to another account. Reference and existing-secret Production+Preview targets saved through the current Vercel CLI login; values never read or printed. Empty OPENAI_API_KEY browser form is not required. API execution remains unverified until preview tests.

Fresh scoped review identified unrecoverable SEO request IDs, discarded Research API receipts and missing response-cancellation propagation. Client retains SEO IDs before POST; Research persists provider receipts and explicitly aborts on stream cancellation.325tests pass, typecheck0errors/0warnings. Build104-page checks passed before the final receipt/reference fixes; exact-head build and CI remain required. Image responses retain review-only WebP drafts using Terra's supported image-generation tool. Model identity/effort, request IDs and actual usage are recorded separately from configuration.

Sources: https://platform.claude.com/docs/en/models/fable-5-1/overview ; https://developers.openai.com/api/docs/models/gpt-6.1-terra ; https://developers.openai.com/api/docs/guides/image-generation .

Authenticated preview evidence — 9 November 2026 12:18 PM CT: owner authorized sending/reading the staff link for kirk@zincdigital.co; preview authentication succeeded. Native Google performance refresh succeeded for GA4 494489814 and GSC https://www.zincdigital.co/, matched2026-10-10–2026-11-06 versus2026-09-12–2026-10-09.46articles/11pillars rendered. Terra completed an actual high-effort request: req_5c1e6a0528074c17ac29b0dc67424d35, resp_0d3b6190913b0761016af20e577f3487d289dd8fda2932136a, actualmodel gpt-6.1-terra,38input/7outputtokens,2026-11-09T18:18:00.516Z. Fable model-access preflight failed before generation; added safe HTTP/error-type diagnostics. Backend idle-refresh erased the visible result while preserving its cache receipt; model-test pages now suppress idle replacement. No secret read, no article published.

GitHub run42671964072 initially failed before any jobs with internal server error correlation39ee3e42-cb6a-4e57-a658-4f7c777cf239; exact-head rerun requested. This is not a code-test failure or a passing required check. Release remains pending.
