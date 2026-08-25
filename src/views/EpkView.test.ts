import { describe, expect, it } from 'vitest';

import { epkManifest } from '@/data/epk';
import { mountView } from '@/test-support/viewHarness';
import { resolveEpkContent } from '@/utils/epk';

import EpkView from './EpkView.vue';

const epk = resolveEpkContent(epkManifest);

describe('EpkView', () => {
  it('renders every content section heading', async () => {
    const wrapper = await mountView(EpkView);
    const headings = wrapper.findAll('.epk__heading').map(heading => heading.text());

    expect(headings).toEqual(['Short bio', 'Biography', 'Photography', 'Selected performances', 'Selected works', 'Press']);
  });

  it('lists a row for each resolved live and work highlight', async () => {
    const wrapper = await mountView(EpkView);
    const lists = wrapper.findAll('.epk__list');

    expect(lists[0].findAll('.epk__list-item')).toHaveLength(epk.liveHighlights.length);
    expect(lists[1].findAll('.epk__list-item')).toHaveLength(epk.workHighlights.length);
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
});
