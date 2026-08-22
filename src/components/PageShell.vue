<script setup lang="ts">
defineProps<{
  dataPage: string;
  title: string;
}>();
</script>

<template>
  <article
    class="page"
    :data-page="dataPage"
  >
    <h1 class="visually-hidden">
      {{ title }}
    </h1>
    <slot />
  </article>
</template>
