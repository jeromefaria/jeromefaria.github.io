import { mount, RouterLinkStub } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { LiveEvent } from '@/types';

import EventItem from './EventItem.vue';

const mountEvent = (event: LiveEvent) =>
  mount(EventItem, {
    props: { event },
    global: { stubs: { RouterLink: RouterLinkStub } },
  });

const plainEvent: LiveEvent = {
  id: 'fim-de-emissao-45',
  title: 'Fim de Emissão #45',
  date: '2025-01-17',
  venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
};

const festivalEvent: LiveEvent = {
  id: 'madeiradig-2011',
  title: '<a href="https://digitalinberlin.eu/">MADEIRADIG</a>',
  date: '2011-12-02',
  venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
};

const internalRefEvent: LiveEvent = {
  id: 'aragao-funchal',
  title: '<a href="/works#aragao">Aragão</a>',
  date: '2021-09-22',
  venue: { name: 'Teatro Municipal Baltazar Dias', city: 'Funchal', country: 'Portugal' },
};

describe('EventItem', () => {
  describe('description', () => {
    it('opens external links in a new tab and leaves internal links alone', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        description: 'With <a href="https://cavernancia.bandcamp.com/">Pedro Roque</a> at <a href="/works#x">Works</a>.',
      });
      const anchors = wrapper.findAll('.event-description a');

      expect(anchors[0].attributes('target')).toBe('_blank');
      expect(anchors[0].attributes('rel')).toBe('noopener noreferrer');
      expect(anchors[1].attributes('target')).toBeUndefined();
    });
  });

  describe('title', () => {
    it('renders the title as the deep-link permalink and emits update-hash on click', async () => {
      const wrapper = mountEvent(plainEvent);
      const link = wrapper.get('.event-title-link');

      expect(link.text()).toBe('Fim de Emissão #45');
      expect(link.attributes('href')).toBe('#fim-de-emissao-45');

      await link.trigger('click');
      expect(wrapper.emitted('update-hash')?.[0]).toEqual(['fim-de-emissao-45']);
    });

    it('shows no trailing reference icon for a plain-text title', () => {
      const wrapper = mountEvent(plainEvent);
      expect(wrapper.find('.event-title-ref').exists()).toBe(false);
    });

    it('renders the permalink as plain text (not a nested anchor) for a linked title', () => {
      const wrapper = mountEvent(festivalEvent);
      const permalink = wrapper.get('.event-title-link');

      expect(permalink.text()).toBe('MADEIRADIG');
      // The invalid-HTML regression: the permalink anchor must not wrap another anchor.
      expect(permalink.element.querySelector('a')).toBeNull();
    });

    it('surfaces an external festival link as a new-tab sibling icon', () => {
      const wrapper = mountEvent(festivalEvent);
      const ref = wrapper.get('a.event-title-ref');

      expect(ref.attributes('href')).toBe('https://digitalinberlin.eu/');
      expect(ref.attributes('target')).toBe('_blank');
      expect(ref.attributes('rel')).toBe('noopener noreferrer');
      expect(ref.attributes('aria-label')).toBe('MADEIRADIG website (opens in a new tab)');
    });

    it('surfaces an internal /works reference as a same-tab RouterLink (no new tab)', () => {
      const wrapper = mountEvent(internalRefEvent);
      const routerLink = wrapper.findComponent(RouterLinkStub);

      expect(routerLink.exists()).toBe(true);
      expect(routerLink.props('to')).toBe('/works#aragao');
      expect(routerLink.attributes('target')).toBeUndefined();
      expect(wrapper.find('a.event-title-ref[target="_blank"]').exists()).toBe(false);
    });
  });

  describe('media links', () => {
    it('shows a "View photos" control when the event has images', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        images: [
          { src: '/images/live/a-001.jpg', alt: 'A' },
          { src: '/images/live/a-002.jpg', alt: 'B' },
        ],
      });
      const button = wrapper.get('.media-links button');
      expect(button.text()).toBe('View photos');
    });

    it('emits open-lightbox with the converted images on click', async () => {
      const wrapper = mountEvent({
        ...plainEvent,
        images: [{ src: '/images/live/a-001.jpg', alt: 'A', photographer: { name: 'Someone' } }],
      });

      await wrapper.get('.media-links button').trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];

      expect(payload?.[1]).toBe(0);
      expect(payload?.[0]).toEqual([
        { type: 'image', src: '/images/live/a-001.jpg', alt: 'A', photographer: { name: 'Someone' } },
      ]);
    });

    it('falls back to the event imageAlt when an image has no alt of its own', async () => {
      const wrapper = mountEvent({
        ...plainEvent,
        imageAlt: 'Event-level description',
        images: [{ src: '/images/live/a-001.jpg' }, { src: '/images/live/a-002.jpg', alt: 'Override' }],
      });

      await wrapper.get('.media-links button').trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];

      expect((payload?.[0] as Array<{ alt: string }>).map(item => item.alt)).toEqual([
        'Event-level description',
        'Override',
      ]);
    });

    it('renders no media control when the event has neither images nor videos', () => {
      const wrapper = mountEvent(plainEvent);
      expect(wrapper.find('.media-links').exists()).toBe(false);
    });

    it('shows a "View video" control and emits the converted video on click', async () => {
      const wrapper = mountEvent({
        ...plainEvent,
        videos: [{ url: 'https://player.vimeo.com/video/1', title: 'Live set', platform: 'vimeo', author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' } }],
      });
      const button = wrapper.get('.media-links button');
      expect(button.text()).toBe('View video');

      await button.trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];

      expect(payload?.[1]).toBe(0);
      expect(payload?.[0]).toEqual([
        { type: 'video', url: 'https://player.vimeo.com/video/1', title: 'Live set', platform: 'vimeo', author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' } },
      ]);
    });

    it('pluralises the video control and separates photo and video controls', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        images: [{ src: '/images/live/a-001.jpg', alt: 'A' }],
        videos: [
          { url: 'https://player.vimeo.com/video/1', title: 'One', platform: 'vimeo' },
          { url: 'https://player.vimeo.com/video/2', title: 'Two', platform: 'vimeo' },
        ],
      });
      const buttons = wrapper.findAll('.media-links button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].text()).toBe('View photo');
      expect(buttons[1].text()).toBe('View videos');
      expect(wrapper.get('.media-links').text()).toContain('|');
    });
  });

  describe('venue', () => {
    it('renders a linked venue name with city and country', () => {
      const wrapper = mountEvent(plainEvent);
      const venue = wrapper.get('.event-venue');
      const link = venue.get('a');
      expect(link.attributes('href')).toBe('https://darc.pt');
      expect(link.text()).toBe('Desterro');
      expect(venue.text()).toBe('Desterro, Lisbon, Portugal');
    });

    it('renders an unlinked venue name when there is no url', () => {
      const wrapper = mountEvent(festivalEvent);
      const venue = wrapper.get('.event-venue');
      expect(venue.find('a').exists()).toBe(false);
      expect(venue.text()).toBe('Casa das Mudas, Calheta, Portugal');
    });

    it('renders a country-only (TBC) venue as plain text', () => {
      const wrapper = mountEvent({ ...plainEvent, venue: { country: 'Portugal' } });
      const venue = wrapper.get('.event-venue');
      expect(venue.find('a').exists()).toBe(false);
      expect(venue.text()).toBe('Portugal');
    });
  });
});
