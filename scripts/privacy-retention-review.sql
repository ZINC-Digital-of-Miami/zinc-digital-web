-- ZINC website only. Run through an authorized connection to the ZINC project.
-- Read-only review: no personal field values, no deletion and no provider operations.
-- Dates are eligibility targets; the owner reviews identity, last substantive contact,
-- project closure and holds before approving an exact mutation batch.
begin read only;
set local statement_timeout = '15s';
select current_setting('transaction_read_only') as read_only, now() as reviewed_at;

-- Clear only these anti-abuse hashes after approval; keep inquiry content/history.
select id as inquiry_id, created_at, updated_at,
       created_at + interval '7 days' as hash_review_due
from public.inquiries
where client_hash is not null and created_at < now() - interval '7 days'
order by created_at,id;

-- Candidate age is a screening aid, not proof of last substantive contact or a hold.
select i.id as inquiry_id,i.stage,i.created_at,i.updated_at,i.archived_at,
       (select count(*) from public.inquiry_events e where e.inquiry_id=i.id) as related_events,
       (select count(*) from public.crm_quotes q where q.inquiry_id=i.id) as related_quotes,
       'Verify last substantive contact, active engagement and holds' as required_review
from public.inquiries i
where i.created_at < now() - interval '12 months'
order by i.created_at,i.id;

-- A completed research job may still own an unreconciled assistant answer.
-- Only the operator can approve removing the payload; this query never mutates it.
select j.id as job_id,j.kind,j.status,j.updated_at,
       j.updated_at + interval '30 days' as review_due,
       exists(select 1 from research.messages m
         where m.id::text=j.payload->>'assistant_id' and m.status='streaming') as unresolved_answer,
       'Verify durable result, related subject requests and holds' as required_review
from public.codex_jobs j
where j.status in ('completed','failed') and j.updated_at < now()-interval '30 days'
order by j.updated_at,j.id;

-- Closure/spam/accounting/rights-case facts are not inferred from timestamps or names.
select 'Research project closure must be confirmed manually; files, chats and job copies require separate review.' as manual_review,
       (select count(*) from research.projects) as projects,
       (select count(*) from research.documents) as documents,
       (select count(*) from research.messages) as messages,
       (select count(*) from storage.objects where bucket_id='research') as files;
select 'Spam classification, essential fiscal records, privacy-request receipts and legal holds require owner review. Google and Square are excluded.' as remaining_scope;
commit;
