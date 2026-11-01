<script setup>
import { withBase } from 'vitepress'
import { gallery } from './content.js'
</script>

<template>
  <div class="gallery" data-zoomable>
    <figure v-for="(shot, i) in gallery" :key="shot.src" :class="i === 0 ? 'hero-shot' : 'side-shot'">
      <img :src="withBase(shot.src)" :alt="shot.alt" loading="lazy" />
      <figcaption>{{ shot.caption }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.hero-shot { grid-column: 1 / -1; }

.hero-shot figcaption {
  text-align: center;
  font-size: 15px;
}

figure {
  margin: 0;
  padding: 10px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.35s, box-shadow 0.35s;
}

figure:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 50px -24px rgba(0, 60, 120, 0.45);
}

img {
  display: block;
  width: 100%;
  border-radius: 10px;
  cursor: zoom-in;
}

figcaption {
  margin: 10px 4px 2px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@media (max-width: 860px) {
  .gallery { grid-template-columns: 1fr; }
}
</style>
