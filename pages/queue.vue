<script setup lang="ts">
import { io as clientIO } from 'socket.io-client'
const token = process.client ? localStorage.getItem('token') : null
const items = ref<any[]>([])
const flags = ref<any[]>([])

async function load(){
  const data = await $fetch('/api/items', { headers:{ Authorization: `Bearer ${token}` }, query:{ status:'pending' } })
  items.value = data.items
  flags.value = data.flags
}
onMounted(()=>{
  load()
  const socket = clientIO()
  socket.on('queue:update', () => load())
  socket.on('item:update', () => load())
})
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Moderator Queue</h1>
    <QueueTable :items="items" :flags="flags" />
  </div>
</template>
