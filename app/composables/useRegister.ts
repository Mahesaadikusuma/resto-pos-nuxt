import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";


// ✅ schema (pengganti yup)
  const Registerschema = z
    .object({
      name: z.string().min(2, "Must be at least 2 characters"),
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type Schema = z.output<typeof Registerschema>;

export function useRegister() {
  const toast = useToast();
  const router = useRouter();

  const loading = ref(false);

  const Registerstate = reactive<Schema>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ submit handler
  async function handleRegister(payload: FormSubmitEvent<Schema>) {
    try {
      loading.value = true;

      console.log("REGISTER DATA:", payload.data);

      // 🚧 nanti connect ke API
      // await $fetch('/api/register', { method: 'POST', body: payload.data })

      toast.add({
        title: "Success",
        description: "Registration successful",
        color: "success",
      });

      // redirect seperti react
      //   router.push("/auth/register/success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal, coba lagi"
      toast.add({
        title: "Error",
        description: message,
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  }

  return {
    Registerschema,
    Registerstate,
    loading,
    handleRegister,
  };
}
