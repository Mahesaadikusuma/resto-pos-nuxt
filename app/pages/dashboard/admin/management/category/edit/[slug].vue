<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
    layout: "dashboard",
    name: "management-admin-category-edit"
})

useHead({
    title: "Update Category - Dashboard",
});

const route = useRoute()
const categorySlug = route.params.slug as string

const categorySchema = z.strictObject({
    name: z.string().min(3, "Name is required"),
    is_active: z.boolean(),
})
type CategorySchema = z.output<typeof categorySchema>

const categoryState = reactive<CategorySchema>({
    name: '',
    is_active: true,
})

const isLoading = ref(false)
const formErrors = ref<{ name: string; message: string }[]>([])
const toast = useToast()
const config = useRuntimeConfig()
const { getSession } = useAuth()

const { data: category, pending, error } = await useFetch<ISingleCategoryResponse>(
  `${config.public.laravelBaseUrl}/category/${categorySlug}`,
  {
    headers: {
      'Accept': 'application/json',
    },
    watch: false,
    key: `category-${categorySlug}`,
    onResponse({ response }) {
        if (response._data?.success && response._data?.data) {
            const categoryData = response._data.data
            categoryState.name = categoryData.name
            categoryState.is_active = Boolean(categoryData.is_active)
        }
    },
    onResponseError({ response }) {
        if (import.meta.client) {
            // Ambil pesan dari Laravel atau pakai pesan default
            const msg = response?._data?.message || 'Data kategori tidak ditemukan.'
            toast.add({
                title: 'Gagal memuat data server',
                description: msg,
                color: 'error',
                icon: 'i-lucide-circle-x',
            })
        }
    }
  },
)

const categoryId = category.value?.data?.uuid as string;
// Jika data tidak ditemukan (misal UUID asal-asalan)
if (error.value) {
    toast.add({
      title: 'Gagal memuat data',
      description: error.value.data?.message || error.value.message || 'Gagal memuat data kategori, coba lagi.',
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
    
    await navigateTo('/dashboard/admin/management/category')
}

async function onSubmit(event: FormSubmitEvent<CategorySchema>) {
    isLoading.value = true
    try {
        const session = await getSession()
        const accessToken = (session?.user as { accessToken: string }).accessToken

        const payload = {
            name: event.data.name,
            is_active: event.data.is_active,
        }
        
        await categoryService.updateCategory(categoryId, payload, accessToken || '')

        toast.add({
            title: 'Category updated successfully',
            description: 'Berhasil mengubah kategori',
            color: 'success',
            icon: 'i-lucide-check',
        })

        await refreshNuxtData('categories')
        await navigateTo('/dashboard/admin/management/category')
    } catch (error: unknown) {
        const err = error as {
                data?: { message?: string; success?: boolean, errors?: Record<string, string[]> }
                message?: string
                response?: { status?: number }
            }
        if (err?.data?.errors) {
            const errors = err.data.errors
            formErrors.value = Object.keys(errors).map(key => ({
                name: key,
                message: errors[key]?.[0] || 'Terjadi kesalahan pada field ini'
            }))
        }
        const errorMessage = err?.data?.message || err?.message || 'Gagal menghapus data.';
        toast.add({
            title: 'Failed to update category',
            description: errorMessage,
            color: 'error',
            icon: 'i-lucide-circle-x',
        })
    } finally {
        isLoading.value = false
    }
}

</script>



<template>
     <UContainer>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8">
            <div class="">
                <div class="flex items-center gap-2 mb-5">
                    <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral"
                        to="/dashboard/admin/management/category">
                        Back to Categories
                    </UButton>
                </div>
                <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
                    Update Category
                </h1>
                <p class="text-gray-500 mt-2">
                    Sedang mengedit kategori name: <span class="font-mono text-primary">{{ categorySlug }}</span>
                </p>
            </div>
        </div>

        <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
            <div v-if="pending" class="flex justify-center py-10 text-gray-500">
                Memuat data...
            </div>
            <!-- Tambahkan :errors untuk menampilkan error dari Laravel -->
            <UForm v-else :schema="categorySchema" :state="categoryState" :errors="formErrors" class="space-y-4" @submit="onSubmit">
                <UFormField label="Name" name="name">
                    <UInput v-model="categoryState.name" class="w-full" :disabled="isLoading" />
                </UFormField>

                <UFormField label="Is Active" name="is_active">
                    <UCheckbox v-model="categoryState.is_active" label="Is Active" class="w-full" :disabled="isLoading" />
                </UFormField>

                <UButton type="submit" class="w-full justify-center" :loading="isLoading">
                    Submit
                </UButton>
            </UForm>
        </div>
    </UContainer>
</template>