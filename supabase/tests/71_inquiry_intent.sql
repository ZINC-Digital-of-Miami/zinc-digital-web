-- Runs with the existing permission suite inside a rolled-back transaction.
reset role;
select dbtest.ok('existing inquiry fixture has no invented intent', exists (
  select 1 from public.inquiries where id = '00000000-0000-4000-8000-00000000b001' and intent is null));
set local role service_role;
select public.submit_inquiry('{"name":"Reader","email":"reader@example.com","message":"Editorial question","intent":"content_question"}', 'dbtest-content-intent', 5, 600, 20, 86400);
select public.submit_inquiry('{"name":"Reader","email":"reader@example.com","message":"General question","intent":"message"}', 'dbtest-message-intent', 5, 600, 20, 86400);
select dbtest.ok('short messages retain their distinct intent and pending delivery', (
  select count(*) = 2 from public.inquiries where client_hash in ('dbtest-content-intent','dbtest-message-intent') and intent in ('message','content_question') and notify_status = 'pending'));
select dbtest.ok('existing proposal clients receive explicit proposal intent', exists (
  select 1 from public.inquiries where client_hash = 'dbtest-other' and intent = 'proposal'));
select dbtest.refused('unknown intent cannot be persisted', $sql$
  select public.submit_inquiry('{"name":"Reader","email":"reader@example.com","intent":"arbitrary"}', 'dbtest-invalid-intent', 5, 600, 20, 86400)
$sql$, '%inquiries_intent_check%');
reset role;
