-- The last owner cannot be demoted or removed (R10.9), whichever path tries it.
reset role;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;
select dbtest.refused('the last owner cannot be demoted', $q$update public.staff set role = 'editor' where role = 'owner'$q$, '%last owner%');
select dbtest.refused('the last owner cannot be removed', $q$delete from public.staff where role = 'owner'$q$, '%last owner%');
select dbtest.allowed('a second owner can be added', $q$insert into public.staff (user_id, email, name, role) values ('00000000-0000-4000-8000-00000000a005', 'dbtest-new@zincdigital.co', 'Second Owner', 'owner')$q$);
select dbtest.allowed('with two owners, one can be demoted', $q$update public.staff set role = 'editor' where user_id = '00000000-0000-4000-8000-00000000a005'$q$);
select dbtest.allowed('an editor can be removed', $q$delete from public.staff where user_id = '00000000-0000-4000-8000-00000000a005'$q$);
reset role;
