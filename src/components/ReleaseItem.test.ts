import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import type { Release } from '@/types';

import BandcampPlayer from './BandcampPlayer.vue';
import ReleaseItem from './ReleaseItem.vue';

const mountRelease = (release: Release, textOnly = false) =>
  mount(ReleaseItem, { props: { release, textOnly } });

const bandcamp: Release = {
  id: 'overlapse',
  title: 'Overlapse',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2012 },
  bandcampId: '1643026936',
  coverImage: '/images/overlapse.jpg',
  bandcampUrl: 'https://music.jeromefaria.com/album/overlapse',
  tracklist: [{ title: 'Attack' }, { title: 'Sustain' }],
  credits: 'Music by Jerome Faria.',
};

const external: Release = {
  id: 'ect',
  title: 'ECT',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'Test Tube' } }], year: 2005 },
  coverImage: '/images/ect.jpg',
  externalUrl: 'https://example.com/ect',
  tracklist: [{ title: 'Play' }],
  credits: 'Music by Jerome Faria.',
};

const staticCover: Release = {
  id: 'depolarized',
  title: 'Depolarized',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2012 },
  coverImage: '/images/depolarized.jpg',
  credits: 'Music by Jerome Faria and Nelson P. Ferreira.',
};

const textOnlyRelease: Release = {
  id: 'master-open',
  title: 'Open',
  meta: { kind: 'mastering', artist: { name: 'Hugo Calcio' }, editions: [], year: 2021 },
};

