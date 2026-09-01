import { openCommandPalette } from '@/composables/useOverlays';
import { useProseLinks } from '@/composables/useProseLinks';

// Prose bodies embed a `.palette-cue` button that opens the command palette;
// every other click falls through to internal-link routing.
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
