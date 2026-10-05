-- 0002_site_fixes (design section 7.2; requirements 1.2, R6.2, R9.2, R9.3).
-- Rehearse with `node scripts/db-test.mjs supabase/migrations/0002_site_fixes.sql` (rolled back). Applied only
-- after the PR is approved and the owner gives the go, with the same psql command without the rollback.

-- inquiries: the live contact path's columns; stage is the only stage field; anonymous inserts end.
drop policy "anyone submit inquiry" on public.inquiries;
alter table public.inquiries
  add column timeline text,
  add column notify_status text not null default 'pending' check (notify_status in ('pending', 'sent', 'failed')),
  add column notify_error text,
  add column notify_attempts int not null default 0,
  add column notified_at timestamptz,
  add column client_hash text,
  drop column status;
create index inquiries_client_hash_created_at_idx on public.inquiries (client_hash, created_at);

alter table public.inquiry_events drop constraint inquiry_events_kind_check;
alter table public.inquiry_events add constraint inquiry_events_kind_check
  check (kind in ('created', 'stage', 'note', 'next_step', 'email', 'archived', 'restored', 'notify'));

-- Every change staff or the server make to an inquiry is logged. Security definer so the server's updates
-- (secret key, which has no grant on inquiry_events) are logged too; actor is null for those.
create function private.log_inquiry_change() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  who uuid := auth.uid();
begin
  if new.stage is distinct from old.stage then
    insert into public.inquiry_events (inquiry_id, kind, payload, actor) values (new.id, 'stage', jsonb_build_object('from', old.stage, 'to', new.stage), who);
  end if;
  if new.notes is distinct from old.notes then
    insert into public.inquiry_events (inquiry_id, kind, payload, actor) values (new.id, 'note', jsonb_build_object('notes', new.notes), who);
  end if;
  if new.next_step is distinct from old.next_step then
    insert into public.inquiry_events (inquiry_id, kind, payload, actor) values (new.id, 'next_step', jsonb_build_object('next_step', new.next_step), who);
  end if;
  if new.archived_at is distinct from old.archived_at then
    insert into public.inquiry_events (inquiry_id, kind, payload, actor) values (new.id, case when new.archived_at is null then 'restored' else 'archived' end, '{}'::jsonb, who);
  end if;
  if new.notify_status is distinct from old.notify_status then
    insert into public.inquiry_events (inquiry_id, kind, payload, actor) values (new.id, 'notify', jsonb_build_object('status', new.notify_status, 'error', new.notify_error, 'attempts', new.notify_attempts), who);
  end if;
  return null;
end $$;
revoke all on function private.log_inquiry_change() from public;
create trigger inquiries_log after update on public.inquiries for each row execute function private.log_inquiry_change();

-- The board respects RLS and lists archived inquiries too; the admin separates them by archived_at.
drop view public.inquiry_board;
create view public.inquiry_board with (security_invoker = true) as
  select id, company, name, email, website, budget, services, timeline, message, source_path, stage, notes, next_step,
         notify_status, archived_at, created_at, updated_at
  from public.inquiries
  order by created_at desc;

-- The app's staff check (RPC from the session client) and the owner check for policies.
create function public.staff_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.staff where user_id = auth.uid()
$$;
revoke all on function public.staff_role() from public, anon, service_role;
grant execute on function public.staff_role() to authenticated;

create function private.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'owner')
$$;
revoke all on function private.is_owner() from public;
grant execute on function private.is_owner() to authenticated;

-- The last owner cannot be demoted or removed, including through deleting their auth user (R10.9).
create function private.keep_one_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from old_rows where role = 'owner') and not exists (select 1 from public.staff where role = 'owner') then
    raise exception 'the last owner cannot be removed or demoted';
  end if;
  return null;
end $$;
revoke all on function private.keep_one_owner() from public;
create trigger staff_keep_one_owner_update after update on public.staff referencing old table as old_rows
  for each statement execute function private.keep_one_owner();
create trigger staff_keep_one_owner_delete after delete on public.staff referencing old table as old_rows
  for each statement execute function private.keep_one_owner();

-- Security advisor: mutable search_path.
alter function private.touch_updated_at() set search_path = '';

-- Least-privilege grants. RLS stays enabled on every table; pages and posts get their grants in 0003.
revoke all on all tables in schema public from anon, authenticated, service_role;
grant select, update on public.inquiries to authenticated;
grant select, insert on public.inquiry_events to authenticated;
grant select on public.staff, public.inquiry_board to authenticated;
grant select, insert, update on public.inquiries to service_role;
grant select, insert, update, delete on public.staff to service_role;
