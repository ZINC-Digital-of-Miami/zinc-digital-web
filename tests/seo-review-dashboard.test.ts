import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scoreSnapshot,compareSnapshots,parseScoreSnapshot,scoreTrend,trafficComparisons,sparklineSegments,pagePerformanceEvidence,SCORING_VERSION} from '../src/lib/seo-review-dashboard.ts';

const page=(path:string,score:number|null,grade='strong',categories:unknown[]=[])=>({id:'page:'+path,path,analysis:{score,grade,categories,checks:[{status:'fail'},{status:'warn'},{status:'info'}]}});
test('score snapshots separate absent, excluded, blocked and genuine zero scores',()=>{
 const s=scoreSnapshot([page('/',100),page('/zero/',0,'needs-work'),page('/excluded/',null,'excluded'),page('/blocked/',null,'blocked'),{id:'page:/missing/',path:'/missing/',gap:'Read failed.'}]);
 assert.equal(s.total,5);assert.equal(s.scored,2);assert.equal(s.mean,50);assert.equal(s.excluded,1);assert.equal(s.blocked,1);assert.equal(s.unavailable,1);
 assert.equal(s.pages.find(p=>p.path==='/zero/')?.score,0);
});
test('category gauges weight applicable points and exclude deliberately excluded pages',()=>{
 const s=scoreSnapshot([page('/',100,'strong',[{name:'Metadata',points:10,maxPoints:10}]),page('/two/',50,'improve',[{name:'Metadata',points:10,maxPoints:30}]),page('/excluded/',null,'excluded',[{name:'Metadata',points:0,maxPoints:100}])]);
 assert.equal(s.categories[0].score,50);assert.equal(s.categories[0].pages,2);
});
test('improvements compare matching scored pages, independent of inventory additions',()=>{
 const before=scoreSnapshot([page('/',60),page('/gone/',100)]),after=scoreSnapshot([page('/',80),page('/new/',0)]);
 const comparison=compareSnapshots(after,before);
 assert.equal(comparison.available,true);assert.equal(comparison.commonPages,1);assert.equal(comparison.meanDelta,20);assert.equal(comparison.improved,1);
});
test('first baselines and scoring changes never invent an improvement',()=>{
 const current=scoreSnapshot([page('/',80)]);
 assert.equal(compareSnapshots(current).available,false);
 assert.equal(compareSnapshots(current,{...current,scoringVersion:'different'}).available,false);
 assert.equal(compareSnapshots(current,scoreSnapshot([page('/unrelated/',80)])).available,false);
});
test('saved scorecards require consistent finite counts and bounded scores',()=>{
 const s=scoreSnapshot([page('/',80)]);assert.equal(s.scoringVersion,SCORING_VERSION);assert.ok(parseScoreSnapshot(s));
 assert.equal(parseScoreSnapshot({...s,mean:Infinity}),null);
 assert.equal(parseScoreSnapshot({...s,pages:[{...s.pages[0],score:101}]}),null);
 assert.equal(parseScoreSnapshot({...s,total:30}),null);
});
test('history chart recomputes every point from the same shared page population',()=>{
 const trend=scoreTrend([{key:'one',at:'2026-11-02T14:00:00Z',scorecard:scoreSnapshot([page('/',60),page('/gone/',100)])},{key:'two',at:'2026-11-03T14:00:00Z',scorecard:scoreSnapshot([page('/',80),page('/new/',0)])}]);
 assert.equal(trend.commonPages,1);assert.deepEqual(trend.points.map(p=>p.mean),[60,80]);
});
test('traffic comparisons preserve observed zeros and unavailable periods',()=>{
 const rows=trafficComparisons([{id:'ga4',available:true,periods:[{name:'current',summary:{rows:[{dimension:'total',sessions:0,engagementRate:0,keyEvents:0}]}}]}]);
 assert.equal(rows[0].current,0);assert.equal(rows[0].previous,null);assert.equal(rows[1].percentage,true);
 assert.deepEqual(trafficComparisons([{id:'gsc',available:false}]),[]);
});
test('sparklines preserve calendar spacing and break at missing days',()=>{
 const segments=sparklineSegments([{date:'2026-11-01',value:0},{date:'2026-11-02',value:4},{date:'2026-11-04',value:2}],'2026-11-01','2026-11-04');
 assert.equal(segments.length,2);assert.equal(segments[0][0].value,0);assert.equal(segments[1][0].x,116);
 assert.deepEqual(sparklineSegments([],'2026-11-01','2026-11-04'),[]);
});
test('corrupt pillar referral counts cannot reach displayed changes',()=>{
 const pillar={slug:'seo',title:'SEO',servicePath:'/services/seo/',articlePaths:[],serviceReferrals:{current:0,previous:null}};
 const data={id:'page-performance',available:false,range:{current:{start:'2026-10-04',end:'2026-10-31'},previous:{start:'2026-09-06',end:'2026-10-03'}},sources:{ga4:{available:false},gsc:{available:false}},pages:[],pillars:[pillar],notes:[]};
 assert.ok(pagePerformanceEvidence([data]));
 for(const current of ['bad',NaN,Infinity,-1])assert.equal(pagePerformanceEvidence([{...data,pillars:[{...pillar,serviceReferrals:{current,previous:1}}]}]),null);
});
