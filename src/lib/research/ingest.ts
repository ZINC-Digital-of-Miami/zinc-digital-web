import type {SupabaseClient} from '@supabase/supabase-js';
import {uuid} from '../admin-input';
import {chunk,pageText,FILE_LIMIT,fileInput} from './text';
import {fetchSource,RESEARCH_URL_ENABLED} from './fetch';
import {extractFile} from './files';
import {searchSerp} from './serp';
export async function ingest(sb:SupabaseClient,actor:string,body:Record<string,unknown>,serpKey:string){
 const project=body.project_id,title=body.title,kind=body.kind;
 if(!uuid(project)||typeof title!=='string'||!title.trim()||title.length>200||!['note','url','file','serp'].includes(String(kind)))throw new Error('Select a project, source type and title up to 200 characters.');
 if(kind==='note'&&(typeof body.content!=='string'||!body.content.trim()||body.content.length>200000))throw new Error('Add source text up to 200,000 characters.');
 if(kind==='url'&&(!RESEARCH_URL_ENABLED||typeof body.url!=='string'||body.url.length>2048))throw new Error('Add a public source URL.');
 if(kind==='serp'&&(!serpKey||typeof body.query!=='string'||!body.query.trim()||body.query.length>500))throw new Error('SERP is not enabled, or the query is missing or too long.');
 let file:{name:string;type:string;ext:string}|undefined;
 if(kind==='file'){
  file=fileInput(body.name,body.size,body.type);
  if(typeof body.path!=='string'||!body.path.startsWith(project+'/')||!new RegExp('^'+project+'/[0-9a-f-]{36}-[a-zA-Z0-9._-]+$').test(body.path))throw new Error('Use a file uploaded to this project.');
 }
 const db=sb.schema('research'),check=await db.from('projects').select('id').eq('id',project).maybeSingle();
 if(check.error||!check.data)throw new Error('This project is unavailable.');
 const inserted=await db.from('documents').insert({project_id:project,title:title.trim(),kind,source_url:kind==='url'?body.url:null,created_by:actor,status:'pending',meta:kind==='file'?{path:body.path,name:body.name,type:file!.type}: {}}).select('id').single();
 if(inserted.error)throw new Error('The source could not be created.');
 const id=inserted.data.id;
 try{
  let text='',meta:Record<string,unknown>={},sourceUrl=kind==='url'?body.url:null;
  if(kind==='note')text=body.content as string;
  if(kind==='url'){const result=await fetchSource(body.url as string);text=result.type==='text/plain'?result.text:pageText(result.text);sourceUrl=result.url;}
  if(kind==='serp'){const result=await searchSerp(body.query as string,serpKey);text=result.text;meta={results:result.results,query:body.query};}
  if(kind==='file'){
   const downloaded=await sb.storage.from('research').download(body.path as string);
   if(downloaded.error||!downloaded.data)throw new Error('The private file could not be downloaded.');
   if(downloaded.data.size>FILE_LIMIT)throw new Error('The file exceeds 10 MB.');
   text=await extractFile(file!.name,file!.type,new Uint8Array(await downloaded.data.arrayBuffer()));meta={path:body.path,name:body.name,type:file!.type};
  }
  const parts=chunk(text);const saved=await db.from('chunks').insert(parts.map((content,idx)=>({document_id:id,idx,content})));
  if(saved.error)throw new Error('The source text could not be indexed.');
  const ready=await db.from('documents').update({content:text,source_url:sourceUrl,meta,status:'ready'}).eq('id',id);
  if(ready.error)throw new Error('The source could not be marked ready.');
  return {ok:true,document_id:id,status:'ready',chunks:parts.length};
 }catch(e){
  const error=e instanceof Error?e.message:'The source could not be processed.';
  const stored=await db.from('documents').update({status:'error',meta:{error,...(kind==='file'?{path:body.path}: {})}}).eq('id',id);
  return {ok:false,document_id:id,status:'error',error:stored.error?'Processing failed and its status could not be saved.':error};
 }
}
