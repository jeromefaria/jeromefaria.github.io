import { fileURLToPath } from 'node:url';

import { d1Query, exitOnD1Error } from './d1.mjs';

const day = value => (value ? value.slice(0, 10) : '—');

const run = () => {
  const rows = d1Query(
    'SELECT email, status, created_at, confirmed_at, unsubscribed_at FROM subscribers ORDER BY created_at',
  );

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

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
    exitOnD1Error(error);
  }
}
