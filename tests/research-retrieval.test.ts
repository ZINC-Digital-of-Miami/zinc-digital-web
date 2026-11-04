import {test} from 'node:test';import assert from 'node:assert/strict';import {researchSources} from '../src/lib/research/retrieval.ts';
test('natural-language misses use ranked project-scoped term matching, retaining the source limit',async()=>{
 const calls:any[]=[];const source={id:7,document_id:'doc',idx:0,content:'Website requirements',title:'Approved scope',kind:'note'};
 const db={rpc:async(name:string,args:any)=>{calls.push({name,...args});return{data:calls.length===1?[]:[source],error:null};}};
 assert.deepEqual(await researchSources(db,'project','What are the website requirements?'),[source]);
 assert.equal(calls.length,2);assert.equal(calls[1].p_query,'"what" OR "are" OR "the" OR "website" OR "requirements"');assert.equal(calls[1].p_project,'project');assert.equal(calls[1].p_limit,8);
});
test('precise results are retained; failed searches never broaden or become empty success',async()=>{
 let calls=0;const source={id:1};const exact={rpc:async()=>{calls++;return{data:[source],error:null};}};
 assert.deepEqual(await researchSources(exact,'p','website requirements'),[source]);assert.equal(calls,1);
 calls=0;await assert.rejects(researchSources({rpc:async()=>{calls++;return{data:null,error:{message:'denied'}};}},'p','website requirements'),/could not be searched/);assert.equal(calls,1);
});
test('broadened queries are bounded and cannot inherit operator syntax from input',async()=>{
 const queries:string[]=[];await researchSources({rpc:async(_name,args)=>{queries.push(args.p_query);return{data:[],error:null};}},'p','"website" -requirements OR "private"');
 assert.equal(queries[1],'"website" OR "requirements" OR "or" OR "private"');
});
