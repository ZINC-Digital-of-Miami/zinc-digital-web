import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measureSnippet, snippetProfiles } from '../src/lib/seo-pixels.ts';
test('measures the complete title suffix and wraps descriptions by rendered width',()=>{
  const measure=(text:string)=>text.length*10;
  const result=measureSnippet('Title','one two three four',{...snippetProfiles.desktop,titleWidth:110,descriptionWidth:70,descriptionLines:2},measure,measure);
  assert.equal(result.titleText,'Title | ZINC');
  assert.equal(result.titlePixels,120);
  assert.equal(result.titleOverflow,true);
  assert.equal(result.descriptionLines,3);
  assert.equal(result.descriptionOverflow,true);
});
test('uses measured glyph widths rather than a character limit and marks unbreakable overflow',()=>{
  const measure=(text:string)=>[...text].reduce((n,c)=>n+(c==='W'?20:2),0);
  assert.ok(measureSnippet('WWW','',{...snippetProfiles.mobile,titleWidth:70},measure,measure).titleOverflow);
  assert.equal(measureSnippet('iiiiiiiiii','',{...snippetProfiles.mobile,titleWidth:70},measure,measure).titleOverflow,false);
  assert.equal(measureSnippet('T','W'.repeat(60),snippetProfiles.mobile,measure,measure).descriptionOverflow,true);
});
