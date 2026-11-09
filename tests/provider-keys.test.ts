import {test} from 'node:test';import assert from 'node:assert/strict';import {openAiApiKey} from '../src/lib/provider-keys.ts';
test('explicit variable reference resolves the stored secret, not its tracking ID',()=>{
 assert.equal(openAiApiKey({OPENAI_API_KEY_VARIABLE:'key_example',key_example:'test-secret-value'}),'test-secret-value');
 assert.equal(openAiApiKey({OPENAI_API_KEY_VARIABLE:'key_example',OPENAI_API_KEY:'different-account'}),'');
 assert.equal(openAiApiKey({OPENAI_API_KEY:'test-standard'}),'test-standard');
 assert.throws(()=>openAiApiKey({OPENAI_API_KEY_VARIABLE:'SUPABASE_SECRET_KEY'}));
});
