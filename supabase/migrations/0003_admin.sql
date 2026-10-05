-- M4: draft editing and owner-only publishing. Rehearse with scripts/db-test.mjs; apply only with owner go.
alter table public.pages add column live jsonb, add column live_at timestamptz;
alter table public.posts add column live jsonb, add column live_at timestamptz,
  add column origin text not null default 'admin' check (origin in ('repo','admin'));
drop policy "public read published pages" on public.pages;
drop policy "public read published posts" on public.posts;
revoke all on public.pages, public.posts from anon, authenticated;
grant select on public.pages, public.posts to authenticated, service_role;
grant insert(path,template,title,meta_title,meta_description,focus_keyword,canonical,noindex,status,content,updated_by),
  update(template,title,meta_title,meta_description,focus_keyword,canonical,noindex,status,content,updated_by) on public.pages to authenticated;
grant insert(slug,title,excerpt,body,author,layer,cover_image,meta_title,meta_description,focus_keyword,noindex,status,published_at,updated_by,origin),
  update(title,excerpt,body,author,layer,cover_image,meta_title,meta_description,focus_keyword,noindex,status,published_at,updated_by) on public.posts to authenticated;
create table public.admin_cache (
  key text primary key, value jsonb not null, fetched_at timestamptz not null default now()
);
alter table public.admin_cache enable row level security;
revoke all on public.admin_cache from anon, authenticated;
grant select,insert,update on public.admin_cache to authenticated;
grant select,insert,update on public.admin_cache to service_role;
create policy "staff reads cache" on public.admin_cache for select to authenticated using (private.is_staff());
create policy "staff inserts metrics" on public.admin_cache for insert to authenticated with check (private.is_staff() and key not in ('last_publish','publish_lock'));
create policy "staff updates metrics" on public.admin_cache for update to authenticated using (private.is_staff() and key not in ('last_publish','publish_lock')) with check (private.is_staff() and key not in ('last_publish','publish_lock'));
alter table public.pages drop constraint pages_updated_by_fkey,
  add constraint pages_updated_by_fkey foreign key(updated_by) references auth.users(id) on delete set null;
alter table public.posts drop constraint posts_updated_by_fkey,
  add constraint posts_updated_by_fkey foreign key(updated_by) references auth.users(id) on delete set null;
alter table research.chats drop constraint chats_created_by_fkey,
  add constraint chats_created_by_fkey foreign key(created_by) references auth.users(id) on delete set null;
alter table research.documents drop constraint documents_created_by_fkey,
  add constraint documents_created_by_fkey foreign key(created_by) references auth.users(id) on delete set null;
alter table research.projects drop constraint projects_created_by_fkey,
  add constraint projects_created_by_fkey foreign key(created_by) references auth.users(id) on delete set null;
create function private.publish_all(p_actor uuid) returns integer language plpgsql security definer set search_path='' as $$
declare n integer; m integer;
begin
  perform pg_advisory_xact_lock(hashtext('zinc-publish'));
  if not exists(select 1 from public.staff where user_id=p_actor and role='owner') then raise exception 'owner role required'; end if;
  update public.pages p set live=to_jsonb(p)-array['live','live_at','updated_at','created_at','updated_by'], live_at=now();
  get diagnostics n=row_count;
  update public.posts p set live=to_jsonb(p)-array['live','live_at','updated_at','created_at','updated_by'], live_at=now();
  get diagnostics m=row_count;
  insert into public.admin_cache(key,value,fetched_at) values('last_publish',jsonb_build_object('actor',p_actor,'at',now(),'count',n+m,'status','pending'),now())
    on conflict(key) do update set value=excluded.value, fetched_at=excluded.fetched_at;
  return n+m;
end $$;
revoke all on function private.publish_all(uuid) from public,anon,authenticated;
grant execute on function private.publish_all(uuid) to service_role;
-- PostgREST exposes public, not private: the wrapper has the same service-only grant.
create function public.publish_all(p_actor uuid) returns integer language sql security invoker set search_path='' as $$select private.publish_all(p_actor)$$;
revoke all on function public.publish_all(uuid) from public,anon,authenticated;
grant usage on schema private to service_role;
grant execute on function public.publish_all(uuid) to service_role;
