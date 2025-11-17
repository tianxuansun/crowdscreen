import { Server } from 'socket.io'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const server = nitroApp.h3App?.server
  if (!server) {
    // In CI webServer or other adapter modes, this can be missing; that's OK.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[socket] No HTTP server, skipping Socket.IO setup')
    }
    return
  }

  const io = new Server(server, { cors: { origin: '*' } })
  // Attach to both nitroApp and global for universal access
  ;(nitroApp as any).io = io
  ;(globalThis as any).__io = io
  console.log('[socket] initialized')
})
