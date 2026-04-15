<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
}>();
</script>

<template>
  <div
    class="lg:hidden flex items-center justify-between mb-6 bg-muted rounded-card p-4">
    <button
      class="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer"
      aria-label="Open menu"
      @click="emit('toggle')">
      <Icon name="mdi-menu" class="w-6 h-6" />
    </button>

    <h1 class="text-lg font-bold text-center">
      {{ title ?? "FoodHub" }}
    </h1>

    <div class="w-10" />
  </div>
</template>
