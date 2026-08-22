import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { LightboxItem } from '@/types';

import MediaLinks from './MediaLinks.vue';

const image: LightboxItem = { type: 'image', src: '/a.jpg', alt: 'A' };
const poster: LightboxItem = { type: 'image', src: '/poster.jpg', alt: 'Poster' };
const video: LightboxItem = { type: 'video', url: 'https://v', title: 'V', platform: 'youtube' };

const mountLinks = (
  props: Partial<{ images: LightboxItem[]; posters: LightboxItem[]; videos: LightboxItem[]; imageLabel: string }>,
) => mount(MediaLinks, { props: { images: [], videos: [], imageLabel: 'Gallery', ...props } });

describe('MediaLinks', () => {
  it('renders nothing when there are no images or videos', () => {
    expect(mountLinks({}).find('.media-links').exists()).toBe(false);
  });

  it('shows the image label and emits open-lightbox with the images', async () => {
    const wrapper = mountLinks({ images: [image] });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Gallery');
    await button.trigger('click');

    expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([[image], 0]);
  });

  it('gives each terse label a descriptive "View …" aria-label for assistive tech', () => {
    const button = mountLinks({ images: [image] }).get('button');

    expect(button.text()).toBe('Gallery');
    expect(button.attributes('aria-label')).toBe('View gallery');
  });

  it('pluralizes the video label and separates the two buttons', () => {
    const buttons = mountLinks({ images: [image], videos: [video, video] }).findAll('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[1].text()).toBe('Videos');
  });

  it('uses the singular video label for a single video', () => {
    expect(mountLinks({ videos: [video] }).get('button').text()).toBe('Video');
  });

  it('labels and pluralises the poster control and emits its items', async () => {
    const wrapper = mountLinks({ posters: [poster, poster] });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Posters');
    await button.trigger('click');

    expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([[poster, poster], 0]);
  });

  it('orders the controls images, posters, then videos', () => {
    const buttons = mountLinks({ images: [image], posters: [poster], videos: [video] }).findAll('button');

    expect(buttons.map(button => button.text())).toEqual(['Gallery', 'Poster', 'Video']);
  });
});
