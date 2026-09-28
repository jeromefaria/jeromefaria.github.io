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

const day = value => (value ? value.slice(0, 10) : '—');

const run = () => {
  const rows = d1Query('SELECT email, status, created_at, confirmed_at FROM subscribers ORDER BY created_at');

  if (rows.length === 0) {
    console.log('\n  No subscribers yet.\n');
    return;
  }

  console.log(`\n  Newsletter subscribers (${rows.length})\n  ${'─'.repeat(24)}`);
  for (const { email, status, created_at: createdAt, confirmed_at: confirmedAt } of rows) {
    console.log(`  ${status.padEnd(12)} ${email.padEnd(34)} joined ${day(createdAt)}  confirmed ${day(confirmedAt)}`);
  }
  console.log('');
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
