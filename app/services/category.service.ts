import type { CategoryResponse } from "~/types/Category"




export const categoryService = async () => {
    const config = useRuntimeConfig()
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    const getCategories = async () => {
        return await $fetch<CategoryResponse>(`${config.LARAVEL_BASE_URL}/category`, {
            method: 'GET',
            headers,
        })
    }

    return {
        getCategories,
    }
}