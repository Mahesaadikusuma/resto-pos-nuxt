export async function useDetailProduct(slug: string) {
    const config = useRuntimeConfig()
    const toast = useToast()

    const { data: fetchProduct, pending: pendingProduct, error: errorProduct } = await useFetch<ISingleProductResponse>(`${config.public.laravelBaseUrl}/product/${slug}`, {
        headers: {
            Accept: 'application/json'
        },
        watch: false,
        onResponseError({ response }) {
            if (import.meta.client) {
                const msg = response._data?.message || 'Data product tidak ditemukan.'
                toast.add({
                    title: 'Gagal memuat data',
                    description: msg,
                    color: 'error',
                    icon: 'i-lucide-circle-x',
                })
            }
        }
    })

    return {
        fetchProduct,
        pendingProduct,
        errorProduct
    }
}