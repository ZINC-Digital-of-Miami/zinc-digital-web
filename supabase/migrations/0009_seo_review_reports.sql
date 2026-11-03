-- Claude reports and idempotent run claims are server-written evidence, readable by staff.
-- Restrictive policies intersect existing permissions without replacing them.
-- Preserve every row and all existing publishing/Google/ordinary-cache rules.
-- Applying this production policy change requires the owner's exact authorization.
create policy "staff cannot insert seo reports" on public.admin_cache
 as restrictive for insert to authenticated with check (key not like 'seo_review:%');
create policy "staff cannot update seo reports" on public.admin_cache
 as restrictive for update to authenticated
 using (key not like 'seo_review:%') with check (key not like 'seo_review:%');
