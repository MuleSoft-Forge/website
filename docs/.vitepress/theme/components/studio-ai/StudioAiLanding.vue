<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../../forge/forge.data.js'
import ChatDemo from './ChatDemo.vue'
import SendFromAnywhere from './SendFromAnywhere.vue'
import ModesSwitcher from './ModesSwitcher.vue'
import ChecksPipeline from './ChecksPipeline.vue'
import SecretMaskDemo from './SecretMaskDemo.vue'
import ProvidersAndCost from './ProvidersAndCost.vue'
import ScreenshotGallery from './ScreenshotGallery.vue'
import AtAGlance from '../AtAGlance.vue'
import { UPDATE_SITE } from './content.js'

const asset = computed(() => data.assets.find((a) => a.id === 'studio-ai'))
const version = computed(() => asset.value?.version || '')

const copied = ref(false)
async function copyUrl() {
  await navigator.clipboard.writeText(UPDATE_SITE)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}

const proof = [
  ['Ask · Agent · Plan · Diagnose', 'four modes, one view'],
  ['Checked first', 'Mule XML, connectors, DataWeave'],
  ['Secrets masked', 'before anything is sent'],
  ['You accept', 'nothing is written until then']
]

const steps = [
  { n: 1, title: 'Install', body: 'Help > Install New Software, paste the update site, restart Studio.', link: '/studio-ai/install' },
  { n: 2, title: 'Set up', body: 'Pick a provider, paste your API key, click Test connection.', link: '/studio-ai/set-up' },
  { n: 3, title: 'Use the chat', body: 'Open a Mule file and ask. Modes, context and reviewing changes.', link: '/studio-ai/use-the-chat' }
]
</script>

