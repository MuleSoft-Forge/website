<script setup>
import { ref, watch } from 'vue'
import { providers } from './content.js'
import { reducedMotion, useInView, useTimeline } from './motion.js'

const totals = [
  { label: 'This chat', value: 0.0258, tokens: '27.6k tokens' },
  { label: 'Today', value: 0.1901, tokens: '255.1k tokens' },
  { label: 'This month', value: 0.2133, tokens: '283.6k tokens' }
]

const { el, inView } = useInView(0.4)
const timeline = useTimeline()
const progress = ref(1)

watch(inView, (visible) => {
  if (!visible || reducedMotion()) return
  timeline.start(async (sleep) => {
    for (let i = 0; i <= 40; i++) {
      progress.value = 1 - (1 - i / 40) ** 3
      await sleep(30)
    }
  })
})
</script>

<template>
  <div ref="el" class="pc">
    <div class="left">
      <div class="chips">
        <span v-for="p in providers" :key="p" class="chip">{{ p }}</span>
      </div>
      <div class="auto">
        <div class="auto-head"><span class="auto-badge">Auto</span>picks the model per message</div>
        <div class="auto-row">
          <span class="lane fast">Fast model</span>
          <span>Quick questions in Ask mode</span>
        </div>
        <div class="auto-row">
          <span class="lane strong">Strong model</span>
          <span>Agent and Plan, fixes, reviews, DataWeave, debug events, images</span>
        </div>
        <div class="auto-foot">Rate-limited or down? The turn runs once on the other model.</div>
      </div>
    </div>

    <div class="cost">
      <div class="cost-head">
        <span>Model</span>
        <b>gpt-5.4-mini</b>
        <span class="price">$0.75 in · $4.50 out per 1M</span>
      </div>
      <div v-for="t in totals" :key="t.label" class="cost-row">
        <span class="cost-label">{{ t.label }}</span>
        <span class="cost-value">~${{ (t.value * progress).toFixed(4) }}</span>
        <span class="cost-tokens">{{ t.tokens }}</span>
      </div>
      <div class="cost-foot">Every call is logged to usage.jsonl with tokens and amounts only. Prices are public list prices via OpenRouter.</div>
    </div>
  </div>
</template>

<style scoped>
.pc {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  align-items: stretch;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s;
}

.chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.auto {
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.auto-head {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.auto-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
}

.auto-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.lane {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  text-align: center;
}

.fast { color: #0e7490; background: rgba(6, 182, 212, 0.14); }
.strong { color: #6d28d9; background: rgba(139, 92, 246, 0.14); }
.dark .fast { color: #67e8f9; }
.dark .strong { color: #c4b5fd; }

.auto-foot {
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.cost {
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(160deg, #0f1726, #111a2e 60%, #1a1640);
  color: #dbe3f0;
  box-shadow: 0 30px 70px -30px rgba(0, 40, 100, 0.6);
  display: flex;
  flex-direction: column;
}

.cost-head {
  display: grid;
  gap: 2px;
  padding-bottom: 14px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  color: #8592a8;
}

.cost-head b {
  font-size: 16px;
  color: #fff;
  font-family: var(--vp-font-family-mono);
}

.cost-row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cost-label { font-size: 13px; color: #aeb9cc; }

.cost-value {
  grid-row: span 2;
  align-self: center;
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(90deg, #6cc6ec, #a99cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cost-tokens { font-size: 12px; color: #5d6a80; }

.cost-foot {
  margin-top: auto;
  padding-top: 14px;
  font-size: 12px;
  line-height: 1.5;
  color: #6b778c;
}

@media (max-width: 860px) {
  .pc { grid-template-columns: 1fr; }
}
</style>
