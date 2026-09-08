export const isEditable = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;

  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
};

export const isActivatable = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;

  return element.tagName === 'BUTTON' || element.tagName === 'A' || element.getAttribute('role') === 'button';
};
