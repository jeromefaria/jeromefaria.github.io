<script setup lang="ts">
import { ref } from 'vue';

import { useOverlay } from '@/composables/useOverlay';
import { helpOpen } from '@/composables/useOverlays';
import { useT } from '@/i18n/useT';

const t = useT();
const panelRef = ref<HTMLElement | null>(null);

useOverlay(helpOpen, panelRef);

const close = (): void => {
  helpOpen.value = false;
};

const shortcuts: { keys: string[]; descriptionKey: string }[] = [
  { keys: ['⌘K'], descriptionKey: 'keyboardHelp.openPalette' },
  { keys: ['↑', '↓'], descriptionKey: 'keyboardHelp.moveSelection' },
  { keys: ['Ctrl J', 'Ctrl K'], descriptionKey: 'keyboardHelp.moveSelectionVim' },
  { keys: ['Ctrl D', 'Ctrl U'], descriptionKey: 'keyboardHelp.jumpHalfPage' },
  { keys: ['↵'], descriptionKey: 'keyboardHelp.openCommand' },
  { keys: ['⌘↵'], descriptionKey: 'keyboardHelp.openNewTab' },
  { keys: ['Esc'], descriptionKey: 'keyboardHelp.close' },
  { keys: ['?'], descriptionKey: 'keyboardHelp.showHelp' },
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
          :aria-label="t('keyboardHelp.title')"
          tabindex="-1"
          @keydown.tab.prevent
        >
          <h2 class="keyboard-help__title">
            {{ t('keyboardHelp.title') }}
          </h2>
          <dl class="keyboard-help__list">
            <div
              v-for="row in shortcuts"
              :key="row.descriptionKey"
              class="keyboard-help__row"
            >
              <dt class="keyboard-help__keys">
                <kbd
                  v-for="key in row.keys"
                  :key="key"
                >{{ key }}</kbd>
              </dt>
              <dd class="keyboard-help__description">
                {{ t(row.descriptionKey) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
