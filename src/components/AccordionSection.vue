<script setup>
import { ref, watch } from 'vue'

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

watch(() => props.modelValue, (val) => {
  isExpanded.value = val
})

function toggle() {
  isExpanded.value = !isExpanded.value
  emit('update:modelValue', isExpanded.value)

  // Scroll into view when opening
  if (isExpanded.value) {
    setTimeout(() => {
      const section = document.getElementById(`section-${props.id}`)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 320)
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
      :id="`content-${id}`"
      class="accordion-content"
      :aria-hidden="!isExpanded"
      :aria-labelledby="`trigger-${id}`"
    >
      <div class="accordion-content-inner">
        <slot />
      </div>
    </div>
  </section>
</template>
