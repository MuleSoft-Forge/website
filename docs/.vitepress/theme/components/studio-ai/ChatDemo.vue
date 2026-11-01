<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import StudioWindow from './StudioWindow.vue'
import { scenarios } from './content.js'
import { reducedMotion, useInView, useTimeline } from './motion.js'

const props = defineProps({ version: { type: String, default: '' } })

const { el, inView } = useInView(0.35)
const timeline = useTimeline()
const transcript = ref(null)

const current = ref(0)
const scenario = computed(() => scenarios[current.value])

const answerTokens = computed(() =>
  scenario.value.answer.split('`').map((text, i) => ({ text, code: i % 2 === 1 }))
)
const answerLength = computed(() => answerTokens.value.reduce((n, t) => n + t.text.length, 0))
const visibleTokens = computed(() => {
  let left = st.chars
  return answerTokens.value
    .map((t) => {
      const text = t.text.slice(0, Math.max(0, left))
      left -= t.text.length
      return { ...t, text }
    })
    .filter((t) => t.text)
})

const st = reactive({})
const streaming = computed(() => st.sent && st.chars < answerLength.value && st.stepsDone === scenario.value.steps.length)

function finalState() {
  const sc = scenario.value
  Object.assign(st, {
    banner: !!sc.banner,
    chips: sc.context.length > 0,
    typed: '',
    sent: true,
    steps: sc.steps.length,
    stepsDone: sc.steps.length,
    chars: answerLength.value,
    diff: sc.diff.length,
    actions: true,
    active: -1,
    done: false
  })
}

function reset() {
  Object.assign(st, {
    banner: false,
    chips: false,
    typed: '',
    sent: false,
    steps: 0,
    stepsDone: 0,
    chars: 0,
    diff: 0,
    actions: false,
    active: -1,
    done: false
  })
}

finalState()

async function play(sleep) {
  const sc = scenario.value
  reset()
  await sleep(500)
  if (sc.banner) {
    st.banner = true
    await sleep(800)
  }
  if (sc.context.length) {
    st.chips = true
    await sleep(600)
  }
  for (let i = 1; i <= sc.prompt.length; i++) {
    st.typed = sc.prompt.slice(0, i)
    await sleep(34)
  }
  await sleep(400)
  st.typed = ''
  st.sent = true
  for (let i = 0; i < sc.steps.length; i++) {
    st.steps = i + 1
    await sleep(700)
    st.stepsDone = i + 1
  }
  while (st.chars < answerLength.value) {
    st.chars += 3
    await sleep(18)
  }
  for (let i = 1; i <= sc.diff.length; i++) {
    st.diff = i
    await sleep(150)
  }
  await sleep(350)
  st.actions = true
  await sleep(1200)
  st.active = 0
  await sleep(1000)
  st.active = sc.actions.length > 2 ? 1 : sc.actions.length - 1
  await sleep(500)
  st.done = true
  await sleep(3600)
  current.value = (current.value + 1) % scenarios.length
  timeline.start(play)
}

function select(i) {
  current.value = i
  if (reducedMotion()) finalState()
  else timeline.start(play)
}

watch(inView, (visible) => {
  if (reducedMotion()) return
  if (visible) timeline.start(play)
  else {
    timeline.stop()
    finalState()
  }
})

watch(
  () => [st.sent, st.steps, st.chars, st.diff, st.actions, st.done],
  () => nextTick(() => {
    const t = transcript.value
    if (t) t.scrollTop = t.scrollHeight
  })
)

const canvasFocus = computed(() => ({ agent: 'errors', dataweave: 'transform', debug: 'transform' })[scenario.value.id])
</script>

