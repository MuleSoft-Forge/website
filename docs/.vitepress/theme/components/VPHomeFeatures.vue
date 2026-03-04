<script setup lang="ts">
import { useData } from 'vitepress'
import { withBase } from 'vitepress'
import { ref, computed } from 'vue'

const { frontmatter: fm } = useData()
const features = computed(() => (fm?.value?.features ?? []))
const carouselEl = ref<HTMLElement | null>(null)

const CARDS_PER_VIEW = 3
const currentIndex = ref(0)
const maxIndex = computed(() =>
  Math.max(0, Math.ceil(features.value.length / CARDS_PER_VIEW) - 1)
)

function goPrev() {
  currentIndex.value = Math.max(0, currentIndex.value - 1)
  scrollToIndex(currentIndex.value)
}

function goNext() {
  currentIndex.value = Math.min(maxIndex.value, currentIndex.value + 1)
  scrollToIndex(currentIndex.value)
}

function scrollToIndex(index: number) {
  if (!carouselEl.value) return
  const cardWidth = carouselEl.value.scrollWidth / features.value.length
  const scrollTarget = index * CARDS_PER_VIEW * cardWidth
  carouselEl.value.scrollTo({ left: scrollTarget, behavior: 'smooth' })
}

function onScroll() {
  if (!carouselEl.value || features.value.length === 0) return
  const cardWidth = carouselEl.value.scrollWidth / features.value.length
  const scrollLeft = carouselEl.value.scrollLeft
  const index = Math.round(scrollLeft / (CARDS_PER_VIEW * cardWidth))
  currentIndex.value = Math.min(maxIndex.value, Math.max(0, index))
}

function renderIcon(icon: unknown) {
  if (!icon || typeof icon !== 'object') return null
  const o = icon as Record<string, unknown>
  if (o.src) {
    const src = withBase(String(o.src))
    const alt = (o.alt as string) ?? ''
    const wrap = o.wrap
    if (wrap) {
      return { type: 'wrap', src, alt }
    }
    return { type: 'img', src, alt }
  }
  return null
}

const featureIcons = computed(() =>
  features.value.map((f) => renderIcon(f.icon))
)
</script>

<template>
  <div v-if="features.length" class="VPHomeFeatures VPHomeFeaturesCarousel">
    <div class="carousel-container">
      <button
        type="button"
        class="carousel-btn carousel-btn-prev"
        aria-label="Previous"
        :disabled="currentIndex <= 0"
        @click="goPrev"
      >
        <span class="carousel-btn-icon" aria-hidden="true">‹</span>
      </button>

      <div
        ref="carouselEl"
        class="carousel-track"
        @scroll="onScroll"
      >
        <a
          v-for="(feature, i) in features"
          :key="feature.title + i"
          class="carousel-card"
          :href="feature.link || '#'"
          :target="feature.target"
          :rel="feature.rel"
        >
          <article class="card-box">
            <template v-if="featureIcons[i]">
              <div
                v-if="featureIcons[i]?.type === 'wrap'"
                class="card-icon"
              >
                <img
                  :src="featureIcons[i].src"
                  :alt="featureIcons[i].alt"
                  width="48"
                  height="48"
                />
              </div>
              <img
                v-else
                :src="featureIcons[i].src"
                :alt="featureIcons[i].alt"
                width="48"
                height="48"
                class="card-icon-img"
              />
            </template>
            <h2 class="card-title" v-html="feature.title" />
            <p v-if="feature.details" class="card-details" v-html="feature.details" />
            <div v-if="feature.linkText" class="card-link-text">
              <span class="card-link-value">
                {{ feature.linkText }}
                <span class="vpi-arrow-right card-link-icon" />
              </span>
            </div>
          </article>
        </a>
      </div>

      <button
        type="button"
        class="carousel-btn carousel-btn-next"
        aria-label="Next"
        :disabled="currentIndex >= maxIndex"
        @click="goNext"
      >
        <span class="carousel-btn-icon" aria-hidden="true">›</span>
      </button>
    </div>

    <div v-if="features.length > CARDS_PER_VIEW" class="carousel-dots">
      <button
        v-for="idx in maxIndex + 1"
        :key="idx"
        type="button"
        class="carousel-dot"
        :class="{ active: currentIndex === idx - 1 }"
        :aria-label="`Go to slide ${idx}`"
        @click="currentIndex = idx - 1; scrollToIndex(idx - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.VPHomeFeaturesCarousel {
  position: relative;
  padding: 24px;
  min-height: 280px;
}

@media (min-width: 640px) {
  .VPHomeFeaturesCarousel {
    padding: 24px 48px;
  }
}

@media (min-width: 960px) {
  .VPHomeFeaturesCarousel {
    padding: 32px 64px;
  }
}

.carousel-container {
  display: flex;
  align-items: stretch;
  gap: 12px;
  max-width: 1152px;
  margin: 0 auto;
  min-height: 240px;
}

.carousel-btn {
  flex-shrink: 0;
  width: 44px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
}

.carousel-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.carousel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.carousel-btn-icon {
  font-size: 28px;
  line-height: 1;
  font-weight: 300;
}

.carousel-track {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-card {
  flex: 0 0 calc((100% - 32px) / 1);
  scroll-snap-align: start;
  text-decoration: none;
  color: inherit;
  display: block;
}

@media (min-width: 640px) {
  .carousel-card {
    flex: 0 0 calc((100% - 32px) / 2);
  }
}

@media (min-width: 960px) {
  .carousel-card {
    flex: 0 0 calc((100% - 32px) / 3);
  }
}

.card-box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
  min-height: 200px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}

.carousel-card:hover .card-box {
  border-color: var(--vp-c-brand-1);
}

.card-icon,
.card-icon-img {
  margin-bottom: 20px;
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  overflow: hidden;
}

.card-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.card-icon-img {
  display: block;
}

.card-title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.card-details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
}

.card-link-text {
  padding-top: 8px;
}

.card-link-value {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.card-link-icon {
  margin-left: 6px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-divider);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}

.carousel-dot:hover {
  background: var(--vp-c-text-3);
}

.carousel-dot.active {
  background: var(--vp-c-brand-1);
  transform: scale(1.2);
}
</style>
