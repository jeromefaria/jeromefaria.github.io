import { describe, expect, it } from 'vitest';

import { prefixDrift, routeGaps, routePrefixes } from './check-prerendered-routes.mjs';

describe('routePrefixes', () => {
  it('maps each dynamic detail route to its englishOnly flag, ignoring static routes', () => {
    const table = [
      { path: '/works/:id' },
      { path: '/live/:id', meta: { englishOnly: true } },
      { path: '/about' },
    ];

    const prefixes = routePrefixes(table);

    expect([...prefixes]).toEqual([['/works', false], ['/live', true]]);
  });
});

describe('prefixDrift', () => {
  it('reports router prefixes with no source and sources with no router prefix', () => {
    const englishOnlyByPrefix = new Map([['/works', false], ['/live', false]]);
    const sourcePrefixes = new Set(['/works', '/newsletter']);

    expect(prefixDrift(englishOnlyByPrefix, sourcePrefixes)).toEqual({ uncovered: ['/live'], stale: ['/newsletter'] });
  });

  it('is empty when the two agree', () => {
    const englishOnlyByPrefix = new Map([['/works', false]]);

    expect(prefixDrift(englishOnlyByPrefix, new Set(['/works']))).toEqual({ uncovered: [], stale: [] });
  });
});

describe('routeGaps', () => {
  const englishOnlyByPrefix = new Map([['/works', false]]);

  it('passes when every detail page and its /pt mirror is emitted', () => {
    const result = routeGaps({
      sources: [['/works', ['a']]],
      englishOnlyByPrefix,
      emitted: new Set(['/works/a', '/pt/works/a']),
      i18nEnabled: true,
    });

    expect(result).toEqual({ missing: [], orphanedPt: [] });
  });

  it('flags a missing base page and a missing /pt mirror', () => {
    const result = routeGaps({
      sources: [['/works', ['a', 'b']]],
      englishOnlyByPrefix,
      emitted: new Set(['/works/a']),
      i18nEnabled: true,
    });

    expect(result.missing).toEqual(['/pt/works/a', '/works/b', '/pt/works/b']);
    expect(result.orphanedPt).toEqual([]);
  });

  it('expects no /pt mirror for an englishOnly type and flags /pt orphans', () => {
    const result = routeGaps({
      sources: [['/writing', ['essay']]],
      englishOnlyByPrefix: new Map([['/writing', true]]),
      emitted: new Set(['/writing/essay', '/pt/writing/essay']),
      i18nEnabled: true,
    });

    expect(result.missing).toEqual([]);
    expect(result.orphanedPt).toEqual(['/pt/writing/essay']);
  });

  it('checks no /pt mirrors when i18n is disabled', () => {
    const result = routeGaps({
      sources: [['/works', ['a']]],
      englishOnlyByPrefix,
      emitted: new Set(['/works/a']),
      i18nEnabled: false,
    });

    expect(result).toEqual({ missing: [], orphanedPt: [] });
  });
});
