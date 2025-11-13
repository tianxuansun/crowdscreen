// composables/useAuth.ts
import type { Role } from '@/server/utils/roles'
import { useState } from 'nuxt/app';
import { watch } from 'vue';

type Me = { id: string; email: string; role: Role };
const STORAGE_KEY = 'token';

export function useAuth() {
  const token = useState<string | null>('token', () =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  );
  const me = useState<Me | null>('me', () => null);

  function setToken(t: string | null) {
    token.value = t;
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem(STORAGE_KEY, t);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }

  function parseJwt<T = any>(t: string): T | null {
    try {
      const payload = t.split('.')[1];
      return payload ? JSON.parse(atob(payload)) as T : null;
    } catch {
      return null;
    }
  }

  function hydrateFromToken() {
    if (!token.value) {
      me.value = null;
      return;
    }
    const payload = parseJwt<{ sub: string; email: string; role: Role }>(token.value);
    if (payload) me.value = { id: payload.sub, email: payload.email, role: payload.role };
  }

  if (typeof window !== 'undefined') {
    watch(token, hydrateFromToken, { immediate: true });
  }

  return { token, me, setToken, hydrateFromToken };
}
