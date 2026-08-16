import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue';
import { computed, nextTick, onMounted, ref } from 'vue';

import { toWebp } from '@/utils/responsiveImage';

interface UseImageLoaderReturn {
  imageRef: Ref<HTMLImageElement | null>;
  setImageRef: (el: Element | ComponentPublicInstance | null) => void;
  imageError: Ref<boolean>;
  imageLoaded: Ref<boolean>;
  webpSrc: ComputedRef<string | undefined>;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

/**
 * Composable for handling image loading state with WebP support
 * @param src - Original image source path (jpg)
 * @returns Image loading state and handlers
 */
export const useImageLoader = (src: string): UseImageLoaderReturn => {
  const imageRef = ref<HTMLImageElement | null>(null);
  const imageError = ref(false);
  const imageLoaded = ref(false);

  const webpSrc = computed(() => (src ? toWebp(src) : src));

  // Callback ref: bound via `:ref` in templates so the composable owns the
  // <img> element. Needed for the already-complete fast-path below to work
  // when a cached image never re-fires `load` after hydration.
  const setImageRef = (el: Element | ComponentPublicInstance | null): void => {
    imageRef.value = el instanceof HTMLImageElement ? el : null;
  };

  onMounted(async () => {
    await nextTick();
    if (imageRef.value?.complete && imageRef.value?.naturalHeight > 0) {
      imageLoaded.value = true;
    }
  });

  const handleImageLoad = (): void => {
    imageLoaded.value = true;
  };

  const handleImageError = (): void => {
    imageError.value = true;
  };

  return {
    imageRef,
    setImageRef,
    imageError,
    imageLoaded,
    webpSrc,
    handleImageLoad,
    handleImageError,
  };
};
