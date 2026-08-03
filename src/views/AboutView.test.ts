import { describe, expect, it } from 'vitest';

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
});
