import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    // NUXT_AUTH_SECRET: process.env.NUXT_AUTH_SECRET as string,
    // LARAVEL_BASE_URL: process.env.LARAVEL_BASE_URL,
    authSecret: '',
    // laravelBaseUrl: '',
    public: {
      laravelBaseUrl: 'http://localhost:8000/api'
    }

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
    "nuxt-charts",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  pinia: {
    /**
     * Automatically add stores dirs to the auto imports. This is the same as
     * directly adding the dirs to the `imports.dirs` option. If you want to
     * also import nested stores, you can use the glob pattern `./stores/**`
     * (on Nuxt 3) or `app/stores/**` (on Nuxt 4+)
     *
     * @default ['stores']
     */

    storesDirs: ['app/stores/**'],
  },
  auth: {
    globalAppMiddleware: true
  },
  css: ["~/assets/css/tailwind.css"],
  vite: { plugins: [tailwindcss()] },
});