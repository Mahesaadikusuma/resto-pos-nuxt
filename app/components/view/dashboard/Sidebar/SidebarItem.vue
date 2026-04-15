<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: "",
  },
  href: {
    type: String,
    default: "#",
  },
});

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.href;
});
</script>

<template>
  <a :href="href" class="group cursor-pointer">
    <div
      class="flex items-center gap-2.5 px-4 py-3 rounded-card transition rounded-2xl cursor-pointer"
      :class="isActive ? 'bg-[#276874] text-white' : 'hover:bg-gray-100'">
      <Icon
        v-if="icon"
        :name="icon"
        size="28"
        :class="isActive ? '' : 'text-gray-600 group-hover:text-primary'" />

      <span :class="isActive ? '' : 'text-foreground group-hover:text-primary'">
        {{ label }}
      </span>
    </div>
  </a>
</template>
