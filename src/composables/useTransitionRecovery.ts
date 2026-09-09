import { type Ref, ref } from 'vue';

import { usePageLifecycle } from './usePageLifecycle';

export const useTransitionRecovery = (): Ref<number> => {
  const remountKey = ref(0);

  // eslint-disable-next-line local/no-comments -- genuine gotcha
  // iOS Safari drops transitionend for a backgrounded tab, which can wedge the RouterView's out-in page transition mid-leave (a leftover .page-leave-active element), freezing all SPA navigation until reload; on resume, bumping the key remounts the view to clear the stuck transition.
  usePageLifecycle({
    onResume: () => {
      if (document.querySelector('.page-leave-active')) remountKey.value += 1;
    },
  });

  return remountKey;
};
