import { Server } from 'socket.io'
export default defineNitroPlugin((nitroApp) => {
  const io = new Server(nitroApp.h3App?.server, {
    cors: { origin: '*' }
  })
  // Expose globally
  // @ts-ignore
  nitroApp['io'] = io
  console.log('[socket] ready')
})
function io() {
  // @ts-ignore
  return useNitroApp()['io'] as import('socket.io').Server
}
