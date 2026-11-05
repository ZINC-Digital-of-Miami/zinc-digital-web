/** These messages come only from the transactional database coordination triggers. */
export const CODEX_BUSY='Codex subscription work is queued or running.';
export const CLAUDE_BUSY='A Claude SEO review is running. Start this after it finishes, usually within 10 minutes.';
export class AiWorkBusy extends Error {}
export function coordinationError(error:{code?:string;message?:string}|null|undefined):AiWorkBusy|null {
 return error?.code==='P0001' && [CODEX_BUSY,CLAUDE_BUSY].includes(error.message||'') ? new AiWorkBusy(error.message) : null;
}
