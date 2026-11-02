<script setup>
import { withBase } from 'vitepress'
import { REPO } from './content.js'
</script>

<template>
  <aside class="sdf">
    <div class="glow" aria-hidden="true" />
    <div class="copy">
      <b>Something not right?</b>
      <span>Click <strong>Feedback</strong> in the MuleSoftForge Studio AI view. It fills in your versions and masks secrets for you.</span>
    </div>
    <div class="links">
      <a :href="withBase('/studio-ai/troubleshooting')">Troubleshooting</a>
      <a :href="`${REPO}/issues`" target="_blank" rel="noopener">Open an issue</a>
      <a class="primary" :href="withBase('/studio-ai/')">See what it can do →</a>
    </div>
  </aside>
</template>

<style scoped>
.sdf {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 48px;
  padding: 20px 22px;
  border-radius: 16px;
  background: #070b14;
  color: #e6ecf5;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 120% at 0% 0%, rgba(0, 119, 182, 0.45), transparent 60%),
    radial-gradient(50% 120% at 100% 100%, rgba(91, 63, 214, 0.45), transparent 60%);
}

.copy {
  display: grid;
  gap: 4px;
  max-width: 440px;
  font-size: 14px;
  line-height: 1.5;
  color: #a9b8ce;
}

.copy b { font-size: 16px; color: #fff; }
.copy strong { color: #fff; }

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.links a {
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #e6ecf5 !important;
  text-decoration: none !important;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  transition: background 0.2s;
}

.links a:hover { background: rgba(255, 255, 255, 0.12); }

.links a.primary {
  border-color: transparent;
  background: linear-gradient(135deg, #00a3e0, #5b5cf0);
}
</style>
