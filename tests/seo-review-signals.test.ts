import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewSignals} from '../src/lib/seo-review-signals.ts';

test('weekly review retains factual person and organization bylines after BlogPosting specialization',()=>{
 const html='<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':[
  {'@type':'BlogPosting',author:{'@type':'Person',name:'Wendy Funnell'}},
  {'@type':'BlogPosting',author:{'@type':'Organization',name:'Team ZINC'}},
  {'@type':'TechArticle',author:{'@type':'Person',name:'Kirk Musick'}},
 ]})+'</script>';
 assert.deepEqual(reviewSignals(html).articleAuthorTypes,['Organization','Person']);
});
