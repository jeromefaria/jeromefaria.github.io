import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Component, defineComponent, nextTick, reactive, ref } from 'vue';

import { useImmersivePermalink } from './useImmersivePermalink';

const mockRoute = reactive<{ query: Record<string, string> }>({ query: {} });
const replace = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ replace }),
}));

const immersive = ref(false);
const currentTrack = ref<{ key: string } | null>(null);

vi.mock('@/composables/usePlayer', () => ({
  usePlayer: () => ({ immersive, currentTrack }),
}));

vi.mock('@/data/audio', () => ({
  getReleaseAudio: (id: string) =>
    (id === 'overlapse' ? [{ key: 'overlapse/01' }, { key: 'overlapse/02' }] : []),
}));

const releaseId = ref('overlapse');

let wrapper: VueWrapper;

const component: Component = defineComponent({
  setup() {
    useImmersivePermalink(releaseId);
    return {};
  },
  template: '<div />',
});

const createComponent = (): void => {
  wrapper = mount(component);
};

describe('useImmersivePermalink', () => {
  beforeEach(() => {
    mockRoute.query = {};
    immersive.value = false;
    currentTrack.value = null;
    releaseId.value = 'overlapse';
    replace.mockClear();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('writes i=1 when immersive opens while this release is playing', async () => {
    currentTrack.value = { key: 'overlapse/01' };
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).toHaveBeenCalledWith({ query: { i: '1' } });
  });

  it('preserves existing query params when writing i=1', async () => {
    mockRoute.query = { track: '3' };
    currentTrack.value = { key: 'overlapse/02' };
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).toHaveBeenCalledWith({ query: { track: '3', i: '1' } });
  });

  it('does not write i=1 when a different release is playing', async () => {
    currentTrack.value = { key: 'other/01' };
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).not.toHaveBeenCalled();
  });

  it('does not write i=1 when nothing is playing', async () => {
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).not.toHaveBeenCalled();
  });

  it('does not write i=1 when there is no focused release', async () => {
    releaseId.value = '';
    currentTrack.value = { key: 'overlapse/01' };
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).not.toHaveBeenCalled();
  });

  it('does not re-write i=1 when it is already present', async () => {
    mockRoute.query = { i: '1' };
    currentTrack.value = { key: 'overlapse/01' };
    createComponent();

    immersive.value = true;
    await nextTick();

    expect(replace).not.toHaveBeenCalled();
  });

  it('strips i when immersive closes, keeping other params', async () => {
    mockRoute.query = { i: '1', track: '2' };
    currentTrack.value = { key: 'overlapse/01' };
    createComponent();

    immersive.value = true;
    await nextTick();
    immersive.value = false;
    await nextTick();

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenLastCalledWith({ query: { track: '2' } });
  });

  it('does nothing on close when no i param is present', async () => {
    createComponent();

    immersive.value = true;
    await nextTick();
    immersive.value = false;
    await nextTick();

    expect(replace).not.toHaveBeenCalled();
  });
});
