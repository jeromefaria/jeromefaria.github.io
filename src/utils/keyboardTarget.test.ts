import { describe, expect, it } from 'vitest';

import { isActivatable, isEditable } from './keyboardTarget';

const element = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host.firstElementChild as HTMLElement;
};

describe('isEditable', () => {
  it('is true for input, textarea, and select', () => {
    expect(isEditable(element('<input>'))).toBe(true);
    expect(isEditable(element('<textarea></textarea>'))).toBe(true);
    expect(isEditable(element('<select></select>'))).toBe(true);
  });

  it('is true for a contenteditable element', () => {
    expect(isEditable(element('<div contenteditable="true"></div>'))).toBe(true);
  });

  it('is false for a non-editable element', () => {
    expect(isEditable(element('<div></div>'))).toBe(false);
    expect(isEditable(element('<button></button>'))).toBe(false);
  });

  it('is false for a non-HTMLElement target', () => {
    expect(isEditable(null)).toBe(false);
    expect(isEditable(new EventTarget())).toBe(false);
  });
});

describe('isActivatable', () => {
  it('is true for button, anchor, and role="button"', () => {
    expect(isActivatable(element('<button></button>'))).toBe(true);
    expect(isActivatable(element('<a></a>'))).toBe(true);
    expect(isActivatable(element('<div role="button"></div>'))).toBe(true);
  });

  it('is false for a plain element', () => {
    expect(isActivatable(element('<span></span>'))).toBe(false);
  });

  it('is false for a non-HTMLElement target', () => {
    expect(isActivatable(null)).toBe(false);
    expect(isActivatable(new EventTarget())).toBe(false);
  });
});
