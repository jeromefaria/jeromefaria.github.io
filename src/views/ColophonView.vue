<script setup lang="ts">
import ProseSectionsPage from '@/components/ProseSectionsPage.vue';
import { useProse } from '@/composables/useProse';
import { colophonContent } from '@/data/colophon';
import { pageMeta } from '@/data/pageMeta';

const renderProse = useProse();
</script>

<template>
  <ProseSectionsPage
    :head="pageMeta.colophon"
    block="colophon"
    :intro="colophonContent.intro"
    :sections="colophonContent.sections"
  >
    <p
      class="colophon__body colophon__body--source"
      v-html="renderProse(colophonContent.source)"
    />
  </ProseSectionsPage>
</template>
