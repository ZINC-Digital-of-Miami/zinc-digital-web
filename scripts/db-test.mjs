#!/usr/bin/env node
// Database rehearsal and permission tests (design section 7.1, task 8.2). In one transaction that always rolls
// back, runs the migration given (optional), supabase/tests/00_setup.sql, then every other supabase/tests/*.sql.
// The migration and the setup stop on the first error. Each test statement runs under ON_ERROR_ROLLBACK, so a
// failing assertion is reported and the rest still run. Nothing persists.
// Usage: node scripts/db-test.mjs [supabase/migrations/<file>.sql]
// SUPABASE_DB_URL comes from the environment or the git-ignored .env. It is passed to psql through PG*
// variables, never on the command line, and never printed.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const PSQL = '/opt/homebrew/opt/postgresql@17/bin/psql';
const root = path.resolve(import.meta.dirname, '..');
const migration = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (migration && !existsSync(migration)) { console.error('db-test: no such migration: ' + process.argv[2]); process.exit(2); }
try { process.loadEnvFile(path.join(root, '.env')); } catch { /* the variable may already be in the environment */ }
let db;
try { db = new URL(process.env.SUPABASE_DB_URL || ''); } catch { console.error('db-test: SUPABASE_DB_URL must be set (git-ignored .env)'); process.exit(2); }

const testsDir = path.join(root, 'supabase', 'tests');
const tests = readdirSync(testsDir).filter((f) => f.endsWith('.sql') && f !== '00_setup.sql').sort();
const include = (f) => "\\i '" + f.replace(/'/g, "''") + "'";
const script = [
  '\\set ON_ERROR_STOP 1',
  '\\set VERBOSITY terse',
  'begin;',
  ...(migration ? ['\\echo ==> ' + path.basename(migration), include(migration)] : []),
  '\\echo ==> 00_setup.sql',
  include(path.join(testsDir, '00_setup.sql')),
  '\\set ON_ERROR_STOP 0',
  '\\set ON_ERROR_ROLLBACK on',
  ...tests.flatMap((f) => ['\\echo ==> ' + f, include(path.join(testsDir, f))]),
  '\\set ON_ERROR_ROLLBACK off',
  'rollback;',
  '\\echo ==> rolled back',
].join('\n');

const env = {
  ...process.env,
  PGHOST: db.hostname, PGPORT: db.port || '5432', PGDATABASE: decodeURIComponent(db.pathname.slice(1)) || 'postgres',
  PGUSER: decodeURIComponent(db.username), PGPASSWORD: decodeURIComponent(db.password),
  PGSSLMODE: db.searchParams.get('sslmode') || (/^(localhost|127\.0\.0\.1)$/.test(db.hostname) ? 'disable' : 'require'),
  PGAPPNAME: 'zinc-db-test',
};
delete env.SUPABASE_DB_URL;
const run = spawnSync(PSQL, ['-X', '-q', '-o', '/dev/null', '-f', '-'], { input: script, env, encoding: 'utf8' });
if (run.error) { console.error('db-test: could not run psql: ' + run.error.message); process.exit(2); }
process.stdout.write(run.stdout);
const errors = run.stderr.split('\n').filter((l) => /\bERROR:/.test(l)).map((l) => l.replace(/^psql:.*?\/supabase\//, 'supabase/'));
for (const e of errors) console.error(e);
if (run.status !== 0) { console.error('db-test: stopped (exit ' + run.status + '); the migration or the setup failed, and the transaction was rolled back'); process.exit(1); }
console.log(errors.length ? 'db-test: ' + errors.length + ' failing statement(s)' : 'db-test: all permission tests passed');
process.exit(errors.length ? 1 : 0);
