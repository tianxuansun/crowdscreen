import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const {
    public: { ci, socketUrl }
  } = useRuntimeConfig()

  // In CI we avoid sockets to eliminate hydration flakiness
  if (ci) return { provide: { socket: undefined as any } }

  // Same-origin by default; allow overriding with runtime public.socketUrl
  const socket = io(socketUrl || undefined, {
    transports: ['websocket'],
    autoConnect: true
  })

  return { provide: { socket } }
})
