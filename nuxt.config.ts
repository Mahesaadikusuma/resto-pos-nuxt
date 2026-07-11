import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    NUXT_AUTH_SECRET: process.env.NUXT_AUTH_SECRET,
    LARAVEL_BASE_URL: process.env.LARAVEL_BASE_URL,
  },

  imports: {
    dirs: ["types", "services",'~/composables/**',],
    autoImport: true,
  },

  modules: [
    "@nuxt/ui",
    "@nuxt/scripts",
    "@nuxt/image",
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@sidebase/nuxt-auth",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: { plugins: [tailwindcss()] },
});