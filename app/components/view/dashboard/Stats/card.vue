<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  iconBg?: string;
}>();
</script>

<template>
  <div class="bg-muted dark:bg-gray-800/50 rounded-md pt-5 px-3 pb-3">
    <h3 class="text-foreground dark:text-gray-100 text-lg font-bold ml-3 mb-4">
      {{ title }}
    </h3>
    
    <div class="bg-white dark:bg-gray-900 rounded-card p-5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-foreground dark:text-white text-4xl font-extrabold mb-1">
            {{ value }}
          </p>
          <p v-if="trend" class="text-green-600 dark:text-green-400 text-sm font-medium">
            {{ trend }}
          </p>
        </div>
        
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="iconBg ?? 'bg-[#C5E151] dark:bg-[#b5d143]'">
          <Icon :name="icon" class="w-7 h-7 text-neutral-800" />
        </div>
      </div>
    </div>
  </div>
</template>