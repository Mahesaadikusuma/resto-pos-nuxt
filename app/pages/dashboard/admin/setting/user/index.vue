<script setup lang="ts">
import type { IUser, IUsers } from '~/types/Auth';



definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
  name: "setting-admin-users",
});

useHead({
  title: "Users Management - Dashboard",
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();



const pagination = reactive({
  pageIndex: Number(route.query.page) || 1,
  pageSize: Number(route.query.per_page) || 10,
});

const filters = reactive({
  search: (route.query.search as string) || "",
});

const filterSearchUser = ref(filters.search);

watchDebounced(
  () => filters.search,
  (val) => {
    filterSearchUser.value = val;
  },
  { debounce: 500, maxWait: 1000 },
);

function syncQueryToUrl() {
  const query: Record<string, string> = {
    page: String(pagination.pageIndex),
    per_page: String(pagination.pageSize),
  };

  if (filterSearchUser.value) {
    query.search = filterSearchUser.value;
  }

  router.replace({ query });
}
const { accessToken, signOut } = await useAuthToken()
const {
  data: users,
  pending,
  status,
  error,
  refresh,
} = await useLazyFetch<IUsers>(`${config.public.laravelBaseUrl}/users`, {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  query: computed(() => ({
    page: pagination.pageIndex,
    per_page: pagination.pageSize,
    search: filterSearchUser.value || undefined,
  })),
  watch: false,
  key: "users",
  onResponseError({ response }) {
    // PERBAIKAN 1: pesan sebelumnya salah ("kategori"), harusnya "users" — sisa copy-paste
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

    // PERBAIKAN 2: tangani error lain juga (403, 500, dst), jangan cuma diam
    toast.add({
      title: "Gagal memuat data",
      description: response._data?.message || "Terjadi kesalahan saat memuat data users.",
      color: "error",
      icon: "i-lucide-circle-x",
    });
  },

});


if (error.value) {
  toast.add({
    title: 'Gagal memuat data',
    description: error.value.data?.message || error.value.message || 'Gagal memuat data users, coba lagi.',
    color: 'error',
    icon: 'i-lucide-circle-x',
  })

  await navigateTo('/dashboard/admin/setting/user')
}

const paginatedUsers = computed<IUser[]>(() => {
  return users.value?.data || [];
});
const totalItems = computed(() => users.value?.meta?.total ?? 0);

// Perubahan halaman → fetch + update URL
watch(
  () => pagination.pageIndex,
  () => {
    refresh();
    syncQueryToUrl();
  },
);

// Perubahan filter → reset halaman (yang otomatis trigger watcher di atas),
// atau kalau sudah di halaman 1, refresh + sync manual

watch(
  [
    // filterSearchUser, // ini ref (bisa langsung dipantau)
    () => filterSearchUser.value, // ini ref pakai getter
  ],
  () => {
    if (pagination.pageIndex === 1) {
      refresh();
      syncQueryToUrl();
    } else {
      // Jika tidak di halaman 1, paksa ke halaman 1.
      // Otomatis akan memicu watch(pagination.pageIndex) yang ada di kodemu sebelumnya.
      pagination.pageIndex = 1;
    }
  },
);

const { columns, getDropdownActions } = useUserTable(pagination)

function resetFilters() {
    filters.search = "";
    filterSearchUser.value = "";
    if (pagination.pageIndex !== 1) {
      pagination.pageIndex = 1;
    }
}


const refreshUserData = async () => {
  try {
    await refresh();
    toast.add({
      title: "Data Diperbarui",
      description: "Data user berhasil dimuat ulang.",
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
          Users Management
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
        <!-- <UFormField label="Search Product">
          <UInput
            v-model="filters.search"
            trailing-icon="i-lucide-search"
            placeholder="Search By Product"
            class="w-full"
          />
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
          @click="refreshUserData"
        >
          Refresh Users
        </UButton>
      </div>
      <div>
        <UTable
          sticky
          :loading="pending"
          :data="paginatedUsers"
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
