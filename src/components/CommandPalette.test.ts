import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { paletteOpen } from '@/composables/useOverlays';

import CommandPalette from './CommandPalette.vue';

const mountPalette = async (): Promise<VueWrapper> => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  await router.push('/');
  await router.isReady();

  return mount(CommandPalette, { global: { plugins: [router] }, attachTo: document.body });
};

const openPalette = async (): Promise<void> => {
  paletteOpen.value = true;
  await nextTick();
  await nextTick();
};

const palette = (): Element | null => document.querySelector('.command-palette');

const requireInput = (): HTMLInputElement => {
  const input = document.querySelector<HTMLInputElement>('.command-palette__input');
  if (!input) throw new Error('command palette input not found');
  return input;
};

describe('CommandPalette', () => {
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

  it('renders nothing until it is summoned', async () => {
    active = await mountPalette();
    expect(palette()).toBeNull();
  });

  it('opens on Cmd+K as a combobox wired to the listbox', async () => {
    active = await mountPalette();
    await openPalette();

    const input = requireInput();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe('command-palette-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('shows curated navigation with a group header and an active option when empty', async () => {
    active = await mountPalette();
    await openPalette();

    expect(document.querySelector('.command-palette__group')?.textContent?.trim()).toBe('Navigate');
    expect(document.querySelector('[role="option"][aria-selected="true"]')).not.toBeNull();
  });

  it('filters as you type and tracks the active descendant', async () => {
    active = await mountPalette();
    await openPalette();

    const input = requireInput();
    input.value = 'privacy';
    input.dispatchEvent(new Event('input'));
    await nextTick();

    const options = [...document.querySelectorAll('[role="option"]')];
    expect(options[0]?.textContent).toContain('Privacy');
    expect(input.getAttribute('aria-activedescendant')).toBe('command-palette-option-0');
  });

  it('closes on Escape', async () => {
    active = await mountPalette();
    await openPalette();

    requireInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }));
    await nextTick();

    expect(palette()).toBeNull();
  });

  it('executes and closes when an option is clicked', async () => {
    active = await mountPalette();
    await openPalette();

    const input = requireInput();
    input.value = 'privacy';
    input.dispatchEvent(new Event('input'));
    await nextTick();

    document.querySelector<HTMLElement>('[role="option"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(palette()).toBeNull();
  });

  it('shows a no-match message for an unmatched query', async () => {
    active = await mountPalette();
    await openPalette();

    const input = requireInput();
    input.value = 'zzzzzznothing';
    input.dispatchEvent(new Event('input'));
    await nextTick();

    expect(document.querySelector('.command-palette__empty')?.textContent).toContain('No matches');
  });

  it('moves the active option with ArrowDown', async () => {
    active = await mountPalette();
    await openPalette();

    requireInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }));
    await nextTick();
    await nextTick();

    expect(requireInput().getAttribute('aria-activedescendant')).toBe('command-palette-option-1');
  });

  it('activates the hovered option on mousemove', async () => {
    active = await mountPalette();
    await openPalette();

    const options = document.querySelectorAll<HTMLElement>('[role="option"]');
    options[2]?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    await nextTick();

    expect(options[2]?.getAttribute('aria-selected')).toBe('true');
  });

  it('restores focus to the trigger element on close', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    active = await mountPalette();
    await openPalette();
    requireInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
