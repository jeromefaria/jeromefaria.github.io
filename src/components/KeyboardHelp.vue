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

interface Shortcut { keys: string[]; descriptionKey: string }

const sections: { titleKey: string; rows: Shortcut[] }[] = [
  {
    titleKey: 'keyboardHelp.sectionPalette',
    rows: [
      { keys: ['⌘K', ':'], descriptionKey: 'keyboardHelp.openPalette' },
      { keys: ['↑', '↓'], descriptionKey: 'keyboardHelp.moveSelection' },
      { keys: ['Ctrl J', 'Ctrl K'], descriptionKey: 'keyboardHelp.moveSelectionVim' },
      { keys: ['Ctrl D', 'Ctrl U'], descriptionKey: 'keyboardHelp.jumpHalfPage' },
      { keys: ['↵'], descriptionKey: 'keyboardHelp.openCommand' },
      { keys: ['⌘↵'], descriptionKey: 'keyboardHelp.openNewTab' },
    ],
  },
  {
    titleKey: 'keyboardHelp.sectionPlayer',
    rows: [
      { keys: ['Space'], descriptionKey: 'keyboardHelp.playPause' },
      { keys: ['←', '→', 'h', 'l'], descriptionKey: 'keyboardHelp.seek' },
      { keys: ['⇧←', '⇧→', 'H', 'L'], descriptionKey: 'keyboardHelp.seekBig' },
      { keys: ['↑', '↓', 'j', 'k'], descriptionKey: 'keyboardHelp.changeTrack' },
      { keys: ['0', '$'], descriptionKey: 'keyboardHelp.trackEnds' },
      { keys: ['gg', 'G'], descriptionKey: 'keyboardHelp.firstLastTrack' },
    ],
  },
  {
    titleKey: 'keyboardHelp.sectionGeneral',
    rows: [
      { keys: ['Esc'], descriptionKey: 'keyboardHelp.close' },
      { keys: ['?'], descriptionKey: 'keyboardHelp.showHelp' },
    ],
  },
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
          <section
            v-for="group in sections"
            :key="group.titleKey"
            class="keyboard-help__section"
          >
            <h3 class="keyboard-help__section-title">
              {{ t(group.titleKey) }}
            </h3>
            <dl class="keyboard-help__list">
              <div
                v-for="row in group.rows"
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
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
