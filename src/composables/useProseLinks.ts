import { useRouter } from 'vue-router';

// Internal links in v-html prose are raw anchors — a click full-reloads and flashes the SSG theme; route them through the SPA router instead.
export const useProseLinks = (): ((event: MouseEvent) => void) => {
  const router = useRouter();

  return (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;

    event.preventDefault();
    void router.push(href);
  };
};
