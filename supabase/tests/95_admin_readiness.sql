-- Rehearsed with 0005 inside the rollback-only permission transaction.
do $$begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='admin_cache' and policyname='staff inserts metrics' and with_check like '%google_connection%') then return; end if;
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.blocked('editor cannot insert Google configuration',$q$insert into public.admin_cache(key,value) values('google_connection','{"property":"1","site":""}')$q$);
 perform dbtest.allowed('editor can cache metrics',$q$insert into public.admin_cache(key,value) values('dbtest-metrics','{}')$q$);
 execute 'set local role postgres';
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a001","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.allowed('owner configures Google',$q$insert into public.admin_cache(key,value) values('google_connection','{"property":"1","site":""}') on conflict(key) do update set value=excluded.value$q$);
 execute 'set local role postgres';
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.blocked('editor cannot change Google configuration',$q$update public.admin_cache set value='{}' where key='google_connection'$q$);
 perform dbtest.blocked('editor cannot rename cache into Google configuration',$q$update public.admin_cache set key='google_connection' where key='dbtest-metrics'$q$);
 execute 'set local role postgres';
 update public.posts set status='published' where slug='dbtest-publish';
 execute 'set local role service_role';
 perform public.publish_all('00000000-0000-4000-8000-00000000a001');
 execute 'set local role postgres';
 perform dbtest.ok('first publication is recorded in the snapshot',(select published_at is not null and (live->>'published_at')::timestamptz=published_at from public.posts where slug='dbtest-publish'));
 -- Give the first publication a distinct date so a later now() cannot hide a regression.
 update public.posts set published_at='2026-09-01T12:00:00Z',live_at='2026-09-01T12:00:00Z',live=jsonb_set(live,'{published_at}','"2026-09-01T12:00:00Z"') where slug='dbtest-publish';
 execute 'set local role service_role';
 perform public.publish_all('00000000-0000-4000-8000-00000000a001');
 execute 'set local role postgres';
 perform dbtest.ok('republishing preserves the first publication date',(select published_at='2026-09-01T12:00:00Z' and (live->>'published_at')::timestamptz=published_at from public.posts where slug='dbtest-publish'));
 perform dbtest.ok('publish cutoff is the snapshot time',(select (value->>'at')::timestamptz=(select live_at from public.posts where slug='dbtest-publish') from public.admin_cache where key='last_publish'));
end $$;
