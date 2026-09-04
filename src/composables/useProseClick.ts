import { openCommandPalette } from '@/composables/useOverlays';
import { useProseLinks } from '@/composables/useProseLinks';

export const useProseClick = (): ((event: MouseEvent) => void) => {
  const routeProseLink = useProseLinks();

  return (event: MouseEvent): void => {
    if ((event.target as HTMLElement).closest('.palette-cue')) {
      openCommandPalette();
      return;
    }

    routeProseLink(event);
  };
};
