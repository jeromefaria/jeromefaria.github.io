<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isExpanded = ref(props.modelValue)
const contentRef = ref(null)

watch(() => props.modelValue, (val) => {
  isExpanded.value = val
})

function toggle() {
  isExpanded.value = !isExpanded.value
  emit('update:modelValue', isExpanded.value)

  // Scroll into view and manage focus when opening
  if (isExpanded.value) {
    nextTick(() => {
      setTimeout(() => {
        const trigger = document.getElementById(`trigger-${props.id}`)
        if (trigger) {
          trigger.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        // Move focus to content region for keyboard users
        if (contentRef.value) {
          contentRef.value.focus()
        }
      }, 320)
    })
  }
}
</script>

<template>
  <section :id="`section-${id}`" class="accordion-section">
    <button
      :id="`trigger-${id}`"
      class="accordion-trigger"
      type="button"
      :aria-expanded="isExpanded"
      :aria-controls="`content-${id}`"
      @click="toggle"
    >
      {{ title }}
    </button>
    <div
      ref="contentRef"
      :id="`content-${id}`"
      class="accordion-content"
      :aria-hidden="!isExpanded"
      :aria-labelledby="`trigger-${id}`"
      role="region"
      :tabindex="isExpanded ? 0 : -1"
    >
      <div class="accordion-content-inner">
        <slot />
      </div>
    </div>
  </section>
</template>
