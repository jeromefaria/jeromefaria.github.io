import { describe, expect, it } from 'vitest';

import { pressQuotes } from '@/data/press';
import { mountView } from '@/test-support/viewHarness';

import PressView from './PressView.vue';

describe('PressView', () => {
  it('renders a blockquote for every press quote, keyed by id', async () => {
    const wrapper = await mountView(PressView);
    const quotes = wrapper.findAll('blockquote');
    expect(quotes).toHaveLength(pressQuotes.length);
    pressQuotes.forEach(quote => {
      expect(wrapper.find(`#${quote.id}`).exists()).toBe(true);
    });
  });

  it('links the source when a quote has a url, and shows plain text otherwise', async () => {
    const wrapper = await mountView(PressView);

    const withUrl = pressQuotes.find(quote => quote.url);
    const withoutUrl = pressQuotes.find(quote => !quote.url);

    if (withUrl) {
      const link = wrapper.get(`#${withUrl.id} strong a`);
      expect(link.attributes('href')).toBe(withUrl.url);
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    }
    if (withoutUrl) {
      expect(wrapper.find(`#${withoutUrl.id} strong a`).exists()).toBe(false);
    }
  });
});
