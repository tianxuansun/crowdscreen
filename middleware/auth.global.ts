export default defineNuxtRouteMiddleware((to, from) => {
  // In the SPA, keep token in localStorage; this middleware can guard routes if needed.
  // For simplicity today, leave it informational. You can add redirects later.
})
