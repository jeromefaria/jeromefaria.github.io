import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue';
import { computed, nextTick, onMounted, ref } from 'vue';

import { toWebp } from '@/utils/responsiveImage';

interface UseImageLoaderReturn {
  imageRef: Ref<HTMLImageElement | null>;
  setImageRef: (element: Element | ComponentPublicInstance | null) => void;
  imageError: Ref<boolean>;
  imageLoaded: Ref<boolean>;
  webpSrc: ComputedRef<string | undefined>;
  handleImageLoad: () => void;
  handleImageError: () => void;
}

export const useImageLoader = (src: string): UseImageLoaderReturn => {
  const imageRef = ref<HTMLImageElement | null>(null);
  const imageError = ref(false);
  const imageLoaded = ref(false);

  const webpSrc = computed(() => (src ? toWebp(src) : src));

  const setImageRef = (element: Element | ComponentPublicInstance | null): void => {
    imageRef.value = element instanceof HTMLImageElement ? element : null;
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
