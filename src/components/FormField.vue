<script setup lang="ts">
import { computed } from 'vue';

import type { ContactFieldOption } from '@/types/contact';

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  type?: 'text' | 'email' | 'textarea' | 'select' | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  autocomplete?: string | undefined;
  rows?: number | undefined;
  placeholder?: string | undefined;
  options?: ContactFieldOption[] | undefined;
  invalid?: boolean | undefined;
  error?: string | undefined;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [];
  blur: [];
}>();

const fieldName = computed(() => props.name ?? props.id);
const ariaInvalid = computed(() => (props.error === undefined ? undefined : props.invalid));
const describedBy = computed(() => (props.invalid ? `${props.id}-error` : undefined));

const onInput = (event: Event): void => {
  emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value);
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

    <select
      v-if="type === 'select'"
      :id="id"
      :value="modelValue"
      :class="['contact-form__select', { 'contact-form__select--invalid': invalid }]"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      @change="onInput"
      @blur="emit('blur')"
    >
      <option
        value=""
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :name="fieldName"
      :value="modelValue"
      :class="['contact-form__textarea', { 'contact-form__textarea--invalid': invalid }]"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      @input="onInput"
      @blur="emit('blur')"
    />
    <input
      v-else
      :id="id"
      :name="fieldName"
      :value="modelValue"
      :type="type ?? 'text'"
      :class="['contact-form__input', { 'contact-form__input--invalid': invalid }]"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
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
