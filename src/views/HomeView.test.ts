import { describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the hero with the background image', async () => {
    const wrapper = await mountView(HomeView);
    const hero = wrapper.get('.hero');
    expect(hero.attributes('style')).toContain('/images/performance.jpg');
  });

  it('shows the loading indicator until the hero image loads', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.find('.hero__loading').exists()).toBe(true);
    expect(wrapper.findAll('.hero__loading-dot')).toHaveLength(3);
    expect(wrapper.get('.hero').classes()).not.toContain('hero--loaded');
  });
});
