// utils/roleRoutes.ts (atau ~/config/roleRoutes.ts)
export const ROLE_ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  customer: "/dashboard/customer",
  kitchen: "/dashboard/kitchen",
  cashier: "/dashboard/cashier",
  // tambah role baru di sini, tanpa ubah logic lain
}

export const DEFAULT_ROUTE = "/dashboard"

/**
 * Ambil route tujuan berdasarkan prioritas role tertinggi.
 * roles: array nama role dari session, misal ["customer"]
 * priority: urutan prioritas kalau user punya lebih dari 1 role
 */
export function resolveRoleRoute(
  roles: string[],
  priority: string[] = Object.keys(ROLE_ROUTES)
): string {
  const matchedRole = priority.find((role) => roles.includes(role))
  return matchedRole ? ROLE_ROUTES[matchedRole] : DEFAULT_ROUTE
}