-- Editor and owner sessions (the publishable key with a staff session). Both work the inquiry board; staff
-- changes and other owner-only actions go through the server, so neither may write staff rows here.
reset role;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}', true);
set local role authenticated;
select dbtest.ok('editor: staff_role() is editor', public.staff_role() = 'editor');
select dbtest.ok('editor: is_owner() is false', not private.is_owner());
select dbtest.allowed('editor reads inquiries', 'select 1 from public.inquiries');
select dbtest.allowed('editor reads the inquiry board', 'select 1 from public.inquiry_board');
select dbtest.allowed('editor moves a stage', $q$update public.inquiries set stage = 'contacted' where id = '00000000-0000-4000-8000-00000000b001'$q$);
select dbtest.allowed('editor re-sends a notification', $q$update public.inquiries set notify_status = 'sent', notify_attempts = notify_attempts + 1 where id = '00000000-0000-4000-8000-00000000b001'$q$);
select dbtest.allowed('editor logs an email', $q$insert into public.inquiry_events (inquiry_id, kind, payload, actor) values ('00000000-0000-4000-8000-00000000b001', 'email', '{"subject":"Next steps"}', auth.uid())$q$);
select dbtest.allowed('editor reads inquiry events', 'select 1 from public.inquiry_events');
select dbtest.allowed('editor reads staff', 'select 1 from public.staff', 2);
select dbtest.blocked('editor inserts an inquiry', $q$insert into public.inquiries (name, email, company, website, message, stage) values ('x', 'x@example.com', 'x', 'https://x.example', 'x', 'new')$q$);
select dbtest.blocked('editor deletes inquiries', 'delete from public.inquiries');
select dbtest.blocked('editor adds staff', $q$insert into public.staff (user_id, email, name, role) values ('00000000-0000-4000-8000-00000000a005', 'dbtest-new@zincdigital.co', 'x', 'editor')$q$);
select dbtest.blocked('editor changes a role', $q$update public.staff set role = 'owner'$q$);
select dbtest.blocked('editor removes staff', 'delete from public.staff');

reset role;
select dbtest.ok('the stage change is logged with the editor as actor', exists (
  select 1 from public.inquiry_events where inquiry_id = '00000000-0000-4000-8000-00000000b001' and kind = 'stage' and actor = '00000000-0000-4000-8000-00000000a002'));

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000a001","role":"authenticated"}', true);
set local role authenticated;
select dbtest.ok('owner: staff_role() is owner', public.staff_role() = 'owner');
select dbtest.ok('owner: is_owner() is true', private.is_owner());
select dbtest.allowed('owner archives an inquiry', $q$update public.inquiries set archived_at = now() where id = '00000000-0000-4000-8000-00000000b001'$q$);
select dbtest.allowed('the board still lists the archived inquiry', 'select 1 from public.inquiry_board where archived_at is not null');
select dbtest.blocked('owner writes staff directly', $q$update public.staff set name = 'x'$q$);

reset role;
select dbtest.ok('archiving is logged with the owner as actor', exists (
  select 1 from public.inquiry_events where inquiry_id = '00000000-0000-4000-8000-00000000b001' and kind = 'archived' and actor = '00000000-0000-4000-8000-00000000a001'));
