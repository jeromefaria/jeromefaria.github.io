<script setup lang="ts">
import { ref } from 'vue';

import { useOverlay } from '@/composables/useOverlay';
import { helpOpen } from '@/composables/useOverlays';

const panelRef = ref<HTMLElement | null>(null);

useOverlay(helpOpen, panelRef);

const close = (): void => {
  helpOpen.value = false;
};

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
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="helpOpen"
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
    </Transition>
  </Teleport>
</template>
