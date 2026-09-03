import { describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the hero with the background image', async () => {
    const wrapper = await mountView(HomeView);
    const hero = wrapper.get('.hero');
    expect(hero.attributes('style')).toContain('/images/performance.webp');
  });

  it('paints the hero immediately — no JS reveal gate or loader', async () => {
    const wrapper = await mountView(HomeView);
    // The hero is the preloaded LCP element; it must not be hidden behind a
    // loaded-class gate or a JS-driven loader (that defeats the preload).
    expect(wrapper.get('.hero').classes()).not.toContain('hero--loaded');
    expect(wrapper.find('.hero__loading').exists()).toBe(false);
  });

  it('has a visually-hidden page heading', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.get('h1.visually-hidden').text()).toContain('Jerome Faria');
  });
});
