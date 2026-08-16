<script setup lang="ts">
// The shared page frame: the semantic <article> and its visually-hidden
// heading. Callers keep their own .container-wide wrapper and any siblings
// (e.g. a lightbox host) so nothing needs to move into a slot.
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
