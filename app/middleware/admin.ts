// middleware/admin.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status, data: session } = useAuth()

  if (status.value !== "authenticated") {
    return navigateTo("/auth/login")
  }

  const user = session.value?.user as any;
  const roles = user?.roles?.map((r: any) => r.name) ?? [];

  if (!roles.includes("admin")) {
    return navigateTo("/dashboard");
  }
})