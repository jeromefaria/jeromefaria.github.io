import { describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders the hero section (background applied via the critical CSS)', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.find('.hero').exists()).toBe(true);
    expect(wrapper.get('.hero').attributes('style')).toBeUndefined();
  });

  it('paints the hero immediately — no JS reveal gate or loader', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.get('.hero').classes()).not.toContain('hero--loaded');
    expect(wrapper.find('.hero__loading').exists()).toBe(false);
  });

  it('has a visually-hidden page heading', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.get('h1.visually-hidden').text()).toContain('Jerome Faria');
  });
});
