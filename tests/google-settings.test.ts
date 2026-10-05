import {test} from 'node:test';
import assert from 'node:assert/strict';
import {googleSettingsInput} from '../src/lib/google-settings.ts';
test('Google settings accept only numeric GA4 IDs and ZINC properties',()=>{
 for(const site of ['','sc-domain:zincdigital.co','https://zincdigital.co/','https://www.zincdigital.co/'])assert.deepEqual(googleSettingsInput({property:'494489814',site}),{property:'494489814',site});
 for(const data of [null,{}, {property:'not-a-property',site:''},{property:'494489814',site:'sc-domain:another-site.com'},{property:'494489814',site:'https://zincdigital.co.evil.test/'},{property:'494489814',site:'http://127.0.0.1/'}, {property:'494489814',site:'https://www.zincdigital.co/?x=secret'}])assert.throws(()=>googleSettingsInput(data));
});
