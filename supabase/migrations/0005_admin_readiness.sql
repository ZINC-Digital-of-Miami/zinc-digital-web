-- Preserve first publication dates and enforce owner-only Google configuration.
-- Rehearse with db-test.mjs; applying this live requires the owner's exact go.
alter policy "staff inserts metrics" on public.admin_cache with check (
  private.is_staff() and key not in ('last_publish','publish_lock')
  and (key <> 'google_connection' or private.is_owner())
);
alter policy "staff updates metrics" on public.admin_cache using (
  private.is_staff() and key not in ('last_publish','publish_lock')
  and (key <> 'google_connection' or private.is_owner())
) with check (
  private.is_staff() and key not in ('last_publish','publish_lock')
  and (key <> 'google_connection' or private.is_owner())
);
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
  update public.pages p set live=to_jsonb(p)-array['live','live_at','updated_at','created_at','updated_by'], live_at=now();
  get diagnostics n=row_count;
  update public.posts p set live=to_jsonb(p)-array['live','live_at','updated_at','created_at','updated_by'], live_at=now();
  get diagnostics m=row_count;
  insert into public.admin_cache(key,value,fetched_at) values('last_publish',jsonb_build_object('actor',p_actor,'at',now(),'count',n+m,'status','pending'),now())
    on conflict(key) do update set value=excluded.value, fetched_at=excluded.fetched_at;
  return n+m;
end $$;
