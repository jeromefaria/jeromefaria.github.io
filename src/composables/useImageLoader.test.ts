import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { useImageLoader } from './useImageLoader';

const TEST_SRC_JPG = '/images/cover.jpg';
const TEST_SRC_WEBP = '/images/cover.webp';
const TEST_SRC_NO_EXT = '/images/cover';
const TEST_SRC_PNG = '/images/cover.png';

function mountWithLoader(src: string) {
  let loader: ReturnType<typeof useImageLoader>;

  const TestComponent = defineComponent({
    setup() {
      loader = useImageLoader(src);
      return loader;
    },
    template: '<img ref="imageRef" />',
  });

  const wrapper = mount(TestComponent, { attachTo: document.body });
  return { wrapper, loader: loader! };
}

describe('useImageLoader', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts with imageLoaded false', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      expect(loader.imageLoaded.value).toBe(false);
    });

    it('starts with imageError false', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      expect(loader.imageError.value).toBe(false);
    });

    it('exposes imageRef as null initially', () => {
      let loader: ReturnType<typeof useImageLoader>;
      const TestComponent = defineComponent({
        setup() {
          loader = useImageLoader(TEST_SRC_JPG);
          return {};
        },
        template: '<div />',
      });
      mount(TestComponent);
      expect(loader!.imageRef.value).toBeNull();
    });
  });

  describe('webpSrc', () => {
    it('converts .jpg extension to .webp', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      expect(loader.webpSrc.value).toBe(TEST_SRC_WEBP);
    });

    it('does not modify paths without .jpg extension', () => {
      const { loader } = mountWithLoader(TEST_SRC_PNG);
      expect(loader.webpSrc.value).toBe(TEST_SRC_PNG);
    });

    it('does not modify paths with no extension', () => {
      const { loader } = mountWithLoader(TEST_SRC_NO_EXT);
      expect(loader.webpSrc.value).toBe(TEST_SRC_NO_EXT);
    });

    it('handles empty string src', () => {
      const { loader } = mountWithLoader('');
      expect(loader.webpSrc.value).toBe('');
    });
  });

  describe('handleImageLoad', () => {
    it('sets imageLoaded to true', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      expect(loader.imageLoaded.value).toBe(false);
      loader.handleImageLoad();
      expect(loader.imageLoaded.value).toBe(true);
    });

    it('does not affect imageError', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      loader.handleImageLoad();
      expect(loader.imageError.value).toBe(false);
    });
  });

  describe('handleImageError', () => {
    it('sets imageError to true', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      expect(loader.imageError.value).toBe(false);
      loader.handleImageError();
      expect(loader.imageError.value).toBe(true);
    });

    it('does not affect imageLoaded', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      loader.handleImageError();
      expect(loader.imageLoaded.value).toBe(false);
    });
  });

  describe('onMounted — already-complete image', () => {
    it('sets imageLoaded true if image is already complete with natural height', async () => {
      const { loader, wrapper } = mountWithLoader(TEST_SRC_JPG);

      const imageElement = wrapper.find('img').element as HTMLImageElement;
      Object.defineProperty(imageElement, 'complete', { value: true, configurable: true });
      Object.defineProperty(imageElement, 'naturalHeight', { value: 100, configurable: true });
      loader.imageRef.value = imageElement;

      await nextTick();
      await nextTick();

      loader.handleImageLoad();
      expect(loader.imageLoaded.value).toBe(true);
    });

    it('does not set imageLoaded if image complete but naturalHeight is 0 (broken image)', async () => {
      const { loader, wrapper } = mountWithLoader(TEST_SRC_JPG);

      const imageElement = wrapper.find('img').element as HTMLImageElement;
      Object.defineProperty(imageElement, 'complete', { value: true, configurable: true });
      Object.defineProperty(imageElement, 'naturalHeight', { value: 0, configurable: true });
      loader.imageRef.value = imageElement;

      await nextTick();
      await nextTick();

      expect(loader.imageLoaded.value).toBe(false);
    });
  });

  describe('setImageRef', () => {
    it('stores an HTMLImageElement in imageRef', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      const imageElement = document.createElement('img');
      loader.setImageRef(imageElement);
      expect(loader.imageRef.value).toBe(imageElement);
    });

    it('resets imageRef to null when passed null', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      loader.setImageRef(document.createElement('img'));
      loader.setImageRef(null);
      expect(loader.imageRef.value).toBeNull();
    });

    it('ignores non-image elements', () => {
      const { loader } = mountWithLoader(TEST_SRC_JPG);
      loader.setImageRef(document.createElement('div'));
      expect(loader.imageRef.value).toBeNull();
    });
  });
});
