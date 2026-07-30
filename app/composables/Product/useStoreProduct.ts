import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

interface CategoryOption {
    label: string
    value: string
}

export const productSchema = z.strictObject({
    name: z.string().min(3, "Name is required"),
    price: z.number({
        error: (issue) => issue.input === undefined
            ? "Price is required"
            : "Price is required"
    }).min(0, "Price cannot be negative"),

    stock: z.number({
        error: (issue) => issue.input === undefined
            ? "Stock is required"
            : "Stock is required"
    }).min(0, "Stock cannot be negative"),

    category_uuid: z.object({
        label: z.string(),
        value: z.string(),
    }, {
        error: "Category is required",
    }),

    image: z.instanceof(File, { message: "Image is required" }).refine((file) => file.size > 0, {
        message: 'Image is required',
        path: ['image'],
    }),

    is_available: z.boolean(),
})

export type ProductSchema = z.output<typeof productSchema>

// PERBAIKAN: override category_uuid juga, bukan cuma image
export type ProductFormState = Omit<ProductSchema, 'image' | 'category_uuid' | 'price' | 'stock'> & {
    image: File | undefined
    category_uuid: CategoryOption | undefined
    price: number | undefined // 👈 Tambahkan ini
    stock: number | undefined // 👈 Tambahkan ini
}

export async function useStoreProduct() {
    const toast = useToast()
    const { getSession } = useAuth()
    const formErrors = ref<{ name: string; message: string }[]>([])
    const isLoading = ref(false)

    const productState = reactive<ProductFormState>({
        name: '',
        price: undefined,
        stock: undefined,
        category_uuid: undefined,
        image: undefined,
        is_available: true,
    })

    const displayPrice = computed({
        get: () => {
            // Cek jika undefined, kembalikan string kosong
            if (productState.price === undefined) return '';
            return productState.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        set: (newValue: string) => {
            const pureNumberString = newValue.replace(/\D/g, '');
            // Jika kosong, kembalikan undefined BUKAN 0
            productState.price = pureNumberString ? Number(pureNumberString) : undefined
        }
    })

    const displayStock = computed({
        get: () => {
            // Cek jika undefined, kembalikan string kosong
            if (productState.stock === undefined) return '';
            return productState.stock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        set: (newValue: string) => {
            const pureNumberString = newValue.replace(/\D/g, '');
            // Jika kosong, kembalikan undefined BUKAN 0
            productState.stock = pureNumberString ? Number(pureNumberString) : undefined
        }
    })


    async function onSubmit(event: FormSubmitEvent<ProductSchema>) {
        isLoading.value = true
        formErrors.value = []

        try {
            const session = await getSession()
            const accessToken = (session?.user as { accessToken: string })?.accessToken

            if (!accessToken) {
                toast.add({
                    title: 'Sesi berakhir',
                    description: 'Silakan login ulang.',
                    color: 'error',
                    icon: 'i-lucide-circle-x',
                })
                return
            }

            const formData = new FormData()
            // PERBAIKAN: pakai event.data (hasil VALIDASI), bukan productState mentah —
            // lebih aman karena sudah pasti lolos schema (coerce, dst)
            formData.append('name', event.data.name)
            formData.append('price', String(event.data.price))
            formData.append('stock', String(event.data.stock))
            formData.append('category_uuid', event.data.category_uuid.value)
            formData.append('is_available', event.data.is_available ? '1' : '0')
            formData.append('image', event.data.image)

            await ProductService.createProduct(formData, accessToken)

            toast.add({
                title: 'Product created successfully',
                description: 'Berhasil menambahkan produk',
                color: 'success',
                icon: 'i-lucide-check',
            })

            await refreshNuxtData('products')
            await navigateTo('/dashboard/admin/management/product')
        } catch (error: unknown) {
            const err = error as {
                data?: { message?: string; errors?: Record<string, string[]> }
                message?: string
            }

            if (err?.data?.errors) {
                const errors = err.data.errors
                formErrors.value = Object.keys(errors).map((key) => ({
                    name: key,
                    message: errors[key]?.[0] || 'Terjadi kesalahan pada field ini',
                }))
            }

            const errorMessage = err?.data?.message || err?.message || 'Gagal menambahkan produk.'
            toast.add({
                title: 'Failed to add product',
                description: errorMessage,
                color: 'error',
                icon: 'i-lucide-circle-x',
            })
        } finally {
            isLoading.value = false
        }
    }

    // PERBAIKAN: return semua yang dibutuhkan komponen
    return {
        productState,
        productSchema,
        formErrors,
        displayPrice,
        displayStock,
        isLoading,
        onSubmit,
    }
}