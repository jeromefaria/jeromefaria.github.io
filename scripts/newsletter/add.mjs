import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { root } from '../data-loader.mjs';

const escapeSql = value => String(value).replace(/'/g, "''");

const token = () => randomBytes(32).toString('hex');

const isEmail = value => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);

const run = args =>
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'newsletter', '--remote', ...args], {
    cwd: join(root, 'worker'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const d1Exec = command => run(['--command', command]);

const d1Query = command => JSON.parse(run(['--json', '--command', command]))[0].results;

const statusOf = email => d1Query(`SELECT status FROM subscribers WHERE email = '${escapeSql(email)}'`)[0]?.status ?? null;

const plan = email => {
  const status = statusOf(email);

  if (status === 'active') return { email, verb: 'skip', note: 'already active' };
  if (status === 'unsubscribed') return { email, verb: 'refuse', note: 'previously unsubscribed — let them re-subscribe themselves' };
  if (status === 'pending') return { email, verb: 'confirm', note: 'signed up but never confirmed → activate' };

  return { email, verb: 'add', note: 'new active subscriber' };
};

const apply = ({ email, verb }) => {
  const now = new Date().toISOString();

  if (verb === 'confirm') {
    d1Exec(`UPDATE subscribers SET status = 'active', confirmed_at = '${now}', confirm_token = NULL WHERE email = '${escapeSql(email)}'`);
    return;
  }

  d1Exec(
    `INSERT INTO subscribers (email, status, confirm_token, unsubscribe_token, created_at, confirmed_at) VALUES ('${escapeSql(email)}', 'active', NULL, '${token()}', '${now}', '${now}')`,
  );
};

const report = (plans, committed) => {
  console.log('');
  for (const { email, verb, note } of plans) {
    console.log(`  ${verb.padEnd(8)} ${email.padEnd(32)} ${note}`);
  }

  const acted = plans.filter(entry => entry.verb === 'add' || entry.verb === 'confirm').length;
  console.log(committed ? `\n  Done — ${acted} added/activated.\n` : `\n  Dry run — ${acted} would be added/activated. Re-run with --commit to write.\n`);
};

const main = () => {
  const rawArgs = process.argv.slice(2);
  const commit = rawArgs.includes('--commit');
  const emails = [...new Set(rawArgs.filter(arg => arg !== '--commit').map(value => value.trim().toLowerCase()))];

  if (emails.length === 0) {
    console.error('\n  Usage: npm run newsletter:add -- <email> [more…] [--commit]\n  Safe by default: without --commit it only shows what it would do.\n');
    process.exit(1);
  }

  const invalid = emails.filter(value => !isEmail(value));
  if (invalid.length) {
    console.error(`\n  Not a valid email: ${invalid.join(', ')}\n`);
    process.exit(1);
  }

  const plans = emails.map(plan);

  if (commit) {
    plans.filter(entry => entry.verb === 'add' || entry.verb === 'confirm').forEach(apply);
  }

  report(plans, commit);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error('\n  Could not reach D1 — is wrangler authenticated and the `newsletter` database provisioned?');
    console.error(`  ${(error.stderr || error.message).toString().trim()}\n`);
    process.exit(1);
  }
}
