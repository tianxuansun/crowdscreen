import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  if (process.server) return;
  const {
    public: { authDevBypass }
  } = useRuntimeConfig();
  if (to.path === '/queue') {
    try {
      console.log('[mw] /queue visit; bypass=', authDevBypass, 'token=', typeof window !== 'undefined' ? !!localStorage.getItem('token') : 'n/a')
    } catch {}
  }
  if (authDevBypass) return; // allow tests/dev to access
  const protectedRoutes = ['/queue', '/rules', '/metrics'];
  if (!protectedRoutes.includes(to.path)) return;
  const t = localStorage.getItem('token');
  if (!t) {
    return navigateTo('/login');
  }
  // Optionally, validate the token structure here.
});
