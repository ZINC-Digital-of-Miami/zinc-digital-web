import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
test('saving with another dirty form advances the request token without replacing its draft',async()=>{
 const handlers:Record<string,Function[]>={};const requests:any[]=[];
 const form:any={dataset:{adminForm:'',endpoint:'/api/admin/quotes/',body:JSON.stringify({id:'q1',updated_at:'v1'}),dirty:'true'},matches:()=>true,querySelector:()=>({hidden:true,focus(){}}),querySelectorAll:()=>[]};
 const other:any={dataset:{body:JSON.stringify({id:'q2',updated_at:'v7'}),dirty:'true'}};
 const archive:any={dataset:{body:JSON.stringify({id:'q1',updated_at:'v1',archived:true})}};
 const toast:any={hidden:true,querySelector:()=>({textContent:'',hidden:false}),contains:()=>false};
 const document:any={activeElement:null,body:{append(){}},querySelector:(s:string)=>s==='[data-dirty],[data-seo-active]'?other:s==='[data-toast]'?toast:null,querySelectorAll:()=>[form,other,archive],addEventListener:(name:string,fn:Function)=>(handlers[name]??=[]).push(fn)};
 const sandbox={document,window:{addEventListener(){}},setInterval(){},setTimeout(){return 1},clearTimeout(){},console,FormData:class{*[Symbol.iterator](){yield ['notes','kept'];}},fetch:async(_url:string,init:any)=>{requests.push(JSON.parse(init.body));return{ok:true,json:async()=>({ok:true,updated_at:'v'+(requests.length+1)})};}};
 const source=stripTypeScriptTypes(readFileSync('src/scripts/admin/shell.ts','utf8').replace(/^export /gm,''));vm.runInNewContext(source,sandbox);
 await handlers.submit[0]({target:form,preventDefault(){}});
 assert.equal(JSON.parse(form.dataset.body).updated_at,'v2');assert.equal(JSON.parse(archive.dataset.body).updated_at,'v2');assert.equal(other.dataset.dirty,'true');assert.equal(JSON.parse(other.dataset.body).updated_at,'v7');
 form.dataset.dirty='true';await handlers.submit[0]({target:form,preventDefault(){}});assert.equal(requests[1].updated_at,'v2');
});
test('a failed action refreshes the view to reconcile an operation that may have completed',async()=>{
 const handlers:Record<string,Function[]>={},requests:string[]=[];let replaced=false;
 const message={textContent:'',hidden:false};const toast:any={hidden:true,querySelector:()=>message,contains:()=>false};
 const region={replaceWith(){replaced=true}};
 const document:any={activeElement:null,body:{append(){}},querySelector:(s:string)=>s==='[data-toast]'?toast:s==='[data-admin-region]'?region:null,querySelectorAll:()=>[],addEventListener:(name:string,fn:Function)=>(handlers[name]??=[]).push(fn),importNode:(x:unknown)=>x,dispatchEvent(){}};
 const target:any={dataset:{endpoint:'/api/admin/publish/',body:'{}'},matches:()=>false,setAttribute(){},removeAttribute(){}};
 const sandbox={document,window:{addEventListener(){}},location:{href:'/admin/backend/'},Event,setInterval(){},setTimeout(){return 1},clearTimeout(){},console,DOMParser:class{parseFromString(){return{querySelector:()=>({})}}},fetch:async(_url:string,init:any)=>{requests.push(init.method||'GET');return init.method==='POST'?{ok:false,json:async()=>({error:'Build response timed out.'})}:{ok:true,text:async()=>'<div data-admin-region>Current status</div>'};}};
 vm.runInNewContext(stripTypeScriptTypes(readFileSync('src/scripts/admin/shell.ts','utf8').replace(/^export /gm,'')),sandbox);
 await handlers.click[0]({target:{closest:()=>target}});
 assert.deepEqual(requests,['POST','GET']);assert.equal(replaced,true);assert.equal(message.textContent,'Build response timed out.');
});
