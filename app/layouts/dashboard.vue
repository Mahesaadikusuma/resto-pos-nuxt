<script setup lang="ts">
const open = ref(true)
// composable sidebar
const { getSidebarMenu, userItems, authData } = useNavigation()


const user = ref({
  name: authData.value?.user?.name ?? 'Benjamin Canac',
  // avatar: {
  //   src: 'https://github.com/benjamincanac.png',
  //   alt: 'Benjamin Canac'
  // }
})


</script>

<template>
  <div class="flex flex-1">
    <USidebar v-model:open="open" title="Dashboard" description="Admin Dashboard" collapsible="icon" rail :ui="{
      container: 'h-full',
      inner: 'bg-elevated/25 divide-transparent',
      body: 'py-0'
    }">
      <template #default="{ state }">
        <UNavigationMenu :key="state"  :items="getSidebarMenu(state)" orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }" />
      </template>

      <template #footer>
        <UDropdownMenu :items="userItems" :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }">
          <UButton v-bind="user" :label="user?.name" trailing-icon="i-lucide-chevrons-up-down" color="neutral"
            variant="ghost" square class="w-full data-[state=open]:bg-elevated overflow-hidden" :ui="{
              trailingIcon: 'text-dimmed ms-auto'
            }" />
        </UDropdownMenu>
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col">
      <div class="h-(--ui-header-height) shrink-0 flex items-center  px-4 border-b border-default">
        <UButton icon="i-lucide-panel-left" class="cursor-pointer" color="neutral" variant="ghost" aria-label="Toggle sidebar"
          @click="() => {open = !open}" />
      </div>

      <div class="mb-52">
        <slot />
      </div>
    </div>
  </div>
</template>
