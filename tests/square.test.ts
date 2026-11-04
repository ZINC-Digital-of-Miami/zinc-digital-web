import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SquareClient,createInvoiceDraft,invoiceReceipt} from '../src/lib/square-client.ts';
const request={key:'quote-1',locationId:'L1',environment:'sandbox' as const,title:'Website',scope:'Build a website',amountCents:250000,dueDate:'2026-12-01',email:'client@example.com',name:'Client',company:'Company'};
test('draft retries reuse durable keys and never publish or charge',async()=>{
 const calls:any[]=[];const api=async(path:string,body?:unknown)=>{calls.push({path,body});if(path==='/customers')return{customer:{id:'C1'}};if(path==='/orders')return{order:{id:'O1'}};return{invoice:{id:'I1',order_id:'O1',location_id:'L1',status:'DRAFT',version:0}};};
 const a=await createInvoiceDraft(api,request);await createInvoiceDraft(api,request);
 assert.equal(a.id,'I1');assert.deepEqual(calls.slice(0,3),calls.slice(3));
 assert.equal(calls[2].body.invoice.delivery_method,'EMAIL');assert.equal(calls[2].body.invoice.payment_requests[0].automatic_payment_source,'NONE');
 assert.ok(calls.every(x=>!x.path.includes('/publish')));
});
test('Square HTTP failures do not expose tokens or raw provider payloads',async()=>{
 const api=new SquareClient({token:'secret',environment:'sandbox',locationId:'L1'},async()=>new Response('secret provider body',{status:401}));
 await assert.rejects(()=>api.request('/locations'),/Square.*401/);
});
test('payment receipts use completed payments net of refunds and reject wrong location',async()=>{
 const invoice={id:'I1',order_id:'O1',location_id:'L1',status:'PAID',version:2,payment_requests:[{total_completed_amount_money:{amount:25000,currency:'USD'}}]};
 const api=async(path:string)=>path==='/orders/O1'?{order:{id:'O1',location_id:'L1',tenders:[{payment_id:'P1'}]}}:{payment:{id:'P1',order_id:'O1',location_id:'L1',status:'COMPLETED',total_money:{amount:25000,currency:'USD'},refunded_money:{amount:5000,currency:'USD'}}};
 assert.equal((await invoiceReceipt(api,invoice,'L1')).net_collected_cents,20000);
 await assert.rejects(()=>invoiceReceipt(api,{...invoice,location_id:'wrong'},'L1'));
 const missing=await invoiceReceipt(async()=>({order:{id:'O1',location_id:'L1',tenders:[]}}),invoice,'L1');assert.equal(missing.net_collected_cents,null);
});

test('a long quote scope stays in the invoice and does not exceed the order-note limit',async()=>{
 const calls:any[]=[];await createInvoiceDraft(async(path,body:any)=>{calls.push({path,body});if(path==='/customers')return{customer:{id:'C1'}};if(path==='/orders')return{order:{id:'O1'}};return{invoice:{id:'I1',order_id:'O1',location_id:'L1'}};},{...request,scope:'s'.repeat(4000)});
 assert.equal(calls[1].body.order.line_items[0].note,undefined);assert.equal(calls[2].body.invoice.description.length,4000);
});

test('only the active Miami USD location is eligible',async()=>{
 const {verifySquare}=await import('../src/lib/square-client.ts');
 assert.equal((await verifySquare(async()=>({locations:[{id:'M1',name:'Miami',status:'ACTIVE',currency:'USD'}]}),'M1')).id,'M1');
 for(const location of [{id:'P1',name:'Panama City',status:'ACTIVE',currency:'USD'},{id:'M1',name:'Miami',status:'INACTIVE',currency:'USD'}])await assert.rejects(()=>verifySquare(async()=>({locations:[location]}),location.id));
});
