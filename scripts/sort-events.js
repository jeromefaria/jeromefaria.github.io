#!/usr/bin/env node

/**
 * Sort events within each year by date (most recent first)
 * Dates are in ISO format (YYYY-MM-DD) so string comparison works
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../src/data/live.js');

// Read and parse the live data
const content = readFileSync(dataPath, 'utf-8');

// Extract the data object (safe eval for our own file)
const dataMatch = content.match(/export const liveData = (\{[\s\S]*?\n\});/);
if (!dataMatch) {
  console.error('❌ Could not parse liveData');
  process.exit(1);
}

const liveData = eval(`(${dataMatch[1]})`);

// Sort events within each year by date (descending)
let totalEvents = 0;
for (const year in liveData) {
  if (liveData[year].items && Array.isArray(liveData[year].items)) {
    const items = liveData[year].items;
    
    items.sort((a, b) => {
      // ISO dates can be compared as strings
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA); // Descending (most recent first)
    });
    
    console.log(`✓ ${year}: sorted ${items.length} events`);
    totalEvents += items.length;
  }
}

// Stringify the sorted data
const stringifiedData = JSON.stringify(liveData, null, 2)
  // Fix quote style for consistency
  .replace(/"([^"]+)":/g, '$1:')
  // Add single quotes around string values
  .replace(/: "([^"]*)"/g, ": '$1'")
  // Fix arrays
  .replace(/'/g, "'");

// Rebuild file content
const newContent = content.replace(
  /export const liveData = \{[\s\S]*?\n\};/,
  `export const liveData = ${stringifiedData};`
);

writeFileSync(dataPath, newContent, 'utf-8');

console.log(`\n✓ Successfully sorted ${totalEvents} events`);