<template>
  <div ref="el" class="demo">
    <div class="demo-tabs" role="tablist" aria-label="Demo scenarios">
      <button
        v-for="(sc, i) in scenarios"
        :key="sc.id"
        role="tab"
        :aria-selected="i === current"
        :class="{ on: i === current }"
        @click="select(i)"
      >
        {{ sc.tab }}
      </button>
    </div>

    <StudioWindow title="studio-workspace · employees-app · Anypoint Studio">
      <div class="studio">
        <div class="canvas" aria-hidden="true">
          <div class="canvas-head">{{ scenario.id === 'agent' ? 'employees-api.xml' : 'get-employees.xml' }}</div>
          <div class="flow">
            <div class="flow-name">get:\employees:employees-api-config</div>
            <div class="flow-row">
              <div class="node"><span class="icon http" />Listener</div>
              <span class="arrow" />
              <div class="node" :class="{ focus: canvasFocus === 'transform', broken: scenario.id === 'debug' && st.banner }">
                <span class="icon dw" />Transform
                <span v-if="scenario.id === 'debug'" class="bp" />
              </div>
              <span class="arrow" />
              <div class="node"><span class="icon log" />Logger</div>
            </div>
            <div class="flow-errors" :class="{ focus: canvasFocus === 'errors' }">Error handling</div>
          </div>
          <div class="palette">
            <div v-for="n in ['Listener (HTTP)', 'Request (HTTP)', 'Transform Message', 'Choice', 'Flow Reference']" :key="n">{{ n }}</div>
          </div>
        </div>

        <div class="chat">
          <div class="chat-head">
            <span class="chat-title"><span class="anvil" />MuleSoftForge AI</span>
            <span class="chat-links"><span v-if="props.version">v{{ props.version }}</span><span>History ▾</span><span>Settings</span></span>
          </div>

          <transition name="slide">
            <div v-if="st.banner" class="banner">
              <span class="banner-dot" />{{ scenario.banner }}
            </div>
          </transition>

          <div ref="transcript" class="transcript">
            <transition name="fade">
              <div v-if="st.sent" class="msg user">
                <div class="who">You</div>
                <div class="bubble">{{ scenario.prompt }}</div>
                <div class="meta">{{ scenario.mode }}, project employees-app</div>
              </div>
            </transition>

            <ul v-if="st.steps" class="steps">
              <li v-for="(step, i) in scenario.steps.slice(0, st.steps)" :key="step" :class="{ ok: i < st.stepsDone }">
                <span class="tick" />{{ step }}
              </li>
            </ul>

            <div v-if="st.chars" class="msg ai">
              <div class="who">AI</div>
              <p class="answer">
                <template v-for="(t, i) in visibleTokens" :key="i">
                  <code v-if="t.code">{{ t.text }}</code><template v-else>{{ t.text }}</template>
                </template><span v-if="streaming" class="caret" />
              </p>

              <div v-if="st.diff" class="diff">
                <div class="diff-head">{{ scenario.diffLang === 'xml' ? 'XML' : 'DataWeave' }}</div>
                <div
                  v-for="(line, i) in scenario.diff.slice(0, st.diff)"
                  :key="i"
                  class="diff-line"
                  :class="{ add: line[0] === '+', del: line[0] === '-' }"
                >
                  <span class="sign">{{ line[0] }}</span><span>{{ line[1] }}</span>
                </div>
              </div>

              <transition name="fade">
                <div v-if="st.actions" class="proposal">
                  <div v-if="scenario.proposal" class="proposal-head">Proposed changes · nothing is written until you accept</div>
                  <div v-if="scenario.proposal" class="proposal-row">
                    <span>{{ scenario.proposal.file }}</span>
                    <span><b class="plus">+{{ scenario.proposal.add }}</b> <b class="minus">−{{ scenario.proposal.del }}</b></span>
                  </div>
                  <div class="actions">
                    <span
                      v-for="(a, i) in scenario.actions"
                      :key="a"
                      class="btn"
                      :class="{ primary: i === 0 || a === 'Accept' || a.startsWith('Apply'), pressed: st.active === i }"
                    >{{ a }}</span>
                  </div>
                  <transition name="fade">
                    <div v-if="st.done" class="done"><span class="done-tick" />{{ scenario.done }}</div>
                  </transition>
                </div>
              </transition>
            </div>
          </div>

          <div class="composer">
            <transition name="fade">
              <div v-if="st.chips" class="chips">
                <span v-for="c in scenario.context" :key="c" class="chip">{{ c }}</span>
              </div>
            </transition>
            <div class="input" :class="{ typing: st.typed }">
              <span v-if="st.typed">{{ st.typed }}<span class="caret" /></span>
              <span v-else class="placeholder">Ask about your Mule project…</span>
            </div>
            <div class="bar">
              <span class="select">{{ scenario.mode }} ▾</span>
              <span class="select grow">{{ scenario.model }} ▾</span>
              <span class="ghost">+ Context</span>
              <span class="send">Send</span>
            </div>
          </div>
        </div>
      </div>
    </StudioWindow>
  </div>
