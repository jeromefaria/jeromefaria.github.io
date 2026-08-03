import type { Ref } from 'vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface UseHashScrollOptions {
  /** Run the handler once on mount if the URL already has a hash. */
  immediate?: boolean;
}

interface UseHashScrollReturn {
  isInitialLoad: Ref<boolean>;
}

/**
 * Runs `onHash` when the URL hash changes after the initial render (and,
 * optionally, once on mount). Centralises the `isInitialLoad` + hash-watch
 * plumbing shared by the accordion and the press page.
 * @param onHash - Handler invoked with the (non-empty) hash
 * @param options - `immediate` fires the handler on mount when a hash is present
 * @returns `isInitialLoad`, which consumers can read to gate side effects
 */
export const useHashScroll = (
  onHash: (hash: string) => void,
  { immediate = false }: UseHashScrollOptions = {},
): UseHashScrollReturn => {
  const route = useRoute();
  const isInitialLoad = ref(true);

  onMounted(() => {
    if (immediate && route.hash) onHash(route.hash);
    nextTick(() => {
      isInitialLoad.value = false;
    });
  });

  watch(() => route.hash, hash => {
    if (!isInitialLoad.value && hash) onHash(hash);
  });

  return { isInitialLoad };
};
