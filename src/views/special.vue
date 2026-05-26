<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
interface Point {
  x: number
  y: number
}
interface Stroke {
  id: number
  tool: 'pen' | 'chalk' | 'dash'
  color: string
  width: number
  points: Point[]
}
const parentRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const tool = ref<'pen' | 'chalk' | 'dash'>('pen')
const color = ref('#ffffff')
const size = ref(5)
const drawing = ref(false)
const strokes = ref<Stroke[]>([])
let currentStroke: Stroke | null = null
let ctx: CanvasRenderingContext2D | null = null
const setTool = (value: 'pen' | 'chalk' | 'dash') => {
  tool.value = value
}
const clearCanvas = () => {
  strokes.value = []
  render()
}
const resizeCanvas = () => {
  const canvas = canvasRef.value
  const parent = parentRef.value
  if (!canvas || !parent || !ctx) return
  canvas.width = parent.clientWidth
  canvas.height = parent.clientHeight
  render()
}
const getPoint = (e: MouseEvent): Point => {
  const canvas = canvasRef.value
  if (!canvas) {
    return { x: 0, y: 0 }
  }
  const rect = canvas.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top}
}
const drawStroke = (stroke: Stroke) => {
  if (!ctx) return
  if (stroke.points.length < 2) return
  ctx.save()
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.width
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  // Tool styles
  switch (stroke.tool) {
    case 'chalk':
      ctx.globalAlpha = 0.35
      ctx.setLineDash([])
      break
    case 'dash':
      ctx.globalAlpha = 1
      ctx.setLineDash([12, 8])
      break
    default:
      ctx.globalAlpha = 1
      ctx.setLineDash([])
      break
  }
  ctx.beginPath()
  const first = stroke.points[0]
  if (!first) return
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < stroke.points.length; i++) {
    const point = stroke.points[i]
    if (!point) continue
    ctx.lineTo(point.x, point.y)
  }
  ctx.stroke()
  ctx.restore()
}
const render = () => {
  const canvas = canvasRef.value
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  strokes.value.forEach(drawStroke)
  if (currentStroke) {
    drawStroke(currentStroke)
  }
}
const startDraw = (e: MouseEvent) => {
  drawing.value = true
  currentStroke = {
    id: Date.now(),
    tool: tool.value,
    color: color.value,
    width: size.value,
    points: [getPoint(e)]
  }
  window.addEventListener('mousemove', moveDraw)
  window.addEventListener('mouseup', stopDraw)
}
const moveDraw = (e: MouseEvent) => {
  if (!drawing.value || !currentStroke) return
  currentStroke.points.push(getPoint(e))
  render()
}
const stopDraw = () => {
  drawing.value = false
  if (currentStroke) {
    strokes.value.push(currentStroke)
  }
  currentStroke = null
  window.removeEventListener('mousemove', moveDraw)
  window.removeEventListener('mouseup', stopDraw)
  render()
}
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', moveDraw)
  window.removeEventListener('mouseup', stopDraw)
})
</script>
<template>
  <div ref="parentRef" class="wrap">
    <!-- <div class="toolbar">
      <button @click="setTool('pen')">Pen</button>
      <button @click="setTool('chalk')">Chalk</button>
      <input v-model="color" type="color" />
      <input v-model="size" type="range" min="1" max="30"/>
      <button @click="clearCanvas">Clear</button>
    </div> -->
    <canvas
      ref="canvasRef"
      class="board"
      @mousedown="startDraw"
    />
  </div>
</template>



<style scoped>
.wrap {
  position: fixed;
  inset: 0;
  background: #111;
  overflow: hidden;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;

  display: flex;
  gap: 10px;

  padding: 10px;
  border-radius: 10px;

  background: rgba(0, 0, 0, 0.7);
}

.toolbar button {
  cursor: pointer;
}

.board {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
}
</style>