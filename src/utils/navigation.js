/**
 * Update the URL hash without triggering navigation
 * @param {string} id - The hash ID to set (without the # prefix)
 */
export const updateHash = id => {
  window.history.replaceState(null, '', `#${id}`);
};
