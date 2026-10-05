-- The website's server with the secret key (service_role): the contact path and staff management (design
-- sections 5 and 7.2). It may not delete inquiries.
reset role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;
select dbtest.allowed('server stores an inquiry', $q$insert into public.inquiries (id, name, email, company, website, budget, services, timeline, message, source_path, stage, client_hash)
  values ('00000000-0000-4000-8000-00000000b002', 'Lee Park', 'lee@parkgoods.com', 'Park Goods', 'https://parkgoods.com', '$10–25k/mo', array['seo'], 'Within three months', 'Rankings dropped.', '/contact/', 'new', 'dbtest-hash')$q$);
select dbtest.allowed('server counts recent inquiries by client hash', $q$select created_at from public.inquiries where client_hash = 'dbtest-hash' and created_at >= now() - interval '1 day'$q$);
select dbtest.allowed('server records the notification', $q$update public.inquiries set notify_status = 'sent', notify_error = null, notify_attempts = notify_attempts + 1, notified_at = now()
  where id = '00000000-0000-4000-8000-00000000b002'$q$);
select dbtest.blocked('server deletes inquiries', 'delete from public.inquiries');
select dbtest.blocked('server reads inquiry_events', 'select 1 from public.inquiry_events');
select dbtest.allowed('server reads staff', 'select 1 from public.staff', 2);
select dbtest.allowed('server invites staff', $q$insert into public.staff (user_id, email, name, role) values ('00000000-0000-4000-8000-00000000a005', 'dbtest-new@zincdigital.co', 'New Editor', 'editor')$q$);
select dbtest.allowed('server changes a role', $q$update public.staff set role = 'owner' where user_id = '00000000-0000-4000-8000-00000000a005'$q$);
select dbtest.allowed('server offboards staff', $q$delete from public.staff where user_id = '00000000-0000-4000-8000-00000000a005'$q$);

reset role;
select dbtest.ok('the notification outcome is logged', exists (
  select 1 from public.inquiry_events where inquiry_id = '00000000-0000-4000-8000-00000000b002' and kind = 'notify' and payload->>'status' = 'sent' and actor is null));
