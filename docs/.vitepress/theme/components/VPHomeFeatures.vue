<script setup lang="ts">
import { useData } from 'vitepress'
import { withBase } from 'vitepress'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

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

function renderVideo(video: unknown) {
  if (!video || typeof video !== 'object') return null
  const o = video as Record<string, unknown>
  const src = typeof o.src === 'string' ? o.src : ''
  if (!src) return null
  return {
    src,
    title: typeof o.title === 'string' ? o.title : 'Why Jev',
    heading: typeof o.heading === 'string' ? o.heading : 'Why Jev',
  }
}

const featureVideos = computed(() =>
  features.value.map((f) => renderVideo(f.video))
)

type MediaFrame = { src: string; alt: string; caption: string }

function renderMedia(media: unknown) {
  if (!media || typeof media !== 'object') return null
  const o = media as Record<string, unknown>
  const frames = (Array.isArray(o.frames) ? o.frames : [])
    .filter((f): f is Record<string, unknown> => !!f && typeof f === 'object' && typeof f.src === 'string')
    .map((f) => ({
      src: withBase(String(f.src)),
      alt: typeof f.alt === 'string' ? f.alt : '',
      caption: typeof f.caption === 'string' ? f.caption : '',
    }))
  if (!frames.length) return null
  return {
    heading: typeof o.heading === 'string' ? o.heading : '',
    frames: frames as MediaFrame[],
  }
}

const featureMedia = computed(() =>
  features.value.map((f) => renderMedia(f.media))
)

const MEDIA_INTERVAL_MS = 3500
const mediaFrame = ref<Record<number, number>>({})
let mediaTimer: ReturnType<typeof setInterval> | undefined

function showFrame(cardIndex: number, frameIndex: number) {
  mediaFrame.value = { ...mediaFrame.value, [cardIndex]: frameIndex }
}

function stopMediaTimer() {
  if (mediaTimer) clearInterval(mediaTimer)
  mediaTimer = undefined
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  mediaTimer = setInterval(() => {
    featureMedia.value.forEach((media, i) => {
      if (media) showFrame(i, ((mediaFrame.value[i] ?? 0) + 1) % media.frames.length)
    })
  }, MEDIA_INTERVAL_MS)
})

onBeforeUnmount(stopMediaTimer)

function selectFrame(cardIndex: number, frameIndex: number) {
  stopMediaTimer()
  showFrame(cardIndex, frameIndex)
}

function cardBind(feature: { link?: string; target?: string; rel?: string; video?: unknown; media?: unknown }) {
  if (feature.video || feature.media) return {}
  return {
    href: feature.link || '#',
    target: feature.target,
    rel: feature.rel,
  }
}
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
        <component
          :is="feature.video || feature.media ? 'div' : 'a'"
          v-for="(feature, i) in features"
          :key="feature.title + i"
          class="carousel-card"
          v-bind="cardBind(feature)"
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
            <div v-if="featureVideos[i]" class="card-video">
              <p class="card-video-heading">{{ featureVideos[i].heading }}</p>
              <div class="card-video-frame">
                <iframe
                  :src="featureVideos[i].src"
                  :title="featureVideos[i].title"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                />
              </div>
            </div>
            <div v-if="featureMedia[i]" class="card-media">
              <p v-if="featureMedia[i].heading" class="card-video-heading">{{ featureMedia[i].heading }}</p>
              <a class="card-media-frame" :href="feature.link || '#'" :aria-label="feature.linkText || feature.title">
                <img
                  v-for="(frame, f) in featureMedia[i].frames"
                  :key="frame.src"
                  :src="frame.src"
                  :alt="frame.alt"
                  :class="{ active: (mediaFrame[i] ?? 0) === f }"
                  loading="lazy"
                />
              </a>
              <div class="card-media-steps" role="tablist" :aria-label="`${feature.title} steps`">
                <button
                  v-for="(frame, f) in featureMedia[i].frames"
                  :key="frame.caption + f"
                  type="button"
                  role="tab"
                  class="card-media-step"
                  :class="{ active: (mediaFrame[i] ?? 0) === f }"
                  :aria-selected="(mediaFrame[i] ?? 0) === f"
                  @click="selectFrame(i, f)"
                >
                  <span class="card-media-step-num">{{ f + 1 }}</span>{{ frame.caption }}
                </button>
              </div>
            </div>
            <div v-if="feature.linkText" class="card-link-text">
              <a
                v-if="feature.video || feature.media"
                class="card-link-value"
                :href="feature.link || '#'"
                :target="feature.target"
                :rel="feature.rel"
              >
                {{ feature.linkText }}
                <span class="vpi-arrow-right card-link-icon" />
              </a>
              <span v-else class="card-link-value">
                {{ feature.linkText }}
                <span class="vpi-arrow-right card-link-icon" />
              </span>
            </div>
          </article>
        </component>
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

.card-video {
  padding-top: 12px;
}

.card-video-heading {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--vp-c-text-1);
}

.card-video-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.card-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.card-media {
  padding-top: 12px;
}

.card-media-frame {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 575 / 350;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.card-media-frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.card-media-frame img.active {
  opacity: 1;
  transform: scale(1);
}

.card-media-steps {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.card-media-step {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
}

.card-media-step.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.card-media-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-default-soft);
  font-size: 11px;
}

.card-media-step.active .card-media-step-num {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.card-link-text {
  padding-top: 8px;
}

.card-link-text a.card-link-value {
  text-decoration: none;
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
