import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

test('a failed published-content read rejects callers but does not poison subsequent requests',async()=>{
 const fixtures:Record<string,string>={
  './supabase':'export const createAdminClient=()=>({});',
  './env':'export const env={supabaseSecretKey:()=>"test-only"};',
  '../data/site':'export const routes=[]; export const posts=[];',
  './content-model':'export const publishedContent=(routes,posts,pages,snapshots)=>({routes,pages,posts:snapshots});',
  './content-revision':'let reads=0; export async function readContentSnapshots(){reads++; if(reads===1)throw new Error("temporary snapshot failure"); return {pages:[],posts:[{title:"Verified published snapshot"}],revision:String(reads)};}',
 };
 const bundled=await build({entryPoints:['src/lib/content.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'content-loading-fixtures',setup(b){
  b.onResolve({filter:/.*/},args=>Object.hasOwn(fixtures,args.path)?{path:args.path,namespace:'fixture'}:undefined);
  b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:fixtures[args.path],loader:'js'}));
 }}]});
 const {loadPublished}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
 const failed=loadPublished();
 assert.equal(loadPublished(),failed,'Concurrent callers share the attempted read');
 await assert.rejects(failed,/temporary snapshot failure/);
 const recovered=loadPublished();
 assert.notEqual(recovered,failed,'A later request must get a fresh read, never the cached rejection');
 const result=await recovered;
 assert.equal(result.revision,'2');
 assert.deepEqual(result.posts,[{title:'Verified published snapshot'}]);
 assert.equal(loadPublished(),recovered,'Successful snapshots remain cached');
});
