import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const type = (keys: string[]): void => keys.forEach(key => window.dispatchEvent(new KeyboardEvent('keydown', { key })));

const KONAMI_CODE_POINTS = [0x2b06, 0x2b06, 0x2b07, 0x2b07, 0x2b05, 0x27a1, 0x2b05, 0x27a1, 0x1f171, 0x1f170];
const KONAMI_EMOJI = String.fromCodePoint(...KONAMI_CODE_POINTS);
const KONAMI_EMOJI_WITH_SELECTORS = KONAMI_CODE_POINTS.map(point => String.fromCodePoint(point, 0xfe0f)).join('');

describe('useKonamiCode', () => {
  let player: typeof import('@/composables/usePlayer');
  let useKonamiCode: typeof import('@/composables/useKonamiCode').useKonamiCode;
  let triggerKonamiSurprise: typeof import('@/composables/useKonamiCode').triggerKonamiSurprise;
  let isKonamiEmojiSequence: typeof import('@/composables/useKonamiCode').isKonamiEmojiSequence;
  let flags: typeof import('@/composables/useFeatureFlags');

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    player = await import('@/composables/usePlayer');
    ({ useKonamiCode, triggerKonamiSurprise, isKonamiEmojiSequence } = await import('@/composables/useKonamiCode'));
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

  it('matches the emoji sequence with or without variation selectors, trimmed', () => {
    expect(isKonamiEmojiSequence(KONAMI_EMOJI)).toBe(true);
    expect(isKonamiEmojiSequence(KONAMI_EMOJI_WITH_SELECTORS)).toBe(true);
    expect(isKonamiEmojiSequence(`  ${KONAMI_EMOJI_WITH_SELECTORS}  `)).toBe(true);
  });

  it('rejects partial, wrong, or empty emoji input', () => {
    expect(isKonamiEmojiSequence('')).toBe(false);
    expect(isKonamiEmojiSequence(String.fromCodePoint(0x2b06, 0x2b06))).toBe(false);
    expect(isKonamiEmojiSequence('privacy')).toBe(false);
    expect(isKonamiEmojiSequence(`${KONAMI_EMOJI}x`)).toBe(false);
  });

  it('triggers the surprise directly, playing a random track in immersive mode', async () => {
    triggerKonamiSurprise();
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(true);
    expect(player.usePlayer().queue.value.length).toBeGreaterThan(0);
  });

  it('leaves the surprise silent when the audio player is disabled', async () => {
    flags.audioPlayerEnabled.value = false;
    triggerKonamiSurprise();
    await flushPromises();

    expect(player.usePlayer().immersive.value).toBe(false);
  });
});
