// server/plugins/socket.io.ts
import { Server } from 'socket.io'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const server = nitroApp.h3App?.server
  if (!server) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[socket] No HTTP server, skipping Socket.IO setup')
    }
    return
  }
  const io = new Server(server, { cors: { origin: '*' } })
  ;(nitroApp as any).io = io
  console.log('[socket] initialized')
})
