<script setup lang="ts">
defineProps<{
  text: string;
  linkText: string;
  to: string;
}>();
</script>

<template>
  <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
    {{ text }}
    <NuxtLink :to="to" class="text-red-500 hover:underline">
      {{ linkText }}
    </NuxtLink>
  </p>
</template>
