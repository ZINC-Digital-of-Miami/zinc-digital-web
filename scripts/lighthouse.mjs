#!/usr/bin/env node
// Lighthouse report (R16.3): mobile preset, one URL per public template. Saves each JSON report and a summary
// of the four category scores, LCP, CLS and TBT. Scores are reported, never gated: the script fails only when a
// run cannot complete. Without a base URL it serves the local build with scripts/serve-static.mjs. A protected
// Vercel preview needs VERCEL_BYPASS_SECRET (Protection Bypass for Automation) in the environment.
// Usage: node scripts/lighthouse.mjs [--base <url>] [--run <name>] [--out <dir>]
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const run = opt('--run', 'm2');
const out = path.join(opt('--out', '/Volumes/Satechi Hub/zinc-digital-web-review/lighthouse'), run);
const TEMPLATES = [['home', '/'], ['services', '/services/'], ['service', '/services/seo/'], ['work', '/work/'], ['case', '/work/las-vegas-safety/'], ['about', '/about/'], ['contact', '/contact/'], ['thanks', '/thanks/'], ['blog', '/blog/'], ['article', '/blog/seven-digital-channels-which-to-skip/'], ['privacy', '/privacy/'], ['terms', '/terms/'], ['404', '/not-a-real-page/']];

let server; let base = opt('--base');
if (!base) {
  base = 'http://127.0.0.1:4343';
  server = spawn(process.execPath, ['scripts/serve-static.mjs', '--port', '4343'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 150)); }
}
await mkdir(out, { recursive: true });
const flags = ['--headless=new', '--no-first-run'];
if (process.env.CHROME_NO_SANDBOX === '1') flags.push('--no-sandbox');
const chrome = await chromeLauncher.launch({ chromeFlags: flags });
const extraHeaders = process.env.VERCEL_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_SECRET } : undefined;
const rows = [];
try {
  for (const [template, p] of TEMPLATES) {
    const r = await lighthouse(base.replace(/\/$/, '') + p, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], extraHeaders });
    const lhr = r.lhr; const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100); const num = (k) => lhr.audits[k]?.numericValue;
    await writeFile(path.join(out, template + '.json'), r.report);
    const row = { template, path: p, performance: score('performance'), accessibility: score('accessibility'), bestPractices: score('best-practices'), seo: score('seo'), lcpMs: Math.round(num('largest-contentful-paint') ?? 0), cls: +(num('cumulative-layout-shift') ?? 0).toFixed(3), tbtMs: Math.round(num('total-blocking-time') ?? 0), runtimeError: lhr.runtimeError?.code };
    const failing = ['performance', 'accessibility', 'best-practices', 'seo'].flatMap((c) => (lhr.categories[c]?.auditRefs || []).filter((a) => a.weight > 0 && lhr.audits[a.id]?.score !== null && lhr.audits[a.id]?.score < 1).map((a) => c + ': ' + lhr.audits[a.id].title));
    rows.push({ ...row, failing });
    console.log(template.padEnd(9), [row.performance, row.accessibility, row.bestPractices, row.seo].join(' / '), 'LCP ' + row.lcpMs + ' ms', 'CLS ' + row.cls, 'TBT ' + row.tbtMs + ' ms');
  }
} finally { await chrome.kill(); server?.kill('SIGTERM'); }
const md = ['# Lighthouse ' + run, '', 'Base: ' + base + ' · mobile preset · ' + new Date().toISOString(), '', '| Template | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |', '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.template} (${r.path}) | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcpMs} ms | ${r.cls} | ${r.tbtMs} ms |`), '',
  '## Audits below full score', '', ...rows.flatMap((r) => (r.failing.length ? ['**' + r.template + '**', ...r.failing.map((f) => '- ' + f), ''] : []))];
await writeFile(path.join(out, 'summary.md'), md.join('\n') + '\n');
await writeFile(path.join(out, 'summary.json'), JSON.stringify(rows, null, 2) + '\n');
console.log('lighthouse: ' + rows.length + ' templates → ' + out);
