-- Preserve actual content-edit timestamps in published SEO snapshots.
-- Prepare/rehearse first; live application requires the owner's exact approval.
create function private.content_snapshot(p_row jsonb) returns jsonb
language plpgsql immutable set search_path='' as $$
declare
 content jsonb:=p_row-array['live','live_at','updated_at','created_at','updated_by'];
 previous jsonb:=case when jsonb_typeof(p_row->'live')='object' then p_row->'live' else null end;
begin
 -- Bulk publishing touches row.updated_at even when content has not changed.
 -- Only a changed semantic snapshot may advance its content modification date.
 if previous is null or content is distinct from (previous-'updated_at') then
  if p_row->>'updated_at' is not null then
   return content||jsonb_build_object('updated_at',p_row->'updated_at');
  end if;
 elsif previous?'updated_at' then
  return content||jsonb_build_object('updated_at',previous->'updated_at');
 end if;
 -- Legacy snapshots with an unknown modification date remain unknown until edited.
 return content;
end $$;
revoke all on function private.content_snapshot(jsonb) from public,anon,authenticated;
grant execute on function private.content_snapshot(jsonb) to service_role;

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
 update public.pages p set live=private.content_snapshot(to_jsonb(p)),live_at=now();
 get diagnostics n=row_count;
 update public.posts p set live=private.content_snapshot(to_jsonb(p)),live_at=now();
 get diagnostics m=row_count;
 insert into public.admin_cache(key,value,fetched_at) values('last_publish',jsonb_build_object('actor',p_actor,'at',now(),'count',n+m,'status','pending'),now())
  on conflict(key) do update set value=excluded.value,fetched_at=excluded.fetched_at;
 return n+m;
end $$;
