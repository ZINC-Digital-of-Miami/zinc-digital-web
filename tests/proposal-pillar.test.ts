import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authoredArticles} from '../src/data/article-library.ts';
import {proposalPillar} from '../src/lib/proposal-pillar.ts';
import {SERVICE_SLUGS} from '../src/lib/inquiry.ts';

test('every published article resolves a real assigned service without changing membership',()=>{
 for(const article of authoredArticles){const before=[...article.related];const service=proposalPillar(article.related);assert.ok(service,article.slug);assert.ok(SERVICE_SLUGS.includes(service!));assert.ok(article.related.includes(service!));assert.deepEqual(article.related,before);}
});
test('mixed-pillar articles keep their deliberate first service and invalid values never become IDs',()=>{
 assert.equal(proposalPillar(['ai-search-optimization','seo']),'ai-search-optimization');
 assert.equal(proposalPillar(['seo','ai-search-optimization']),'seo');
 assert.equal(proposalPillar(['bad-value','shopify']),'shopify');
 assert.equal(proposalPillar(['<script>']),undefined);
});
