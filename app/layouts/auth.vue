<script setup lang="ts">
import AppBrand from "~/components/view/Auth/AppBrand.vue";
</script>

<template>
  <!-- LEFT IMAGE -->
  <div class="flex min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- LEFT IMAGE -->
    <div class="hidden lg:flex w-1/2 relative">
      <NuxtImg
        src="/bacground-auth.jpg"
        class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/20"></div>

      <div class="relative z-10 p-12 flex flex-col justify-end text-white">
        <h2 class="text-4xl font-bold mb-3">FoodHub Kitchen</h2>
        <p class="text-lg opacity-90 max-w-md">
          Manage your culinary operations, recipes, and orders in one place.
        </p>
      </div>
    </div>

    <!-- RIGHT FORM -->
    <div class="flex flex-1 items-center justify-center px-6">
      <div class="w-full max-w-md">
        <!-- Top bar -->
        <div class="flex justify-end mb-6">
          <UColorModeButton class="cursor-pointer" />
        </div>

        <!-- Brand -->
        <AppBrand />

        <!-- Card -->
        <slot />
      </div>
    </div>
  </div>
</template>
