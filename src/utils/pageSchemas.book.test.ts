import { describe, expect, it, vi } from 'vitest';

// A publications section with no publication release should fail fast rather
// than emit a book schema with empty fields. Isolated so the mock never leaks
// into the real-data suite.
vi.mock('@/data/works', () => ({
  worksData: {
    publications: { title: 'Publications', id: 'publications', items: [] },
  },
}));

import { createWorksPageSchema } from './pageSchemas';

describe('createWorksPageSchema — book guard', () => {
  it('throws when the publications section has no publication release', () => {
    expect(() => createWorksPageSchema()).toThrow('Expected a publication release');
  });
});
