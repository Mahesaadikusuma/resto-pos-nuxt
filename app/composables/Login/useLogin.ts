import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const loginSchema = z.strictObject({
  email: z.string().email("Invalid email"),
  password: z.string(),
})

type LoginSchema = z.output<typeof loginSchema>

export const useLogin = () => {
  const toast = useToast()
  const router = useRouter()
  const loading = ref(false)
  const { signIn, getSession } = useAuth() 
  
  const callbacksUrl: string = (router.currentRoute.value.query.callbackUrl as string) || "/"

  // Error umum dari server (misal: "Email atau password salah")
  const serverError = ref<string | null>(null)

  // Field-level errors dari server — format yang dimengerti UForm
  // Contoh: [{ name: 'email', message: 'Email tidak ditemukan' }]
  const formErrors = ref<{ name: string; message: string }[]>([])

  const loginState = reactive<LoginSchema>({
    email: "",
    password: "",
  })

  async function handleLogin(payload: FormSubmitEvent<LoginSchema>) {
    loading.value = true

    // Reset error setiap kali user submit ulang
    serverError.value = null
    formErrors.value = []

    try {
      const result = await signIn("credentials", {
        email: payload.data.email,
        password: payload.data.password,
        redirect: false,
        // callbackUrl: callbacksUrl,
      })

      if (result?.error) {
        serverError.value = 'Email atau password salah. Silakan coba lagi.'
        formErrors.value = [
          { name: 'email', message: 'Email atau password salah. Silakan coba lagi' },
          { name: 'password', message: 'Email atau password salah. Silakan coba lagi' },
        ]

        toast.add({ title: "Login Gagal", description: "Email atau password salah", color: "error" })
        return
      }

      toast.add({ title: "Berhasil", description: "Login berhasil", color: "success" })

      const sessionData = await getSession()
      const roles = (sessionData?.user as any)?.roles?.map((role: any) => role.name) ?? []
      // Prioritaskan callbackUrl jika ada, atau arahkan berdasarkan role jika callbackUrl cuma "/"
      const targetRoute = callbacksUrl !== "/" ? callbacksUrl : resolveRoleRoute(roles)

      router.push(targetRoute)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal, coba lagi"
      serverError.value = message
      toast.add({ title: "Error", description: message, color: "error" })
    } finally {
      loading.value = false
    }
  }

  return {
    loginSchema,
    loginState,
    loading,
    handleLogin,
    serverError,
    formErrors,
  }
}