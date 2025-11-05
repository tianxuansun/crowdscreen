<script setup lang="ts">
const email = ref('demo@user.com')
const password = ref('password123')
const token = useState<string | null>('token', () => null)
async function doLogin(){
  const res = await $fetch('/api/auth/login', { method:'POST', body:{ email: email.value, password: password.value }})
  token.value = res.token
  localStorage.setItem('token', res.token)
  navigateTo('/submit')
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-bold">Sign in</h1>
    <input v-model="email" class="input input-bordered w-full" placeholder="Email" />
    <input v-model="password" type="password" class="input input-bordered w-full" placeholder="Password" />
    <button class="btn btn-primary w-full" @click="doLogin">Login</button>
  </div>
</template>
