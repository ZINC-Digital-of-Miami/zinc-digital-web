// node --test. Covers src/lib/signin.ts: staff address check and the per-address sign-in limit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isStaffAddress, signInAllowed, NEXT_COOKIE_OPTIONS } from '../src/lib/signin.ts';

test('only ZINC addresses can request a link', () => {
  for (const ok of ['kirk@zincdigital.co', 'a.b@zincmiami.com']) assert.equal(isStaffAddress(ok), true, ok);
  for (const bad of ['kirk@gmail.com', 'kirk@zincdigital.co.evil.com', 'kirk@evil-zincdigital.co', 'zincdigital.co', '@zincdigital.co', 'a@b@zincdigital.co', '']) assert.equal(isStaffAddress(bad), false, bad);
});

test('three links per address per 15 minutes', () => {
  const t0 = 1_000_000;
  const email = 'limit-test@zincdigital.co';
  assert.equal(signInAllowed(email, t0), true);
  assert.equal(signInAllowed(email, t0 + 1000), true);
  assert.equal(signInAllowed(email, t0 + 2000), true);
  assert.equal(signInAllowed(email, t0 + 3000), false);
  assert.equal(signInAllowed('other@zincdigital.co', t0 + 3000), true);
  assert.equal(signInAllowed(email, t0 + 15 * 60 * 1000 + 1), true);
});

test('the next cookie is HttpOnly, Secure, SameSite=Lax and lasts 10 minutes', () => {
  assert.deepEqual(NEXT_COOKIE_OPTIONS, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
});
