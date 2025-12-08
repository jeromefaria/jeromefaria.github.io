<script setup>
import { computed, ref, nextTick } from 'vue';
import { TIMING, ID_PREFIX } from '@/utils/constants';

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
const contentRef = ref(null);

const toggle = () => {
  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    nextTick(() => {
      setTimeout(() => {
        const trigger = document.getElementById(`${ID_PREFIX.TRIGGER}${props.id}`);
        trigger?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        contentRef.value?.focus({ preventScroll: true });
      }, TIMING.ACCORDION_ANIMATION);
    });
  }
};
</script>

<template>
  <section
    :id="`${ID_PREFIX.SECTION}${id}`"
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
