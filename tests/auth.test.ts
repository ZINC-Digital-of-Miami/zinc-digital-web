// node --test (Node 24 type stripping). Covers src/lib/auth.ts: safeNext, requireStaff and staffRole.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext, requireStaff, staffRole } from '../src/lib/auth.ts';

test('safeNext keeps plain admin paths', () => {
  for (const ok of ['/admin/', '/admin/inquiries/', '/admin/staff/abc-123/', '/admin/posts/new_draft']) assert.equal(safeNext(ok), ok);
});

test('safeNext turns anything else into /admin/', () => {
  const bad = ['//evil.example', '//evil', '/\\evil', '/admin/\\evil', '/admin/%2fevil', '/admin/%2Fevil', '/admin/%5cevil', '/admin/a:b',
    'https://evil.example/admin/', 'javascript:alert(1)', '/admin', '/blog/', '/admin/../etc', '/admin/?x=1', '', null, undefined, 42];
  for (const v of bad) assert.equal(safeNext(v), '/admin/', String(v));
});

const ctx = (path: string, staff: unknown) => ({ url: new URL('https://www.zincdigital.co' + path), locals: { staff: staff as never } });
const editor = { id: 'u1', email: 'a@zincdigital.co', role: 'editor' as const };
const owner = { ...editor, role: 'owner' as const };

test('requireStaff redirects pages and refuses APIs without a session', async () => {
  const page = requireStaff(ctx('/admin/inquiries/', null));
  assert.ok(page instanceof Response);
  assert.equal(page.status, 302);
  assert.equal(page.headers.get('location'), '/admin/login/?next=' + encodeURIComponent('/admin/inquiries/'));
  const api = requireStaff(ctx('/api/admin/staff/', null));
  assert.ok(api instanceof Response);
  assert.equal(api.status, 401);
  assert.equal(api.headers.get('cache-control'), 'private, no-store');
});

test('requireStaff enforces the owner role', () => {
  const api = requireStaff(ctx('/api/admin/staff/', editor), 'owner');
  assert.ok(api instanceof Response);
  assert.equal(api.status, 403);
  const page = requireStaff(ctx('/admin/staff/', editor), 'owner');
  assert.ok(page instanceof Response);
  assert.equal(page.headers.get('location'), '/admin/');
  assert.deepEqual(requireStaff(ctx('/api/admin/staff/', owner), 'owner'), owner);
  assert.deepEqual(requireStaff(ctx('/admin/', editor)), editor);
});

test('staffRole accepts only owner or editor and denies on error or timeout', async () => {
  const rpc = (data: unknown, error: unknown = null) => ({ rpc: async () => ({ data, error }) });
  assert.equal(await staffRole(rpc('owner')), 'owner');
  assert.equal(await staffRole(rpc('editor')), 'editor');
  assert.equal(await staffRole(rpc('admin')), null);
  assert.equal(await staffRole(rpc(null)), null);
  assert.equal(await staffRole(rpc('owner', { message: 'boom' })), null);
  assert.equal(await staffRole({ rpc: async () => { throw new Error('network'); } }), null);
  assert.equal(await staffRole({ rpc: () => new Promise(() => {}) }, 20), null);
});
