import { describe, expect, it } from 'vitest';

import { messages, SUPPORTED_LOCALES } from './messages';

const flatten = (object: Record<string, unknown>, prefix = ''): Record<string, string> =>
  Object.entries(object).reduce<Record<string, string>>((accumulator, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      accumulator[path] = value;
    } else {
      Object.assign(accumulator, flatten(value as Record<string, unknown>, path));
    }
    return accumulator;
  }, {});

describe('i18n message catalogs', () => {
  it('every locale defines exactly the same keys (no drift)', () => {
    const reference = Object.keys(flatten(messages.en)).sort();

    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(flatten(messages[locale])).sort(), `locale "${locale}"`).toEqual(reference);
    }
  });

  it('leaves no message blank', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const blanks = Object.entries(flatten(messages[locale]))
        .filter(([, value]) => value.trim() === '')
        .map(([path]) => path);

      expect(blanks, `locale "${locale}"`).toEqual([]);
    }
  });
});
