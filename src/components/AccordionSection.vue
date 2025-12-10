<script setup>
import { computed, nextTick, ref } from 'vue';

import { ID_PREFIX, TIMING } from '@/utils/constants';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isExpanded = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});
const sectionRef = ref(null);
const contentRef = ref(null);

const getHeaderOffset = () => {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  const headerHeight = isDesktop ? 77 : 57;
  const spacing = 16;
  return headerHeight + spacing;
};

const scrollToSection = () => {
  if (!sectionRef.value) return;

  const rect = sectionRef.value.getBoundingClientRect();
  const targetY = rect.top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: targetY, behavior: 'instant' });
};

const toggle = () => {
  const willExpand = !isExpanded.value;
  isExpanded.value = willExpand;

  if (!willExpand) return;

  nextTick(() => {
    setTimeout(() => {
      scrollToSection();
      contentRef.value?.focus({ preventScroll: true });
    }, TIMING.ACCORDION_ANIMATION);
  });
};
</script>

<template>
  <section
    :id="`${ID_PREFIX.SECTION}${id}`"
    ref="sectionRef"
    class="accordion-section"
  >
    <button
      :id="`${ID_PREFIX.TRIGGER}${id}`"
      class="accordion-trigger"
      type="button"
      :aria-expanded="isExpanded"
      :aria-controls="`${ID_PREFIX.CONTENT}${id}`"
      @click="toggle"
    >
      {{ title }}
    </button>
    <div
      :id="`${ID_PREFIX.CONTENT}${id}`"
      ref="contentRef"
      class="accordion-content"
      :aria-hidden="!isExpanded"
      :aria-labelledby="`${ID_PREFIX.TRIGGER}${id}`"
      role="region"
      :tabindex="isExpanded ? 0 : -1"
    >
      <div class="accordion-content-inner">
        <slot />
      </div>
    </div>
  </section>
</template>
