<script setup lang="ts">
import { DashboardStatsCard } from '~/components/view/dashboard';


definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

useHead({
  title: "Admin Dashboard",
  meta: [
    {
      name: "description",
      content: "Admin dashboard for managing the FoodHub application.",
    },
  ],
});

interface Card {
  title: string;
  icon: string;
  value: string | number;
  trend?: string;
  iconBg?: string;
}

const cards: Card[] = [
  {
    title: "Total Restaurants",
    icon: "mdi:storefront",
    value: 247,
    trend: "+8% this month",
    iconBg: "bg-[#C5E151]",
  },
  {
    title: "Active Restaurants",
    icon: "mdi-check-circle-outline",
    value: 8,
    trend: "+5% this month",
    iconBg: "bg-[#82D9D7]",
  },
  {
    title: "Under Construction",
    icon: "mdi:hammer-wrench",
    value: 3,
    trend: "+2% this month",
    iconBg: "bg-[#FAAC7B]",
  },
  {
    title: "Closed Restaurants",
    icon: "mdi:close-circle-outline",
    value: 4,
    trend: "-2 opening soon",
    iconBg: "bg-[#FEE2E2]",
  },
];


defineOptions({
  tags: ['linecharts', 'singleline']
})

withDefaults(
  defineProps<{
    showTitle?: boolean
  }>(),
  {
    showTitle: false
  }
)

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 260 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 250 }
]

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: 'Desktop', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return chartData[tick]?.month ?? ''
}


const dataTableOrder = ref([
  { id: '4600', date: '2024-03-11T15:30:00', status: 'paid', email: 'james.anderson@example.com', amount: 594 },
  { id: '4599', date: '2024-03-11T10:10:00', status: 'failed', email: 'mia.white@example.com', amount: 276 },
  { id: '4598', date: '2024-03-11T08:50:00', status: 'refunded', email: 'william.brown@example.com', amount: 315 },
  { id: '4597', date: '2024-03-10T19:45:00', status: 'paid', email: 'emma.davis@example.com', amount: 529 },
  { id: '4596', date: '2024-03-10T15:55:00', status: 'paid', email: 'ethan.harris@example.com', amount: 639 },
  { id: '4595', date: '2024-03-10T14:20:00', status: 'paid', email: 'sophia.martinez@example.com', amount: 150 },
  { id: '4594', date: '2024-03-10T11:10:00', status: 'failed', email: 'oliver.clark@example.com', amount: 890 },
  { id: '4593', date: '2024-03-09T09:45:00', status: 'paid', email: 'lucas.lewis@example.com', amount: 210 },
  { id: '4592', date: '2024-03-09T08:30:00', status: 'refunded', email: 'amelia.walker@example.com', amount: 430 },
  { id: '4591', date: '2024-03-08T16:00:00', status: 'paid', email: 'henry.hall@example.com', amount: 720 }
])

// PERBAIKAN 1: pageIndex harus dimulai dari 1
const pagination = ref({
  pageIndex: 1, 
  pageSize: 10
})

// PERBAIKAN 2: Gunakan dataTableOrder.value, bukan cards
// (Saya ubah nama fungsinya menjadi paginatedOrders agar lebih sesuai konteks)
// const paginatedOrders = computed(() => {
//   const startIndex = (pagination.value.pageIndex - 1) * pagination.value.pageSize
//   const endIndex = startIndex + pagination.value.pageSize
//   return dataTableOrder.value.slice(startIndex, endIndex)
// })


// State filter
const filterOrderId = ref('')
const filterCustomer = ref('')
const filterStatus = ref<string | undefined>(undefined)
const filterSortBy = ref<string | undefined>(undefined)

