set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}',true);
select dbtest.allowed('editor records proposal', $$update public.inquiries set stage='proposal' where id='00000000-0000-4000-8000-00000000b001'$$);
select dbtest.allowed('editor creates quote', $$insert into public.crm_quotes(id,inquiry_id,title,scope,amount_cents,due_date) values('00000000-0000-4000-8000-00000000c001','00000000-0000-4000-8000-00000000b001','Website','Build scope',250000,'2026-12-01')$$);
select dbtest.blocked('editor cannot set Square payment evidence', $$update public.crm_quotes set net_collected_cents=250000 where id='00000000-0000-4000-8000-00000000c001'$$);
select dbtest.blocked('editor cannot freeze invoice payload', $$update public.crm_quotes set invoice_request='{}' where id='00000000-0000-4000-8000-00000000c001'$$);
select dbtest.ok('quote history retained',(select count(*)=1 from public.crm_quote_events where quote_id='00000000-0000-4000-8000-00000000c001'));
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a003","role":"authenticated"}',true);
select dbtest.blocked('nonstaff cannot read quotes','select * from public.crm_quotes');
select dbtest.blocked('nonstaff cannot read quote history','select * from public.crm_quote_events');
reset role;
set local role service_role;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
update public.crm_quotes set invoice_request='{"key":"durable"}' where id='00000000-0000-4000-8000-00000000c001';
select dbtest.allowed('provider receipt saved', $$update public.crm_quotes set square_invoice_id='test-invoice',net_collected_cents=200000,invoice_actor='00000000-0000-4000-8000-00000000a001' where id='00000000-0000-4000-8000-00000000c001'$$);
select dbtest.refused('frozen terms cannot change', $$update public.crm_quotes set amount_cents=1 where id='00000000-0000-4000-8000-00000000c001'$$,'%frozen%');
reset role;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}',true);
select dbtest.blocked('editor cannot edit frozen quote', $$update public.crm_quotes set title='Different terms' where id='00000000-0000-4000-8000-00000000c001'$$);
select dbtest.ok('provider action identifies its owner',(select actor='00000000-0000-4000-8000-00000000a001' from public.crm_quote_events where quote_id='00000000-0000-4000-8000-00000000c001' order by id desc limit 1));
select dbtest.ok('all quote revisions retained',(select count(*)=3 from public.crm_quote_events where quote_id='00000000-0000-4000-8000-00000000c001'));
reset role;

-- Offboarding a quote creator must preserve the quote and its financial terms.
reset role;
update public.crm_quotes set created_by='00000000-0000-4000-8000-00000000a004' where id='00000000-0000-4000-8000-00000000c001';
delete from auth.users where id='00000000-0000-4000-8000-00000000a004';
select dbtest.ok('frozen quote survives creator offboarding',(select created_by is null and amount_cents=250000 and invoice_request is not null from public.crm_quotes where id='00000000-0000-4000-8000-00000000c001'));
