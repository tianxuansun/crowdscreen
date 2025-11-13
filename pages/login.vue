<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
const mode = ref<'login'|'register'>('login')
const email = ref('mod@demo.dev')
const name = ref('Moderator')
const password = ref('password123')
const { setToken, hydrateFromToken } = useAuth()
const { $api } = useNuxtApp();

async function submit() {
  if (mode.value === 'login') {
    const res = await ($api as (url: string, options: any) => Promise<any>)(
      '/api/auth/login',
      { method: 'POST', body: { email: email.value, password: password.value } }
    );
    setToken(res.token); hydrateFromToken(); navigateTo('/submit');
  } else {
    const res = await ($api as (url: string, options: any) => Promise<any>)(
      '/api/auth/register',
      { method: 'POST', body: { email: email.value, name: name.value, password: password.value } }
    );
    setToken(res.token); hydrateFromToken(); navigateTo('/submit');
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <h1 class="text-2xl font-bold">{{ mode === 'login' ? 'Sign in' : 'Create account' }}</h1>
    <input v-model="email" class="input input-bordered w-full" placeholder="Email" />
    <input v-if="mode==='register'" v-model="name" class="input input-bordered w-full" placeholder="Name" />
    <input v-model="password" type="password" class="input input-bordered w-full" placeholder="Password" />
    <button class="btn btn-primary w-full" @click="submit">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </button>
    <button class="btn btn-ghost w-full" @click="mode = mode==='login' ? 'register' : 'login'">
      Switch to {{ mode === 'login' ? 'Register' : 'Login' }}
    </button>
  </div>
</template>
