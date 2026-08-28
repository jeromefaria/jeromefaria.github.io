import { useRouter } from 'vue-router';

// Internal links inside v-html prose are raw anchors, so a click triggers a full
// page reload — which flashes the theme and unstyled content on the SSG page.
// This routes those clicks through the SPA router instead. External, download,
// new-tab, hash-only, and modifier/middle clicks are left to the browser.
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
