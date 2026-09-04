<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  serverError: {
    type: String as PropType<string | null>,
    default: null,
  },
  fieldErrors: {
    type: Object as PropType<Record<string, string[]>>,
    default: () => ({}),
  },
});
</script>
<template>
  <div
    v-if="serverError || Object.keys(fieldErrors).length"
    class="flex flex-col gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-800 dark:bg-red-950"
  >
    <!-- Baris atas: icon + pesan umum -->
    <div class="flex items-center gap-2 font-medium text-red-700 dark:text-red-400">
      <UIcon name="i-lucide-circle-alert" class="size-4 shrink-0" />
      <span>{{ serverError }}</span>
    </div>

    <!-- List detail field yang gagal validasi -->
    <ul
      v-if="Object.keys(fieldErrors).length"
      class="ml-6 list-disc space-y-0.5 text-red-600 dark:text-red-400"
    >
      <li v-for="(messages, field) in fieldErrors" :key="field">
        <span class="font-medium capitalize">{{ field }}</span>:
        {{ messages.join(", ") }}
      </li>
    </ul>
  </div>
</template>
