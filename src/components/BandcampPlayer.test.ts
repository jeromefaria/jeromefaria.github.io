import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import BandcampPlayer from './BandcampPlayer.vue';

const DEFAULT_PROPS = {
  albumId: '12345678',
  coverImage: '/images/cover.jpg',
  albumTitle: 'Test Album',
};

function mountPlayer(props = DEFAULT_PROPS) {
  return mount(BandcampPlayer, { props });
}

describe('BandcampPlayer', () => {
  describe('initial state — cover image', () => {
    it('renders the cover image', () => {
      const wrapper = mountPlayer();
      expect(wrapper.find('img').exists()).toBe(true);
    });

    it('shows the correct cover image src', () => {
      const wrapper = mountPlayer();
      expect(wrapper.find('img').attributes('src')).toBe(DEFAULT_PROPS.coverImage);
    });

    it('renders a webp source element', () => {
      const wrapper = mountPlayer();
      const source = wrapper.find('source');
      expect(source.exists()).toBe(true);
      expect(source.attributes('srcset')).toBe('/images/cover.webp');
    });

    it('has a descriptive alt text on the cover image', () => {
      const wrapper = mountPlayer();
      expect(wrapper.find('img').attributes('alt')).toBe(`${DEFAULT_PROPS.albumTitle} album cover`);
    });

    it('does not render the iframe initially', () => {
      const wrapper = mountPlayer();
      expect(wrapper.find('iframe').exists()).toBe(false);
    });

    it('renders the play button', () => {
      const wrapper = mountPlayer();
      const btn = wrapper.find('.bandcamp-player__button');
      expect(btn.exists()).toBe(true);
    });

    it('play button has an accessible aria-label', () => {
      const wrapper = mountPlayer();
      const btn = wrapper.find('.bandcamp-player__button');
      expect(btn.attributes('aria-label')).toBe(`Play ${DEFAULT_PROPS.albumTitle}`);
    });
  });

  describe('loading the player', () => {
    it('shows the iframe after clicking the player', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('iframe').exists()).toBe(true);
    });

    it('hides the cover image after clicking', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('picture').exists()).toBe(false);
    });

    it('hides the play button after clicking', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('.bandcamp-player__button').exists()).toBe(false);
    });

    it('shows a loading indicator before iframe fires load', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('.bandcamp-player__loading').exists()).toBe(true);
    });

    it('hides the loading indicator after iframe fires load', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      await wrapper.find('iframe').trigger('load');
      expect(wrapper.find('.bandcamp-player__loading').exists()).toBe(false);
    });

    it('adds the loading class while iframe is loading', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('.bandcamp-player').classes()).toContain('bandcamp-player--loading');
    });

    it('removes the loading class after iframe fires load', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      await wrapper.find('iframe').trigger('load');
      expect(wrapper.find('.bandcamp-player').classes()).not.toContain('bandcamp-player--loading');
    });

    it('does not re-open player on second click', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      await wrapper.find('iframe').trigger('load');
      await wrapper.find('.bandcamp-player').trigger('click');
      // Still only one iframe
      expect(wrapper.findAll('iframe')).toHaveLength(1);
    });
  });

  describe('iframe attributes', () => {
    it('uses the correct Bandcamp embed URL', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      const src = wrapper.find('iframe').attributes('src');
      expect(src).toContain(DEFAULT_PROPS.albumId);
      expect(src).toContain('bandcamp.com/EmbeddedPlayer');
    });

    it('has a descriptive title attribute', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('iframe').attributes('title')).toContain(DEFAULT_PROPS.albumTitle);
    });

    it('uses sandbox attribute for security', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('iframe').attributes('sandbox')).toBeTruthy();
    });
  });

  describe('image error state', () => {
    it('shows fallback when image fails to load', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('img').trigger('error');
      expect(wrapper.find('.bandcamp-player__fallback').exists()).toBe(true);
    });

    it('hides the picture element when image errors', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('img').trigger('error');
      expect(wrapper.find('picture').exists()).toBe(false);
    });

    it('adds error class to container on image error', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('img').trigger('error');
      expect(wrapper.find('.bandcamp-player').classes()).toContain('bandcamp-player--error');
    });

    it('still opens player on click after image error', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('img').trigger('error');
      await wrapper.find('.bandcamp-player').trigger('click');
      expect(wrapper.find('iframe').exists()).toBe(true);
    });
  });

  describe('image loaded state', () => {
    it('adds is-loaded class to img after load event', async () => {
      const wrapper = mountPlayer();
      await wrapper.find('img').trigger('load');
      expect(wrapper.find('img').classes()).toContain('is-loaded');
    });
  });
});
