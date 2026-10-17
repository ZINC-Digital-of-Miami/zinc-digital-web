export const CODEX_MODEL='gpt-6.1-sol';
export const CODEX_EFFORT='medium';
export type CodexKind='connect'|'verify'|'research'|'seo';
export type RunnerState={heartbeat_at?:string;status?:string;model?:string;reasoning_effort?:string;verified_at?:string|null;auth_url?:string|null;message?:string};
export function authUrl(value:unknown):string|null{
 if(typeof value!=='string')return null;
 try{const url=new URL(value);return url.origin==='https://auth.openai.com'&&!url.username&&!url.password&&!url.hash&&![...url.searchParams.keys()].some(key=>/^(access_token|id_token|refresh_token|token)$/i.test(key))?url.href:null;}catch{return null;}
}
export function codexStatus(state:RunnerState|null,now=Date.now()){
 const heartbeat=Date.parse(state?.heartbeat_at||''),verified=Date.parse(state?.verified_at||'');
 const online=Number.isFinite(heartbeat)&&now-heartbeat<60000&&heartbeat<=now+5000;
 const ready=online&&state?.status==='ready'&&Number.isFinite(verified)&&state.model===CODEX_MODEL&&state.reasoning_effort===CODEX_EFFORT;
 return{online,ready,status:online?state?.status||'signed_out':'offline',model:CODEX_MODEL,reasoningEffort:CODEX_EFFORT,authUrl:online&&state?.status==='authenticating'?authUrl(state.auth_url):null,verifiedAt:ready?state?.verified_at:null,heartbeatAt:state?.heartbeat_at||null,message:!online?'The Codex runner on your Mac is offline. Wake the Mac and start its runner.':ready?'Codex subscription connected.':state?.message||'Connect Codex in Backend to continue.'};
}
export function jobRequest(kind:CodexKind,payload:Record<string,unknown>,role:string){
 if(!['connect','verify','research','seo'].includes(kind))throw new Error('Choose a supported Codex action.');
 if(kind==='connect'||kind==='verify'){if(role!=='owner')throw new Error('owner role required');return kind==='connect'?{reconnect:payload.reconnect===true}:{};}
 for(const [name,max] of [['instructions',50000],['input',200000]] as const){if(typeof payload[name]!=='string'||!(payload[name] as string).trim()||(payload[name] as string).length>max)throw new Error('Invalid Codex '+name+'.');}
 return payload;
}
