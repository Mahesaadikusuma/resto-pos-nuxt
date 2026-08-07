// composables/useCategory.ts
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Skema validasi dipisah di luar fungsi agar tidak dibuat ulang setiap kali dipanggil
export const categorySchema = z.strictObject({
    name: z.string().min(3, "Minimal 3 karakter").max(100, "Maximal 100 karakter"),
    is_active: z.boolean(),
})

export type CategorySchema = z.output<typeof categorySchema>

export const useStoreCategory = () => {
    const toast = useToast()
    const { getSession } = useAuth()

    // State form
    const categoryState = reactive<CategorySchema>({
        name: '',
        is_active: true,
    })

    // State pendukung UI
    const formErrors = ref<{ name: string; message: string }[]>([])
    const isLoading = ref(false)

    // Fungsi Submit
    async function onSubmit(event: FormSubmitEvent<CategorySchema>) {
        formErrors.value = []
        isLoading.value = true

        try {
            // Ambil token sesaat sebelum submit agar selalu fresh
            const session = await getSession()
            const accessToken = (session?.user as { accessToken?: string })?.accessToken;

            // Opsional: Jika API butuh angka (1/0) alih-alih boolean, kamu bisa mapping di sini
            const payload: IPayloadCategory = {
                name: event.data.name,
                is_active: event.data.is_active ? true : false
            }

            const response = await categoryService.createCategory(payload, accessToken || '')

            toast.add({
                title: 'Success',
                description: response?.message || 'Kategori berhasil ditambahkan',
                color: 'success',
            })

            // Arahkan ke halaman list setelah berhasil
            await navigateTo('/dashboard/admin/management/category')
        } catch (error: unknown) {
            const fetchError = error as {
                data?: { message?: string; errors?: Record<string, string[]> }
                message?: string
                response?: { status?: number }
            }
            let errorMessage = fetchError?.data?.message || fetchError?.message || 'Gagal menghapus data.';
            if (errorMessage.includes('1451') || errorMessage.includes('Integrity constraint violation')) {
                errorMessage = 'Kategori tidak bisa dihapus karena masih digunakan oleh produk. Silakan hapus atau pindahkan produk tersebut terlebih dahulu.';
            }

            // Menangkap error validasi spesifik dari Laravel
            if (fetchError?.data?.errors) {
                const errors = fetchError.data.errors
                formErrors.value = Object.keys(errors).map(key => ({
                    name: key,
                    message: errors[key]?.[0] || 'Terjadi kesalahan pada field ini'
                }))
            }

            const statusCode = fetchError?.response?.status;
            const isTokenExpired = statusCode === 401 || errorMessage.toLowerCase().includes('kadaluarsa') || errorMessage.toLowerCase().includes('token tidak valid');

            if (isTokenExpired) {
                const { signOut } = useAuth()

                toast.add({
                    title: 'Sesi Habis',
                    description: 'Sesi Anda telah berakhir. Silakan login kembali.',
                    color: 'warning'
                })
                await signOut({ callbackUrl: '/auth/login' })
            }

            toast.add({
                title: 'Error',
                description: fetchError?.data?.message || 'Gagal menambahkan kategori',
                color: 'error',
            })
        } finally {
            isLoading.value = false
        }
    }

    return {
        categorySchema,
        categoryState,
        formErrors,
        isLoading,
        onSubmit
    }
}