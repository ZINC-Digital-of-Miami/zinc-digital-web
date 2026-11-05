-- Publishing must not silently assign a service; drafts can remain unassigned.
do $$
begin
 if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='posts' and column_name='primary_service') then return;end if;
 perform dbtest.ok('editors can save an explicit primary service',has_column_privilege('authenticated','public.posts','primary_service','UPDATE'));
 perform dbtest.ok('editors still cannot update live snapshots',not has_column_privilege('authenticated','public.posts','live','UPDATE'));
 perform dbtest.ok('editors still cannot publish',not has_function_privilege('authenticated','private.publish_all(uuid)','EXECUTE'));
 insert into public.posts(slug,title,body,layer,status,origin) values('dbtest-pillar','Pillar test','# Body','Build','draft','admin');
 perform dbtest.ok('an unassigned draft remains unassigned',(select primary_service is null from public.posts where slug='dbtest-pillar'));
 perform dbtest.refused('unknown services are rejected',$q$update public.posts set primary_service='invalid-service' where slug='dbtest-pillar'$q$,'%check constraint%');
 update public.posts set status='published' where slug='dbtest-pillar';
 perform dbtest.refused('publish refuses an unassigned article',$q$select public.publish_all('00000000-0000-4000-8000-00000000a001')$q$,'%Assign a primary service%');
 update public.posts set primary_service='apps' where slug='dbtest-pillar';
 perform public.publish_all('00000000-0000-4000-8000-00000000a001');
 perform dbtest.ok('published snapshot retains the assigned primary service',(select live->>'primary_service'='apps' from public.posts where slug='dbtest-pillar'));
end $$;
