<script setup>
import { computed, ref } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data } from '../../../forge/forge.data.js'
import { UPDATE_SITE, docPages } from './content.js'

const { frontmatter } = useData()
const route = useRoute()

const version = computed(() => data.assets.find((a) => a.id === 'studio-ai')?.version || '')
const current = computed(() => docPages.find((p) => route.path.replace(/\.html$/, '') === p.link))

const copied = ref(false)
async function copyUrl() {
  await navigator.clipboard.writeText(UPDATE_SITE)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <header class="sdh">
    <div class="glow" aria-hidden="true"><span class="g1" /><span class="g2" /></div>
    <div class="grid-bg" aria-hidden="true" />

    <div class="top">
      <a class="brand" :href="withBase('/studio-ai/')">
        <span class="anvil" />MuleSoftForge Studio AI
      </a>
      <span v-if="version" class="ver">v{{ version }}</span>
      <button type="button" class="copy" @click="copyUrl">
        {{ copied ? 'Copied' : 'Copy update site URL' }}
      </button>
    </div>

    <span v-if="current?.kicker" class="kicker">{{ current.kicker }}</span>
    <h1>{{ current?.heading || frontmatter.title }}</h1>
    <p v-if="frontmatter.description" class="lede">{{ frontmatter.description }}</p>

    <nav class="tabs" aria-label="Studio AI pages">
      <a
        v-for="p in docPages"
        :key="p.link"
        :href="withBase(p.link)"
        :class="{ on: current?.link === p.link }"
        :aria-current="current?.link === p.link ? 'page' : undefined"
      >{{ p.text }}</a>
    </nav>
  </header>
</template>

<style scoped>
.sdh {
  position: relative;
  margin: 0 0 36px;
  padding: 26px 28px 22px;
  border-radius: 20px;
  background: #070b14;
  color: #e6ecf5;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 70px -36px rgba(0, 60, 140, 0.7);
}

.glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.glow span {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  animation: drift 16s ease-in-out infinite alternate;
}

.g1 { width: 380px; height: 380px; left: -120px; top: -180px; background: #0077b6; }
.g2 { width: 360px; height: 360px; right: -120px; top: -60px; background: #5b3fd6; animation-delay: -8s !important; }

.grid-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 90% 80% at 30% 0%, #000 30%, transparent 80%);
}

.top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #c4d4ea !important;
  text-decoration: none !important;
}

.brand:hover { color: #fff !important; }

.anvil {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  box-shadow: 0 0 14px rgba(0, 163, 224, 0.6);
}

.ver {
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
}

.kicker {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #38bdf8, #a99cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h1 {
  margin: 6px 0 0;
  font-size: clamp(30px, 4.2vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 800;
  color: #fff;
}

.lede {
  max-width: 620px;
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 1.6;
  color: #a9b8ce;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 22px;
}

.tabs a {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #aeb9cc !important;
  text-decoration: none !important;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.tabs a:hover {
  color: #fff !important;
  border-color: rgba(0, 163, 224, 0.6);
}

.tabs a.on {
  color: #fff !important;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  border-color: transparent;
  box-shadow: 0 6px 20px -8px rgba(0, 163, 224, 0.9);
}

.copy {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 9px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #5b5cf0);
  box-shadow: 0 8px 24px -10px rgba(0, 163, 224, 0.9);
  transition: transform 0.2s;
}

.copy:hover { transform: translateY(-1px); }

@keyframes drift {
  to { transform: translate(40px, 30px) scale(1.1); }
}

@media (max-width: 640px) {
  .sdh { padding: 22px 18px 18px; border-radius: 16px; }
  .top { flex-wrap: wrap; }
}

@media (prefers-reduced-motion: reduce) {
  .glow span { animation: none; }
}
</style>
