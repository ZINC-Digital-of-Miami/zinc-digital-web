import {openAiApiKey} from '../../../../lib/provider-keys';
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {input,reply} from '../../../../lib/admin-http';
import {runStudioAnalysis,runStudioWriting} from '../../../../lib/seo-review-runner';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;if(staff.role!=='owner')return reply({error:'Owner role required.'},403);
 try{const body=await input(ctx,1000);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(body.requestId))||!['claude','gpt'].includes(String(body.provider)))throw Error('Choose a valid provider test.');
 const key='seo_review:studio:'+body.requestId,identity={actor:staff.id,provider:body.provider,source:'connection-test',action:'connection-test'};
 const instructions='This is a connection test. Reply with exactly: Connection verified. No tools or private data are supplied.';
 if(body.provider==='claude'){const secret=import.meta.env.ZINC_ANTHROPIC_API_KEY;if(!secret)throw Error('ZINC_ANTHROPIC_API_KEY is missing in this deployment.');await runStudioAnalysis(key,secret,identity,instructions,{test:'Reply briefly.'});}
 else{const secret=openAiApiKey();if(!secret)throw Error('OPENAI_API_KEY is missing in this deployment.');await runStudioWriting(key,secret,'gpt-6.1-terra',identity,instructions,{test:'Reply briefly.'});}
 return reply({id:body.requestId,provider:body.provider});
 }catch(e){return reply({error:(e as Error).message},502);}
};
