import {createAdminClient} from './supabase';
import {collectReviewEvidence} from './seo-review-evidence';
import {reviewInstructions,reviewWithClaude,validateReview,reviewsEnabled,parseReviewResponse} from './seo-review';
import {scoreSnapshot,parseScoreSnapshot,compareSnapshots,SCORING_VERSION,type ScoreSnapshot} from './seo-review-dashboard';
import {reviewContext} from './seo-review-context';
import {storeReview,retryEligibility} from './seo-review-store';
import register from '../../docs/editorial/schedule.md?raw';

async function priorScores(sb:ReturnType<typeof createAdminClient>,key:string,current:ScoreSnapshot){
 const history=await sb.from('admin_cache').select('key,scorecard:value->scorecard,measuredAt:value->>measuredAt').like('key','seo\\_review:%').neq('key',key).order('fetched_at',{ascending:false}).limit(24).abortSignal(AbortSignal.timeout(10000));
 if(history.error)return {id:'score-history',available:false,gap:'Previous checklist measurements could not be read. No improvement is established.'};
 for(const row of (history.data||[]) as unknown as {key:string;scorecard:unknown;measuredAt:string}[]){
  const prior=parseScoreSnapshot(row.scorecard);
  if(prior&&prior.scoringVersion===current.scoringVersion&&Number.isFinite(Date.parse(row.measuredAt)))return {id:'score-history',available:true,measuredAt:row.measuredAt,scoringVersion:prior.scoringVersion,comparison:compareSnapshots(current,prior),note:'Same checklist version and common scored page paths only; score movement is not a ranking or traffic effect.'};
 }
 return {id:'score-history',available:false,gap:'No previous comparable checklist measurement is saved. This is the first baseline.'};
}

export async function runSeoReview(key:string,source:'weekly'|'manual',deferredOnly=false){
 if(!reviewsEnabled(import.meta.env.SEO_REVIEW_ENABLED))throw new Error('Claude reviews are paused until the research and instructions receive owner approval. Site checks remain available.');
 const apiKey=import.meta.env.ANTHROPIC_API_KEY;
 if(!apiKey)throw new Error('Add ANTHROPIC_API_KEY securely in Vercel to enable Claude reviews.');
 const sb=createAdminClient();
 if(source==='weekly'&&deferredOnly){const eligibility=await retryEligibility(sb,key);if(eligibility==='reserved')return {key,duplicate:true};if(eligibility!=='deferred')return {key,skipped:'No pre-paid deferral was recorded for this weekly review.'};}
 return storeReview(sb,key,async saveReceipt=>{
  const {evidence,paths}=await collectReviewEvidence(sb);
  const measuredAt=new Date().toISOString(),scorecard=scoreSnapshot(evidence);
  evidence.push(await priorScores(sb,key,scorecard));
  const measured={source,evidence,scorecard,scoringVersion:SCORING_VERSION,measuredAt,commit:import.meta.env.VERCEL_GIT_COMMIT_SHA||'local preparation'};
  await saveReceipt(measured);
  const result=await reviewWithClaude(apiKey,reviewInstructions(register),{checkedAt:measuredAt,source,scorecard,evidence:reviewContext(evidence)},fetch,receipt=>saveReceipt({...measured,...receipt}));
  let value:unknown;try{value=parseReviewResponse(result.text);}catch{throw new Error('Claude did not return a valid JSON review. Its execution receipt was retained.');}
  const report=validateReview(value,new Map(evidence.map(e=>[e.id,e])),paths);
  return {...measured,report,model:result.model,effort:result.effort,messageId:result.messageId,providerRequestId:result.providerRequestId,stopReason:result.stopReason,usage:result.usage};
 });
}
/** Measurements do not call Claude or require the paid-review activation flag. */
export async function runSeoScan(key:string){
 const sb=createAdminClient();
 return storeReview(sb,key,async()=>{
  const {evidence}=await collectReviewEvidence(sb);
  return {source:'scan',evidence,scorecard:scoreSnapshot(evidence),scoringVersion:SCORING_VERSION,measuredAt:new Date().toISOString(),commit:import.meta.env.VERCEL_GIT_COMMIT_SHA||'local preparation'};
 });
}

/** Owner-gated Content Studio analysis shares the existing transactional AI claim and receipts. */
export async function runStudioAnalysis(key:string,apiKey:string,identity:Record<string,unknown>,instructions:string,evidence:unknown){
 if(!/^seo_review:studio:[0-9a-f-]{36}$/.test(key))throw new Error('Invalid Studio analysis key.');
 return storeReview(createAdminClient(),key,async receipt=>{
  await receipt(identity);
  const result=await reviewWithClaude(apiKey,instructions,evidence,fetch,r=>receipt({...identity,...r}));
  return {...identity,text:result.text,model:result.model,usage:result.usage,providerRequestId:result.providerRequestId};
 });
}

/** Direct API writing uses the existing privileged, transactional receipt boundary. */
export async function runStudioWriting(key:string,apiKey:string,model:string,identity:Record<string,unknown>,instructions:string,evidence:unknown){
 if(!/^seo_review:studio:[0-9a-f-]{36}$/.test(key))throw new Error('Invalid Studio writing key.');
 const {writeWithOpenAI}=await import('./content-studio/openai');
 return storeReview(createAdminClient(),key,async receipt=>{await receipt(identity);const result=await writeWithOpenAI(apiKey,model,instructions,JSON.stringify(evidence),fetch,r=>receipt({...r,...identity}),'high');return {...result,...identity};},'OpenAI');
}
