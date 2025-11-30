<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
const { me, setToken, hydrateFromToken } = useAuth()
function logout() {
  setToken(null)
  hydrateFromToken()
  navigateTo('/login')
}
</script>

<template>
  <div class="w-full px-4 py-2 border-b flex items-center justify-between gap-3">
    <div class="font-semibold">CrowdScreen</div>
    <div class="flex items-center gap-3 text-sm">
      <span v-if="me">{{ me.email }} ({{ me.role }})</span>
      <NuxtLink class="btn btn-xs" to="/">Home</NuxtLink>
      <NuxtLink class="btn btn-xs" to="/submit">Submit</NuxtLink>
      <NuxtLink v-if="me && (me.role==='moderator'||me.role==='admin')" class="btn btn-xs" to="/queue">Queue</NuxtLink>
      <NuxtLink v-if="me && (me.role==='moderator'||me.role==='admin')" class="btn btn-xs" to="/rules">Rules</NuxtLink>
      <NuxtLink v-if="me && me.role==='admin'" class="btn btn-xs" to="/metrics">Metrics</NuxtLink>
      <button v-if="me" class="btn btn-xs btn-outline" @click="logout">Logout</button>
      <NuxtLink v-else class="btn btn-xs btn-primary" to="/login">Login</NuxtLink>
    </div>
  </div>
</template>
