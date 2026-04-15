<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import AuthFooterLink from "../AuthFooterLink.vue";
import AuthFormHeader from "../AuthFormHeader.vue";
import * as z from "zod";

const toast = useToast();
const loading = ref(false);
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
  remember: false,
});

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;

    console.log(payload.data);
    console.log("SUBMIT Login");
    toast.add({
      title: "Success",
      description: "Login berhasil",
      color: "success",
    });
  } catch (e) {
    toast.add({
      title: "Error",
      description: "Login gagal",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
    <AuthFormHeader title="Login" subtitle="Sign in to access your dashboard" />

    <!-- Form -->
    <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="w-full mt-4 space-y-4">
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          size="lg"
          placeholder="Email"
          class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="state.password"
          size="lg"
          type="password"
          placeholder="Password"
          class="w-full" />
      </UFormField>
      <div class="flex items-center justify-between">
        <UCheckbox v-model="state.remember" label="Remember" />

        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-red-500 hover:underline">
          Forgot Password?
        </NuxtLink>
      </div>

      <UButton
        type="submit"
        size="xl"
        class="w-full justify-center rounded-2xl bg-red-500 hover:bg-red-600 text-white">
        Sign In to Kitchen
      </UButton>
    </UForm>

    <div class="">
      <auth-footer-link
        text="Don't have an account?"
        link-text="Sign Up"
        to="/auth/register" />
    </div>

    <auth-footer-link
      text="Need help?"
      link-text="Contact support"
      to="/auth/support" />
  </div>
</template>
