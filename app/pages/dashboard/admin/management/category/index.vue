<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';

definePageMeta({
    layout: "dashboard",
})

useHead({
    title: "Category - Dashboard",
});

const config = useRuntimeConfig()

const { data: categories, pending } = await useFetch<ICategoryResponse>(`${config.public.laravelBaseUrl}/category`, {
  headers: {
    'Accept': 'application/json',
  }
})

// PERBAIKAN 1: Gunakan computed agar reaktif terhadap data dari useFetch
const dataTableOrder = computed<ICategory[]>(() => {
    return categories.value?.data || []
})

const columns: TableColumn<ICategory>[] = [
  {
    accessorKey: 'uuid',
    header: 'No',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'uuid',
    header: 'Action',
    id: 'action'
  }
]

function getDropdownActions(category: ICategory): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        to: `/dashboard/admin/management/category/edit/${category.uuid}`
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
}

const pagination = ref({
  pageIndex: 1, 
  pageSize: 10
})

// State filter yang disesuaikan
const filterSearchCategory = ref('')
const filterSortBy = ref<string | undefined>(undefined)

// PERBAIKAN 2: Saring data berdasarkan nama kategori
const filteredOrders = computed(() => {
  let result = [...dataTableOrder.value]

  if (filterSearchCategory.value.trim()) {
    const q = filterSearchCategory.value.trim().toLowerCase()
    result = result.filter((cat) => cat.name.toLowerCase().includes(q))
  }

  // Contoh sederhana sorting
  if (filterSortBy.value === 'Name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

const paginatedOrders = computed(() => {
  const startIndex = (pagination.value.pageIndex - 1) * pagination.value.pageSize
  const endIndex = startIndex + pagination.value.pageSize
  return filteredOrders.value.slice(startIndex, endIndex)
})

watch([filterSearchCategory, filterSortBy], () => {
  pagination.value.pageIndex = 1
})

function resetFilters() {
  filterSearchCategory.value = ''
  filterSortBy.value = undefined
}
</script>

<template>
    <UContainer>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8">
            <div>
                <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
                    Categories Management
                </h1>
            </div>
            <div class="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
                <UButton icon="i-lucide-download" color="neutral" variant="soft">
                    Export Excel Report
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
                <!-- PERBAIKAN 3: Hubungkan v-model ke state filterSearchCategory -->
                <UFormField label="Search Category">
                    <UInput v-model="filterSearchCategory" trailing-icon="i-lucide-search" placeholder="Search By Category" class="w-full" />
                </UFormField>
                <!-- PERBAIKAN 4: Hubungkan v-model ke state filterSortBy -->
                <UFormField label="Sort By">
                    <USelectMenu v-model="filterSortBy" :items="['Name']" placeholder="Sort By" class="w-full" />
                </UFormField>
            </div>
        </div>

        <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
            <h3 class="text-foreground dark:text-gray-100 text-lg font-bold mb-4">
                All Categories
            </h3>
            <div>
                <div v-if="pending" class="text-center py-6 text-gray-500">
                    Loading data...
                </div>
                <UTable 
                    v-else
                    sticky 
                    :data="paginatedOrders" 
                    :columns="columns"
                    class="flex-1 max-h-[500px]" >

                    <template #action-cell="{ row }">
                        <UDropdownMenu :items="getDropdownActions(row.original)">
                            <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                            aria-label="Actions"
                            />
                        </UDropdownMenu>
                    </template>
                </UTable>
            </div>

            <div v-if="filteredOrders.length === 0 && !pending" class="text-center py-6 text-gray-500">
                No categories found.
            </div>

            <!-- PERBAIKAN 5: Ubah :total menggunakan filteredOrders.length -->
            <div class="flex justify-end border-t border-default pt-4 px-4 mt-4">
                <UPagination 
                    v-model:page="pagination.pageIndex" 
                    :items-per-page="pagination.pageSize"
                    :total="filteredOrders.length" 
                    show-edges 
                    :sibling-count="1" 
                />
            </div>
        </div>
    </UContainer>
</template>