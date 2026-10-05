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
  const res=await fetch(url,{method:'POST',signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error('Vercel could not start the build. Try again.');
  return(await res.json()).job as {id:string;state:string;createdAt:number};
}
export async function publishResult(value:Record<string,any>|null){
 if(!value||!['building','pending'].includes(value.status))return value;
 try{const rows=await deployments();const first=rows.filter(r=>r.created>=new Date(value.at).getTime()).sort((a,b)=>a.created-b.created)[0];
  return first?{...value,status:first.state.toLowerCase(),deployment:first.url}:value;
 }catch{return {...value,status:'Build status unavailable · connect Vercel'};}
}
