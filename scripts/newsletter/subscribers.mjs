import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { root } from '../data-loader.mjs';

const d1Query = command =>
  JSON.parse(
    execFileSync('npx', ['wrangler', 'd1', 'execute', 'newsletter', '--remote', '--json', '--command', command], {
      cwd: join(root, 'worker'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
  )[0].results;

const count = where => Number(d1Query(`SELECT COUNT(*) AS n FROM subscribers WHERE ${where}`)[0].n);

const isoDaysAgo = days => new Date(Date.now() - days * 86_400_000).toISOString();

const run = () => {
  const active = count("status = 'active'");
  const pending = count("status = 'pending'");
  const unsubscribed = count("status = 'unsubscribed'");
  const confirmed7 = count(`status = 'active' AND confirmed_at >= '${isoDaysAgo(7)}'`);
  const confirmed30 = count(`status = 'active' AND confirmed_at >= '${isoDaysAgo(30)}'`);

  console.log(`
  Newsletter subscribers
  ──────────────────────
  Active         ${active}
  Pending        ${pending}${pending ? '  (signed up, not yet confirmed)' : ''}
  Unsubscribed   ${unsubscribed}

  Confirmed recently
    last 7 days    ${confirmed7}
    last 30 days   ${confirmed30}
`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (error) {
    console.error('\n  Could not read D1 — is wrangler authenticated and the `newsletter` database provisioned?');
    console.error(`  ${(error.stderr || error.message).toString().trim()}\n`);
    process.exit(1);
  }
}
