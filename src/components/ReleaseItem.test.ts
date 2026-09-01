import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { getMediaElement, stop } from '@/composables/usePlayer';
import type { Release } from '@/types';

import BandcampPlayer from './BandcampPlayer.vue';
import PlayableCover from './PlayableCover.vue';
import ReleaseItem from './ReleaseItem.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
});

const mountRelease = (release: Release, textOnly = false) =>
  mount(ReleaseItem, { props: { release, textOnly }, global: { plugins: [router] } });

const bandcamp: Release = {
  id: 'bandcamp-only',
  title: 'ALTAR',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2012 },
  bandcampId: '1643026936',
  coverImage: '/images/altar.jpg',
  bandcampUrl: 'https://music.jeromefaria.com/album/altar',
  tracklist: [{ title: 'Attack' }, { title: 'Sustain' }],
  credits: 'Music by Jerome Faria.',
};

const audioBacked: Release = {
  id: 'overlapse',
  title: 'Overlapse',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2012 },
  bandcampId: '1643026936',
  coverImage: '/images/overlapse.jpg',
  bandcampUrl: 'https://music.jeromefaria.com/album/overlapse',
  soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/overlapse',
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

const chaptered: Release = {
  id: '2504',
  title: '2504',
  meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2024 },
  coverImage: '/images/2504.jpg',
  bandcampUrl: 'https://music.jeromefaria.com/album/2504',
  soundcloudUrl: 'https://soundcloud.com/jeromefaria/sets/april-25',
  tracklist: [
    { title: 'Prólogo', start: 0 },
    { title: 'Fado', start: 212 },
    { title: 'Fátima', start: 572 },
    { title: 'Futebol', start: 932 },
    { title: 'Epílogo', start: 1292 },
  ],
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
  meta: { kind: 'engineering', roles: ['mastering'], artist: { name: 'Hugo Calcio' }, editions: [], year: 2021 },
};

describe('ReleaseItem', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    audioPlayerEnabled.value = true;
    stop();
  });

  it('renders a Bandcamp player for a non-audio release with a bandcampId', () => {
    const wrapper = mountRelease(bandcamp);
    expect(wrapper.findComponent(BandcampPlayer).exists()).toBe(true);
    expect(wrapper.findComponent(PlayableCover).exists()).toBe(false);
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

  it('offers a download link for a release with a Bandcamp URL', () => {
    const download = mountRelease(bandcamp).get('.media-links a');
    expect(download.text()).toBe('Download');
    expect(download.attributes('href')).toBe(bandcamp.bandcampUrl);
  });

  it('omits the download link for a release without a Bandcamp URL', () => {
    expect(mountRelease(external).find('.media-links a').exists()).toBe(false);
  });

  it('applies the text-only modifier when requested', () => {
    const wrapper = mountRelease(textOnlyRelease, true);
    expect(wrapper.get('article').classes()).toContain('release--text-only');
  });

  it('turns the cover into the play control for an audio-backed release', async () => {
    const wrapper = mountRelease(audioBacked);

    expect(wrapper.findComponent(PlayableCover).exists()).toBe(true);
    expect(wrapper.findComponent(BandcampPlayer).exists()).toBe(false);
    expect(wrapper.find('.release-play').exists()).toBe(false);

    const play = wrapper.get('.release-cover__play');
    expect(play.attributes('aria-label')).toContain('Overlapse');
    await play.trigger('click');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('reverts to the Bandcamp embed when the player is disabled', () => {
    audioPlayerEnabled.value = false;
    const wrapper = mountRelease(audioBacked);

    expect(wrapper.findComponent(BandcampPlayer).exists()).toBe(true);
    expect(wrapper.findComponent(PlayableCover).exists()).toBe(false);
  });

  it('renders a per-track play button when the tracklist aligns with the audio', async () => {
    const release: Release = {
      id: '1714',
      title: '17:14',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2010 },
      tracklist: [{ title: '8:58' }, { title: '2:58' }, { title: '5:18' }],
    };

    const wrapper = mountRelease(release);
    expect(wrapper.findAll('.track-play')).toHaveLength(3);
    await wrapper.findAll('.track-play')[1].trigger('click');
  });

  it('toggles playback when the already-playing track is clicked', async () => {
    const release: Release = {
      id: '1714',
      title: '17:14',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2010 },
      tracklist: [{ title: '8:58' }, { title: '2:58' }, { title: '5:18' }],
    };

    const wrapper = mountRelease(release);
    await wrapper.findAll('.track-play')[0].trigger('click');
    await flushPromises();
    await wrapper.findAll('.track-play')[0].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('omits per-track buttons when the tracklist does not align with the audio', () => {
    const release: Release = {
      id: '2504',
      title: '2504',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2024 },
      tracklist: [{ title: 'I' }, { title: 'II' }, { title: 'III' }, { title: 'IV' }, { title: 'V' }],
    };

    expect(mountRelease(release).findAll('.track-play')).toHaveLength(0);
  });

  it('renders a play button per movement for a chaptered single-file release', () => {
    expect(mountRelease(chaptered).findAll('.track-play')).toHaveLength(5);
  });

  it('seeks to a movement offset and highlights the one under the playhead', async () => {
    const wrapper = mountRelease(chaptered);

    await wrapper.findAll('.track-play')[2].trigger('click');
    await flushPromises();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    const element = getMediaElement();
    element.currentTime = 600;
    element.dispatchEvent(new Event('timeupdate'));
    await flushPromises();

    expect(wrapper.findAll('ol li')[2].classes()).toContain('track--playing');
  });

  it('points the album title at its shareable permalink', () => {
    expect(mountRelease(audioBacked).get('.release-title-link').attributes('href')).toBe('/works/overlapse');
  });

  it('links each 2504 movement to its time offset and seeks on click', async () => {
    const wrapper = mountRelease(chaptered);
    const links = wrapper.findAll('.track-title-link');

    expect(links.map(link => link.attributes('href'))).toEqual([
      '/works/2504?t=0',
      '/works/2504?t=212',
      '/works/2504?t=572',
      '/works/2504?t=932',
      '/works/2504?t=1292',
    ]);

    await links[3].trigger('click');
    await flushPromises();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('toggles playback when the cover of the already-playing release is clicked', async () => {
    const wrapper = mountRelease(audioBacked);
    const cover = wrapper.get('.release-cover__play');

    await cover.trigger('click');
    await flushPromises();
    await cover.trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('links aligned tracks to their 1-based index and plays on click', async () => {
    const release: Release = {
      id: '1714',
      title: '17:14',
      meta: { kind: 'music', mediums: ['Digital'], editions: [{ label: { text: 'BRØQN' } }], year: 2010 },
      tracklist: [{ title: '8:58' }, { title: '2:58' }, { title: '5:18' }],
    };
    const wrapper = mountRelease(release);
    const links = wrapper.findAll('.track-title-link');

    expect(links.map(link => link.attributes('href'))).toEqual([
      '/works/1714?track=1',
      '/works/1714?track=2',
      '/works/1714?track=3',
    ]);

    await links[1].trigger('click');
    await flushPromises();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
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
