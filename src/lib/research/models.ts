import {openAiApiKey} from '../provider-keys';
export function models(){const e=import.meta.env;return[
 {value:'claude' as const,label:'Fable 5.1 · High · Research',id:'claude-fable-5-1',available:!!e.ZINC_ANTHROPIC_API_KEY,reason:'Configure the Claude API in Backend'},
 {value:'gpt' as const,label:'Terra 6.1 · High · Writing and chat',id:'gpt-6.1-terra',available:!!openAiApiKey(),reason:'Configure the OpenAI API in Backend'},
];}
