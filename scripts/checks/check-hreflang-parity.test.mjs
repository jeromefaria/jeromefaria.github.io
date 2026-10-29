import { describe, expect, it } from 'vitest';

import { alternateLinks, altKey, attr, canonicalOf, compareParity, joinKey, parseSitemapAlternates } from './check-hreflang-parity.mjs';

const PAGE = `<head>
<link rel="canonical" href="https://jeromefaria.com/live/x/">
<link rel="alternate" hreflang="en" href="https://jeromefaria.com/live/x">
<link rel="alternate" hreflang="pt" href="https://jeromefaria.com/pt/live/x">
<link rel="stylesheet" href="/style.css">
</head>`;

const SITEMAP = `<urlset>
<url><loc>https://jeromefaria.com/live/x/</loc>
<xhtml:link rel="alternate" hreflang="en" href="https://jeromefaria.com/live/x"/>
<xhtml:link rel="alternate" hreflang="pt" href="https://jeromefaria.com/pt/live/x"/>
</url>
</urlset>`;

describe('attr / altKey / joinKey', () => {
  it('reads a named attribute or null when absent', () => {
    expect(attr('<link hreflang="pt" href="/pt/x">', 'hreflang')).toBe('pt');
    expect(attr('<link href="/x">', 'hreflang')).toBeNull();
  });

  it('builds the comparison key and normalises trailing slashes', () => {
    expect(altKey('pt', '/pt/x')).toBe('pt /pt/x');
    expect(joinKey('https://x/a/')).toBe('https://x/a');
    expect(joinKey('/')).toBe('/');
  });
});

describe('alternateLinks / canonicalOf', () => {
  it('extracts only the alternate hreflang links, skipping other rels', () => {
    expect(alternateLinks(PAGE)).toEqual([
      { hreflang: 'en', href: 'https://jeromefaria.com/live/x' },
      { hreflang: 'pt', href: 'https://jeromefaria.com/pt/live/x' },
    ]);
  });

  it('reads the canonical href, or null when there is none', () => {
    expect(canonicalOf(PAGE)).toBe('https://jeromefaria.com/live/x/');
    expect(canonicalOf('<head></head>')).toBeNull();
  });
});

describe('parseSitemapAlternates', () => {
  it('maps each loc (slash-normalised) to its set of alternate keys', () => {
    const parsed = parseSitemapAlternates(SITEMAP);

    expect([...parsed.keys()]).toEqual(['https://jeromefaria.com/live/x']);
    expect([...parsed.get('https://jeromefaria.com/live/x')]).toEqual([
      'en https://jeromefaria.com/live/x',
      'pt https://jeromefaria.com/pt/live/x',
    ]);
  });

  it('skips a url block that has no loc', () => {
    expect(parseSitemapAlternates('<urlset><url><priority>0.5</priority></url></urlset>').size).toBe(0);
  });
});

describe('compareParity', () => {
  const page = new Map([['/a', new Set(['en /a', 'pt /pt/a'])]]);

  it('agrees when the page and sitemap alternates match', () => {
    const sitemap = new Map([['/a', new Set(['en /a', 'pt /pt/a'])]]);

    expect(compareParity(page, sitemap)).toEqual({ matched: 1, violations: [], vacuous: false });
  });

  it('reports alternates present on only one side', () => {
    const sitemap = new Map([['/a', new Set(['en /a'])]]);
    const { violations } = compareParity(page, sitemap);

    expect(violations).toEqual([{ loc: '/a', onlyInPage: ['pt /pt/a'], onlyInSitemap: [] }]);
  });

  it('flags a vacuous pass when no sitemap URL matches a rendered page', () => {
    const sitemap = new Map([['/unmatched', new Set(['en /unmatched'])]]);

    expect(compareParity(new Map(), sitemap)).toEqual({ matched: 0, violations: [], vacuous: true });
  });
});
