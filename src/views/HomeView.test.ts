import { describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the hero section (background applied via the critical CSS)', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.find('.hero').exists()).toBe(true);
    // The background image is set in the critical CSS, not an inline style, so the
    // media queries can swap resolutions — assert it is NOT inlined here.
    expect(wrapper.get('.hero').attributes('style')).toBeUndefined();
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
