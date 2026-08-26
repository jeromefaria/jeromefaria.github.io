import { describe, expect, it, vi } from 'vitest';

import { epkManifest } from '@/data/epk';
import { mountView } from '@/test-support/viewHarness';
import { resolveEpkContent } from '@/utils/epk';
import { responsiveSrcset } from '@/utils/responsiveImage';

import EpkView from './EpkView.vue';

vi.mock('@/utils/epk', async () => {
  const actual = await vi.importActual<typeof import('@/utils/epk')>('@/utils/epk');

  return { ...actual, resolveEpkContent: vi.fn(actual.resolveEpkContent) };
});

vi.mock('@/utils/responsiveImage', async () => {
  const actual = await vi.importActual<typeof import('@/utils/responsiveImage')>('@/utils/responsiveImage');

  return { ...actual, responsiveSrcset: vi.fn(actual.responsiveSrcset) };
});

const epk = resolveEpkContent(epkManifest);

describe('EpkView', () => {
  it('renders every content section heading', async () => {
    const wrapper = await mountView(EpkView);
    const headings = wrapper.findAll('.epk__heading').map(heading => heading.text());

    expect(headings).toEqual(['Short bio', 'Download', 'Biography', 'Photography', 'Selected performances', 'Selected works', 'Press']);
  });

  it('lists a row for each resolved live and work highlight', async () => {
    const wrapper = await mountView(EpkView);
    const lists = wrapper.findAll('.epk__list');

    expect(lists[0].findAll('.epk__list-item')).toHaveLength(epk.liveHighlights.length);
    expect(lists[1].findAll('.epk__list-item')).toHaveLength(epk.workHighlights.length);
  });

  it('deep-links each performance and work to its Live/Works entry', async () => {
    const wrapper = await mountView(EpkView);
    const lists = wrapper.findAll('.epk__list');

    const liveHrefs = lists[0].findAll('a.epk__link').map(link => link.attributes('href'));
    const workHrefs = lists[1].findAll('a.epk__link').map(link => link.attributes('href'));

    expect(liveHrefs).toEqual(epk.liveHighlights.map(highlight => `/live#${highlight.id}`));
    expect(workHrefs).toEqual(epk.workHighlights.map(work => `/works#${work.id}`));
  });

  it('renders a blockquote per press quote, linking the source only when a url exists', async () => {
    const wrapper = await mountView(EpkView);
    const quotes = wrapper.findAll('.epk__quote');

    expect(quotes).toHaveLength(epk.quotes.length);

    const linked = epk.quotes.find(quote => quote.url);
    const unlinked = epk.quotes.find(quote => !quote.url);
    const sources = quotes.map(quote => quote.get('strong').text());

    if (linked) {
      const anchor = quotes.map(quote => quote.find('strong a')).find(a => a.exists());
      expect(anchor?.attributes('target')).toBe('_blank');
    }
    if (unlinked) {
      expect(sources).toContain(unlinked.source);
    }
  });

  it('credits each photo, linking the photographer when a url exists', async () => {
    const wrapper = await mountView(EpkView);
    const captions = wrapper.findAll('.epk__photo figcaption');

    expect(captions).toHaveLength(epk.photos.filter(photo => photo.photographer).length);

    const withUrl = epk.photos.find(photo => photo.photographer?.url);
    if (withUrl) {
      expect(wrapper.find('.epk__photo figcaption a[target="_blank"]').exists()).toBe(true);
    }
  });

  it('renders a plain credit without a link, and a bare download when a photo has no photographer', async () => {
    vi.mocked(resolveEpkContent).mockReturnValueOnce({
      ...epk,
      photos: [
        { src: '/uncredited.jpg', alt: 'uncredited' },
        { src: '/unlinked.jpg', alt: 'unlinked', photographer: { name: 'No Link' } },
      ],
    });
    vi.mocked(responsiveSrcset).mockImplementation(src => (src === '/uncredited.jpg' ? '/uncredited-320.webp 320w' : null));

    const wrapper = await mountView(EpkView);
    const captions = wrapper.findAll('.epk__photo figcaption');

    expect(wrapper.find('.epk__photo source[type="image/webp"]').attributes('srcset')).toBe('/uncredited-320.webp 320w');

    expect(captions[0].text()).not.toContain('Photo:');
    expect(captions[0].find('a[download]').exists()).toBe(true);

    expect(captions[1].find('a[target="_blank"]').exists()).toBe(false);
    expect(captions[1].text()).toContain('No Link');
  });
});
