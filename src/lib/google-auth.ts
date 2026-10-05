import {createSign} from 'node:crypto';

export const GOOGLE_READ_SCOPES='https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly';
type Account={type?:string;client_email?:string;private_key?:string;client_id?:string;client_secret?:string;refresh_token?:string;account_email?:string};
export function googleAccount(raw:string):Account{
 try{
  const value=JSON.parse(raw) as Account;
  const present=(field:unknown)=>typeof field==='string'&&!!field.trim();
  if(value.type==='authorized_user'){
   if(!present(value.client_id)||!present(value.client_secret)||!present(value.refresh_token))throw 0;
  }else if(value.type!=='service_account'||!present(value.client_email)||!present(value.private_key))throw 0;
  return value;
 }catch{throw new Error('The Google connection credentials are invalid.');}
}
export async function authorizeGoogle(raw:string,send:typeof fetch=fetch){
 const account=googleAccount(raw);
 let body:URLSearchParams;
 if(account.type==='authorized_user'){
  body=new URLSearchParams({grant_type:'refresh_token',client_id:account.client_id!,client_secret:account.client_secret!,refresh_token:account.refresh_token!,scope:GOOGLE_READ_SCOPES});
 }else{
  const now=Math.floor(Date.now()/1000),encode=(x:unknown)=>Buffer.from(JSON.stringify(x)).toString('base64url');
  const message=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:account.client_email,scope:GOOGLE_READ_SCOPES,aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const assertion=message+'.'+createSign('RSA-SHA256').update(message).sign(account.private_key!,'base64url');
  body=new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion});
 }
 const response=await send('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body,signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('Google authentication failed. Check the existing connection.');
 const data=await response.json();
 if(typeof data.access_token!=='string'||!data.access_token||!Number.isFinite(data.expires_in)||data.expires_in<=60)throw new Error('Google did not return a valid session.');
 // Reject a broadened OAuth response: the website needs only these two read scopes.
 if(data.scope&&String(data.scope).split(' ').some((scope:string)=>!GOOGLE_READ_SCOPES.split(' ').includes(scope)))throw new Error('Google returned permissions beyond the website’s read access.');
 return {value:data.access_token as string,expires:Date.now()+data.expires_in*1000};
}
