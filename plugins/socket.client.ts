import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const socket = io() // same-origin
  return { provide: { socket } }
})