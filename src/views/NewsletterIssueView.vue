<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NewsletterBlock from '@/components/NewsletterBlock.vue';
import NotFound from '@/components/NotFound.vue';
import StaticPage from '@/components/StaticPage.vue';
import { siteConfig } from '@/data/navigation';
import { issueById } from '@/data/newsletter/issues';
import { pageMeta } from '@/data/pageMeta';
import { resolveIssueBlocks } from '@/utils/newsletterBlocks';

const route = useRoute();

const issue = computed(() => issueById(String(route.params['issue'])));
const notFound = computed(() => !issue.value);

const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const blocks = computed(() => (issue.value ? resolveIssueBlocks(issue.value.blocks) : []));

const head = computed(() => {
  if (!issue.value) return { ...pageMeta.newsletter, noIndex: true };
  return {
    title: `${issue.value.subject} — ${siteConfig.author.name}`,
    description: issue.value.subject,
    ogType: 'article',
  };
});
</script>

<template>
  <NotFound v-if="notFound" />

  <StaticPage
    v-else-if="issue"
    :head="head"
    data-page="newsletter-issue"
  >
    <div class="newsletter-issue">
      <p class="newsletter-issue__eyebrow">
        Newsletter · {{ longDate(issue.date) }}
      </p>

      <NewsletterBlock
        v-for="(block, index) in blocks"
        :key="index"
        :block="block"
      />
    </div>
  </StaticPage>
</template>
