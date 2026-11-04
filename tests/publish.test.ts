import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publishResult} from '../src/lib/vercel.ts';
const value={at:'2026-11-04T18:00:00Z',status:'building',job:'hook-job',revision:'a'.repeat(64)};
test('an unrelated ready deployment cannot establish publication',async()=>{
 const result=await publishResult(value,async()=>[{id:'unrelated',url:'other.vercel.app',state:'READY',created:Date.parse(value.at)+500,target:'production'}] as any);
 assert.notEqual(result?.status,'ready');
});
test('only the public site receipt for the exact snapshot establishes publication',async()=>{
 const result=await publishResult(value,async()=>({revision:value.revision}) as any);
 assert.equal(result?.status,'ready');
});
test('different or missing public content remains unverified and failures stay explicit',async()=>{
 for(const receipt of [{revision:'b'.repeat(64)},null,{}])assert.notEqual((await publishResult(value,async()=>receipt as any))?.status,'ready');
 assert.match(String((await publishResult(value,async()=>{throw new Error('offline')}))?.status),/unavailable/i);
 assert.notEqual((await publishResult({...value,revision:undefined},async()=>({revision:value.revision}) as any))?.status,'ready');
});
