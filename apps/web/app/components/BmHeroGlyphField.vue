<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const GLYPHS = ' .·:;+=*#%@█'
const CELL = 10

let raf = 0
let ro: ResizeObserver | undefined
let mq: MediaQueryList | undefined
let reduce = false
let width = 0
let height = 0
let cols = 0
let rows = 0
let running = false

/** Rest pose + gentle hover nudge */
const REST = { x: 0.5, y: 0.5 }
const MAX_NUDGE = 0.034
const origin = { x: REST.x, y: REST.y, tx: REST.x, ty: REST.y }

/** Offscreen silhouette of the bm mark (white on black) */
let mask: HTMLCanvasElement | null = null
let maskReady = false

function cssColor(name: string, fallback: string) {
  if (!rootRef.value) return fallback
  const v = getComputedStyle(rootRef.value).getPropertyValue(name).trim()
  return v || fallback
}

function noise2(x: number, y: number, t: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + t * 0.28) * 43758.5453
  return n - Math.floor(n)
}

async function buildMask() {
  const img = new Image()
  img.decoding = 'async'
  img.src = '/bluemarket-icon.png'
  await img.decode()

  const size = 640
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(img, 0, 0, size, size)

  const data = ctx.getImageData(0, 0, size, size)
  const d = data.data

  let minX = size
  let minY = size
  let maxX = 0
  let maxY = 0
  const solid = new Uint8Array(size * size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const r = d[i]!
      const g = d[i + 1]!
      const b = d[i + 2]!
      const lum = (r * 0.3 + g * 0.4 + b * 0.55) / 255
      const inside = lum > 0.28 && b > r * 0.85
      if (!inside) continue
      solid[y * size + x] = 1
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  // Pad slightly so edges don’t clip glyphs
  const pad = 12
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(size - 1, maxX + pad)
  maxY = Math.min(size - 1, maxY + pad)

  const bw = maxX - minX + 1
  const bh = maxY - minY + 1
  const side = Math.max(bw, bh)
  const out = document.createElement('canvas')
  out.width = side
  out.height = side
  const octx = out.getContext('2d', { willReadFrequently: true })
  if (!octx) return

  const imgData = octx.createImageData(side, side)
  const od = imgData.data
  const ox = Math.floor((side - bw) / 2)
  const oy = Math.floor((side - bh) / 2)

  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      if (!solid[(minY + y) * size + (minX + x)]) continue
      const oi = ((oy + y) * side + (ox + x)) * 4
      od[oi] = od[oi + 1] = od[oi + 2] = 255
      od[oi + 3] = 255
    }
  }

  octx.putImageData(imgData, 0, 0)
  mask = out
  maskReady = true
}

/** Cached mask luminance buffer for fast sampling */
let maskBuf: Uint8ClampedArray | null = null
let maskW = 0
let maskH = 0

function cacheMaskBuffer() {
  if (!mask) return
  const ctx = mask.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  const img = ctx.getImageData(0, 0, mask.width, mask.height)
  maskBuf = img.data
  maskW = mask.width
  maskH = mask.height
}

function maskAt(u: number, v: number) {
  if (!maskBuf || u < 0 || v < 0 || u > 1 || v > 1) return 0
  const x = Math.min(maskW - 1, Math.max(0, Math.floor(u * (maskW - 1))))
  const y = Math.min(maskH - 1, Math.max(0, Math.floor(v * (maskH - 1))))
  return maskBuf[(y * maskW + x) * 4]! / 255
}

