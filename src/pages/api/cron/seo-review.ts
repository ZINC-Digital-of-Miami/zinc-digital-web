import {AiWorkBusy} from '../../../lib/ai-work-lock';
export const prerender=false;
import type {APIRoute} from 'astro';
import {cronAuthorized,reviewSlot,reviewsEnabled} from '../../../lib/seo-review';
import {runSeoReview} from '../../../lib/seo-review-runner';
import {reply} from '../../../lib/admin-http';
export const GET:APIRoute=async ctx=>{
 if(!cronAuthorized(ctx.request.headers.get('authorization'),import.meta.env.CRON_SECRET||''))return reply({error:'Unauthorized'},401);
 if(import.meta.env.VERCEL_ENV!=='production')return reply({error:'Scheduled reviews run in production only.'},403);
 if(!reviewsEnabled(import.meta.env.SEO_REVIEW_ENABLED))return reply({paused:'Awaiting owner approval of the research and review instructions.'});
 const slot=reviewSlot();if(!slot)return reply({skipped:'Outside Monday 8–10 AM CT.'});
 try{return reply(await runSeoReview('seo_review:weekly:'+slot,'weekly'));}
 catch(e){if(e instanceof AiWorkBusy)return reply({skipped:e.message});return reply({error:e instanceof Error?e.message:'The weekly SEO review failed.'},503);}
};
