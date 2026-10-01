import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadSrc, root, srcDir } from './data-loader.mjs';

describe('data-loader', () => {
  it('resolves root to the repo root', () => {
    expect(existsSync(join(root, 'package.json'))).toBe(true);
    expect(existsSync(join(root, 'vite.config.ts'))).toBe(true);
  });

  it('points srcDir at root/src', () => {
    expect(srcDir).toBe(join(root, 'src'));
    expect(existsSync(srcDir)).toBe(true);
  });

  it('loadSrc transpiles and imports a real TS module from src', async () => {
    const mod = await loadSrc('data/navigation.ts');
    expect(mod.siteConfig.author.name).toBe('Jerome Faria');
  });

  it('loadSrc resolves the @ alias inside loaded modules', async () => {
    const mod = await loadSrc('utils/newsletterCredit.ts');
    expect(typeof mod.releasePhotoCredit).toBe('function');
  });
});
