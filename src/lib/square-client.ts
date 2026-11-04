// Native Square transport. Credentials never enter responses or browser code.
export type SquareConfig={token:string;environment:'sandbox'|'production';locationId:string};
export type SquareRequest=(path:string,body?:unknown)=>Promise<any>;
export type InvoiceRequest={key:string;environment:'sandbox'|'production';locationId:string;title:string;scope:string;amountCents:number;dueDate:string;email:string;name:string;company:string};
export class SquareClient {
 private config:SquareConfig; private transport:typeof fetch;
 constructor(config:SquareConfig,transport:typeof fetch=fetch){this.config=config;this.transport=transport;}
 request:SquareRequest=async(path,body)=>{
  if(!this.config.token||!this.config.locationId)throw new Error('Square is not connected. Configure the server token and ZINC location in Backend.');
  if(!path.startsWith('/')||path.includes('..')||path.includes('://'))throw new Error('Invalid Square request.');
  const origin=this.config.environment==='sandbox'?'https://connect.squareupsandbox.com':'https://connect.squareup.com';
  const r=await this.transport(origin+'/v2'+path,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+this.config.token,'Square-Version':'2026-09-16','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw new Error(`Square request failed (${r.status}). Check access and the saved operation before retrying.`);
  return r.json();
 };
}
export async function verifySquare(api:SquareRequest,locationId:string){
 const data=await api('/locations');const location=data.locations?.find((x:any)=>x.id===locationId);
 if(!location||location.status!=='ACTIVE'||location.currency!=='USD'||location.name?.toLowerCase()!=='miami')throw new Error('Select the active USD Miami location before using invoices.');
 return location;
}
export async function createInvoiceDraft(api:SquareRequest,r:InvoiceRequest){
 // The same immutable request/key is reused after any timeout or partial failure.
 const customer=await api('/customers',{idempotency_key:r.key+'-customer',given_name:r.name,company_name:r.company||undefined,email_address:r.email,reference_id:r.key});
 if(!customer.customer?.id)throw new Error('Square did not return a customer receipt.');
 const order=await api('/orders',{idempotency_key:r.key+'-order',order:{location_id:r.locationId,customer_id:customer.customer.id,reference_id:r.key,line_items:[{name:r.title,quantity:'1',base_price_money:{amount:r.amountCents,currency:'USD'}}]}});
 if(!order.order?.id)throw new Error('Square did not return an order receipt.');
 const data=await api('/invoices',{idempotency_key:r.key+'-invoice',invoice:{location_id:r.locationId,order_id:order.order.id,primary_recipient:{customer_id:customer.customer.id},title:r.title,description:r.scope,delivery_method:'EMAIL',payment_requests:[{request_type:'BALANCE',due_date:r.dueDate,automatic_payment_source:'NONE'}],accepted_payment_methods:{card:true},store_payment_method_enabled:false}});
 if(!data.invoice?.id||data.invoice.location_id!==r.locationId||data.invoice.order_id!==order.order.id)throw new Error('Square did not return the expected invoice receipt.');
 return data.invoice;
}
function usd(value:any):number|null{return value?.currency==='USD'&&Number.isSafeInteger(value.amount)&&value.amount>=0?value.amount:null;}
export async function invoiceReceipt(api:SquareRequest,invoice:any,locationId:string){
 if(!invoice?.id||invoice.location_id!==locationId||!invoice.order_id||typeof invoice.status!=='string')throw new Error('The Square invoice does not match the configured location.');
 let net:number|null=null;
 try{
  const data=await api('/orders/'+encodeURIComponent(invoice.order_id));const order=data.order;
  if(order?.id!==invoice.order_id||order.location_id!==locationId)throw new Error('Order mismatch.');
  const tenders=order.tenders||[],ids=[...new Set<string>(tenders.map((t:any)=>t.payment_id).filter(Boolean))];
  const reported=invoice.payment_requests?.map((p:any)=>usd(p.total_completed_amount_money));
  if(reported?.length&&reported.every((n:number|null)=>n===0)&&!tenders.length)net=0;
  else if(ids.length&&tenders.every((t:any)=>t.payment_id)){
   let gross=0,refunded=0;
   for(const id of ids){const {payment}=await api('/payments/'+encodeURIComponent(id));if(payment?.id!==id||payment.order_id!==order.id||payment.location_id!==locationId)throw new Error('Payment mismatch.');
    if(payment.status!=='COMPLETED')throw new Error('Payment is not completed.');
    const total=usd(payment.total_money),refund=payment.refunded_money?usd(payment.refunded_money):0;
    if(total===null||refund===null||refund>total)throw new Error('Payment amount unavailable.');gross+=total;refunded+=refund;
   }
   const paid=reported?.every((n:number|null)=>n!==null)?reported.reduce((a:number,b:number)=>a+b,0):null;
   if(paid!==gross)throw new Error('Invoice payments do not reconcile.');net=gross-refunded;
  }
 }catch{net=null;}
 let url:string|null=null;try{const u=new URL(invoice.public_url);if(u.protocol==='https:'&&u.hostname==='squareup.com'&&!u.username&&!u.password)url=u.href;}catch{}
 return{square_invoice_id:invoice.id,square_invoice_status:invoice.status,square_invoice_url:url,net_collected_cents:net,invoice_checked_at:new Date().toISOString(),invoice_snapshot:invoice};
}
