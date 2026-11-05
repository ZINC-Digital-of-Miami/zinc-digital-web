import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authoredArticles} from '../src/data/article-library.ts';
import {proposalPillar} from '../src/lib/proposal-pillar.ts';
import {SERVICE_SLUGS} from '../src/lib/inquiry.ts';

test('every repository article explicitly owns one registered service',()=>{
 for(const article of authoredArticles){
  assert.ok(SERVICE_SLUGS.includes(article.primaryService),article.slug);
  assert.equal(proposalPillar(article.primaryService),article.primaryService);
 }
});
