import { onMounted, onUnmounted, ref } from 'vue';

/**
 * @typedef {Object} Lightbox
 * @property {import('vue').Ref<boolean>} isOpen - Whether lightbox is open
 * @property {import('vue').Ref<Object|null>} currentItem - Current item (image or video)
 * @property {import('vue').Ref<number>} currentIndex - Current item index
 * @property {import('vue').Ref<Array<Object>>} items - Array of all items
 * @property {Function} openLightbox - Open lightbox with items array and index
 * @property {Function} closeLightbox - Close lightbox and reset state
 * @property {Function} goToNext - Navigate to next item
 * @property {Function} goToPrev - Navigate to previous item
 */

/**
 * Lightbox state management for viewing images and videos in fullscreen
 * Handles keyboard navigation (Escape, Left/Right arrows) and state management
 * @returns {Lightbox} Lightbox state and controls
 */
export const useLightbox = () => {
  const isOpen = ref(false);
  const currentItem = ref(null);
  const currentIndex = ref(0);
  const items = ref([]);

  const openLightbox = (allItems = [], index = 0) => {
    items.value = allItems;
    currentIndex.value = index;
    updateCurrentItem(index);
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    isOpen.value = false;
    currentItem.value = null;
    items.value = [];
    currentIndex.value = 0;
    document.body.style.overflow = '';
  };

  const updateCurrentItem = index => {
    const item = items.value[index];
    if (!item) return;

    // Support both image and video items
    // Images have 'src', videos have 'url'
    currentItem.value = item;
  };

  const goToNext = () => {
    if (currentIndex.value >= items.value.length - 1) return;

    currentIndex.value++;
    updateCurrentItem(currentIndex.value);
  };

  const goToPrev = () => {
    if (currentIndex.value <= 0) return;

    currentIndex.value--;
    updateCurrentItem(currentIndex.value);
  };

  const keyHandlers = {
    Escape: closeLightbox,
    ArrowRight: goToNext,
    ArrowLeft: goToPrev,
  };

  const handleKeydown = event => {
    if (!isOpen.value) return;

    const handler = keyHandlers[event.key];
    handler?.();
  };

  const abortController = new AbortController();

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown, { signal: abortController.signal });
  });

  onUnmounted(() => {
    abortController.abort();
    document.body.style.overflow = '';
  });

  return {
    isOpen,
    currentItem,
    currentIndex,
    items,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
  };
};
