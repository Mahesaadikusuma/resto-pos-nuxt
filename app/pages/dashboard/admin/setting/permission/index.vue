<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
  name: "setting-admin-permission",
});

useHead({
  title: "Permission Management",
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { accessToken, signOut } = await useAuthToken();

const pagination = reactive({
  pageIndex: Number(route.query.page) || 1,
  pageSize: Number(route.query.per_page) || 10,
});

const filters = reactive({
  search: (route.query.search as string) || "",
});
const filterSearchPermission = ref(filters.search);

watchDebounced(
  () => filters.search,
  (val) => {
    filterSearchPermission.value = val;
  },
  { debounce: 500, maxWait: 1000 },
);

function syncQueryToUrl() {
  const query: Record<string, string> = {
    page: String(pagination.pageIndex),
    per_page: String(pagination.pageSize),
  };
  if (filterSearchPermission.value) query.search = filterSearchPermission.value;
  router.replace({ query });
}

const {
  data: permissions,
  pending,
  status,
  error,
  refresh,
} = await useLazyFetch<IPermissionResponse>(
  `${config.public.laravelBaseUrl}/permission`,
  {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    query: computed(() => ({
      page: pagination.pageIndex,
      per_page: pagination.pageSize,
      search: filterSearchPermission.value || undefined,
    })),
    watch: false,
    key: "permissions",
    onResponseError({ response }) {
      if (response.status === 401) {
        toast.add({
          title: "Unauthorized",
          description: "Sesi Anda telah berakhir, silakan login kembali.",
          color: "error",
          icon: "i-lucide-circle-x",
        });

        signOut({ callbackUrl: "/auth/login" });
        return;
      }
    },
  },
);

if (error.value) {
  toast.add({
    title: "Gagal memuat data",
    description:
      error.value.data?.message ||
      error.value.message ||
      "Gagal memuat data produk, coba lagi.",
    color: "error",
    icon: "i-lucide-circle-x",
  });

  await navigateTo("/dashboard/admin/management/product");
}

const paginatedPermissions = computed<IPermission[]>(() => {
  return permissions.value?.data || [];
});
const totalItems = computed(() => permissions.value?.meta?.total || 0);

watch(
  () => pagination.pageIndex,
  () => {
    refresh();
    syncQueryToUrl();
  },
);

watch([() => filterSearchPermission.value], () => {
  if (pagination.pageIndex === 1) {
    refresh();
    syncQueryToUrl();
  } else {
    pagination.pageIndex = 1;
  }
});

const { columns, getDropdownActions } = await usePermissionTable(pagination);

function resetFilters() {
  filters.search = "";
}

const refreshPermissionData = async () => {
  try {
    await refresh();
    toast.add({
      title: "Data Diperbarui",
      description: "Data permission berhasil dimuat ulang.",
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
          Permission Management
        </h1>
      </div>
      <div class="flex items-center">
        <UButton
          icon="i-lucide-plus"
          size="sm"
          variant="solid"
          color="success"
          :to="{name: 'setting-admin-permission-create'}"
        >
          Buat Permission
        </UButton>
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md pt-5 px-3 pb-3 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold">
          Filter Permission
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
        <UFormField label="Search Permission">
          <UInput
            v-model="filters.search"
            trailing-icon="i-lucide-search"
            placeholder="Search By name"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold mb-4">
          All Users
        </h3>
        <UButton
          icon="i-lucide-rotate-ccw"
          size="sm"
          variant="ghost"
          color="neutral"
          @click="refreshPermissionData"
        >
          Refresh Permission
        </UButton>
      </div>
      <div>
        <UTable
          sticky
          :loading="pending"
          :data="paginatedPermissions"
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
              <p class="text-gray-500">User is empty</p>
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
