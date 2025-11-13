<!-- pages/submit.vue -->
<script setup lang="ts">
const { $api } = useNuxtApp();
const typedApi = $api as (url: string, options: any) => Promise<any>;
const type = ref<'text'|'link'>('text');
const category = ref('general');
const tags = ref('demo, test');
const text = ref('This is spam clickbait');

async function submitItem() {
  await typedApi('/api/items', {
    method: 'POST',
    body: {
      type: type.value,
      payload: {
        text: text.value,
        category: category.value,
        tags: tags.value.split(',').map((s) => s.trim()),
      },
    },
  });
  text.value = '';
}
</script>

<template>
  <div class="max-w-xl space-y-3">
    <h1 class="text-2xl font-bold">Submit Content</h1>
    <select v-model="type" class="select select-bordered w-full">
      <option value="text">Text</option>
      <option value="link">Link</option>
    </select>
    <input v-model="category" class="input input-bordered w-full" placeholder="Category *" />
    <input v-model="tags" class="input input-bordered w-full" placeholder="Tags (comma-separated)" />
    <textarea v-model="text" rows="6" class="textarea textarea-bordered w-full" placeholder="Your content *"></textarea>
    <button class="btn btn-primary" @click="submitItem">Submit</button>
  </div>
</template>
