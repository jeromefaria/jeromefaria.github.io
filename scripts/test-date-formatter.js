#!/usr/bin/env node

/**
 * Test the date formatter
 */

import { formatEventDate } from '../src/utils/dateFormatter.js';

const testDates = [
  '2025-06-14',
  '2025-01-17',
  '2024-08-10',
  '2022-07-02',
  '2021-10-23',
  '2015-09-18',
  '2013-11-15',
  '2009-12-04',
  '2008-10-01',
];

console.log('Testing date formatter:\n');
testDates.forEach(isoDate => {
  const formatted = formatEventDate(isoDate);
  console.log(`  ${isoDate} → ${formatted}`);
});
