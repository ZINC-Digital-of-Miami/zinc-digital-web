# Codex subscription connection

The admin sends private requests through Supabase. The runner on this Mac claims them over outbound HTTPS and uses the installed Codex CLI's supported app-server protocol. Research and SEO use `gpt-6.1-sol` with `medium` reasoning. There is no OpenAI API-key fallback.

## One-time setup

1. Review and obtain the owner's exact approval before applying `supabase/migrations/0006_codex_subscription.sql`. The application endpoints require that migration.
2. Use the existing local environment file on the external drive containing `PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`) and the existing `SUPABASE_SECRET_KEY` (also accepts `SUPABASE_SERVICE_ROLE` or `SUPABASE_SERVICE_ROLE_KEY`). Never put those values in command arguments, a plist, or source control. Existing Codex subscription credentials remain in the original Codex home.
3. With Node 24 and the installed Codex executable, prepare the login-start configuration:

   ```sh
   node scripts/install-codex-runner.mjs --env '/Volumes/Satechi Hub/zinc-digital-web/.env'
   ```

   This prepares a plist under the external drive's ignored `.codex-runner/` directory. It does not activate it or install software. Choose a permanent checkout for the runner before activation; a temporary worktree must remain available while its launch agent refers to it.

4. After the database setup and local activation are approved, run the same command with `--activate`. It creates the current user's `~/Library/LaunchAgents/co.zincdigital.codex-runner.plist` and starts the runner at login. An existing installation is never overwritten or unloaded automatically. External runtime state stays under `.codex-runner/`; credentials are not written there. launchd does not pre-open files or change directory on the removable drive before Node starts.
5. In **Backend → Codex subscription**, click **Connect Codex**. The browser opens Codex's authorization page. Complete sign-in on this Mac. Backend shows ready only after a completed model request. A valid existing ChatGPT login is reused; **Reconnect** can explicitly request a fresh supported sign-in flow without deleting credentials.

The CLI's sign-in flow may temporarily use its own loopback OAuth callback. The runner creates no public listener. Subscription authorization URLs expire and are cleared from cloud connection state after sign-in; tokens never enter browser or Vercel state.

## Verification and operation

To verify subscription execution without reading or writing the cloud job queue:

```sh
node scripts/codex-runner/run.mjs --verify
```

This uses one short subscription request and prints only connection status, model, and reasoning effort. The installed CLI needs normal access to its existing local Codex state database. The Mac must be awake, online, and have its external drive mounted. Backend reports offline when its heartbeat is older than one minute.

For a foreground runner, use `node scripts/codex-runner/run.mjs --env '<existing local environment file>'`. Do not run another foreground instance while its launch agent is active. Stop that foreground instance with Control-C. Foreground diagnostics contain fixed messages, never Codex stderr or request content. For the login service, inspect Backend connection state and `launchctl` process status; launchd file redirection is omitted to avoid removable-volume startup failures.

## Transport contract

- `codex_jobs`: `id`, `requested_by`, `kind` (`connect`, `verify`, `research`, `seo`), `payload`, `status` (`queued`, `running`, `completed`, `failed`), `result`, `error`, `created_at`, `updated_at`, and `claimed_by`.
- `connect` payload accepts optional `reconnect: true`; `verify` has no input. Both return `{connected:true}` only after inference completes.
- Research/SEO payload is `{instructions:string,input:string}`. Success returns `{text:string,model:"gpt-6.1-sol",reasoningEffort:"medium"}`. The runner never modifies content or publishes.
- `claim_codex_job(p_runner uuid)` returns zero or one job with an atomic row lock and claimant identity. `finish_codex_job(p_job uuid,p_runner uuid,p_result jsonb,p_error text)` returns a boolean and accepts only the current running claim.
- A running claim older than 15 minutes fails explicitly; a queued request older than 30 minutes expires. Neither is automatically replayed. Retrying creates a new request, so an old result cannot overwrite a new draft. Cloud failure can lose a generated result, but cannot publish content.
- `codex_runner_state` contains singleton `id='default'`, `heartbeat_at`, `status`, `model`, `reasoning_effort`, temporary `auth_url`, `message`, and `verified_at`.
- Only service-role server/runner clients mutate transport state. Staff can read their own jobs and public connection fields under RLS; anonymous users cannot. The authorization URL column is inaccessible to staff REST clients; only the owner-authorized server route returns it.

Focused checks: `node --test tests/codex-runner*.test.ts`. Database claim/permission checks are prepared in `supabase/tests/96_codex_subscription.sql`; applying or rehearsing against a live database still requires the exact project approval.

## Published SEO date provenance

The same release prepares `supabase/migrations/0007_publish_content_dates.sql`. It keeps an actual content-edit timestamp inside published snapshots, advances it only when meaningful snapshot fields change, and preserves an unknown legacy date rather than substituting the bulk publication time. This connects admin edits to article schema and sitemap modification dates. It preserves the existing owner check, publication lock, first-publication date and service-only publish entry point. Apply only with the owner's exact database approval; permission and provenance checks are prepared in `supabase/tests/97_publish_content_dates.sql`.
