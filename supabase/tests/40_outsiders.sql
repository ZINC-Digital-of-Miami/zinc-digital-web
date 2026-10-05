-- A signed-in user who is not staff, and an offboarded user whose token is still live, reach nothing.
reset role;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000a003","role":"authenticated"}', true);
set local role authenticated;
select dbtest.ok('non-staff: staff_role() is null', public.staff_role() is null);
select dbtest.blocked('non-staff reads inquiries', 'select 1 from public.inquiries');
select dbtest.blocked('non-staff reads the inquiry board', 'select 1 from public.inquiry_board');
select dbtest.blocked('non-staff updates inquiries', $q$update public.inquiries set stage = 'closed'$q$);
select dbtest.blocked('non-staff reads inquiry events', 'select 1 from public.inquiry_events');
select dbtest.blocked('non-staff adds an inquiry event', $q$insert into public.inquiry_events (inquiry_id, kind) values ('00000000-0000-4000-8000-00000000b001', 'note')$q$);
select dbtest.blocked('non-staff reads staff', 'select 1 from public.staff');
select dbtest.blocked('non-staff reads pages', 'select 1 from public.pages');
select dbtest.blocked('non-staff reads posts', 'select 1 from public.posts');
select dbtest.blocked('non-staff reads seo_audits', 'select 1 from public.seo_audits');
select dbtest.blocked('non-staff reads stats_daily', 'select 1 from public.stats_daily');

reset role;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000a004","role":"authenticated"}', true);
set local role authenticated;
select dbtest.ok('offboarded: staff_role() is null', public.staff_role() is null);
select dbtest.blocked('offboarded reads inquiries', 'select 1 from public.inquiries');
select dbtest.blocked('offboarded reads the inquiry board', 'select 1 from public.inquiry_board');
select dbtest.blocked('offboarded updates inquiries', $q$update public.inquiries set stage = 'closed'$q$);
select dbtest.blocked('offboarded reads inquiry events', 'select 1 from public.inquiry_events');
select dbtest.blocked('offboarded adds an inquiry event', $q$insert into public.inquiry_events (inquiry_id, kind) values ('00000000-0000-4000-8000-00000000b001', 'note')$q$);
select dbtest.blocked('offboarded reads staff', 'select 1 from public.staff');
select dbtest.blocked('offboarded reads pages', 'select 1 from public.pages');
select dbtest.blocked('offboarded reads posts', 'select 1 from public.posts');
reset role;
