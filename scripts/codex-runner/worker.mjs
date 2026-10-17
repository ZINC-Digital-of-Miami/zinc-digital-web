import { MODEL, EFFORT } from './client.mjs';

// Do not send CLI/backend exception details to cloud state: they can contain authentication data.
/** @param {unknown} [_error] */
export function runnerError(_error) {
  return 'The local subscription request failed. Check Codex sign-in and subscription usage, then retry.';
}

export async function executeJob(job, session, update) {
  let result;
  if (job.kind === 'connect') {
    result = await session.connect(async authUrl => update({
      status:authUrl ? 'authenticating' : 'verifying',auth_url:authUrl,
      message:authUrl ? 'Complete Codex sign-in in the browser on this Mac.' : 'Verifying subscription access with a completed model request.',
    }), {reconnect:job.payload?.reconnect === true});
  } else if (job.kind === 'verify') {
    await update({status:'verifying',auth_url:null,message:'Verifying subscription access with a completed model request.'});
    result = await session.verify();
  } else if (job.kind === 'research' || job.kind === 'seo') {
    result = await session.generate(job.payload);
  } else throw new Error('Unsupported subscription job.');
  await update({status:'ready',auth_url:null,message:'Codex subscription connected.',verified_at:new Date().toISOString(),model:MODEL,reasoning_effort:EFFORT});
  return result;
}
