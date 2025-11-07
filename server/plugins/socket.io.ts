// server/plugins/socket.io.ts
import { Server } from 'socket.io';
import { defineNitroPlugin } from '#imports';

export default defineNitroPlugin((nitroApp) => {
  const server = nitroApp.h3App?.server;
  if (!server) {
    console.warn('[socket] No HTTP server, skipping Socket.IO setup');
    return;
  }

  const io = new Server(server, {
    cors: { origin: '*' },
  });

  // Attach to nitroApp so we can grab it in API handlers
  nitroApp.io = io;

  console.log('[socket] initialized');
});
