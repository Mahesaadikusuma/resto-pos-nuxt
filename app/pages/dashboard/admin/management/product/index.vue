<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';

definePageMeta({
    layout: "dashboard",
    
})

useHead({
    title: "Products Management - Dashboard",
});

const config = useRuntimeConfig()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const pagination = reactive({
  pageIndex: Number(route.query.page) || 1,
  pageSize: Number(route.query.per_page) || 10,
})


const { data: products, pending, status, error, refresh } = await useLazyFetch<IProductResponse>(`${config.public.laravelBaseUrl}/product`, {
    headers: {
        'Accept': 'application/json',
    },
    query: computed(() => ({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
    })),
    watch: false,
    key: 'products',
})

if (error.value) {
  toast.add({
    title: 'Gagal memuat data',
    description: error.value.data?.message || error.value.message || 'Gagal memuat data produk, coba lagi.',
    color: 'error',
    icon: 'i-lucide-circle-x',
  })

  navigateTo('/dashboard/admin/management/product')
}

const paginatedProducts = computed<IProduct[]>(() => {
  return products.value?.data || [];
})
const totalItems = computed(() => products.value?.meta?.total || 0);

// Perubahan halaman → fetch + update URL
watch(() => pagination.pageIndex, () => {
  refresh();
})

watch([],() =>  {
  if (pagination.pageIndex !== 1) {
    refresh()
  } else {
   pagination.pageIndex = 1 
  }
})

const columns: TableColumn<IProduct>[] = [
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
        minimumFractionDigits: 0
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
      } else if(stockValue < 5 ) {
        colorStyle = 'font-medium text-yellow-500 dark:text-yellow-400'
      } else {
        colorStyle = 'text-green-500 dark:text-green-400'
      }

      return h('span', { class: `font-medium ${colorStyle}` }, stockValue)
    }
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.original.image
      return h('img', { src: image, alt: 'Product Image', class: 'w-24 h-24 rounded-md' })
    },
  },
  {
    accessorKey: 'is_available',
    header: 'Is Available',
    cell: ({ row }) => {
      const isActive = row.original.is_available
      const stockValue = row.original.stock

      if (isActive && stockValue >= 20) {
        return h('span', { class: 'font-medium text-green-500 dark:text-green-400' }, 'Available')
      } else if (isActive && stockValue >= 10) {
        return h('span', { class: 'font-medium text-yellow-500 dark:text-yellow-400' }, 'Low Stock')
      } else if(isActive && stockValue <=5){
        return h('span', { class: 'font-medium text-orange-500 dark:text-orange-400' }, 'Very Low Stock')
      } else {
        return h('span', { class: 'font-medium text-red-500 dark:text-red-400' }, 'Not Available')
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
        to: `/dashboard/admin/management/product/edit/${product.slug}`,
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
        // onSelect: () => handleDelete(category.uuid, category.name)
      },
    ],
  ]
}

</script>

<template>
  <UContainer>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8">
      <div>
        <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
          Products Management
        </h1>
      </div>
      <div class="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
        <UButton icon="i-lucide-download" color="neutral" variant="soft">
          Export Excel Report
        </UButton>
        <UButton color="primary" variant="solid" to="/dashboard/admin/management/product/create">
          Add New Product
        </UButton>
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md pt-5 px-3 pb-3 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold">
          Filter Categories
        </h3>
        <UButton icon="i-lucide-rotate-ccw" size="sm" variant="ghost" color="neutral" @click="resetFilters">
          Reset
        </UButton>
      </div>
      <div class="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <!-- filterSearchInput: nilai langsung dari user, debounced ke filterSearchCategory -->
        <UFormField label="Search Product">
          <UInput v-model="filterSearchInput" trailing-icon="i-lucide-search" placeholder="Search By Product"
            class="w-full" />
        </UFormField>
        <UFormField label="Status">
          <USelectMenu v-model="filterStatus" :items="['All Status', 'Available', 'Low Stock', 'Not Available']" placeholder="Filter Status"
            class="w-full" />
        </UFormField>
        <!-- <UFormField label="Category">
          <USelectMenu v-model="filterCategory" :items="categories?.data?.map(cat => cat.name)" placeholder="Category"
            class="w-full" />
        </UFormField> -->
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
      <h3 class="text-foreground dark:text-gray-100 text-lg font-bold mb-4">
        All Categories
      </h3>
      <div>
        <UTable  
          sticky 
          :loading="pending"
          :data="paginatedProducts" 
          :columns="columns"
          class="flex-1 max-h-[500px]"
          loading-animation="carousel"
          loading-color="success">
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getDropdownActions(row.original)">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
            </UDropdownMenu>
          </template>

          <template #empty>
            <div class="flex items-center justify-center py-12">
              <p class="text-gray-500">Products is empty</p>
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <div v-if="status === 'success'" class="flex justify-end border-t border-default pt-4 px-4 mt-4">
        <UPagination v-if="totalItems > pagination.pageSize" v-model:page="pagination.pageIndex"
          :items-per-page="pagination.pageSize" :total="totalItems" show-edges :sibling-count="1" />
    </div>
  </UContainer>
</template>