<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <section class="epk__section">
    <h2 class="epk__heading">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
