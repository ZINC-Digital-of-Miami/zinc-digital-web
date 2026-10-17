#!/usr/bin/env node
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';

const xml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
// Node opens the approved external-drive files after startup. launchd must not
// chdir or pre-open logs there: macOS can refuse that before Node even starts.
export function renderLaunchAgent({node,runner,envFile,stateDir,codex}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>co.zincdigital.codex-runner</string>
<key>ProgramArguments</key><array>${[node,runner,'--env',envFile,'--state-dir',stateDir].map(v=>`<string>${xml(v)}</string>`).join('')}</array>
<key>EnvironmentVariables</key><dict><key>CODEX_BINARY</key><string>${xml(codex)}</string><key>PATH</key><string>${xml(dirname(node)+':'+dirname(codex)+':/usr/bin:/bin:/usr/sbin:/sbin')}</string></dict>
<key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>ThrottleInterval</key><integer>15</integer>
</dict></plist>\n`;
}

async function main() {
  const arg=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
  const envArg=arg('--env');
  if(!envArg) throw new Error('Pass --env with the existing private local Supabase environment file.');
  if(Number(process.versions.node.split('.')[0])!==24) throw new Error('Use Node 24.');
  const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
  const stateDir=resolve(arg('--state-dir')||join(root,'.codex-runner'));
  const envFile=resolve(envArg);
  if(!stateDir.startsWith('/Volumes/Satechi Hub/') || !envFile.startsWith('/Volumes/Satechi Hub/')) throw new Error('Environment and state must stay on the approved external drive.');
  await access(envFile);
  const codex=arg('--codex') || spawnSync('/usr/bin/which',['codex'],{encoding:'utf8'}).stdout?.trim();
  if(!codex?.startsWith('/')) throw new Error('Pass --codex with the installed Codex executable path.');
  await access(codex);
  await mkdir(stateDir,{recursive:true,mode:0o700});
  const plist=renderLaunchAgent({node:process.execPath,runner:join(root,'scripts/codex-runner/run.mjs'),envFile,stateDir,codex});
  const prepared=join(stateDir,'co.zincdigital.codex-runner.plist');
  await writeFile(prepared,plist,{mode:0o600});
  if(!process.argv.includes('--activate')) {
    console.log(`Prepared launch agent: ${prepared}\nActivate after the database migration is approved/applied: node scripts/install-codex-runner.mjs --env <existing-file> --activate`);
    return;
  }
  const agents=join(homedir(),'Library/LaunchAgents');
  await mkdir(agents,{recursive:true});
  const target=join(agents,'co.zincdigital.codex-runner.plist');
  // Do not overwrite or unload an existing installation; inspect it explicitly before replacing.
  await writeFile(target,plist,{mode:0o600,flag:'wx'});
  const result=spawnSync('/bin/launchctl',['bootstrap',`gui/${process.getuid()}`,target],{stdio:'ignore'});
  if(result.status!==0) throw new Error('Launch agent was prepared but could not start. Check launchctl and the external drive.');
  console.log('Codex subscription runner starts automatically at login. Open Backend → Connect Codex.');
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
