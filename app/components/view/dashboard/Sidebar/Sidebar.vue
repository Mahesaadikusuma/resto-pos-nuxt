<script setup lang="ts">
import SidebarItem from "./SidebarItem.vue";
import SidebarAccordion from "./SidebarAccordion.vue";
import SidebarSection from "./SidebarSection.vue";
import { SIDEBAR_ADMIN } from "./sidebarMenu";

const { isOpen, close } = useDashboardSidebar();
</script>

<template>
  <aside
    id="sidebar"
    class="w-72 bg-muted fixed inset-y-0 left-0 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
    <!-- Logo Section -->
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="bg-red-500 rounded-xl p-3 flex items-center justify-center">
            <Icon name="mdi-food-fork-drink" size="24" class="text-white" />
          </div>
          <div>
            <h1 class="text-foreground text-lg font-bold">FoodHub</h1>
            <p class="text-foreground text-xs font-normal">Manager Dashboard</p>
          </div>
        </div>
        <button
          class="lg:hidden p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all duration-200"
          @click="close">
          <Icon name="mdi:close" size="20" class="text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
      <SidebarSection
        v-for="section in SIDEBAR_ADMIN"
        :key="section.title"
        :title="section.title">
        <template v-for="item in section.items" :key="item.label">
          <!-- Normal Item -->
          <SidebarItem
            v-if="item.type === 'item'"
            :icon="item.icon"
            :label="item.label"
            :href="item.route" />

          <!-- Accordion -->
          <SidebarAccordion
            v-else-if="item.type === 'accordion'"
            :icon="item.icon"
            :label="item.label">
            <SidebarItem
              v-for="child in item.children"
              :key="child.label"
              :label="child.label"
              :href="child.route" />
          </SidebarAccordion>
        </template>
      </SidebarSection>
    </nav>

    <!-- User Profile at Bottom -->
    <div class="px-6 pb-6 mt-auto">
      <div class="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
          alt="Admin User profile photo"
          class="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-foreground text-base font-semibold truncate">
            Admin User
          </p>
          <p class="text-foreground text-sm font-normal truncate">
            admin@company.com
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
