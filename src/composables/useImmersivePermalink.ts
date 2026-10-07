import type { Ref } from 'vue';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { usePlayer } from '@/composables/usePlayer';
import { getReleaseAudio } from '@/data/audio';

export const useImmersivePermalink = (releaseId: Ref<string>): void => {
  const route = useRoute();
  const router = useRouter();
  const { immersive, currentTrack } = usePlayer();

  const playingThisRelease = computed(() => {
    const key = currentTrack.value?.key;
    if (key === undefined || !releaseId.value) return false;

    return getReleaseAudio(releaseId.value).some(track => track.key === key);
  });

  watch(immersive, open => {
    const hasParam = route.query['i'] === '1';

    if (open) {
      if (hasParam || !playingThisRelease.value) return;

      void router.replace({ query: { ...route.query, i: '1' } });
      return;
    }

    if (!hasParam) return;

    const query = { ...route.query };
    delete query['i'];
    void router.replace({ query });
  });
};
