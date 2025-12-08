import { ref, computed, onMounted, nextTick } from 'vue';

/**
 * Composable for handling image loading state with WebP support
 * @param {string} src - Original image source path (jpg)
 * @returns {Object} Image loading state and handlers
 */
export const useImageLoader = (src) => {
  const imageRef = ref(null);
  const imageError = ref(false);
  const imageLoaded = ref(false);

  const webpSrc = computed(() => src?.replace(/\.jpg$/, '.webp'));

  onMounted(async () => {
    await nextTick();
    if (imageRef.value?.complete && imageRef.value?.naturalHeight > 0) {
      imageLoaded.value = true;
    }
  });

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  const handleImageError = () => {
    imageError.value = true;
  };

  return {
    imageRef,
    imageError,
    imageLoaded,
    webpSrc,
    handleImageLoad,
    handleImageError
  };
};
