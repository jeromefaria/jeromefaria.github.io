import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type {
  BandcampRelease,
  CollaborationRelease,
  ExternalRelease,
  MasteringCredit,
  PublicationRelease,
  Release,
} from '@/types';

import BandcampPlayer from './BandcampPlayer.vue';
import ReleaseItem from './ReleaseItem.vue';

const mountRelease = (release: Release, textOnly = false) =>
  mount(ReleaseItem, { props: { release, textOnly } });

const bandcamp: BandcampRelease = {
  id: 'overlapse',
  title: 'Overlapse',
  meta: 'Digital — BRØQN, 2012',
  bandcampId: '1643026936',
  coverImage: '/images/overlapse.jpg',
  bandcampUrl: 'https://music.jeromefaria.com/album/overlapse',
  tracklist: ['Attack', 'Sustain'],
  credits: 'Music by Jerome Faria.',
};

const external: ExternalRelease = {
  id: 'ect',
  title: 'ECT',
  meta: 'Digital — Test Tube, 2005',
  coverImage: '/images/ect.jpg',
  externalUrl: 'https://example.com/ect',
  tracklist: ['Play'],
  credits: 'Music by Jerome Faria.',
};

const staticCover: CollaborationRelease = {
  id: 'depolarized',
  title: 'Depolarized',
  meta: 'Digital — BRØQN, 2012',
  coverImage: '/images/depolarized.jpg',
  credits: 'Music by Jerome Faria and Nelson P. Ferreira.',
};

const textOnlyRelease: MasteringCredit = {
  id: 'master-open',
  title: 'Open',
  meta: 'Hugo Calcio, 2021',
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

  it('emits open-lightbox with converted images from the gallery button', async () => {
    const publication: PublicationRelease = {
      id: 'glitch',
      title: 'Glitch',
      meta: 'Book, 2009',
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

    await wrapper.get('.release-gallery-link button').trigger('click');
    const payload = wrapper.emitted('open-lightbox')?.[0];

    expect(payload?.[1]).toBe(0);
    expect(payload?.[0]).toHaveLength(2);
    expect((payload?.[0] as Array<{ src: string }>)[0].src).toBe('/images/publications/glitch-spread-01.jpg');
  });
});
