import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const id='00000000-0000-4000-8000-00000000c001';
function route(db:any,api:Function,receipt:Function,staff:any={id:'owner',role:'owner'}){
 const source=stripTypeScriptTypes(readFileSync('src/pages/api/admin/square.ts','utf8').replace(/^import .*\n/gm,'').replace(/^export /gm,''));
 return vm.runInNewContext(source+'\nPOST;',{Response,Date,Intl,Number,Error,encodeURIComponent,requireStaff:()=>staff,input:async()=>({id,action:'sync'}),uuid:()=>true,reply:(data:any,status=200)=>new Response(JSON.stringify(data),{status}),fail:(error:string)=>new Response(JSON.stringify({error}),{status:400}),squareConfig:()=>({environment:'production',locationId:'Miami'}),SquareClient:class{request=api},createAdminClient:()=>db,invoiceReceipt:receipt});
}
test('a losing sync cannot invalidate a newer successful receipt',async()=>{
 let row:any={id,updated_at:'v1',square_invoice_id:'I1',invoice_request:{environment:'production',locationId:'Miami'}};
 const updates:any[]=[];
 const db={from(){let patch:any,filters:Record<string,any>={};const q:any={select(){return q},eq(k:string,v:unknown){filters[k]=v;return q},single:async()=>({data:{...row}}),update(value:any){patch=value;return q},maybeSingle:async()=>{updates.push({patch,filters:{...filters}});if(filters.updated_at!==row.updated_at)return{data:null};row={...row,...patch,updated_at:'v3'};return{data:{id}};},then(resolve:Function){updates.push({patch,filters:{...filters}});if(filters.updated_at===row.updated_at)row={...row,...patch};resolve({error:null});}};return q;}};
 const handler=route(db,async()=>({invoice:{id:'I1',location_id:'Miami'}}),async()=>{row={...row,updated_at:'v2',net_collected_cents:20000,invoice_error:null};return{net_collected_cents:10000};});
 assert.equal((await handler({})).status,502);assert.equal(row.net_collected_cents,20000);assert.equal(row.invoice_error,null);assert.ok(updates.every(x=>x.filters.updated_at==='v1'));
});
test('Square endpoint rejects an editor before any privileged access',async()=>{
 const denied=new Response('owner role required',{status:403});let accessed=false;
 const handler=route({from(){accessed=true}},async()=>{accessed=true},async()=>{},denied);
 assert.equal((await handler({})).status,403);assert.equal(accessed,false);
});
