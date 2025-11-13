<!-- pages/metrics.vue -->
<script setup lang="ts">
const { $api } = useNuxtApp();
const typedApi = $api as (url: string, options?: any) => Promise<any>;
const data = ref<{ pending: number; approved: number; rejected: number; decisions: number } | null>(null);
async function load() {
  data.value = await typedApi('/api/metrics');
}
onMounted(load);
</script>

<template>
  <div class="max-w-xl grid grid-cols-2 gap-4">
    <div class="border rounded p-4">
      <div class="text-4xl font-bold">{{ data?.pending ?? '-' }}</div>
      <div class="opacity-70">Pending</div>
    </div>
    <div class="border rounded p-4">
      <div class="text-4xl font-bold">{{ data?.approved ?? '-' }}</div>
      <div class="opacity-70">Approved</div>
    </div>
    <div class="border rounded p-4">
      <div class="text-4xl font-bold">{{ data?.rejected ?? '-' }}</div>
      <div class="opacity-70">Rejected</div>
    </div>
    <div class="border rounded p-4">
      <div class="text-4xl font-bold">{{ data?.decisions ?? '-' }}</div>
      <div class="opacity-70">Decisions</div>
    </div>
  </div>
</template>
