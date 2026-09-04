import { describe, expect, it } from 'vitest';

import { worksData } from '../works';
import { deriveEngineeringCredits } from './engineeringCredits';

describe('deriveEngineeringCredits', () => {
  it('derives an engineering entry for every release that carries engineering roles', () => {
    const credits = deriveEngineeringCredits(worksData);

    expect(credits.length).toBeGreaterThan(0);
    for (const credit of credits) {
      expect(credit.id).toMatch(/^engineering-/);
      expect(credit.meta.kind).toBe('engineering');
      if (credit.meta.kind === 'engineering') {
        expect(credit.meta.roles.length).toBeGreaterThan(0);
      }
    }
  });

  it('derives from source releases, not from the synthesized engineering entries', () => {
    for (const credit of deriveEngineeringCredits(worksData)) {
      expect(credit.id.startsWith('engineering-engineering-')).toBe(false);
    }
  });
});
