import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publishResult} from '../src/lib/vercel.ts';
test('publish status includes the build created before the hook response arrives',async()=>{
 const at='2026-10-05T14:00:00.000Z';
 const result=await publishResult({at,status:'building',job:'hook-job'},async()=>[
  {id:'old',url:'old.vercel.app',state:'READY',created:Date.parse(at)-1000,target:'production'},
  {id:'published',url:'published.vercel.app',state:'READY',created:Date.parse(at)+500,target:'production'},
  {id:'later',url:'later.vercel.app',state:'BUILDING',created:Date.parse(at)+2000,target:'production'},
 ]);
 assert.equal(result?.status,'ready');assert.equal(result?.deployment,'published.vercel.app');assert.equal(result?.at,at);
});
