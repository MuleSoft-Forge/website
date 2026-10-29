<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { news } from '../../forge/news.js'
import { assets, isExternal } from '../../forge/catalog.js'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 0 })

const items = computed(() => {
  const list = props.limit ? news.slice(0, props.limit) : news
  return list.map((item) => ({ ...item, asset: assets.find((a) => a.id === item.asset) }))
})

function href(link: string) {
  return isExternal(link) ? link : withBase(link)
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <ol class="news">
    <li v-for="item in items" :key="item.date + item.title" class="news-item">
      <time class="news-date" :datetime="item.date">{{ formatDate(item.date) }}</time>
      <div class="news-body">
        <a class="news-title" :href="href(item.link)">
          <img v-if="item.asset" :src="withBase(item.asset.icon)" alt="" width="20" height="20" />
          {{ item.title }}
        </a>
        <p class="news-summary">{{ item.summary }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.news {
  list-style: none;
  margin: 16px 0;
  padding: 0;
}

.news-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 0 !important;
}

.news-date {
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  padding-top: 2px;
}

.news-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  text-decoration: none !important;
}

.news-title img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.news-summary {
  margin: 4px 0 0 !important;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 22px;
}

@media (max-width: 640px) {
  .news-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
