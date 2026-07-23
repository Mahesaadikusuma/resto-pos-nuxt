<script setup lang="ts">
import AuthFooterLink from "../AuthFooterLink.vue";
import AuthFormHeader from "../AuthFormHeader.vue";

const { loginSchema, loginState, loading, handleLogin, serverError, formErrors } = useLogin()
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
    <AuthFormHeader title="Login" subtitle="Sign in to access your dashboard" />

    <!-- Error umum dari server (muncul setelah submit gagal) -->
    <UAlert
      v-if="serverError"
      color="error"
      variant="soft"
      icon="i-lucide-circle-x"
      :description="serverError"
      class="mt-4"
    />

    <!-- Form -->
    <!-- :errors = field-level errors dari server, format: [{ name: 'fieldName', message: '...' }] -->
    <UForm
      :schema="loginSchema"
      :state="loginState"
      @submit="handleLogin"
      class="w-full mt-4 space-y-4">
      <UFormField label="Email" name="email" :error="formErrors.find(e => e.name === 'email')?.message" required>
        <UInput
          v-model="loginState.email"
          size="lg"
          placeholder="Email"
          class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password" :error="formErrors.find(e => e.name === 'password')?.message" required>
        <UInput
          v-model="loginState.password"
          size="lg"
          type="password"
          placeholder="Password"
          class="w-full" />
      </UFormField>
      <div class="flex items-center justify-between">
        <!-- <UCheckbox v-model="loginState.remember" label="Remember" /> -->

        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-red-500 hover:underline">
          Forgot Password?
        </NuxtLink>
      </div>

      <UButton
        :loading="loading"
        :disabled="loading"
        type="submit"
        size="xl"
        class="w-full cursor-pointer justify-center rounded-2xl bg-red-500 hover:bg-red-600 text-white">
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
