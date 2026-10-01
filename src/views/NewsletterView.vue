<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import FormField from '@/components/FormField.vue';
import StaticPage from '@/components/StaticPage.vue';
import { type NewsletterActionMode, useNewsletterAction } from '@/composables/useNewsletterAction';
import { useNewsletterForm } from '@/composables/useNewsletterForm';
import { useProseClick } from '@/composables/useProseClick';
import { useTurnstile } from '@/composables/useTurnstile';
import { OG_CARD_DIMENSIONS } from '@/data/navigation';
import { newsletterContent } from '@/data/newsletter';
import { pageMeta } from '@/data/pageMeta';
import { useLocalized } from '@/i18n/localized';
import { localizeInternalLinks } from '@/i18n/messages';
import { useT } from '@/i18n/useT';
import { externalizeLinks } from '@/utils/externalizeLinks';

const t = useT();
const route = useRoute();
const { toLocalePath, current } = useLocalized();

const head = { ...pageMeta.newsletter, image: '/og-newsletter.png', imageDimensions: OG_CARD_DIMENSIONS };
const onProseClick = useProseClick();
const transparency = computed(() => externalizeLinks(localizeInternalLinks(t('newsletter.transparency'), current.value)));

const queryToken = (key: string): string => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '');
const confirmToken = queryToken('confirm');
const unsubscribeToken = queryToken('unsubscribe');
const actionMode: NewsletterActionMode | null = confirmToken ? 'confirm' : unsubscribeToken ? 'unsubscribe' : null;

const action = actionMode
  ? useNewsletterAction(
    actionMode,
    actionMode === 'confirm' ? confirmToken : unsubscribeToken,
    actionMode === 'confirm' ? newsletterContent.confirm : newsletterContent.unsubscribe,
  )
  : null;

const actionResult = computed<{ title: string; text: string } | null>(() => {
  if (action?.state.value !== 'done') return null;
  if (actionMode === 'confirm') return { title: t('newsletter.status.confirmed.title'), text: t('newsletter.status.confirmed.text') };
  return { title: t('newsletter.status.unsubscribed.title'), text: t('newsletter.status.unsubscribed.text') };
});

const actionError = computed<string | null>(() => {
  if (action?.state.value !== 'invalid') return null;
  return actionMode === 'confirm' ? t('newsletter.status.confirmInvalid') : t('newsletter.status.unsubscribeInvalid');
});

const actionInvalid = computed(() => action?.state.value === 'invalid');
const showActionCard = computed(() => Boolean(actionMode && action) && !(actionInvalid.value && actionMode === 'confirm'));

const turnstileContainer = ref<HTMLElement | null>(null);
const { execute } = useTurnstile(newsletterContent.turnstileSiteKey, turnstileContainer);

const { email, botField, isSubmitting, showSuccess, errorMessage, invalid, error, handleBlur, handleInput, handleSubmit } =
  useNewsletterForm(newsletterContent.action, execute);

const terminalMessage = computed<{ title: string; text: string } | null>(() => {
  if (showSuccess.value) return { title: t('newsletter.success.title'), text: t('newsletter.success.text') };
  if (route.query['confirmed'] === '1') return { title: t('newsletter.status.confirmed.title'), text: t('newsletter.status.confirmed.text') };
  if (route.query['unsubscribed'] === '1') return { title: t('newsletter.status.unsubscribed.title'), text: t('newsletter.status.unsubscribed.text') };
  return null;
});

const blurbError = computed<string | null>(() => {
  if (actionMode === 'confirm' && actionInvalid.value) return t('newsletter.status.confirmInvalid');
  if (route.query['confirmed'] === '0') return t('newsletter.status.confirmInvalid');
  if (route.query['unsubscribed'] === '0') return t('newsletter.status.unsubscribeInvalid');
  return null;
});

const onSubmit = async (event: Event): Promise<void> => {
  const proceeded = await handleSubmit(event);
  if (!proceeded) {
    await nextTick();
    document.getElementById('newsletter-email')?.focus();
  }
};
</script>

<template>
  <StaticPage
    :head="head"
    data-page="newsletter"
  >
    <template v-if="showActionCard && action">
      <div
        v-if="actionResult"
        class="contact-success"
        role="alert"
      >
        <h2>{{ actionResult.title }}</h2>
        <p>{{ actionResult.text }}</p>
      </div>

      <div
        v-else-if="actionError"
        class="contact-success newsletter-confirming"
        role="alert"
      >
        <p>{{ actionError }}</p>
      </div>

      <div
        v-else-if="actionMode === 'confirm'"
        class="contact-success newsletter-confirming"
        role="status"
      >
        <p>{{ t('newsletter.confirming') }}</p>
      </div>

      <div
        v-else
        class="contact-success newsletter-unsubscribe"
        role="status"
      >
        <h2>{{ t('newsletter.unsubscribe.title') }}</h2>
        <p>{{ t('newsletter.unsubscribe.text') }}</p>
        <button
          type="button"
          class="newsletter-unsubscribe__button"
          :disabled="action.state.value === 'pending'"
          @click="action.submit()"
        >
          {{ action.state.value === 'pending' ? t('newsletter.unsubscribe.pending') : t('newsletter.unsubscribe.button') }}
        </button>
      </div>
    </template>

    <template v-else-if="terminalMessage">
      <div
        class="contact-success"
        role="alert"
      >
        <h2>{{ terminalMessage.title }}</h2>
        <p>{{ terminalMessage.text }}</p>
      </div>
    </template>

    <template v-else>
      <p
        :class="['newsletter__intro', { 'newsletter__intro--error': blurbError }]"
        :role="blurbError ? 'alert' : undefined"
      >
        {{ blurbError ?? t('newsletter.intro') }}
      </p>

      <p
        v-if="!blurbError"
        class="newsletter__transparency"
        @click="onProseClick"
        v-html="transparency"
      />

      <form
        class="contact-form"
        novalidate
        @submit="onSubmit"
      >
        <input
          v-model="botField"
          type="text"
          name="newsletter-nickname"
          class="contact-form__honeypot"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
        >

        <FormField
          id="newsletter-email"
          type="email"
          :model-value="email"
          :label="t('newsletter.email')"
          :required="true"
          autocomplete="email"
          :invalid="invalid"
          :error="error || errorMessage"
          @update:model-value="value => (email = value)"
          @input="handleInput"
          @blur="handleBlur"
        />

        <div
          ref="turnstileContainer"
          class="contact-form__turnstile"
        />

        <button
          type="submit"
          :class="['contact-form__submit', { 'contact-form__submit--valid': email.trim() !== '' }]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? t('newsletter.sending') : t('newsletter.submit') }}
        </button>

        <p class="contact-form__notice">
          <span>{{ t('newsletter.turnstileNotice') }}</span>
          <span aria-hidden="true">·</span>
          <RouterLink :to="toLocalePath('/privacy')">
            {{ t('footer.privacy') }}
          </RouterLink>
        </p>
      </form>
    </template>
  </StaticPage>
</template>
