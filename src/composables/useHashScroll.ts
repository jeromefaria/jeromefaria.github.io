import type { Ref } from 'vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface UseHashScrollOptions {
  immediate?: boolean;
}

interface UseHashScrollReturn {
  isInitialLoad: Ref<boolean>;
}

export const useHashScroll = (
  onHash: (hash: string) => void,
  { immediate = false }: UseHashScrollOptions = {},
): UseHashScrollReturn => {
  const route = useRoute();
  const isInitialLoad = ref(true);

  onMounted(() => {
    if (immediate && route.hash) onHash(route.hash);
    void nextTick(() => {
      isInitialLoad.value = false;
    });
  });

  watch(() => route.hash, hash => {
    if (!isInitialLoad.value && hash) onHash(hash);
  });

  return { isInitialLoad };
};
