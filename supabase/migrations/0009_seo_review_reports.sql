-- Claude reports and idempotent run claims are server-written evidence, readable by staff.
-- Preserve all existing rows, Google owner controls and publishing-key protections.
-- Applying this production policy change requires the owner's exact authorization.
alter policy "staff inserts metrics" on public.admin_cache with check (
 private.is_staff() and key not in ('last_publish','publish_lock')
 and key not like 'seo_review:%'
 and (key <> 'google_connection' or private.is_owner())
);
alter policy "staff updates metrics" on public.admin_cache using (
 private.is_staff() and key not in ('last_publish','publish_lock')
 and key not like 'seo_review:%'
 and (key <> 'google_connection' or private.is_owner())
) with check (
 private.is_staff() and key not in ('last_publish','publish_lock')
 and key not like 'seo_review:%'
 and (key <> 'google_connection' or private.is_owner())
);
