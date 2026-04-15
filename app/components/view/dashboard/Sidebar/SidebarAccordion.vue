<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  label: string;
  icon: string;
}>();

const open = ref(false);
</script>

<template>
  <div>
    <button
      class="flex items-center justify-between w-full px-4 py-3 rounded-card hover:bg-gray-50 cursor-pointer group"
      @click="open = !open">
      <div class="flex items-center gap-2.5">
        <Icon
          :name="icon"
          size="20"
          class="text-gray-600 group-hover:text-primary" />

        <span class="text-foreground group-hover:text-primary">
          {{ label }}
        </span>
      </div>

      <Icon
        name="mdi:chevron-down"
        size="20"
        :class="[
          'transition-transform duration-200 text-gray-600 group-hover:text-primary',
          open ? 'rotate-180' : '',
        ]" />
    </button>

    <div v-show="open" class="ml-4 mt-2 space-y-1 text-sm">
      <slot />
    </div>
  </div>
</template>
