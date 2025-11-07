// middleware/auth.global.ts
import { defineNuxtRouteMiddleware } from '#app';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // For now this is a no-op placeholder.
  // Later you can:
  // - read token from localStorage or cookie
  // - redirect to /login if accessing /queue or /rules without auth
});
