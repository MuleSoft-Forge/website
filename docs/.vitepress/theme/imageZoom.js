// Click (or double-click) a screenshot in a doc page to see it as large as the window allows.
// Listens once on the document, so it keeps working as VitePress swaps pages.

const MIN_WIDTH = 400
// A double-click's second click lands on the overlay; ignore it so the overlay stays open.
const IGNORE_CLOSE_MS = 400

function zoomable(target) {
  return target instanceof HTMLImageElement
    && target.closest('.vp-doc')
    && !target.closest('a')
    && target.naturalWidth >= MIN_WIDTH
}

function open(img) {
  const overlay = document.createElement('div')
  overlay.className = 'image-zoom'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', img.alt || 'Enlarged image')

  const large = document.createElement('img')
  large.src = img.currentSrc || img.src
  large.alt = img.alt
  overlay.appendChild(large)

  if (img.alt) {
    const caption = document.createElement('p')
    caption.textContent = img.alt
    overlay.appendChild(caption)
  }

  const opened = Date.now()
  const close = () => {
    overlay.remove()
    document.documentElement.classList.remove('image-zoom-open')
    document.removeEventListener('keydown', onKey)
    img.focus?.()
  }
  const onKey = (e) => {
    if (e.key === 'Escape') close()
  }
  overlay.addEventListener('click', () => {
    if (Date.now() - opened > IGNORE_CLOSE_MS) close()
  })
  document.addEventListener('keydown', onKey)

  document.documentElement.classList.add('image-zoom-open')
  document.body.appendChild(overlay)
  overlay.tabIndex = -1
  overlay.focus()
}

export function installImageZoom() {
  document.addEventListener('click', (e) => {
    if (zoomable(e.target)) {
      e.preventDefault()
      open(e.target)
    }
  })
}
