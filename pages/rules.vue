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
  if (form.type === 'keyword' && typeof (form.config as any).keywords === 'string') {
    (form.config as any).keywords = (form.config as any).keywords
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  await typedApi('/api/rules', { method: 'POST', body: form });
  await load();
  reset();
}

async function toggle(id: string) {
  await typedApi(`/api/rules/${id}/toggle`, { method: 'POST' });
  await load();
}

async function removeRule(id: string) {
  await typedApi(`/api/rules/${id}`, { method: 'DELETE' });
  await load();
}

onMounted(load);
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Existing rules list -->
    <div data-testid="rules-list">
      <h2 class="text-xl font-bold mb-2">Existing Rules</h2>

      <div
        v-for="r in rules"
        :key="r._id"
        class="border rounded p-3 mb-2"
        data-testid="rule-item"
        role="group"
        :aria-label="`Rule card: ${r.name || r._id}`"
        :data-ci-rule-id="r._id"
      >
        <!-- extra wrapper so getByText(name).locator('..').locator('..') === card if needed -->
        <div class="rule-card__header">
          <div class="font-semibold" data-testid="rule-name">{{ r.name }}</div>
        </div>

        <div class="text-sm opacity-70">
          type: {{ r.type }} · score: {{ r.score }} · enabled: {{ r.enabled ? 'yes' : 'no' }}
        </div>

        <div class="text-xs mt-1 break-words">
          config: {{ typeof r.config === 'object' ? JSON.stringify(r.config) : r.config }}
        </div>

        <div class="mt-2 flex gap-2">
          <button
            class="btn btn-xs"
            data-testid="rule-toggle"
            :aria-label="`${r.enabled ? 'Disable' : 'Enable'} rule: ${r.name || r._id}`"
            @click="toggle(r._id)"
          >
            {{ r.enabled ? 'Disable' : 'Enable' }}
          </button>

          <button
            class="btn btn-xs btn-error"
            data-testid="rule-delete"
            :aria-label="`Delete rule: ${r.name || r._id}`"
            @click="removeRule(r._id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add rule form -->
    <div data-testid="rules-form">
      <h2 class="text-xl font-bold mb-2">Add Rule</h2>

      <label class="block text-sm mb-1" for="rule-name">Rule name *</label>
      <input
        id="rule-name"
        v-model="form.name"
        class="input input-bordered w-full mb-2"
        placeholder="Rule name *"
        data-testid="rule-form-name"
      />

      <label class="block text-sm mb-1" for="rule-type">Type</label>
      <select
        id="rule-type"
        v-model="form.type"
        class="select select-bordered w-full mb-2"
        data-testid="rule-form-type"
      >
        <option value="keyword">keyword</option>
        <option value="regex">regex</option>
        <option value="threshold">threshold</option>
      </select>

      <div v-if="form.type === 'keyword'" class="mb-2">
        <label class="block text-sm mb-1" for="rule-kws">Keywords</label>
        <input
          id="rule-kws"
          v-model="(form.config as any).keywords"
          class="input input-bordered w-full"
          placeholder="Keywords (comma-separated)"
          data-testid="rule-form-keywords"
        />
      </div>

      <div v-else-if="form.type === 'regex'" class="mb-2">
        <label class="block text-sm mb-1" for="rule-regex">Regex pattern</label>
        <input
          id="rule-regex"
          v-model="(form.config as any).pattern"
          class="input input-bordered w-full"
          placeholder="Regex pattern (e.g., \\b(darn|heck)\\b)"
          data-testid="rule-form-pattern"
        />
      </div>

      <div v-else class="mb-2">
        <label class="block text-sm mb-1" for="rule-threshold">Min score</label>
        <input
          id="rule-threshold"
          type="number"
          v-model.number="(form.config as any).minScore"
          class="input input-bordered w-full"
          placeholder="Min score (e.g., 2)"
          data-testid="rule-form-minscore"
        />
      </div>

      <label class="block text-sm mb-1" for="rule-score">Rule score</label>
      <input
        id="rule-score"
        type="number"
        v-model.number="form.score"
        class="input input-bordered w-full mb-2"
        placeholder="Rule score (ignored for threshold)"
        data-testid="rule-form-score"
      />

      <label class="flex items-center gap-2 mb-3">
        <input type="checkbox" v-model="form.enabled" data-testid="rule-form-enabled" />
        Enabled
      </label>

      <button class="btn btn-primary" @click="save" data-testid="rule-form-submit">Add Rule</button>
    </div>
  </div>
</template>
