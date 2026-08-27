<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import { useCommandPalette } from '@/composables/useCommandPalette';
import { useOverlay } from '@/composables/useOverlay';

const { isOpen, query, activeIndex, results, close, handleKeydown, execute } = useCommandPalette();

const inputRef = ref<HTMLInputElement | null>(null);

useOverlay(isOpen, inputRef);

const showHeaders = computed(() => query.value.trim() === '');
const announcement = computed(() =>
  (isOpen.value ? `${results.value.length} result${results.value.length === 1 ? '' : 's'}` : ''));

watch(activeIndex, async () => {
  await nextTick();
  document.getElementById(`command-palette-option-${activeIndex.value}`)?.scrollIntoView({ block: 'nearest' });
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
          aria-label="Command palette"
        >
          <input
            ref="inputRef"
            v-model="query"
            class="command-palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            :aria-activedescendant="results.length ? `command-palette-option-${activeIndex}` : undefined"
            aria-label="Search, navigate, or run a command"
            placeholder="Search, navigate, or run a command…"
            autocomplete="off"
            spellcheck="false"
            @keydown="handleKeydown"
          >

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
                {{ command.group }}
              </li>
              <li
                :id="`command-palette-option-${index}`"
                class="command-palette__option"
                :class="{ 'command-palette__option--active': index === activeIndex }"
                role="option"
                :aria-selected="index === activeIndex"
                @click="execute(index, $event.metaKey || $event.ctrlKey)"
                @mousemove="activeIndex = index"
              >
                <span class="command-palette__title">{{ command.title }}</span>
                <span
                  v-if="command.subtitle"
                  class="command-palette__subtitle"
                >{{ command.subtitle }}</span>
              </li>
            </template>
          </ul>
          <p
            v-else
            class="command-palette__empty"
          >
            No matches
          </p>

          <div
            class="command-palette__hint"
            aria-hidden="true"
          >
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </div>
        </div>

        <div
          class="visually-hidden"
          aria-live="polite"
        >
          {{ announcement }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
