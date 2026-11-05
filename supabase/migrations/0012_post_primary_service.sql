-- Explicit article ownership. Prepared only: production application needs exact owner approval.
-- Run in one transaction. The reviewed map covers existing repository articles only.
select pg_advisory_xact_lock(hashtext('zinc-publish'));
lock table public.posts in share row exclusive mode;
alter table public.posts add column primary_service text
  check (primary_service in ('shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence'));
grant insert(primary_service), update(primary_service) on public.posts to authenticated;

create temporary table pillar_assignments(slug text primary key, service text not null) on commit drop;
insert into pillar_assignments values
  ('ai-search-results-and-generative-search-optimization','ai-search-optimization'),
  ('google-shopping-ad-management-2026','shopping-ads'),
  ('shopify-seo-launch-checklist','shopify'),
  ('four-pillars-of-seo-operators-view','seo'),
  ('technical-seo-ten-fixes-that-move-rankings','seo'),
  ('local-seo-2026-operators-manual','local-seo'),
  ('content-marketing-plan-that-produces-pipeline','seo'),
  ('when-web-design-trends-actually-matter','web-design'),
  ('shopify-seo-problems-real-fixes','shopify'),
  ('seven-digital-channels-which-to-skip','business-intelligence'),
  ('three-years-of-algorithm-updates-what-moved-rankings','seo'),
  ('shopify-google-merchant-center-checklist','shopping-ads'),
  ('marketing-budgets-during-economic-stress','business-intelligence'),
  ('how-to-read-a-google-algorithm-update','seo'),
  ('google-search-console-the-operators-guide','seo'),
  ('how-long-seo-actually-takes','seo'),
  ('seo-in-2026-what-changed-what-to-ignore','seo'),
  ('duplicate-content-isnt-a-penalty-but-its-a-tax','seo'),
  ('ga4-ecommerce-event-validation','business-intelligence'),
  ('search-console-canonical-indexing-debugging','seo'),
  ('merchant-center-feed-diagnostics','shopping-ads'),
  ('content-briefs-search-intent-internal-links','seo'),
  ('ga4-utm-naming-conventions','business-intelligence'),
  ('search-console-query-page-review','seo'),
  ('shopify-product-page-seo','shopify'),
  ('google-shopping-variant-feed-checklist','shopping-ads'),
  ('internal-link-audit','seo'),
  ('content-refresh-review','seo'),
  ('service-page-content-checklist','seo'),
  ('paid-media-landing-page-checklist','google-search-ads'),
  ('google-core-update-review','seo'),
  ('holiday-ecommerce-preparation','shopify'),
  ('ecommerce-seasonal-campaign-plan','shopping-ads'),
  ('research-consensus-report','business-intelligence'),
  ('ai-research-workflow','business-intelligence'),
  ('ai-competitor-research-prompts','business-intelligence'),
  ('merchant-center-basics','shopping-ads'),
  ('tiktok-ads-basics','tiktok-ads'),
  ('meta-ads-basics','social-ads'),
  ('ai-search-content-strategy','ai-search-optimization'),
  ('business-intelligence-basics','business-intelligence'),
  ('what-ai-discovery-changes-editorial-plan','ai-search-optimization'),
  ('wordpress-php-security-moving-to-astro','web-design'),
  ('build-a-content-hub-people-can-use','seo'),
  ('what-can-you-afford-to-spend-on-an-order','business-intelligence');

-- Stop rather than guess ownership for an independently authored, published admin post.
do $$begin
 if exists(select 1 from public.posts p where p.live->>'status'='published'
   and not exists(select 1 from pillar_assignments a where a.slug=p.slug)) then
  raise exception 'Published admin posts need a reviewed primary-service assignment before this migration.';
 end if;
end $$;

-- Preserve draft/publication timestamps while adding the reviewed structural assignment.
-- Only the timestamp trigger is suspended, under the table lock; permissions/RLS remain intact.
alter table public.posts disable trigger posts_touch;
update public.posts p set primary_service=a.service,
 live=case when p.live is null then null else p.live||jsonb_build_object('primary_service',a.service) end
 from pillar_assignments a where p.slug=a.slug;
alter table public.posts enable trigger posts_touch;

create or replace function private.publish_all(p_actor uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare n integer; m integer;
begin
 perform pg_advisory_xact_lock(hashtext('zinc-publish'));
 if not exists(select 1 from public.staff where user_id=p_actor and role='owner') then raise exception 'owner role required'; end if;
 -- Serialize all article edits/inserts with validation and snapshot creation.
 lock table public.posts in share row exclusive mode;
 if exists(select 1 from public.posts where status='published' and primary_service is null) then
  raise exception 'Assign a primary service to every published post before publishing.';
 end if;
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
notify pgrst, 'reload schema';
