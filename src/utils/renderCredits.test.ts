import { describe, expect, it } from 'vitest';

import { creditsGolden } from '@/data/__fixtures__/credits.golden';
import { worksData } from '@/data/works';

import { plainCredits, renderCredits } from './renderCredits';

const releasesById = new Map(
  Object.values(worksData)
    .flatMap(section => section.items)
    .map(release => [release.id, release]),
);

describe('renderCredits', () => {
  it('reproduces every original credit line byte-for-byte', () => {
    const rendered: Record<string, string> = {};

    for (const id of Object.keys(creditsGolden)) {
      const release = releasesById.get(id);
      if (!release?.credits) throw new Error(`no credits for ${id}`);

      rendered[id] = renderCredits(release.credits, release.contributors);
    }

    expect(rendered).toEqual(creditsGolden);
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

    // No attribute breakout — the quote/brackets are escaped, so the payload stays inert text inside href.
    expect(credits).not.toContain('"><img');
    expect(credits).toContain('&quot;&gt;&lt;img');
  });

  it('escapes markup in the marker name', () => {
    const credits = renderCredits('Art by [[<script>]].', [{ name: '<script>', url: 'https://x.test/' }]);

    expect(credits).toBe('Art by <a href="https://x.test/">&lt;script&gt;</a>.');
  });
});
