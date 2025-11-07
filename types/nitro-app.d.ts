// Extend the NitroApp interface to include the `io` property
import type { Server } from 'socket.io';

declare module 'nitropack' {
  interface NitroApp {
    io?: Server;
  }
}