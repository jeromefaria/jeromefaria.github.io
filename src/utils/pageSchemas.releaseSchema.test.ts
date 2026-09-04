import { describe, expect, it } from 'vitest';

import { worksData } from '@/data/works';
import { hasBandcampId, hasBandcampUrl } from '@/types';

import { createReleaseSchema } from './worksSchema';

const PAGE = 'https://jeromefaria.com/works/example';
const releases = Object.values(worksData).flatMap(section => section.items);

describe('createReleaseSchema', () => {
  it('maps a Bandcamp release to a standalone MusicAlbum bound to the page', () => {
    const album = releases.find(release => hasBandcampId(release) || hasBandcampUrl(release));
    expect(album).toBeDefined();

    const schema = createReleaseSchema(album!, 'en', PAGE);

    expect(schema['@type']).toBe('MusicAlbum');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('mainEntityOfPage', PAGE);
  });

  it('maps the publication to a standalone Book bound to the page', () => {
    const publication = releases.find(release => release.meta.kind === 'publication');
    expect(publication).toBeDefined();

    const schema = createReleaseSchema(publication!, 'en', PAGE);

    expect(schema['@type']).toBe('Book');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('mainEntityOfPage', PAGE);
  });

  it('falls back to a CreativeWork for a non-album, non-publication release', () => {
    const work = releases.find(
      release => release.meta.kind !== 'publication' && !hasBandcampId(release) && !hasBandcampUrl(release),
    );
    expect(work).toBeDefined();

    const schema = createReleaseSchema(work!, 'en', PAGE);

    expect(schema['@type']).toBe('CreativeWork');
    expect(schema).toHaveProperty('mainEntityOfPage', PAGE);
    expect(schema).toHaveProperty('creator', { '@type': 'Person', name: expect.any(String) });
    expect(schema).toHaveProperty('dateCreated', expect.any(String));
  });
});
