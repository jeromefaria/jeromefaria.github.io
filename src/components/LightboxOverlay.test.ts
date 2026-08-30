import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import type { LightboxItem } from '@/types';

import LightboxOverlay from './LightboxOverlay.vue';

const image: LightboxItem = { type: 'image', src: '/image.jpg', alt: 'Test image' };
const video: LightboxItem = { type: 'video', url: 'https://player.example.com/v/1', title: 'A performance', platform: 'vimeo' };

const mountOverlay = (props: Record<string, unknown> = {}) =>
  mount(LightboxOverlay, {
    attachTo: document.body,
    props: {
      isOpen: true,
      currentItem: image,
      currentIndex: 0,
      totalItems: 1,
      ...props,
    },
  });

describe('LightboxOverlay', () => {
  describe('dialog semantics', () => {
    it('renders as a modal dialog with an accessible name', () => {
      const wrapper = mountOverlay();
      const dialog = wrapper.get('.lightbox');

      expect(dialog.attributes('role')).toBe('dialog');
      expect(dialog.attributes('aria-modal')).toBe('true');
      expect(dialog.attributes('aria-label')).toBe('Image viewer');

      wrapper.unmount();
    });

    it('reflects position in the accessible name for multi-item galleries', () => {
      const wrapper = mountOverlay({ currentIndex: 1, totalItems: 3 });

      expect(wrapper.get('.lightbox').attributes('aria-label')).toBe('Image 2 of 3');

      wrapper.unmount();
    });
  });

  describe('dismissal', () => {
    it('closes when the backdrop is clicked', async () => {
      const wrapper = mountOverlay();

      await wrapper.get('.lightbox').trigger('click');

      expect(wrapper.emitted('close')).toHaveLength(1);
      wrapper.unmount();
    });

    it('does not close when the image itself is clicked', async () => {
      const wrapper = mountOverlay();

      await wrapper.get('.lightbox__image').trigger('click');

      expect(wrapper.emitted('close')).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('focus management', () => {
    it('moves focus into the dialog on open', async () => {
      const wrapper = mountOverlay();
      await nextTick();
      await nextTick();

      expect(document.activeElement).toBe(wrapper.get('.lightbox').element);

      wrapper.unmount();
    });

    it('wraps Tab from the last control back to the first', async () => {
      const wrapper = mountOverlay({ currentIndex: 1, totalItems: 3 });
      await nextTick();

      const focusable = Array.from(
        wrapper.get('.lightbox').element.querySelectorAll<HTMLElement>('button:not([disabled])'),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      expect(first).toBeDefined();
      expect(last).toBeDefined();
      last?.focus();

      await wrapper.get('.lightbox').trigger('keydown', { key: 'Tab' });

      expect(document.activeElement).toBe(first);

      wrapper.unmount();
    });

    it('wraps Shift+Tab from the first control forward to the last', async () => {
      const wrapper = mountOverlay({ currentIndex: 1, totalItems: 3 });
      await nextTick();

      const focusable = Array.from(
        wrapper.get('.lightbox').element.querySelectorAll<HTMLElement>('button:not([disabled])'),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      first?.focus();

      await wrapper.get('.lightbox').trigger('keydown', { key: 'Tab', shiftKey: true });

      expect(document.activeElement).toBe(last);

      wrapper.unmount();
    });

    it('ignores non-Tab keys without moving focus', async () => {
      const wrapper = mountOverlay();
      await nextTick();
      const dialog = wrapper.get('.lightbox').element as HTMLElement;
      dialog.focus();

      await wrapper.get('.lightbox').trigger('keydown', { key: 'Enter' });

      expect(document.activeElement).toBe(dialog);

      wrapper.unmount();
    });
  });

  describe('media type', () => {
    it('renders a video in an iframe and names the dialog as a video viewer', () => {
      const wrapper = mountOverlay({ currentItem: video });
      const iframe = wrapper.get('iframe.lightbox__video');

      expect(iframe.attributes('src')).toBe('https://player.example.com/v/1');
      expect(iframe.attributes('title')).toBe('A performance');
      expect(wrapper.get('.lightbox').attributes('aria-label')).toBe('Video viewer');
      expect(wrapper.find('picture').exists()).toBe(false);

      wrapper.unmount();
    });

    it('serves a WebP source alongside the JPEG fallback for an image', () => {
      const wrapper = mountOverlay({ currentItem: { type: 'image', src: '/photo.jpg', alt: 'A photo' } });

      expect(wrapper.get('picture source').attributes('srcset')).toBe('/photo.webp');
      expect(wrapper.get('img.lightbox__image').attributes('src')).toBe('/photo.jpg');

      wrapper.unmount();
    });
  });

  describe('credit line', () => {
    it('credits a video author as "Video by" with a safe new-tab link', () => {
      const wrapper = mountOverlay({
        currentItem: {
          type: 'video',
          url: 'https://player.example.com/v/9',
          title: 'Set',
          platform: 'vimeo',
          author: { name: 'Hugo Olim', url: 'https://vimeo.com/hugoolim' },
        },
      });
      const credit = wrapper.get('.lightbox__credit');
      const link = credit.get('a');

      expect(credit.text()).toContain('Video by');
      expect(link.attributes('href')).toBe('https://vimeo.com/hugoolim');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(link.text()).toContain('Hugo Olim');

      wrapper.unmount();
    });

    it('links the photographer name as a safe new-tab link when a url is given', () => {
      const wrapper = mountOverlay({
        currentItem: { type: 'image', src: '/p.jpg', alt: 'P', credit: { role: 'photo', name: 'Ana Lens', url: 'https://ana.example.com' } },
      });
      const credit = wrapper.get('.lightbox__credit');
      const link = credit.get('a');

      expect(link.attributes('href')).toBe('https://ana.example.com');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(link.text()).toContain('Ana Lens');
      expect(credit.get('.visually-hidden').text()).toBe('(opens in a new tab)');

      wrapper.unmount();
    });

    it('renders the photographer name as plain text when no url is given', () => {
      const wrapper = mountOverlay({
        currentItem: { type: 'image', src: '/p.jpg', alt: 'P', credit: { role: 'photo', name: 'Ana Lens' } },
      });
      const credit = wrapper.get('.lightbox__credit');

      expect(credit.find('a').exists()).toBe(false);
      expect(credit.text()).toContain('Ana Lens');

      wrapper.unmount();
    });

    it('credits a poster artist as "Poster by" with a safe new-tab link', () => {
      const wrapper = mountOverlay({
        currentItem: { type: 'image', src: '/poster.jpg', alt: 'Poster', credit: { role: 'poster', name: 'André Lemos', url: 'https://andre.example.com' } },
      });
      const credit = wrapper.get('.lightbox__credit');
      const link = credit.get('a');

      expect(credit.text()).toContain('Poster by');
      expect(link.attributes('href')).toBe('https://andre.example.com');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(link.text()).toContain('André Lemos');

      wrapper.unmount();
    });

    it('shows no credit for a video or an image without a photographer', () => {
      const withoutPhotographer = mountOverlay({ currentItem: image });
      expect(withoutPhotographer.find('.lightbox__credit').exists()).toBe(false);
      withoutPhotographer.unmount();

      const videoOverlay = mountOverlay({ currentItem: video });
      expect(videoOverlay.find('.lightbox__credit').exists()).toBe(false);
      videoOverlay.unmount();
    });
  });

  describe('position counter', () => {
    it('hides the counter for a single item', () => {
      const wrapper = mountOverlay();
      expect(wrapper.find('.lightbox__counter').exists()).toBe(false);
      wrapper.unmount();
    });

    it('shows a decorative "n / total" counter for multi-item sets', () => {
      const wrapper = mountOverlay({ currentIndex: 1, totalItems: 3 });
      const counter = wrapper.get('.lightbox__counter');

      expect(counter.text()).toBe('2 / 3');
      expect(counter.attributes('aria-hidden')).toBe('true');

      wrapper.unmount();
    });

    it('reflects video position in the accessible name for multi-video sets', () => {
      const wrapper = mountOverlay({ currentItem: video, currentIndex: 0, totalItems: 2 });

      expect(wrapper.get('.lightbox').attributes('aria-label')).toBe('Video 1 of 2');

      wrapper.unmount();
    });
  });
});
