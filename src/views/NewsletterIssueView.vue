<script setup lang="ts">
import { useRoute } from 'vue-router';

import NewsletterIssueContent from '@/components/NewsletterIssueContent.vue';
import NotFound from '@/components/NotFound.vue';
import { issueById } from '@/data/newsletter/issues';

const route = useRoute();

const issue = issueById(String(route.params['issue']));
</script>

<template>
  <NotFound v-if="!issue" />

  <NewsletterIssueContent
    v-else
    :issue="issue"
  />
</template>
