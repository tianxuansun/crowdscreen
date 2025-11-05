<script setup lang="ts">
const props = defineProps<{ items: any[], flags: any[] }>()
function scoreFor(id:string){ return props.flags.filter(f=>String(f.itemId)===String(id)).reduce((s,f)=>s+(f.score||0),0) }
</script>
<template>
  <table class="table w-full">
    <thead><tr><th>Text</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>
      <tr v-for="i in items" :key="i._id">
        <td class="max-w-md truncate">{{ i.payload?.text }}</td>
        <td>{{ scoreFor(i._id) }}</td>
        <td class="uppercase">{{ i.status }}</td>
      </tr>
    </tbody>
  </table>
</template>
