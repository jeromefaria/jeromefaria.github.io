import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/people', () => ({
  resolveCredit: (ref: string) => ({ name: `Person ${ref}`, url: `https://people/${ref}` }),
  creditUrl: (credit: { url?: string }) => credit.url,
  personUrl: (name: string) => (name === 'Known' ? 'https://known.example' : undefined),
}));

vi.mock('@/utils/orgs', () => ({
  orgUrl: (name: string) => (name === 'Org' ? 'https://org.example' : undefined),
}));

const { releasePhotoCredit, eventPhotoCredit } = await import('@/utils/newsletterCredit');

describe('releasePhotoCredit', () => {
  it('returns null for missing or unstructured credits', () => {
    expect(releasePhotoCredit(undefined)).toBeNull();
    expect(releasePhotoCredit('Some free-text credit')).toBeNull();
  });

  it('returns null when there is no photography clause', () => {
    expect(releasePhotoCredit({ style: 'by', clauses: [{ role: 'music', of: 'Someone' }] })).toBeNull();
  });

  it('resolves the photography clause, linking markers and known names', () => {
    const credit = releasePhotoCredit({ style: 'by', clauses: [{ role: 'photography', of: '[[Known]], NASA, [[Org]]' }] });

    expect(credit).toEqual({
      prefix: 'Photo by',
      html: '<a href="https://known.example">Known</a>, NASA, <a href="https://org.example">Org</a>',
    });
  });
});

describe('eventPhotoCredit', () => {
  it('credits the cover image photographer when the cover is the hero', () => {
    expect(eventPhotoCredit({ src: '/cover.jpg', photographer: 'nuno' }, undefined)).toEqual({
      prefix: 'Photo by',
      html: '<a href="https://people/nuno">Person nuno</a>',
    });
  });

  it('credits the poster artist when there is no cover image', () => {
    expect(eventPhotoCredit(undefined, { src: '/poster.jpg', alt: 'x', artist: { name: 'Fest' } })).toEqual({
      prefix: 'Poster by',
      html: 'Fest',
    });
  });

  it('does not credit a poster when a cover image without a photographer is the hero', () => {
    expect(eventPhotoCredit({ src: '/cover.jpg' }, { src: '/poster.jpg', alt: 'x', artist: { name: 'Fest' } })).toBeNull();
  });

  it('returns null when there is neither a photographer nor an artist', () => {
    expect(eventPhotoCredit(undefined, undefined)).toBeNull();
  });
});
