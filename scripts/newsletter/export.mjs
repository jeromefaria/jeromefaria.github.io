import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { root } from '../data-loader.mjs';
import { d1Query, exitOnD1Error } from './d1.mjs';

const COLUMNS = ['email', 'status', 'created_at', 'confirmed_at', 'unsubscribed_at'];

const csvField = value => `"${String(value ?? '').replace(/"/g, '""')}"`;

const toCsv = rows =>
  [COLUMNS.join(','), ...rows.map(row => COLUMNS.map(column => csvField(row[column])).join(','))].join('\n');

const run = () => {
  const rows = d1Query(`SELECT ${COLUMNS.join(', ')} FROM subscribers ORDER BY created_at`);
  const file = join(root, `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);

  writeFileSync(file, `${toCsv(rows)}\n`);

  console.log(`\n  Exported ${rows.length} subscriber(s) → ${file}\n`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (error) {
    exitOnD1Error(error);
  }
}
