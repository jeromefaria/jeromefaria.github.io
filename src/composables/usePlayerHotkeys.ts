import { helpOpen, paletteOpen } from '@/composables/useOverlays';
import { usePlayer } from '@/composables/usePlayer';
import { useWindowKeydown } from '@/composables/useWindowKeydown';
import { isActivatable, isEditable } from '@/utils/keyboardTarget';

const SEEK_SMALL = 5;
const SEEK_BIG = 10;

export const usePlayerHotkeys = (): void => {
  const { currentTrack, currentTime, duration, toggle, seek, stepEntry, goToEdge } = usePlayer();

  let pendingG = false;

  const seekBy = (delta: number): void => seek(Math.min(Math.max(currentTime.value + delta, 0), duration.value));

  const bindings: Record<string, () => void> = {
    h: () => seekBy(-SEEK_SMALL),
    l: () => seekBy(SEEK_SMALL),
    H: () => seekBy(-SEEK_BIG),
    L: () => seekBy(SEEK_BIG),
    j: () => stepEntry(1),
    ArrowDown: () => stepEntry(1),
    k: () => stepEntry(-1),
    ArrowUp: () => stepEntry(-1),
    '0': () => seek(0),
    $: () => seek(duration.value),
    G: () => goToEdge('last'),
  };

  const isBlocked = (event: KeyboardEvent): boolean =>
    event.ctrlKey || event.metaKey || event.altKey
    || !currentTrack.value || isEditable(document.activeElement)
    || paletteOpen.value || helpOpen.value;

  const resolve = (event: KeyboardEvent): (() => void) | null => {
    if (event.key === ' ') return isActivatable(document.activeElement) ? null : () => void toggle();
    if (event.key === 'ArrowLeft') return () => seekBy(event.shiftKey ? -SEEK_BIG : -SEEK_SMALL);
    if (event.key === 'ArrowRight') return () => seekBy(event.shiftKey ? SEEK_BIG : SEEK_SMALL);
    return bindings[event.key] ?? null;
  };

  const onKeydown = (event: KeyboardEvent): void => {
    if (isBlocked(event)) return;

    const wasPendingG = pendingG;
    pendingG = false;

    if (event.key === 'g') {
      if (wasPendingG) goToEdge('first');
      else pendingG = true;
      event.preventDefault();
      return;
    }

    const action = resolve(event);
    if (!action) return;

    action();
    event.preventDefault();
  };

  useWindowKeydown(onKeydown);
};
