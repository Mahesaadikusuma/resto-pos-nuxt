import type { User } from "next-auth";

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status, data } = useAuth()
  // 1. Tendang ke login jika belum autentikasi
  if (status.value !== "authenticated") {
    return navigateTo("/auth/login")
  }


  const user = data.value?.user as User;
  const roles = user?.roles?.map((r: any) => r.name) ?? [];

  // 2. Tentukan halaman utama yang SEHARUSNYA untuk user ini (berdasarkan prioritas)
  const defaultRouteForUser = resolveRoleRoute(roles);

  // 3. Pengecekan Keamanan Dinamis:
  // Jika user mencoba mengakses area dalam /dashboard/
  if (to.path.startsWith('/dashboard')) {
    // Cek apakah dari semua role yang dimiliki user, ada yang cocok dengan awalan URL saat ini
    const isAuthorized = roles.some((role: string) => {
      const allowedPath = ROLE_ROUTES[role];
      return allowedPath && to.path.startsWith(allowedPath);
    });

    // Jika user mengintip dashboard milik role lain (misal customer akses /dashboard/admin), 
    // tendang mereka ke dashboard mereka sendiri!
    if (!isAuthorized) {
      return navigateTo(defaultRouteForUser);
    }
  }
})