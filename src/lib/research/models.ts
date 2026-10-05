export function models(){const e=import.meta.env;return[
 {value:'claude' as const,label:'Claude',id:e.ANTHROPIC_MODEL||'claude-opus-5-5',key:e.ANTHROPIC_API_KEY||'',reason:'Needs ANTHROPIC_API_KEY'},
 {value:'gpt61' as const,label:'GPT-6.1 · High',id:e.OPENAI_MODEL_GPT61||'gpt-6.1',key:e.OPENAI_API_KEY||'',reason:'Needs OPENAI_API_KEY'},
 {value:'sol' as const,label:'GPT-6 Sol · High',id:e.OPENAI_MODEL_SOL||'gpt-6-sol',key:e.OPENAI_API_KEY||'',reason:'Needs OPENAI_API_KEY'},
];}
