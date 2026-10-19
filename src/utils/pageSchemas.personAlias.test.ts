import { describe, expect, it, vi } from 'vitest';

vi.mock('@/data/navigation', () => ({
  siteConfig: {
    title: 'Test Site',
    tagline: { en: 'Tagline', pt: 'Legenda' },
    description: { en: 'Description', pt: 'Descrição' },
    url: 'https://example.com',
    image: '/image.jpg',
    author: { name: 'Test Author', email: 'author@example.com', bio: 'Bio' },
  },
  social: [{ name: 'bandcamp', url: 'https://example.bandcamp.com' }],
}));

import { createPersonSchema } from './pageSchemas';

describe('createPersonSchema without an alias or Discogs artist page', () => {
  it('omits alternateName and keeps sameAs to the social links alone', () => {
    const schema = createPersonSchema();

    expect(schema).not.toHaveProperty('alternateName');
    expect(schema.sameAs).toEqual(['https://example.bandcamp.com']);
  });
});
