<script setup>
import { computed, reactive, watch } from 'vue'
import { checks } from './content.js'
import { reducedMotion, useInView, useTimeline } from './motion.js'

const { el, inView } = useInView(0.35)
const timeline = useTimeline()

// Per check: idle | run | pass | fail
const st = reactive({ status: checks.map(() => 'pass'), fixing: false, fixed: true, ready: true })

const passed = computed(() => st.status.filter((s) => s === 'pass').length)

function reset() {
  st.status = checks.map(() => 'idle')
  st.fixing = false
  st.fixed = false
  st.ready = false
}

async function play(sleep) {
  for (;;) {
    reset()
    await sleep(700)
    for (let i = 0; i < checks.length; i++) {
      st.status[i] = 'run'
      await sleep(520)
      if (checks[i].fail && !st.fixed) {
        st.status[i] = 'fail'
        await sleep(1100)
        st.fixing = true
        await sleep(1500)
        st.fixing = false
        st.fixed = true
        st.status[i] = 'run'
        await sleep(520)
      }
      st.status[i] = 'pass'
    }
    st.ready = true
    await sleep(3800)
  }
}

watch(inView, (visible) => {
  if (reducedMotion()) return
  if (visible) timeline.start(play)
  else timeline.stop()
})
</script>

<template>
  <div ref="el" class="pipe">
    <div class="source">
      <div class="label">The AI proposes</div>
      <div class="file">employees-api.xml <b class="plus">+45</b> <b class="minus">−12</b></div>
      <div class="meter"><span :style="{ width: `${(passed / checks.length) * 100}%` }" /></div>
    </div>

    <ol class="list">
      <li v-for="(c, i) in checks" :key="c.label" :class="st.status[i]">
        <span class="state" />
        <span class="text">
          {{ c.label }}
          <transition name="fade">
            <span v-if="c.fail && st.status[i] === 'fail'" class="note fail-note">{{ c.fail }}</span>
          </transition>
          <transition name="fade">
            <span v-if="c.fix && (st.fixing || (st.fixed && st.status[i] !== 'idle'))" class="note fix-note">
              {{ st.fixing ? `Sent back to the AI: it renames the ref to ${c.fix}…` : `Fixed by the AI before you saw it: ${c.fix}` }}
            </span>
          </transition>
        </span>
      </li>
    </ol>

    <transition name="pop">
      <div v-if="st.ready" class="ready">
        <span class="ready-dot" />Ready for your review · problems already in the project are not blamed on it
      </div>
    </transition>
  </div>
</template>

<style scoped>
.pipe {
  padding: 26px;
  border-radius: 18px;
  background: linear-gradient(160deg, #0f1726, #111a2e 60%, #10263a);
  color: #dbe3f0;
  box-shadow: 0 30px 70px -30px rgba(0, 40, 100, 0.6);
}

.source {
  padding-bottom: 16px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.label {
  font-size: 12px;
  color: #8592a8;
}

.file {
  margin-top: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
}

.plus { color: #4ade80; }
.minus { color: #ff8a82; }

.meter {
  height: 4px;
  margin-top: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00a3e0, #22c55e);
  transition: width 0.4s;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.list li {
  display: flex;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13.5px;
  color: #5d6a80;
  transition: all 0.3s;
}

.list li.run { color: #fff; background: rgba(0, 163, 224, 0.1); }
.list li.pass { color: #c4cee0; }
.list li.fail { color: #fff; background: rgba(255, 95, 87, 0.12); }

.state {
  position: relative;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  border: 1.5px solid #3a465c;
  flex: none;
}

.run .state {
  border-color: rgba(0, 163, 224, 0.3);
  border-top-color: #00a3e0;
  animation: spin 0.7s linear infinite;
}

.pass .state { border: none; background: #22c55e; }
.fail .state { border: none; background: #ff5f57; }

.pass .state::after {
  content: '';
  position: absolute;
  left: 5.5px;
  top: 2.5px;
  width: 4px;
  height: 8px;
  border: solid #0f1726;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.fail .state::after {
  content: '!';
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  color: #0f1726;
}

.text { display: flex; flex-direction: column; gap: 4px; }

.note {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.fail-note { color: #ffb4ae; }
.fix-note { color: #a99cff; }

.ready {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.ready-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 14px #22c55e;
  flex: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active { transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3); }
.pop-enter-from { opacity: 0; transform: scale(0.96); }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
