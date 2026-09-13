import { mount, RouterLinkStub } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { LiveEvent } from '@/types';
import { liveEventImageAlt } from '@/utils/liveEventImageAlt';

import EventItem from './EventItem.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
});

const mountEvent = (event: LiveEvent) =>
  mount(EventItem, {
    props: { event },
    global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
  });

const plainEvent: LiveEvent = {
  id: 'fim-de-emissao-45',
  title: 'Fim de Emissão #45',
  date: '2025-01-17',
  venue: { name: 'Desterro', url: 'https://darc.pt', city: 'Lisbon', country: 'Portugal' },
  setup: { kind: 'solo' },
};

const festivalEvent: LiveEvent = {
  id: 'madeiradig-2011',
  title: 'MADEIRADIG',
  titleUrl: 'https://digitalinberlin.eu/',
  date: '2011-12-02',
  venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' },
  setup: { kind: 'solo' },
};

const internalRefEvent: LiveEvent = {
  id: 'aragao-funchal',
  title: 'Aragão',
  titleUrl: '/works#aragao',
  date: '2021-09-22',
  venue: { name: 'Teatro Municipal Baltazar Dias', city: 'Funchal', country: 'Portugal' },
  setup: { kind: 'solo' },
};

describe('EventItem', () => {
  describe('description', () => {
    it('derives the lead sentence and opens lineup links in a new tab', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        setup: { kind: 'solo' },
        bill: [{ text: 'Pedro Roque', url: 'https://cavernancia.bandcamp.com/' }],
      });
      const description = wrapper.get('.event-description');
      const anchors = description.findAll('a');

      expect(description.text()).toContain('Solo performance.');
      expect(anchors[0].attributes('target')).toBe('_blank');
      expect(anchors[0].attributes('rel')).toBe('noopener noreferrer');
      expect(description.text()).toContain('Pedro Roque');
    });
  });

  describe('title', () => {
    it('renders the title as the deep-link permalink and emits update-hash on click', async () => {
      const wrapper = mountEvent(plainEvent);
      const link = wrapper.get('.event-title-link');

      expect(link.text()).toBe('Fim de Emissão #45');
      expect(link.attributes('href')).toBe('/live/fim-de-emissao-45');

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

    it('locale-prefixes an internal title reference on a pt route', async () => {
      const ptRouter = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null }, meta: { locale: 'pt' } }],
      });
      ptRouter.push('/pt/live');
      await ptRouter.isReady();

      const wrapper = mount(EventItem, {
        props: { event: internalRefEvent },
        global: { plugins: [ptRouter], stubs: { RouterLink: RouterLinkStub } },
      });

      expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/pt/works#aragao');
    });

    it('resolves a Localized title to the active locale', async () => {
      const localizedEvent: LiveEvent = {
        ...plainEvent,
        id: 'amess',
        title: { en: 'Performance with Amess', pt: 'Actuação com Amess' },
      };

      expect(mountEvent(localizedEvent).get('.event-title-link').text()).toBe('Performance with Amess');

      const ptRouter = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null }, meta: { locale: 'pt' } }],
      });
      ptRouter.push('/pt/live');
      await ptRouter.isReady();

      const ptWrapper = mount(EventItem, {
        props: { event: localizedEvent },
        global: { plugins: [ptRouter], stubs: { RouterLink: RouterLinkStub } },
      });

      expect(ptWrapper.get('.event-title-link').text()).toBe('Actuação com Amess');
    });
  });

  describe('media links', () => {
    it('shows a "Photos" control when the event has images', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        images: [
          { src: '/images/live/a-001.jpg' },
          { src: '/images/live/a-002.jpg' },
        ],
      });
      const button = wrapper.get('.media-links button');
      expect(button.text()).toBe('Photos');
      expect(button.attributes('aria-label')).toBe('View photos');
    });

    it('emits open-lightbox with the converted images (photo-role credit) on click', async () => {
      const event: LiveEvent = {
        ...plainEvent,
        images: [{ src: '/images/live/a-001.jpg', photographer: { name: 'Someone' } }],
      };
      const wrapper = mountEvent(event);

      await wrapper.get('.media-links button').trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];

      expect(payload?.[1]).toBe(0);
      expect(payload?.[0]).toEqual([
        { type: 'image', src: '/images/live/a-001.jpg', alt: liveEventImageAlt(event, 'en'), credit: { role: 'photo', name: 'Someone' } },
      ]);
    });

    it('applies one derived alt to every photo', async () => {
      const event: LiveEvent = {
        ...plainEvent,
        images: [{ src: '/images/live/a-001.jpg' }, { src: '/images/live/a-002.jpg' }],
      };
      const wrapper = mountEvent(event);

      await wrapper.get('.media-links button').trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];
      const expected = liveEventImageAlt(event, 'en');

      expect((payload?.[0] as Array<{ alt: string }>).map(item => item.alt)).toEqual([expected, expected]);
    });

    it('renders no media control when the event has neither images nor videos', () => {
      const wrapper = mountEvent(plainEvent);
      expect(wrapper.find('.media-links').exists()).toBe(false);
    });

    it('shows a "Video" control and emits the converted video on click', async () => {
      const wrapper = mountEvent({
        ...plainEvent,
        videos: [{ url: 'https://player.vimeo.com/video/1', title: 'Live set', platform: 'vimeo', author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' } }],
      });
      const button = wrapper.get('.media-links button');
      expect(button.text()).toBe('Video');

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
        images: [{ src: '/images/live/a-001.jpg' }],
        videos: [
          { url: 'https://player.vimeo.com/video/1', title: 'One', platform: 'vimeo' },
          { url: 'https://player.vimeo.com/video/2', title: 'Two', platform: 'vimeo' },
        ],
      });
      const buttons = wrapper.findAll('.media-links button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].text()).toBe('Photo');
      expect(buttons[1].text()).toBe('Videos');
      expect(wrapper.get('.media-links').text()).toContain('|');
    });

    it('shows a "Posters" control and emits the converted posters (no photographer) on click', async () => {
      const wrapper = mountEvent({
        ...plainEvent,
        posters: [
          { src: '/images/live/a-poster-001.jpg', alt: 'Poster one' },
          { src: '/images/live/a-poster-002.jpg', alt: 'Poster two' },
        ],
      });
      const button = wrapper.get('.media-links button');
      expect(button.text()).toBe('Posters');

      await button.trigger('click');
      expect(wrapper.emitted('open-lightbox')?.[0]).toEqual([
        [
          { type: 'image', src: '/images/live/a-poster-001.jpg', alt: 'Poster one' },
          { type: 'image', src: '/images/live/a-poster-002.jpg', alt: 'Poster two' },
        ],
        0,
        { id: 'fim-de-emissao-45', kind: 'poster' },
      ]);
    });

    it('uses the singular poster label for a single poster', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        posters: [{ src: '/images/live/a-poster-001.jpg', alt: 'Poster one' }],
      });
      expect(wrapper.get('.media-links button').text()).toBe('Poster');
    });

    it('orders the controls photos, posters, then videos', () => {
      const wrapper = mountEvent({
        ...plainEvent,
        images: [{ src: '/images/live/a-001.jpg' }],
        posters: [{ src: '/images/live/a-poster-001.jpg', alt: 'Poster one' }],
        videos: [{ url: 'https://player.vimeo.com/video/1', title: 'One', platform: 'vimeo' }],
      });
      const buttons = wrapper.findAll('.media-links button');

      expect(buttons.map(button => button.text())).toEqual(['Photo', 'Poster', 'Video']);
    });
  });

  describe('venue', () => {
    it('renders a linked venue name with city and country', () => {
      const wrapper = mountEvent(plainEvent);
      const venue = wrapper.get('.event-venue');
      const link = venue.get('a');
      expect(link.attributes('href')).toBe('https://darc.pt');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toContain('noopener');
      expect(link.text()).toContain('Desterro');
      expect(venue.text()).toContain('Desterro');
      expect(venue.text()).toContain('Lisbon, Portugal');
    });

    it('renders an unlinked venue name when there is no url and none is registered', () => {
      const wrapper = mountEvent({ ...plainEvent, venue: { name: 'A Small Room', city: 'Nowhere', country: 'Portugal' } });
      const venue = wrapper.get('.event-venue');
      expect(venue.find('a').exists()).toBe(false);
      expect(venue.text()).toBe('A Small Room, Nowhere, Portugal');
    });

    it('links a registered venue even when the event carries no inline url', () => {
      const wrapper = mountEvent({ ...plainEvent, venue: { name: 'Casa das Mudas', city: 'Calheta', country: 'Portugal' } });
      const link = wrapper.get('.event-venue a');
      expect(link.attributes('href')).toBe('https://museus.madeira.gov.pt/DetalhesMuseu?museumId=1');
      expect(link.text()).toContain('Casa das Mudas');
    });

    it('renders a country-only (TBC) venue as plain text', () => {
      const wrapper = mountEvent({ ...plainEvent, venue: { country: 'Portugal' } });
      const venue = wrapper.get('.event-venue');
      expect(venue.find('a').exists()).toBe(false);
      expect(venue.text()).toBe('Portugal');
    });

    it('translates city exonyms for Portuguese (Lisbon → Lisboa)', async () => {
      const ptRouter = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null }, meta: { locale: 'pt' } }],
      });
      ptRouter.push('/pt/live');
      await ptRouter.isReady();

      const wrapper = mount(EventItem, {
        props: { event: plainEvent },
        global: { plugins: [ptRouter], stubs: { RouterLink: RouterLinkStub } },
      });

      expect(wrapper.get('.event-venue').text()).toContain('Lisboa, Portugal');
    });
  });

  describe('thumbnail', () => {
    const withImages: LiveEvent = {
      ...plainEvent,
      images: [
        { src: '/images/live/a-001.jpg' },
        { src: '/images/live/a-002.jpg', cover: true, thumb: { position: 'center 85%', scale: 1.2, rotate: 1 } },
        { src: '/images/live/a-003.jpg' },
      ],
    };

    it('renders the cover image as the hero, with its framing style applied', () => {
      const img = mountEvent(withImages).get('.event-thumb img');
      const style = img.attributes('style') ?? '';

      expect(img.attributes('src')).toBe('/images/live/a-002.jpg');
      expect(style).toContain('object-position: center 85%');
      expect(style).toContain('scale(1.2)');
      expect(style).toContain('rotate(1deg)');
    });

    it('defaults the hero to the first image when none is flagged as cover', () => {
      const wrapper = mountEvent({ ...plainEvent, images: [{ src: '/images/live/b-001.jpg' }, { src: '/images/live/b-002.jpg' }] });

      expect(wrapper.get('.event-thumb img').attributes('src')).toBe('/images/live/b-001.jpg');
      expect(wrapper.get('.event-thumb img').attributes('style')).toBeUndefined();
    });

    it('opens the lightbox at the first gallery image, not the hero', async () => {
      const wrapper = mountEvent(withImages);
      await wrapper.get('.event-thumb').trigger('click');
      const payload = wrapper.emitted('open-lightbox')?.[0];

      expect(payload?.[1]).toBe(0);
      expect((payload?.[0] as Array<{ src: string }>)[0].src).toBe('/images/live/a-001.jpg');
      expect(payload?.[2]).toEqual({ id: 'fim-de-emissao-45', kind: 'photo' });
    });

    it('shows the image count only when the event has more than one image', () => {
      expect(mountEvent(withImages).get('.event-thumb-count').text()).toBe('3');
      const single = mountEvent({ ...plainEvent, posters: [{ src: '/images/live/p-001.jpg', alt: 'Poster' }] });
      expect(single.find('.event-thumb-count').exists()).toBe(false);
    });

    it('uses a poster as the hero and emits the poster kind when there are no images', async () => {
      const wrapper = mountEvent({ ...plainEvent, posters: [{ src: '/images/live/p-001.jpg', alt: 'Poster', cover: true }] });

      expect(wrapper.get('.event-thumb img').attributes('src')).toBe('/images/live/p-001.jpg');
      await wrapper.get('.event-thumb').trigger('click');
      expect(wrapper.emitted('open-lightbox')?.[0]?.[2]).toEqual({ id: 'fim-de-emissao-45', kind: 'poster' });
    });

    it('renders a text-only row when the event has no media', () => {
      const wrapper = mountEvent(plainEvent);

      expect(wrapper.find('.event-thumb').exists()).toBe(false);
      expect(wrapper.get('article').classes()).toContain('event--text-only');
    });
  });
});
