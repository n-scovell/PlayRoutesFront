import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import type { CSSProperties } from 'vue'
export const TOOL_TYPES = ['pen', 'chalk', 'dash', 'marker'] as const
export type ToolType = typeof TOOL_TYPES[number]

export const COLOR_TYPES = ['red', 'blue', 'yellow', 'white'] as const
export type ColorType = typeof COLOR_TYPES[number]

export type Point = { x: number; y: number }

export interface Stroke {
  id: number
  tool: ToolType
  color: string
  width: number
  points: Point[]
}

export function usePlayCanvas() {

  // let canvasEl: HTMLCanvasElement | null = null
  const canvasEl = ref<HTMLCanvasElement | null>(null)
  
  const drawing = ref(false)
  const strokes = ref<Stroke[]>([])

  const tool = ref<ToolType>('pen')
  const color = ref<ColorType>('white')
  const size = ref(5)

  let currentStroke: Stroke | null = null
  let ctx: CanvasRenderingContext2D | null = null

  const setColor = (c: ColorType) => (color.value = c)
  const setTool = (t: ToolType) => (tool.value = t)

  // -------------------------
  // POINT NORMALIZATION
  // -------------------------
const getPointsXY = (e: PointerEvent, canvas?: HTMLCanvasElement): Point => {
  const c = canvas ?? canvasEl.value
  if (!c) return { x: 0, y: 0 }
  const rect = c.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) / rect.width,
    y: (e.clientY - rect.top) / rect.height
  }
}
const clear = () => {
  strokes.value = []
  currentStroke = null
  renderCanvas()
}
const canvasMode = ref<string>('playbook')
const interactionMode = ref<'draw' | 'select'>('draw')

const setDrawMode = () => {
  interactionMode.value = 'draw'
}

const handleClick = (e: PointerEvent, canvas: HTMLCanvasElement | null) => {
  if (!canvas) return
  const clickedStroke = getStrokeAtPoint(e, canvas)
  if (clickedStroke) {
    selectedStroke.value = clickedStroke.id
    return
  }
  selectedStroke.value = null
  initDrawing(e, canvas)
}

const getStrokeAtPoint = (
  e: PointerEvent,
  canvas: HTMLCanvasElement
) => {
  const point = getPointsXY(e, canvas)
  for (const stroke of strokes.value) {
    for (const p of stroke.points) {
      const dx = point.x - p.x
      const dy = point.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 0.02) {
        return stroke
      }
    }
  }
  return null
}

const deleteSelectedStroke = () => {
  if (selectedStroke.value === null) return
  strokes.value = strokes.value.filter(
    s => s.id !== selectedStroke.value
  )
  selectedStroke.value = null
  renderCanvas()
}

