-- The structure the code relies on (requirement 1.2, design section 7.2).
reset role;
select dbtest.ok('inquiries has ' || col, exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inquiries' and column_name = col))
  from unnest(array['timeline', 'notify_status', 'notify_error', 'notify_attempts', 'notified_at', 'client_hash']) col;
select dbtest.ok('stage is the only stage field (no status column)', not exists (
  select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inquiries' and column_name = 'status'));
select dbtest.refused('notify_status accepts only pending, sent and failed', $q$update public.inquiries set notify_status = 'queued'$q$, '%violates check constraint%');
select dbtest.ok('inquiries are indexed by client hash and time', exists (
  select 1 from pg_indexes where schemaname = 'public' and tablename = 'inquiries' and indexdef like '%(client_hash, created_at)%'));
select dbtest.allowed('inquiry_events accepts notify and next_step', $q$insert into public.inquiry_events (inquiry_id, kind) values ('00000000-0000-4000-8000-00000000b001', 'notify'), ('00000000-0000-4000-8000-00000000b001', 'next_step')$q$, 2);
select dbtest.ok('inquiry_board is security_invoker', (select coalesce('security_invoker=true' = any(reloptions), false) from pg_class where oid = 'public.inquiry_board'::regclass));
select dbtest.ok('inquiry_board has ' || col, exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'inquiry_board' and column_name = col))
  from unnest(array['website', 'timeline', 'source_path', 'notify_status', 'archived_at']) col;
select dbtest.ok('staff_role() is security definer with an empty search_path', exists (
  select 1 from pg_proc where oid = to_regprocedure('public.staff_role()') and prosecdef and proconfig && array['search_path=""', 'search_path=']));
select dbtest.ok('only signed-in users may call staff_role()', has_function_privilege('authenticated', to_regprocedure('public.staff_role()'), 'execute')
  and not has_function_privilege('anon', to_regprocedure('public.staff_role()'), 'execute'));
select dbtest.ok('private.touch_updated_at() has a fixed search_path', (select proconfig is not null from pg_proc where oid = 'private.touch_updated_at()'::regprocedure));
select dbtest.ok('RLS is enabled on every public table', not exists (
  select 1 from pg_class where relnamespace = 'public'::regnamespace and relkind in ('r', 'p') and not relrowsecurity));
