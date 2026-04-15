<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div>
    <h3
      class="text-foreground text-xs font-semibold uppercase tracking-wider mb-3">
      {{ title }}
    </h3>

    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>
