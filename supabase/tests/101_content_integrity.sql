-- Service-only atomic snapshot reader; ordinary staff keep their existing editor APIs.
set local role anon;
select dbtest.refused('anonymous cannot read build snapshots','select public.read_published_content()','%permission denied%');
reset role;
set local role authenticated;
select dbtest.refused('staff cannot call the build reader','select public.read_published_content()','%permission denied%');
reset role;
set local role service_role;
select dbtest.ok('reader returns both snapshot collections',
 jsonb_typeof(public.read_published_content()->'pages')='array'
 and jsonb_typeof(public.read_published_content()->'posts')='array');
select dbtest.ok('reader returns every saved page snapshot',
 jsonb_array_length(public.read_published_content()->'pages')=(select count(*) from public.pages where live is not null));
select dbtest.ok('reader returns every saved post snapshot',
 jsonb_array_length(public.read_published_content()->'posts')=(select count(*) from public.posts where live is not null));
select dbtest.ok('reader does not return draft columns',not exists(
 select 1 from jsonb_array_elements(public.read_published_content()->'pages') row,
 lateral jsonb_object_keys(row) field where field not in ('live','live_at')));
reset role;
