import type { DropdownMenuItem, TableColumn } from "@nuxt/ui"
import type { IUser } from "~/types/Auth"

export function useUserTable(pagination: PaginationState) {
    const { handleEdit } = useEditHakAkses()
    const columns: TableColumn<IUser>[] = [
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
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'roles',
            header: 'Role',
            cell: ({ row }) => row.original.roles?.map((role) => role.name).join(', '),
        },
        {
            accessorKey: 'uuid',
            header: 'Action',
            id: 'action',
        },
    ]

    function getDropdownActions(user: IUser): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Hak Akses',
                    icon: 'i-lucide-edit',
                    onSelect: () => handleEdit(user)
                },
            ],
        ]
    }

    return {
        columns,
        getDropdownActions,
    }
}