export const prerender=false;
export const maxDuration=60;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
import {uuid} from '../../../../lib/admin-input';
import {models} from '../../../../lib/research/models';
import {question,sourcesPrompt,provider,answer,type Source} from '../../../../lib/research/chat';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx,40000),text=question(body.text),model=models().find(m=>m.value===body.model);
  if(!uuid(body.project_id)||(body.chat_id!=null&&!uuid(body.chat_id)))return fail('Select a valid project and chat.');
  if(!model)return fail('Select a model.');if(!model.key)return reply({error:model.reason},503);
  const db=createServerClient(ctx).schema('research');
  const started=await db.rpc('start_question',{p_project:body.project_id,p_chat:body.chat_id||null,p_question:text,p_model:model.id});
  if(started.error)return reply({error:started.error.message.includes('rate limit')?'You have reached 20 questions in 10 minutes. Try again shortly.':'The chat could not be started.'},started.error.message.includes('rate limit')?429:502);
  const chat=started.data[0].chat_id;
  const assistant=await db.from('messages').insert({chat_id:chat,role:'assistant',content:'',status:'streaming',model:model.id}).select('id').single();
  if(assistant.error)return reply({error:'The answer could not be prepared.'},502);
  const disconnect=new AbortController();
  const signal=AbortSignal.any([ctx.request.signal,disconnect.signal,AbortSignal.timeout(50000)]),encoder=new TextEncoder();let cancelled=false;
  const stream=new ReadableStream({async start(controller){
   const send=(frame:unknown)=>{if(!cancelled)controller.enqueue(encoder.encode('data: '+JSON.stringify(frame)+'\n\n'));};
   try{
    send({chat_id:chat});
    const found=await db.rpc('search_chunks',{p_project:body.project_id,p_query:text,p_limit:8});
    if(found.error)throw new Error('Research sources could not be searched.');
    const sources=(found.data||[]) as Source[];
    const history=await db.from('messages').select('role,content').eq('chat_id',chat).eq('status','done').order('id',{ascending:false}).limit(12);
    if(history.error)throw new Error('Chat history could not be loaded.');
    const messages=history.data.reverse().filter(m=>['user','assistant'].includes(m.role));
    await answer(provider(model.value,model.id,model.key,sourcesPrompt(sources),messages,signal),sources,async patch=>{
     const saved=await db.from('messages').update(patch).eq('id',assistant.data.id);if(saved.error)throw new Error('The answer could not be saved.');
    },send);
   }catch(e){
    const saved=await db.from('messages').update({status:'error'}).eq('id',assistant.data.id);
    send({error:saved.error?'The answer failed and its status could not be saved.':e instanceof Error?e.message:'The answer failed.'});
   }finally{if(!cancelled)controller.close();}
  },cancel(){cancelled=true;disconnect.abort();}});
  return new Response(stream,{headers:{'content-type':'text/event-stream','cache-control':'private, no-store','x-accel-buffering':'no'}});
 }catch(e){return fail((e as Error).message);}
};
