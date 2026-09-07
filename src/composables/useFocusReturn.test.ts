import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFocusReturn } from './useFocusReturn';

describe('useFocusReturn', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('restores focus to the element active at capture time', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { capture, restore } = useFocusReturn();
    capture();

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();
    expect(document.activeElement).toBe(other);

    restore();
    expect(document.activeElement).toBe(trigger);
  });

  it('is a no-op when nothing was captured', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { restore } = useFocusReturn();
    expect(() => restore()).not.toThrow();
    expect(document.activeElement).toBe(trigger);
  });

  it('captures null when no HTMLElement is focused, so restore does nothing', () => {
    const { capture, restore } = useFocusReturn();

    const activeElement = vi.spyOn(document, 'activeElement', 'get').mockReturnValue(null);
    capture();
    activeElement.mockRestore();

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    restore();
    expect(document.activeElement).toBe(trigger);
  });

  it('clears the captured element after restoring', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { capture, restore } = useFocusReturn();
    capture();

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();
    restore();
    expect(document.activeElement).toBe(trigger);

    other.focus();
    restore();
    expect(document.activeElement).toBe(other);
  });

  it('suppresses the focus ring on restore for a pointer-opened overlay, then clears it on the next keydown', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    vi.spyOn(trigger, 'matches').mockReturnValue(false);

    const { capture, restore } = useFocusReturn();
    capture();

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();

    restore();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.style.outline).toContain('none');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(trigger.style.outline).toBe('');
  });

  it('keeps the focus ring on restore for a keyboard-opened overlay', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    vi.spyOn(trigger, 'matches').mockReturnValue(true);

    const { capture, restore } = useFocusReturn();
    capture();

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();

    restore();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.style.outline).toBe('');
  });

  it('clears ring suppression when the restored element loses focus', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    vi.spyOn(trigger, 'matches').mockReturnValue(false);

    const { capture, restore } = useFocusReturn();
    capture();

    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();

    restore();
    expect(trigger.style.outline).toContain('none');

    trigger.dispatchEvent(new FocusEvent('blur'));
    expect(trigger.style.outline).toBe('');
  });
});
