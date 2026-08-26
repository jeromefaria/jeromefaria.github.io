<script setup lang="ts">
import PageShell from '@/components/PageShell.vue';
import { usePageHead } from '@/composables/usePageHead';
import { pageMeta } from '@/data/pageMeta';
import { privacyContent } from '@/data/privacy';
import { externalizeLinks } from '@/utils/externalizeLinks';

usePageHead(pageMeta.privacy);
</script>

<template>
  <div class="container-wide">
    <PageShell
      data-page="privacy"
      title="Privacy"
    >
      <p class="visually-hidden">
        External links open in a new tab.
      </p>
      <div class="privacy">
        <p class="privacy__intro">
          {{ privacyContent.intro }}
        </p>

        <section
          v-for="section in privacyContent.sections"
          :key="section.heading"
          class="privacy__section"
        >
          <h2 class="privacy__heading">
            {{ section.heading }}
          </h2>
          <p
            class="privacy__body"
            v-html="externalizeLinks(section.body)"
          />
        </section>

        <p class="privacy__updated">
          Last updated {{ privacyContent.updated }}.
        </p>
      </div>
    </PageShell>
  </div>
</template>
