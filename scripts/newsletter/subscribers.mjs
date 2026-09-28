import { fileURLToPath } from 'node:url';

import { d1Query, exitOnD1Error } from './d1.mjs';

const count = where => Number(d1Query(`SELECT COUNT(*) AS n FROM subscribers WHERE ${where}`)[0].n);

const isoDaysAgo = days => new Date(Date.now() - days * 86_400_000).toISOString();

const gather = () => ({
  active: count("status = 'active'"),
  pending: count("status = 'pending'"),
  unsubscribed: count("status = 'unsubscribed'"),
  confirmedLast7Days: count(`status = 'active' AND confirmed_at >= '${isoDaysAgo(7)}'`),
  confirmedLast30Days: count(`status = 'active' AND confirmed_at >= '${isoDaysAgo(30)}'`),
});

const run = () => {
  const counts = gather();

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(counts, null, 2));
    return;
  }

  console.log(`
  Newsletter subscribers
  ──────────────────────
  Active         ${counts.active}
  Pending        ${counts.pending}${counts.pending ? '  (signed up, not yet confirmed)' : ''}
  Unsubscribed   ${counts.unsubscribed}

  Confirmed recently
    last 7 days    ${counts.confirmedLast7Days}
    last 30 days   ${counts.confirmedLast30Days}
`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (error) {
    exitOnD1Error(error);
  }
}
