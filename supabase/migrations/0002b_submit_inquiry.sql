-- 0002b_submit_inquiry (design section 5; Codex P1 on PR #9). The contact form's rate limit counted and then
-- inserted in two calls, so parallel requests from one client could all pass. public.submit_inquiry takes a
-- per-client advisory lock for the transaction, counts that client's recent inquiries and inserts in one step.
-- The limits come from src/lib/inquiry.ts (RATE). Only the server's secret key (service_role) may call it.
-- Rehearse with `node scripts/db-test.mjs supabase/migrations/0002b_submit_inquiry.sql`; applied with the owner's go.

create function public.submit_inquiry(
  p_inquiry jsonb, p_client_hash text,
  p_short int, p_short_secs int, p_day int, p_day_secs int
) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  v_now timestamptz := clock_timestamp();
  v_short int; v_short_oldest timestamptz;
  v_day int; v_day_oldest timestamptz;
  v_id uuid;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('inquiry:' || p_client_hash, 0));
  select count(*), min(created_at) into v_short, v_short_oldest from public.inquiries
    where client_hash = p_client_hash and created_at > v_now - make_interval(secs => p_short_secs);
  if v_short >= p_short then
    return jsonb_build_object('retry_after', greatest(1, ceil(extract(epoch from v_short_oldest + make_interval(secs => p_short_secs) - v_now)))::int);
  end if;
  select count(*), min(created_at) into v_day, v_day_oldest from public.inquiries
    where client_hash = p_client_hash and created_at > v_now - make_interval(secs => p_day_secs);
  if v_day >= p_day then
    return jsonb_build_object('retry_after', greatest(1, ceil(extract(epoch from v_day_oldest + make_interval(secs => p_day_secs) - v_now)))::int);
  end if;
  insert into public.inquiries (name, company, email, website, services, budget, timeline, message, source_path, stage, client_hash, created_at)
  values (
    p_inquiry->>'name', p_inquiry->>'company', p_inquiry->>'email', p_inquiry->>'website',
    array(select jsonb_array_elements_text(coalesce(p_inquiry->'services', '[]'::jsonb))),
    p_inquiry->>'budget', p_inquiry->>'timeline', p_inquiry->>'message', p_inquiry->>'source_path', 'new', p_client_hash, v_now
  )
  returning id into v_id;
  return jsonb_build_object('id', v_id);
end $$;
revoke all on function public.submit_inquiry(jsonb, text, int, int, int, int) from public, anon, authenticated;
grant execute on function public.submit_inquiry(jsonb, text, int, int, int, int) to service_role;
