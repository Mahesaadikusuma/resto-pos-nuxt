import type { SidebarSectionType } from "~/types/sidebar.types";

const SIDEBAR_ADMIN: SidebarSectionType[] = [
  {
    title: "Main",
    items: [
      {
        type: "item",
        label: "Dashboard",
        icon: "mdi:home",
        route: "/dashboard",
      },
      {
        type: "item",
        label: "Sales Overview",
        icon: "mdi:chart-line",
        route: "/sales",
      },
      {
        type: "item",
        label: "Orders",
        icon: "mdi:shopping-outline",
        route: "/orders",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        type: "accordion",
        label: "Food Menu",
        icon: "mdi:food-fork-drink",
        children: [
          { label: "All Items", route: "/foods" },
          { label: "Add New Item", route: "/foods/create" },
          { label: "Categories", route: "/categories" },
        ],
      },
      {
        type: "item",
        label: "Restaurants",
        icon: "mdi:storefront",
        route: "/dashboard/admin",
      },
      {
        type: "item",
        label: "Chefs",
        icon: "mdi:chef-hat",
        route: "/chefs",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        type: "item",
        label: "Settings",
        icon: "mdi:settings",
        route: "/settings",
      },
      {
        type: "item",
        label: "Users",
        icon: "mdi:account-group",
        route: "/users",
      },
    ],
  },
];

export { SIDEBAR_ADMIN };
