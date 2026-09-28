import { fileURLToPath } from 'node:url';

import { d1Exec, d1Query, escapeSql, exitOnD1Error, isEmail } from './d1.mjs';

const statusOf = email => d1Query(`SELECT status FROM subscribers WHERE email = '${escapeSql(email)}'`)[0]?.status ?? null;

const plan = (email, hard) => {
  const status = statusOf(email);

  if (status === null) return { email, verb: 'skip', note: 'not on the list' };
  if (hard) return { email, verb: 'delete', note: `hard-delete (was ${status})` };
  if (status === 'unsubscribed') return { email, verb: 'skip', note: 'already unsubscribed' };

  return { email, verb: 'unsubscribe', note: `was ${status} → unsubscribed` };
};

const apply = ({ email, verb }) => {
  if (verb === 'delete') {
    d1Exec(`DELETE FROM subscribers WHERE email = '${escapeSql(email)}'`);
    return;
  }

  d1Exec(`UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = '${new Date().toISOString()}' WHERE email = '${escapeSql(email)}'`);
};

const report = (plans, committed, hard) => {
  console.log('');
  for (const { email, verb, note } of plans) {
    console.log(`  ${verb.padEnd(11)} ${email.padEnd(32)} ${note}`);
  }

  const acted = plans.filter(entry => entry.verb === 'unsubscribe' || entry.verb === 'delete').length;
  const label = hard ? 'deleted' : 'unsubscribed';
  console.log(committed ? `\n  Done — ${acted} ${label}.\n` : `\n  Dry run — ${acted} would be ${label}. Re-run with --commit to write.\n`);
};

const main = () => {
  const rawArgs = process.argv.slice(2);
  const commit = rawArgs.includes('--commit');
  const hard = rawArgs.includes('--delete');
  const emails = [...new Set(rawArgs.filter(arg => !arg.startsWith('--')).map(value => value.trim().toLowerCase()))];

  if (emails.length === 0) {
    console.error('\n  Usage: npm run newsletter:remove -- <email> [more…] [--delete] [--commit]');
    console.error('  Default is unsubscribe (a tombstone); --delete removes the row entirely.');
    console.error('  Safe by default: without --commit it only shows what it would do.\n');
    process.exit(1);
  }

  const invalid = emails.filter(value => !isEmail(value));
  if (invalid.length) {
    console.error(`\n  Not a valid email: ${invalid.join(', ')}\n`);
    process.exit(1);
  }

  const plans = emails.map(email => plan(email, hard));

  if (commit) {
    plans.filter(entry => entry.verb === 'unsubscribe' || entry.verb === 'delete').forEach(apply);
  }

  report(plans, commit, hard);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    exitOnD1Error(error);
  }
}
