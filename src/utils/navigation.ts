/**
 * Update the URL hash without triggering navigation
 * @param id - The hash ID to set (without the # prefix)
 */
export const updateHash = (id: string): void => {
  window.history.replaceState(null, '', `#${id}`);
};
