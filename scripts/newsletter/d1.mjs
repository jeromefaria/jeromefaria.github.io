import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import { root } from '../data-loader.mjs';

const run = args =>
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'newsletter', '--remote', ...args], {
    cwd: join(root, 'worker'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

export const d1Exec = command => run(['--command', command]);

export const d1Query = command => JSON.parse(run(['--json', '--command', command]))[0].results;

export const escapeSql = value => String(value).replace(/'/g, "''");

export const isEmail = value => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);

export const exitOnD1Error = error => {
  console.error('\n  Could not reach D1 — is wrangler authenticated and the `newsletter` database provisioned?');
  console.error(`  ${(error.stderr || error.message).toString().trim()}\n`);
  process.exit(1);
};
