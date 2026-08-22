<script setup lang="ts">
import FormField from '@/components/FormField.vue';
import PageShell from '@/components/PageShell.vue';
import { useContactForm } from '@/composables/useContactForm';
import { usePageHead } from '@/composables/usePageHead';
import { contactContent } from '@/data/contact';
import { pageMeta } from '@/data/pageMeta';
import { FORM_SUBMIT } from '@/utils/constants';
import { createContactPageSchema } from '@/utils/pageSchemas';

usePageHead({
  ...pageMeta.contact,
  schema: createContactPageSchema(),
});

const { formData, isSubmitting, showSuccess, isFormValid, fieldInvalid, errors, handleBlur, handleInput, handleSubmit } =
  useContactForm(contactContent.form.action);
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="contact"
      title="Contact"
    >
      <div
        v-show="!showSuccess"
        class="contact-intro"
        v-html="contactContent.intro"
      />

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
        :action="contactContent.form.action"
        method="POST"
        class="contact-form"
        @submit="handleSubmit"
      >
        <input
          type="hidden"
          :name="FORM_SUBMIT.SUBJECT"
          value="Contact Form Submission"
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
          id="name"
          v-model="formData.name"
          :label="contactContent.form.fields.name.label"
          :required="contactContent.form.fields.name.required"
          :autocomplete="contactContent.form.fields.name.autocomplete"
          :invalid="fieldInvalid.name"
          :error="errors.name"
          @input="handleInput"
          @blur="handleBlur('name')"
        />

        <FormField
          id="email"
          v-model="formData.email"
          type="email"
          :label="contactContent.form.fields.email.label"
          :required="contactContent.form.fields.email.required"
          :autocomplete="contactContent.form.fields.email.autocomplete"
          :invalid="fieldInvalid.email"
          :error="errors.email"
          @input="handleInput"
          @blur="handleBlur('email')"
        >
          <input
            type="hidden"
            :name="FORM_SUBMIT.REPLY_TO"
            :value="formData.email"
          >
        </FormField>

        <FormField
          id="subject"
          v-model="formData.subject"
          :label="contactContent.form.fields.subject.label"
          :autocomplete="contactContent.form.fields.subject.autocomplete"
          @input="handleInput"
        />

        <FormField
          id="message"
          v-model="formData.message"
          type="textarea"
          :label="contactContent.form.fields.message.label"
          :rows="contactContent.form.fields.message.rows"
          :required="contactContent.form.fields.message.required"
          :invalid="fieldInvalid.message"
          :error="errors.message"
          @input="handleInput"
          @blur="handleBlur('message')"
        />

        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': isFormValid }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sending...' : contactContent.form.submitText }}
        </button>
      </form>
    </PageShell>
  </div>
</template>
