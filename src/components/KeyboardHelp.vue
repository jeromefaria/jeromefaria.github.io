<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import { useKeyboardHelp } from '@/composables/useKeyboardHelp';

const { isOpen, close } = useKeyboardHelp();

const panelRef = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const shortcuts: { keys: string[]; description: string }[] = [
  { keys: ['⌘K'], description: 'Open the command palette' },
  { keys: ['↑', '↓'], description: 'Move selection' },
  { keys: ['Ctrl J', 'Ctrl K'], description: 'Move selection (Vim / fzf)' },
  { keys: ['Ctrl D', 'Ctrl U'], description: 'Jump half a page' },
  { keys: ['↵'], description: 'Open the selected command' },
  { keys: ['⌘↵'], description: 'Open in a new tab' },
  { keys: ['Esc'], description: 'Close' },
  { keys: ['?'], description: 'Show this help' },
];

watch(isOpen, async open => {
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement | null;
    await nextTick();
    panelRef.value?.focus();
    return;
  }
  previouslyFocused?.focus();
  previouslyFocused = null;
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="keyboard-help"
      @click.self="close"
    >
      <div
        ref="panelRef"
        class="keyboard-help__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        tabindex="-1"
        @keydown.tab.prevent
      >
        <h2 class="keyboard-help__title">
          Keyboard shortcuts
        </h2>
        <dl class="keyboard-help__list">
          <div
            v-for="row in shortcuts"
            :key="row.description"
            class="keyboard-help__row"
          >
            <dt class="keyboard-help__keys">
              <kbd
                v-for="key in row.keys"
                :key="key"
              >{{ key }}</kbd>
            </dt>
            <dd class="keyboard-help__description">
              {{ row.description }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </Teleport>
</template>
