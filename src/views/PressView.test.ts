import { createHead } from '@unhead/vue/client';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { pressQuotes } from '@/data/press';
import { mountView } from '@/test-support/viewHarness';

import PressView from './PressView.vue';

describe('PressView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountAndScrollToFirstQuote = async (): Promise<ReturnType<typeof vi.spyOn>> => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
    });
    await router.push('/');
    await router.isReady();
    mount(PressView, { global: { plugins: [router, createHead()] }, attachTo: document.body });
    await nextTick();

    await router.push({ hash: `#${pressQuotes[0].id}` });
    await nextTick();

    return scrollIntoView;
  };

  it('smooth-scrolls the targeted quote into view when the hash changes', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    const scrollIntoView = await mountAndScrollToFirstQuote();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('jumps without animation when reduced motion is preferred', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

    const scrollIntoView = await mountAndScrollToFirstQuote();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('renders a blockquote for every press quote, keyed by id', async () => {
    const wrapper = await mountView(PressView);
    const quotes = wrapper.findAll('blockquote');
    expect(quotes).toHaveLength(pressQuotes.length);
    pressQuotes.forEach(quote => {
      expect(wrapper.find(`#${quote.id}`).exists()).toBe(true);
    });
  });

  it('renders Portuguese quotes on a pt route', async () => {
    const wrapper = await mountView(PressView, '/pt/press', { locale: 'pt' });
    expect(wrapper.text()).toContain('Um som quase romântico que evoca');
    expect(wrapper.text()).not.toContain('An almost romantic sound that recalls');
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
