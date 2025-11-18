import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  // In CI or if anything goes wrong, skip socket to avoid blocking hydration
  // process.env.CI is compile-time replaced in Nuxt builds
  if (process.env.CI === 'true') {
    return { provide: { socket: undefined as any } }
  }
  try {
    const {
      public: { socketUrl }
    } = useRuntimeConfig()
    const url = typeof socketUrl === 'string' && socketUrl.length ? socketUrl : undefined
    const socket = io(url, { autoConnect: false })
    return { provide: { socket } }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[socket.client] init failed', e)
    return { provide: { socket: undefined as any } }
  }
})