describe('ReleaseItem', () => {
  it('renders a Bandcamp player for a release with a bandcampId', () => {
    const wrapper = mountRelease(bandcamp);
    expect(wrapper.findComponent(BandcampPlayer).exists()).toBe(true);
  });

  it('renders an external-link cover for a release with an externalUrl', () => {
    const wrapper = mountRelease(external);
    const cover = wrapper.get('a.release-cover');
    expect(cover.attributes('href')).toBe('https://example.com/ect');
    expect(cover.attributes('target')).toBe('_blank');
    expect(cover.attributes('rel')).toBe('noopener noreferrer');
    expect(cover.find('img').attributes('src')).toBe('/images/ect.jpg');
  });

  it('flags an external cover that links to Bandcamp with a modifier class', () => {
    const bandcampExternal: Release = {
      id: 'bc-ext',
      title: 'BC External',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2020 },
      coverImage: '/images/bc.jpg',
      externalUrl: 'https://artist.bandcamp.com/album/bc-external',
    };
    const wrapper = mountRelease(bandcampExternal);
    expect(wrapper.get('a.release-cover').classes()).toContain('release-cover--bandcamp');
  });

  it('falls back to a text-only layout when the cover image fails to load', async () => {
    const wrapper = mountRelease(external);
    expect(wrapper.find('a.release-cover').exists()).toBe(true);

    await wrapper.get('a.release-cover img').trigger('error');

    expect(wrapper.find('a.release-cover').exists()).toBe(false);
    expect(wrapper.get('article').classes()).toContain('release--text-only');
  });

  it('marks the cover image as loaded once it fires the load event', async () => {
    const wrapper = mountRelease(external);
    const image = wrapper.get('a.release-cover img');
    expect(image.classes()).not.toContain('is-loaded');

    await image.trigger('load');

    expect(wrapper.get('a.release-cover img').classes()).toContain('is-loaded');
  });

  it('renders a static (unlinked) cover when there is no player or link', () => {
    const wrapper = mountRelease(staticCover);
    expect(wrapper.find('.release-cover--static').exists()).toBe(true);
    expect(wrapper.find('a.release-cover').exists()).toBe(false);
  });

  it('renders no cover for a release without an image', () => {
    const wrapper = mountRelease(textOnlyRelease);
    expect(wrapper.find('.release-cover').exists()).toBe(false);
    expect(wrapper.get('.release-title-link').text()).toBe('Open');
  });

  it('emits update-hash when the title permalink is clicked', async () => {
    const wrapper = mountRelease(textOnlyRelease);
    await wrapper.get('.release-title-link').trigger('click');
    expect(wrapper.emitted('update-hash')?.[0]).toEqual(['master-open']);
  });

  it('renders meta, tracklist and credits', () => {
    const wrapper = mountRelease(bandcamp);
    expect(wrapper.get('.release-meta').text()).toContain('BRØQN');
    expect(wrapper.findAll('ol li')).toHaveLength(2);
    expect(wrapper.get('.release-credits').text()).toContain('Jerome Faria');
  });

  it('applies the text-only modifier when requested', () => {
    const wrapper = mountRelease(textOnlyRelease, true);
    expect(wrapper.get('article').classes()).toContain('release--text-only');
  });

  it('shows a play control for a release with audio when the flag is on', async () => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    audioPlayerEnabled.value = true;

    try {
      const wrapper = mountRelease(bandcamp);
      const play = wrapper.find('.release-play');

      expect(play.exists()).toBe(true);
      expect(play.attributes('aria-label')).toContain('Overlapse');
      await play.trigger('click');
    } finally {
      audioPlayerEnabled.value = false;
    }
  });

  it('hides the play control when the flag is off', () => {
    expect(mountRelease(bandcamp).find('.release-play').exists()).toBe(false);
  });

  it('emits open-lightbox with converted images from the gallery button', async () => {
    const publication: Release = {
      id: 'glitch',
      title: 'Glitch',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2009 },
      coverImage: '/images/glitch.jpg',
      externalUrl: 'https://example.com/glitch',
      description: 'A book.',
      credits: 'Editors.',
      images: [
        { src: '/images/publications/glitch-spread-01.jpg', alt: 'Spread 1' },
        { src: '/images/publications/glitch-spread-02.jpg', alt: 'Spread 2' },
      ],
    };
    const wrapper = mountRelease(publication);

    await wrapper.get('.media-links button').trigger('click');
    const payload = wrapper.emitted('open-lightbox')?.[0];

    expect(payload?.[1]).toBe(0);
    expect(payload?.[0]).toHaveLength(2);
    expect((payload?.[0] as Array<{ src: string }>)[0].src).toBe('/images/publications/glitch-spread-01.jpg');
  });

  it('emits open-lightbox with converted videos from the video button', async () => {
    const withVideo: Release = {
      id: 'altar',
      title: 'ALTAR',
      meta: { kind: 'music', mediums: ['Digital', 'Cassette'], editions: [], year: 2024 },
      credits: 'Music by Pedro Roque and Jerome Faria.',
      videos: [
        {
          url: 'https://www.youtube-nocookie.com/embed/3b3pM8URdVc',
          platform: 'youtube',
          title: 'NOx - ALTAR',
          author: { name: 'NOx', url: 'https://www.youtube.com/@noxexposure' },
        },
      ],
    };
    const wrapper = mountRelease(withVideo);
    const button = wrapper.get('.media-links button');
    expect(button.text()).toBe('Video');

    await button.trigger('click');
    const payload = wrapper.emitted('open-lightbox')?.[0];

    expect(payload?.[1]).toBe(0);
    expect(payload?.[0]).toHaveLength(1);
    expect((payload?.[0] as Array<Record<string, unknown>>)[0]).toMatchObject({
      type: 'video',
      url: 'https://www.youtube-nocookie.com/embed/3b3pM8URdVc',
      platform: 'youtube',
      title: 'NOx - ALTAR',
      author: { name: 'NOx', url: 'https://www.youtube.com/@noxexposure' },
    });
  });

  it('pluralizes the video button and separates it from the gallery link', () => {
    const withBoth: Release = {
      id: 'glitch',
      title: 'Glitch',
      meta: { kind: 'music', mediums: ['Digital'], editions: [], year: 2009 },
      coverImage: '/images/glitch.jpg',
      externalUrl: 'https://example.com/glitch',
      description: 'A book.',
      credits: 'Editors.',
      images: [{ src: '/images/publications/glitch-spread-01.jpg', alt: 'Spread 1' }],
      videos: [
        { url: 'https://www.youtube-nocookie.com/embed/a', platform: 'youtube', title: 'One' },
        { url: 'https://player.vimeo.com/video/2', platform: 'vimeo', title: 'Two' },
      ],
    };
    const wrapper = mountRelease(withBoth);
    const buttons = wrapper.findAll('.media-links button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('Gallery');
    expect(buttons[1].text()).toBe('Videos');
    expect(wrapper.get('.media-links').text()).toContain('|');
  });
});
