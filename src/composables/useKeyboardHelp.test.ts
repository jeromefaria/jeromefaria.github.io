import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, nextTick } from 'vue';

import { useKeyboardHelp } from './useKeyboardHelp';
import { helpOpen } from './useOverlays';

type Api = ReturnType<typeof useKeyboardHelp>;

const mountHelp = (): { api: Api; wrapper: VueWrapper } => {
  let api: Api | null = null;
  const wrapper = mount(defineComponent({
    setup() {
      api = useKeyboardHelp();
      return () => null;
    },
  }));

  if (!api) throw new Error('useKeyboardHelp did not initialise');
  return { api, wrapper };
};

describe('useKeyboardHelp', () => {
  let active: VueWrapper | null = null;

  afterEach(() => {
    helpOpen.value = false;
    active?.unmount();
    active = null;
    document.body.style.overflow = '';
  });

  it('mirrors the shared helpOpen and locks scroll while open', async () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;
    expect(api.isOpen.value).toBe(false);

    helpOpen.value = true;
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('close() clears helpOpen and releases scroll', async () => {
    const { api, wrapper } = mountHelp();
    active = wrapper;

    helpOpen.value = true;
    await nextTick();

    api.close();
    expect(helpOpen.value).toBe(false);
    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });
});