</template>

<style scoped>
.demo {
  --ink: #dbe3f0;
  --muted: #8592a8;
  --line: rgba(255, 255, 255, 0.07);
  --accent: #00a3e0;
  font-size: 13px;
}

.demo-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.demo-tabs button {
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #c4cee0;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.2s;
}

.demo-tabs button:hover {
  border-color: rgba(0, 163, 224, 0.6);
  color: #fff;
}

.demo-tabs button.on {
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 24px -6px rgba(0, 163, 224, 0.7);
}

.studio {
  display: grid;
  grid-template-columns: 36% 1fr;
  height: 520px;
  color: var(--ink);
  text-align: left;
}

/* Canvas pane */
.canvas {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--line);
  background: #121826;
  min-width: 0;
}

.canvas-head {
  padding: 8px 12px;
  font-size: 11px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}

.flow {
  margin: 16px 12px;
  border: 1px solid rgba(0, 163, 224, 0.35);
  border-radius: 8px;
  overflow: hidden;
}

.flow-name {
  padding: 6px 10px;
  font-size: 10.5px;
  color: #9fd8f2;
  background: rgba(0, 163, 224, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 10px;
}

.node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  color: var(--muted);
  padding: 6px;
  border-radius: 8px;
  transition: all 0.4s;
}

.node.focus {
  color: #fff;
  background: rgba(0, 163, 224, 0.14);
  box-shadow: 0 0 0 1px rgba(0, 163, 224, 0.6), 0 0 24px rgba(0, 163, 224, 0.35);
}

