const headers = {
    'Accept': 'application/json',
}

export const userService = {
    async updateHakAkses(id: number, payload: FormData, accessToken: string) {
        const config = useRuntimeConfig()
        return await $fetch<ISingleResponseUserHakAkses>(`${config.public.laravelBaseUrl}/users/${id}/role`, {
            method: 'POST',
            body: payload,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...headers
            },
        })
    },
}