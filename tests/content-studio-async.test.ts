import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import {emptyDraft,reviewProgress} from '../src/lib/content-studio/model.ts';
import {saveDisposition,canApplyProposal} from '../src/lib/content-studio/client-state.ts';
function fixture(){
 const nodes=new Map<string,any>(),listeners:Record<string,Function>={},requests:{url:string;resolve:Function}[]=[];
 const node=(selector:string)=>{if(!nodes.has(selector))nodes.set(selector,{value:'',textContent:'',dataset:{},hidden:false,setAttribute(){},replaceChildren(){this.textContent='';},append(){},querySelector(){return null;}});return nodes.get(selector);};
 const fields=Object.entries(emptyDraft()).filter(([,v])=>typeof v==='string').map(([key])=>{const e=node('[data-field="'+key+'"]');e.dataset.field=key;return e;});
 const root={querySelector:node,querySelectorAll:(s:string)=>s==='[data-field]'?fields:[],addEventListener:(name:string,fn:Function)=>listeners[name]=fn};
 const state={starter:emptyDraft(),inventory:[]};
 const source=stripTypeScriptTypes(readFileSync(new URL('../src/scripts/admin/content-studio.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,''));
 vm.runInNewContext(source,{document:{createElement:()=>({value:'',textContent:'',click(){}}),querySelector:(s:string)=>s==='[data-studio]'?root:{textContent:JSON.stringify(state)}},window:{addEventListener(){}},location:{href:'https://example.test/admin/content-studio/'},sessionStorage:{getItem(){return null;},setItem(){}},URL,URLSearchParams,structuredClone,reviewProgress,saveDisposition,canApplyProposal,confirm:()=>true,fetch:(url:string)=>new Promise(resolve=>requests.push({url,resolve:(data:unknown)=>resolve({ok:true,json:async()=>data})}))});
 const select=node('[data-document]');
 const open=(slug:string)=>{select.value=slug;return select.onchange.call(select);};
 const respond=(index:number,slug:string)=>{const d=emptyDraft(slug);d.title=slug;d.revision=1;requests[index].resolve({draft:d});};
 return {node,open,respond,listeners,requests};
}
test('actual editor rejects out-of-order document responses and clears old review material',async()=>{
 const f=fixture();f.node('[data-comments]').textContent='Old article comments';f.node('[data-review-comment]').value='Old unsent comment';
 const a=f.open('article-a'),b=f.open('article-b');f.respond(1,'article-b');await b;f.respond(0,'article-a');await a;
 assert.equal(f.node('[data-field="title"]').value,'article-b');assert.equal(f.node('[data-comments]').textContent,'');assert.equal(f.node('[data-review-comment]').value,'');
});
test('actual editor preserves typing performed during a pending document load',async()=>{
 const f=fixture(),opening=f.open('article-a');f.node('[data-field="title"]').value='Keep my new typing';
 f.listeners.input({target:{matches:(s:string)=>s==='[data-field],[data-check],[data-evidence]'||s==='[data-field]'}});
 f.respond(0,'article-a');await opening;assert.equal(f.node('[data-field="title"]').value,'Keep my new typing');
});
test('SEO history excludes both direct and deferred Studio namespaces',()=>{
 const source=readFileSync(new URL('../src/components/admin/SeoReview.astro',import.meta.url),'utf8');
 assert.ok(source.includes("review:studio:%"));assert.ok(source.includes("review:deferred:studio:%"));
});

test('actual save handler never replaces another document after a delayed save',async()=>{
 const f=fixture();const a=f.open('article-a');f.respond(0,'article-a');await a;
 f.node('[data-save]').onclick.call(f.node('[data-save]'));
 const b=f.open('article-b');f.respond(2,'article-b');await b;
 const saved=emptyDraft('article-a');saved.title='Saved A';saved.revision=2;f.requests[1].resolve({draft:saved});
 await new Promise(resolve=>setImmediate(resolve));assert.equal(f.node('[data-field="title"]').value,'article-b');
});
test('late comments response cannot render under a different document',async()=>{
 const f=fixture();const a=f.open('article-a');f.respond(0,'article-a');await a;
 f.node('[data-read-comments]').onclick.call(f.node('[data-read-comments]'));
 const b=f.open('article-b');f.respond(2,'article-b');await b;
 f.requests[1].resolve({comments:[{author:'A',text:'Private comment for A',revision:1,at:'2026-11-09T15:00:00Z'}]});
 await new Promise(resolve=>setImmediate(resolve));assert.equal(f.node('[data-comments]').textContent,'');
});
