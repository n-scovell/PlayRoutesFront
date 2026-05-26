import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { CSSProperties } from 'vue'

//TYPES
export const TOOL_TYPES = [ 'pen', 'chalk', 'dash', 'marker' ] as const
export type ToolType = typeof TOOL_TYPES[number]
export const COLOR_TYPES = [ 'red', 'blue', 'yellow', 'white' ] as const
export type ColorType = typeof COLOR_TYPES[number]

export const MODE_TYPES = [ 'draw', 'select', 'move', null ] as const
export type DragType = typeof MODE_TYPES[number]

// STROKE INTERFACE
export type MyEvent = PointerEvent
export interface Point { x: number, y: number }
export interface Stroke {
  id: number
  tool: ToolType
  color: ColorType
  width: number
  points: Point[]
}

export function usePlayCanvas() {
  //Object refs for the canvas and its parent
  const parentRef = ref<HTMLElement | null>(null)
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const strokes = ref<Stroke[]>([]) // array of every stroke made

  const tool = ref<ToolType>('pen') // pen collection
  const color = ref<ColorType>('white') // color collection

  const size = ref(5)
  const drawing = ref(false) // is drawing happening

  let currentStroke: Stroke | null = null // strokes payload
  let ctx: CanvasRenderingContext2D | null = null

  // FUNCTIONS
  // ON TOUCH BUTTON FUNCTIONS
  const setTool = (value: ToolType) => { 
    tool.value = value 
  }
  const setColor = (cool: ColorType) => { 
    color.value = cool 
  }
  const clearCanvas = () => {
    strokes.value = []
    renderCanvas()
  }
  // ORDER OF OPERATION - initDrawing > drawMovements > getPointsXY > renderCanvas > drawSingleStroke > stopDrawingStroke
  const initDrawing = (e: MyEvent) => { // PointerEvent || MouseEvent
    const canvas = canvasRef.value
    if (!canvas) return
    if (mode.value === 'move') return
    drawing.value = true
    currentStroke = {
      id: Date.now(),
      tool: tool.value,
      color: color.value,
      width: size.value,
      points: [getPointsXY(e)]
    }
    canvas.addEventListener('pointermove', drawMovements) // pointermove, pointerup
    canvas.addEventListener('pointerup', stopDrawingStroke) // pointerup
  }
  // FIRES WHEN YOU initDrawing and move the mouse/pointer
  const drawMovements = (e: MyEvent) => { // PointerEvent || MouseEvent
    if (!drawing.value || !currentStroke) return
    currentStroke.points.push(getPointsXY(e))
    renderCanvas()
  }
const getPointsXY = (e: PointerEvent): Point => {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()

  return {
    x: (e.clientX - rect.left) / rect.width,
    y: (e.clientY - rect.top) / rect.height
  }
}
  // FIRES AT EVERY MOVEMENT OF THE mouse/pointer
  const renderCanvas = () => {
    const canvas = canvasRef.value
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokes.value.forEach(drawSingleStroke)
    if (currentStroke) {
      drawSingleStroke(currentStroke)
    }
  }
  // FIRES FOR EVERY STROKE
  const drawSingleStroke = (stroke: Stroke) => {
    if (!ctx || !canvasRef.value) return
    const canvas = canvasRef.value
    const scale = 1
    ctx.save()
    ctx.strokeStyle = stroke.color
    ctx.lineJoin = 'round' // round bevel miter
    ctx.lineCap = 'round' // butt round 
    if (selectedStrokeIds.value.includes(stroke.id)) {
      ctx.shadowColor = 'cyan'
      ctx.shadowBlur = 10
    }
    if (stroke.id === hoveredStrokeId.value) {
      ctx.shadowColor = '#00e5ff'
      ctx.shadowBlur = 12
    }
    // Personalized stroke styles 
    switch (stroke.tool) {
      case 'pen':
        ctx.globalAlpha = 1
        ctx.lineWidth = 5 * scale
      break
      case 'chalk':
        ctx.globalAlpha = .8
        ctx.lineWidth = 8 * scale
        ctx.setLineDash([])
      break
      case 'dash':
        ctx.globalAlpha = 1
        ctx.lineWidth = 6 * scale
        ctx.setLineDash([20 * scale, 15 * scale])
      break
      case 'marker':
        ctx.globalAlpha = 1
        ctx.strokeStyle = 'orange'
        ctx.lineWidth = 9 * scale
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
      const p = stroke.points[i]
      if (!p) return
      ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
    ctx.restore()
  }
  // Fires after pointer/mouse is up - pushes completed stroke into strokes and clears currentStroke then rendersCanvas again
  const stopDrawingStroke = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    drawing.value = false
    if (currentStroke) {
      strokes.value.push(currentStroke)
    }
    currentStroke = null
    canvas.removeEventListener('pointermove', drawMovements)
    canvas.removeEventListener('pointerup', stopDrawingStroke)
    renderCanvas()
  }
  // ORDER OF OPERATION - resizeCanvas > redrawCanvas
  const resizeCanvas = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintCanvas()
  }
  // Fires and redraws every stroke on canvas resize
  const paintCanvas = () => {
    if (!ctx || !canvasRef.value) return
    const canvas = canvasRef.value
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokes.value.forEach(stroke => {
      drawSingleStroke(stroke)
    })
  }
  ///////////////////////////////////////////////////////


  // SELECT STROKE PROCESS - SSP
  const dragging = ref(false)
  let lastPoint: Point | null = null
  const mode = ref<DragType>('draw')
  const selectedStrokeIds = ref<number[]>([])
  const hoveredStrokeId = ref<number | null>(null)
  const isSelected = (id: number) => selectedStrokeIds.value.includes(id)
  // FUNCTIONS
  const hitTestStroke = (stroke: Stroke, x: number, y: number) => {
    const canvas = canvasRef.value
    if (!canvas) return false
    const threshold = 10 // sensitivity
    for (let i = 1; i < stroke.points.length; i++) {
      const p1 = stroke.points[i - 1]
      const p2 = stroke.points[i]
      // simple distance-to-segment check
      if (!p2 || !p1) return
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const lengthSq = dx * dx + dy * dy
      if (lengthSq === 0) continue
      let t = ((x - p1.x) * dx + (y - p1.y) * dy) / lengthSq
      t = Math.max(0, Math.min(1, t))
      const projX = p1.x + t * dx
      const projY = p1.y + t * dy
      const dist = Math.hypot(projX - x, projY - y)
      if (dist < threshold) return true
    }
    return false
  }
  


