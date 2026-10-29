<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../forge/forge.data.js'
import { ASSET_TYPES, ASSET_TYPES_PLURAL, isExternal } from '../../forge/catalog.js'

const query = ref('')
const activeType = ref('all')

const typeCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const asset of data.assets) counts[asset.type] = (counts[asset.type] ?? 0) + 1
  return counts
})

const filters = computed(() => [
  { id: 'all', label: 'All', count: data.assets.length },
  ...Object.entries(ASSET_TYPES_PLURAL)
    .filter(([id]) => typeCounts.value[id])
    .map(([id, label]) => ({ id, label, count: typeCounts.value[id] }))
])

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return data.assets.filter((asset) => {
    if (activeType.value !== 'all' && asset.type !== activeType.value) return false
    if (!q) return true
    return [asset.name, asset.summary, ...(asset.tags ?? [])].join(' ').toLowerCase().includes(q)
  })
})

function href(link: string) {
  return isExternal(link) ? link : withBase(link)
}
</script>

<template>
  <div class="catalog">
    <div class="catalog-controls">
      <input
        v-model="query"
        class="catalog-search"
        type="search"
        placeholder="Filter by name, purpose or tag (e.g. PDF, AI, Redis)"
        aria-label="Filter assets"
      />
      <div class="catalog-filters" role="tablist" aria-label="Asset type">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          role="tab"
          :aria-selected="activeType === filter.id"
          class="catalog-filter"
          :class="{ active: activeType === filter.id }"
          @click="activeType = filter.id"
        >
          {{ filter.label }} <span class="catalog-filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <div class="catalog-grid">
      <a
        v-for="asset in visible"
        :key="asset.id"
        class="catalog-card"
        :href="href(asset.link)"
        :target="isExternal(asset.link) ? '_blank' : undefined"
        :rel="isExternal(asset.link) ? 'noopener' : undefined"
      >
        <div class="catalog-card-head">
          <img :src="withBase(asset.icon)" :alt="''" width="40" height="40" />
          <div class="catalog-card-badges">
            <span v-if="asset.isNew" class="badge badge-new">New</span>
            <span class="badge">{{ ASSET_TYPES[asset.type] }}</span>
          </div>
        </div>
        <h3 class="catalog-card-title">{{ asset.name }}</h3>
        <p class="catalog-card-summary">{{ asset.summary }}</p>
        <dl class="catalog-card-facts">
          <template v-if="asset.version">
            <dt>Latest</dt>
            <dd>{{ asset.version }}</dd>
          </template>
          <template v-if="asset.requires">
            <dt>Requires</dt>
            <dd>{{ asset.requires }}</dd>
          </template>
        </dl>
        <span class="catalog-card-link">{{ isExternal(asset.link) ? 'Open ↗' : 'Read the docs →' }}</span>
      </a>
    </div>

    <p v-if="!visible.length" class="catalog-empty">
      No assets match “{{ query }}”. Want to build it?
      <a :href="withBase('/forge-initiative/how-to-contribute#propose-a-new-asset')">Propose a new asset</a>.
    </p>
  </div>
</template>

<style scoped>
.catalog-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.catalog-search {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
}

.catalog-search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.catalog-filter {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
}

.catalog-filter:hover,
.catalog-filter.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.catalog-filter.active {
  background: var(--vp-c-brand-soft);
}

.catalog-filter-count {
  opacity: 0.7;
  margin-left: 2px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none !important;
  transition: border-color 0.25s, transform 0.25s;
}

.catalog-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.catalog-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.catalog-card-head img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.catalog-card-badges {
  display: flex;
  gap: 6px;
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-new {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.catalog-card-title {
  margin: 0 0 6px !important;
  padding: 0 !important;
  border: 0 !important;
  font-size: 16px;
  line-height: 22px;
}

.catalog-card-summary {
  flex-grow: 1;
  margin: 0 0 12px !important;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 21px;
}

.catalog-card-facts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 10px;
  margin: 0 0 12px;
  font-size: 12px;
}

.catalog-card-facts dt {
  color: var(--vp-c-text-3);
}

.catalog-card-facts dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.catalog-card-link {
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 500;
}

.catalog-empty {
  color: var(--vp-c-text-2);
}
</style>
