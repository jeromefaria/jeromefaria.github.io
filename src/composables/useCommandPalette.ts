import type { ComputedRef, Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { buildCommands, playbackCommands, playReleaseCommands } from '@/data/commands';
import type { Command } from '@/types/command';
import { fuzzyRank } from '@/utils/fuzzy';
import { openInNewTab } from '@/utils/openInNewTab';

import { paletteOpen } from './useOverlays';

const RECENTS_KEY = 'command-palette:recents';
const RECENTS_MAX = 5;
const CURATED_RECENTS_MAX = 3;
const PRIMARY_ROUTE_IDS = ['nav:home', 'nav:about', 'nav:works', 'nav:live', 'nav:contact'];
const MAX_RESULTS = 9;
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
  close: () => void;
  handleKeydown: (event: KeyboardEvent) => void;
  execute: (index?: number, newTab?: boolean) => Promise<void>;
}

export const useCommandPalette = (): UseCommandPaletteReturn => {
  const router = useRouter();

  const commands = buildCommands();
  const byId = new Map(commands.map(command => [command.id, command]));

  // Reactive slices layered over the static registry: transport reflects live
  // player state; the searchable set adds every streamable release.
  const transportCommands = computed<Command[]>(() => playbackCommands());
  const audioCommands = computed<Command[]>(() => [...transportCommands.value, ...playReleaseCommands()]);

  const query = ref('');
  const activeIndex = ref(0);
  const recentIds = ref<string[]>(loadRecents());

  const recentCommands = computed<Command[]>(() =>
    recentIds.value
      .map(id => byId.get(id))
      .filter((command): command is Command => command !== undefined)
      .map(command => ({ ...command, group: 'Recent' as const })));

  const clearRecents = (): void => {
    recentIds.value = [];
    saveRecents(recentIds.value);
  };

  const clearRecentsCommand: Command = {
    kind: 'action',
    id: 'act:clear-recents',
    title: 'Clear recents',
    keywords: ['clear', 'reset', 'history', 'forget'],
    group: 'Actions',
    run: () => clearRecents(),
  };

  const results = computed<Command[]>(() => {
    if (query.value.trim() === '') {
      // Main routes always live under Navigate, never Recent.
      const recents = recentCommands.value
        .filter(command => !PRIMARY_ROUTE_IDS.includes(command.id))
        .slice(0, CURATED_RECENTS_MAX);
      const navigation = PRIMARY_ROUTE_IDS
        .map(id => byId.get(id))
        .filter((command): command is Command => command !== undefined);
      const clear = recents.length ? [clearRecentsCommand] : [];
      // Transport sits at the top while a track plays — the palette doubles as a remote.
      return [...transportCommands.value, ...recents, ...clear, ...navigation];
    }

    // Cap the list: subsequence matching is permissive, so keep the best-ranked few.
    const recentsTail = recentCommands.value.length ? [clearRecentsCommand] : [];
    const searchable = [...commands, ...audioCommands.value, ...recentsTail];
    return fuzzyRank(query.value, searchable).slice(0, MAX_RESULTS);
  });

  watch(results, () => {
    activeIndex.value = 0;
  });

  // Immediate so a freshly-mounted, already-open palette resets its query.
  watch(paletteOpen, open => {
    if (!open) return;
    query.value = '';
    activeIndex.value = 0;
  }, { immediate: true });

  const close = (): void => {
    paletteOpen.value = false;
  };

  const move = (delta: number): void => {
    const count = results.value.length;
    if (count === 0) return;
    activeIndex.value = (activeIndex.value + delta + count) % count;
  };

  const remember = (id: string): void => {
    // Main-nav routes always sit in Navigate, so they never take a Recent slot.
    if (PRIMARY_ROUTE_IDS.includes(id)) return;

    recentIds.value = [id, ...recentIds.value.filter(existing => existing !== id)].slice(0, RECENTS_MAX);
    saveRecents(recentIds.value);
  };

  const execute = async (index = activeIndex.value, newTab = false): Promise<void> => {
    const command = results.value[index];
    if (!command) return;

    // Ephemeral actions (transport, play-a-release) must not take a recents slot.
    if (!(command.kind === 'action' && command.transient)) remember(command.id);
    close();

    if (command.kind === 'action') {
      await command.run();
      return;
    }

    if (newTab) {
      openInNewTab(router.resolve(command.to).href);
      return;
    }

    await router.push(command.to);
  };

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

  return { isOpen: paletteOpen, query, activeIndex, results, close, handleKeydown, execute };
};
