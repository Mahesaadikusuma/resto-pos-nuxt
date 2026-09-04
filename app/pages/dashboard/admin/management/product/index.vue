<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  auth: true,
  name: "management-admin-products"
});

useHead({
  title: "Products Management - Dashboard",
});

const config = useRuntimeConfig();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const pagination = reactive({
  pageIndex: Number(route.query.page) || 1,
  pageSize: Number(route.query.per_page) || 10,
});

// Filter Product
// const filterSearchInput = ref((route.query.search as string) || '')
// const filterStatus = ref<string | undefined>(
//   route.query.is_available === '1' ? 'Available'
//   : route.query.is_available === '0' ? 'Not Available'
//   : undefined
// )
const { searchCategory, categories, categoriesStatus, onOpen } = await useCategorySelect()

const filters = reactive({
  search: (route.query.search as string) || '',
  status: route.query.is_available === '1' ? 'Available'
  : route.query.is_available === '0' ? 'Not Available'
  : undefined,
  category: undefined as CategoryOption | undefined
})

const filterSearchProduct = ref(filters.search)

watchDebounced(
  () => filters.search,   // pakai getter function reactive object tiap kali dicek
  (val) => {
    filterSearchProduct.value = val
  },
  { debounce: 500, maxWait: 1000 }
)

// Sync semua state ke URL browser
function syncQueryToUrl() {
  const query: Record<string, string> = {
    page: String(pagination.pageIndex),
    per_page: String(pagination.pageSize),
  }

  if (filterSearchProduct.value) {
    query.search = filterSearchProduct.value
  }

  if (filters.status === 'Available') {
    query.is_available = '1'
  } else if (filters.status === 'Not Available') {
    query.is_available = '0'
  }

  // ini ketika pakai label atau name category
  if (filters.category?.label) {
    query.category = filters.category.label
  }

  router.replace({ query })
}

const { data: products, pending, status, error, refresh } = await useLazyFetch<IProductResponse>(
  `${config.public.laravelBaseUrl}/product`,
  {
    headers: {
      'Accept': 'application/json',
    },
    query: computed(() => ({
      page: pagination.pageIndex,
      per_page: pagination.pageSize,
      search: filterSearchProduct.value || undefined,
      is_available: filters.status === 'Available' ? 1 : filters.status === 'Not Available' ? 0 : undefined,
      category: filters.category?.value || undefined,
    })),
    // PENTING: watch: false — supaya tidak ada double-fetch/race condition
    // saat filter berubah bersamaan dengan reset pageIndex (sudah kita bahas sebelumnya di category)
    watch: false,
    key: 'products',
  }
)

if (error.value) {
  toast.add({
    title: 'Gagal memuat data',
    description: error.value.data?.message || error.value.message || 'Gagal memuat data produk, coba lagi.',
    color: 'error',
    icon: 'i-lucide-circle-x',
  })

  await navigateTo('/dashboard/admin/management/product')
}

const paginatedProducts = computed<IProduct[]>(() => {
  return products.value?.data || [];
})
const totalItems = computed(() => products.value?.meta?.total || 0);

// Perubahan halaman → fetch + update URL
watch(() => pagination.pageIndex, () => {
  refresh()
  syncQueryToUrl()
})

// INI jika filter.statusnya pakai reactive
// watch([filterSearchProduct, () => filters.status], () => {
//   if (pagination.pageIndex === 1) {
//     refresh()
//     syncQueryToUrl()
//   } else {
//     pagination.pageIndex = 1
//   }
// })

// watchEffect(() => {
//   // Vue otomatis deteksi: fungsi ini akses filterSearchProduct.value DAN filters.status
//   // jadi keduanya otomatis dipantau, tanpa perlu getter function manual
//   const search = filterSearchProduct.value
//   const status = filters.status
//   const category = filters.category
//   // search dan stat memang tidak dipakai lagi di bawah — itu TIDAK masalah
//   // Vue sudah "mencatat": fungsi ini bergantung pada filterSearchProduct dan filters.status

