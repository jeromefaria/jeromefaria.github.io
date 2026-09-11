<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import { useCommandPalette } from '@/composables/useCommandPalette';
import { useOverlay } from '@/composables/useOverlay';
import { useT } from '@/i18n/useT';
import { matchSegments } from '@/utils/fuzzy';

import IconClose from './IconClose.vue';

const t = useT();

const { isOpen, query, activeIndex, results, matchCount, close, handleKeydown, execute } = useCommandPalette();

const inputRef = ref<HTMLInputElement | null>(null);

useOverlay(isOpen, inputRef);

const showHeaders = computed(() => query.value.trim() === '');
const announcement = computed(() => {
  if (!isOpen.value) return '';
  if (results.value.length === 0) return t('palette.empty');

  const noun = matchCount.value === 1 ? t('palette.result') : t('palette.results');
  return `${matchCount.value} ${noun}`;
});

const optionId = (index: number): string => `command-palette-option-${index}`;

watch(activeIndex, async () => {
  await nextTick();
  document.getElementById(optionId(activeIndex.value))?.scrollIntoView({ block: 'nearest' });
});
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="isOpen"
        class="command-palette"
        @click.self="close"
      >
        <div
          class="command-palette__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="t('palette.ariaLabel')"
        >
          <div class="command-palette__search">
            <input
              ref="inputRef"
              v-model="query"
              class="command-palette__input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              :aria-expanded="results.length > 0"
              :aria-controls="results.length ? 'command-palette-listbox' : undefined"
              :aria-activedescendant="results.length ? optionId(activeIndex) : undefined"
              :aria-label="t('palette.searchLabel')"
              :placeholder="`${t('palette.searchLabel')}…`"
              autocomplete="off"
              spellcheck="false"
              @keydown="handleKeydown"
            >
            <button
              type="button"
              class="command-palette__close"
              :aria-label="t('palette.close')"
              tabindex="-1"
              @click="close"
            >
              <IconClose />
            </button>
          </div>

          <ul
            v-if="results.length"
            id="command-palette-listbox"
            class="command-palette__results"
            role="listbox"
          >
            <template
              v-for="(command, index) in results"
              :key="command.id"
            >
              <li
                v-if="showHeaders && (index === 0 || results[index - 1]?.group !== command.group)"
                class="command-palette__group"
                role="presentation"
              >
                {{ t(`palette.groups.${command.group}`) }}
              </li>
              <li
                :id="optionId(index)"
                class="command-palette__option"
                :class="{ 'command-palette__option--active': index === activeIndex }"
                role="option"
                :aria-selected="index === activeIndex"
                @click="execute(index, $event.metaKey || $event.ctrlKey)"
                @mousemove="activeIndex = index"
              >
                <span class="command-palette__title"><span
                  v-for="(segment, segmentIndex) in matchSegments(query, command.title)"
                  :key="segmentIndex"
                  :class="{ 'command-palette__match': segment.match }"
                >{{ segment.text }}</span></span>
                <span
                  v-if="command.subtitle || !showHeaders"
                  class="command-palette__subtitle"
                >{{ command.subtitle ?? t(`palette.groups.${command.group}`) }}</span>
              </li>
            </template>
          </ul>
          <p
            v-else
            class="command-palette__empty"
          >
            {{ t('palette.empty') }}
          </p>
          <p
            v-if="matchCount > results.length"
            class="command-palette__more"
          >
            {{ t('palette.more', { count: String(matchCount - results.length) }) }}
          </p>

          <div
            class="command-palette__hint"
            aria-hidden="true"
          >
            <span><kbd>↑</kbd><kbd>↓</kbd> {{ t('palette.hint.navigate') }}</span>
            <span><kbd>↵</kbd> {{ t('palette.hint.open') }}</span>
            <span><kbd>esc</kbd> {{ t('palette.hint.close') }}</span>
          </div>
        </div>

        <div
          class="visually-hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ announcement }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
