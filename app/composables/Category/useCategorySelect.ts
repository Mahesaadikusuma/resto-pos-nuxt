export async function useCategorySelect() {
    const config = useRuntimeConfig()
    const searchCategory = ref('')
    const searchCategoryDebounced = refDebounced(searchCategory, 500)

    const { data: categories, status: categoriesStatus, execute } = await useLazyFetch(`${config.public.laravelBaseUrl}/category?limit=5`, {
        key: 'categories',
        params: { search: searchCategoryDebounced },
        transform: (response: ICategoryResponse)=> {
            const categories = response?.data || []

            return categories.map((category: ICategory) => ({
                label: category.name,
                value: String(category.uuid),
            }))
        },
        immediate: false
    })

    function onOpen() {
        if (!categories.value?.length) {
            execute()
        }
    }

    return {
        searchCategory,
        searchCategoryDebounced,
        categories,
        categoriesStatus,
        onOpen,
    }
}