const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const permissionService = {
    async createPermission(payload: IPayloadPermission, accessToken: string) {
        const config = useRuntimeConfig()
         return await $fetch<ISinglePermissionResponse>(`${config.public.laravelBaseUrl}/permission`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
            body: payload,
        })
    },
    async updatePermission(id: number, payload: IPayloadPermission, accessToken: string) {
        const config = useRuntimeConfig()
        return await $fetch<ISinglePermissionResponse>(`${config.public.laravelBaseUrl}/permission/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
            body: payload,
        })
    },
    async deletePermission(id: number, accessToken: string) {
        const config = useRuntimeConfig()
        return await $fetch<ISingleCategoryResponse>(`${config.public.laravelBaseUrl}/permission/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
        })
    }
}