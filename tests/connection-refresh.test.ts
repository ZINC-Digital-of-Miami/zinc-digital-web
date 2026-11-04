import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {stripTypeScriptTypes} from 'node:module';import vm from 'node:vm';
const element=()=>({textContent:'',hidden:false,disabled:false,children:[] as any[],replaceChildren(){this.children=[];},append(...items:any[]){this.children.push(...items);}});
const card=()=>{const nodes:Record<string,ReturnType<typeof element>>={};return{nodes,querySelector:(s:string)=>nodes[s]??=(element())};};
test('a refresh during a connection check writes to the current card and later refreshes retain the result',async()=>{
 let current=card(),finish!:(v:unknown)=>void;const listeners:Record<string,Function>={};
 const document={querySelector:()=>current,createElement:element,addEventListener:(n:string,f:Function)=>listeners[n]=f};
 const response=new Promise(resolve=>finish=resolve);
 const source=stripTypeScriptTypes(readFileSync('src/scripts/admin/connections.ts','utf8').replace(/^import type .*;$/m,''));
 vm.runInNewContext(source,{document,fetch:()=>response,AbortSignal,Intl,Date});
 const running=listeners.click({target:{closest:()=>({})}});
 current=card();listeners['admin:refresh']();assert.equal(current.nodes['[data-check-connections]'].disabled,true);
 finish({ok:true,json:async()=>({checkedAt:'2026-11-04T20:00:00Z',checks:[{name:'Database',status:'verified',detail:'Staff read verified.'}]})});await running;
 assert.equal(current.nodes['[data-check-connections]'].disabled,false);assert.match(current.nodes['[data-connections-time]'].textContent,/Checked/);
 current=card();listeners['admin:refresh']();assert.equal(current.nodes['[data-connections-results]'].children[0].children[0].textContent,'Database · verified');
});
