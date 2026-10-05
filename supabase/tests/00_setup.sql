-- Helpers and fixtures for the permission tests (design section 7.1, R17.4). scripts/db-test.mjs runs this
-- after the migration and before the other files, inside one transaction that always rolls back. It stops on
-- the first error; the test files after it report each failing statement and continue.
--
-- Identities: owner a001, editor a002, a signed-in non-staff user a003, an offboarded user a004 (membership
-- removed, token still live) and a005, a ZINC address with no membership yet. Inquiry b001 exists from the start.

create schema dbtest;
grant usage on schema dbtest to anon, authenticated, service_role;

-- Passes when the statement is refused (no grant, or an RLS check) or reaches no row.
create function dbtest.blocked(label text, statement text) returns void language plpgsql as $$
declare n bigint;
begin
  begin
    execute statement;
    get diagnostics n = row_count;
  exception when insufficient_privilege then return;
  end;
  if n > 0 then raise exception 'FAIL %: % row(s) reached', label, n; end if;
end $$;

-- Passes when the statement succeeds and reaches at least `at_least` rows.
create function dbtest.allowed(label text, statement text, at_least bigint default 1) returns void language plpgsql as $$
declare n bigint;
begin
  begin
    execute statement;
    get diagnostics n = row_count;
  exception when others then raise exception 'FAIL %: %', label, sqlerrm;
  end;
  if n < at_least then raise exception 'FAIL %: % row(s), expected at least %', label, n, at_least; end if;
end $$;

-- Passes when the statement fails with an error whose message matches `pattern` (ILIKE).
create function dbtest.refused(label text, statement text, pattern text) returns void language plpgsql as $$
begin
  begin
    execute statement;
  exception when others then
    if sqlerrm ilike pattern then return; end if;
    raise exception 'FAIL %: refused for another reason: %', label, sqlerrm;
  end;
  raise exception 'FAIL %: allowed', label;
end $$;

create function dbtest.ok(label text, condition boolean) returns void language plpgsql as $$
begin
  if condition is not true then raise exception 'FAIL %', label; end if;
end $$;

grant execute on all functions in schema dbtest to anon, authenticated, service_role;

insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
  ('00000000-0000-4000-8000-00000000a001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dbtest-owner@zincdigital.co', '{}', '{}', now(), now()),
  ('00000000-0000-4000-8000-00000000a002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dbtest-editor@zincdigital.co', '{}', '{}', now(), now()),
  ('00000000-0000-4000-8000-00000000a003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dbtest-visitor@example.com', '{}', '{}', now(), now()),
  ('00000000-0000-4000-8000-00000000a004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dbtest-former@zincmiami.com', '{}', '{}', now(), now()),
  ('00000000-0000-4000-8000-00000000a005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dbtest-new@zincdigital.co', '{}', '{}', now(), now());

insert into public.staff (user_id, email, name, role) values
  ('00000000-0000-4000-8000-00000000a001', 'dbtest-owner@zincdigital.co', 'Test Owner', 'owner'),
  ('00000000-0000-4000-8000-00000000a002', 'dbtest-editor@zincdigital.co', 'Test Editor', 'editor'),
  ('00000000-0000-4000-8000-00000000a004', 'dbtest-former@zincmiami.com', 'Former Staff', 'editor');
-- Offboarding removes the membership; the user's unexpired token still carries their id.
delete from public.staff where user_id = '00000000-0000-4000-8000-00000000a004';

insert into public.inquiries (id, name, email, company, website, budget, services, message, source_path, stage) values
  ('00000000-0000-4000-8000-00000000b001', 'Ana Ruiz', 'ana@ruizsupply.com', 'Ruiz Supply', 'https://ruizsupply.com', '$5–10k/mo', array['shopify'], 'We need a faster storefront.', '/contact/', 'new');
