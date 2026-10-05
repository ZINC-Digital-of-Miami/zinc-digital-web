// node --test. Guards design section 6.3: every private page and staff API is listed in
// src/data/private-routes.ts and calls requireStaff, and only the named modules import createAdminClient.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { PRIVATE_ROUTES, PUBLIC_ADMIN_PATHS, isPrivatePath } from '../src/data/private-routes.ts';

const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const routeOf = (file: string) => '/' + file.replace(/^src\/pages\//, '').replace(/\.(astro|ts)$/, '').replace(/(^|\/)index$/, '') + '/';

test('every admin page and staff API is listed and calls requireStaff', () => {
  const files = [...walk('src/pages/admin'), ...['src/pages/api/admin', 'src/pages/api/research'].flatMap((d) => { try { return walk(d); } catch { return []; } }), 'src/pages/api/inquiries/email.ts']
    .filter((f) => /\.(astro|ts)$/.test(f));
  const listed = new Set(PRIVATE_ROUTES.map((r) => r.file));
  for (const f of files) {
    const route = routeOf(f).replace(/\/+/g, '/');
    if (PUBLIC_ADMIN_PATHS.includes(route)) continue;
    assert.ok(listed.has(f), f + ' is missing from src/data/private-routes.ts');
    assert.match(readFileSync(f, 'utf8'), /requireStaff\(/, f + ' does not call requireStaff');
    assert.ok(isPrivatePath(route), route + ' is not under a private prefix');
  }
});

test('public paths stay public', () => {
  for (const p of ['/', '/contact/', '/api/inquiries/', '/contact/send/', '/admin/login/', '/admin/auth/confirm/', '/api/admin/signout/']) assert.equal(isPrivatePath(p), false, p);
  for (const p of ['/admin/', '/admin/staff/', '/api/admin/staff/', '/api/research/chat/', '/api/inquiries/email/']) assert.equal(isPrivatePath(p), true, p);
});

test('only the named modules import createAdminClient', () => {
  const allowed = new Set(['src/lib/supabase.ts', 'src/lib/inquiry.ts', 'src/lib/content.ts', 'src/pages/api/admin/staff.ts', 'src/pages/api/admin/publish.ts']);
  const users = walk('src').filter((f) => /\.(astro|ts|mjs)$/.test(f) && /createAdminClient/.test(readFileSync(f, 'utf8')));
  for (const f of users) assert.ok(allowed.has(f), f + ' must not use createAdminClient (design section 6.3.5)');
});
