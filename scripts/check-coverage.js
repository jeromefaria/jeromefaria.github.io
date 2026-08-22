#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Floor for the WHOLE instrumented codebase (all of src), not just files a test imports.
const THRESHOLDS = {
  lines: 99,
  statements: 97,
  functions: 96,
  branches: 91,
};

const COVERAGE_SUMMARY_PATH = join(__dirname, '../coverage/coverage-summary.json');

try {
  const coverageData = JSON.parse(readFileSync(COVERAGE_SUMMARY_PATH, 'utf8'));
  const totals = coverageData.total;

  console.log('\n📊 Coverage Summary:');
  console.log('━'.repeat(50));
  console.log(`Lines:      ${totals.lines.pct}% (threshold: ${THRESHOLDS.lines}%)`);
  console.log(`Statements: ${totals.statements.pct}% (threshold: ${THRESHOLDS.statements}%)`);
  console.log(`Functions:  ${totals.functions.pct}% (threshold: ${THRESHOLDS.functions}%)`);
  console.log(`Branches:   ${totals.branches.pct}% (threshold: ${THRESHOLDS.branches}%)`);
  console.log('━'.repeat(50));

  const failures = Object.entries(THRESHOLDS)
    .filter(([metric, threshold]) => totals[metric].pct < threshold)
    .map(([metric, threshold]) => {
      const label = metric.charAt(0).toUpperCase() + metric.slice(1);
      return `${label}: ${totals[metric].pct}% < ${threshold}%`;
    });

  if (failures.length > 0) {
    console.error('\n❌ Coverage thresholds not met:');
    failures.forEach(failure => console.error(`  - ${failure}`));
    console.error('');
    process.exit(1);
  }

  console.log('\n✅ All coverage thresholds met!\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error reading coverage summary:', error.message);
  console.error('Make sure to run tests with coverage first: npm run test:coverage\n');
  process.exit(1);
}
