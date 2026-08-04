import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

export const productSchema = z.strictObject({
    name: z.string().min(3, "Name is required"),
    price: z.coerce.number().min(0, "Price is required"),
    stock: z.coerce.number().min(0, "Stock is required"),
    category_uuid: z.object({
        label: z.string(),
        value: z.string(),
    }, {
        error: "Category is required",
    }),
    image: z.instanceof(File, { message: "Image is required" }).optional(),
    is_available: z.boolean(),
})
// Tipe hasil VALIDASI (dipakai saat submit, semua field wajib lengkap)
export type ProductSchema = z.output<typeof productSchema>

export type CategoryOption = { label: string; value: string }

// Tipe STATE form (dipakai untuk v-model, boleh ada field belum terisi)
// Override category_uuid supaya boleh undefined di awal, meski di ProductSchema wajib ada
export type ProductFormState = Omit<ProductSchema, 'category_uuid'> & {
    category_uuid: CategoryOption | undefined
}

export async function useUpdateProduct() {
    const toast = useToast()
    const { getSession } = useAuth()
    const formErrors = ref<{ name: string; message: string }[]>([])
    const isLoading = ref(false)
    // const config = useRuntimeConfig()
    const route = useRoute()
    const productSlug = route.params.slug as string

    // State form
    const productState = reactive<ProductFormState>({
        name: '',
        price: 0,
        stock: 0,
        category_uuid: undefined,
        image: undefined,
        is_available: true,
    })

    // const { data: product, pending: pendingProduct, error: errorProduct } = await useFetch<ISingleProductResponse>(`${config.public.laravelBaseUrl}/product/${productSlug}`, {
    //     headers: {
    //         Accept: 'application/json'
    //     },
    //     watch: false,
    //     onResponse({ response }) {
    //         if (response._data?.success && response._data?.data) {
    //             const productData = response._data.data
    //             productState.name = productData.name
    //             productState.price = Number(productData.price)
    //             productState.stock = Number(productData.stock)
    //             productState.category_uuid = {
    //                 label: productData.category?.name,
    //                 value: productData.category?.uuid,
    //             }
    //             productState.is_available = Boolean(productData.is_available)
    //         }
    //     },
    //     onResponseError({ response }) {
    //         if (import.meta.client) {
    //             const msg = response._data?.message || 'Data product tidak ditemukan.'
    //             toast.add({
    //                 title: 'Gagal memuat data',
    //                 description: msg,
    //                 color: 'error',
    //                 icon: 'i-lucide-circle-x',
    //             })
    //         }
    //     }
    // })
    const { fetchProduct, pendingProduct, errorProduct } = await useDetailProduct(productSlug)

    if (errorProduct.value) {
        toast.add({
            title: 'Gagal memuat data',
            description: errorProduct.value.data?.message || errorProduct.value.message || 'Gagal memuat data Product, coba lagi.',
            color: 'error',
            icon: 'i-lucide-circle-x',
        })

        await navigateTo('/dashboard/admin/management/product')
    }

    if (fetchProduct.value?.data) {
        const productData = fetchProduct.value.data
        productState.name = productData.name
        productState.price = Number(productData.price)
        productState.stock = Number(productData.stock)
        productState.category_uuid = {
            label: productData.category?.name,
            value: productData.category?.uuid,
        }
        productState.is_available = Boolean(productData.is_available)
    }

    // const productId = product.value?.data?.uuid as string;
    const productId = computed(() => fetchProduct.value?.data?.uuid)

    const displayPrice = computed({
        // get() ini bertugas untuk mengubah angka menjadi format mata uang "Rp" saat ditampilkan ke layar. 
        // Misalnya mengubah angka murni (25000) dari state menjadi teks "25.000" untuk dilihat user di layar.
        get: () => {
            if (!productState.price) return '';
            return productState.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        // Menangkap ketikan user (misal: "25.a000")
        // Membersihkan huruf 'a' (menyisakan "25000")...
        set: (newValue: string) => {
            const pureNumberString = newValue.replace(/\D/g, '');
            productState.price = pureNumberString ? Number(pureNumberString) : 0
        }
    })

    const displayStock = computed({
        // Format angka murni jadi "12.000" untuk ditampilkan ke user
        get: () => {
            if (!productState.stock) return '';
            return productState.stock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        // Bersihkan input user, sisakan digit saja, simpan sebagai number murni ke state
        set: (newValue: string) => {
            const pureNumberString = newValue.replace(/\D/g, '');
            productState.stock = pureNumberString ? Number(pureNumberString) : 0
        }
    })

    async function onSubmit(event: FormSubmitEvent<ProductSchema>) {
        isLoading.value = true
        try {
            const session = await getSession()
            const accessToken = (session?.user as { accessToken: string }).accessToken

            if (!productId.value) {
                toast.add({
                    title: 'Gagal update produk',
                    description: 'ID produk tidak ditemukan.',
                    color: 'error',
                    icon: 'i-lucide-circle-x',
                })
                return
            }

            const validProductId = productId.value

            const formData = new FormData()
            formData.append('_method', 'PUT')

            formData.append('name', event.data.name)
            formData.append('price', String(event.data.price))
            formData.append('stock', String(event.data.stock))
            formData.append('is_available', event.data.is_available ? '1' : '0')

            // Pastikan kita benar-benar hanya mengambil teks UUID-nya, bukan objectnya
            // const categoryId = event.data.category_uuid.value
            const categoryId = typeof event.data.category_uuid === 'object'
                ? event.data.category_uuid.value
                : event.data.category_uuid;

            formData.append('category_uuid', categoryId)

            // 3. CEK GAMBAR SEBELUM DIKIRIM
            // Hanya kirim gambar jika ukurannya lebih dari 0 bytes (berarti user benar-benar upload gambar baru)
            if (event.data.image && event.data.image.size > 0) {
                formData.append('image', event.data.image)
            }
            await ProductService.updateProduct(validProductId, formData, accessToken || '')

            toast.add({
                title: 'Product updated successfully',
                description: 'Berhasil mengubah produk',
                color: 'success',
                icon: 'i-lucide-check',
            })

            await refreshNuxtData('products')
            await navigateTo('/dashboard/admin/management/product')
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
                title: 'Failed to update product',
                description: errorMessage,
                color: 'error',
                icon: 'i-lucide-circle-x',
            })
        } finally {
            isLoading.value = false
        }
    }

    return {
       displayPrice, displayStock, onSubmit, fetchProduct, productSchema, productState, formErrors, isLoading, pendingProduct
    }
}