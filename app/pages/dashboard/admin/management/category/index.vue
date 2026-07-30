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
const route = useRoute()
const router = useRouter()

// ─── Pagination state — inisialisasi dari URL kalau ada ───────────
const pagination = ref({
  pageIndex: Number(route.query.page) || 1,
  pageSize: Number(route.query.per_page) || 10,
})

// ─── Filter State — inisialisasi dari URL kalau ada ────────────────
const filterSearchInput = ref((route.query.search as string) || '')
const filterStatus = ref<string | undefined>(
  route.query.is_active === '1' ? 'Active'
  : route.query.is_active === '0' ? 'Inactive'
  : undefined
)
const filterSearchCategory = ref(filterSearchInput.value)

watchDebounced(
  filterSearchInput,
  (val) => {
    filterSearchCategory.value = val
  },
  { debounce: 400 }
)

// ─── Sync semua state ke URL browser ───────────────────────────────
// Setiap kali pagination/filter berubah, update query string di address bar
// tanpa reload halaman (router.replace, bukan router.push, supaya tidak
// menumpuk history — user tekan "back" tidak perlu klik berkali-kali)
function syncQueryToUrl() {
  const query: Record<string, string> = {
    page: String(pagination.value.pageIndex),
    per_page: String(pagination.value.pageSize),
  }

  if (filterSearchCategory.value) {
    query.search = filterSearchCategory.value
  }

  if (filterStatus.value === 'Active') {
    query.is_active = '1'
  } else if (filterStatus.value === 'Inactive') {
    query.is_active = '0'
  }

  router.replace({ query })
}

// ─── Fetch data ke Laravel ───────────────────
const { data: categories, pending, status, error, refresh } = useLazyFetch<ICategoryResponse>(
  `${config.public.laravelBaseUrl}/category`,
  {
    headers: {
      'Accept': 'application/json',
    },
    query: computed(() => ({
      page: pagination.value.pageIndex,
      per_page: pagination.value.pageSize,
      search: filterSearchCategory.value || undefined,
      is_active: filterStatus.value === 'Active' ? 1 : filterStatus.value === 'Inactive' ? 0 : undefined,
    })),
    watch: false,
    key: 'categories',
  }
)

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

const paginatedCategories = computed<ICategory[]>(() => {
  return categories.value?.data ?? []
})

const totalItems = computed(() => categories.value?.meta?.total ?? 0)

// Perubahan halaman → fetch + update URL
watch(() => pagination.value.pageIndex, () => {
  refresh()
  syncQueryToUrl()
})

// Perubahan filter → reset halaman (yang otomatis trigger watcher di atas),
// atau kalau sudah di halaman 1, refresh + sync manual
watch([filterSearchCategory, filterStatus], () => {
  if (pagination.value.pageIndex === 1) {
    refresh()
    syncQueryToUrl()
  } else {
    pagination.value.pageIndex = 1
  }
})

const columns: TableColumn<ICategory>[] = [
  {
    accessorKey: 'uuid',
    header: 'No',
    cell: ({ row }) => (pagination.value.pageIndex - 1) * pagination.value.pageSize + row.index + 1,
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
      return h('span', { class: `font-medium ${
        isActive
          ? 'text-emerald-500 dark:text-emerald-400'
          : 'text-amber-500 dark:text-amber-400'
      }` }, isActive ? 'Active' : 'Inactive')
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
        to: `/dashboard/admin/management/category/edit/${category.uuid}`,
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

const { handleDelete } = useDestroyCategory()

function resetFilters() {
  filterSearchInput.value = ''
  filterSearchCategory.value = ''
  filterStatus.value = undefined
  if (pagination.value.pageIndex !== 1) {
    pagination.value.pageIndex = 1  // ini otomatis trigger refresh() + syncQueryToUrl() lewat watcher pageIndex
  } else {
    refresh()
    syncQueryToUrl()
  }
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
        <UButton color="primary" variant="solid" to="/dashboard/admin/management/category/create">
          Add New Category
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
          <UInput v-model="filterSearchInput" trailing-icon="i-lucide-search" placeholder="Search By Category"
            class="w-full" />
        </UFormField>
        <UFormField label="Status">
          <USelectMenu v-model="filterStatus" :items="['All Status', 'Active', 'Inactive']" placeholder="Filter Status"
            class="w-full" />
        </UFormField>
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
          :data="paginatedCategories" 
          :columns="columns"
          class="flex-1"
          loading-animation="carousel"
          loading-color="success">
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getDropdownActions(row.original)">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
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
        <UPagination v-if="status === 'success' && totalItems > pagination.pageSize" v-model:page="pagination.pageIndex"
          :items-per-page="pagination.pageSize" :total="totalItems" show-edges :sibling-count="1" />
      </div>
    </div>
  </UContainer>
</template>
