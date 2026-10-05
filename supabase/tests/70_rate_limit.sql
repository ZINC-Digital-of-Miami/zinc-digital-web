-- The contact form's rate limit (design section 5): public.submit_inquiry counts and inserts under a per-client
-- lock, 5 per 10 minutes and 20 per day, and only the server's secret key may call it.
\set inquiry '{"name":"Rate Test","company":"Rate Co","email":"rate@example.com","website":"https://rate.example","services":["seo"],"budget":"Under $5k/mo","timeline":"Exploring options","message":"Rate limit test.","source_path":"/contact/"}'
reset role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;
select dbtest.ok('submit_inquiry stores the first five from one client', (
  select bool_and(public.submit_inquiry(:'inquiry'::jsonb, 'dbtest-rate', 5, 600, 20, 86400) ? 'id') from generate_series(1, 5)));
select dbtest.ok('the sixth within ten minutes is refused with a retry time', (
  public.submit_inquiry(:'inquiry'::jsonb, 'dbtest-rate', 5, 600, 20, 86400)->>'retry_after')::int between 1 and 600);
select dbtest.ok('another client is not affected', public.submit_inquiry(:'inquiry'::jsonb, 'dbtest-other', 5, 600, 20, 86400) ? 'id');
select dbtest.ok('the stored inquiry is new, pending, hashed and complete', exists (
  select 1 from public.inquiries where client_hash = 'dbtest-other' and stage = 'new' and notify_status = 'pending'
    and services = array['seo'] and timeline = 'Exploring options' and company = 'Rate Co'));

reset role;
insert into public.inquiries (name, email, company, website, message, stage, client_hash, created_at)
  select 'Day Test', 'day@example.com', 'Day Co', 'https://day.example', 'x', 'new', 'dbtest-day', now() - make_interval(hours => g) from generate_series(1, 20) g;
set local role service_role;
select dbtest.ok('the twenty-first within a day is refused', (
  public.submit_inquiry(:'inquiry'::jsonb, 'dbtest-day', 5, 600, 20, 86400)->>'retry_after')::int between 1 and 86400);

reset role;
select dbtest.ok('anonymous and signed-in users cannot call submit_inquiry', to_regprocedure('public.submit_inquiry(jsonb,text,int,int,int,int)') is not null
  and not has_function_privilege('anon', to_regprocedure('public.submit_inquiry(jsonb,text,int,int,int,int)'), 'execute')
  and not has_function_privilege('authenticated', to_regprocedure('public.submit_inquiry(jsonb,text,int,int,int,int)'), 'execute'));
