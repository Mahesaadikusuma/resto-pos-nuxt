const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}
export const categoryService = {
    async createCategory(payload: IPayloadCategory, accessToken: string) {
        const config = useRuntimeConfig()
         return await $fetch<ISingleCategoryResponse>(`${config.public.laravelBaseUrl}/category`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
            body: payload,
        })
    },
    async updateCategory(id: string, payload: IPayloadCategory, accessToken: string) {
        const config = useRuntimeConfig()
        return await $fetch<ISingleCategoryResponse>(`${config.public.laravelBaseUrl}/category/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
            body: payload,
        })
    },
    async deleteCategory(id: string, accessToken: string) {
        const config = useRuntimeConfig()
        return await $fetch<ISingleCategoryResponse>(`${config.public.laravelBaseUrl}/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
        })
    }
}