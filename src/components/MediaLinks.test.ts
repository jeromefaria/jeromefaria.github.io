import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { LightboxItem } from '@/types';

import MediaLinks from './MediaLinks.vue';

const image: LightboxItem = { type: 'image', src: '/a.jpg', alt: 'A' };
const video: LightboxItem = { type: 'video', url: 'https://v', title: 'V', platform: 'youtube' };

const mountLinks = (props: Partial<{ images: LightboxItem[]; videos: LightboxItem[]; imageLabel: string }>) =>
  mount(MediaLinks, { props: { images: [], videos: [], imageLabel: 'View gallery', ...props } });

describe('MediaLinks', () => {
  it('renders nothing when there are no images or videos', () => {
    expect(mountLinks({}).find('.media-links').exists()).toBe(false);
  });

  it('shows the image label and emits open-lightbox with the images', async () => {
    const wrapper = mountLinks({ images: [image] });
    const button = wrapper.get('button');

    expect(button.text()).toBe('View gallery');
    await button.trigger('click');

    expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([[image], 0]);
  });

  it('pluralizes the video label and separates the two buttons', () => {
    const buttons = mountLinks({ images: [image], videos: [video, video] }).findAll('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[1].text()).toBe('View videos');
  });

  it('uses the singular video label for a single video', () => {
    expect(mountLinks({ videos: [video] }).get('button').text()).toBe('View video');
  });
});
