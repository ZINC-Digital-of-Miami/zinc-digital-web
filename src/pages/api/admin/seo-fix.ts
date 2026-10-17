export const prerender=false;
import type { APIRoute } from 'astro';
import { requireStaff } from '../../../lib/auth';
import { input,reply,fail } from '../../../lib/admin-http';
import { contentList } from '../../../lib/admin-data';
import { contentInput,uuid } from '../../../lib/admin-input';
import { analyzeContent } from '../../../lib/seo-service';
import { draftRevision,specialistInstructions,validateSeoProposal,SEO_SPECIALIST_VERSION } from '../../../lib/seo-agent';
import { enqueueCodexJob,readCodexJob } from '../../../lib/codex-jobs';
import { SITE,STUDIOS,PHONE,EMAIL,services } from '../../../data/site';
import { savedGoogleSettings,seoSearchEvidence } from '../../../lib/google';
import { createServerClient } from '../../../lib/supabase';
export const POST:APIRoute=async ctx=>{
  const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
  try{
    const body=await input(ctx);
    if(body.instructions!==undefined&&(typeof body.instructions!=='string'||body.instructions.length>2000))return fail('Keep revision instructions within 2,000 characters.');
    const items=await contentList(ctx),key=body.kind==='page'?body.path:body.slug;
    const item=items.find(value=>value.kind===body.kind&&value.key===key);
    if(!item)return fail('Choose an existing page or saved post.');
    const {patch}=contentInput(body,items.filter(value=>value.kind==='page').map(value=>value.path));
    if(('body' in patch||'excerpt' in patch)&&(item.kind!=='post'||item.origin!=='admin'))return fail('This content is maintained in the repository. Request concrete content corrections in the instructions.');
    const report=await analyzeContent(item,patch,fetch,true);
    let searchConsole:Record<string,unknown>;
    try{searchConsole=await seoSearchEvidence(item.path,await savedGoogleSettings(createServerClient(ctx)));}
    catch(error){searchConsole={available:false,reason:error instanceof Error?error.message:'Search Console evidence could not be loaded.',requiredWork:'Reconnect or verify access in Backend, then regenerate for evidence-backed query recommendations.'};}
    const effective={...item,...patch};
    const job=await enqueueCodexJob(ctx,'seo',{
      instructions:specialistInstructions(),version:SEO_SPECIALIST_VERSION,
      target:{kind:item.kind,key:item.key,origin:item.origin,path:item.path},
      revision:draftRevision(item),expected_updated_at:item.updated_at||null,
      input:JSON.stringify({draft:effective,editableContent:item.kind==='post'&&item.origin==='admin',report,
        businessFacts:{name:'ZINC Digital',site:SITE,phone:PHONE,email:EMAIL,studios:STUDIOS.map(studio=>({...studio,state:'FL',country:'US'})),services:services.map(service=>({title:service.title,path:'/services/'+service.slug+'/',description:service.line}))},
        metadataCatalog:items.filter(value=>value!==item).map(value=>({path:value.path,title:value.meta_title,description:value.meta_description})),
        searchConsole,
        revisionInstructions:body.instructions||'',pixelFeedback:typeof body.pixelFeedback==='string'?body.pixelFeedback.slice(0,4000):undefined}),
    });
    return reply({id:job.id,revision:draftRevision(item),expected_updated_at:item.updated_at||null});
  }catch(error){return reply({error:error instanceof Error?error.message:'SEO assistance could not start. Connect Codex in Backend and retry.'},502);}
};
export const GET:APIRoute=async ctx=>{
  const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
  const id=ctx.url.searchParams.get('id');if(!uuid(id))return fail('Choose a valid SEO request.');
  try{
    const job=await readCodexJob(ctx,id);
    if(job.kind!=='seo')return fail('Choose an SEO request.');
    if(job.status!=='completed')return reply({id,status:job.status,error:job.error});
    if(!job.result||job.result.model!=='gpt-6.1-sol'||job.result.reasoningEffort!=='medium')return reply({error:'The requested Codex model was not verified. Reconnect Codex in Backend and regenerate.'},502);
    const target=job.payload.target as {kind:string;key:string;origin:string};
    const item=(await contentList(ctx)).find(value=>value.kind===target.kind&&value.key===target.key);
    if(!item||draftRevision(item)!==job.payload.revision)return reply({error:'This draft was saved elsewhere while the specialist was working. Reload and regenerate to preserve the newer changes.'},409);
    const proposal=validateSeoProposal(job.result.text,target);
    const items=await contentList(ctx);
    const duplicates=items.filter(value=>(value.kind!==item.kind||value.key!==item.key)&&((value.meta_title||'').trim().toLowerCase()===proposal.patch.meta_title.toLowerCase()||(value.meta_description||'').trim().toLowerCase()===proposal.patch.meta_description.toLowerCase()));
    if(duplicates.length)return reply({error:'The proposed metadata duplicates another page. Regenerate with instructions to make it unique.'},422);
    return reply({id,status:'completed',proposal,revision:job.payload.revision,expected_updated_at:job.payload.expected_updated_at,model:job.result.model,reasoningEffort:job.result.reasoningEffort});
  }catch(error){return reply({error:error instanceof Error?error.message:'SEO assistance is unavailable. Your draft is unchanged.'},502);}
};
