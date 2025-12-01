<!-- pages/submit.vue -->
<script setup lang="ts">
const { $api } = useNuxtApp()
const api = $api as (url: string, options?: any) => Promise<any>

const type = ref<'text'|'link'>('text')
const title = ref('')
const url = ref('')
const category = ref('general')
const tags = ref('demo, test')
const text = ref('This is spam clickbait')

const busy = ref(false)
const okMsg = ref('')
const errMsg = ref('')

async function submitItem () {
  okMsg.value = ''
  errMsg.value = ''
  busy.value = true
  try {
    const payload: any = {
      title: title.value || undefined,
      category: category.value,
      tags: tags.value.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (type.value === 'text') payload.text = text.value
    else payload.url = url.value

    await api('/api/items', { method: 'POST', body: { type: type.value, payload } })
    okMsg.value = 'Submitted!'
    // reset only the content field
    if (type.value === 'text') text.value = ''
    else url.value = ''
  } catch (e: any) {
    errMsg.value = e?.data?.message || e?.message || 'Submit failed'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <form class="max-w-xl space-y-3" @submit.prevent="submitItem" data-testid="submit-form">
    <h1 class="text-2xl font-bold">Submit Content</h1>

    <label class="block text-sm font-medium" for="type">Type</label>
    <select id="type" v-model="type" class="select select-bordered w-full" data-testid="field-type">
      <option value="text">Text</option>
      <option value="link">Link</option>
    </select>

    <label class="block text-sm font-medium" for="title">Title</label>
    <input id="title" v-model="title" class="input input-bordered w-full" placeholder="Short title"
           data-testid="field-title" />

    <label class="block text-sm font-medium" for="category">Category *</label>
    <select id="category" v-model="category" class="select select-bordered w-full" data-testid="field-category">
      <option value="general">General</option>
      <option value="ads">Ads</option>
      <option value="spam">Spam</option>
      <option value="other">Other</option>
    </select>

    <label class="block text-sm font-medium" for="tags">Tags</label>
    <input id="tags" v-model="tags" class="input input-bordered w-full"
           placeholder="comma,separated,tags" data-testid="field-tags" />

    <template v-if="type === 'text'">
      <label class="block text-sm font-medium" for="text">Text *</label>
      <textarea id="text" v-model="text" rows="6" class="textarea textarea-bordered w-full"
                placeholder="Your content" data-testid="field-text"></textarea>
    </template>
    <template v-else>
      <label class="block text-sm font-medium" for="url">URL *</label>
      <input id="url" v-model="url" type="url" class="input input-bordered w-full"
             placeholder="https://example.com" data-testid="field-url" />
    </template>

    <div v-if="errMsg" class="text-sm text-red-600" data-testid="submit-error">{{ errMsg }}</div>
    <div v-if="okMsg" class="text-sm text-green-600" data-testid="submit-ok">{{ okMsg }}</div>

    <button class="btn btn-primary" :disabled="busy" data-testid="submit-btn">
      {{ busy ? 'Submitting…' : 'Submit' }}
    </button>
  </form>
</template>
