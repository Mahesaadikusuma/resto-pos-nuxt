<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    name: 'management-admin-category-create',
})

useHead({
    title: "Create Category - Dashboard",
});

const { 
    categorySchema, 
    categoryState, 
    formErrors, 
    isLoading, 
    onSubmit 
} = useStoreCategory()

</script>

<template>
    <UContainer>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8">
            <div class="">
                <div class="flex items-center gap-2 mb-5">
                    <UButton 
                        icon="i-lucide-arrow-left" 
                        variant="ghost" 
                        color="neutral"
                        :to="{ name: 'management-admin-categories' }">
                        Back to Categories
                    </UButton>
                </div>
                <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
                    Create Category
                </h1>
            </div>
        </div>

        <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
            <!-- Tambahkan :errors untuk menampilkan error dari Laravel -->
            <UForm :schema="categorySchema" :state="categoryState" :errors="formErrors" class="space-y-4" @submit="onSubmit">
                <UFormField label="Name" name="name">
                    <UInput v-model="categoryState.name" class="w-full" :disabled="isLoading" />
                </UFormField>

                <UFormField label="Is Active" name="is_active">
                    <UCheckbox v-model="categoryState.is_active" label="Is Active" class="w-full" :disabled="isLoading" />
                </UFormField>

                <!-- Tambahkan properti loading agar tombol berputar saat proses -->
                <UButton type="submit" class="w-full justify-center" :loading="isLoading">
                    Submit
                </UButton>
            </UForm>
        </div>
    </UContainer>
</template>