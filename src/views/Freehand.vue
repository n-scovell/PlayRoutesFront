<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/Icons/index.vue'
/* -----------------------------
   UI STATE
------------------------------*/
const tool = ref('chalk') // 'pen' | 'chalk'
const parentRef = ref(null)
const canvasRef = ref(null)
const isFullscreen = ref(false)

/* -----------------------------
   DRAWING STATE
------------------------------*/
const state = {
  strokes: [],
  last: []
}

const backRedo = (prop) => {
  if (prop === 'back') {
    state.last.push(state.strokes[state.strokes.length - 1])
    state.strokes.pop()
  } else {
    state.strokes.push(state.last[state.last.length - 1])
    state.last.pop()
  }
  resizeCanvas()
}

// const deleteLast = () => {
//   state.last.push(state.strokes[state.strokes.length - 1])
//   state.strokes.pop()
//   resizeCanvas()
// }
// const redoLast = () => {
//   state.strokes.push(state.last[state.last.length - 1])
//   state.last.pop()
//   resizeCanvas()
// }

let currentStroke = null
let drawing = false

/* -----------------------------
   CANVAS CONTEXT
------------------------------*/
let ctx = null
let resizeObserver = null

/* -----------------------------
   TOOL SELECT
------------------------------*/
const setTool = (t) => {
  tool.value = t
}

/* -----------------------------
   NORMALIZED COORDINATES
------------------------------*/
const getPoint = (e) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) / rect.width,
    y: (e.clientY - rect.top) / rect.height
  }
}

const myColor = ref('#fff')

/* -----------------------------
   POINTER INPUT
------------------------------*/
const startDraw = (e) => {
  drawing = true
  currentStroke = {
    id: Date.now(),
    tool: tool.value,
    color: myColor.value,
    width: tool.value === 'chalk' ? 5 : 3,
    points: [getPoint(e)]
  }
  render()
}

const draw = (e) => {
  if (!drawing) return
  currentStroke.points.push(getPoint(e))
  render()
}

const stopDraw = () => {
  if (!drawing) return
  drawing = false
  state.strokes.push(currentStroke)
  currentStroke = null
  render()
}

/* -----------------------------
   RENDER ENGINE
------------------------------*/
const render = () => {
  if (!ctx) return
  const canvas = canvasRef.value
  const parent = parentRef.value
  const w = parent.clientWidth
  const h = parent.clientHeight
  ctx.clearRect(0, 0, w, h)
  state.strokes.forEach(drawStroke)
  if (currentStroke) drawStroke(currentStroke)
}

/* -----------------------------
   NORMAL PEN
------------------------------*/
const drawPenStroke = (stroke) => {
  const canvas = canvasRef.value
  const parent = parentRef.value
  const w = parent.clientWidth
  const h = parent.clientHeight
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const start = stroke.points[0]
  ctx.moveTo(start.x * w, start.y * h)
  for (let i = 1; i < stroke.points.length; i++) {
    const p = stroke.points[i]
    ctx.lineTo(p.x * w, p.y * h)
  }
  ctx.stroke()
}

