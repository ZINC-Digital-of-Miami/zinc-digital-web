-- Subscription-only outbound runner transport. Prepare/rehearse before owner-approved application.
create table public.codex_jobs (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references auth.users(id),
  kind text not null check (kind in ('connect','verify','research','seo')),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object'),
  status text not null default 'queued' check (status in ('queued','running','completed','failed')),
  result jsonb,
  error text,
  claimed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status='queued' and claimed_by is null) or status<>'queued')
);
create index codex_jobs_queue on public.codex_jobs(created_at) where status='queued';
create index codex_jobs_actor on public.codex_jobs(requested_by,created_at desc);
create table public.codex_runner_state (
  id text primary key default 'default' check(id='default'),
  heartbeat_at timestamptz,
  status text not null default 'offline' check(status in ('offline','signed_out','authenticating','verifying','ready','error')),
  model text not null default 'gpt-6.1-sol' check(model='gpt-6.1-sol'),
  reasoning_effort text not null default 'medium' check(reasoning_effort='medium'),
  auth_url text,
  message text,
  verified_at timestamptz,
  check(auth_url is null or (status='authenticating' and auth_url ~ '^https://auth[.]openai[.]com/'))
);
insert into public.codex_runner_state(id) values('default');
alter table public.codex_jobs enable row level security;
alter table public.codex_runner_state enable row level security;
revoke all on public.codex_jobs, public.codex_runner_state from public,anon,authenticated;
grant select on public.codex_jobs to authenticated;
-- The owner-authorized server route reads auth_url with its service client. Staff REST clients cannot.
grant select(id,heartbeat_at,status,model,reasoning_effort,message,verified_at) on public.codex_runner_state to authenticated;
grant all on public.codex_jobs, public.codex_runner_state to service_role;
create policy "staff read own codex jobs" on public.codex_jobs for select to authenticated
  using(private.is_staff() and requested_by=auth.uid());
create policy "staff read codex connection" on public.codex_runner_state for select to authenticated
  using(private.is_staff());

create function public.claim_codex_job(p_runner uuid) returns setof public.codex_jobs
language plpgsql security invoker set search_path='' as $$
begin
  if p_runner is null then raise exception 'runner identity required'; end if;
  -- A lost claim is failed explicitly, never automatically replayed. The owner can retry a new job.
  update public.codex_jobs set status='failed',error='The local runner disconnected. Retry this request.',updated_at=now()
    where status='running' and updated_at<now()-interval '15 minutes';
  update public.codex_jobs set status='failed',error='This request expired while the local runner was offline. Retry it.',updated_at=now()
    where status='queued' and created_at<now()-interval '30 minutes';
  return query
    update public.codex_jobs j set status='running',claimed_by=p_runner,updated_at=now()
    where j.id=(select q.id from public.codex_jobs q where q.status='queued'
      order by case when q.kind in ('connect','verify') then 0 else 1 end,q.created_at,q.id
      for update skip locked limit 1)
    returning j.*;
end $$;

create function public.finish_codex_job(p_job uuid,p_runner uuid,p_result jsonb default null,p_error text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
  if p_result is null and nullif(btrim(p_error),'') is null then raise exception 'result or error required'; end if;
  if p_result is not null and p_error is not null then raise exception 'result and error are mutually exclusive'; end if;
  update public.codex_jobs set status=case when p_error is null then 'completed' else 'failed' end,
    result=p_result,error=left(p_error,1000),updated_at=now()
    where id=p_job and claimed_by=p_runner and status='running';
  get diagnostics n=row_count;
  return n=1;
end $$;
revoke all on function public.claim_codex_job(uuid), public.finish_codex_job(uuid,uuid,jsonb,text) from public,anon,authenticated;
grant execute on function public.claim_codex_job(uuid), public.finish_codex_job(uuid,uuid,jsonb,text) to service_role;
notify pgrst, 'reload schema';
