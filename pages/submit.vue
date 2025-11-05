<script setup lang="ts">
const token = process.client ? localStorage.getItem('token') : null
const type = ref<'text'|'link'>('text')
const text = ref('')
const category = ref('general')
const tags = ref<string>('')

async function submitItem(){
  await $fetch('/api/items', {
    method:'POST',
    headers:{ Authorization: `Bearer ${token}` },
    body:{ type: type.value, payload:{ text: text.value, category, tags: tags.value.split(',').map(s=>s.trim()) } }
  })
  text.value = ''
}
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-bold">Submit Content</h1>
    <select v-model="type" class="select select-bordered w-full">
      <option value="text">Text</option><option value="link">Link</option>
    </select>
    <input v-model="category" class="input input-bordered w-full" placeholder="Category" />
    <input v-model="tags" class="input input-bordered w-full" placeholder="Tags (comma-separated)" />
    <textarea v-model="text" rows="6" class="textarea textarea-bordered w-full" placeholder="Your content..."></textarea>
    <button class="btn btn-primary" @click="submitItem">Submit</button>
  </div>
</template>
