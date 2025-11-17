import { defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;
  const protectedRoutes = ['/queue', '/rules', '/metrics'];
  if (!protectedRoutes.includes(to.path)) return;
  const t = localStorage.getItem('token');
  if (!t) {
    console.warn('[auth.global] No token found in localStorage'); // Debugging
    const router = useRouter();
    return router.push('/login');
  }
  console.log('[auth.global] Token found:', t); // Debugging
  // Optionally, validate the token structure here
});
