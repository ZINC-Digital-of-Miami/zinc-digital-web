-- 0002a_staff_role_invoker (R9.4). After 0002 the security advisor warned (lint 0029) that signed-in users can
-- call the SECURITY DEFINER function public.staff_role() through /rest/v1/rpc. As SECURITY INVOKER it returns the
-- same answer: staff read their own row through the "staff read staff" policy (private.is_staff(), which is
-- not in an exposed schema), and anyone else reads no row and gets null.
-- Rehearse with `node scripts/db-test.mjs supabase/migrations/0002a_staff_role_invoker.sql`; applied with the owner's go.

alter function public.staff_role() security invoker;
