#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createJiti } from 'jiti';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(import.meta.url, { alias: { '@': resolve(root, 'src') } });

const { epkManifest } = await jiti.import(resolve(root, 'src/data/epk.ts'));

const missing = epkManifest.photos.map(photo => photo.src).filter(src => !existsSync(join(root, 'public', src)));

console.log('\n🖼️  EPK Photo Source Check:');
console.log('━'.repeat(50));
console.log(`Checked ${epkManifest.photos.length} photo sources against public/.`);
console.log('━'.repeat(50));

if (missing.length > 0) {
  console.error(`\n❌ ${missing.length} EPK photo source(s) missing from public/:`);
  missing.forEach(src => console.error(`  - ${src}`));
  console.error('');
  process.exit(1);
}

console.log('\n✅ All EPK photo sources present!\n');
process.exit(0);
