<script setup>
import { computed, ref, watch } from 'vue'
import { inBrowser, withBase } from 'vitepress'
import { stepSets } from './steps.js'

const props = defineProps({
  set: { type: String, required: true }
})

const steps = computed(() => stepSets[props.set] || [])
const index = ref(0)
const step = computed(() => steps.value[index.value])

function go(i) {
  const n = steps.value.length
  if (n) index.value = (i + n) % n
}

function onKey(e) {
  if (e.target.closest('summary, a')) return
  if (e.key === 'ArrowRight') { e.preventDefault(); go(index.value + 1) }
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(index.value - 1) }
}

let touchX = null
function onTouchStart(e) { touchX = e.touches[0].clientX }
function onTouchEnd(e) {
  if (touchX === null) return
  const dx = e.changedTouches[0].clientX - touchX
  touchX = null
  if (Math.abs(dx) > 40) go(index.value + (dx < 0 ? 1 : -1))
}

watch(index, (i) => {
  if (!inBrowser) return
  for (const j of [i + 1, i - 1]) {
    const s = steps.value[j]
    if (s?.src) new Image().src = withBase(s.src)
  }
}, { immediate: true })
</script>

<template>
  <section v-if="step" class="step-carousel" tabindex="0" :aria-label="`${steps.length} steps`" @keydown="onKey">
    <div class="head">
      <span class="count">Step {{ index + 1 }} of {{ steps.length }}</span>
      <div class="nav">
        <button type="button" class="arrow" aria-label="Previous step" :disabled="index === 0" @click="go(index - 1)">‹</button>
        <button type="button" class="arrow" aria-label="Next step" :disabled="index === steps.length - 1" @click="go(index + 1)">›</button>
      </div>
    </div>

    <div class="caption" aria-live="polite">
      <p class="title">{{ step.title }}</p>
      <p class="text" v-html="step.text" />
    </div>

    <div class="dots" role="tablist" aria-label="Steps">
        <button
        v-for="(s, i) in steps"
        :key="i"
        type="button"
        role="tab"
        :aria-selected="i === index"
        :aria-label="`Step ${i + 1}: ${s.title}`"
        :class="{ on: i === index, done: i < index }"
        @click="go(i)"
      >{{ i + 1 }}</button>
    </div>

    <div class="frame" @touchstart.passive="onTouchStart" @touchend="onTouchEnd">
      <Transition name="fade" mode="out-in">
        <img :key="step.src" :src="withBase(step.src)" :alt="step.alt" />
      </Transition>
    </div>

    <details class="all-steps">
      <summary>All {{ steps.length }} steps as a list</summary>
      <ol>
        <li v-for="(s, i) in steps" :key="i"><strong>{{ s.title }}.</strong> <span v-html="s.text" /></li>
      </ol>
    </details>
  </section>
</template>

<style scoped>
.step-carousel {
  margin: 24px 0 32px;
  padding: 18px 18px 14px;
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  outline: none;
}

.step-carousel:focus-visible {
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.count {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00a3e0, #6d5dfc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav { display: flex; gap: 8px; }

.arrow {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 22px;
  line-height: 1;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  box-shadow: 0 6px 18px -8px rgba(0, 163, 224, 0.9);
  transition: transform 0.2s, opacity 0.2s;
}

.arrow:hover:not(:disabled) { transform: translateY(-1px); }
.arrow:disabled { opacity: 0.3; cursor: default; box-shadow: none; }

.caption { min-height: 84px; margin: 8px 0 12px; }

.caption .title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--vp-c-text-1);
}

.caption .text {
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.dots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.dots button {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.dots button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-text-1); }
.dots button.done { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-soft); }

.dots button.on {
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  border-color: transparent;
}

.frame {
  display: grid;
  place-items: center;
}

.step-carousel .frame img {
  margin: 0;
  max-width: 100%;
  height: auto;
  cursor: zoom-in;
}

.all-steps {
  margin-top: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.all-steps summary {
  cursor: pointer;
  font-weight: 600;
}

.all-steps ol { margin: 10px 0 0; padding-left: 22px; }
.all-steps li { margin: 4px 0; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active { transition: none; }
}
</style>
