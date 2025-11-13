// middleware/auth.global.ts
import { defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;
  const protectedRoutes = ['/queue', '/rules', '/metrics'];
  if (!protectedRoutes.includes(to.path)) return;

  const t = localStorage.getItem('token');
  if (!t) {
    const router = useRouter();
    return router.push('/login');
  }
});
