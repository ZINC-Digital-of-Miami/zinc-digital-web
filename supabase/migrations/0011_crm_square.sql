-- Prepared for exact owner approval. Existing inquiries and events remain unchanged.
alter table public.inquiries drop constraint inquiries_stage_check;
alter table public.inquiries add constraint inquiries_stage_check check(stage in ('new','contacted','qualified','proposal','won','lost','closed'));
create table public.crm_quotes (
 id uuid primary key default gen_random_uuid(),
 inquiry_id uuid not null references public.inquiries(id),
 title text not null check(length(title) between 1 and 200),
 scope text not null check(length(scope) between 1 and 4000),
 amount_cents bigint not null check(amount_cents between 1 and 999999999),
 currency text not null default 'USD' check(currency='USD'),
 due_date date not null,
 status text not null default 'draft' check(status in ('draft','sent','accepted','declined')),
 estimate_url text check(estimate_url is null or (length(estimate_url)<=2000 and estimate_url ~ '^https://(app\.)?squareup\.com/|^https://square\.link/')),
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 invoice_request jsonb,
 square_invoice_id text unique,
 square_invoice_status text,
 square_invoice_url text,
 net_collected_cents bigint check(net_collected_cents>=0),
 invoice_checked_at timestamptz,
 invoice_snapshot jsonb,
 invoice_error text,
 invoice_actor uuid references auth.users(id) on delete set null
);
create index crm_quotes_inquiry_idx on public.crm_quotes(inquiry_id,created_at);
alter table public.crm_quotes enable row level security;
revoke all on public.crm_quotes from anon,authenticated;
grant select on public.crm_quotes to authenticated;
grant insert(id,inquiry_id,title,scope,amount_cents,currency,due_date,status,estimate_url),update(title,scope,amount_cents,currency,due_date,status,estimate_url) on public.crm_quotes to authenticated;
grant select,insert,update on public.crm_quotes to service_role;
create policy "staff reads quotes" on public.crm_quotes for select to authenticated using(private.is_staff());
create policy "staff creates quotes" on public.crm_quotes for insert to authenticated with check(private.is_staff() and invoice_request is null and square_invoice_id is null);
create policy "staff edits unfrozen quotes" on public.crm_quotes for update to authenticated using(private.is_staff() and invoice_request is null) with check(private.is_staff() and invoice_request is null);
create trigger crm_quotes_updated before update on public.crm_quotes for each row execute function private.touch_updated_at();
create table public.crm_quote_events (
 id bigint generated always as identity primary key,
 quote_id uuid not null references public.crm_quotes(id),
 actor uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 before_value jsonb,
 after_value jsonb not null
);
alter table public.crm_quote_events enable row level security;
revoke all on public.crm_quote_events from anon,authenticated;
grant select on public.crm_quote_events to authenticated,service_role;
create policy "staff reads quote history" on public.crm_quote_events for select to authenticated using(private.is_staff());
create function private.log_crm_quote() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.crm_quote_events(quote_id,actor,before_value,after_value) values(new.id,coalesce(auth.uid(),new.invoice_actor),case when tg_op='UPDATE' then to_jsonb(old) end,to_jsonb(new));
 return null;
end $$;
revoke all on function private.log_crm_quote() from public;
create trigger crm_quotes_history after insert or update on public.crm_quotes for each row execute function private.log_crm_quote();
-- Provider operations use service credentials after owner/session checks. Freeze the
-- original quote at the database boundary, including concurrent editor writes.
create function private.freeze_crm_quote() returns trigger language plpgsql set search_path='' as $$
begin
 if old.invoice_request is not null and (
  (to_jsonb(new)-array['created_by','updated_at','square_invoice_id','square_invoice_status','square_invoice_url','net_collected_cents','invoice_checked_at','invoice_snapshot','invoice_error','invoice_actor'])
  is distinct from
  (to_jsonb(old)-array['created_by','updated_at','square_invoice_id','square_invoice_status','square_invoice_url','net_collected_cents','invoice_checked_at','invoice_snapshot','invoice_error','invoice_actor'])
 ) then raise exception 'invoice quote is frozen; create a new quote revision'; end if;
 return new;
end $$;
revoke all on function private.freeze_crm_quote() from public;
create trigger crm_quotes_freeze before update on public.crm_quotes for each row execute function private.freeze_crm_quote();
