import { describe, expect, it } from 'vitest';

import { localePath, localizeInternalLinks, messages, stripLocale, SUPPORTED_LOCALES } from './messages';

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

describe('localePath', () => {
  it('leaves en paths unchanged', () => {
    expect(localePath('/about', 'en')).toBe('/about');
    expect(localePath('/', 'en')).toBe('/');
  });

  it('prefixes pt paths, mapping the root to /pt', () => {
    expect(localePath('/about', 'pt')).toBe('/pt/about');
    expect(localePath('/', 'pt')).toBe('/pt');
  });
});

describe('stripLocale', () => {
  it('leaves en paths unchanged', () => {
    expect(stripLocale('/about')).toBe('/about');
    expect(stripLocale('/')).toBe('/');
  });

  it('drops the /pt prefix, mapping /pt to the root', () => {
    expect(stripLocale('/pt/about')).toBe('/about');
    expect(stripLocale('/pt')).toBe('/');
  });

  it('does not strip paths that merely start with the pt letters', () => {
    expect(stripLocale('/ptolemy')).toBe('/ptolemy');
  });
});

describe('localizeInternalLinks', () => {
  it('leaves markup untouched for the default locale', () => {
    expect(localizeInternalLinks('<a href="/works">x</a>', 'en')).toBe('<a href="/works">x</a>');
  });

  it('prefixes internal hrefs under pt but leaves external and anchor links alone', () => {
    const html = '<a href="/works#nny">A</a> <a href="https://x.com">B</a> <a href="#top">C</a>';
    expect(localizeInternalLinks(html, 'pt')).toBe('<a href="/pt/works#nny">A</a> <a href="https://x.com">B</a> <a href="#top">C</a>');
  });
});
