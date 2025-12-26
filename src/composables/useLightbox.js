import { ref, onMounted, onUnmounted } from 'vue';

export function useLightbox() {
  const isOpen = ref(false);
  const currentImage = ref(null);
  const currentIndex = ref(0);
  const images = ref([]);

  const openLightbox = (allImages = [], index = 0) => {
    images.value = allImages;
    currentIndex.value = index;
    updateCurrentImage(index);
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    isOpen.value = false;
    currentImage.value = null;
    images.value = [];
    currentIndex.value = 0;
    document.body.style.overflow = '';
  };

  const updateCurrentImage = (index) => {
    const image = images.value[index];
    if (!image) return;

    const { src, alt } = image;
    currentImage.value = { src, alt };
  };

  const goToNext = () => {
    if (currentIndex.value >= images.value.length - 1) return;

    currentIndex.value++;
    updateCurrentImage(currentIndex.value);
  };

  const goToPrev = () => {
    if (currentIndex.value <= 0) return;

    currentIndex.value--;
    updateCurrentImage(currentIndex.value);
  };

  const keyHandlers = {
    Escape: closeLightbox,
    ArrowRight: goToNext,
    ArrowLeft: goToPrev,
  };

  const handleKeydown = (event) => {
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
    currentImage,
    currentIndex,
    images,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrev,
  };
}
