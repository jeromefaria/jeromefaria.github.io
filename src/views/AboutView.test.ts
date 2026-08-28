import { describe, expect, it } from 'vitest';

import LightboxOverlay from '@/components/LightboxOverlay.vue';
import { aboutSections } from '@/data/about';
import { mountView } from '@/test-support/viewHarness';

import AboutView from './AboutView.vue';

describe('AboutView', () => {
  it('renders the short bio and the prose sections', async () => {
    const wrapper = await mountView(AboutView, '/about');
    expect(wrapper.find('.short-bio').exists()).toBe(true);

    const proseCount = aboutSections.filter(section => !('type' in section) || !section.type).length;
    expect(wrapper.findAll('.prose')).toHaveLength(proseCount);
  });

  it('renders a figure for every image across the image groups', async () => {
    const wrapper = await mountView(AboutView, '/about');

    const groups = aboutSections.filter((section): section is typeof section & { images: unknown[] } =>
      'type' in section && section.type === 'image-group' && Array.isArray((section as { images?: unknown[] }).images));
    const groupCount = groups.length;
    const imageCount = groups.reduce((sum, group) => sum + group.images.length, 0);

    expect(wrapper.findAll('.about-image-group')).toHaveLength(groupCount);
    expect(wrapper.findAll('.about-image-group__image')).toHaveLength(imageCount);
  });

  it('opens the lightbox when an image-group figure is clicked', async () => {
    const wrapper = await mountView(AboutView, '/about');
    await wrapper.get('.about-image-group__image').trigger('click');
    expect(wrapper.find('.lightbox').exists()).toBe(true);
  });

  it('opens the lightbox at the global index of a figure in a later group', async () => {
    const wrapper = await mountView(AboutView, '/about');
    const figures = wrapper.findAll('.about-image-group__image');
    // Figure 4 lives in the second image group, so its global index only
    // resolves correctly if the per-section start offset is applied.
    const targetIndex = 4;
    const figure = figures[targetIndex];
    const expectedSrc = figure.get('img').attributes('src');

    await figure.trigger('click');

    const lightbox = wrapper.getComponent(LightboxOverlay);
    expect(lightbox.props('currentIndex')).toBe(targetIndex);
    expect(lightbox.props('currentItem')).toMatchObject({ type: 'image', src: expectedSrc });
  });

  it('routes internal prose links through the router instead of reloading', async () => {
    const wrapper = await mountView(AboutView, '/about');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    wrapper.get('.prose a[href^="/"]').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
