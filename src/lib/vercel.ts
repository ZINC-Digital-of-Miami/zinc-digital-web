const read=(key:string)=>(import.meta.env[key]||'').trim();
export type Deployment={id:string;url:string;state:string;created:number;target:string;meta?:Record<string,string>};
export function deploymentConfig(){return{token:read('VERCEL_API_TOKEN'),project:read('VERCEL_PROJECT_ID')||'prj_PcZ23na2T2M3j96XYMHZfeR3KF5t',team:read('VERCEL_TEAM_ID')||'team_OBen4n9i3PybGdYsjENnrv1S',hook:read('VERCEL_DEPLOY_HOOK_URL')};}
export async function deployments():Promise<Deployment[]>{
  const c=deploymentConfig();if(!c.token)throw new Error('Connect a Vercel API token to see deployments.');
  const query=new URLSearchParams({projectId:c.project,teamId:c.team,target:'production',limit:'5'});
  const res=await fetch('https://api.vercel.com/v6/deployments?'+query,{headers:{authorization:'Bearer '+c.token},signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error('Vercel deployments could not be loaded. Check the connection.');
  return(await res.json()).deployments;
}
export async function triggerBuild(){
  const c=deploymentConfig();if(!c.hook)throw new Error('Connect the deploy hook for main before publishing or redeploying.');
  const url=new URL(c.hook);
  if(url.origin!=='https://api.vercel.com'||!url.pathname.startsWith('/v1/integrations/deploy/'))throw new Error('The Vercel deploy hook is invalid.');
  const res=await fetch(url,{method:'POST',signal:AbortSignal.timeout(30000)});
  if(!res.ok)throw new Error('Vercel could not start the build. Try again.');
  return(await res.json()).job as {id:string;state:string;createdAt:number};
}
async function publicReceipt(revision:string){
 const res=await fetch('https://www.zincdigital.co/content-revision.json?revision='+revision,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error('Public receipt unavailable');
 return await res.json() as {revision?:string|null};
}
export async function publishResult(value:Record<string,any>|null,read:typeof publicReceipt=publicReceipt){
 if(!value||!['building','pending'].includes(value.status))return value;
 if(typeof value.revision!=='string'||! /^[a-f0-9]{64}$/.test(value.revision))return {...value,status:'Publication unverified · no content receipt'};
 try{
  const receipt=await read(value.revision);
  return {...value,status:receipt?.revision===value.revision?'ready':value.request_unconfirmed?'Build request unconfirmed · check deployments':'Awaiting published content verification'};
 }catch{return {...value,status:'Published content verification unavailable'};}
}