//   if (pagination.pageIndex === 1) {
//     refresh()
//     syncQueryToUrl()
//   } else {
//     pagination.pageIndex = 1
//   }
// })

// Hapus watchEffect, ganti dengan watch biasa dalam bentuk Array
watch([
  // filterSearchProduct, // ini ref (bisa langsung dipantau)
  () => filterSearchProduct.value, // ini ref pakai getter
  () => filters.status,  //Ini reactive
  () => filters.category?.value // Ini reactive
], () => {
  if (pagination.pageIndex === 1) {
    refresh()
    syncQueryToUrl()
  } else {
    // Jika tidak di halaman 1, paksa ke halaman 1.
    // Otomatis akan memicu watch(pagination.pageIndex) yang ada di kodemu sebelumnya.
    pagination.pageIndex = 1
  }
})

// Column Product
const { columns, getDropdownActions } = useProductTable(pagination)

function resetFilters() {
  filters.search = "";
  filterSearchProduct.value = "";
  filters.status = undefined;
  filters.category = undefined;
  if (pagination.pageIndex !== 1) {
    pagination.pageIndex = 1;
  } 
  // else {
  //   refresh();
  //   syncQueryToUrl();
  // }
}
const refreshProductData = async () => {
  try {
    await refresh();
    toast.add({
      title: "Data Diperbarui",
      description: "Data produk berhasil dimuat ulang.",
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error: unknown) {
    const err = error as { data?: { message?: string } };
    toast.add({
      title: "Gagal",
      description: err?.data?.message || "Gagal merefresh data",
      color: "error",
    });
  }
};
</script>

<template>
  <UContainer>
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-5 md:mb-8"
    >
      <div>
        <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
          Products Management
        </h1>
      </div>
      <div class="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
        <UButton icon="i-lucide-download" color="neutral" variant="soft">
          Export Excel Report
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          :to="{name: 'management-admin-product-create'}"
        >
          Add New Product
        </UButton>
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md pt-5 px-3 pb-3 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold">
          Filter Products
        </h3>

        <UButton
          icon="i-lucide-rotate-ccw"
          size="sm"
          variant="ghost"
          color="neutral"
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
      <div
        class="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <!-- filterSearchInput: nilai langsung dari user, debounced ke filterSearchCategory -->
        <UFormField label="Search Product">
          <UInput
            v-model="filters.search"
            trailing-icon="i-lucide-search"
            placeholder="Search By Product"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Status">
          <USelect 
            v-model="filters.status"
            :items="['All Status', 'Available', 'Not Available']"
            placeholder="Filter Status"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Category">
          <USelectMenu
            v-model="filters.category"
            v-model:search-term="searchCategory"
            :items="categories"
            :loading="categoriesStatus === 'pending'"
            icon="i-lucide-list"
            :search-input="{
                placeholder: 'Search Category...',
                icon: 'i-lucide-search',
            }"
            placeholder="Select Category"
            class="w-full"
            clear
            @update:open="onOpen" 
          >
            <template #item-label="{ item }">
            {{ item.label }}
            </template>
          </USelectMenu>
        </UFormField>

        <!-- <UFormField label="Category">
          <USelectMenu v-model="filterCategory" :items="categories?.data?.map(cat => cat.name)" placeholder="Category"
            class="w-full" />
        </UFormField> -->
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold mb-4">
          All Products
        </h3>
        <UButton
          icon="i-lucide-rotate-ccw"
          size="sm"
          variant="ghost"
          color="neutral"
          @click="refreshProductData"
        >
          Refresh Products
        </UButton>
      </div>
      <div>
        <UTable
          sticky
          :loading="pending"
          :data="paginatedProducts"
          :columns="columns"
          class="flex-1 max-h-125"
          loading-animation="carousel"
          loading-color="success"
        >
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
              <p class="text-gray-500">Products is empty</p>
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <div
      v-if="status === 'success'"
      class="flex justify-end border-t border-default pt-4 px-4 mt-4"
    >
      <UPagination
        v-if="totalItems > pagination.pageSize"
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="totalItems"
        show-edges
        :sibling-count="1"
      />
    </div>
  </UContainer>
</template>
