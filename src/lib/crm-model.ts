export const CRM_STAGES = [['new','New','Review inquiry'],['contacted','Contacted','Follow up'],['qualified','Qualified','Prepare proposal'],['proposal','Proposal','Confirm decision'],['won','Won','Deliver the work'],['lost','Lost','Record the reason'],['closed','Closed · outcome unspecified','Review outcome']] as const;
export type Quote = {id:string;inquiry_id:string;title:string;scope:string;amount_cents:number;currency:'USD';due_date:string;status:string;estimate_url:string|null;created_at:string;updated_at:string;invoice_request:unknown;square_invoice_id:string|null;square_invoice_status:string|null;square_invoice_url:string|null;net_collected_cents:number|null;invoice_checked_at:string|null;invoice_error:string|null;invoice_snapshot?:{version:number}};
const bounded=(value:unknown,max:number,required=false)=>{if(typeof value!=='string'||value.trim().length>max||(required&&!value.trim()))throw new Error('Complete the quote fields within their length limits.');return value.trim();};
export function dollarsToCents(value:unknown){
 if(typeof value!=='string'||!/^\d+(?:\.\d{1,2})?$/.test(value.trim()))throw new Error('Enter a positive USD amount with at most two decimal places.');
 const [d,c='']=value.trim().split('.');const cents=Number(d)*100+Number(c.padEnd(2,'0'));
 if(!Number.isSafeInteger(cents)||cents<1||cents>999999999)throw new Error('Enter an amount between $0.01 and $9,999,999.99.');return cents;
}
export function squareEstimateUrl(value:unknown){
 if(value===''||value==null)return null;
 const s=bounded(value,2000);let url:URL;try{url=new URL(s);}catch{throw new Error('Use the HTTPS link to the estimate in Square.');}
 if(url.protocol!=='https:'||!['squareup.com','app.squareup.com','square.link'].includes(url.hostname)||url.username||url.password||url.port)throw new Error('Use the HTTPS link to the estimate in Square.');return url.href;
}
export function quoteInput(input:Record<string,unknown>){
 const title=bounded(input.title,200,true),scope=bounded(input.scope,4000,true),due_date=bounded(input.due_date,10,true);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(due_date)||!Number.isFinite(Date.parse(due_date))||new Date(due_date).toISOString().slice(0,10)!==due_date)throw new Error('Choose a valid due date.');
 const status=bounded(input.status,20,true);if(!['draft','sent','accepted','declined'].includes(status))throw new Error('Choose a valid quote status.');
 return{title,scope,amount_cents:dollarsToCents(input.amount),currency:'USD' as const,due_date,status,estimate_url:squareEstimateUrl(input.estimate_url)};
}
export const money=(cents:number|null)=>cents===null?'Unavailable':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function crmTotals(inquiries:{stage:string}[],quotes:{square_invoice_id:string|null;net_collected_cents:number|null}[]){
 const count=(stage:string)=>inquiries.filter(r=>r.stage===stage).length;
 const unique=new Map(quotes.filter(q=>q.square_invoice_id).map(q=>[q.square_invoice_id,q]));
 const measured=[...unique.values()].filter(q=>q.net_collected_cents!==null);
 return{qualified:count('qualified'),proposal:count('proposal'),won:count('won'),lost:count('lost'),closed:count('closed'),netCollectedCents:measured.reduce((n,q)=>n+q.net_collected_cents!,0),unavailableInvoices:unique.size-measured.length,measuredInvoices:measured.length};
}
