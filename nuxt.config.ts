import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  nitro: { compatibilityDate: '2025-11-06' },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    mongodbUri: process.env.MONGODB_URI,
    authDevBypass: process.env.AUTH_DEV_BYPASS === 'true',
    public: {
      socketUrl: '' // same origin by default
    }
  }
});
