import {test} from 'node:test';
import assert from 'node:assert/strict';
import {claimPublish} from '../src/lib/publish-lock.ts';
function database(){
 let row:any=null;
 const sb:any={from(){let op='',patch:any,filters:Record<string,unknown>={};const q:any={upsert(v:any){op='insert';patch=v.value;return q},select(){return q},eq(k:string,v:unknown){filters[k]=v;return q},single(){return q},maybeSingle(){return q},update(v:any){op='update';patch=v.value;return q},abortSignal(){return q},then(resolve:Function){resolve((()=>{if(op==='insert'){row??=patch;return{error:null}}if(op==='update'){if(filters['value->>token']!==row.token)return{data:null};row=patch;return{data:{key:'publish_lock'}};}return{data:{value:{...row}}};})());}};return q;}};
 return{sb,read:()=>row,replace:(v:any)=>{row=v}};
}
test('a concurrent request cannot enter the snapshot/read/hook sequence',async()=>{
 const db=database();const release=await claimPublish(db.sb);const token=db.read().token;
 await assert.rejects(()=>claimPublish(db.sb),/Another publish/);
 assert.equal(db.read().token,token);await release();
 const second=await claimPublish(db.sb);assert.notEqual(db.read().token,token);await second();
});
test('an expired operation cannot release a newer lease',async()=>{
 const db=database();const release=await claimPublish(db.sb);db.replace({...db.read(),expiresAt:0});
 const newer=await claimPublish(db.sb);const token=db.read().token;await release();
 assert.equal(db.read().token,token);assert.ok(db.read().expiresAt>Date.now());await newer();
});
test('two simultaneous claims allow exactly one publisher',async()=>{
 const db=database();const claims=await Promise.allSettled([claimPublish(db.sb),claimPublish(db.sb)]);
 assert.equal(claims.filter(x=>x.status==='fulfilled').length,1);
 assert.equal(claims.filter(x=>x.status==='rejected').length,1);
 for(const claim of claims)if(claim.status==='fulfilled')await claim.value();
});
