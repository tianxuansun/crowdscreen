import { useAuth } from '@/composables/useAuth';

// plugins/api.client.ts
export default defineNuxtPlugin(() => {
  const { token } = useAuth()
  const api = $fetch.create({
    onRequest({ options }) {
      const t = token.value || (process.client ? localStorage.getItem('token') : null)
      if (t) {
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${t}`);
        } else {
          options.headers = Object.assign({}, options.headers, { Authorization: `Bearer ${t}` });
        }
      }
    }
  })
  return { provide: { api } }
})

// usage in components:
// const { $api } = useNuxtApp()
// await $api('/api/items', { method: 'POST', body: {...} })
