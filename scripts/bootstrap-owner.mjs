#!/usr/bin/env node
// First owner (design section 6.2, task 11.2). Run once by the owner, with .env loaded:
//   node scripts/bootstrap-owner.mjs you@zincdigital.co ["Your Name"]
// Invites the address (the email link lands on /admin/auth/confirm/) and inserts its staff row as owner.
// If the insert fails, the invited user is deleted, so no half-made account remains. No address is kept
// in the repo, and no key is printed.
import { createClient } from '@supabase/supabase-js';

const [email = '', name = ''] = process.argv.slice(2);
const address = email.trim().toLowerCase();
if (!/^[^@\s]+@(zincdigital\.co|zincmiami\.com)$/.test(address)) {
  console.error('usage: node scripts/bootstrap-owner.mjs <you@zincdigital.co | you@zincmiami.com> ["Your Name"]');
  process.exit(2);
}
try { process.loadEnvFile('.env'); } catch { /* the variables may already be in the environment */ }
const url = (process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '');
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
if (!url || !secret) {
  console.error('PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env');
  process.exit(2);
}
const origin = (process.env.SITE_ORIGIN || 'https://www.zincdigital.co').replace(/\/$/, '');
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(address, { redirectTo: origin + '/admin/auth/confirm/' });
if (inviteError || !invited?.user) {
  console.error('invite failed:', inviteError?.status || '', inviteError?.message || 'no user returned');
  process.exit(1);
}
const { error: insertError } = await admin.from('staff').insert({ user_id: invited.user.id, email: address, name: name || null, role: 'owner' });
if (insertError) {
  await admin.auth.admin.deleteUser(invited.user.id);
  console.error('staff insert failed, invite removed:', insertError.code || '', insertError.message);
  process.exit(1);
}
console.log('Invited ' + address + ' as owner. Open the email on this computer and follow the link; it signs you in at ' + origin + '/admin/.');
