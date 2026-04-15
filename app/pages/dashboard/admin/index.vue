<script setup lang="ts">
import { DashboardStartsCard } from "~/components/view/dashboard";

definePageMeta({
  layout: "dashboard",
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
</script>

<template>
  <div class="">
    <!-- Page Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
      <div>
        <h1 class="text-foreground text-2xl md:text-3xl font-bold mb-1">
          Restaurant Management
        </h1>
        <p class="text-gray-500 text-sm md:text-base">
          Manage and monitor your restaurant locations
        </p>
      </div>
      <div class="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
        <button
          class="flex items-center gap-2 px-4 py-2.5 border border-border rounded-button text-foreground font-medium hover:border-primary transition-all duration-200 cursor-pointer">
          <i data-lucide="download" class="w-4 h-4"></i>
          <span>Export</span>
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-button font-medium hover:bg-primary-hover transition-all duration-200 cursor-pointer">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>Add Restaurant</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <DashboardStartsCard
        v-for="card in cards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :trend="card.trend"
        :icon-bg="card.iconBg" />
    </div>

    <!-- Growth Chart -->
    <div class="bg-muted rounded-card pt-5 px-3 pb-3 mb-6">
      <h3 class="text-foreground text-lg font-bold ml-3 mb-4">
        Restaurant Growth Over Time
      </h3>
      <div class="bg-white rounded-card p-4 md:p-5">
        <div class="w-full overflow-x-auto">
          <div class="min-w-70 h-55 sm:h-62 md:h-70">
            <canvas id="growthChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-muted rounded-card pt-5 px-3 pb-3 mb-6">
      <div class="bg-white rounded-card p-4">
        <div class="flex flex-col md:flex-row md:items-center gap-3">
          <!-- Search Input -->
          <div class="relative flex-1">
            <i
              data-lucide="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
            <input
              type="text"
              id="searchInput"
              onkeyup="filterTable()"
              placeholder="Search restaurants..."
              class="w-full pl-10 pr-4 py-2.5 border border-border rounded-button text-sm focus:outline-none focus:border-primary transition-all duration-200" />
          </div>
          <!-- Filter Dropdowns -->
          <div class="flex flex-wrap items-center gap-2">
            <select
              id="statusFilter"
              onchange="filterTable()"
              class="px-4 py-2.5 border border-border rounded-button text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Temporarily Closed">Temporarily Closed</option>
            </select>
            <select
              id="cityFilter"
              onchange="filterTable()"
              class="px-4 py-2.5 border border-border rounded-button text-sm text-foreground focus:outline-none focus:border-primary transition-all duration-200">
              <option value="">All Cities</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Manhattan">Manhattan</option>
              <option value="Santa Monica">Santa Monica</option>
              <option value="Austin">Austin</option>
              <option value="Miami">Miami</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Restaurant Table (Desktop) -->
    <div class="hidden md:block">
      <div class="bg-muted rounded-card pt-5 px-3 pb-3">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 px-3">
          <h3 class="text-foreground text-lg font-bold">
            Restaurant Locations
          </h3>
          <span class="text-gray-500 text-sm"
            >Showing <span id="tableCount">5</span> of 247 restaurants</span
          >
        </div>
        <div class="bg-white rounded-card overflow-hidden">
          <table id="dataTable" class="w-full table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase w-[35%]">
                  Restaurant
                </th>
                <th
                  class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  Location
                </th>
                <th
                  class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Revenue
                </th>
                <th
                  class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th
                  class="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">
                  Manager
                </th>
                <th
                  class="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                class="hover:bg-gray-50"
                data-restaurant="Downtown Bistro"
                data-location="Manhattan, NY"
                data-status="Active"
                data-manager="Sarah Johnson">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop"
                      alt="Downtown Bistro restaurant image"
                      class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground truncate">
                        Downtown Bistro
                      </p>
                      <p class="text-gray-500 text-sm truncate">EST-2019</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="truncate block">Manhattan, NY</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">$125K</td>
                <td class="px-4 py-4">
                  <span
                    class="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >Active</span
                  >
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">Sarah Johnson</td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-button hover:bg-primary-hover transition-all duration-200 cursor-pointer">
                      View
                    </button>
                    <button
                      class="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-button hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50"
                data-restaurant="Ocean View Grill"
                data-location="Santa Monica, CA"
                data-status="Active"
                data-manager="Mike Chen">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop"
                      alt="Ocean View Grill restaurant image"
                      class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground truncate">
                        Ocean View Grill
                      </p>
                      <p class="text-gray-500 text-sm truncate">EST-2020</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="truncate block">Santa Monica, CA</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">$98K</td>
                <td class="px-4 py-4">
                  <span
                    class="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >Active</span
                  >
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">Mike Chen</td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-button hover:bg-primary-hover transition-all duration-200 cursor-pointer">
                      View
                    </button>
                    <button
                      class="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-button hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50"
                data-restaurant="Urban Kitchen"
                data-location="Chicago, IL"
                data-status="Under Construction"
                data-manager="Lisa Rodriguez">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop"
                      alt="Urban Kitchen restaurant image"
                      class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground truncate">
                        Urban Kitchen
                      </p>
                      <p class="text-gray-500 text-sm truncate">EST-2021</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="truncate block">Chicago, IL</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">$87K</td>
                <td class="px-4 py-4">
                  <span
                    class="bg-warning-light text-warning-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >Under Construction</span
                  >
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">Lisa Rodriguez</td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-button hover:bg-primary-hover transition-all duration-200 cursor-pointer">
                      View
                    </button>
                    <button
                      class="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-button hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50"
                data-restaurant="Garden Cafe"
                data-location="Austin, TX"
                data-status="Active"
                data-manager="David Park">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=100&h=100&fit=crop"
                      alt="Garden Cafe restaurant image"
                      class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground truncate">
                        Garden Cafe
                      </p>
                      <p class="text-gray-500 text-sm truncate">EST-2018</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="truncate block">Austin, TX</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">$76K</td>
                <td class="px-4 py-4">
                  <span
                    class="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >Active</span
                  >
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">David Park</td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-button hover:bg-primary-hover transition-all duration-200 cursor-pointer">
                      View
                    </button>
                    <button
                      class="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-button hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                class="hover:bg-gray-50"
                data-restaurant="Metro Diner"
                data-location="Miami, FL"
                data-status="Temporarily Closed"
                data-manager="Maria Garcia">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=100&h=100&fit=crop"
                      alt="Metro Diner restaurant image"
                      class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground truncate">
                        Metro Diner
                      </p>
                      <p class="text-gray-500 text-sm truncate">EST-2017</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 hidden md:table-cell">
                  <span class="truncate block">Miami, FL</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">$45K</td>
                <td class="px-4 py-4">
                  <span
                    class="bg-error-light text-error-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
                    >Temporarily Closed</span
                  >
                </td>
                <td class="px-4 py-4 hidden lg:table-cell">Maria Garcia</td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-button hover:bg-primary-hover transition-all duration-200 cursor-pointer">
                      View
                    </button>
                    <button
                      class="px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-button hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div id="mobileCards" class="md:hidden space-y-3">
      <div
        class="bg-white rounded-2xl p-4 border border-gray-100"
        data-restaurant="Downtown Bistro"
        data-location="Manhattan, NY"
        data-status="Active"
        data-manager="Sarah Johnson">
        <div class="flex items-center gap-3 mb-3 min-w-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop"
            alt="Downtown Bistro restaurant image"
            class="w-12 h-12 rounded-button object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="text-foreground font-semibold truncate">
              Downtown Bistro
            </h4>
            <p class="text-gray-500 text-xs truncate">
              Manhattan, NY • Sarah Johnson
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-foreground font-semibold">$125K</p>
            <span
              class="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >Active</span
            >
          </div>
        </div>
        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-primary bg-red-50 rounded-lg">
              View
            </div>
          </a>
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-foreground bg-gray-50 rounded-lg">
              Edit
            </div>
          </a>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl p-4 border border-gray-100"
        data-restaurant="Ocean View Grill"
        data-location="Santa Monica, CA"
        data-status="Active"
        data-manager="Mike Chen">
        <div class="flex items-center gap-3 mb-3 min-w-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop"
            alt="Ocean View Grill restaurant image"
            class="w-12 h-12 rounded-button object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="text-foreground font-semibold truncate">
              Ocean View Grill
            </h4>
            <p class="text-gray-500 text-xs truncate">
              Santa Monica, CA • Mike Chen
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-foreground font-semibold">$98K</p>
            <span
              class="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >Active</span
            >
          </div>
        </div>
        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-primary bg-red-50 rounded-lg">
              View
            </div>
          </a>
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-foreground bg-gray-50 rounded-lg">
              Edit
            </div>
          </a>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl p-4 border border-gray-100"
        data-restaurant="Urban Kitchen"
        data-location="Chicago, IL"
        data-status="Under Construction"
        data-manager="Lisa Rodriguez">
        <div class="flex items-center gap-3 mb-3 min-w-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop"
            alt="Urban Kitchen restaurant image"
            class="w-12 h-12 rounded-button object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="text-foreground font-semibold truncate">
              Urban Kitchen
            </h4>
            <p class="text-gray-500 text-xs truncate">
              Chicago, IL • Lisa Rodriguez
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-foreground font-semibold">$87K</p>
            <span
              class="bg-warning-light text-warning-dark text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >Under Construction</span
            >
          </div>
        </div>
        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-primary bg-red-50 rounded-lg">
              View
            </div>
          </a>
          <a href="#" class="flex-1 cursor-pointer">
            <div
              class="text-center py-2 text-sm font-medium text-foreground bg-gray-50 rounded-lg">
              Edit
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 px-3 pb-4">
      <div class="text-sm text-gray-600">Showing 1 to 5 of 247 entries</div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="px-3 py-2 border border-border rounded-lg text-sm cursor-pointer transition-all duration-200 hover:border-primary">
          Previous
        </button>
        <button class="px-3 py-2 bg-primary text-white rounded-lg text-sm">
          1
        </button>
        <button
          class="px-3 py-2 border border-border rounded-lg text-sm cursor-pointer transition-all duration-200 hover:border-primary">
          2
        </button>
        <button
          class="px-3 py-2 border border-border rounded-lg text-sm cursor-pointer transition-all duration-200 hover:border-primary">
          3
        </button>
        <button
          class="px-3 py-2 border border-border rounded-lg text-sm cursor-pointer transition-all duration-200 hover:border-primary">
          Next
        </button>
      </div>
    </div>
  </div>
</template>