const initDrawing = (e: PointerEvent, canvas: HTMLCanvasElement | null) => {
  if (!canvas || !ctx || canvasMode.value != 'maker') return
  interactionMode.value = 'draw'
  drawing.value = true
  currentStroke = {
    id: Date.now(),
    tool: tool.value,
    color: color.value,
    width: size.value,
    points: [getPointsXY(e, canvas)]
  }
  const move = (ev: PointerEvent) => {
    drawMovements(ev, canvas)
  }
  const up = () => {
    stopDrawing(canvas, move, up)
  }
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
}
const drawMovements = (e: PointerEvent, canvas: HTMLCanvasElement) => {
  if (!drawing.value || !currentStroke) return
  currentStroke.points.push(getPointsXY(e, canvas))
  renderCanvas(canvas)
}
  const stopDrawing = (canvas: HTMLCanvasElement, move: (e: PointerEvent) => void, up: () => void) => {
    drawing.value = false
    if (currentStroke && currentStroke.points.length >= 5) {
      console.log(currentStroke)
      strokes.value.push(currentStroke)
    }
    currentStroke = null
    interactionMode.value = 'select'
    canvas.removeEventListener('pointermove', move)
    canvas.removeEventListener('pointerup', up)
    renderCanvas(canvas)
  }
  const renderCanvas = (canvas?: HTMLCanvasElement) => {
    const c = canvas ?? canvasEl.value
    if (!ctx || !c) return
    ctx.clearRect(0, 0, c.width, c.height)
    for (const s of strokes.value) {
      drawStroke(s, c)
    }
    if (currentStroke) {
      drawStroke(currentStroke, c)
    }
  }
  const drawStroke = (stroke: Stroke, canvas: HTMLCanvasElement) => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    ctx!.save()
    ctx!.strokeStyle = stroke.color
    ctx!.lineJoin = 'round'
    ctx!.lineCap = 'round'
    
    ctx!.lineWidth = canvasMode.value === 'small' ? stroke.width - 3 : stroke.width

    if (stroke.tool === 'chalk') { 
      ctx!.globalAlpha = 0.8
      ctx!.lineWidth = canvasMode.value === 'small' ? stroke.width - 3 : stroke.width + 2
    }
    if (stroke.tool === 'dash') {
      if (canvasMode.value === 'small') {
        ctx!.setLineDash([11, 10])
      } else {
        ctx!.setLineDash([15, 20])
      }
    }
    
    if (stroke.id === hoveredStrokeId.value) {
      ctx!.shadowBlur = 10
      ctx!.shadowColor = 'white'
    }
    if (selectedStroke.value === stroke.id) {
      ctx!.shadowColor = 'red'
    }
    const first = stroke.points[0]
    if (!first) return

    ctx!.beginPath()
    ctx!.moveTo(first.x * w, first.y * h)

    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i]
      if (!p) return
      ctx!.lineTo(p.x * w, p.y * h)
    }

    ctx!.stroke()
    ctx!.restore()
  }
  
  const setupCanvas = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return
  canvasEl.value = canvas // 👈 ADD THIS
  ctx = canvas.getContext('2d')
  if (!ctx) return
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  renderCanvas(canvas)
  }
  const loadStrokes = (newStrokes: Stroke[]) => {
    strokes.value = newStrokes
  }
  const hoveredStrokeId = ref<number | null>(null)
  const handleHover = (e: PointerEvent, canvas?: HTMLCanvasElement) => {
    const c = canvas ?? canvasEl.value
    if (!c) return
    const point = getPointsXY(e, c)
    hoveredStrokeId.value = null
    for (const stroke of strokes.value) {
      for (const p of stroke.points) {
        const dx = point.x - p.x
        const dy = point.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 0.05) {
          hoveredStrokeId.value = stroke.id
          renderCanvas(c)
          return
        }
      }
    }
    renderCanvas(c)
  }

const selectedStroke = ref<number | null>(null)
const selectedStrokeBounds = computed(() => {
  if (!canvasEl || canvasMode.value != 'maker') return null
  const stroke = strokes.value.find(
    s => s.id === selectedStroke.value
  )
  if (!stroke) return null
  const xs = stroke.points.map(
    p => p.x * canvasEl.value!.clientWidth
  )
  const ys = stroke.points.map(
    p => p.y * canvasEl.value!.clientHeight
  )
  return {
    left: Math.min(...xs),
    top: Math.min(...ys),
    right: Math.max(...xs),
    bottom: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  }
})
const selectStroke = (e: PointerEvent, canvas: HTMLCanvasElement | null) => {
  const c = canvas ?? canvasEl.value
  if (!c) return
  const point = getPointsXY(e, c)
  for (const stroke of strokes.value) {
    for (const p of stroke.points) {
      const dx = point.x - p.x
      const dy = point.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 0.05) {
        selectedStroke.value = stroke.id
        return
      }
    }
  }
}

const resizeCanvas = (canvas?: HTMLCanvasElement) => {
  const c = canvas ?? canvasEl.value
  if (!c) return
  const rect = c.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  c.width = rect.width * dpr
  c.height = rect.height * dpr
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  renderCanvas(c)
}
  return {
    interactionMode,
    selectedStrokeBounds,
    selectedStroke,
    strokes,
    tool,
    color,
    size,
    canvasMode,
    setColor,
    setTool,
    initDrawing,
    renderCanvas,
    setupCanvas,
    loadStrokes,
    clear,
    handleHover,
    handleClick,
    resizeCanvas,
    selectStroke,
    stopDrawing,
    deleteSelectedStroke
  }
}