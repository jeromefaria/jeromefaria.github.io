import type { ComputedRef, Ref } from 'vue';
import { computed, nextTick, onMounted, ref } from 'vue';

interface UseImageLoaderReturn {
  imageRef: Ref<HTMLImageElement | null>;
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

  const webpSrc = computed(() => src?.replace(/\.jpg$/, '.webp'));

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
    imageError,
    imageLoaded,
    webpSrc,
    handleImageLoad,
    handleImageError,
  };
};