const deleteButtonStyle = computed<CSSProperties>(() => {
  const selectedId = selectedStrokeIds.value[0]
  if (selectedId === undefined || !canvasRef.value) {
    return { display: 'none' }
  }
  const stroke = strokes.value.find(
    s => s.id === selectedId
  )
  if (!stroke) {
    return { display: 'none' }
  }
  const bounds = getStrokeBounds(stroke)
  return {
    position: 'absolute',
    left: `${bounds.maxX + 5}px`,
    top: `${bounds.minY + 5}px`,
    zIndex: 50
  }
})
const deleteSelectedStroke = () => {
  if (!selectedStrokeIds.value.length) return
  strokes.value = strokes.value.filter(s => !selectedStrokeIds.value.includes(s.id))
  selectedStrokeIds.value = []
  renderCanvas()
}
const setSelectedStrokeColor = (color: ColorType) => {
  for (const id of selectedStrokeIds.value) {
    const stroke = strokes.value.find(s => s.id === id)
    if (!stroke) continue
    stroke.color = color
  }
  renderCanvas()
}
  const getStrokeBounds = (stroke: Stroke) => {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const p of stroke.points) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }
    return { minX, minY, maxX, maxY }
  }
  const getHoveredStroke = (p: Point): number | null => {
    for (let i = strokes.value.length - 1; i >= 0; i--) {
      const stroke = strokes.value[i]
      if (!stroke) continue
      if (hitTestStroke(stroke, p.x, p.y)) {
        return stroke.id
      }
    }
    return null
  }
  const handleLeave = () => {
    hoveredStrokeId.value = null
    renderCanvas()
  }
  const handleHover = (e: MyEvent) => {
  const p = getPointsXY(e)
  if (mode.value === 'move' && dragging.value && lastPoint) {
    const dx = p.x - lastPoint.x
    const dy = p.y - lastPoint.y
    for (const id of selectedStrokeIds.value) {
      const stroke = strokes.value.find(s => s.id === id)
      if (!stroke) continue
      for (const pt of stroke.points) {
        pt.x += dx
        pt.y += dy
      }
    }
    lastPoint = p
    renderCanvas()
    return
  }

  // ========================
  // NORMAL HOVER
  // ========================
  const id = getHoveredStroke(p)
  hoveredStrokeId.value = id
  if (canvasRef.value) {
    canvasRef.value.style.cursor =
      id !== null
        ? 'pointer'
        : 'crosshair'
  }
  renderCanvas()
}

const handleClick = (e: MyEvent) => {
  const p = getPointsXY(e)
  // MOVE MODE
  if (mode.value === 'move') {
    if (!selectedStrokeIds.value.length)
      return
    dragging.value = true
    lastPoint = p
    return
  }
  // SELECT MODE
  const id = getHoveredStroke(p)
  selectedStrokeIds.value =
    id !== null ? [id] : []
  renderCanvas()
}
const stopDrag = () => {
  dragging.value = false
  lastPoint = null
  if (mode.value === 'move') {
    mode.value = 'draw'
  }
}
const enableMoveMode = () => {
  if (!selectedStrokeIds.value.length) return
  mode.value = 'move'
}

const moveButtonStyle = computed<CSSProperties>(() => {
  const selectedId = selectedStrokeIds.value[0]

  if (selectedId === undefined || !canvasRef.value) {
    return { display: 'none' }
  }

  const stroke = strokes.value.find(
    s => s.id === selectedId
  )

  if (!stroke) {
    return { display: 'none' }
  }

  const bounds = getStrokeBounds(stroke)

  return {
    position: 'absolute',
    left: `${bounds.maxX + 55}px`,
    top: `${bounds.minY - 10}px`,
    zIndex: 50
  }
})
  // LIFECYCLES
  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    resizeCanvas()
    canvas.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('pointermove', handleHover)
    canvas.addEventListener('pointerdown', handleClick)
    // canvas.addEventListener('pointerup', stopDrag)
    canvas.addEventListener('pointerleave', handleLeave)
  })
  onUnmounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    canvas.removeEventListener('resize', resizeCanvas)
    canvas.removeEventListener('pointermove', drawMovements)
    canvas.removeEventListener('pointerup', stopDrawingStroke)
    canvas.removeEventListener('pointermove', handleHover)
  })

  return {
    mode,
    parentRef,
    canvasRef,
    strokes,
    tool,
    color,
    size,
    selectedStrokeIds,
    deleteButtonStyle,
    moveButtonStyle,
    setSelectedStrokeColor,
    enableMoveMode,
    deleteSelectedStroke,
    setTool,
    setColor,
    clearCanvas,
    initDrawing,
    resizeCanvas,
  }
}