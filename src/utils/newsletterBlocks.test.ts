import { describe, expect, it, vi } from 'vitest';

import type { IssueBlock } from '@/data/newsletter/types';

vi.mock('@/data/works', () => ({
  releaseById: new Map<string, unknown>([
    ['music-full', {
      id: 'music-full',
      title: 'Full Music',
      coverImage: '/cover.jpg',
      meta: { kind: 'music', released: '2026-01-15', mediums: ['LP', 'Digital'], editions: [{ label: { text: 'Some Label' }, catalog: 'CAT001' }] },
    }],
    ['music-bare', {
      id: 'music-bare',
      title: 'Bare Music',
      meta: { kind: 'music', released: '2026-02-01', mediums: ['Digital'], editions: [] },
    }],
    ['not-music', {
      id: 'not-music',
      title: 'Not Music',
      coverImage: '/book.jpg',
      meta: { kind: 'book' },
    }],
  ]),
}));

vi.mock('@/data/live', () => ({
  liveEvents: [
    { id: 'cover-image', title: { en: 'Cover Image Show' }, images: [{ cover: false, src: '/img0.jpg' }, { cover: true, src: '/cover-img.jpg' }], date: '2026-03-01', venue: { name: 'Venue A', city: 'City A' } },
    { id: 'first-image', title: { en: 'First Image Show' }, images: [{ cover: false, src: '/first.jpg' }], date: '2026-03-02', venue: { name: 'Venue B', city: 'City B' } },
    { id: 'poster-only', title: { en: 'Poster Show' }, posters: [{ cover: true, src: '/poster.jpg' }], date: '2026-03-03', venue: { name: '', city: '' } },
    { id: 'no-media', title: { en: 'No Media Show' }, date: '2026-03-04', venue: {} },
  ],
}));

vi.mock('@/data/writing', () => ({
  essayBySlug: (slug: string) => ({
    'with-tagline': { title: 'Tagline Essay', slug: 'with-tagline', tagline: 'A tagline' },
    'no-tagline': { title: 'No Tagline Essay', slug: 'no-tagline' },
  }[slug]),
}));

vi.mock('@/i18n/localized', () => ({
  localize: (value: string | { en: string }) => (typeof value === 'string' ? value : value.en),
}));

vi.mock('@/utils/formatters', async importOriginal => {
  const actual = await importOriginal<typeof import('@/utils/formatters')>();
  return { ...actual, formatEventDateRange: () => 'March 2026' };
});

vi.mock('@/utils/embedUrl', () => ({
  isAllowedEmbedUrl: (url: string) => url.includes('allowed'),
}));

vi.mock('@/utils/renderMarkdown', () => ({
  renderMarkdown: (markdown: string) => `<p>${markdown}</p>`,
}));

const { resolveIssueBlocks } = await import('@/utils/newsletterBlocks');

const resolve = (block: IssueBlock) => resolveIssueBlocks([block])[0];

describe('resolveIssueBlocks', () => {
  it('renders prose through the markdown renderer', () => {
    expect(resolve({ type: 'prose', markdown: 'hello' })).toEqual({ kind: 'prose', html: '<p>hello</p>' });
  });

  it('maps an image block with every optional field', () => {
    expect(resolve({ type: 'image', src: '/a.jpg', alt: 'A', label: 'Look', caption: 'Cap', href: 'https://x' }))
      .toEqual({ kind: 'image', src: '/a.jpg', alt: 'A', label: 'Look', caption: 'Cap', href: 'https://x' });
  });

  it('maps a bare image block, nulling the optionals', () => {
    expect(resolve({ type: 'image', src: '/a.jpg', alt: 'A' }))
      .toEqual({ kind: 'image', src: '/a.jpg', alt: 'A', label: null, caption: null, href: null });
  });

  it('keeps an allowed video embed, drops a disallowed one, and tolerates none', () => {
    expect(resolve({ type: 'video', poster: '/p.jpg', alt: 'V', href: 'https://x', embedUrl: 'https://allowed/embed' }))
      .toMatchObject({ kind: 'video', embedUrl: 'https://allowed/embed', label: null, caption: null });
    expect(resolve({ type: 'video', poster: '/p.jpg', alt: 'V', href: 'https://x', embedUrl: 'https://blocked/embed' }))
      .toMatchObject({ embedUrl: null });
    expect(resolve({ type: 'video', poster: '/p.jpg', alt: 'V', href: 'https://x' }))
      .toMatchObject({ embedUrl: null });
  });

  it('builds a full listen feature (cover, all meta fields, note)', () => {
    expect(resolve({ type: 'listen', ref: 'music-full', note: 'Out now.' })).toEqual({
      kind: 'feature',
      label: 'Listen',
      title: 'Full Music',
      url: '/works/music-full',
      image: '/cover.jpg',
      meta: [
        { label: 'Released', value: 'January 2026' },
        { label: 'Format', value: 'LP / Digital' },
        { label: 'Label', value: 'Some Label' },
        { label: 'Catalog', value: 'CAT001' },
      ],
      note: 'Out now.',
      cta: 'Listen',
    });
  });

  it('drops empty label/catalog and the cover/note when a music release lacks them', () => {
    expect(resolve({ type: 'listen', ref: 'music-bare' })).toMatchObject({
      image: null,
      meta: [
        { label: 'Released', value: 'February 2026' },
        { label: 'Format', value: 'Digital' },
      ],
      note: null,
    });
  });

  it('gives a non-music release an empty meta list', () => {
    expect(resolve({ type: 'listen', ref: 'not-music' })).toMatchObject({ title: 'Not Music', image: '/book.jpg', meta: [] });
  });

  it('prefers the flagged cover image for a live feature', () => {
    expect(resolve({ type: 'live', ref: 'cover-image', note: 'In town.' })).toMatchObject({
      label: 'Live',
      title: 'Cover Image Show',
      image: '/cover-img.jpg',
      note: 'In town.',
      cta: 'Details',
    });
  });

  it('falls back to the first image, then a poster, then nothing', () => {
    expect(resolve({ type: 'live', ref: 'first-image' })).toMatchObject({ image: '/first.jpg' });
    expect(resolve({ type: 'live', ref: 'poster-only' })).toMatchObject({ image: '/poster.jpg', meta: [{ label: 'Date', value: 'March 2026' }] });
    expect(resolve({ type: 'live', ref: 'no-media' })).toMatchObject({ image: null, note: null });
  });

  it('uses a writing note when given, else the tagline, else null', () => {
    expect(resolve({ type: 'writing', ref: 'with-tagline', note: 'My note.' })).toMatchObject({ note: 'My note.' });
    expect(resolve({ type: 'writing', ref: 'with-tagline' })).toMatchObject({ note: 'A tagline', label: 'Writing', cta: 'Read' });
    expect(resolve({ type: 'writing', ref: 'no-tagline' })).toMatchObject({ note: null });
  });

  it('drops references that resolve to nothing', () => {
    const blocks: IssueBlock[] = [
      { type: 'listen', ref: 'ghost' },
      { type: 'live', ref: 'ghost' },
      { type: 'writing', ref: 'ghost' },
      { type: 'prose', markdown: 'kept' },
    ];

    expect(resolveIssueBlocks(blocks)).toEqual([{ kind: 'prose', html: '<p>kept</p>' }]);
  });
});
