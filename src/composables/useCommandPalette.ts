import type { ComputedRef, Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { buildCommands, playbackCommands, playReleaseCommands } from '@/data/commands';
import { useLocale } from '@/i18n/useLocale';
import { useT } from '@/i18n/useT';
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
  const t = useT();
  const { current, toLocalePath } = useLocale();

  const commands = computed<Command[]>(() => buildCommands(t, current.value));
  const byId = computed(() => new Map(commands.value.map(command => [command.id, command])));

  const transportCommands = computed<Command[]>(() => playbackCommands(t));
  const audioCommands = computed<Command[]>(() => [...transportCommands.value, ...playReleaseCommands(t)]);

  const query = ref('');
  const activeIndex = ref(0);
  const recentIds = ref<string[]>(loadRecents());

  const recentCommands = computed<Command[]>(() =>
    recentIds.value
      .map(id => byId.value.get(id))
      .filter((command): command is Command => command !== undefined)
      .map(command => ({ ...command, group: 'Recent' as const })));

  const clearRecents = (): void => {
    recentIds.value = [];
    saveRecents(recentIds.value);
  };

  const clearRecentsCommand = computed<Command>(() => ({
    kind: 'action',
    id: 'act:clear-recents',
    title: t('palette.clearRecents'),
    keywords: t('palette.kw.clearRecents').split(' '),
    group: 'Actions',
    run: () => clearRecents(),
  }));

  const results = computed<Command[]>(() => {
    if (query.value.trim() === '') {
      // Main routes always live under Navigate, never Recent.
      const recents = recentCommands.value
        .filter(command => !PRIMARY_ROUTE_IDS.includes(command.id))
        .slice(0, CURATED_RECENTS_MAX);
      const navigation = PRIMARY_ROUTE_IDS
        .map(id => byId.value.get(id))
        .filter((command): command is Command => command !== undefined);
      const clear = recents.length ? [clearRecentsCommand.value] : [];
      return [...transportCommands.value, ...recents, ...clear, ...navigation];
    }

    const recentsTail = recentCommands.value.length ? [clearRecentsCommand.value] : [];
    const searchable = [...commands.value, ...audioCommands.value, ...recentsTail];
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
    if (PRIMARY_ROUTE_IDS.includes(id)) return;

    recentIds.value = [id, ...recentIds.value.filter(existing => existing !== id)].slice(0, RECENTS_MAX);
    saveRecents(recentIds.value);
  };

  const execute = async (index = activeIndex.value, newTab = false): Promise<void> => {
    const command = results.value[index];
    if (!command) return;

    if (!(command.kind === 'action' && command.transient)) remember(command.id);
    close();

    if (command.kind === 'action') {
      await command.run();
      return;
    }

    if (newTab) {
      openInNewTab(router.resolve(toLocalePath(command.to)).href);
      return;
    }

    await router.push(toLocalePath(command.to));
  };

  const keyActions: Record<string, (event: KeyboardEvent) => void> = {
    Tab: () => {},
    Escape: () => close(),
    'ctrl+c': () => close(),
    ArrowDown: () => move(1),
    'ctrl+j': () => move(1),
    'ctrl+n': () => move(1),
    ArrowUp: () => move(-1),
    'ctrl+k': () => move(-1),
    'ctrl+p': () => move(-1),
    'ctrl+d': () => move(PAGE),
    'ctrl+u': () => move(-PAGE),
    Enter: event => void execute(activeIndex.value, event.metaKey || event.ctrlKey),
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    const action = keyActions[event.ctrlKey ? `ctrl+${event.key}` : event.key] ?? keyActions[event.key];
    if (!action) return;

    event.preventDefault();
    action(event);
  };

  return { isOpen: paletteOpen, query, activeIndex, results, close, handleKeydown, execute };
};
