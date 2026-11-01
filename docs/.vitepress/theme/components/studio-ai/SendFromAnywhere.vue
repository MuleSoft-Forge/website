<script setup>
import { ref, watch } from 'vue'
import { sources } from './content.js'
import { reducedMotion, useInView, useTimeline } from './motion.js'

const icons = {
  canvas: 'M4 6h5v5H4zM15 13h5v5h-5zM9 8.5h3.5V15H15',
  problems: 'M12 3l9 16H3zM12 10v4M12 17h.01',
  console: 'M4 5h16v14H4zM7 10l3 2-3 2M12 15h5',
  debugger: 'M8 8a4 4 0 018 0v6a4 4 0 01-8 0zM12 4V2M4 12h4M16 12h4M5 6l3 2M19 6l-3 2M5 19l3-2M19 19l-3-2',
  dataweave: 'M8 7l-4 5 4 5M16 7l4 5-4 5M13.5 5l-3 14',
  screenshot: 'M4 7h3l2-2h6l2 2h3v12H4zM12 10a3 3 0 100 6 3 3 0 000-6z',
  app: 'M3 12h4l3-7 4 14 3-7h4',
  voice: 'M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v4'
}

const { el, inView } = useInView(0.3)
const timeline = useTimeline()
const active = ref(-1)
const hovering = ref(false)

watch(inView, (visible) => {
  if (!visible || reducedMotion()) return timeline.stop()
  timeline.start(async (sleep) => {
    for (;;) {
      if (!hovering.value) active.value = (active.value + 1) % sources.length
      await sleep(1700)
    }
  })
})

function hover(i) {
  hovering.value = i >= 0
  if (i >= 0) active.value = i
}
</script>

<template>
  <div ref="el" class="grid">
    <div
      v-for="(s, i) in sources"
      :key="s.id"
      class="card"
      :class="{ on: active === i }"
      tabindex="0"
      @mouseenter="hover(i)"
      @mouseleave="hover(-1)"
      @focus="hover(i)"
      @blur="hover(-1)"
    >
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="icons[s.id]" />
      </svg>
      <div class="title">{{ s.title }}</div>
      <div class="how">{{ s.how }}</div>
      <div class="chip"><span class="arrow">→</span>{{ s.chip }}</div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.card {
  position: relative;
  padding: 20px 18px 18px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  outline: none;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 0% 0%, rgba(0, 163, 224, 0.16), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.card.on {
  transform: translateY(-3px);
  border-color: rgba(0, 163, 224, 0.55);
  box-shadow: 0 18px 40px -18px rgba(0, 163, 224, 0.55);
}

.card.on::before { opacity: 1; }

.ico {
  position: relative;
  width: 30px;
  height: 30px;
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.title {
  position: relative;
  margin-top: 12px;
  font-weight: 700;
  font-size: 15px;
  color: var(--vp-c-text-1);
}

.how {
  position: relative;
  margin-top: 2px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.chip {
  position: relative;
  margin-top: 14px;
  padding: 7px 10px;
  border-radius: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow-wrap: anywhere;
  opacity: 0.8;
  transform: translateY(2px);
  transition: all 0.35s;
}

.card.on .chip {
  opacity: 1;
  transform: none;
  border-color: rgba(0, 163, 224, 0.45);
}

.arrow {
  margin-right: 6px;
  color: var(--vp-c-brand-1);
}

@media (max-width: 960px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 520px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
