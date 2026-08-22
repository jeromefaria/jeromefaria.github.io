<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  type?: 'text' | 'email' | 'textarea' | undefined;
  required?: boolean | undefined;
  autocomplete?: string | undefined;
  rows?: number | undefined;
  invalid?: boolean | undefined;
  error?: string | undefined;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [];
  blur: [];
}>();

// A field is validated when the parent supplies an `error` slot for it; only
// then does it carry aria-invalid (the optional subject omits it entirely).
const ariaInvalid = computed(() => (props.error === undefined ? undefined : props.invalid));

const onInput = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value);
  emit('input');
};
</script>

<template>
  <div class="contact-form__field">
    <label
      :for="id"
      class="contact-form__label"
    >
      {{ label }}
      <abbr
        v-if="required"
        title="Required"
      >*</abbr>
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :name="id"
      :value="modelValue"
      :class="['contact-form__textarea', { 'contact-form__textarea--invalid': invalid }]"
      :rows="rows"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="invalid ? `${id}-error` : undefined"
      @input="onInput"
      @blur="emit('blur')"
    />
    <input
      v-else
      :id="id"
      :name="id"
      :value="modelValue"
      :type="type ?? 'text'"
      :class="['contact-form__input', { 'contact-form__input--invalid': invalid }]"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="invalid ? `${id}-error` : undefined"
      @input="onInput"
      @blur="emit('blur')"
    >

    <span
      v-if="invalid"
      :id="`${id}-error`"
      class="contact-form__error"
      role="alert"
    >{{ error }}</span>

    <slot />
  </div>
</template>
