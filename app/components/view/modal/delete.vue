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
        default: 'Konfirmasi Hapus Data',
    },
    description: {
        type: String,
        required: false,
        default: 'Apakah Anda yakin ingin menghapus data ini?',
    }
});

const emit = defineEmits<{close: [boolean]}>()
</script>

<template>
 <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="props.title"
    :description="props.description"
    icon="i-lucide-alert-triangle"
    :ui="{footer: 'justify-end'}">
  
    <!-- Bagian bawah (tombol aksi) -->
    <template #footer="{ close }">
      <div class="flex items-center gap-3">
        <!-- Tombol Batal -->
        <UButton 
            color="neutral" 
            variant="ghost" 
            label="Batal" 
            @click="close" 
        />
        
        <!-- Tombol Hapus (Merah) -->
        <UButton 
            color="error" 
            variant="solid" 
            icon="i-lucide-trash-2"
            label="Ya, Hapus" 
            @click="emit('close', true)" 
        />
      </div>
    </template>
  </UModal>
</template>