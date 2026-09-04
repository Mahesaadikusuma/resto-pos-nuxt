<script setup lang="ts">
const props = defineProps({
    itemId: {
        type: [String, Number],
        required: true,
    },
    itemName: {
        type: String,
        required: false,
        default: 'Data',
    },
    title: {
        type: String,
        required: false,
        default: 'Data',
    },
    submitIcon: {
        type: String,
        default: 'i-lucide-save',
    },
    submitLabel: {
        type: String,
        default: 'Simpan',
    },
    // Warna tombol (misal: 'primary' untuk simpan, 'error' untuk hapus)
    submitColor: {
        type: String as PropType<"success" | "error" | "primary" | "secondary" | "info" | "warning" | "neutral">,
        default: 'primary',
    },
    description: {
        type: String,
        required: false,
        default: 'Data',
    },
    loading: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits<{
    close: [boolean],
    submitForm: []
}>()
</script>


<template>
    <UModal
    scrollable 
    :close="{ onClick: () => emit('close', false) }"
    :title="props.title"
    :description="props.description"
    icon="i-lucide-alert-triangle"
    :ui="{footer: 'justify-end'}">


    <template #body>
        <form id="dynamic-form" @submit.prevent="emit('submitForm')">
            <slot />
        </form>
    </template>
  
    <!-- Bagian bawah (tombol aksi) -->
    <template #footer="{ close }">
      <div class="flex items-center gap-3">
        <!-- Tombol Batal -->
        <UButton 
            type="button"
            color="neutral" 
            variant="ghost" 
            label="Batal" 
            @click="close" 
        />
        
        <!-- Tombol Hapus (Merah) -->
        <UButton 
            type="submit"
            form="dynamic-form"
            :color="submitColor" 
            variant="solid" 
            :icon="props.submitIcon"
            :label="props.submitLabel" 
            :loading="props.loading"
        />
      </div>
    </template>
  </UModal>
</template>