.node.broken {
  background: rgba(255, 95, 87, 0.12);
  box-shadow: 0 0 0 1px rgba(255, 95, 87, 0.7), 0 0 24px rgba(255, 95, 87, 0.35);
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.icon.http { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.icon.dw { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.icon.log { background: linear-gradient(135deg, #6366f1, #4338ca); }

.bp {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff5f57;
}

.arrow {
  flex: 1;
  height: 1px;
  margin: 0 4px 18px;
  background: #3a465c;
}

.flow-errors {
  padding: 6px 10px;
  font-size: 10.5px;
  color: var(--muted);
  border-top: 1px solid var(--line);
  transition: all 0.4s;
}

.flow-errors.focus {
  color: #fff;
  background: rgba(0, 163, 224, 0.16);
  box-shadow: inset 3px 0 0 var(--accent);
}

.palette {
  margin-top: auto;
  padding: 10px 12px 14px;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 6px;
  font-size: 10.5px;
  color: #5d6a80;
}

/* Chat pane */
.chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #0f1420;
}

.chat-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
}

.anvil {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
}

.chat-links {
  display: flex;
  gap: 12px;
  color: #6cc6ec;
  font-size: 11.5px;
}

.banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 12px;
  color: #ffd4d1;
  background: rgba(255, 95, 87, 0.12);
  border-bottom: 1px solid rgba(255, 95, 87, 0.3);
}

.banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5f57;
  box-shadow: 0 0 0 4px rgba(255, 95, 87, 0.2);
  flex: none;
}

.transcript {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.transcript::-webkit-scrollbar { display: none; }

.who {
  font-size: 11px;
  font-weight: 700;
  color: #6cc6ec;
  margin-bottom: 4px;
}

.msg.ai .who { color: #a99cff; }

.bubble {
  padding: 8px 12px;
  border-radius: 8px;
  background: #1b2333;
  border: 1px solid var(--line);
}

.meta {
  margin-top: 5px;
  font-size: 11px;
  color: var(--muted);
}

.steps {
  list-style: none;
  margin: 12px 0;
  padding: 0;
  display: grid;
  gap: 5px;
}

.steps li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  font-family: var(--vp-font-family-mono);
  animation: rise 0.3s ease-out;
}

.tick {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(0, 163, 224, 0.3);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
  flex: none;
}

.steps li.ok { color: #aeb9cc; }

.steps li.ok .tick {
  position: relative;
  border: none;
  background: #22c55e;
  animation: none;
}

.steps li.ok .tick::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 2px;
  width: 3px;
  height: 6px;
  border: solid #0f1420;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.answer {
  margin: 0 0 10px;
  line-height: 1.6;
}

.answer code {
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
  color: #f0c674;
  background: rgba(255, 255, 255, 0.07);
}

.caret {
  display: inline-block;
  width: 7px;
  height: 14px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--accent);
  animation: blink 1s steps(2) infinite;
}

.diff {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  background: #0b0f18;
}

.diff-head {
  padding: 5px 10px;
  font-size: 10.5px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
}

.diff-line {
  display: flex;
  gap: 10px;
  padding: 1px 10px;
  white-space: pre;
  overflow: hidden;
  animation: rise 0.25s ease-out;
}

.diff-line.add { background: rgba(34, 197, 94, 0.13); color: #b8f5c9; }
.diff-line.del { background: rgba(255, 95, 87, 0.13); color: #ffc2bd; text-decoration: line-through; text-decoration-color: rgba(255, 95, 87, 0.5); }

.sign {
  width: 8px;
  color: var(--muted);
  flex: none;
}

.proposal {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #151c2a;
  border: 1px solid rgba(0, 163, 224, 0.25);
}

.proposal-head {
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 6px;
}

.proposal-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  margin-bottom: 10px;
}

.plus { color: #4ade80; }
.minus { color: #ff8a82; }

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.btn {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #c4cee0;
  transition: all 0.2s;
}

.btn.primary {
  border-color: rgba(0, 163, 224, 0.5);
  color: #bfe9fb;
}

.btn.pressed {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: scale(0.96);
  box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.25);
}

.done {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: #86efac;
}

.done-tick {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.6);
}

.composer {
  padding: 10px 14px 12px;
  border-top: 1px solid var(--line);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.chip {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  color: #bfe9fb;
  background: rgba(0, 163, 224, 0.14);
  border: 1px solid rgba(0, 163, 224, 0.35);
}

.input {
  min-height: 34px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #151c2a;
  transition: border-color 0.2s;
}

.input.typing {
  border-color: rgba(0, 163, 224, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 163, 224, 0.15);
}

.placeholder { color: #5d6a80; }

.bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 11.5px;
}

.select, .ghost {
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--line);
  color: #aeb9cc;
}

.grow { flex: 1; }

.send {
  padding: 3px 12px;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.35s, transform 0.35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(6px); }
.slide-enter-active, .slide-leave-active { transition: all 0.35s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-100%); }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes rise { from { opacity: 0; transform: translateY(4px); } }

@media (max-width: 760px) {
  .studio { grid-template-columns: 1fr; height: 500px; }
  .canvas { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .tick, .caret, .steps li, .diff-line { animation: none; }
  .transcript { scroll-behavior: auto; }
}
</style>
