-- One transactional gate for Claude reviews and subscription research/SEO starts.
-- Prepared only; apply through the reviewed production migration approval path.
create function private.coordinate_ai_work() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if tg_table_name='codex_jobs' then
  if new.kind not in ('research','seo') or new.status not in ('queued','running') then return new;end if;
  perform pg_advisory_xact_lock(hashtext('zinc-ai-work'));
  if exists(select 1 from public.admin_cache where left(key,11)='seo_review:' and left(key,16)<>'seo_review:scan:'
    and value->>'status'='running' and fetched_at>now()-interval '15 minutes') then
   raise exception 'A Claude SEO review is running. Start this after it finishes, usually within 10 minutes.';
  end if;
 else
  if left(new.key,11)<>'seo_review:' or left(new.key,16)='seo_review:scan:' or coalesce(new.value->>'status','')<>'running' then return new;end if;
  perform pg_advisory_xact_lock(hashtext('zinc-ai-work'));
  -- Let the existing unique-key reservation report duplicate delivery normally.
  if exists(select 1 from public.admin_cache where key=new.key) then return new;end if;
  if exists(select 1 from public.codex_jobs where kind in ('research','seo') and status in ('queued','running')) then
   raise exception 'Codex subscription work is queued or running.';
  end if;
 end if;
 return new;
end $$;
revoke all on function private.coordinate_ai_work() from public,anon,authenticated;
create trigger codex_ai_work before insert or update of status on public.codex_jobs
 for each row execute function private.coordinate_ai_work();
create trigger claude_ai_work before insert on public.admin_cache
 for each row execute function private.coordinate_ai_work();
notify pgrst,'reload schema';
