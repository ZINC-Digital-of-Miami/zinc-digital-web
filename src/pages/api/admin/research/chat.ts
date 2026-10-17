export const prerender=false;
export const maxDuration=60;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
import {uuid} from '../../../../lib/admin-input';
import {models} from '../../../../lib/research/models';
import {question,sourcesPrompt,provider,answer,citations,type Source} from '../../../../lib/research/chat';
import {codexConnection,enqueueCodexJob,readCodexJob} from '../../../../lib/codex-jobs';
import {CODEX_MODEL,CODEX_EFFORT} from '../../../../lib/codex-state';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{
  const job=await readCodexJob(ctx,ctx.url.searchParams.get('id')||'');
  if(job.kind!=='research')return fail('Choose a Research request.');
  const chat=job.payload.chat_id,assistant=job.payload.assistant_id;
  if(!uuid(chat)||typeof assistant!=='number')return fail('This Research request has invalid message references.');
  if(job.status==='queued'||job.status==='running')return reply({status:job.status,chat_id:chat,assistant_id:assistant});
  const db=createServerClient(ctx).schema('research');
  const failed=job.status==='failed'||!job.result||job.result.model!==CODEX_MODEL||job.result.reasoningEffort!==CODEX_EFFORT;
  const result=citations(failed?'':job.result!.text,job.payload.sources||[]);
  const patch={...result,status:failed?'error':'done'};
  const saved=await db.from('messages').update(patch).eq('id',assistant).eq('chat_id',chat).eq('status','streaming');
  if(saved.error)return reply({error:'The answer could not be saved. Retry loading this request.'},502);
  return reply({status:job.status,chat_id:chat,assistant_id:assistant,done:!failed,...result,...(failed?{error:job.error||'Codex did not complete with the requested model. Reconnect in Backend.'}:{})});
 }catch(e){return reply({error:e instanceof Error?e.message:'Research request unavailable.'},502);}
};
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx,40000),text=question(body.text);
  const ready=(await codexConnection(ctx).catch(()=>({ready:false}))).ready;
  const selected=['gpt61','sol'].includes(String(body.model))?'codex':body.model;
  const model=models(ready).find(m=>m.value===selected);
  if(!uuid(body.project_id)||(body.chat_id!=null&&!uuid(body.chat_id)))return fail('Select a valid project and chat.');
  if(!model)return fail('Select a model.');if(!model.available)return reply({error:model.reason},503);
  const db=createServerClient(ctx).schema('research');
  const started=await db.rpc('start_question',{p_project:body.project_id,p_chat:body.chat_id||null,p_question:text,p_model:model.id});
  if(started.error)return reply({error:started.error.message.includes('rate limit')?'You have reached 20 questions in 10 minutes. Try again shortly.':'The chat could not be started.'},started.error.message.includes('rate limit')?429:502);
  const chat=started.data[0].chat_id;
  const assistant=await db.from('messages').insert({chat_id:chat,role:'assistant',content:'',status:'streaming',model:model.id}).select('id').single();
  if(assistant.error)return reply({error:'The answer could not be prepared.'},502);
  try{
   const found=await db.rpc('search_chunks',{p_project:body.project_id,p_query:text,p_limit:8});
   if(found.error)throw new Error('Research sources could not be searched.');
   const sources=(found.data||[]) as Source[];
   const history=await db.from('messages').select('role,content').eq('chat_id',chat).eq('status','done').order('id',{ascending:false}).limit(12);
   if(history.error)throw new Error('Chat history could not be loaded.');
   const messages=history.data.reverse().filter(m=>['user','assistant'].includes(m.role));
   if(model.value==='codex'){
    const job=await enqueueCodexJob(ctx,'research',{instructions:sourcesPrompt(sources),input:JSON.stringify(messages),chat_id:chat,assistant_id:assistant.data.id,sources});
    return reply({job_id:job.id,chat_id:chat},202);
   }
   const signal=AbortSignal.any([ctx.request.signal,AbortSignal.timeout(50000)]),encoder=new TextEncoder();let cancelled=false;
   const stream=new ReadableStream({async start(controller){
    const send=(frame:unknown)=>{if(!cancelled)controller.enqueue(encoder.encode('data: '+JSON.stringify(frame)+'\n\n'));};
    try{send({chat_id:chat});await answer(provider('claude',model.id,import.meta.env.ANTHROPIC_API_KEY||'',sourcesPrompt(sources),messages,signal),sources,async patch=>{
     const saved=await db.from('messages').update(patch).eq('id',assistant.data.id);if(saved.error)throw new Error('The answer could not be saved.');
    },send);}finally{if(!cancelled)controller.close();}
   },cancel(){cancelled=true;}});
   return new Response(stream,{headers:{'content-type':'text/event-stream','cache-control':'private, no-store','x-accel-buffering':'no'}});
  }catch(e){await db.from('messages').update({status:'error'}).eq('id',assistant.data.id);throw e;}
 }catch(e){return fail(e instanceof Error?e.message:'Research could not be started.');}
};
