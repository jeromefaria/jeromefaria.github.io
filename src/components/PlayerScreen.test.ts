import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TRACKS = [
  { key: 'x/1.m4a', title: 'One', duration: 100, artist: 'Alpha' },
  { key: 'x/2.m4a', title: 'Two', duration: 200 },
];

const swipeTouch = (type: 'touchstart' | 'touchend', clientX: number, clientY: number): TouchEvent => {
  const event = new Event(type) as TouchEvent;
  Object.defineProperty(event, type === 'touchstart' ? 'touches' : 'changedTouches', {
    value: [{ clientX, clientY, identifier: 0 } as Touch],
  });
  return event;
};

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
    expect(wrapper.find('.player-screen__queue-item.is-current').attributes('aria-current')).toBe('true');
    expect(wrapper.findAll('.player-screen__queue-item')[1].attributes('aria-current')).toBeUndefined();
  });

  it('prefers per-track artwork over the release cover and falls back when a track has none', async () => {
    await player.play(
      [{ key: 'x/1.m4a', title: 'One', duration: 100, artwork: '/images/tracks/a.jpg' }, TRACKS[1]],
      0,
      { album: 'The Album', artwork: '/cover.jpg' },
    );
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__art img').attributes('src')).toBe('/images/tracks/a.jpg');
    expect(wrapper.find('.player-screen__art source').attributes('srcset')).toBe('/images/tracks/a.webp');

    await wrapper.findAll('.player-screen__queue-item')[1].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__art img').attributes('src')).toBe('/cover.jpg');
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
    const buttons = wrapper.findAll('.transport-controls__button');

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

  it('lists chapters for a chaptered single-file release and seeks between them', async () => {
    const chapters = [
      { title: 'Prólogo: Estado Novo', start: 0 },
      { title: 'Fado: Estados Socialistas', start: 205 },
    ];
    await player.play([{ key: 'b/2504.m4a', title: '2504', duration: 1504 }], 0, { album: '2504', chapters });
    const wrapper = await mounted();

    const rows = wrapper.findAll('.player-screen__queue-item');
    expect(rows).toHaveLength(2);
    expect(wrapper.find('.player-screen__title').text()).toBe('Prólogo: Estado Novo');
    expect(wrapper.find('.player-screen__queue-item.is-current').text()).toContain('Prólogo');

    await rows[1].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__title').text()).toBe('Fado: Estados Socialistas');
    expect(wrapper.find('.player-screen__queue-item.is-current').text()).toContain('Fado');
  });

  it('hides the queue and disables prev/next for a single-track context', async () => {
    await player.play([TRACKS[0]], 0);
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__queue').exists()).toBe(false);
    const buttons = wrapper.findAll('.transport-controls__button');
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
    await wrapper.trigger('keydown', { key: 'Escape' });
    expect(player.usePlayer().expanded.value).toBe(false);
  });

  it('collapses on a fast downward swipe from the top of the sheet', async () => {
    await player.play(TRACKS);
    player.expand();
    const wrapper = await mounted();
    const root = wrapper.get('.player-screen').element;

    const dateNow = vi.spyOn(Date, 'now');
    dateNow.mockReturnValueOnce(1000);
    root.dispatchEvent(swipeTouch('touchstart', 200, 100));
    dateNow.mockReturnValueOnce(1200);
    root.dispatchEvent(swipeTouch('touchend', 200, 220));
    dateNow.mockRestore();

    expect(player.usePlayer().expanded.value).toBe(false);
  });

  it('ignores the swipe when the sheet is scrolled down', async () => {
    await player.play(TRACKS);
    player.expand();
    const wrapper = await mounted();
    const root = wrapper.get('.player-screen').element;
    Object.defineProperty(root, 'scrollTop', { configurable: true, value: 120 });

    const dateNow = vi.spyOn(Date, 'now');
    dateNow.mockReturnValueOnce(1000);
    root.dispatchEvent(swipeTouch('touchstart', 200, 100));
    dateNow.mockReturnValueOnce(1200);
    root.dispatchEvent(swipeTouch('touchend', 200, 220));
    dateNow.mockRestore();

    expect(player.usePlayer().expanded.value).toBe(true);
  });

  it('restores focus to the trigger when it closes', async () => {
    await player.play(TRACKS);
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = await mounted();
    expect(document.activeElement).not.toBe(trigger);

    wrapper.unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('traps Tab focus within the dialog', async () => {
    await player.play(TRACKS);
    const wrapper = await mounted();

    const dialog = wrapper.get('.player-screen').element;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    await wrapper.trigger('keydown', { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('offers no artwork zoom when the release has no cover', async () => {
    await player.play(TRACKS, 0);
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__zoom').exists()).toBe(false);
  });

  it('opens the immersive artwork view from the zoom control, and Escape steps back to the screen before collapsing', async () => {
    await player.play(TRACKS, 0, { album: 'The Album', artwork: '/cover.jpg' });
    player.expand();
    const wrapper = await mounted();

    expect(wrapper.find('.player-screen__immersive').exists()).toBe(false);

    await wrapper.find('.player-screen__zoom').trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive').exists()).toBe(true);
    expect(wrapper.find('.player-screen__immersive img').attributes('src')).toBe('/cover.jpg');

    await wrapper.trigger('keydown', { key: 'Escape' });
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive').exists()).toBe(false);
    expect(player.usePlayer().expanded.value).toBe(true);

    await wrapper.trigger('keydown', { key: 'Escape' });
    expect(player.usePlayer().expanded.value).toBe(false);
  });

  it('exits the immersive view via the close control and via the backdrop', async () => {
    await player.play(TRACKS, 0, { artwork: '/cover.jpg' });
    const wrapper = await mounted();

    await wrapper.find('.player-screen__zoom').trigger('click');
    await flushPromises();
    await wrapper.find('.player-screen__immersive-close').trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive').exists()).toBe(false);

    await wrapper.find('.player-screen__zoom').trigger('click');
    await flushPromises();
    await wrapper.find('.player-screen__immersive').trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive').exists()).toBe(false);
  });

  it('toggles playback from the immersive controls', async () => {
    await player.play(TRACKS, 0, { artwork: '/cover.jpg' });
    const wrapper = await mounted();

    await wrapper.find('.player-screen__zoom').trigger('click');
    await flushPromises();
    player.getMediaElement().dispatchEvent(new Event('playing'));
    await flushPromises();

    const controls = wrapper.findAll('.player-screen__immersive .transport-controls__button');
    await controls[1].trigger('click');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('skips tracks from the immersive controls and swaps to the track artwork', async () => {
    const artTracks = [
      { key: 'a/1.m4a', title: 'One', duration: 100, artwork: '/one.jpg' },
      { key: 'a/2.m4a', title: 'Two', duration: 200, artwork: '/two.jpg' },
    ];
    await player.play(artTracks, 0, { album: 'Album', artwork: '/cover.jpg' });
    const wrapper = await mounted();

    await wrapper.find('.player-screen__zoom').trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive img').attributes('src')).toBe('/one.jpg');

    const controls = wrapper.findAll('.player-screen__immersive .transport-controls__button');
    await controls[2].trigger('click');
    await flushPromises();
    expect(wrapper.find('.player-screen__immersive img').attributes('src')).toBe('/two.jpg');
  });
});
