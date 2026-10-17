import {test} from 'node:test';import assert from 'node:assert/strict';
import {connectionCheck} from '../src/lib/connection-checks.ts';
test('connection failures remain failures and do not become empty successful data',async()=>{
 assert.deepEqual(await connectionCheck('Search Console',async()=>{throw new Error('Grant access to the selected property.');}),{name:'Search Console',status:'failed',detail:'Grant access to the selected property.'});
 assert.equal((await connectionCheck('Mail',async()=>'Login verified; no email sent.')).status,'verified');
});
