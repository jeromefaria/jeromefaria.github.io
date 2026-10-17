<script setup lang="ts">
import ProseSectionsPage from '@/components/ProseSectionsPage.vue';
import { pageMeta } from '@/data/pageMeta';
import { privacyContent } from '@/data/privacy';
import { useLocalized } from '@/i18n/localized';
import { useT } from '@/i18n/useT';

const t = useT();
const { localize } = useLocalized();
</script>

<template>
  <ProseSectionsPage
    :head="pageMeta.privacy"
    block="privacy"
    :intro="privacyContent.intro"
    :sections="privacyContent.sections"
  >
    <p class="privacy__updated">
      {{ t('privacy.lastUpdated', { date: localize(privacyContent.updated) }) }}
    </p>
  </ProseSectionsPage>
</template>
