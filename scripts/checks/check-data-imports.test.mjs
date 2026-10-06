import { describe, expect, it } from 'vitest';

import { scanImports } from './check-data-imports.mjs';

describe('scanImports', () => {
  it('flags an @-alias value import', () => {
    expect(scanImports("import { stripHtml } from '@/utils/stripHtml';")[0])
      .toMatchObject({ isTypeOnly: false, specifier: '@/utils/stripHtml' });
  });

  it('treats a top-level `import type` as type-only', () => {
    expect(scanImports("import type { X } from '@/types/x';")[0]).toMatchObject({ isTypeOnly: true, specifier: '@/types/x' });
  });

  it('detects a value re-export so it cannot slip past as a false negative', () => {
    expect(scanImports("export { x } from '@/utils/x';")[0]).toMatchObject({ isTypeOnly: false, specifier: '@/utils/x' });
  });

  it('treats a `export type … from` re-export as type-only', () => {
    expect(scanImports("export type { X } from '@/types/x';")[0]).toMatchObject({ isTypeOnly: true });
  });

  it('matches a relative re-export so the graph walk follows it', () => {
    expect(scanImports("export * from './solo';")[0]).toMatchObject({ isTypeOnly: false, specifier: './solo' });
  });

  it('matches a side-effect import', () => {
    expect(scanImports("import '@/styles/x.css';")[0]).toMatchObject({ isTypeOnly: false, specifier: '@/styles/x.css' });
  });

  it('ignores the word import inside a comment', () => {
    expect(scanImports("// you can import from '@/foo'\nexport const x = 1;")).toEqual([]);
  });

  it('ignores a path-like string that is not an import', () => {
    expect(scanImports("export const href = 'https://x.test/@/y';")).toEqual([]);
  });

  it('handles a multiline import and reports its starting line', () => {
    expect(scanImports('const a = 1;\nimport {\n  b,\n} from \'@/utils/b\';')[0])
      .toMatchObject({ isTypeOnly: false, specifier: '@/utils/b', line: 2 });
  });

  it('reports the line number from the statement start', () => {
    expect(scanImports("\n\nimport x from './x';")[0].line).toBe(3);
  });
});
