// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@pinia/nuxt'
  ],
  pages: true,

  css: ['~/assets/css/main.css'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/*']
    },
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})