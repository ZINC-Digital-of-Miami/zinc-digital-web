// Runs scripts/verify-mockup.mjs with a ChromeDriver that matches the Chrome
// installed on this machine. The npm `chromedriver` package (pulled in by
// @axe-core/cli) always tracks Chrome for Testing's newest release, so a local
// Chrome one version behind fails with SessionNotCreatedError before any check
// runs (measured 2026-09-26 CT: Chrome 153 vs ChromeDriver 154).
//
// Order: an explicit CHROMEDRIVER_PATH or the CI runner's paired driver
// ($CHROMEWEBDRIVER) wins; otherwise read the local Chrome's major version and
// install the matching driver once with the @puppeteer/browsers CLI already in
// node_modules, cached under node_modules/.cache (gitignored).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env };

function localChromeVersion() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
  ];
  for (const bin of candidates) {
    if (bin.startsWith('/') && !existsSync(bin)) continue;
    try {
      const out = execFileSync(bin, ['--version'], { encoding: 'utf8' });
      const match = out.match(/(\d+)\.\d+\.\d+\.\d+/);
      if (match) return { full: match[0], major: match[1] };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

if (!env.CHROMEDRIVER_PATH && !env.CHROMEWEBDRIVER) {
  const chrome = localChromeVersion();
  if (!chrome) {
    console.error('verify-local: no local Chrome found; set CHROMEDRIVER_PATH to a ChromeDriver matching your browser.');
    process.exit(1);
  }
  const cacheDir = path.join(root, 'node_modules', '.cache', 'zinc-chromedriver');
  const result = spawnSync(
    'npx',
    ['--no-install', '@puppeteer/browsers', 'install', 'chromedriver@' + chrome.major, '--path', cacheDir],
    { cwd: root, encoding: 'utf8' },
  );
  const lines = (result.stdout || '').trim().split('\n').filter(Boolean);
  const reported = lines.length ? lines[lines.length - 1].split(' ').slice(1).join(' ') : '';
  const driver = reported ? path.resolve(root, reported) : '';
  if (result.status !== 0 || !driver || !existsSync(driver)) {
    console.error('verify-local: could not install ChromeDriver ' + chrome.major + ' for Chrome ' + chrome.full + '.');
    console.error((result.stderr || result.stdout || '').trim());
    process.exit(1);
  }
  console.log('verify-local: Chrome ' + chrome.full + ', using ChromeDriver at ' + driver);
  env.CHROMEDRIVER_PATH = driver;
}

const run = spawnSync(process.execPath, [path.join(root, 'scripts', 'verify-mockup.mjs'), ...process.argv.slice(2)], {
  cwd: root,
  env,
  stdio: 'inherit',
});
process.exit(run.status ?? 1);
