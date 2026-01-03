#!/usr/bin/env node

/**
 * Coverage threshold checker for CI
 * Reads coverage summary and fails if thresholds are not met
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Coverage thresholds
const THRESHOLDS = {
  lines: 95,
  statements: 95,
  functions: 90,
  branches: 85,
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

  const failures = [];

  if (totals.lines.pct < THRESHOLDS.lines) {
    failures.push(`Lines: ${totals.lines.pct}% < ${THRESHOLDS.lines}%`);
  }

  if (totals.statements.pct < THRESHOLDS.statements) {
    failures.push(`Statements: ${totals.statements.pct}% < ${THRESHOLDS.statements}%`);
  }

  if (totals.functions.pct < THRESHOLDS.functions) {
    failures.push(`Functions: ${totals.functions.pct}% < ${THRESHOLDS.functions}%`);
  }

  if (totals.branches.pct < THRESHOLDS.branches) {
    failures.push(`Branches: ${totals.branches.pct}% < ${THRESHOLDS.branches}%`);
  }

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
