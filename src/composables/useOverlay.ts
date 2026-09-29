import type { Ref } from 'vue';
import { nextTick, watch } from 'vue';

import { useFocusScopeGuard } from './useFocusScopeGuard';

export const useOverlay = (isOpen: Ref<boolean>, focusTarget: Ref<HTMLElement | null>): void => {
  const { enter, leave } = useFocusScopeGuard();

  watch(isOpen, async open => {
    if (open) {
      enter();
      await nextTick();
      focusTarget.value?.focus();
      return;
    }

    leave();
  }, { immediate: true });
};
