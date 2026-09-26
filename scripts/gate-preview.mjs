import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const out=path.resolve('.scratch/phase01-mockup');
const expected={name:'zinc-digital-web',id:'prj_PcZ23na2T2M3j96XYMHZfeR3KF5t',team:'team_OBen4n9i3PybGdYsjENnrv1S',scope:'zincdigitalofmiamis-projects',alias:'zinc-digital-web.vercel.app'};
function verifyProject(project,domains){
  assert.equal(project.name,expected.name,'project name');
  assert.equal(project.id,expected.id,'project ID');
  assert.equal(project.accountId,expected.team,'project team');
  assert.equal(project.nodeVersion,'24.x','Node24');
  assert.ok(!project.link,'project remains Git-disconnected');
  assert.equal(project.ssoProtection?.deploymentType,'prod_deployment_urls_and_all_previews','free Vercel Authentication protection');
  assert.ok(!project.passwordProtection,'no paid password protection');
  assert.deepEqual(domains.domains.map(d=>d.name).sort(),[expected.alias],'only authorized alias');
}
if(args.includes('--self-test')){
  const good={name:expected.name,id:expected.id,accountId:expected.team,nodeVersion:'24.x',ssoProtection:{deploymentType:'prod_deployment_urls_and_all_previews'}};
  const domains={domains:[{name:expected.alias}]};verifyProject(good,domains);
  for(const patch of [{name:'wrong'},{id:'wrong'},{accountId:'wrong'},{nodeVersion:'20.x'},{link:{}},{ssoProtection:null},{passwordProtection:{}}])assert.throws(()=>verifyProject({...good,...patch},domains));
  assert.throws(()=>verifyProject(good,{domains:[{name:'www.zincdigital.co'}]}));
  console.log('PASS: eight provider-target faults rejected');process.exit(0);
}
if(!args.includes('--check-target')){
  const child=spawnSync(process.execPath,['scripts/verify-mockup.mjs',...args],{stdio:'inherit'});process.exit(child.status??1);
}
const base=option('--base','https://'+expected.alias);
assert.equal(new URL(base).hostname,expected.alias,'authorized public review alias');
await fs.mkdir(out,{recursive:true});
const local=JSON.parse(await fs.readFile('.vercel/project.json','utf8'));
assert.equal(local.projectId,expected.id);assert.equal(local.orgId,expected.team);
function api(endpoint){return JSON.parse(execFileSync('vercel',['api',endpoint,'--method','GET','--scope',expected.scope,'--raw'],{encoding:'utf8',timeout:30000,maxBuffer:5*1024*1024,env:{...process.env,TMPDIR:path.join(out,'tmp'),XDG_CACHE_HOME:path.join(out,'cache')}}));}
const project=api('/v9/projects/'+expected.id);
const domains=api('/v9/projects/'+expected.id+'/domains');
verifyProject(project,domains);
const deployment=project.targets?.production;
assert.ok(deployment?.id&&deployment?.url,'current production deployment metadata available');
const full=api('/v13/deployments/'+deployment.id);
assert.equal(full.projectId,expected.id,'deployment project identity');
assert.equal(full.target,'production','public alias deployment target');
assert.equal(full.readyState,'READY','current deployment ready');
const checks=[];
for(const [route,status] of [['/',200],['/not-a-real-page/',404]]){
  const response=await fetch(base+route);const body=await response.text();assert.equal(response.status,status,'alias HTTP status');assert.match(response.headers.get('x-robots-tag')||'',/noindex.*nofollow/,'header noindex');assert.match(body,/<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/,'meta noindex');assert.ok(body.includes('<h1'),'rendered page body');checks.push({route,status:response.status,noindex:response.headers.get('x-robots-tag')});
}
const rawUrl='https://'+deployment.url;
const raw=await fetch(rawUrl,{redirect:'manual'});
assert.ok([302,303,307,308].includes(raw.status),'raw deployment protected redirect');assert.match(raw.headers.get('location')||'',/vercel\.com\/(sso-api|login|sso)/,'raw deployment SSO destination');
const evidence={checkedAt:new Date().toISOString(),project:{id:project.id,name:project.name,team:project.accountId,nodeVersion:project.nodeVersion,gitConnected:!!project.link,protection:project.ssoProtection,passwordProtection:!!project.passwordProtection,domains:domains.domains.map(d=>d.name)},deployment:{id:full.id,url:full.url,target:full.target,readyState:full.readyState,sourceSha:full.meta?.githubCommitSha||full.meta?.gitCommitSha||null},checks,raw:{url:rawUrl,status:raw.status,location:raw.headers.get('location')}};
await fs.writeFile(path.join(out,'target-check.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
