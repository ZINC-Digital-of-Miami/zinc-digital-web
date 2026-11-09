/** Explicit server-only key reference; never a fallback to a different provider/account. */
export function openAiApiKey(env:Record<string,string|undefined>=process.env){
 const name=env.OPENAI_API_KEY_VARIABLE||'OPENAI_API_KEY';
 if(!/^(OPENAI_API_KEY|key_[A-Za-z0-9]+)$/.test(name))throw Error('Invalid OpenAI secret-variable reference.');
 return env[name]||'';
}
