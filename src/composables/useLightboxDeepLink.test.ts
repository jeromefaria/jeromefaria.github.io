import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';

import type { LightboxItem } from '@/types/lightbox';
import type { LightboxSource } from '@/utils/lightboxPermalink';

import { useLightboxDeepLink } from './useLightboxDeepLink';

const photos: LightboxItem[] = [
  { type: 'image', src: '/1.jpg', alt: 'One' },
  { type: 'image', src: '/2.jpg', alt: 'Two' },
];

const mountWith = (
  entityId: string,
  open: (items: LightboxItem[], index: number, source: LightboxSource) => void,
) =>
  mount(defineComponent({
    setup() {
      useLightboxDeepLink(entityId, { photo: ref(photos) }, open);
      return () => null;
    },
  }));

describe('useLightboxDeepLink', () => {
  enableAutoUnmount(afterEach);

  afterEach(() => {
    window.location.hash = '';
  });

  it('opens the targeted gallery item on mount when the hash matches', async () => {
    window.location.hash = '#ev/photo/2';
    const open = vi.fn();

    mountWith('ev', open);
    await flushPromises();

    expect(open).toHaveBeenCalledWith(photos, 1, { id: 'ev', kind: 'photo' });
  });

  it('ignores a hash that targets a different entity', async () => {
    window.location.hash = '#other/photo/1';
    const open = vi.fn();

    mountWith('ev', open);
    await flushPromises();

    expect(open).not.toHaveBeenCalled();
  });

  it('ignores an out-of-range index', async () => {
    window.location.hash = '#ev/photo/9';
    const open = vi.fn();

    mountWith('ev', open);
    await flushPromises();

    expect(open).not.toHaveBeenCalled();
  });

  it('ignores a plain (non-media) hash', async () => {
    window.location.hash = '#ev';
    const open = vi.fn();

    mountWith('ev', open);
    await flushPromises();

    expect(open).not.toHaveBeenCalled();
  });

  it('opens on forward-navigation (popstate) to a matching media hash', async () => {
    window.location.hash = '';
    const open = vi.fn();
    mountWith('ev', open);
    await flushPromises();
    expect(open).not.toHaveBeenCalled();

    window.history.replaceState(null, '', '#ev/photo/2');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(open).toHaveBeenCalledWith(photos, 1, { id: 'ev', kind: 'photo' });
  });
});
