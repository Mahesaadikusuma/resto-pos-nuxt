export const useProduct = defineStore('product', () => {
    const products = ref<IProduct[]>([])
    const pagination = ref({
        pageIndex: 1,
        pageSize: 10,
    })
    const config = useRuntimeConfig()

    const fetchProducts = async (page: number, perPage: number) => {
        const response = await fetch(`${config.public.laravelBaseUrl}/product?page=${page}&per_page=${perPage}`)
        const data = await response.json()
        products.value = data.data
        pagination.value.pageIndex = data.meta.current_page
        pagination.value.pageSize = data.meta.per_page
    }

    const refreshProducts = async () => {
        await fetchProducts(pagination.value.pageIndex, pagination.value.pageSize)
    }

    return {
        products,
        pagination,
        fetchProducts,
        refreshProducts
    }
})