/* -----------------------------
   CHALK EFFECT
------------------------------*/
const drawChalkStroke = (stroke) => {
  const canvas = canvasRef.value
  const parent = parentRef.value
  const w = parent.clientWidth
  const h = parent.clientHeight
  const jitter = .9
  const passes = 2
  for (let p = 0; p < passes; p++) {
    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width + Math.random() * 2
    ctx.globalAlpha = 0.66 + Math.random() * 0.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const start = stroke.points[0]
    ctx.moveTo(
      start.x * w + (Math.random() - 0.5) * jitter,
      start.y * h + (Math.random() - 0.5) * jitter
    )
    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i]
      ctx.lineTo(
        p.x * w + (Math.random() - 0.5) * jitter,
        p.y * h + (Math.random() - 0.5) * jitter
      )
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

// DRAW BRUSH
const drawBrushStroke = (stroke) => {
  const parent = parentRef.value
  const w = parent.clientWidth
  const h = parent.clientHeight
  const passes = 1
  for (let i = 0; i < passes; i++) {
    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width + Math.random() * 1.5
    ctx.globalAlpha = 0.25
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const start = stroke.points[0]
    ctx.moveTo(start.x * w, start.y * h)
    for (let j = 1; j < stroke.points.length; j++) {
      const p = stroke.points[j]
      ctx.lineTo(
        p.x * w + (Math.random() - 0.5) * 0.3,
        p.y * h + (Math.random() - 0.5) * 0.3
      )
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

/* -----------------------------
   DISPATCHER
------------------------------*/
const drawStroke = (stroke) => {
  if (stroke.points.length < 2) return
  if (stroke.tool === 'chalk') {
    drawChalkStroke(stroke)
  } else if (stroke.tool === 'brush') {
    drawBrushStroke(stroke)
  } else {
    drawPenStroke(stroke)
  }
}

/* -----------------------------
   RESIZE ENGINE
------------------------------*/
const resizeCanvas = () => {
  const parent = parentRef.value
  const canvas = canvasRef.value
  if (!parent || !canvas) return
  const ratio = window.devicePixelRatio || 1
  const width = parent.clientWidth
  const height = parent.clientHeight
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  if (!ctx) ctx = canvas.getContext('2d')
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(ratio, ratio)
  render()
}

/* -----------------------------
   CLEAR
------------------------------*/
const clearCanvas = () => {
  state.strokes = []
  currentStroke = null
  drawing = false
  render()
}


/* -----------------------------
   FULLSCREEN
------------------------------*/
const goFullScreen = async () => {
  const el = parentRef.value
  if (!document.fullscreenElement) {
    await el.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
  // optional safety resize
  resizeCanvas()
}

/* -----------------------------
   LIFECYCLE
------------------------------*/
onMounted(() => {
  resizeCanvas()
  resizeObserver = new ResizeObserver(() => {
    resizeCanvas()
  })
  resizeObserver.observe(parentRef.value)
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener(
    'fullscreenchange',
    handleFullscreenChange
  )
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener(
    'resize',
    resizeCanvas
  )
  document.removeEventListener(
    'fullscreenchange',
    handleFullscreenChange
  )
})

const myGrid = ref([
  {players: [
    {position:'WR', standY:'Line', standX:'Center', route:'', motion:''}, 
  ] },
  {players: [] },
  {players: [
    {position:'T', standY:'Line', standX:'Right', route:'', motion:''}, 
  ] },
  {players: [
    {position:'QB', standY:'Under', standX:'Center', route:'', motion:''},
    {position:'FB', standY:'Shotgun', standX:'Center', route:'', motion:''},
    {position:'RB', standY:'Deep', standX:'Center', route:'', motion:''},
    {position:'C', standY:'Line', standX:'Center', route:'', motion:''}, 
    {position:'G', standY:'Line', standX:'Right', route:'', motion:''}, 
    {position:'G', standY:'Line', standX:'Left', route:'', motion:''},  
  ] },
  {players: [
    {position:'TE', standY:'Slight', standX:'Center', route:'', motion:''}, 
    {position:'T', standY:'Line', standX:'Left', route:'', motion:''}, 
  ] },
  {players: [] },
  {players: [
    {position:'WR', standY:'Line', standX:'Center', route:'', motion:''}, 
  ] },
])

const showPen = ref(false)
const showColors = ref(false)
const showPenTools = () => { 
  showPen.value = !showPen.value 
  showColors.value = false
}
const showColorTools = () => { 
  showColors.value = !showColors.value 
  showPen.value = false
}
</script>

<template>
  <main class="freehand">
    <h1>THIS IS WORKING</h1>
    <div ref="parentRef" class="board">
      <div class="toolbar" :class="{full: isFullscreen === true}">
        
        
        <button @click="showPenTools"><Icon src="pen" /></button>
        <div class="dropTools" v-if="showPen">
          <button @click="tool = 'pen'" :class="{active: tool === 'pen'}"><Icon src="thin" /></button>
          <button @click="tool = 'chalk'" :class="{active: tool === 'chalk'}"><Icon src="thick" /></button>
          <button @click="tool = 'brush'" :class="{active: tool === 'brush'}"><Icon src="faint" /></button>
        </div>
        <button @click="showColorTools"><Icon src="colors" /></button>
        <div class="dropTools" v-if="showColors">
          <button @click="myColor = 'white'" :class="{active: myColor === 'white'}">White</button>
          <button @click="myColor = 'red'" :class="{active: myColor === 'red'}">Red</button>
          <button @click="myColor = 'blue'" :class="{active: myColor === 'blue'}">Blue</button>
          <button @click="myColor = 'yellow'" :class="{active: myColor === 'yellow'}">yellow</button>
        </div>
        <button @click="backRedo('back')"><Icon src="last" /></button>
        <button @click="backRedo('redo')"><Icon src="redo" /></button>
        <button @click="clearCanvas">
          <Icon src="clear" />
        </button>
        <button @click="goFullScreen">
          <!-- {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }} -->
          <Icon src="fullscreen" />
        </button>
        
      </div>
      
      <hr />
      <div class="yardMarker"></div>
      <div class="yardMarker long"></div>
      <canvas
        ref="canvasRef"
        class="canvas"
        @pointerdown.prevent="startDraw"
        @pointermove.prevent="draw"
        @pointerup="stopDraw"
        @pointercancel="stopDraw"
        />
      <div class="gridCont">
        <div class="grids" v-for="g in myGrid" :key="`${g}grid`">
          <div class="player" v-for="p in g.players" 
          :class="[
          p.position,
          `Y_${p.standY}`,
          `X_${p.standX}`,
          {full: isFullscreen === true}
          ]"
          :key="`${p}player`"
          >{{ p.position }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>