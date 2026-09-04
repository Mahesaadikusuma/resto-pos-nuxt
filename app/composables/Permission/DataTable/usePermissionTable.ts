import type { DropdownMenuItem, TableColumn } from "@nuxt/ui"

export async function usePermissionTable(pagination: PaginationState) {
    const { handleEdit } = useEditPermission()
    const { handleDelete } =  await useDeletePermission()
    const columns: TableColumn<IPermission>[] = [
        {
            accessorKey: 'id',
            header: 'No',
            cell: ({ row }) =>
                (pagination.pageIndex - 1) * pagination.pageSize + row.index + 1,
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'uuid',
            header: 'Action',
            id: 'action',
        },
    ]

    function getDropdownActions(permission: IPermission): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Edit',
                    icon: 'i-lucide-edit',
                    onSelect: () => handleEdit(permission)
                },
                {
                    label: 'Delete',
                    icon: 'i-lucide-trash',
                    onSelect: () => handleDelete(permission.id, permission.name)
                },
            ],
        ]
    }

    return {
        columns,
        getDropdownActions,
    }
}