export const prerender=false;
import type {APIRoute} from 'astro';import {requireStaff} from '../../../../lib/auth';import {input,reply} from '../../../../lib/admin-http';import {createServerClient} from '../../../../lib/supabase';import {readDraft} from '../../../../lib/content-studio/store';import {slugValue} from '../../../../lib/content-studio/model';import {studioWritingInstructions,studioAnalysisInstructions} from '../../../../lib/content-studio/instructions';import {studioEvidence} from '../../../../lib/content-studio/metrics';import {runStudioAnalysis,runStudioWriting} from '../../../../lib/seo-review-runner';
export const GET:APIRoute=async ctx=>{const staff=requireStaff(ctx);if(staff instanceof Response)return staff;try{const id=ctx.url.searchParams.get('id')||'';if(!/^[0-9a-f-]{36}$/.test(id))throw new Error('Invalid request.');const r=await createServerClient(ctx).from('admin_cache').select('value').eq('key','seo_review:studio:'+id).maybeSingle();if(r.error||!r.data||r.data.value.actor!==staff.id||r.data.value.provider!==ctx.url.searchParams.get('provider'))throw new Error('Analysis unavailable.');return reply({...r.data.value,status:r.data.value.status==='complete'?'completed':r.data.value.status});}catch(e){return reply({error:(e as Error).message},404);}};
export const POST:APIRoute=async ctx=>{const staff=requireStaff(ctx);if(staff instanceof Response)return staff;try{const body=await input(ctx,2000),slug=slugValue(body.slug),db=createServerClient(ctx),draft=(await readDraft(db,slug))?.value;if(!draft||draft.revision!==body.revision)throw new Error('Save this version before requesting assistance.');if(typeof body.requestId!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId))throw new Error('Invalid request identifier.');if(!['write','research','review'].includes(String(body.action)))throw new Error('Choose writing, topic research or review.');const evidence=await studioEvidence(db,draft.service,draft.slug);
 if(JSON.stringify({draft,evidence}).length>195000)throw new Error('The manuscript and research exceed the current transport limit. Preserve the full draft and reduce duplicated brief material before requesting assistance.');
 if(staff.role!=='owner')return reply({error:'Owner role required for model API requests.'},403);
 const key='seo_review:studio:'+body.requestId;
 if(body.action==='write'){
  const apiKey=import.meta.env.OPENAI_API_KEY,model=import.meta.env.OPENAI_WRITING_MODEL;
  if(!apiKey||!model)throw new Error('Configure OPENAI_API_KEY and OPENAI_WRITING_MODEL securely in Vercel before writing.');
  const identity={actor:staff.id,provider:'gpt',revision:draft.revision,slug,source:'studio',action:'write'};
  const run=await runStudioWriting(key,apiKey,model,identity,studioWritingInstructions(draft.author),{draft,evidence});
  return reply({id:body.requestId,provider:'gpt',...run});
 }
 const apiKey=import.meta.env.ANTHROPIC_API_KEY;if(!apiKey)throw new Error('Claude API is not configured. Check Backend.');
 const run=await runStudioAnalysis(key,apiKey,{actor:staff.id,provider:'claude',revision:draft.revision,slug,source:'studio',action:body.action},studioAnalysisInstructions(draft.author),{task:body.action,draft,evidence});return reply({id:body.requestId,provider:'claude',...run});
 }catch(e){return reply({error:(e as Error).message},503);}};
