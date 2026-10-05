-- Anonymous visitors (the publishable key without a session) reach nothing in public (requirement 1.2, R9.3).
reset role;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;
select dbtest.blocked('anon reads inquiries', 'select 1 from public.inquiries');
select dbtest.blocked('anon submits an inquiry directly', $q$insert into public.inquiries (name, email, company, website, message, stage) values ('x', 'x@example.com', 'x', 'https://x.example', 'x', 'new')$q$);
select dbtest.blocked('anon updates inquiries', $q$update public.inquiries set stage = 'closed'$q$);
select dbtest.blocked('anon reads inquiry_events', 'select 1 from public.inquiry_events');
select dbtest.blocked('anon reads the inquiry board', 'select 1 from public.inquiry_board');
select dbtest.blocked('anon reads staff', 'select 1 from public.staff');
select dbtest.blocked('anon reads pages', 'select 1 from public.pages');
select dbtest.blocked('anon reads posts', 'select 1 from public.posts');
select dbtest.blocked('anon reads seo_audits', 'select 1 from public.seo_audits');
select dbtest.blocked('anon reads stats_daily', 'select 1 from public.stats_daily');
select dbtest.refused('anon calls staff_role', 'select public.staff_role()', 'permission denied%');

reset role;
select dbtest.ok('anon holds no privilege on ' || c.oid::regclass, not has_table_privilege('anon', c.oid, 'select, insert, update, delete, truncate, references, trigger'))
  from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v', 'm', 'p');
select dbtest.ok('no policy on inquiries applies to anonymous users', not exists (
  select 1 from pg_policies where schemaname = 'public' and tablename = 'inquiries' and roles && array['anon', 'public']::name[]));
