<script setup lang="ts">
import { computed } from 'vue';

import NewsletterBlock from '@/components/NewsletterBlock.vue';
import StaticPage from '@/components/StaticPage.vue';
import { siteConfig } from '@/data/navigation';
import type { NewsletterIssue } from '@/data/newsletter/types';
import { resolveIssueBlocks } from '@/utils/newsletterBlocks';

const props = defineProps<{ issue: NewsletterIssue }>();

const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const head = {
  title: `${props.issue.subject} — ${siteConfig.author.name}`,
  description: props.issue.subject,
  ogType: 'article',
};

const blocks = computed(() => resolveIssueBlocks(props.issue.blocks));
</script>

<template>
  <StaticPage
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
