import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import type { LightboxItem } from '@/types';

import LightboxOverlay from './LightboxOverlay.vue';

const image: LightboxItem = { type: 'image', src: '/image.jpg', alt: 'Test image' };

const mountOverlay = (props: Record<string, unknown> = {}) =>
  mount(LightboxOverlay, {
    attachTo: document.body,
    props: {
      isOpen: true,
      currentItem: image,
      currentIndex: 0,
      totalItems: 1,
      variant: 'compact',
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
  });
});
