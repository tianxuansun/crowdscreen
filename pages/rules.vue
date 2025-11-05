<script setup lang="ts">
const token = process.client ? localStorage.getItem('token') : null
const rules = ref<any[]>([])
const form = reactive({ name:'Block spam words', type:'keyword', enabled:true, score:1, config:{ keywords:['spam','clickbait'] } })
async function load(){ const res = await $fetch('/api/rules'); rules.value = res.rules }
async function save(){
  await $fetch('/api/rules', { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body: form })
  await load()
}
onMounted(load)
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">Rules</h1>
    <pre class="bg-base-200 p-3 rounded">Existing: {{ rules }}</pre>
    <div class="space-y-2">
      <input v-model="form.name" class="input input-bordered w-full" placeholder="Rule name" />
      <select v-model="form.type" class="select select-bordered w-full">
        <option value="keyword">keyword</option><option value="regex">regex</option><option value="threshold">threshold</option>
      </select>
      <textarea v-model="form.config.keywords" class="textarea textarea-bordered w-full" placeholder="For keywords: comma separated"></textarea>
      <input v-model.number="form.score" type="number" class="input input-bordered w-full" placeholder="Score" />
      <label class="flex items-center gap-2"><input type="checkbox" v-model="form.enabled" /> Enabled</label>
      <button class="btn btn-primary" @click="save">Add Rule</button>
    </div>
  </div>
</template>
