<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
})

useHead({
    title: "Create Product - Dashboard",
});
const { searchCategory, categories, status, onOpen } = await useCategorySelect()

const { 
    productState, 
    productSchema, 
    formErrors, 
    isLoading, 
    onSubmit, 
    displayPrice, 
    displayStock 
} = await useStoreProduct()
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
                        to="/dashboard/admin/management/product"
                    >
                        Back to Products
                    </UButton>
                </div>
                <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
                    Create Product
                </h1>
            </div>
        </div>
        
        <UAlert
            v-if="formErrors.length > 0"
            color="error"
            variant="soft"
            icon="i-lucide-circle-x"
            :description="formErrors.map(e => e.message).join(', ')"
            class="mt-4"
        />

        <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
            <UForm :schema="productSchema" :state="productState" :errors="formErrors" class="space-y-4" @submit="onSubmit">
                <UFormField label="Name" name="name">
                    <UInput v-model="productState.name" class="w-full" :disabled="isLoading" />
                </UFormField>
                <UFormField label="Price" name="price">
                    <UInput v-model="displayPrice" type="text" class="w-full" :disabled="isLoading">
                        <template #leading>
                            <span class="text-gray-500 text-sm font-medium">Rp</span>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Stock" name="stock">
                    <UInput v-model="displayStock" type="text" class="w-full" :disabled="isLoading" >
                        <template #trailing>
                            <span class="text-gray-500">Pcs</span>
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Category" name="category_uuid">
                    <!-- <USelectMenu 
                        v-model="productState.category_uuid"
                        v-model:search-term="searchCategory"
                        :items="categories"
                        label-key="label"
                        :loading="status === 'pending'"
                        :search-input="{
                            placeholder: 'Search Category...',
                            icon: 'i-lucide-search',
                        }"
                        ignore-filter
                        placeholder="Select Category"
                        class="w-full"  
                        @update:open="onOpen"
                    /> -->
                    <USelectMenu
                        v-model="productState.category_uuid"
                        v-model:search-term="searchCategory"
                        :items="categories"
                        :loading="status === 'pending'"
                        icon="i-lucide-list"
                        :search-input="{
                            placeholder: 'Search Category...',
                            icon: 'i-lucide-search',
                        }"
                        placeholder="Select Category"
                        class="w-full"
                        @update:open="onOpen"
                    >
                        <template #item-label="{ item }">
                        {{ item.label }}
                        </template>
                    </USelectMenu>
                </UFormField>

                <UFormField label="Image" name="image">
                    <!-- <UFileUpload v-model="productState.image" accept="image/*" class="w-full min-h-48" /> -->
                    <UFormField label="Image">
                        <UFileUpload v-model="productState.image" accept="image/*" class="w-full min-h-48" />
                    </UFormField>
                </UFormField>


                <UFormField label="Is Available" name="is_available">
                    <UCheckbox v-model="productState.is_available" label="Is Available" class="w-full" :disabled="isLoading" />
                </UFormField>

                <UButton type="submit" class="w-full justify-center" :loading="isLoading">
                    Submit
                </UButton>
            </UForm>
        </div>
    </UContainer>
</template>