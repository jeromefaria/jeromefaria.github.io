export const updateHash = (id: string): void => {
  window.history.replaceState(null, '', `#${id}`);
};

export const clearHash = (): void => {
  window.history.replaceState(null, '', window.location.pathname);
};

export const findSectionContainingId = (
  sectionKeys: string[],
  data: Record<string, { items?: { id: string }[] }>,
  id: string,
): string | null =>
  sectionKeys.find(key => data[key]?.items?.some(item => item.id === id)) ?? null;
