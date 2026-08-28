import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100, artist: 'Alpha' },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
];

type PlayerModule = typeof import('@/composables/usePlayer');

describe('PlayerScreen', () => {
  let player: PlayerModule;
  let component: typeof import('./PlayerScreen.vue').default;

  beforeEach(async () => {
    vi.resetModules();
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    HTMLMediaElement.prototype.pause = vi.fn();
    HTMLMediaElement.prototype.load = vi.fn();
    player = await import('@/composables/usePlayer');
    component = (await import('./PlayerScreen.vue')).default;
  });

  const mounted = async (): Promise<VueWrapper> => {
    const wrapper = mount(component, { attachTo: document.body });
    await flushPromises();
    return wrapper;
  };

  it('shows the current track, artist, album, and queue', async () => {
    await player.play(TRACKS, 0, { album: 'The Album', artwork: '/cover.jpg' });
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__title').text()).toBe('One');
    expect(wrapper.find('.player-screen__artist').text()).toBe('Alpha');
    expect(wrapper.find('.player-screen__album').text()).toBe('The Album');
    expect(wrapper.find('.player-screen__art img').attributes('src')).toBe('/cover.jpg');
    expect(wrapper.findAll('.player-screen__queue-item')).toHaveLength(2);
    expect(wrapper.find('.player-screen__queue-item.is-current').text()).toContain('One');
  });

  it('falls back to Jerome Faria when a track has no artist', async () => {
    await player.play(TRACKS, 1);
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__artist').text()).toBe('Jerome Faria');
  });

  it('jumps to a track when its queue row is clicked', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();

    await wrapper.findAll('.player-screen__queue-item')[1].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__title').text()).toBe('Two');
  });

  it('drives playback from the large controls and swaps to the pause icon while playing', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();
    const buttons = wrapper.findAll('.player-screen__button');

    await buttons[2].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__title').text()).toBe('Two');

    await buttons[0].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__title').text()).toBe('One');

    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();
    expect(buttons[1].attributes('aria-label')).toBe('Pause');

    await buttons[1].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('hides the queue and disables prev/next for a single-track context', async () => {
    await player.play([TRACKS[0]], 0);
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__queue').exists()).toBe(false);
    const buttons = wrapper.findAll('.player-screen__button');
    expect(buttons[0].attributes('disabled')).toBeDefined();
    expect(buttons[2].attributes('disabled')).toBeDefined();
  });

  it('collapses via the button and via Escape', async () => {
    await player.play(TRACKS);
    player.expand();
    const wrapper = await mounted();

    await wrapper.find('.player-screen__collapse').trigger('click');
    expect(player.usePlayer().expanded.value).toBe(false);

    player.expand();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(player.usePlayer().expanded.value).toBe(false);
  });
});
