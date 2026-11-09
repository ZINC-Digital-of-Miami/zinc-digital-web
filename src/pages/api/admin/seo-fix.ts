export const prerender=false;
import type { APIRoute } from 'astro';
import { requireStaff } from '../../../lib/auth';
import { input,reply,fail } from '../../../lib/admin-http';
import { contentList } from '../../../lib/admin-data';
import { contentInput,uuid } from '../../../lib/admin-input';
import { analyzeContent } from '../../../lib/seo-service';
import { draftRevision,specialistInstructions,validateSeoProposal,SEO_SPECIALIST_VERSION } from '../../../lib/seo-agent';
import {runStudioAnalysis} from '../../../lib/seo-review-runner';
import { SITE,STUDIOS,EMAIL,services } from '../../../data/site';
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
    if(staff.role!=='owner')return reply({error:'Owner role required for API requests.'},403);
    const apiKey=import.meta.env.ZINC_ANTHROPIC_API_KEY;if(!apiKey)throw new Error('Configure the Claude API in Backend.');
    const id=body.requestId;if(!uuid(id))return fail('A request ID is required for safe recovery.');
    const payload={
      instructions:specialistInstructions(),version:SEO_SPECIALIST_VERSION,
      target:{kind:item.kind,key:item.key,origin:item.origin,path:item.path,primaryService:item.primary_service},
      revision:draftRevision(item),expected_updated_at:item.updated_at||null,
      input:JSON.stringify({draft:effective,editableContent:item.kind==='post'&&item.origin==='admin',report,
        businessFacts:{name:'ZINC Digital',site:SITE,email:EMAIL,studios:STUDIOS.map(studio=>({...studio,state:'FL',country:'US'})),services:services.map(service=>({title:service.title,path:'/services/'+service.slug+'/',pillar:'/blog/category/'+service.slug+'/',description:service.line}))},
        metadataCatalog:items.filter(value=>value!==item).map(value=>({path:value.path,title:value.meta_title,description:value.meta_description,focusKeyword:value.focus_keyword,primaryService:value.primary_service})),
        searchConsole,
        revisionInstructions:body.instructions||'',pixelFeedback:typeof body.pixelFeedback==='string'?body.pixelFeedback.slice(0,4000):undefined}),
    };
    await runStudioAnalysis('seo_review:studio:'+id,apiKey,{actor:staff.id,provider:'claude',source:'seo-specialist',payload},specialistInstructions(),JSON.parse(payload.input));
    return reply({id,revision:draftRevision(item),expected_updated_at:item.updated_at||null});
  }catch(error){return reply({error:error instanceof Error?error.message:'SEO assistance could not start. Check the Claude API connection in Backend.'},502);}
};
export const GET:APIRoute=async ctx=>{
  const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
  const id=ctx.url.searchParams.get('id');if(!uuid(id))return fail('Choose a valid SEO request.');
  try{
    const saved=await createServerClient(ctx).from('admin_cache').select('value').eq('key','seo_review:studio:'+id).maybeSingle();
    const job=saved.data?.value;if(saved.error||!job||job.actor!==staff.id||job.source!=='seo-specialist')return fail('Choose your SEO request.');
    if(job.status!=='complete')return reply({id,status:job.status,error:job.error});
    if(!['claude-fable-5-2','claude-fable-5-1'].includes(job.model)||job.effort!=='high')return reply({error:'The requested Fable High execution was not verified.'},502);
    const target=job.payload.target as {kind:string;key:string;origin:string};
    const item=(await contentList(ctx)).find(value=>value.kind===target.kind&&value.key===target.key);
    if(!item||draftRevision(item)!==job.payload.revision)return reply({error:'This draft was saved elsewhere while the specialist was working. Reload and regenerate to preserve the newer changes.'},409);
    const proposal=validateSeoProposal(job.text,target);
    const items=await contentList(ctx);
    const duplicates=items.filter(value=>(value.kind!==item.kind||value.key!==item.key)&&((value.meta_title||'').trim().toLowerCase()===proposal.patch.meta_title.toLowerCase()||(value.meta_description||'').trim().toLowerCase()===proposal.patch.meta_description.toLowerCase()));
    if(duplicates.length)return reply({error:'The proposed metadata duplicates another page. Regenerate with instructions to make it unique.'},422);
    const focus=proposal.patch.focus_keyword.trim().toLowerCase();
    const overlapping=focus?items.filter(value=>value.path!==item.path&&(value.focus_keyword||'').trim().toLowerCase()===focus).map(value=>value.path):[];
    if(overlapping.length)proposal.recommendations.push({category:'content',status:'verification_needed',problem:'The proposed focus keyword is also assigned to '+overlapping.join(', ')+'.',correction:'Compare the reader questions and native query/page evidence before accepting this focus. Shared wording alone is not a reason to consolidate pages.'});
    return reply({id,status:'completed',proposal,revision:job.payload.revision,expected_updated_at:job.payload.expected_updated_at,model:job.model,reasoningEffort:job.effort});
  }catch(error){return reply({error:error instanceof Error?error.message:'SEO assistance is unavailable. Your draft is unchanged.'},502);}
};
