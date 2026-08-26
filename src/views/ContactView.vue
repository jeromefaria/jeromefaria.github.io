<script setup lang="ts">
import { computed } from 'vue';

import FormField from '@/components/FormField.vue';
import PageShell from '@/components/PageShell.vue';
import { useContactForm } from '@/composables/useContactForm';
import { usePageHead } from '@/composables/usePageHead';
import { contactContent } from '@/data/contact';
import { siteConfig } from '@/data/navigation';
import { pageMeta } from '@/data/pageMeta';
import { FORM_SUBMIT } from '@/utils/constants';
import { createContactPageSchema } from '@/utils/pageSchemas';

usePageHead({
  ...pageMeta.contact,
  schema: createContactPageSchema(),
});

const { form } = contactContent;

const { formData, isSubmitting, showSuccess, selectedType, isFormValid, fieldInvalid, errors, handleBlur, handleInput, handleSubmit } =
  useContactForm(form);

const inquiryOptions = form.inquiryTypes.map(type => ({ value: type.id, label: type.label }));

const subject = computed(() => {
  const prefix = selectedType.value?.subjectPrefix ?? 'General';
  const who = (formData['name'] ?? '').trim();
  const base = `[${prefix}] ${siteConfig.author.name}`;

  return who ? `${base} — ${who}` : base;
});
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="contact"
      title="Contact"
    >
      <div
        v-if="showSuccess"
        class="contact-success"
        role="alert"
      >
        <h2>{{ contactContent.successMessage.title }}</h2>
        <p>{{ contactContent.successMessage.text }}</p>
      </div>

      <form
        v-show="!showSuccess"
        :action="form.action"
        method="POST"
        class="contact-form"
        @submit="handleSubmit"
      >
        <input
          type="hidden"
          :name="FORM_SUBMIT.SUBJECT"
          :value="subject"
        >
        <input
          type="hidden"
          :name="FORM_SUBMIT.CAPTCHA"
          value="false"
        >
        <input
          type="text"
          :name="FORM_SUBMIT.HONEYPOT"
          class="contact-form__honeypot"
          tabindex="-1"
          autocomplete="off"
          aria-label="Leave this field empty"
        >

        <FormField
          id="inquiry"
          type="select"
          :model-value="formData['inquiry'] ?? ''"
          :label="form.inquiry.label"
          :placeholder="form.inquiry.placeholder"
          :options="inquiryOptions"
          :required="form.inquiry.required"
          :invalid="fieldInvalid['inquiry']"
          :error="errors['inquiry']"
          @update:model-value="value => (formData['inquiry'] = value)"
          @input="handleInput"
          @blur="handleBlur('inquiry')"
        >
          <input
            type="hidden"
            name="Inquiry"
            :value="selectedType?.label ?? ''"
          >
        </FormField>

        <p
          v-if="selectedType"
          class="contact-form__blurb"
        >
          {{ selectedType.blurb }}
        </p>

        <FormField
          id="name"
          :model-value="formData['name'] ?? ''"
          :name="form.baseFields.name.label"
          :label="form.baseFields.name.label"
          :required="form.baseFields.name.required"
          :autocomplete="form.baseFields.name.autocomplete"
          :invalid="fieldInvalid['name']"
          :error="errors['name']"
          @update:model-value="value => (formData['name'] = value)"
          @input="handleInput"
          @blur="handleBlur('name')"
        />

        <FormField
          id="email"
          type="email"
          :model-value="formData['email'] ?? ''"
          :name="form.baseFields.email.label"
          :label="form.baseFields.email.label"
          :required="form.baseFields.email.required"
          :autocomplete="form.baseFields.email.autocomplete"
          :invalid="fieldInvalid['email']"
          :error="errors['email']"
          @update:model-value="value => (formData['email'] = value)"
          @input="handleInput"
          @blur="handleBlur('email')"
        >
          <input
            type="hidden"
            :name="FORM_SUBMIT.REPLY_TO"
            :value="formData['email']"
          >
        </FormField>

        <FormField
          v-for="field in selectedType?.fields ?? []"
          :id="field.id"
          :key="field.id"
          :model-value="formData[field.id] ?? ''"
          :name="field.label"
          :label="field.label"
          :placeholder="field.placeholder"
          :required="field.required"
          :invalid="fieldInvalid[field.id]"
          :error="errors[field.id]"
          @update:model-value="value => (formData[field.id] = value)"
          @input="handleInput"
          @blur="handleBlur(field.id)"
        />

        <FormField
          id="message"
          type="textarea"
          :model-value="formData['message'] ?? ''"
          :name="form.baseFields.message.label"
          :label="form.baseFields.message.label"
          :rows="form.baseFields.message.rows"
          :required="form.baseFields.message.required"
          :invalid="fieldInvalid['message']"
          :error="errors['message']"
          @update:model-value="value => (formData['message'] = value)"
          @input="handleInput"
          @blur="handleBlur('message')"
        />

        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': isFormValid }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sending...' : form.submitText }}
        </button>
      </form>
    </PageShell>
  </div>
</template>
