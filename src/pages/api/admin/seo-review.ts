import {AiWorkBusy} from '../../../lib/ai-work-lock';
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {input,reply} from '../../../lib/admin-http';
import {runSeoReview,runSeoScan} from '../../../lib/seo-review-runner';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx,1000);
  if(typeof body.requestId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId))return reply({error:'Refresh this page before requesting a review.'},422);
  if(body.mode==='scan')return reply(await runSeoScan('seo_review:scan:'+body.requestId));
  if(body.mode!==undefined&&body.mode!=='review')return reply({error:'Choose site checks or a Claude review.'},422);
  return reply(await runSeoReview('seo_review:manual:'+body.requestId,'manual'));
 }catch(e){if(e instanceof AiWorkBusy)return reply({error:e.message},409);return reply({error:e instanceof Error?e.message:'The SEO review could not be completed.'},503);}
};
