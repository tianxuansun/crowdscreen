declare module '#app' {
  import type { RouteLocationNormalized } from 'vue-router';
  export function defineNuxtRouteMiddleware(
    middleware: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void
  ): void;
  export function navigateTo(path: string): Promise<void> | void;
}