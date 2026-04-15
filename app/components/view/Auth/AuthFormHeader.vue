<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="text-center mb-6">
    <div
      class="mx-auto mb-3 bg-red-100 dark:bg-red-500/20 w-12 h-12 rounded-full flex items-center justify-center">
      <Icon
        name="mdi-chef-hat"
        size="24"
        class="text-red-500 dark:text-red-400" />
    </div>

    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
      {{ title }}
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ subtitle }}
    </p>
  </div>
</template>
