import { useRouter } from 'vue-router';

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
