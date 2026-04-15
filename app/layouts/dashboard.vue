<script setup lang="ts">
import DashboardMobileHeader from "~/components/view/dashboard/header/DashboardMobileHeader.vue";
import Sidebar from "~/components/view/dashboard/Sidebar/Sidebar.vue";

const { isOpen, toggleSidebar, close } = useDashboardSidebar();
</script>

<template>
  <div class="font-sans bg-white min-h-screen overflow-x-hidden">
    <!-- OVERLAY -->
    <div
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
      :class="isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'"
      @click="close" />

    <div class="min-h-screen flex">
      <Sidebar />

      <main class="flex-1 lg:ml-72 p-4 md:p-5 bg-white">
        <!-- Mobile Header -->
        <DashboardMobileHeader title="FoodHub" @toggle="toggleSidebar" />

        <slot />
      </main>
    </div>
  </div>
</template>
