import { describe, expect, it } from 'vitest';

import { danglingReferences, DEFINITION_PATTERN, extractNames, REFERENCE_PATTERN } from './check-custom-properties.mjs';

describe('extractNames', () => {
  it('pulls every custom-property definition name', () => {
    const scss = ':root {\n  --color-bg: #fff;\n  --space-2: 8px;\n}';

    expect(extractNames(scss, DEFINITION_PATTERN)).toEqual(['color-bg', 'space-2']);
  });

  it('pulls referenced names from var() usages, allowing inner whitespace', () => {
    const scss = 'color: var(--color-text); margin: var( --space-2 );';

    expect(extractNames(scss, REFERENCE_PATTERN)).toEqual(['color-text', 'space-2']);
  });

  it('does not mistake a var() reference for a definition', () => {
    expect(extractNames('color: var(--color-text);', DEFINITION_PATTERN)).toEqual([]);
  });
});

describe('danglingReferences', () => {
  it('returns references whose name has no definition', () => {
    const defined = new Set(['color-bg']);
    const references = new Map([['color-bg', 'a.scss'], ['color-ghost', 'b.vue']]);

    expect(danglingReferences(defined, references)).toEqual([['color-ghost', 'b.vue']]);
  });

  it('is empty when every reference is defined', () => {
    const defined = new Set(['color-bg']);
    const references = new Map([['color-bg', 'a.scss']]);

    expect(danglingReferences(defined, references)).toEqual([]);
  });
});
