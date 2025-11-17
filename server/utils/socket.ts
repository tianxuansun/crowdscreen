import type { NitroApp } from 'nitropack';
import type { Server as IOServer } from 'socket.io';

declare global {
  var __nitroApp: NitroApp | undefined;
}

function useNitroApp(): NitroApp {
  if (!globalThis.__nitroApp) {
    throw new Error('Nitro app instance is not initialized');
  }
  return globalThis.__nitroApp;
}

export function getIO(): IOServer | undefined {
  const app = useNitroApp();
  return app.io as IOServer | undefined;
}
