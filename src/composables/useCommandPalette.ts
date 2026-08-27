import type { ComputedRef, Ref } from 'vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { buildCommands } from '@/data/commands';
import type { Command } from '@/types/command';
import { fuzzyRank } from '@/utils/fuzzy';

import { useScrollLock } from './useScrollLock';

const RECENTS_KEY = 'command-palette:recents';
const RECENTS_MAX = 5;
const PAGE = 5;

const loadRecents = (): string[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
};

const saveRecents = (ids: string[]): void => {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode, SSR) — recents are best-effort.
  }
};

interface UseCommandPaletteReturn {
  isOpen: Ref<boolean>;
  query: Ref<string>;
  activeIndex: Ref<number>;
  results: ComputedRef<Command[]>;
  open: () => void;
  close: () => void;
  handleKeydown: (event: KeyboardEvent) => void;
  execute: (index?: number, newTab?: boolean) => Promise<void>;
}

// Owns the palette's state machine and the global ⌘K/Ctrl-K trigger. Mounted
// once (in CommandPalette.vue), so it behaves as a single global instance.
export const useCommandPalette = (): UseCommandPaletteReturn => {
  const router = useRouter();
  const { lock, unlock } = useScrollLock();

  const commands = buildCommands();
  const byId = new Map(commands.map(command => [command.id, command]));

  const isOpen = ref(false);
  const query = ref('');
  const activeIndex = ref(0);
  const recentIds = ref<string[]>(loadRecents());

  const recentCommands = computed<Command[]>(() =>
    recentIds.value
      .map(id => byId.get(id))
      .filter((command): command is Command => command !== undefined)
      .map(command => ({ ...command, group: 'Recent' as const })));

  // Empty query → curated defaults (recents, then navigation). A query → the
  // fuzzy-ranked union of everything.
  const results = computed<Command[]>(() => {
    if (query.value.trim() === '') {
      const recents = recentCommands.value;
      const recentSet = new Set(recents.map(command => command.id));
      const navigation = commands.filter(command => command.kind === 'navigate' && !recentSet.has(command.id));
      return [...recents, ...navigation];
    }

    return fuzzyRank(query.value, commands);
  });

  watch(results, () => {
    activeIndex.value = 0;
  });

  const move = (delta: number): void => {
    const count = results.value.length;
    if (count === 0) return;
    activeIndex.value = (activeIndex.value + delta + count) % count;
  };

  const open = (): void => {
    query.value = '';
    activeIndex.value = 0;
    isOpen.value = true;
    lock();
  };

  const close = (): void => {
    isOpen.value = false;
    unlock();
  };

  const remember = (id: string): void => {
    recentIds.value = [id, ...recentIds.value.filter(existing => existing !== id)].slice(0, RECENTS_MAX);
    saveRecents(recentIds.value);
  };

  const execute = async (index = activeIndex.value, newTab = false): Promise<void> => {
    const command = results.value[index];
    if (!command) return;

    remember(command.id);
    close();

    if (command.kind === 'action') {
      await command.run();
      return;
    }

    if (newTab) {
      window.open(router.resolve(command.to).href, '_blank', 'noopener,noreferrer');
      return;
    }

    await router.push(command.to);
  };

  // Keys handled while the palette is focused. Vim/fzf bindings sit alongside the
  // arrows and move the same active row (progressive enhancement for the a11y).
  const handleKeydown = (event: KeyboardEvent): void => {
    const ctrl = event.ctrlKey;

    if (event.key === 'Tab') {
      event.preventDefault();
      return;
    }
    if (event.key === 'Escape' || (ctrl && event.key === 'c')) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown' || (ctrl && (event.key === 'j' || event.key === 'n'))) {
      event.preventDefault();
      move(1);
      return;
    }
    if (event.key === 'ArrowUp' || (ctrl && (event.key === 'k' || event.key === 'p'))) {
      event.preventDefault();
      move(-1);
      return;
    }
    if (ctrl && event.key === 'd') {
      event.preventDefault();
      move(PAGE);
      return;
    }
    if (ctrl && event.key === 'u') {
      event.preventDefault();
      move(-PAGE);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      void execute(activeIndex.value, event.metaKey || event.ctrlKey);
    }
  };

  const onGlobalKeydown = (event: KeyboardEvent): void => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (isOpen.value) {
        close();
      } else {
        open();
      }
    }
  };

  onMounted(() => window.addEventListener('keydown', onGlobalKeydown));
  onUnmounted(() => {
    window.removeEventListener('keydown', onGlobalKeydown);
    unlock();
  });

  return { isOpen, query, activeIndex, results, open, close, handleKeydown, execute };
};
