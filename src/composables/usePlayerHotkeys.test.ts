import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';

type PlayerModule = typeof import('@/composables/usePlayer');
type OverlaysModule = typeof import('@/composables/useOverlays');

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100 },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
  { key: 'x/3.m4a', title: 'Three', duration: 300 },
];

const dispatch = (key: string, modifiers: Partial<KeyboardEvent> = {}): void => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, ...modifiers }));
};

describe('usePlayerHotkeys', () => {
  let player: PlayerModule;
  let overlays: OverlaysModule;
  let wrapper: VueWrapper | null = null;

  const time = (): number => player.usePlayer().currentTime.value;
  const title = (): string | undefined => player.usePlayer().currentTrack.value?.title;

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    player = await import('@/composables/usePlayer');
    overlays = await import('@/composables/useOverlays');
    const { usePlayerHotkeys } = await import('@/composables/usePlayerHotkeys');
    wrapper = mount(defineComponent({
      setup() {
        usePlayerHotkeys();
        return () => null;
      },
    }));
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    overlays.paletteOpen.value = false;
    overlays.helpOpen.value = false;
    document.body.innerHTML = '';
  });

  it('seeks with l/h and the mirrored arrows', async () => {
    await player.play(TRACKS, 0);

    dispatch('l');
    expect(time()).toBe(5);
    dispatch('h');
    expect(time()).toBe(0);
    dispatch('ArrowRight');
    expect(time()).toBe(5);
  });

  it('seeks by the larger step with H/L and Shift+arrows', async () => {
    await player.play(TRACKS, 0);

    dispatch('L');
    expect(time()).toBe(10);
    dispatch('ArrowLeft', { shiftKey: true });
    expect(time()).toBe(0);
  });

  it('toggles playback with Space', async () => {
    await player.play(TRACKS, 0);
    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();

    dispatch(' ');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('leaves Space to a focused control', async () => {
    await player.play(TRACKS, 0);
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    dispatch(' ');
    expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled();
  });

  it('changes track with j/k and the mirrored arrows', async () => {
    await player.play(TRACKS, 0);

    dispatch('j');
    await flushPromises();
    expect(title()).toBe('Two');

    dispatch('ArrowUp');
    await flushPromises();
    expect(title()).toBe('One');
  });

  it('jumps to the track start and end with 0 and $', async () => {
    await player.play(TRACKS, 0);
    dispatch('L');
    expect(time()).toBe(10);

    dispatch('0');
    expect(time()).toBe(0);
    dispatch('$');
    expect(time()).toBe(100);
  });

  it('jumps to the first and last track with gg and G', async () => {
    await player.play(TRACKS, 1);

    dispatch('G');
    await flushPromises();
    expect(title()).toBe('Three');

    dispatch('g');
    dispatch('g');
    await flushPromises();
    expect(title()).toBe('One');
  });

  it('steps chapters with j/k for a chaptered release', async () => {
    const chapters = [{ title: 'A', start: 0 }, { title: 'B', start: 120 }, { title: 'C', start: 240 }];
    await player.play([{ key: 'c/1.m4a', title: 'Whole', duration: 300 }], 0, { chapters });

    dispatch('j');
    expect(time()).toBe(120);
    dispatch('k');
    expect(time()).toBe(0);
  });

  it('jumps to the first and last chapter with gg and G for a chaptered release', async () => {
    const chapters = [{ title: 'A', start: 0 }, { title: 'B', start: 120 }, { title: 'C', start: 240 }];
    await player.play([{ key: 'c/1.m4a', title: 'Whole', duration: 300 }], 0, { chapters });

    dispatch('G');
    expect(time()).toBe(240);

    dispatch('g');
    dispatch('g');
    expect(time()).toBe(0);
  });

  it('does nothing without a loaded track', () => {
    dispatch('l');
    expect(time()).toBe(0);
  });

  it('ignores shortcuts while typing in a field', async () => {
    await player.play(TRACKS, 0);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    dispatch('l');
    expect(time()).toBe(0);
  });

  it('ignores shortcuts while an overlay is open', async () => {
    await player.play(TRACKS, 0);
    overlays.paletteOpen.value = true;

    dispatch('l');
    expect(time()).toBe(0);
  });

  it('ignores modified keys so browser and palette bindings win', async () => {
    await player.play(TRACKS, 0);

    dispatch('l', { metaKey: true });
    expect(time()).toBe(0);
  });
});
