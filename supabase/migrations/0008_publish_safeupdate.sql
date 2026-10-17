-- Publish intentionally snapshots every content row. Supabase's PostgREST
-- safeupdate guard requires explicit WHERE clauses even in this owner-only RPC.
-- Primary keys are non-null, so these predicates preserve all-row coverage.
-- Prepared for exact owner approval; do not apply implicitly during deployment.
create or replace function private.publish_all(p_actor uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare n integer; m integer;
begin
 perform pg_advisory_xact_lock(hashtext('zinc-publish'));
 if not exists(select 1 from public.staff where user_id=p_actor and role='owner') then raise exception 'owner role required'; end if;
 update public.posts p set published_at=coalesce(
  p.published_at,
  case when p.live->>'status'='published' then coalesce((p.live->>'published_at')::timestamptz,p.live_at) end,
  now()
 ) where p.status='published' and p.published_at is null;
 update public.pages p set live=private.content_snapshot(to_jsonb(p)),live_at=now() where p.id is not null;
 get diagnostics n=row_count;
 update public.posts p set live=private.content_snapshot(to_jsonb(p)),live_at=now() where p.id is not null;
 get diagnostics m=row_count;
 insert into public.admin_cache(key,value,fetched_at) values('last_publish',jsonb_build_object('actor',p_actor,'at',now(),'count',n+m,'status','pending'),now())
  on conflict(key) do update set value=excluded.value,fetched_at=excluded.fetched_at;
 return n+m;
end $$;
