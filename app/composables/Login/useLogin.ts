import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
})

type LoginSchema = z.output<typeof loginSchema>

export const useLogin = () => {
  const toast = useToast()
  const router = useRouter()
  const loading = ref(false)

  const { signIn } = useAuth()

  const loginState = reactive<LoginSchema>({
    email: "",
    password: "",
  })


  async function handleLogin(payload: FormSubmitEvent<LoginSchema>) {
  loading.value = true

  try {
    const result = await signIn("credentials", {
      email: payload.data.email,
      password: payload.data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.add({ title: "Error", description: "Email atau password salah", color: "error" })
      return
    }

    toast.add({ title: "Success", description: "Login berhasil", color: "success" })

    const { data: session } = useAuth()
    const roles = session.value?.user?.roles?.map((r: any) => r.name) ?? []

    router.push(resolveRoleRoute(roles))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login gagal, coba lagi"
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
  }
}