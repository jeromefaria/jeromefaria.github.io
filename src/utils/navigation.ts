/**
 * Update the URL hash without triggering navigation
 * @param id - The hash ID to set (without the # prefix)
 */
export const updateHash = (id: string): void => {
  window.history.replaceState(null, '', `#${id}`);
};

/** Clear the URL hash without triggering navigation. */
export const clearHash = (): void => {
  window.history.replaceState(null, '', window.location.pathname);
};

/**
 * Find the key of the section whose items contain the given id.
 * @returns the section key, or null when no section contains it
 */
export const findSectionContainingId = (
  sectionKeys: string[],
  data: Record<string, { items?: { id: string }[] }>,
  id: string,
): string | null =>
  sectionKeys.find(key => data[key]?.items?.some(item => item.id === id)) ?? null;