// PERBAIKAN: filter diterapkan dulu, baru pagination di atas hasil filter
const filteredOrders = computed(() => {
  let result = [...dataTableOrder.value]

  // filter by Order ID
  if (filterOrderId.value.trim()) {
    const q = filterOrderId.value.trim().toLowerCase()
    result = result.filter((order) => order.id.toLowerCase().includes(q))
  }

  // filter by customer (email)
  if (filterCustomer.value.trim()) {
    const q = filterCustomer.value.trim().toLowerCase()
    result = result.filter((order) => order.email.toLowerCase().includes(q))
  }

  // filter by status
  if (filterStatus.value) {
    result = result.filter(
      (order) => order.status.toLowerCase() === filterStatus.value?.toLowerCase()
    )
  }

  // sort
  if (filterSortBy.value === 'Date') {
    result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else if (filterSortBy.value === 'Price') {
    result = result.sort((a, b) => b.amount - a.amount)
  } else if (filterSortBy.value === 'Status') {
    result = result.sort((a, b) => a.status.localeCompare(b.status))
  }

  return result
})

// PERBAIKAN: paginatedOrders sekarang ambil dari HASIL FILTER, bukan data mentah
const paginatedOrders = computed(() => {
  const startIndex = (pagination.value.pageIndex - 1) * pagination.value.pageSize
  const endIndex = startIndex + pagination.value.pageSize
  return filteredOrders.value.slice(startIndex, endIndex)
})

// PERBAIKAN: reset ke halaman 1 setiap kali filter berubah
// (kalau tidak, bisa nyangkut di halaman kosong)
watch([filterOrderId, filterCustomer, filterStatus, filterSortBy], () => {
  pagination.value.pageIndex = 1
})

// tombol reset filter
function resetFilters() {
  filterOrderId.value = ''
  filterCustomer.value = ''
  filterStatus.value = undefined
  filterSortBy.value = undefined
}

// const {
//   status,
//   data,
//   getCsrfToken,

// } = useAuth()

// const token = await getCsrfToken()
// console.log(token)
// console.log('Status:', status.value)   // 'loading' | 'authenticated' | 'unauthenticated'
// console.log('User:', data.value?.user?.name)

// const accessToken = data.value?.user?.accessToken

// console.log('Sanctum token:', accessToken)
</script>

<template>
  <UContainer>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
          Restaurant Management
        </h1>
        <p class="text-gray-500 text-sm md:text-base">
          Manage and monitor your restaurant locations
        </p>
      </div>

      <div class="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
        <UButton icon="i-lucide-download" color="neutral" variant="soft">
          Export Report
        </UButton>
        <UButton icon="i-lucide-chart-line" color="primary" variant="soft">
          View Analytics
        </UButton>
      </div>
    </div>

    <UPageGrid class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <DashboardStatsCard v-for="card in cards" :key="card.title" :title="card.title" :value="card.value"
        :icon="card.icon" :trend="card.trend" :icon-bg="card.iconBg" />
    </UPageGrid>

    <div class="mx-auto md:max-w-6xl dark:bg-gray-800/50 space-y-6 rounded-md mb-5" :class="showTitle ? 'p-6' : ''">
      <div class="flex items-center justify-between px-5 py-5">
        <h3 class="text-foreground text-lg font-semibold">
          Restaurants Growth (2025)
        </h3>
        <UButton to="/blocks/line-charts" icon="i-lucide-copy" size="sm" variant="soft" color="neutral"
          aria-label="Copy chart link" />
      </div>

      <LineChart :data="chartData" :height="300" x-label="Time" y-label="Temperature" :categories="categories"
        :y-num-ticks="4" :x-num-ticks="7" :x-formatter="xFormatter" :curve-type="CurveType.Basis"
        :legend-position="LegendPosition.TopRight" :hide-legend="false" :y-grid-line="true" />
    </div>


    <div class="bg-muted dark:bg-gray-800/50 rounded-md pt-5 px-3 pb-3 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-foreground dark:text-gray-100 text-lg font-bold">
          Filter Orders
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
      <div class="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <UFormField label="Search Order Id">
          <UInput trailing-icon="i-lucide-search" placeholder="Search By Order ID" class="w-full" />
        </UFormField>
        <UFormField label="Search Customer">
          <UInput trailing-icon="i-lucide-search" placeholder="Search By Customer Name / Email" class="w-full" />
        </UFormField>

        <UFormField label="Status">
          <USelectMenu :items="['Pending', 'Shipped', 'Delivered', 'Cancelled']" placeholder="Select status"
            class="w-full" />
        </UFormField>
        <UFormField label="Food Category">
          <USelectMenu :items="['Appetizer', 'Main Course', 'Dessert', 'Beverage']" placeholder="Select status"
            class="w-full" />
        </UFormField>
        <UFormField label="Sort By">
          <USelectMenu :items="['Date', 'Price', 'Status']" placeholder="Sort By" class="w-full" />
        </UFormField>
      </div>
    </div>


    <div class="bg-muted dark:bg-gray-800/50 rounded-md p-5 mb-6">
      <h3 class="text-foreground dark:text-gray-100 text-lg font-bold mb-4">
        All Orders
      </h3>
      <div class="">
        <UTable sticky :data="paginatedOrders" class="flex-1 max-h-[500px]" />
      </div>
      

      <div class="flex justify-end border-t border-default pt-4 px-4 mt-4">
        <UPagination 
          v-model:page="pagination.pageIndex"
          :items-per-page="pagination.pageSize" 
          :total="dataTableOrder.length" 
          show-edges 
          :sibling-count="1" 
        />
      </div>
    </div>
  </UContainer>
</template>
