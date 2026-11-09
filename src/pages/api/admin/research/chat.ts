import {openAiApiKey} from '../../../../lib/provider-keys';
export const prerender=false;
export const maxDuration=600;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
import {uuid} from '../../../../lib/admin-input';
import {models} from '../../../../lib/research/models';
import {question,questionHistory,sourcesPrompt,provider,answer,citations} from '../../../../lib/research/chat';
import {readCodexJob} from '../../../../lib/codex-jobs';
import {researchSources} from '../../../../lib/research/retrieval';
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
  const model=models().find(m=>m.value===body.model);
  if(!uuid(body.project_id)||(body.chat_id!=null&&!uuid(body.chat_id)))return fail('Select a valid project and chat.');
  if(!model)return fail('Select a model.');if(!model.available)return reply({error:model.reason},503);
  const db=createServerClient(ctx).schema('research');
  const started=await db.rpc('start_question',{p_project:body.project_id,p_chat:body.chat_id||null,p_question:text,p_model:model.id});
  if(started.error)return reply({error:started.error.message.includes('rate limit')?'You have reached 20 questions in 10 minutes. Try again shortly.':'The chat could not be started.'},started.error.message.includes('rate limit')?429:502);
  const {chat_id:chat,message_id:messageId}=started.data[0];
  const assistant=await db.from('messages').insert({chat_id:chat,role:'assistant',content:'',status:'streaming',model:model.id}).select('id').single();
  if(assistant.error)return reply({error:'The answer could not be prepared.'},502);
  try{
   const sources=await researchSources(db,body.project_id,text);
   const messages=await questionHistory(db,chat,messageId);
   const stop=new AbortController();const signal=AbortSignal.any([ctx.request.signal,stop.signal,AbortSignal.timeout(480000)]),encoder=new TextEncoder();let cancelled=false;
   const stream=new ReadableStream({async start(controller){
    const send=(frame:unknown)=>{if(!cancelled)controller.enqueue(encoder.encode('data: '+JSON.stringify(frame)+'\n\n'));};
    try{send({chat_id:chat});await answer(provider(model.value,model.id,(model.value==='gpt'?openAiApiKey():import.meta.env.ZINC_ANTHROPIC_API_KEY)||'',sourcesPrompt(sources),messages,signal,fetch,async receipt=>{const saved=await createServerClient(ctx).from('admin_cache').upsert({key:'research:provider:'+assistant.data.id,value:{actor:staff.id,chatId:chat,messageId:assistant.data.id,...receipt},fetched_at:new Date().toISOString()},{onConflict:'key'});if(saved.error)throw new Error('Provider receipt could not be saved. Do not retry blindly.');}),sources,async patch=>{
     const saved=await db.from('messages').update(patch).eq('id',assistant.data.id);if(saved.error)throw new Error('The answer could not be saved.');
    },send);}finally{if(!cancelled)controller.close();}
   },cancel(){cancelled=true;stop.abort();}});
   return new Response(stream,{headers:{'content-type':'text/event-stream','cache-control':'private, no-store','x-accel-buffering':'no'}});
  }catch(e){await db.from('messages').update({status:'error'}).eq('id',assistant.data.id);throw e;}
 }catch(e){return fail(e instanceof Error?e.message:'Research could not be started.');}
};
