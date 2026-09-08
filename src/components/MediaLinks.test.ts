import { mount, RouterLinkStub } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { LightboxItem } from '@/types';

import MediaLinks from './MediaLinks.vue';

const image: LightboxItem = { type: 'image', src: '/a.jpg', alt: 'A' };
const poster: LightboxItem = { type: 'image', src: '/poster.jpg', alt: 'Poster' };
const video: LightboxItem = { type: 'video', url: 'https://v', title: 'V', platform: 'youtube' };

const mountLinks = (
  props: Partial<{ images: LightboxItem[]; posters: LightboxItem[]; videos: LightboxItem[]; imageLabel: string; sourceId: string; downloadUrl: string; notesHref: string }>,
) => mount(MediaLinks, {
  props: { images: [], videos: [], imageLabel: 'Gallery', sourceId: 'ev-1', ...props },
  global: { stubs: { RouterLink: RouterLinkStub } },
});

describe('MediaLinks', () => {
  it('renders nothing when there are no images or videos', () => {
    expect(mountLinks({}).find('.media-links').exists()).toBe(false);
  });

  it('shows the image label and emits open-lightbox with the images', async () => {
    const wrapper = mountLinks({ images: [image] });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Gallery');
    await button.trigger('click');

    expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([[image], 0, { id: 'ev-1', kind: 'photo' }]);
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

    expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([[poster, poster], 0, { id: 'ev-1', kind: 'poster' }]);
  });

  it('orders every control alphabetically by label', () => {
    const labels = mountLinks({
      images: [image],
      posters: [poster],
      videos: [video],
      downloadUrl: 'https://jeromefaria.bandcamp.com/album/altar',
      notesHref: '/writing/2504',
    }).findAll('button, a').map(control => control.text());

    expect(labels).toEqual(['Download', 'Gallery', 'Notes', 'Poster', 'Video']);
  });

  it('renders a download link as a new-tab external anchor when a URL is given', () => {
    const link = mountLinks({ downloadUrl: 'https://jeromefaria.bandcamp.com/album/altar' }).get('a');

    expect(link.text()).toBe('Download');
    expect(link.attributes('href')).toBe('https://jeromefaria.bandcamp.com/album/altar');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('places the download link in alphabetical order among the controls', () => {
    const labels = mountLinks({ images: [image], downloadUrl: 'https://jeromefaria.bandcamp.com/album/altar' })
      .findAll('button, a').map(control => control.text());

    expect(labels).toEqual(['Download', 'Gallery']);
  });

  it('renders a Notes link to the essay as an internal RouterLink', () => {
    const link = mountLinks({ notesHref: '/writing/2504' }).findComponent(RouterLinkStub);

    expect(link.text()).toBe('Notes');
    expect(link.props('to')).toBe('/writing/2504');
  });

  it('renders nothing when there are neither media, a download URL, nor notes', () => {
    expect(mountLinks({}).find('.media-links').exists()).toBe(false);
  });
});
