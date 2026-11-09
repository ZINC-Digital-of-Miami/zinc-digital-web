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
