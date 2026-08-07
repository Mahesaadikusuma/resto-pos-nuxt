<script setup lang="ts">
definePageMeta({
    layout: "dashboard",
    auth: true,
    name: "management-admin-product-edit"
})

useHead({
    title: "Edit Product - Dashboard",
});

const route = useRoute()
const productSlug = route.params.slug as string

const { searchCategory, categories, categoriesStatus, onOpen } = await useCategorySelect()

const {
    displayPrice,
    displayStock,
    onSubmit,
    fetchProduct,
    productSchema,
    productState,
    formErrors,
    isLoading,
    pendingProduct
} = await useUpdateProduct()
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
                        :to="{name: 'management-admin-products'}"
                    >
                        Back to Products
                    </UButton>
                </div>
                <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
                    Update Product
                </h1>
                <p class="text-gray-500 mt-2">
                    Sedang mengedit produk name: <span class="font-mono text-primary">{{ productSlug }}</span>
                </p>
            </div>
        </div>

        <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
            <div v-if="pendingProduct" class="flex justify-center py-10 text-gray-500">
                Memuat data...
            </div>
            <UForm v-else :schema="productSchema" :state="productState" :errors="formErrors" class="space-y-4" @submit="onSubmit">
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
                        :loading="categoriesStatus === 'pending'"
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
                        <div v-if="fetchProduct?.data?.image" class="mb-3">
                            <NuxtImg
                                :src="fetchProduct.data.image"
                                class="w-32 h-32 object-cover rounded-md border border-default"
                                alt="Current product image"
                            />
                            <p class="text-xs text-gray-500 mt-1">
                                Upload gambar baru untuk mengganti, atau biarkan kosong untuk tetap pakai gambar ini.
                            </p>
                        </div>
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