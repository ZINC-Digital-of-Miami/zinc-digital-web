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
 const db=(data:any,error:any=null)=>({from(){return{select(){return{abortSignal:async()=>({data,error})}}}}}) as any;
 await assert.rejects(()=>readContentSnapshots(db([],new Error('offline'))),/could not be read/);
 await assert.rejects(()=>readContentSnapshots(db([{live:{title:'New'},live_at:'2026-11-04T19:00:00Z'}]),'2026-11-04T18:00:00Z'),/Another publication/);
 const result=await readContentSnapshots(db([{live:{title:'OK'},live_at:'2026-11-04T18:00:00.000Z'}]),'2026-11-04T18:00:00Z');
 assert.match(result.revision,/^[a-f0-9]{64}$/);
});