<template>
  <div class="sai">
    <!-- Hero -->
    <section class="hero">
      <div class="glow" aria-hidden="true"><span class="g1" /><span class="g2" /><span class="g3" /></div>
      <div class="grid-bg" aria-hidden="true" />
      <div class="wrap hero-inner">
        <a class="eyebrow" :href="withBase('/whats-new')">
          <span class="pill">New</span>
          <span v-if="version" class="eyebrow-ver">v{{ version }} · </span>Diagnose mode: find the cause, with evidence
          <span class="chev">→</span>
        </a>
        <h1>
          The AI pair programmer<br />
          <span class="grad">that knows Mule.</span>
        </h1>
        <p class="lede">
          MuleSoftForge Studio AI lives inside Anypoint Studio. Ask about flows, DataWeave, Problems, Console output and live debugger
          events. Every change comes back as a diff, checked against your project, and nothing is written until you accept.
        </p>
        <div class="ctas">
          <button type="button" class="cta primary" @click="copyUrl">
            <span class="cta-label">{{ copied ? 'Copied. Paste it into Install New Software' : 'Copy update site URL' }}</span>
            <code>{{ UPDATE_SITE }}</code>
          </button>
          <a class="cta ghost" :href="withBase('/studio-ai/install')">Install guide</a>
          <a class="cta ghost" :href="withBase('/studio-ai/use-the-chat')">Read the docs</a>
        </div>
        <p class="fine">For Anypoint Studio 7.28+ on Java 17 · your own API key · no other Studio extensions needed</p>

        <div class="demo-wrap">
          <ChatDemo :version="version" />
        </div>

        <ul class="proof">
          <li v-for="[big, small] in proof" :key="big"><b>{{ big }}</b><span>{{ small }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Send from anywhere -->
    <section class="band">
      <div class="wrap">
        <header class="head">
          <span class="kicker">Context</span>
          <h2>Send it from wherever you're stuck</h2>
          <p>Right-click, or press Cmd/Ctrl+Alt+I. The AI gets exactly what you're looking at, attached to your next message.</p>
        </header>
        <SendFromAnywhere />
      </div>
    </section>

    <!-- Modes -->
    <section class="band alt">
      <div class="wrap">
        <header class="head">
          <span class="kicker">Modes</span>
          <h2>Ask it. Diagnose it. Let it act. Or plan first.</h2>
          <p>Ask, Plan and Diagnose only get read tools, and the tool layer refuses edits in those modes as well.</p>
        </header>
        <ModesSwitcher />
      </div>
    </section>

    <!-- Checks -->
    <section class="band">
      <div class="wrap split">
        <div class="split-copy">
          <span class="kicker">Checks</span>
          <h2>Checked before you ever see it</h2>
          <p>
            When the AI proposes a change to Mule XML, <code>pom.xml</code> or your properties, the plugin checks the project as it
            would be with the change applied. New problems go back to the AI to fix first.
          </p>
          <ul class="ticks">
            <li>Connector operations and attributes are checked against the version in your <code>pom.xml</code></li>
            <li>DataWeave is compiled with MuleSoft's DataWeave CLI</li>
            <li>Ask "why won't this deploy?" and it runs the same checks on the whole project</li>
          </ul>
        </div>
        <ChecksPipeline />
      </div>
    </section>

    <!-- Secrets -->
    <section class="band alt">
      <div class="wrap split reverse">
        <SecretMaskDemo />
        <div class="split-copy">
          <span class="kicker">Privacy</span>
          <h2>Your secrets stay in Studio</h2>
          <p>
            Passwords, keys, tokens and client ids become <code>«masked-N»</code> before your message, files, console output or
            attachments are sent. References like <code>${secure::x}</code> are kept, so the AI can still follow your
            configuration.
          </p>
          <ul class="ticks">
            <li>When it edits a masked line, the real value is put back before you review</li>
            <li><code>.env</code>, keys, keystores and <code>credentials*.json</code> are never read</li>
            <li>A hardcoded secret in Mule XML gets flagged, with a fix that moves it to secure properties</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Providers and cost -->
    <section class="band">
      <div class="wrap">
        <header class="head">
          <span class="kicker">Models</span>
          <h2>Any model. Your key. Every cent visible.</h2>
          <p>Switch models mid-chat and the conversation carries over. The cost column shows what this chat, today and this month have cost.</p>
        </header>
        <ProvidersAndCost />
      </div>
    </section>

    <!-- Gallery -->
    <section class="band alt">
      <div class="wrap">
        <header class="head">
          <span class="kicker">The real thing</span>
          <h2>Straight from Anypoint Studio</h2>
          <p>Click a screenshot to see it full size.</p>
        </header>
        <ScreenshotGallery />
      </div>
    </section>

    <!-- Get started -->
    <section class="band start">
      <div class="glow soft" aria-hidden="true"><span class="g1" /><span class="g2" /></div>
      <div class="wrap">
        <header class="head light">
          <span class="kicker">Get started</span>
          <h2>Running in Studio in three steps</h2>
        </header>
        <div class="steps">
          <a v-for="s in steps" :key="s.n" class="step" :href="withBase(s.link)">
            <span class="step-n">{{ s.n }}</span>
            <span class="step-title">{{ s.title }} <span class="chev">→</span></span>
            <span class="step-body">{{ s.body }}</span>
          </a>
        </div>
        <div class="glance-wrap">
          <AtAGlance id="studio-ai" />
        </div>
        <p class="more">
          New releases arrive through Studio's own updates: see <a :href="withBase('/studio-ai/update')">Update and roll back</a>.
          Stuck? <a :href="withBase('/studio-ai/troubleshooting')">Troubleshooting</a>. Curious how it works?
          <a :href="withBase('/studio-ai/build-it-yourself')">Build it yourself</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sai {
  --sai-max: 1180px;
  overflow-x: clip;
}

.wrap {
  max-width: var(--sai-max);
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero */
.hero {
  position: relative;
  padding: 72px 0 64px;
  background: #070b14;
  color: #e6ecf5;
  overflow: hidden;
  isolation: isolate;
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
  filter: blur(90px);
  opacity: 0.55;
  animation: drift 18s ease-in-out infinite alternate;
}

.g1 { width: 620px; height: 620px; left: -160px; top: -200px; background: #0077b6; }
.g2 { width: 560px; height: 560px; right: -140px; top: 40px; background: #5b3fd6; animation-delay: -6s !important; }
.g3 { width: 520px; height: 520px; left: 30%; top: 520px; background: #00a3e0; opacity: 0.3 !important; animation-delay: -12s !important; }

.grid-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 75%);
}

.hero-inner { text-align: center; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 5px;
  border-radius: 999px;
  font-size: 13px;
  color: #c4d4ea;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-decoration: none;
  transition: border-color 0.2s;
}

.eyebrow:hover { border-color: rgba(0, 163, 224, 0.7); }

.pill {
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
}

.chev { transition: transform 0.2s; display: inline-block; }
.eyebrow:hover .chev, .step:hover .chev { transform: translateX(3px); }

h1 {
  margin: 26px auto 0;
  font-size: clamp(40px, 6.4vw, 76px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 800;
  color: #fff;
}

.grad {
  background: linear-gradient(92deg, #38bdf8 0%, #00a3e0 30%, #8b7cff 70%, #c084fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  max-width: 720px;
  margin: 24px auto 0;
  font-size: clamp(16px, 1.7vw, 19px);
  line-height: 1.6;
  color: #a9b8ce;
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 12px;
  margin-top: 34px;
}

.cta {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.cta.primary {
  align-items: flex-start;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #5b5cf0);
  box-shadow: 0 12px 34px -10px rgba(0, 163, 224, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.cta.primary:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -10px rgba(0, 163, 224, 0.9); }

.cta.primary code {
  margin-top: 3px;
  padding: 0;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
  background: none;
}

.cta.ghost {
  color: #e6ecf5;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.cta.ghost:hover { background: rgba(255, 255, 255, 0.12); }

.fine {
  margin-top: 16px;
  font-size: 13px;
  color: #6e7f98;
}

.demo-wrap {
  max-width: 1040px;
  margin: 56px auto 0;
  perspective: 1600px;
}

.demo-wrap :deep(.win) {
  transform: rotateX(4deg);
  transform-origin: top center;
  transition: transform 0.6s;
}

.demo-wrap:hover :deep(.win) { transform: none; }

.proof {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  max-width: 1040px;
  margin: 48px auto 0;
  padding: 0;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.proof li {
  display: grid;
  gap: 3px;
  padding: 18px 16px;
  background: rgba(7, 11, 20, 0.85);
}

.proof b { font-size: 16px; color: #fff; }
.proof span { font-size: 13px; color: #7d8ca3; }

/* Bands */
.band {
  position: relative;
  padding: 96px 0;
  background: var(--vp-c-bg);
}

.band.alt { background: var(--vp-c-bg-alt); }

.head {
  max-width: 720px;
  margin: 0 auto 44px;
  text-align: center;
}

.kicker {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00a3e0, #7c6cff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h2 {
  margin: 10px 0 0;
  padding: 0;
  border: none;
  font-size: clamp(28px, 3.8vw, 44px);
  line-height: 1.12;
  letter-spacing: -0.025em;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.head p,
.split-copy p {
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
}

.split-copy code,
.ticks code {
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.88em;
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.ticks {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.ticks li {
  position: relative;
  padding-left: 30px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--vp-c-text-1);
}

.ticks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8l3 3 5-6' fill='none' stroke='%2322c55e' stroke-width='2'/%3E%3C/svg%3E") center/13px no-repeat;
}

/* Get started */
.start {
  background: #070b14;
  color: #e6ecf5;
  overflow: hidden;
  isolation: isolate;
}

.glow.soft span { opacity: 0.35; }

.head.light h2 { color: #fff; }

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.step {
  display: grid;
  gap: 8px;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none !important;
  transition: transform 0.25s, border-color 0.25s, background 0.25s;
}

.step:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 163, 224, 0.6);
  background: rgba(0, 163, 224, 0.08);
}

.step-n {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #00a3e0, #6d5dfc);
}

.step-title { font-size: 18px; font-weight: 700; color: #fff; }
.step-body { font-size: 14px; line-height: 1.55; color: #9aaac0; }

.glance-wrap {
  max-width: 760px;
  margin: 40px auto 0;
}

.glance-wrap :deep(.glance) {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: #00a3e0;
  color: #e6ecf5;
  --vp-c-text-1: #e6ecf5;
  --vp-c-text-2: #aeb9cc;
  --vp-c-text-3: #7d8ca3;
  --vp-c-divider: rgba(255, 255, 255, 0.1);
  --vp-c-bg: #070b14;
  --vp-code-block-bg: #0f1420;
  --vp-code-block-color: #dbe3f0;
  --vp-c-default-soft: rgba(255, 255, 255, 0.08);
}

.more {
  max-width: 760px;
  margin: 28px auto 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.7;
  color: #8592a8;
}

.more a { color: #6cc6ec; }

@keyframes drift {
  to { transform: translate(60px, 40px) scale(1.12); }
}

@media (max-width: 960px) {
  .proof { grid-template-columns: repeat(2, 1fr); }
  .split { grid-template-columns: 1fr; gap: 32px; }
  .split.reverse > :first-child { order: 2; }
  .steps { grid-template-columns: 1fr; }
  .band { padding: 72px 0; }
}

@media (max-width: 520px) {
  .hero { padding-top: 48px; }
  .eyebrow { font-size: 12px; }
  .eyebrow-ver { display: none; }
  .proof li { text-align: left; }
  .cta { width: 100%; align-items: center !important; text-align: center; }
  .cta.primary code { font-size: 10.5px; }
  .demo-wrap { margin-top: 40px; }
  .demo-wrap :deep(.win) { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .glow span { animation: none; }
  .demo-wrap :deep(.win) { transform: none; transition: none; }
}
</style>
