// composables/Product/useProductTable.ts
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'


export function useProductTable(pagination: PaginationState) {
  const { handleDelete } = useDestroyProduct()

  const columns: TableColumn<IProduct>[] = [
    {
      accessorKey: 'uuid',
      header: 'No',
      cell: ({ row }) =>
        (pagination.pageIndex - 1) * pagination.pageSize + row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category.name,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const priceValue = Number(row.original.price)
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(priceValue)
      },
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => {
        const stockValue = Number(row.original.stock)
        let colorStyle = 'text-gray-900 dark:text-gray-100'
        if (stockValue === 0) {
          colorStyle = 'text-red-500 dark:text-red-400'
        } else if (stockValue < 5) {
          colorStyle = 'font-medium text-yellow-500 dark:text-yellow-400'
        } else {
          colorStyle = 'text-green-500 dark:text-green-400'
        }

        return h('span', { class: `font-medium ${colorStyle}` }, stockValue)
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.original.image
        return h('img', {
          src: image,
          alt: 'Product Image',
          class: 'w-24 h-24 rounded-md',
        })
      },
    },
    {
      accessorKey: 'is_available',
      header: 'Is Available',
      cell: ({ row }) => {
        const isActive = row.original.is_available
        const stockValue = row.original.stock

        if (isActive && stockValue >= 20) {
          return h(
            'span',
            { class: 'font-medium text-green-500 dark:text-green-400' },
            'Available',
          )
        } else if (isActive && stockValue >= 10) {
          return h(
            'span',
            { class: 'font-medium text-yellow-500 dark:text-yellow-400' },
            'Low Stock',
          )
        } else if (isActive && stockValue <= 5) {
          return h(
            'span',
            { class: 'font-medium text-orange-500 dark:text-orange-400' },
            'Very Low Stock',
          )
        } else {
          return h(
            'span',
            { class: 'font-medium text-red-500 dark:text-red-400' },
            'Not Available',
          )
        }
      },
    },
    {
      accessorKey: 'uuid',
      header: 'Action',
      id: 'action',
    },
  ]

  function getDropdownActions(product: IProduct): DropdownMenuItem[][] {
    return [
      [
        {
          label: 'Edit',
          icon: 'i-lucide-edit',
          // to: `/dashboard/admin/management/product/edit/${product.slug}`,
          to: { 
            name: "management-admin-product-edit", 
            params: { slug: product.slug }
          }
        },
        {
          label: 'Delete',
          icon: 'i-lucide-trash',
          color: 'error',
          onSelect: () => handleDelete(product.uuid, product.name),
        },
      ],
    ]
  }

  return {
    columns,
    getDropdownActions,
  }
}