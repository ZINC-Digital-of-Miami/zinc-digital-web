import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,createVerify} from 'node:crypto';
import {authorizeGoogle,googleAccount,GOOGLE_READ_SCOPES} from '../src/lib/google-auth.ts';
const login=JSON.stringify({type:'authorized_user',client_id:'client',client_secret:'secret',refresh_token:'refresh',account_email:'owner@example.com'});
test('existing Google login refreshes with only Analytics and Search Console read access',async()=>{
 let request:RequestInit|undefined;
 const send:typeof fetch=async(url,init)=>{assert.equal(url,'https://oauth2.googleapis.com/token');request=init;return Response.json({access_token:'session',expires_in:3600,scope:GOOGLE_READ_SCOPES});};
 const result=await authorizeGoogle(login,send),body=request!.body as URLSearchParams;
 assert.equal(body.get('grant_type'),'refresh_token');assert.equal(body.get('scope'),GOOGLE_READ_SCOPES);
 assert.equal(body.get('client_id'),'client');assert.equal(body.get('refresh_token'),'refresh');assert.equal(body.get('account_email'),null);
 assert.equal(result.value,'session');assert.ok(result.expires>Date.now()+3500000);
});
test('service-account JWT remains signed and restricted to the same read scopes',async()=>{
 const keys=generateKeyPairSync('rsa',{modulusLength:2048}),private_key=keys.privateKey.export({type:'pkcs8',format:'pem'});
 const send:typeof fetch=async(_,init)=>{
  const parts=(init!.body as URLSearchParams).get('assertion')!.split('.');
  const claims=JSON.parse(Buffer.from(parts[1],'base64url').toString());
  assert.equal(claims.scope,GOOGLE_READ_SCOPES);assert.equal(claims.iss,'website@example.com');
  assert.equal(createVerify('RSA-SHA256').update(parts[0]+'.'+parts[1]).verify(keys.publicKey,Buffer.from(parts[2],'base64url')),true);
  return Response.json({access_token:'session',expires_in:3600});
 };
 await authorizeGoogle(JSON.stringify({type:'service_account',client_email:'website@example.com',private_key}),send);
});
test('invalid credentials and failed or broadened Google grants fail without leaking credentials',async()=>{
 for(const raw of ['null','{}',JSON.stringify({type:'authorized_user',client_secret:'secret'}),JSON.stringify({type:'other',client_email:'owner',private_key:'secret'})])assert.throws(()=>googleAccount(raw),/credentials are invalid/);
 await assert.rejects(authorizeGoogle(login,async()=>new Response('refresh-token-secret',{status:400})),/Google authentication failed/);
 await assert.rejects(authorizeGoogle(login,async()=>Response.json({access_token:'session',expires_in:3600,scope:'https://www.googleapis.com/auth/cloud-platform'})),/beyond the website/);
 await assert.rejects(authorizeGoogle(login,async()=>Response.json({access_token:'session',expires_in:0})),/valid session/);
});
