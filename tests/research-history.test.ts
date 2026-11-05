import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questionHistory} from '../src/lib/research/chat.ts';

test('a delayed question cannot consume later concurrent questions or answers',async()=>{
 const rows=[
  {id:1,chat_id:'chat',role:'user',content:'Earlier question',status:'done'},
  {id:2,chat_id:'chat',role:'assistant',content:'Earlier answer',status:'done'},
  {id:3,chat_id:'chat',role:'user',content:'First concurrent question',status:'done'},
  {id:4,chat_id:'chat',role:'assistant',content:'',status:'streaming'},
 ];
 const db={from(){
  let result=rows.slice();
  const q={select(){return q;},eq(key:string,value:unknown){result=result.filter(r=>r[key as keyof typeof r]===value);return q;},lte(key:string,value:number){result=result.filter(r=>Number(r[key as keyof typeof r])<=value);return q;},order(){result.sort((a,b)=>b.id-a.id);return q;},async limit(n:number){return {data:result.slice(0,n).map(({role,content})=>({role,content})),error:null};}};
  return q;
 }} as any;
 let resume!:()=>void;
 const waiting=new Promise<void>(resolve=>{resume=resolve;});
 const first=(async()=>{await waiting;return questionHistory(db,'chat',3);})();
 rows.push({id:5,chat_id:'chat',role:'user',content:'Second concurrent question',status:'done'},
  {id:6,chat_id:'chat',role:'assistant',content:'Second answer',status:'done'},
  {id:7,chat_id:'other',role:'user',content:'Private other chat',status:'done'});
 resume();
 assert.deepEqual((await first).map(m=>m.content),['Earlier question','Earlier answer','First concurrent question']);
 assert.equal((await questionHistory(db,'chat',5)).at(-1)?.content,'Second concurrent question');
});

test('history fails closed when its request anchor or database response is unavailable',async()=>{
 const noRead={from(){throw new Error('must not read');}} as any;
 for(const id of [undefined,0,NaN,Number.MAX_SAFE_INTEGER+1])await assert.rejects(()=>questionHistory(noRead,'chat',id as number),/question reference/);
 const q:any={select:()=>q,eq:()=>q,lte:()=>q,order:()=>q,limit:async()=>({data:null,error:{message:'offline'}})};
 await assert.rejects(()=>questionHistory({from:()=>q} as any,'chat',1),/history could not be loaded/);
});
