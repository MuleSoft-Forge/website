<script setup>
import { computed, ref, watch } from 'vue'
import { secretFile } from './content.js'
import { reducedMotion, useInView, useTimeline } from './motion.js'

const { el, inView } = useInView(0.35)
const timeline = useTimeline()

// Number each secret in order so identical values share a placeholder, as the plugin does.
const lines = computed(() => {
  const ids = new Map()
  return secretFile.map((line) =>
    line.map((seg) => {
      if (!seg.secret) return seg
      if (!ids.has(seg.secret)) ids.set(seg.secret, ids.size + 1)
      return { ...seg, id: ids.get(seg.secret) }
    })
  )
})
const total = computed(() => new Set(secretFile.flat().filter((s) => s.secret).map((s) => s.secret)).size)

const masked = ref(total.value)
const manual = ref(false)

watch(inView, (visible) => {
  if (reducedMotion() || manual.value) return
  if (!visible) return timeline.stop()
  timeline.start(async (sleep) => {
    for (;;) {
      masked.value = 0
      await sleep(1600)
      for (let i = 1; i <= total.value; i++) {
        masked.value = i
        await sleep(650)
      }
      await sleep(4200)
    }
  })
})

function toggle() {
  manual.value = true
  timeline.stop()
  masked.value = masked.value === total.value ? 0 : total.value
}
</script>

<template>
  <div ref="el" class="mask">
    <div class="head">
      <span class="tab" :class="{ on: masked < total }">In your project</span>
      <span class="arrow">→</span>
      <span class="tab" :class="{ on: masked === total }">What the model sees</span>
      <button type="button" class="toggle" @click="toggle">{{ masked === total ? 'Show real values' : 'Mask them' }}</button>
    </div>
    <pre class="code"><code><span v-for="(line, li) in lines" :key="li" class="line"><template v-for="(seg, si) in line" :key="si"><span v-if="seg.secret" class="secret"><transition name="flip" mode="out-in"><span v-if="seg.id <= masked" key="ph" class="ph">«masked-{{ seg.id }}»</span><span v-else key="real" class="real">{{ seg.secret }}</span></transition></span><span v-else-if="seg.keep" class="keep" :class="{ lit: masked === total }">{{ seg.keep }}</span><span v-else :class="seg.c">{{ seg.t }}</span></template>
</span></code></pre>
    <div class="legend">
      <span><i class="sw sw-secret" />Hidden before anything is sent</span>
      <span><i class="sw sw-keep" />References kept, so the AI can follow your config</span>
    </div>
  </div>
</template>

<style scoped>
.mask {
  border-radius: 18px;
  overflow: hidden;
  background: #0b0f18;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 30px 70px -30px rgba(0, 40, 100, 0.6);
}

.head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 16px;
  background: #121826;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12.5px;
}

.tab {
  color: #5d6a80;
  font-weight: 600;
  transition: color 0.3s;
}

.tab.on { color: #fff; }
.arrow { color: #00a3e0; }

.toggle {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #bfe9fb;
  border: 1px solid rgba(0, 163, 224, 0.5);
}

.toggle:hover { background: rgba(0, 163, 224, 0.15); }

.code {
  margin: 0;
  padding: 18px 18px 14px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  color: #c4cee0;
}

.line { display: block; min-height: 1.75em; white-space: pre; }
.comment { color: #5d6a80; }

.secret > span {
  display: inline-block;
  border-radius: 4px;
  padding: 0 3px;
}

.real {
  color: #ff9e97;
  background: rgba(255, 95, 87, 0.14);
}

.ph {
  color: #f0c674;
  background: rgba(240, 198, 116, 0.16);
  box-shadow: 0 0 0 1px rgba(240, 198, 116, 0.3);
}

.flip-enter-active, .flip-leave-active { transition: opacity 0.22s, transform 0.22s, filter 0.22s; }
.flip-leave-to { opacity: 0; filter: blur(5px); transform: translateY(-5px); }
.flip-enter-from { opacity: 0; transform: translateY(5px); }

.keep {
  color: #8fd8a8;
  border-radius: 4px;
  transition: background 0.4s, box-shadow 0.4s;
}

.keep.lit {
  background: rgba(34, 197, 94, 0.12);
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.35);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  padding: 0 18px 16px;
  font-size: 12px;
  color: #8592a8;
}

.legend span { display: flex; align-items: center; gap: 7px; }
.sw { width: 10px; height: 10px; border-radius: 3px; }
.sw-secret { background: #f0c674; }
.sw-keep { background: #8fd8a8; }
</style>
