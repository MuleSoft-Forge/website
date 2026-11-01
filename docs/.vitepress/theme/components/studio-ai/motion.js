import { onBeforeUnmount, onMounted, ref } from 'vue'

export function reducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

// True while the element is on screen; always true where IntersectionObserver is missing.
export function useInView(threshold = 0.25) {
  const el = ref(null)
  const inView = ref(false)
  let observer

  onMounted(() => {
    if (!('IntersectionObserver' in window)) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry.isIntersecting
    }, { threshold })
    if (el.value) observer.observe(el.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return { el, inView }
}

// Runs an async timeline; starting again cancels the previous run.
export function useTimeline() {
  let run = 0
  const sleep = (ms, id) =>
    new Promise((resolve, reject) =>
      setTimeout(() => (id === run ? resolve() : reject(new Error('cancelled'))), ms)
    )

  function start(fn) {
    const id = ++run
    fn((ms) => sleep(ms, id)).catch(() => {})
  }

  function stop() {
    run++
  }

  onBeforeUnmount(stop)
  return { start, stop }
}
