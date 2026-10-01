import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadData, loadSrc, root, srcDir } from './data-loader.mjs';

describe('data-loader', () => {
  it('resolves root to the repo root', () => {
    expect(existsSync(join(root, 'package.json'))).toBe(true);
    expect(existsSync(join(root, 'vite.config.ts'))).toBe(true);
  });

  it('points srcDir at root/src', () => {
    expect(srcDir).toBe(join(root, 'src'));
    expect(existsSync(srcDir)).toBe(true);
  });

  it('loadSrc transpiles a TS module and resolves its @ alias import', async () => {
    const mod = await loadSrc('test-support/dataLoaderFixture.ts');
    expect(mod.fixtureValue).toBe(42);
    expect(mod.aliasResolved).toBe('resolved-via-alias');
  });

  it('loadData imports relative to the repo root', async () => {
    const mod = await loadData('src/test-support/dataLoaderFixture.ts');
    expect(mod.fixtureValue).toBe(42);
  });
});
