<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import AuthFooterLink from "../AuthFooterLink.vue";
import AuthFormHeader from "../AuthFormHeader.vue";
import * as z from "zod";
import { usePassword } from "~/composables/usePassword";
import { useRegister } from "~/composables/useRegister";

const { Registerschema, Registerstate, loading, handleRegister } =
  useRegister();

const { visiblePassword, toggleVisiblePassword, strength, score, color, text } =
  usePassword();

const passwordStrength = strength(toRef(Registerstate, "password"));
const passwordScore = score(toRef(Registerstate, "password"));
const passwordColor = color(passwordScore);
const passwordText = text(passwordScore);
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
    <AuthFormHeader
      title="Register"
      subtitle="Sign up to access your dashboard" />

    <UForm
      :schema="Registerschema"
      :state="Registerstate"
      @submit="handleRegister"
      class="w-full mt-4 space-y-4 mb-5">
      <!-- Name -->
      <UFormField label="Name" name="name" required>
        <UInput
          v-model="Registerstate.name"
          size="lg"
          placeholder="Name"
          class="w-full" />
      </UFormField>

      <!-- Email -->
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="Registerstate.email"
          size="lg"
          type="email"
          placeholder="Email"
          class="w-full" />
      </UFormField>

      <!-- Password -->
      <UFormField label="Password" name="password" required>
        <UInput
          v-model="Registerstate.password"
          :type="visiblePassword.password ? 'text' : 'password'"
          :color="passwordColor"
          :aria-invalid="passwordScore < 4"
          class="w-full">
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="link"
              size="sm"
              :icon="
                visiblePassword.password ? 'i-lucide-eye-off' : 'i-lucide-eye'
              "
              @click="toggleVisiblePassword('password')" />
          </template>
        </UInput>
      </UFormField>

      <!-- Confirm Password -->
      <UFormField label="Confirm Password" name="confirmPassword" required>
        <UInput
          v-model="Registerstate.confirmPassword"
          :type="visiblePassword.confirmPassword ? 'text' : 'password'"
          class="w-full">
          <template #trailing>
            <UButton
              type="button"
              color="neutral"
              variant="link"
              size="sm"
              :icon="
                visiblePassword.confirmPassword
                  ? 'i-lucide-eye-off'
                  : 'i-lucide-eye'
              "
              @click="toggleVisiblePassword('confirmPassword')" />
          </template>
        </UInput>
      </UFormField>

      <!-- Submit -->
      <UButton
        :loading="loading"
        type="submit"
        size="xl"
        class="w-full justify-center rounded-2xl bg-red-500 hover:bg-red-600 text-white">
        Sign Up to Kitchen
      </UButton>
    </UForm>

    <!-- Strength -->
    <UProgress
      v-if="Registerstate.password"
      :color="passwordColor"
      :indicator="passwordText"
      :model-value="passwordScore"
      :max="4"
      size="sm"
      class="mb-2" />

    <p class="text-sm font-medium">{{ passwordText }}. Must contain:</p>

    <ul class="space-y-1">
      <li
        v-for="(req, index) in passwordStrength"
        :key="index"
        class="flex items-center gap-1"
        :class="req.met ? 'text-success' : 'text-muted'">
        <UIcon
          :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
          class="size-4" />
        <span class="text-xs">{{ req.text }}</span>
      </li>
    </ul>

    <!-- Footer -->
    <div class="mt-4">
      <AuthFooterLink
        text="Already have an account?"
        link-text="Sign In"
        to="/auth/login" />
    </div>

    <AuthFooterLink
      text="Need help?"
      link-text="Contact support"
      to="/auth/support" />
  </div>
</template>
