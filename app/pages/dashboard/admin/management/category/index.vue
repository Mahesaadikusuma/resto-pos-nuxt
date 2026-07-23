<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';

definePageMeta({
    layout: "dashboard",
})

useHead({
    title: "Category - Dashboard",
});

const config = useRuntimeConfig()
const toast = useToast()

// Hapus `await` agar tidak blocking SSR — gunakan `pending` untuk loading state
// useFetch
const { data: categories, pending, status, error } = useLazyFetch<ICategoryResponse>(
  `${config.public.laravelBaseUrl}/category`,
  {
    headers: {
      'Accept': 'application/json',
    },
    // Pastikan selalu re-fetch saat mount (hindari cache stale)
    watch: false,
  }
)

// ❌ SALAH: if (error) — error adalah Ref, selalu truthy meski tidak ada error
// ✅ BENAR: watch(error) — reaktif, hanya jalan saat error.value berubah jadi ada isinya
watch(error, (newError) => {
  if (newError) {
    toast.add({
      title: 'Gagal memuat data',
      description: newError.data?.message || newError.message || 'Gagal memuat data kategori, coba lagi.',
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
  }
})

// Data utama dari API
const dataTableOrder = computed<ICategory[]>(() => {
  return categories.value?.data ?? []
})

const columns: TableColumn<ICategory>[] = [
  {
    accessorKey: 'uuid',
    header: 'No',
    cell: ({ row }) => row.index + 1,
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

function getDropdownActions(category: ICategory): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Edit',
        icon: 'i-lucide-edit',
        to: `/dashboard/admin/management/category/edit/${category.uuid}`,
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash',
        color: 'error',
      },
    ],
  ]
}

// ─── Pagination ─────────
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
})

// ─── Filter State ───────
// Input langsung dari user (belum di-debounce)
const filterSearchInput = ref('')
const filterSortBy = ref<string | undefined>(undefined)

// ─── Debounce ───────────
// Debounced search value — hanya diupdate 400ms setelah user berhenti mengetik
const filterSearchCategory = ref('')

// ✅ Cara baru: pakai watchDebounced dari VueUse — lebih ringkas, otomatis cleanup
watchDebounced(
  filterSearchInput,
  (val) => {
    filterSearchCategory.value = val
  },
  { debounce: 400 }
)

// ❌ Cara lama: manual debounce pakai setTimeout (tetap valid, tapi lebih verbose)
// let debounceTimer: ReturnType<typeof setTimeout> | null = null
// watch(filterSearchInput, (val) => {
//   if (debounceTimer) clearTimeout(debounceTimer)
//   debounceTimer = setTimeout(() => {
//     filterSearchCategory.value = val
//   }, 400)
// })

// ─── Filtering + Sorting 
const filteredCategories = computed(() => {
  let result = [...dataTableOrder.value]

  // Filter berdasarkan nama
  const querySearch = filterSearchCategory.value.trim().toLowerCase()
  if (querySearch) {
    result = result.filter((cat) => cat.name.toLowerCase().includes(querySearch))
  }

  // Sorting
  if (filterSortBy.value === 'Name A-Z') {
    result.sort((currentCat, nextCat) => currentCat.name.localeCompare(nextCat.name))
  } else if (filterSortBy.value === 'Name Z-A') {
    result.sort((currentCat, nextCat) => nextCat.name.localeCompare(currentCat.name))
  }

  return result
})

// ─── Pagination dari data terfilter ──────────────────────────────────────────
const paginatedCategories = computed(() => {
  const start = (pagination.value.pageIndex - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredCategories.value.slice(start, end)
})

// Reset ke halaman 1 saat filter berubah
watch([filterSearchCategory, filterSortBy], () => {
  pagination.value.pageIndex = 1
})

function resetFilters() {
  filterSearchInput.value = ''
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
                <!-- filterSearchInput: nilai langsung dari user, debounced ke filterSearchCategory -->
                <UFormField label="Search Category">
                    <UInput v-model="filterSearchInput" trailing-icon="i-lucide-search" placeholder="Search By Category" class="w-full" />
                </UFormField>
                <UFormField label="Sort By">
                    <USelectMenu v-model="filterSortBy" :items="['Name A-Z', 'Name Z-A']" placeholder="Sort By" class="w-full" />
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
                    :loading="status === 'pending' || status === 'idle'"
                    :data="paginatedCategories" 
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

                    <template #empty>
                        <div class="flex items-center justify-center py-12">
                          <p class="text-gray-500">Data is empty</p>
                        </div>
                    </template>
                </UTable>
            </div>

            <!-- <div v-if="filteredCategories.length === 0 && !pending" class="text-center py-6 text-gray-500">
                No categories found.
            </div> -->

            <div class="flex justify-end border-t border-default pt-4 px-4 mt-4">
                <UPagination 
                    v-if="status === 'success'"
                    v-model:page="pagination.pageIndex" 
                    :items-per-page="pagination.pageSize"
                    :total="filteredCategories.length" 
                    show-edges 
                    :sibling-count="1" 
                />
            </div>
        </div>
    </UContainer>
</template>