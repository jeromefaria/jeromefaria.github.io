import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AwsClient } from 'aws4fetch';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIST = join(REPO_ROOT, 'audio-dist');
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET })
  .filter(([, value]) => !value).map(([key]) => key);
if (missing.length) {
  console.error(`Missing env: ${missing.join(', ')}. Add them to .env and run: node --env-file=.env scripts/upload-audio.mjs [CATALOG...] [--force]`);
  process.exit(1);
}

const aws = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, region: 'auto', service: 's3' });
const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;

const force = process.argv.includes('--force');
const requested = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const catalogs = requested.length
  ? requested
  : readdirSync(AUDIO_DIST).filter(name => statSync(join(AUDIO_DIST, name)).isDirectory() && name !== 'proof');

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

const present = async key => (await aws.fetch(`${endpoint}/${key}`, { method: 'HEAD' })).ok;

let uploaded = 0;
let skipped = 0;

for (const catalog of catalogs) {
  const dir = join(AUDIO_DIST, catalog);
  if (!existsSync(dir)) {
    console.error(`No such catalog in audio-dist: ${catalog}`);
    continue;
  }

  for (const file of walk(dir)) {
    if (!file.endsWith('.m4a')) continue;

    const key = relative(AUDIO_DIST, file);
    if (!force && await present(key)) {
      console.log(`  skip (exists)  ${key}`);
      skipped += 1;
      continue;
    }

    const response = await aws.fetch(`${endpoint}/${key}`, {
      method: 'PUT',
      body: readFileSync(file),
      headers: { 'content-type': 'audio/mp4', 'cache-control': CACHE_CONTROL },
    });
    if (!response.ok) {
      console.error(`Upload failed (${response.status}) for ${key}`);
      process.exit(1);
    }
    console.log(`  ↑ ${key}  (${(statSync(file).size / 1e6).toFixed(1)}MB)`);
    uploaded += 1;
  }
}

console.log(`\nUploaded ${uploaded}, skipped ${skipped} already-present → r2://${R2_BUCKET}`);
