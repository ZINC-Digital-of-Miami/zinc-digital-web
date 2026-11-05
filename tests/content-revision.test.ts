import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contentRevision,readContentSnapshots} from '../src/lib/content-revision.ts';
test('content receipts are stable across row and object order but change with published content',()=>{
 const a={live:{path:'/',title:'Home'},live_at:'2026-11-04T18:00:00Z'},b={live:{path:'/about/',title:'About'},live_at:a.live_at};
 assert.equal(contentRevision([a,b],[]),contentRevision([{live_at:b.live_at,live:{title:'About',path:'/about/'}},a],[]));
 assert.notEqual(contentRevision([a],[]),contentRevision([{...a,live:{...a.live,title:'Changed'}}],[]));
 assert.equal(contentRevision([a,{live:null}],[]),contentRevision([a],[]));
 assert.notEqual(contentRevision([a],[]),contentRevision([],[a]));
});
test('snapshot reads fail closed on provider errors or a superseding publication',async()=>{
 const db=(rows:any,error:any=null)=>({rpc(name:string){assert.equal(name,'read_published_content');return{abortSignal:async()=>({data:{pages:rows,posts:[]},error})};}}) as any;
 await assert.rejects(()=>readContentSnapshots(db([],new Error('offline'))),/could not be read/);
 await assert.rejects(()=>readContentSnapshots(db([{live:{title:'New'},live_at:'2026-11-04T19:00:00Z'}]),'2026-11-04T18:00:00Z'),/Another publication/);
 const result=await readContentSnapshots(db([{live:{title:'OK'},live_at:'2026-11-04T18:00:00.000Z'}]),'2026-11-04T18:00:00Z');
 assert.match(result.revision,/^[a-f0-9]{64}$/);
});
test('build reads reject mixed or invalid publication versions without an explicit cutoff',async()=>{
 const db=(pages:any[],posts:any[])=>({rpc(){return{abortSignal:async()=>({data:{pages,posts},error:null})};}}) as any;
 const page={live:{title:'Page'},live_at:'2026-11-05T18:00:00Z'};
 await assert.rejects(()=>readContentSnapshots(db([page],[{live:{title:'Post'},live_at:'2026-11-05T19:00:00Z'}])),/publication/);
 await assert.rejects(()=>readContentSnapshots(db([{live:{title:'Page'},live_at:null}],[])),/publication/);
 const result=await readContentSnapshots(db([page,{live:null,live_at:null}],[{...page,live_at:'2026-11-05T18:00:00.000Z'}]));
 assert.equal(result.pages.length,2);
 assert.equal(result.posts.length,1);
});
test('snapshot reads never fall back to separate table reads or swallow a malformed RPC response',async()=>{
 for(const data of [null,{}, {pages:[],posts:null}]){
  await assert.rejects(()=>readContentSnapshots({rpc(){return{abortSignal:async()=>({data,error:null})};},from(){throw new Error('Separate reads must not run');}} as any),/could not be read/);
 }
});
