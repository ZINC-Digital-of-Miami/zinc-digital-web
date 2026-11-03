import {createAdminClient} from './supabase';
import {collectReviewEvidence} from './seo-review-evidence';
import {reviewInstructions,reviewWithClaude,validateReview} from './seo-review';
import {storeReview} from './seo-review-store';
import register from '../../docs/editorial/schedule.md?raw';

export async function runSeoReview(key:string,source:'weekly'|'manual'){
 const apiKey=import.meta.env.ANTHROPIC_API_KEY;
 if(!apiKey)throw new Error('Add ANTHROPIC_API_KEY securely in Vercel to enable Claude reviews.');
 const sb=createAdminClient();
 return storeReview(sb,key,async saveReceipt=>{
  const {evidence,paths}=await collectReviewEvidence(sb);
  const result=await reviewWithClaude(apiKey,reviewInstructions(register),{checkedAt:new Date().toISOString(),source,evidence},fetch,saveReceipt);
  let value:unknown;try{value=JSON.parse(result.text);}catch{throw new Error('Claude did not return a valid JSON review. Its execution receipt was retained.');}
  const report=validateReview(value,new Map(evidence.map(e=>[e.id,e])),paths);
  return {source,report,evidence,model:result.model,effort:result.effort,messageId:result.messageId,stopReason:result.stopReason,usage:result.usage,commit:import.meta.env.VERCEL_GIT_COMMIT_SHA||'local preparation'};
 });
}
