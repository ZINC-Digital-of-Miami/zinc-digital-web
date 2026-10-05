#!/usr/bin/env node
// Database rehearsal and permission tests (design section 7.1, task 8.2). In one transaction that always rolls
// back, runs the migration given (optional), supabase/tests/00_setup.sql, then every other supabase/tests/*.sql.
// The migration and the setup stop on the first error. Each test statement runs under ON_ERROR_ROLLBACK, so a
// failing assertion is reported and the rest still run. Nothing persists.
// Usage: node scripts/db-test.mjs [supabase/migrations/<file>.sql]
// An optional SUPABASE_DB_URL comes from the environment or ignored .env; otherwise the native Supabase
// CLI supplies fresh credentials. Credentials stay in memory/PG* variables and are never printed.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const PSQL = '/opt/homebrew/opt/postgresql@17/bin/psql';
const root = path.resolve(import.meta.dirname, '..');
const migration = process.argv[2] ? path.resolve(process.argv[2]) : '';
if (migration && !existsSync(migration)) { console.error('db-test: no such migration: ' + process.argv[2]); process.exit(2); }
try { process.loadEnvFile(path.join(root, '.env')); } catch { /* the variable may already be in the environment */ }
let db;
let dbOptions = process.env.PGOPTIONS || '';
let nativeLogin = false;
try { if (process.env.SUPABASE_DB_URL) db = new URL(process.env.SUPABASE_DB_URL); }
catch { console.error('db-test: invalid SUPABASE_DB_URL'); process.exit(2); }
// Native CLI authentication issues short-lived credentials; obtain fresh ones per run and keep them in memory.
if (!db || decodeURIComponent(db.username) === 'cli_login_postgres') {
  nativeLogin = true;
  const projectRef = readFileSync(path.join(root, 'supabase/config.toml'), 'utf8').match(/^project_id\s*=\s*"([a-z]{20})"/m)?.[1];
  if (!projectRef) { console.error('db-test: missing Supabase project reference'); process.exit(2); }
  const login = spawnSync('supabase', ['db', 'dump', '--project-ref', projectRef, '--schema', 'public,private,research', '--dry-run'], { cwd: root, encoding: 'utf8', timeout: 60000 });
  if (login.status !== 0) { console.error('db-test: native Supabase login failed; authenticate the Supabase CLI or supply SUPABASE_DB_URL'); process.exit(2); }
  const pg = {};
  for (const match of login.stdout.matchAll(/^export (PG[A-Z]+)=(.+)$/gm)) {
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    pg[match[1]] = value;
  }
  if (['PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'].some(key => !pg[key])) { console.error('db-test: incomplete native Supabase connection'); process.exit(2); }
  db = new URL('postgresql://localhost');
  db.hostname = pg.PGHOST; db.port = pg.PGPORT; db.username = pg.PGUSER; db.password = pg.PGPASSWORD; db.pathname = '/' + pg.PGDATABASE;
  db.searchParams.set('sslmode', 'require');
  dbOptions = '-c role=postgres -c statement_timeout=45000 -c lock_timeout=5000';
}

const testsDir = path.join(root, 'supabase', 'tests');
const tests = readdirSync(testsDir).filter((f) => f.endsWith('.sql') && f !== '00_setup.sql').sort();
const include = (f) => "\\i '" + f.replace(/'/g, "''") + "'";
// RESET ROLE must return to the maintenance role, not the native CLI's unprivileged login.
const includeTest = (f) => nativeLogin ? readFileSync(f, 'utf8').replace(/^reset role;$/gm, 'set local role postgres;') : include(f);
const script = [
  '\\set ON_ERROR_STOP 1',
  '\\set VERBOSITY terse',
  'begin;',
  ...(nativeLogin ? ['set local role postgres;'] : []),
  ...(migration ? ['\\echo ==> ' + path.basename(migration), include(migration)] : []),
  '\\echo ==> 00_setup.sql',
  includeTest(path.join(testsDir, '00_setup.sql')),
  '\\set ON_ERROR_STOP 0',
  '\\set ON_ERROR_ROLLBACK on',
  ...tests.flatMap((f) => ['\\echo ==> ' + f, includeTest(path.join(testsDir, f))]),
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
  PGOPTIONS: dbOptions,
  PGCONNECT_TIMEOUT: process.env.PGCONNECT_TIMEOUT || '10',
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
