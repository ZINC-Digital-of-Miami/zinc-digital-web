-- Executes only when the prepared subscription migration is part of the rollback-only rehearsal.
do $$
declare first_job record; second_job record;
begin
 if to_regclass('public.codex_jobs') is null then return; end if;
 insert into public.codex_jobs(id,requested_by,kind,payload) values
  ('00000000-0000-4000-8000-00000000c001','00000000-0000-4000-8000-00000000a001','seo','{}'),
  ('00000000-0000-4000-8000-00000000c002','00000000-0000-4000-8000-00000000a002','research','{}');
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a001","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.allowed('owner reads own subscription job',$q$select * from public.codex_jobs where id='00000000-0000-4000-8000-00000000c001'$q$);
 perform dbtest.blocked('owner cannot read another user job',$q$select * from public.codex_jobs where id='00000000-0000-4000-8000-00000000c002'$q$);
 perform dbtest.blocked('staff cannot change queue',$q$update public.codex_jobs set status='completed'$q$);
 perform dbtest.blocked('staff cannot change runner state',$q$update public.codex_runner_state set status='ready'$q$);
 perform dbtest.allowed('staff can read connection status',$q$select status from public.codex_runner_state$q$);
 perform dbtest.blocked('staff REST clients cannot read OAuth URLs',$q$select auth_url from public.codex_runner_state$q$);
 perform dbtest.refused('staff cannot claim requests',$q$select * from public.claim_codex_job('00000000-0000-4000-8000-00000000d001')$q$,'%permission denied%');
 perform dbtest.refused('staff cannot finish requests',$q$select public.finish_codex_job('00000000-0000-4000-8000-00000000c001','00000000-0000-4000-8000-00000000d001','{}')$q$,'%permission denied%');
 execute 'set local role postgres';
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a003","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.blocked('outsider cannot read runner connection',$q$select * from public.codex_runner_state$q$);
 execute 'set local role service_role';
 select * into first_job from public.claim_codex_job('00000000-0000-4000-8000-00000000d001');
 select * into second_job from public.claim_codex_job('00000000-0000-4000-8000-00000000d002');
 perform dbtest.ok('claims return different jobs',first_job.id<>second_job.id);
 perform dbtest.ok('wrong claimant cannot finish',not public.finish_codex_job(first_job.id,'00000000-0000-4000-8000-00000000d002','{}'));
 perform dbtest.ok('claimant can finish',public.finish_codex_job(first_job.id,'00000000-0000-4000-8000-00000000d001','{}'));
 perform dbtest.ok('completed jobs cannot finish again',not public.finish_codex_job(first_job.id,'00000000-0000-4000-8000-00000000d001','{}'));
 update public.codex_jobs set updated_at=now()-interval '16 minutes' where id=second_job.id;
 perform public.claim_codex_job('00000000-0000-4000-8000-00000000d001');
 perform dbtest.ok('stale claims fail without requeue',(select status='failed' from public.codex_jobs where id=second_job.id));
 execute 'set local role postgres';
end $$;
