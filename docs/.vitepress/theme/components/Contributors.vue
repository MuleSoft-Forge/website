<script setup lang="ts">
import { data } from '../../forge/forge.data.js'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 40 })
const shown = data.contributors.slice(0, props.limit)
</script>

<template>
  <div v-if="shown.length" class="contributors">
    <a
      v-for="person in shown"
      :key="person.login"
      class="contributor"
      :href="person.url"
      target="_blank"
      rel="noopener"
      :title="person.role ? `${person.login} · ${person.role}` : `${person.login} · ${person.contributions} contributions`"
    >
      <img :src="`${person.avatar}&s=96`" :alt="person.login" width="48" height="48" loading="lazy" />
    </a>
  </div>
  <p v-else class="contributors-empty">
    See everyone who builds MuleSoftForge on
    <a href="https://github.com/MuleSoft-Forge" target="_blank" rel="noopener">GitHub</a>.
  </p>
</template>

<style scoped>
.contributors {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0;
}

.contributor img {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg-soft);
  transition: transform 0.2s, border-color 0.2s;
}

.contributor:hover img {
  transform: scale(1.08);
  border-color: var(--vp-c-brand-1);
}

.contributors-empty {
  color: var(--vp-c-text-2);
}
</style>
