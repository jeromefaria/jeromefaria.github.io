import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';

import { useCommandPalette } from './useCommandPalette';
import { paletteOpen } from './useOverlays';

type Api = ReturnType<typeof useCommandPalette>;

const mountPalette = async (): Promise<{ api: Api; router: Router; wrapper: VueWrapper }> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  await router.push('/');
  await router.isReady();

  let api: Api | null = null;
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useCommandPalette();
        return () => null;
      },
    }),
    { global: { plugins: [router] } },
  );

  if (!api) throw new Error('useCommandPalette did not initialise');
  return { api, router, wrapper };
};

const press = (key: string, modifiers: Partial<KeyboardEvent> = {}): KeyboardEvent =>
  new KeyboardEvent('keydown', { key, cancelable: true, ...modifiers });

describe('useCommandPalette', () => {
  let active: VueWrapper | null = null;

  beforeEach(() => {
    localStorage.clear();
    paletteOpen.value = false;
  });

  afterEach(() => {
    active?.unmount();
    active = null;
    paletteOpen.value = false;
    document.body.style.overflow = '';
  });

  it('reflects the shared open state and closes via close()', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    expect(api.isOpen.value).toBe(true);

    api.close();
    expect(api.isOpen.value).toBe(false);
  });

  it('shows curated navigation on an empty query', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    expect(api.results.value.every(command => command.kind === 'navigate')).toBe(true);
    expect(api.results.value.some(command => command.title === 'Works')).toBe(true);
  });

  it('fuzzy-filters on a query', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    api.query.value = 'privacy';
    expect(api.results.value[0]?.title).toBe('Privacy');
  });

  it('wraps the active index at both ends', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    const last = api.results.value.length - 1;

    api.handleKeydown(press('ArrowUp'));
    expect(api.activeIndex.value).toBe(last);

    api.handleKeydown(press('ArrowDown'));
    expect(api.activeIndex.value).toBe(0);
  });

  it('moves with the fzf bindings (Ctrl-j / Ctrl-k)', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    api.handleKeydown(press('j', { ctrlKey: true }));
    expect(api.activeIndex.value).toBe(1);

    api.handleKeydown(press('k', { ctrlKey: true }));
    expect(api.activeIndex.value).toBe(0);
  });

  it('closes on Escape', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    api.handleKeydown(press('Escape'));
    expect(api.isOpen.value).toBe(false);
  });

  it('navigates via the router when a navigate command is executed', async () => {
    const { api, router, wrapper } = await mountPalette();
    active = wrapper;
    const push = vi.spyOn(router, 'push');

    api.query.value = 'privacy';
    await api.execute(0);

    expect(push).toHaveBeenCalledWith('/privacy');
    expect(api.isOpen.value).toBe(false);
  });

  it('opens an internal target in a new tab with the modifier', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;
    const open = vi.spyOn(window, 'open').mockReturnValue(null);

    api.query.value = 'privacy';
    await api.execute(0, true);

    expect(open).toHaveBeenCalledWith(expect.stringContaining('/privacy'), '_blank', 'noopener,noreferrer');
  });

  it('executes the active command on Enter', async () => {
    const { api, router, wrapper } = await mountPalette();
    active = wrapper;
    const push = vi.spyOn(router, 'push');

    api.query.value = 'privacy';
    api.handleKeydown(press('Enter'));
    await flushPromises();

    expect(push).toHaveBeenCalledWith('/privacy');
  });

  it('half-pages with Ctrl-d and Ctrl-u', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    api.handleKeydown(press('d', { ctrlKey: true }));
    expect(api.activeIndex.value).toBe(5);

    api.handleKeydown(press('u', { ctrlKey: true }));
    expect(api.activeIndex.value).toBe(0);
  });

  it('closes on Ctrl-c and traps Tab', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    const tab = press('Tab');
    api.handleKeydown(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(api.activeIndex.value).toBe(0);

    api.handleKeydown(press('c', { ctrlKey: true }));
    expect(api.isOpen.value).toBe(false);
  });

  it('runs an action command and closes; ignores an out-of-range index', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;
    const open = vi.spyOn(window, 'open').mockReturnValue(null);

    api.query.value = 'download press kit pdf';
    const index = api.results.value.findIndex(command => command.id === 'act:press-kit-pdf');
    expect(index).toBeGreaterThanOrEqual(0);

    await api.execute(index);
    expect(open).toHaveBeenCalled();
    expect(api.isOpen.value).toBe(false);

    paletteOpen.value = true;
    await api.execute(9999);
    expect(api.isOpen.value).toBe(true);
  });

  it('remembers executed commands and surfaces them under Recent', async () => {
    const first = await mountPalette();
    active = first.wrapper;

    first.api.query.value = 'privacy';
    await first.api.execute(0);
    first.wrapper.unmount();

    const second = await mountPalette();
    active = second.wrapper;
    paletteOpen.value = true;

    expect(second.api.results.value[0]?.group).toBe('Recent');
    expect(second.api.results.value[0]?.title).toBe('Privacy');
  });

  const executeByTitle = async (api: Api, title: string): Promise<void> => {
    api.query.value = title;
    await api.execute(api.results.value.findIndex(command => command.title === title));
  };

  it('dedupes recents and caps them at five', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    for (const title of ['Home', 'Works', 'Live', 'Press', 'About', 'Contact']) {
      await executeByTitle(api, title);
    }
    const recents: string[] = JSON.parse(localStorage.getItem('command-palette:recents') ?? '[]');
    expect(recents).toHaveLength(5);
    expect(new Set(recents).size).toBe(5);

    await executeByTitle(api, 'Works');
    const afterRepeat: string[] = JSON.parse(localStorage.getItem('command-palette:recents') ?? '[]');
    expect(afterRepeat).toHaveLength(5);
    expect(afterRepeat[0]).toBe('nav:works');
  });

  it('ignores malformed recents in storage', async () => {
    localStorage.setItem('command-palette:recents', 'not json');
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    expect(api.results.value.every(command => command.group === 'Navigate')).toBe(true);
  });

  it('filters non-string recent ids from storage', async () => {
    localStorage.setItem('command-palette:recents', JSON.stringify(['nav:privacy', 42, null]));
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    paletteOpen.value = true;
    const recentTitles = api.results.value.filter(command => command.group === 'Recent').map(command => command.title);
    expect(recentTitles).toEqual(['Privacy']);
  });

  it('does not list a recent navigation item twice', async () => {
    const { api, wrapper } = await mountPalette();
    active = wrapper;

    api.query.value = 'privacy';
    await api.execute(0);
    api.query.value = '';

    expect(api.results.value.filter(command => command.title === 'Privacy')).toHaveLength(1);
  });
});
