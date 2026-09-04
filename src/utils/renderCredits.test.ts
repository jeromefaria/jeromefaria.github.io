import { describe, expect, it } from 'vitest';

import { creditsGolden } from '@/data/__fixtures__/credits.golden';
import { plainCreditsGolden } from '@/data/__fixtures__/plainCredits.golden';
import { worksData } from '@/data/works';

import { plainCredits, renderCredits } from './renderCredits';

const creditedReleases = Object.values(worksData)
  .flatMap(section => section.items)
  .filter(release => release.credits);

describe('renderCredits', () => {
  it('pins both goldens for every credited release, with no orphans', () => {
    const ids = creditedReleases.map(release => release.id).sort();

    expect(ids).toEqual(Object.keys(creditsGolden).sort());
    expect(ids).toEqual(Object.keys(plainCreditsGolden).sort());
  });

  it('reproduces every rendered credit line byte-for-byte', () => {
    const rendered: Record<string, string> = {};

    for (const release of creditedReleases) {
      rendered[release.id] = renderCredits(release.credits!, release.contributors);
    }

    expect(rendered).toEqual(creditsGolden);
  });

  it('reproduces every plain (search-index) credit line byte-for-byte', () => {
    const plain: Record<string, string> = {};

    for (const release of creditedReleases) {
      plain[release.id] = plainCredits(release.credits!);
    }

    expect(plain).toEqual(plainCreditsGolden);
  });

  it('links a marked name via its contributor url', () => {
    const credits = renderCredits('Art by [[Lia]].', [{ name: 'Lia', url: 'https://liaworks.com/' }]);

    expect(credits).toBe('Art by <a href="https://liaworks.com/">Lia</a>.');
  });

  it('leaves a marked name plain when no contributor url exists', () => {
    expect(renderCredits('Art by [[Anon]].', [{ name: 'Anon' }])).toBe('Art by Anon.');
  });

  it('strips markers for indexing', () => {
    expect(plainCredits('Art by [[Lia]] and Dextro.')).toBe('Art by Lia and Dextro.');
  });

  it('drops a non-http(s)/mailto url and renders the name plain', () => {
    const credits = renderCredits('Art by [[X]].', [{ name: 'X', url: 'javascript:alert(1)' }]);

    expect(credits).toBe('Art by X.');
    expect(credits).not.toContain('<a');
  });

  it('escapes an attribute-breaking url so it cannot inject markup', () => {
    const credits = renderCredits('Art by [[X]].', [{ name: 'X', url: 'https://x.test/"><img src=x onerror=alert(1)>' }]);

    expect(credits).not.toContain('"><img');
    expect(credits).toContain('&quot;&gt;&lt;img');
  });

  it('escapes markup in the marker name', () => {
    const credits = renderCredits('Art by [[<script>]].', [{ name: '<script>', url: 'https://x.test/' }]);

    expect(credits).toBe('Art by <a href="https://x.test/">&lt;script&gt;</a>.');
  });
});
