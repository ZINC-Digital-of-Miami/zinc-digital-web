import {CODEX_MODEL} from '../codex-state.ts';
export function models(subscriptionReady=false){const e=import.meta.env;return[
 {value:'codex' as const,label:'GPT-6.1 Sol · Medium · Codex subscription',id:CODEX_MODEL,available:subscriptionReady,reason:'Connect Codex in Backend'},
 ...(e.ANTHROPIC_API_KEY?[{value:'claude' as const,label:'Claude',id:e.ANTHROPIC_MODEL||'claude-opus-5-5',available:true,reason:''}]:[]),
];}
