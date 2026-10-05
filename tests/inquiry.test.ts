// node --test. Covers the live contact path in src/lib/inquiry.ts (tasks 12.1 and 12.2) with a fake database
// and mailer: size, origin, honeypot, validation, a refused reservation, database and email failures, the JSON
// and no-JavaScript answers, and the staff re-send. The limits themselves are counted in the database
// (public.submit_inquiry) and tested by supabase/tests/70_rate_limit.sql.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle, jsonAnswer, formAnswer, renotify, mailErrorClass, BUDGETS, TIMELINES, MAX_BODY_BYTES, NOTIFY_TIMEOUT_MS, SUBMIT_MESSAGES, type Deps, type Mail, type Outcome } from '../src/lib/inquiry.ts';

const SITE = 'https://www.zincdigital.co';
const NOW = Date.parse('2026-10-05T15:00:00Z');
const good = () => ({
  name: 'Ana Ruiz', company: 'Ruiz Supply', email: 'ana@ruizsupply.com', website: 'https://ruizsupply.com',
  service: ['shopify', 'seo'], budget: BUDGETS[1], timeline: TIMELINES[0], message: 'We need a faster storefront.',
});
const post = (body: unknown, headers: Record<string, string> = {}, url = SITE + '/api/inquiries/') =>
  new Request(url, { method: 'POST', headers: { origin: SITE, 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

type Fake = Deps & { rows: Record<string, unknown>[]; sent: Mail[]; updates: { id: string; patch: Record<string, unknown> }[]; calls: string[] };
function fake(over: Partial<Deps> & { retryAfter?: number } = {}): Fake {
  const f: Fake = {
    rows: [], sent: [], updates: [], calls: [],
    now: () => NOW,
    hash: (addr) => 'hmac-' + addr.length,
    reserve: async (v, clientHash) => {
      f.calls.push('reserve');
      if (over.retryAfter) return { retryAfter: over.retryAfter };
      f.rows.push({ ...v, client_hash: clientHash });
      return { id: '00000000-0000-4000-8000-000000000001' };
    },
    send: async (mail) => { f.calls.push('send'); f.sent.push(mail); },
    update: async (id, patch) => { f.calls.push('update'); f.updates.push({ id, patch }); },
    notifyTo: 'jaymie@zincdigital.co',
  };
  const { retryAfter: _r, ...rest } = over;
  return Object.assign(f, rest);
}
const run = (req: Request, deps: Fake | null) => handle(req, '203.0.113.9', { siteOrigin: SITE, deps: async () => deps });
const rejected = (o: Outcome, status: number) => { assert.equal(o.kind, 'reject'); if (o.kind === 'reject') assert.equal(o.status, status); return o as Extract<Outcome, { kind: 'reject' }>; };

test('a valid inquiry is stored with the client hash, then the notification is sent and recorded', async () => {
  const f = fake();
  assert.deepEqual(await run(post(good()), f), { kind: 'ok' });
  assert.deepEqual(f.calls, ['reserve', 'send', 'update']);
  assert.equal(f.rows[0].client_hash, 'hmac-11');
  assert.ok(!JSON.stringify(f.rows[0]).includes('203.0.113.9'), 'the raw address is not stored');
  assert.deepEqual(f.sent[0], { ...f.sent[0], to: 'jaymie@zincdigital.co', replyTo: 'ana@ruizsupply.com', subject: 'New inquiry · Ruiz Supply' });
  for (const v of ['Ana Ruiz', 'https://ruizsupply.com', 'shopify, seo', BUDGETS[1], TIMELINES[0], 'We need a faster storefront.']) assert.ok(f.sent[0].text.includes(v), v);
  assert.deepEqual(f.updates[0].patch, { notify_status: 'sent', notify_error: null, notify_attempts: 1, notified_at: new Date(NOW).toISOString() });
});

test('validation failures answer 422 with the field and the visitor values, and touch nothing', async () => {
  const f = fake();
  const o = rejected(await run(post({ ...good(), email: 'not-an-email' }), f), 422);
  assert.equal(o.field, 'email');
  assert.equal(o.values?.company, 'Ruiz Supply');
  assert.deepEqual(f.calls, []);
});

test('the size limit answers 413 before anything is read further', async () => {
  const f = fake();
  rejected(await run(post({ ...good(), message: 'x'.repeat(MAX_BODY_BYTES) }), f), 413);
  rejected(await run(post('{}', { 'content-length': String(MAX_BODY_BYTES + 1) }), f), 413);
  rejected(await run(post('{not json'), f), 400);
  assert.deepEqual(f.calls, []);
});

test('the origin check rejects other sites and accepts the site, its Referer and a preview host', async () => {
  const f = fake();
  rejected(await run(post(good(), { origin: 'https://evil.example' }), f), 403);
  rejected(await run(new Request(SITE + '/api/inquiries/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(good()) }), f), 403);
  rejected(await run(post(good(), { origin: 'https://other.vercel.app' }, 'https://zinc-preview.vercel.app/api/inquiries/'), f), 403);
  assert.deepEqual(f.calls, []);
  assert.equal((await run(new Request(SITE + '/api/inquiries/', { method: 'POST', headers: { referer: SITE + '/contact/', 'content-type': 'application/json' }, body: JSON.stringify(good()) }), fake())).kind, 'ok');
  assert.equal((await run(post(good(), { origin: 'https://zinc-preview.vercel.app' }, 'https://zinc-preview.vercel.app/api/inquiries/'), fake())).kind, 'ok');
});

test('a filled honeypot answers success and stores or sends nothing', async () => {
  const f = fake();
  assert.deepEqual(await run(post({ ...good(), company_website: 'https://spam.example' }, { origin: 'https://evil.example' }), f), { kind: 'ok' });
  assert.deepEqual(f.calls, []);
});

test('a reservation refused by the rate limit answers 429 with Retry-After and sends nothing', async () => {
  const f = fake({ retryAfter: 60 });
  const o = rejected(await run(post(good()), f), 429);
  assert.equal(o.error, SUBMIT_MESSAGES.rate);
  assert.equal(o.retryAfter, 60);
  assert.deepEqual(f.calls, ['reserve']);
  assert.equal(f.rows.length, 0);
});

test('a database failure answers a retryable 502 and sends no email', async () => {
  const f = fake({ reserve: async () => { throw new Error('db down'); } });
  const o = rejected(await run(post(good()), f), 502);
  assert.equal(o.error, SUBMIT_MESSAGES.failed);
  assert.equal(f.sent.length, 0);
});

test('without database or salt configuration the route answers 503', async () => {
  rejected(await run(post(good()), null), 503);
});

test('an email failure keeps the inquiry, marks it failed with the error class, and still answers success', async () => {
  const f = fake({ send: async () => { throw Object.assign(new Error('bad login'), { code: 'EAUTH' }); } });
  assert.deepEqual(await run(post(good()), f), { kind: 'ok' });
  assert.equal(f.rows.length, 1);
  assert.deepEqual(f.updates[0].patch, { notify_status: 'failed', notify_error: 'auth', notify_attempts: 1 });
});

test('a mail send that hangs is cut off at the timeout and recorded as a timeout', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fake({ send: () => new Promise(() => {}) });
  const pending = run(post(good()), f);
  while (!f.calls.includes('reserve')) await new Promise<void>((r) => setImmediate(r));
  await new Promise<void>((r) => setImmediate(r));
  t.mock.timers.tick(NOTIFY_TIMEOUT_MS);
  assert.deepEqual(await pending, { kind: 'ok' });
  assert.deepEqual(f.updates[0].patch, { notify_status: 'failed', notify_error: 'timeout', notify_attempts: 1 });
});

test('mail errors map to the stored classes', () => {
  assert.equal(mailErrorClass({ code: 'EAUTH' }), 'auth');
  assert.equal(mailErrorClass({ code: 'ETIMEDOUT' }), 'timeout');
  assert.equal(mailErrorClass({ code: 'EENVELOPE' }), 'rejected');
  assert.equal(mailErrorClass({ responseCode: 550 }), 'rejected');
  assert.equal(mailErrorClass({ code: 'ECONNECTION' }), 'network');
  assert.equal(mailErrorClass(undefined), 'network');
});

test('the JSON answer is no-store, carries the field on 422 and Retry-After on 429', async () => {
  const ok = jsonAnswer({ kind: 'ok' });
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await ok.json(), { ok: true });
  const invalid = jsonAnswer({ kind: 'reject', status: 422, error: 'x', field: 'email' });
  assert.deepEqual(await invalid.json(), { error: 'x', field: 'email' });
  const rate = jsonAnswer({ kind: 'reject', status: 429, error: SUBMIT_MESSAGES.rate, retryAfter: 60 });
  assert.equal(rate.status, 429);
  assert.equal(rate.headers.get('retry-after'), '60');
  assert.equal(rate.headers.get('cache-control'), 'no-store');
});

test('the no-JavaScript answer is a 303 to /thanks/ on success and a re-render with values on every error', async () => {
  assert.deepEqual(formAnswer({ kind: 'ok' }), { redirect: '/thanks/' });
  const form = (body: unknown) => post(new URLSearchParams(body as Record<string, string>).toString(), { 'content-type': 'application/x-www-form-urlencoded' }, SITE + '/contact/send/');
  const fields = { ...good(), service: 'shopify' };
  assert.deepEqual(formAnswer(await run(form(fields), fake())), { redirect: '/thanks/' });
  const invalid = formAnswer(await run(form({ ...fields, website: 'ftp://x' }), fake()));
  assert.ok(!('redirect' in invalid));
  if (!('redirect' in invalid)) { assert.equal(invalid.status, 422); assert.equal(invalid.form.values?.name, 'Ana Ruiz'); assert.deepEqual(invalid.headers, {}); }
  const rate = formAnswer(await run(form(fields), fake({ retryAfter: 300 })));
  if (!('redirect' in rate)) { assert.equal(rate.status, 429); assert.equal(rate.headers['retry-after'], '300'); assert.equal(rate.form.error, SUBMIT_MESSAGES.rate); } else assert.fail('expected 429');
  const down = formAnswer(await run(form(fields), fake({ reserve: async () => { throw new Error('db'); } })));
  if (!('redirect' in down)) { assert.equal(down.status, 502); assert.equal(down.form.values?.company, 'Ruiz Supply'); } else assert.fail('expected 502');
});

test('a staff re-send turns a failed notification into sent and increments notify_attempts', async () => {
  const f = fake();
  const row = { ...good(), services: ['shopify'], source_path: '/contact/', notify_status: 'failed', notify_attempts: 1 };
  const status = await renotify('00000000-0000-4000-8000-000000000001', { ...f, get: async () => row });
  assert.equal(status, 'sent');
  assert.equal(f.sent.length, 1);
  assert.deepEqual(f.updates[0], { id: '00000000-0000-4000-8000-000000000001', patch: { notify_status: 'sent', notify_error: null, notify_attempts: 2, notified_at: new Date(NOW).toISOString() } });
  assert.equal(await renotify('00000000-0000-4000-8000-000000000002', { ...f, get: async () => null }), null);
});