function drawFrame(tSec: number) {
  const canvas = canvasRef.value
  if (!canvas || !cols || !rows) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Slow ease — slight drift, not a magnet
  const ease = reduce ? 1 : 0.028
  origin.x += (origin.tx - origin.x) * ease
  origin.y += (origin.ty - origin.y) * ease

  const fg = cssColor('--foreground', '#1a2744')
  const muted = cssColor('--muted-foreground', '#6b7280')
  const primary = cssColor('--primary', '#4f6fd8')

  ctx.clearRect(0, 0, width, height)
  ctx.font = `500 ${CELL}px "JetBrains Mono", ui-monospace, monospace`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  const t = reduce ? 0 : tSec

  // Keep bm square in pixel space (panel is wide — don't squash)
  const markPx = Math.min(width, height) * 1.08
  const sx = markPx / Math.max(width, 1)
  const sy = markPx / Math.max(height, 1)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const nx = cols <= 1 ? 0.5 : x / (cols - 1)
      const ny = rows <= 1 ? 0.5 : y / (rows - 1)

      const mu = (nx - origin.x) / sx + 0.5
      const mv = (ny - origin.y) / sy + 0.5
      const m = maskAt(mu, mv)
      if (m < 0.5) continue

      const grain = noise2(nx * 8, ny * 8, t) * 0.4
      const dx = nx - origin.x
      const dy = ny - origin.y
      const glow = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2.2)
      const v = Math.min(1, 0.55 + grain + glow * 0.35)

      const gi = Math.min(GLYPHS.length - 1, Math.floor(v * (GLYPHS.length - 1)))
      const ch = GLYPHS[gi]
      if (!ch || ch === ' ') continue

      if (v > 0.78) ctx.fillStyle = primary
      else if (v > 0.5) ctx.fillStyle = fg
      else ctx.fillStyle = muted

      ctx.globalAlpha = 0.35 + v * 0.55
      ctx.fillText(ch, x * CELL, y * CELL)
    }
  }

  ctx.globalAlpha = 1
}

function resize() {
  const root = rootRef.value
  const canvas = canvasRef.value
  if (!root || !canvas) return

  const rect = root.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = Math.max(1, Math.floor(rect.width))
  height = Math.max(1, Math.floor(rect.height))
  cols = Math.max(1, Math.floor(width / CELL))
  rows = Math.max(1, Math.floor(height / CELL))

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  drawFrame(performance.now() / 1000)
}

function loop(now: number) {
  if (!running) return
  drawFrame(now / 1000)
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running) return
  running = true
  if (reduce) {
    drawFrame(0)
    return
  }
  raf = requestAnimationFrame(loop)
}

function stop() {
  running = false
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function setTargetFromClient(clientX: number, clientY: number) {
  if (reduce || !rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const rawX = (clientX - rect.left) / rect.width
  const rawY = (clientY - rect.top) / rect.height

  // Gentle nudge when pointer is around the field — not a magnet
  const dx = Math.min(MAX_NUDGE, Math.max(-MAX_NUDGE, (rawX - 0.5) * 0.09))
  const dy = Math.min(MAX_NUDGE, Math.max(-MAX_NUDGE, (rawY - 0.5) * 0.09))
  origin.tx = REST.x + dx
  origin.ty = REST.y + dy
}

function onPointerMove(e: PointerEvent) {
  setTargetFromClient(e.clientX, e.clientY)
}

function onPointerLeave() {
  origin.tx = REST.x
  origin.ty = REST.y
}

function onVisibility() {
  if (document.hidden) stop()
  else {
    resize()
    start()
  }
}

function onReduceChange() {
  reduce = mq?.matches ?? false
  stop()
  resize()
  start()
}

onMounted(async () => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduce = mq.matches
  mq.addEventListener('change', onReduceChange)

  await buildMask()
  cacheMaskBuffer()
  resize()
  start()

  ro = new ResizeObserver(() => resize())
  if (rootRef.value) ro.observe(rootRef.value)

  // Follow across the whole hero (parent), not only the canvas
  const host = rootRef.value?.closest('section') ?? rootRef.value
  host?.addEventListener('pointermove', onPointerMove)
  host?.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  stop()
  ro?.disconnect()
  mq?.removeEventListener('change', onReduceChange)
  const host = rootRef.value?.closest('section') ?? rootRef.value
  host?.removeEventListener('pointermove', onPointerMove)
  host?.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative h-full w-full overflow-visible"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 block h-full w-full"
    />
  </div>
</template>
