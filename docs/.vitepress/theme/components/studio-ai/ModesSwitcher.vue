<script setup>
import { computed, ref } from 'vue'
import { modes } from './content.js'

const current = ref(1)
const mode = computed(() => modes[current.value])
const rights = [
  ['read', 'Reads the project'],
  ['propose', 'Proposes edits as diffs'],
  ['plan', 'Writes a plan']
]
</script>

<template>
  <div class="modes">
    <div class="side">
      <div class="tabs" role="tablist" aria-label="Chat modes">
        <button
          v-for="(m, i) in modes"
          :key="m.id"
          role="tab"
          :aria-selected="i === current"
          :class="{ on: i === current }"
          @click="current = i"
        >
          {{ m.name }}
        </button>
      </div>
      <transition name="swap" mode="out-in">
        <div :key="mode.id" class="copy">
          <h3>{{ mode.tagline }}</h3>
          <p>{{ mode.detail }}</p>
          <ul class="rights">
            <li v-for="[key, label] in rights" :key="key" :class="{ yes: mode.can[key] }">
              <span class="mark">{{ mode.can[key] ? '✓' : '–' }}</span>{{ label }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div class="stage">
      <transition name="swap" mode="out-in">
        <div v-if="mode.preview.kind === 'checklist'" key="ask" class="panel">
          <div class="panel-head">{{ mode.preview.title }}</div>
          <label v-for="item in mode.preview.items" :key="item.label" class="check">
            <span class="box" :class="{ on: item.on }" />
            <span>
              <span class="check-label">{{ item.label }}</span>
              <span class="files">{{ item.files }}</span>
            </span>
          </label>
          <div class="cta">{{ mode.preview.cta }}</div>
        </div>

        <div v-else-if="mode.preview.kind === 'proposals'" key="agent" class="panel">
          <div class="panel-head">{{ mode.preview.title }}</div>
          <div v-for="(p, i) in mode.preview.items" :key="p.file" class="row" :style="{ animationDelay: `${i * 120}ms` }">
            <span class="file">{{ p.file }}</span>
            <span><b class="plus">+{{ p.add }}</b> <b class="minus">−{{ p.del }}</b></span>
          </div>
          <div class="buttons">
            <span class="btn">Review diff</span><span class="btn primary">Accept</span><span class="btn">Reject</span><span class="btn primary">Accept all</span>
          </div>
        </div>

        <div v-else key="plan" class="panel">
          <div class="panel-head">Plan · employees-app</div>
          <div v-for="([h, body], i) in mode.preview.sections" :key="h" class="plan-row" :style="{ animationDelay: `${i * 120}ms` }">
            <span class="plan-h">{{ h }}</span>
            <span>{{ body }}</span>
          </div>
          <div class="cta">Draft this plan for review in Agent mode</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.modes {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 40px;
  align-items: center;
}

.tabs {
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.tabs button {
  padding: 7px 22px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: all 0.25s;
}

.tabs button.on {
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  box-shadow: 0 6px 20px -8px rgba(0, 163, 224, 0.8);
}

.copy h3 {
  margin: 22px 0 8px;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.copy p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.rights {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.rights li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.rights li.yes { color: var(--vp-c-text-1); }

.mark {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  background: var(--vp-c-default-soft);
}

.rights li.yes .mark {
  color: #fff;
  background: #22c55e;
}

.stage {
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(160deg, #0f1726, #111a2e 60%, #1a1640);
  box-shadow: 0 30px 70px -30px rgba(0, 40, 100, 0.6);
  min-height: 300px;
  display: flex;
  align-items: center;
}

.panel {
  width: 100%;
  color: #dbe3f0;
  font-size: 13.5px;
}

.panel-head {
  margin-bottom: 12px;
  font-size: 12px;
  color: #8592a8;
}

.check {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.box {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 4px;
  border: 1.5px solid #5d6a80;
  flex: none;
}

.box.on {
  border-color: #00a3e0;
  background: #00a3e0 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8l3 3 5-6' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E") center/12px no-repeat;
}

.check-label { display: block; }

.files {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  color: #8592a8;
}

.cta {
  display: inline-block;
  margin-top: 8px;
  padding: 7px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #fff;
  background: #00a3e0;
}

.row,
.plan-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  animation: rise 0.4s ease-out both;
}

.file {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plus { color: #4ade80; }
.minus { color: #ff8a82; }

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.btn {
  padding: 5px 11px;
  border-radius: 7px;
  font-size: 12.5px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #c4cee0;
}

.btn.primary {
  border-color: rgba(0, 163, 224, 0.6);
  color: #bfe9fb;
}

.plan-row {
  justify-content: flex-start;
}

.plan-h {
  width: 96px;
  flex: none;
  font-weight: 700;
  color: #a99cff;
}

.swap-enter-active, .swap-leave-active { transition: opacity 0.25s, transform 0.25s; }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-8px); }

@keyframes rise { from { opacity: 0; transform: translateY(6px); } }

@media (max-width: 860px) {
  .modes { grid-template-columns: 1fr; gap: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .row, .plan-row { animation: none; }
}
</style>
