import { describe, expect, it, vi } from 'vitest';

// Isolated in its own file so this vi.mock doesn't replace real data in the main schema suite.
vi.mock('@/data/works', () => ({
  worksData: {
    publications: { title: 'Publications', id: 'publications', items: [] },
  },
}));

import { createWorksPageSchema } from './worksSchema';

describe('createWorksPageSchema — book guard', () => {
  it('throws when the publications section has no publication release', () => {
    expect(() => createWorksPageSchema()).toThrow('Expected a publication release');
  });
});
