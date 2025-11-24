<!-- pages/queue.vue -->
<script setup lang="ts">
const { $api, $socket } = useNuxtApp();
const typedApi = $api as (url: string, options: any) => Promise<any>;
const typedSocket = ($socket as any) as {
  on?: (event: string, callback: () => void) => void;
  off?: (event: string, callback: () => void) => void;
} | undefined;
const items = ref<any[]>([]);
const flags = ref<any[]>([]);

const page = ref(1)
const pageSize = 10
const total = ref(0)

async function load() {
  const data = await typedApi('/api/items', { query: { status: 'pending', page: page.value, pageSize } })
  items.value = data.items
  flags.value = data.flags
  total.value = data.total
}

const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value * pageSize < total.value)
function prev(){ if (canPrev.value) { page.value--; load() } }
function next(){ if (canNext.value) { page.value++; load() } }

// ...
function applyItemUpdate(payload: { itemId: string; status: string }) {
  const idx = items.value.findIndex(i => String(i._id) === String(payload.itemId))
  if (idx >= 0) {
    items.value[idx].status = payload.status
  } else {
    // For safety, refresh if we don't have it locally
    load()
  }
}

onMounted(() => {
  load();
  if (typedSocket?.on) {
    typedSocket.on('queue:update', load); // new content arrives -> refresh page slice
    typedSocket.on('item:update', applyItemUpdate);
  }
})

onBeforeUnmount(() => {
  if (typedSocket?.off) {
    typedSocket.off('queue:update', load);
    typedSocket.off('item:update', applyItemUpdate);
  }
})


onMounted(() => {
  load();
  if (typedSocket?.on) {
    typedSocket.on('queue:update', load);
    typedSocket.on('item:update', load);
  }
})
async function decide(itemId: string, decision: 'approve' | 'reject') {
  await typedApi('/api/decisions', { method: 'POST', body: { itemId, decision, notes: '' } });
  await load();
}
function scoreFor(id: string) {
  return flags.value
    .filter((f: any) => String(f.itemId) === String(id))
    .reduce((s: number, f: any) => s + (f.score || 0), 0);
}

onBeforeUnmount(() => {
  if (typedSocket?.off) {
    typedSocket.off('queue:update', load);
    typedSocket.off('item:update', load);
  }
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold">Moderator Queue</h1>
      <span class="px-2 py-1 rounded-full text-white text-xs" style="background:#10b981">LIVE</span>
    </div>

    <table class="table w-full">
      <thead>
        <tr>
          <th>Text</th>
          <th>Score</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in items" :key="i._id">
          <td class="max-w-xl truncate">{{ i.payload?.text }}</td>
          <td>{{ scoreFor(i._id) }}</td>
          <td class="uppercase">{{ i.status }}</td>
          <td class="flex gap-2">
            <button class="btn btn-xs btn-success" @click="decide(i._id, 'approve')">Approve</button>
            <button class="btn btn-xs btn-error" @click="decide(i._id, 'reject')">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center gap-3">
      <button class="btn btn-sm" :disabled="!canPrev" @click="prev">Prev</button>
      <div>Page {{ page }} / {{ Math.max(1, Math.ceil(total / 10)) }}</div>
      <button class="btn btn-sm" :disabled="!canNext" @click="next">Next</button>
    </div>

  </div>
</template>
