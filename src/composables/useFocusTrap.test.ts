import { afterEach, describe, expect, it } from 'vitest';
import { shallowRef } from 'vue';

import { useFocusTrap } from './useFocusTrap';

const makeDialog = (buttonCount: number): { dialog: HTMLElement; buttons: HTMLButtonElement[] } => {
  const dialog = document.createElement('div');
  dialog.tabIndex = -1;

  const buttons = Array.from({ length: buttonCount }, (_, index) => {
    const button = document.createElement('button');
    button.textContent = `button-${index}`;
    dialog.appendChild(button);
    return button;
  });

  document.body.appendChild(dialog);
  return { dialog, buttons };
};

const tab = (shiftKey = false): KeyboardEvent => new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true });

describe('useFocusTrap', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('wraps Tab from the last focusable to the first', () => {
    const { dialog, buttons } = makeDialog(3);
    const { onKeydown } = useFocusTrap(shallowRef(dialog));
    buttons[2].focus();

    const event = tab();
    onKeydown(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('wraps Shift+Tab from the first focusable to the last', () => {
    const { dialog, buttons } = makeDialog(3);
    const { onKeydown } = useFocusTrap(shallowRef(dialog));
    buttons[0].focus();

    const event = tab(true);
    onKeydown(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('leaves a non-boundary Tab to the browser', () => {
    const { dialog, buttons } = makeDialog(3);
    const { onKeydown } = useFocusTrap(shallowRef(dialog));
    buttons[1].focus();

    const event = tab();
    onKeydown(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('ignores non-Tab keys', () => {
    const { dialog } = makeDialog(2);
    const { onKeydown } = useFocusTrap(shallowRef(dialog));

    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    onKeydown(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('focuses the container when it holds no focusable children', () => {
    const { dialog } = makeDialog(0);
    const { onKeydown } = useFocusTrap(shallowRef(dialog));

    const event = tab();
    onKeydown(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(dialog);
  });
});
