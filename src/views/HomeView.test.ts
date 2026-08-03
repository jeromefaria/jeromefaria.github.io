import { afterEach, describe, expect, it } from 'vitest';

import { mountView } from '@/test-support/viewHarness';

import HomeView from './HomeView.vue';

interface FakeImage { onload: (() => void) | null; onerror: (() => void) | null }

const created: FakeImage[] = [];
const OriginalImage = window.Image;

class MockImage implements FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) { /* no-op: load is driven manually in tests */ }
  constructor() {
    created.push(this);
  }
}

describe('HomeView', () => {
  afterEach(() => {
    window.Image = OriginalImage;
    created.length = 0;
  });

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

  it('reveals the hero once the image loads', async () => {
    window.Image = MockImage as unknown as typeof Image;
    const wrapper = await mountView(HomeView);

    created[0]?.onload?.();
    await wrapper.vm.$nextTick();

    expect(wrapper.get('.hero').classes()).toContain('hero--loaded');
    expect(wrapper.find('.hero__loading').exists()).toBe(false);
  });

  it('reveals the hero even if the image fails, so the loader never hangs', async () => {
    window.Image = MockImage as unknown as typeof Image;
    const wrapper = await mountView(HomeView);

    created[0]?.onerror?.();
    await wrapper.vm.$nextTick();

    expect(wrapper.get('.hero').classes()).toContain('hero--loaded');
  });

  it('has a visually-hidden page heading', async () => {
    const wrapper = await mountView(HomeView);
    expect(wrapper.get('h1.visually-hidden').text()).toContain('Jerome Faria');
  });
});
