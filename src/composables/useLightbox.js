import { onMounted, onUnmounted, ref } from 'vue';

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
