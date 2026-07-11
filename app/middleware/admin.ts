// middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status, data: session } = useAuth()

  if (status.value !== "authenticated") {
    return navigateTo("/auth/login")
  }

  const roles = session.value?.user?.roles?.map((r: any) => r.name) ?? []

  if (!roles.includes("admin")) {
    return navigateTo("/dashboard") // atau halaman 403
  }
})