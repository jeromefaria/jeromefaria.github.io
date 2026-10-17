import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { distRoute, walkFiles } from './walk.mjs';

describe('walkFiles', () => {
  let dir;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'walk-'));
    mkdirSync(join(dir, 'nested', 'deep'), { recursive: true });
    writeFileSync(join(dir, 'a.html'), '');
    writeFileSync(join(dir, 'b.txt'), '');
    writeFileSync(join(dir, 'nested', 'c.html'), '');
    writeFileSync(join(dir, 'nested', 'deep', 'd.ts'), '');
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('yields every file across all depths', () => {
    const found = [...walkFiles(dir)].map(file => file.slice(dir.length + 1)).sort();
    expect(found).toEqual(['a.html', 'b.txt', join('nested', 'c.html'), join('nested', 'deep', 'd.ts')].sort());
  });

  it('yields only files, never a directory, at any depth', () => {
    expect([...walkFiles(dir)].every(file => statSync(file).isFile())).toBe(true);
  });
});

describe('distRoute', () => {
  const DIST = '/project/dist';

  it('maps index.html to a trailing-slash directory route', () => {
    expect(distRoute('/project/dist/works/index.html', DIST)).toBe('/works/');
  });

  it('strips a .html leaf extension', () => {
    expect(distRoute('/project/dist/about.html', DIST)).toBe('/about');
  });

  it('maps the root index to /', () => {
    expect(distRoute('/project/dist/index.html', DIST)).toBe('/');
  });

  it('normalizes Windows separators to forward slashes', () => {
    expect(distRoute('/project/dist/pt\\works\\index.html', DIST)).toBe('/pt/works/');
  });
});
