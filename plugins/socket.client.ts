import { io, type Socket } from 'socket.io-client'

// Client-only plugin (filename .client.ts) providing a Socket.IO instance.
// Previous version relied on process.env; now uses runtimeConfig for better compatibility.
export default defineNuxtPlugin(() => {
  const {
    public: { ci, socketUrl }
  } = useRuntimeConfig() as { public: { ci?: boolean; socketUrl?: string } }

  // Skip socket initialization when running under CI to reduce flakiness.
  if (ci) {
    return { provide: { socket: undefined as Socket | undefined } }
  }

  let socket: Socket | undefined
  try {
    const url: string | undefined = (typeof socketUrl === 'string' && socketUrl.trim().length) ? socketUrl : undefined
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: true, // connect immediately; queue listeners rely on this
      reconnectionAttempts: 5,
      timeout: 8000
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[socket.client] initialization failed', err)
    socket = undefined
  }

  return { provide: { socket } }
})
