const headers = {
    'Accept': 'application/json',
}
export const ProductService = {
    async createProduct(payload: FormData, accessToken: string) {
        const config = useRuntimeConfig()
         return await $fetch<ISingleProductResponse>(`${config.public.laravelBaseUrl}/product`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
            body: payload,
        })
    },

    async updateProduct(productId: string, payload: FormData, accessToken: string) {
        const config = useRuntimeConfig()
         return await $fetch<ISingleProductResponse>(`${config.public.laravelBaseUrl}/product/${productId}`, {
            method: 'POST',
            body: payload,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
        })
    },

    async deleteProduct(productId: string, accessToken: string) {
        const config = useRuntimeConfig()
         return await $fetch<ISingleProductResponse>(`${config.public.laravelBaseUrl}/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
        })
    },
}