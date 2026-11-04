export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createAdminClient} from '../../../lib/supabase';
import {input,reply,fail} from '../../../lib/admin-http';
import {uuid} from '../../../lib/admin-input';
import {squareConfig} from '../../../lib/square';
import {SquareClient,verifySquare,createInvoiceDraft,invoiceReceipt,type InvoiceRequest} from '../../../lib/square-client';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 let quoteId:string|undefined,quoteVersion:string|undefined;
 try{
  const body=await input(ctx,5000),config=squareConfig(),api=new SquareClient(config).request;
  if(body.action==='verify'){const location=await verifySquare(api,config.locationId);return reply({ok:true,message:`Square ${config.environment}: ${location.name} · ${location.id} · USD verified.`});}
  if(!uuid(body.id)||!['draft','sync','send'].includes(String(body.action)))return fail('Choose a quote and supported Square action.');
  if(body.action!=='sync'&&body.confirm!==true)return fail('Confirm this invoice action first.');
  quoteId=body.id;const db=createAdminClient();
  const loaded=await db.from('crm_quotes').select('*').eq('id',quoteId).single();if(loaded.error)throw new Error('Quote unavailable.');let q=loaded.data;quoteVersion=q.updated_at;
  if(body.action==='draft'){
   await verifySquare(api,config.locationId);
   if(!q.invoice_request){
    if(q.status!=='accepted')return fail('Record the client’s quote acceptance before creating an invoice.');
    if(q.updated_at!==body.updated_at)return reply({error:'The quote changed. Refresh and review the current terms.'},409);
    if(q.due_date<new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()))return fail('Choose a current or future payment due date.');
    const lead=await db.from('inquiries').select('name,email,company').eq('id',q.inquiry_id).single();if(lead.error||!lead.data?.email)throw new Error('Inquiry recipient unavailable.');
    const request:InvoiceRequest={key:q.id,environment:config.environment,locationId:config.locationId,title:q.title,scope:q.scope,amountCents:q.amount_cents,dueDate:q.due_date,email:lead.data.email,name:lead.data.name,company:lead.data.company||''};
    const frozen=await db.from('crm_quotes').update({invoice_request:{...request,actor:staff.id},invoice_actor:staff.id}).eq('id',q.id).eq('updated_at',q.updated_at).is('invoice_request',null).select('*').maybeSingle();
    if(frozen.error||!frozen.data)return reply({error:'Quote changed while preparing the invoice. Refresh before retrying.'},409);q=frozen.data;quoteVersion=q.updated_at;
   }
  }
  const request=q.invoice_request as InvoiceRequest|null;
  if(!request||request.locationId!==config.locationId||request.environment!==config.environment)throw new Error('The invoice belongs to a different Square environment/location, or has not been prepared.');
  let invoice:any;
  if(body.action==='draft'&&!q.square_invoice_id)invoice=await createInvoiceDraft(api,request);
  else{
   if(!q.square_invoice_id)throw new Error('Resume draft creation before checking or sending the invoice.');
   const data=await api('/invoices/'+encodeURIComponent(q.square_invoice_id));invoice=data.invoice;
   if(!invoice||invoice.id!==q.square_invoice_id||invoice.location_id!==config.locationId)throw new Error('Square returned a different invoice.');
  }
  if(body.action==='send'){
   if(invoice.status!=='DRAFT')return reply({error:'The invoice is no longer a draft. Refresh its status; do not send it again.'},409);
   if(invoice.version!==body.version)return reply({error:'Square’s invoice changed. Refresh and review it before sending.'},409);
   // Reconcile native invoice recipient/amount with the explicitly reviewed frozen quote.
   const order=await api('/orders/'+encodeURIComponent(invoice.order_id));
   const recipient=invoice.primary_recipient;
   if(order.order?.location_id!==config.locationId||order.order?.total_money?.amount!==request.amountCents||order.order?.total_money?.currency!=='USD'||recipient?.email_address?.toLowerCase()!==request.email.toLowerCase()||invoice.delivery_method!=='EMAIL'||invoice.title!==request.title||invoice.description!==request.scope||invoice.payment_requests?.length!==1||invoice.payment_requests[0].request_type!=='BALANCE'||invoice.payment_requests[0].due_date!==request.dueDate||invoice.payment_requests[0].automatic_payment_source!=='NONE')throw new Error('Square invoice terms differ from the saved quote. Review them in Square before sending.');
   const sent=await api('/invoices/'+encodeURIComponent(invoice.id)+'/publish',{version:invoice.version,idempotency_key:q.id+'-publish'});invoice=sent.invoice;
  }
  const receipt=await invoiceReceipt(api,invoice,config.locationId);
  const saved=await db.from('crm_quotes').update({...receipt,invoice_error:null,invoice_actor:staff.id}).eq('id',q.id).eq('updated_at',q.updated_at).select('id').maybeSingle();
  if(saved.error||!saved.data)throw new Error('Square responded, but the receipt could not be saved. Refresh before repeating an action.');
  return reply({ok:true,message:body.action==='send'?'Invoice published through Square.':body.action==='draft'?'Square draft saved. No invoice was sent.':'Square invoice status refreshed.'});
 }catch(e){
  const message=e instanceof Error?e.message:'Square action unavailable.';
  if(quoteId&&quoteVersion)await createAdminClient().from('crm_quotes').update({invoice_error:message,net_collected_cents:null,invoice_actor:staff.id}).eq('id',quoteId).eq('updated_at',quoteVersion);
  return reply({error:message},502);
 }
};
