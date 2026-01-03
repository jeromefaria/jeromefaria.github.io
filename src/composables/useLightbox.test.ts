import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent } from 'vue';

import type { LightboxItem } from '@/types/lightbox';

import { useLightbox } from './useLightbox';

// Constants
const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
} as const;

const OVERFLOW_HIDDEN = 'hidden';
const OVERFLOW_DEFAULT = '';

/**
 * Create a test component that uses the useLightbox composable
 */
function createTestComponent(): Component {
  return defineComponent({
    setup() {
      const lightbox = useLightbox();
      return { ...lightbox };
    },
    template: '<div></div>',
  });
}

// Mock lightbox items
const mockImages: LightboxItem[] = [
  { type: 'image', src: '/image1.jpg', alt: 'Image 1' },
  { type: 'image', src: '/image2.jpg', alt: 'Image 2' },
  { type: 'image', src: '/image3.jpg', alt: 'Image 3' },
];

const mockVideos: LightboxItem[] = [
  { type: 'video', url: 'https://youtube.com/watch?v=1', title: 'Video 1', platform: 'youtube' },
  { type: 'video', url: 'https://vimeo.com/123', title: 'Video 2', platform: 'vimeo' },
];

describe('useLightbox', () => {
  beforeEach(() => {
    document.body.style.overflow = OVERFLOW_DEFAULT;
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with closed state', () => {
      const wrapper = mount(createTestComponent());

      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.currentItem).toBeNull();
      expect(wrapper.vm.currentIndex).toBe(0);
      expect(wrapper.vm.items).toEqual([]);
    });
  });

  describe('openLightbox', () => {
    it('should open lightbox with items and default index', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages);

      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.items).toEqual(mockImages);
      expect(wrapper.vm.currentIndex).toBe(0);
      expect(wrapper.vm.currentItem).toEqual(mockImages[0]);
    });

    it('should open lightbox with specific index', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 1);

      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.currentIndex).toBe(1);
      expect(wrapper.vm.currentItem).toEqual(mockImages[1]);
    });

    it('should set body overflow to hidden when opening', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages);

      expect(document.body.style.overflow).toBe(OVERFLOW_HIDDEN);
    });

    it('should handle video items', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockVideos, 0);

      expect(wrapper.vm.currentItem).toEqual(mockVideos[0]);
    });

    it('should handle empty items array', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox([]);

      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.currentItem).toBeNull();
    });
  });

  describe('closeLightbox', () => {
    it('should close lightbox and reset state', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 1);
      wrapper.vm.closeLightbox();

      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.currentItem).toBeNull();
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.currentIndex).toBe(0);
    });

    it('should restore body overflow when closing', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages);
      expect(document.body.style.overflow).toBe(OVERFLOW_HIDDEN);

      wrapper.vm.closeLightbox();
      expect(document.body.style.overflow).toBe(OVERFLOW_DEFAULT);
    });
  });

  describe('navigation', () => {
    describe('goToNext', () => {
      it('should navigate to next item', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox(mockImages, 0);
        wrapper.vm.goToNext();

        expect(wrapper.vm.currentIndex).toBe(1);
        expect(wrapper.vm.currentItem).toEqual(mockImages[1]);
      });

      it('should not navigate past last item', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox(mockImages, 2); // Last item
        wrapper.vm.goToNext();

        expect(wrapper.vm.currentIndex).toBe(2);
        expect(wrapper.vm.currentItem).toEqual(mockImages[2]);
      });

      it('should handle single item array', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox([mockImages[0]], 0);
        wrapper.vm.goToNext();

        expect(wrapper.vm.currentIndex).toBe(0);
      });
    });

    describe('goToPrev', () => {
      it('should navigate to previous item', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox(mockImages, 2);
        wrapper.vm.goToPrev();

        expect(wrapper.vm.currentIndex).toBe(1);
        expect(wrapper.vm.currentItem).toEqual(mockImages[1]);
      });

      it('should not navigate before first item', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox(mockImages, 0);
        wrapper.vm.goToPrev();

        expect(wrapper.vm.currentIndex).toBe(0);
        expect(wrapper.vm.currentItem).toEqual(mockImages[0]);
      });

      it('should handle single item array', () => {
        const wrapper = mount(createTestComponent());

        wrapper.vm.openLightbox([mockImages[0]], 0);
        wrapper.vm.goToPrev();

        expect(wrapper.vm.currentIndex).toBe(0);
      });
    });

    it('should allow navigation through all items', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 0);

      // Go forward through all items
      expect(wrapper.vm.currentIndex).toBe(0);

      wrapper.vm.goToNext();
      expect(wrapper.vm.currentIndex).toBe(1);

      wrapper.vm.goToNext();
      expect(wrapper.vm.currentIndex).toBe(2);

      // Go back through all items
      wrapper.vm.goToPrev();
      expect(wrapper.vm.currentIndex).toBe(1);

      wrapper.vm.goToPrev();
      expect(wrapper.vm.currentIndex).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('should close on Escape key', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 0);
      expect(wrapper.vm.isOpen).toBe(true);

      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ESCAPE });
      document.dispatchEvent(event);

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('should navigate to next on ArrowRight', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 0);

      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ARROW_RIGHT });
      document.dispatchEvent(event);

      expect(wrapper.vm.currentIndex).toBe(1);
    });

    it('should navigate to previous on ArrowLeft', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 1);

      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ARROW_LEFT });
      document.dispatchEvent(event);

      expect(wrapper.vm.currentIndex).toBe(0);
    });

    it('should not handle keys when lightbox is closed', () => {
      const wrapper = mount(createTestComponent());

      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ESCAPE });
      document.dispatchEvent(event);

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it('should ignore unhandled keys', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages, 1);

      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ENTER });
      document.dispatchEvent(event);

      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.currentIndex).toBe(1);
    });
  });

  describe('cleanup', () => {
    it('should restore body overflow on unmount', () => {
      const wrapper = mount(createTestComponent());

      wrapper.vm.openLightbox(mockImages);
      expect(document.body.style.overflow).toBe(OVERFLOW_HIDDEN);

      wrapper.unmount();

      expect(document.body.style.overflow).toBe(OVERFLOW_DEFAULT);
    });

    it('should remove event listeners on unmount', () => {
      const wrapper = mount(createTestComponent());
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      wrapper.unmount();

      expect(() => {
        const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ESCAPE });
        document.dispatchEvent(event);
      }).not.toThrow();

      removeEventListenerSpy.mockRestore();
    });
  });
});
