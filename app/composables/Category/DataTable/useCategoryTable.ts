import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'


export function useCategoryTable(pagination: PaginationState) {
    const { handleDelete } = useDestroyCategory()

    const columns: TableColumn<ICategory>[] = [
        {
            accessorKey: 'uuid',
            header: 'No',
            cell: ({ row }) => (pagination.pageIndex - 1) * pagination.pageSize + row.index + 1,
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'is_active',
            header: 'Is Active',
            cell: ({ row }) => {
                const isActive = row.original.is_active
                return h('span', {
                    class: `font-medium ${isActive
                            ? 'text-emerald-500 dark:text-emerald-400'
                            : 'text-amber-500 dark:text-amber-400'
                        }`
                }, isActive ? 'Active' : 'Inactive')
            },
        },
        {
            accessorKey: 'uuid',
            header: 'Action',
            id: 'action',
        },
    ]

    function getDropdownActions(category: ICategory): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Edit',
                    icon: 'i-lucide-edit',
                    to: {
                        name: 'management-admin-category-edit',
                        params: { slug: category.slug }
                    }
                },
                {
                    label: 'Delete',
                    icon: 'i-lucide-trash',
                    color: 'error',
                    onSelect: () => handleDelete(category.uuid, category.name)
                },
            ],
        ]
    }

    return {
        columns,
        getDropdownActions
    }
}