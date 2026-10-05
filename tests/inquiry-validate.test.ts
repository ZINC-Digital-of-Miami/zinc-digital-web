// node --test tests/ (Node 24 type stripping). Covers src/lib/inquiry.ts validation, intake and body reading.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate, intake, readBody, formValues, SERVICE_SLUGS, BUDGETS, TIMELINES, LIMITS, MAX_BODY_BYTES, MESSAGES } from '../src/lib/inquiry.ts';

const good = () => ({
  name: 'Ana Ruiz', company: 'Ruiz Supply', email: 'ana@ruizsupply.com', website: 'https://ruizsupply.com',
  service: ['shopify'], budget: BUDGETS[0], timeline: TIMELINES[0], message: 'We need a faster storefront.',
});
const fails = (body: Record<string, unknown>, field: string) => {
  const r = validate(body);
  assert.equal(r.ok, false, 'expected ' + field + ' to fail');
  if (!r.ok) assert.equal(r.field, field);
};

test('a complete inquiry validates and is normalised', () => {
  const r = validate({ ...good(), email: ' Ana@RuizSupply.com ', id: 'x', stage: 'won', extra: 'ignored' });
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.value.email, 'ana@ruizsupply.com');
  assert.deepEqual(Object.keys(r.value).sort(), ['budget', 'company', 'email', 'message', 'name', 'services', 'source_path', 'timeline', 'website']);
  assert.equal(r.value.source_path, '/contact/');
});

test('every field limit: at the limit passes, one over fails', () => {
  const at: Record<string, string> = {
    name: 'n'.repeat(LIMITS.name), company: 'c'.repeat(LIMITS.company),
    email: 'e'.repeat(LIMITS.email - '@example.com'.length) + '@example.com',
    website: 'https://example.com/' + 'w'.repeat(LIMITS.website - 'https://example.com/'.length),
    message: 'm'.repeat(LIMITS.message),
  };
  for (const [field, value] of Object.entries(at)) {
    assert.equal(value.length, LIMITS[field as keyof typeof LIMITS]);
    assert.ok(validate({ ...good(), [field]: value }).ok, field + ' at its limit');
    const over = field === 'email' ? 'e' + value : field === 'website' ? value + 'w' : value + 'x';
    fails({ ...good(), [field]: over }, field);
  }
  assert.equal(validate({ ...good(), source_path: '/' + 'p'.repeat(LIMITS.source_path) }).ok, true, 'an over-long source path falls back');
  const r = validate({ ...good(), source_path: '/' + 'p'.repeat(LIMITS.source_path) });
  if (r.ok) assert.equal(r.value.source_path, '/contact/');
});

test('required fields and formats', () => {
  for (const f of ['name', 'company', 'email', 'website', 'message']) fails({ ...good(), [f]: '   ' }, f);
  for (const e of ['ana', 'ana@', 'ana@ruiz', 'a b@c.com']) fails({ ...good(), email: e }, 'email');
  for (const w of ['ruizsupply.com', 'ftp://ruizsupply.com', 'javascript:alert(1)', 'https://']) fails({ ...good(), website: w }, 'website');
  assert.ok(validate({ ...good(), website: 'http://ruizsupply.com/shop' }).ok);
});

test('the 11 service slugs match site.ts and each one validates', () => {
  const site = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8');
  const fromSite = Array.from(site.matchAll(/\{slug:'([a-z-]+)',title:'[^']*',layer:'/g), (m) => m[1]);
  assert.deepEqual([...SERVICE_SLUGS], fromSite);
  assert.equal(SERVICE_SLUGS.length, 11);
  for (const s of SERVICE_SLUGS) assert.ok(validate({ ...good(), service: s }).ok, s);
  const all = validate({ ...good(), service: [...SERVICE_SLUGS, 'shopify'] });
  assert.ok(all.ok);
  if (all.ok) assert.equal(all.value.services.length, 11, 'duplicates collapse');
  fails({ ...good(), service: [] }, 'services');
  fails({ ...good(), service: undefined }, 'services');
  fails({ ...good(), service: ['shopify', 'branding'] }, 'services');
  assert.equal(validate({ ...good(), service: [] }).ok ? '' : (validate({ ...good(), service: [] }) as { error: string }).error, MESSAGES.service);
});

test('the 4 budgets and 4 timelines from the Design', () => {
  assert.deepEqual([...BUDGETS], ['Under $5k/mo', '$5–10k/mo', '$10–25k/mo', '$25k+/mo']);
  assert.deepEqual([...TIMELINES], ['As soon as practical', 'Within three months', 'Three to six months', 'Exploring options']);
  for (const b of BUDGETS) assert.ok(validate({ ...good(), budget: b }).ok, b);
  for (const t of TIMELINES) assert.ok(validate({ ...good(), timeline: t }).ok, t);
  for (const b of ['', '$1M/mo', 'under $5k/mo']) fails({ ...good(), budget: b }, 'budget');
  for (const t of ['', 'Yesterday']) fails({ ...good(), timeline: t }, 'timeline');
});

test('intake: a filled honeypot sends nothing; everything else validates', () => {
  assert.deepEqual(intake({ ...good(), company_website: 'spam.example' }), { kind: 'ignore', reason: 'honeypot' });
  assert.equal(intake(good()).kind, 'accept');
  assert.equal(intake({}).kind, 'invalid');
  const bad = intake({ ...good(), email: 'nope' });
  assert.equal(bad.kind, 'invalid');
  if (bad.kind === 'invalid') assert.equal(bad.error, MESSAGES.required);
});

test('readBody: JSON, urlencoded and multipart; repeated keys become arrays; 32 KB cap', async () => {
  const req = (body: BodyInit, type?: string) => new Request('https://www.zincdigital.co/api/inquiries', { method: 'POST', body, headers: type ? { 'content-type': type } : {} });
  const j = await readBody(req(JSON.stringify(good()), 'application/json'));
  assert.ok(j.ok && validate(j.body).ok);
  const u = await readBody(req('name=Ana&service=seo&service=local-seo', 'application/x-www-form-urlencoded'));
  assert.ok(u.ok);
  if (u.ok) assert.deepEqual(u.body.service, ['seo', 'local-seo']);
  const fd = new FormData(); for (const [k, v] of Object.entries(good())) for (const x of ([] as string[]).concat(v)) fd.append(k, x);
  const m = await readBody(req(fd));
  assert.ok(m.ok && validate(m.body).ok);
  const big = await readBody(req(JSON.stringify({ message: 'x'.repeat(MAX_BODY_BYTES) }), 'application/json'));
  assert.deepEqual(big, { ok: false, status: 413, error: MESSAGES.tooLarge });
  for (const body of ['{not json', '[1,2]', 'null']) assert.equal((await readBody(req(body, 'application/json'))).ok, false, body);
});

test('formValues keeps what the visitor typed, clipped, for the no-JS error page', () => {
  const v = formValues({ ...good(), name: '  Ana  ', message: 'm'.repeat(LIMITS.message + 50), service: ['seo', 'bogus'] });
  assert.equal(v.name, 'Ana');
  assert.equal(v.message?.length, LIMITS.message);
  assert.deepEqual(v.services, ['seo']);
});
