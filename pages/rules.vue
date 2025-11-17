<!-- pages/rules.vue -->
<script setup lang="ts">
const { $api } = useNuxtApp();
const typedApi = $api as (url: string, options?: any) => Promise<any>;
const rules = ref<any[]>([]);
const form = reactive({ name: '', type: 'keyword', enabled: true, score: 1, config: {} as any });

function reset() {
  form.name = '';
  form.type = 'keyword';
  form.enabled = true;
  form.score = 1;
  form.config = {};
}
async function load() {
  const res = await typedApi('/api/rules');
  rules.value = res.rules;
}
async function save() {
  if (form.type === 'keyword' && typeof form.config.keywords === 'string') {
    form.config.keywords = form.config.keywords
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  await typedApi('/api/rules', { method: 'POST', body: form });
  await load();
  reset();
}
async function toggle(id:string){
  await typedApi(`/api/rules/${id}/toggle`, { method:'POST' })
  await load()
}
async function removeRule(id:string){
  await typedApi(`/api/rules/${id}`, { method:'DELETE' })
  await load()
}

onMounted(load);
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h2 class="text-xl font-bold mb-2">Existing Rules</h2>
      <div v-for="r in rules" :key="r._id" class="border rounded p-3 mb-2">
        <div class="font-semibold">{{ r.name }}</div>
        <div class="text-sm opacity-70">type: {{ r.type }} · score: {{ r.score }} · enabled: {{ r.enabled ? 'yes' : 'no' }}</div>
        <div class="text-xs mt-1 break-words">config: {{ r.config }}</div>
        <div class="mt-2 flex gap-2">
          <button class="btn btn-xs" @click="toggle(r._id)">{{ r.enabled ? 'Disable' : 'Enable' }}</button>
          <button class="btn btn-xs btn-error" @click="removeRule(r._id)">Delete</button>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold mb-2">Add Rule</h2>
      <input v-model="form.name" class="input input-bordered w-full mb-2" placeholder="Rule name *" />
      <select v-model="form.type" class="select select-bordered w-full mb-2">
        <option value="keyword">keyword</option>
        <option value="regex">regex</option>
        <option value="threshold">threshold</option>
      </select>

      <div v-if="form.type === 'keyword'" class="mb-2">
        <input v-model="(form.config as any).keywords" class="input input-bordered w-full" placeholder="Keywords (comma-separated)" />
      </div>
      <div v-else-if="form.type === 'regex'" class="mb-2">
        <input v-model="(form.config as any).pattern" class="input input-bordered w-full" placeholder="Regex pattern (e.g., \\b(darn|heck)\\b)" />
      </div>
      <div v-else class="mb-2">
        <input
          type="number"
          v-model.number="(form.config as any).minScore"
          class="input input-bordered w-full"
          placeholder="Min score (e.g., 2)"
        />
      </div>

      <input
        type="number"
        v-model.number="form.score"
        class="input input-bordered w-full mb-2"
        placeholder="Rule score (ignored for threshold)"
      />
      <label class="flex items-center gap-2 mb-3">
        <input type="checkbox" v-model="form.enabled" /> Enabled
      </label>

      <button class="btn btn-primary" @click="save">Add Rule</button>
    </div>
  </div>
</template>
