-- Apply in one transaction only after the owner's explicit production approval.
-- Restore the existing owner boundary without replacing publishing or AI functions.
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

-- A single statement keeps pages and posts on the same publication snapshot.
-- Return only published snapshots, never current draft columns. Same service-only
-- boundary as the existing build and publication callers; no public/editor access.
create function public.read_published_content() returns jsonb
language sql stable security invoker set search_path='' as $$
 select jsonb_build_object(
  'pages',coalesce((select jsonb_agg(jsonb_build_object('live',p.live,'live_at',p.live_at)) from public.pages p where p.live is not null),'[]'::jsonb),
  'posts',coalesce((select jsonb_agg(jsonb_build_object('live',p.live,'live_at',p.live_at)) from public.posts p where p.live is not null),'[]'::jsonb)
 )
$$;
revoke all on function public.read_published_content() from public,anon,authenticated;
grant execute on function public.read_published_content() to service_role;
notify pgrst, 'reload schema';
