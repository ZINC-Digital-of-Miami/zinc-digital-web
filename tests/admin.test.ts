import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seoScore } from '../src/lib/seo-score.ts';
import { contentInput, inquiryInput, uuid } from '../src/lib/admin-input.ts';

test('SEO score matches the approved formula and explains deductions', () => {
  assert.equal(seoScore({ title: 'A useful title with the right length', desc: 'A'.repeat(100), status: 'published' }).score, 100);
  const short = seoScore({ title: 'Short', desc: '', status: 'draft' });
  assert.equal(short.score, 64);
  assert.equal(short.issues.length, 3);
  assert.equal(seoScore({ title: 'A'.repeat(61), desc: 'A'.repeat(161), status: 'published' }).score, 68);
});
test('content input rejects arbitrary page paths, reserved slugs and oversized fields', () => {
  assert.throws(() => contentInput({ kind: 'page', path: '/admin/' }, ['/']));
  assert.throws(() => contentInput({ kind: 'post', slug: '../admin', title: 'Bad' }, []));
  assert.throws(() => contentInput({ kind: 'post', slug: 'fine', title: 'A'.repeat(201) }, []));
  const saved = contentInput({ kind: 'post', slug: 'new-post', title: 'New post', layer: 'Build', status: 'draft', noindex: false, live: { title: 'attack' }, updated_by: 'attack' }, []);
  assert.equal(saved.patch.status, 'draft');
  assert.equal('live' in saved.patch, false);
  assert.equal('updated_by' in saved.patch, false);
});
test('inquiry mutations allow only board fields and valid IDs/stages', () => {
  assert.equal(uuid('00000000-0000-4000-8000-00000000b001'), true);
  assert.equal(uuid('id=anything'), false);
  assert.deepEqual(inquiryInput({ stage: 'qualified', notify_status: 'sent' }), { stage: 'qualified' });
  assert.throws(() => inquiryInput({ stage: 'lost' }));
  assert.throws(() => inquiryInput({ notes: 'A'.repeat(20001) }));
});
