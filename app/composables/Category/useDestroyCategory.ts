import { LazyViewModalDelete } from "#components"


export const useDestroyCategory = () => {
    const toast = useToast()
    const overlay = useOverlay()
    const modal = overlay.create(LazyViewModalDelete)

    async function handleDelete(id: string, name: string) {
        const instance = modal.open({
            itemId: id,
            itemName: name,
            title: 'Konfirmasi Hapus Data',
            description: `Apakah Anda yakin ingin menghapus kategori "${name}"? Tindakan ini tidak dapat dibatalkan.`
        })

        // Tunggu jawaban dari emit('close', true/false)
        const isConfirmed = await instance.result
        if (!isConfirmed) return

        try {
            const { getSession } = useAuth()
            const session = await getSession()
            const accessToken = (session?.user as { accessToken?: string })?.accessToken;

            const response = await categoryService.deleteCategory(id, accessToken || '')

            if (response && !response.success) {
                // Lempar sebagai error agar masuk ke blok catch di bawah
                throw new Error(response.message || 'Gagal menghapus data')
            }

            // Refresh data HANYA jika benar-benar berhasil
            await refreshNuxtData('categories')
            toast.add({
                title: 'Berhasil',
                description: `${name} berhasil dihapus.`,
                color: 'success'
            })
        } catch (error: unknown) {
            // Lakukan casting ke objek yang aman untuk TypeScript
            const err = error as {
                data?: { message?: string; success?: boolean }
                message?: string
                response?: { status?: number }
            }
            let errorMessage = err?.data?.message || err?.message || 'Gagal menghapus data.';
            // includes adalah sebuah fungsi bawaan (metode) yang digunakan untuk mencari apakah sebuah teks (substring) terdapat di dalam teks lain yang lebih panjang
            // jadi includes jika ada kalimait Integrity constraint maka nilainya menjadi true dan jika gak ada kalimatnya maka jadi false
            if (errorMessage.includes('1451') || errorMessage.includes('Integrity constraint violation')) {
                errorMessage = 'Kategori tidak bisa dihapus karena masih digunakan oleh produk. Silakan hapus atau pindahkan produk tersebut terlebih dahulu.';
            }
            toast.add({
                title: 'Gagal',
                description: errorMessage,
                color: 'error'
            })

            const statusCode = err?.response?.status;
            const isTokenExpired = statusCode === 401 || errorMessage.toLowerCase().includes('kadaluarsa') || errorMessage.toLowerCase().includes('token tidak valid');

            if (isTokenExpired) {
                const { signOut } = useAuth()

                toast.add({
                    title: 'Sesi Habis',
                    description: 'Sesi Anda telah berakhir. Silakan login kembali.',
                    color: 'warning'
                })

                // Paksa logout dan arahkan ke halaman login (sesuaikan path '/login' dengan aplikasimu)
                await signOut({ callbackUrl: '/auth/login' })
            }
        }
    }


    return {
        handleDelete
    }

}