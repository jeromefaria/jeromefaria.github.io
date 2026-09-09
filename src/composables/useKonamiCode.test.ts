import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const type = (keys: string[]): void => keys.forEach(key => window.dispatchEvent(new KeyboardEvent('keydown', { key })));

describe('useKonamiCode', () => {
  let player: typeof import('@/composables/usePlayer');
  let useKonamiCode: typeof import('@/composables/useKonamiCode').useKonamiCode;
  let flags: typeof import('@/composables/useFeatureFlags');

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    player = await import('@/composables/usePlayer');
    ({ useKonamiCode } = await import('@/composables/useKonamiCode'));
    flags = await import('@/composables/useFeatureFlags');
  });

  const mountEgg = () => mount(defineComponent({
    setup() {
      useKonamiCode();
      return () => h('div');
    },
  }));

  it('plays a random track in immersive mode when the full code is entered', async () => {
    mountEgg();

    type(KONAMI);
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(true);
    expect(player.usePlayer().queue.value.length).toBeGreaterThan(0);
  });

  it('does nothing on a partial or wrong sequence', async () => {
    mountEgg();

    type(['ArrowUp', 'ArrowUp', 'ArrowUp']);
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(false);
    expect(player.usePlayer().queue.value).toHaveLength(0);
  });

  it('stays silent when the audio player is disabled', async () => {
    flags.audioPlayerEnabled.value = false;
    mountEgg();

    type(KONAMI);
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(false);
  });

  it('detaches its listener on unmount', async () => {
    mountEgg().unmount();

    type(KONAMI);
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(false);
  });
});
