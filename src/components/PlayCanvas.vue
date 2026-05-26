<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { usePlayCanvas } from '@/composables/usePlayCanvasB'
import type { Stroke, ColorType, ToolType } from '@/composables/usePlayCanvasB'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = defineProps<{
  makerMode: string
  class: string
  strokesData?: Stroke[]
  color: ColorType
  tool: ToolType
}>()

const emit = defineEmits<{
  (e: 'update:strokes', value: Stroke[]): void
}>()

const {
  canvasMode,
  interactionMode,
  handleClick,
  selectedStrokeBounds,
  strokes,
  selectedStroke,
  initDrawing,
  loadStrokes,
  setColor,
  setTool,
  setupCanvas,
  clear,
  handleHover,
  resizeCanvas,
  selectStroke,
  stopDrawing,
  deleteSelectedStroke
  
} = usePlayCanvas()

watch(strokes, (newVal) => {
  emit('update:strokes', newVal)
}, { deep: true })


watch(canvasRef, (canvas) => { if (canvas) setupCanvas(canvas)}, { immediate: true })
watch(() => props.color, setColor, { immediate: true })
watch(() => props.tool, setTool, { immediate: true })
watch(() => props.strokesData, (newVal) => {
if (!newVal) return
loadStrokes(newVal)
}, { deep: true, immediate: true })

const clearMe = () => {
  clear()
}
defineExpose({ clearMe })

const hoverCanvas = (e: PointerEvent) => {
  handleHover(e, canvasRef.value!)
}
const resizeMe = () => {
  resizeCanvas(canvasRef.value!)
}
const clickDown = (e: PointerEvent) => {
  handleClick(e, canvasRef.value)
}
const deleteMe = () => {
  deleteSelectedStroke()
}

watch(canvasRef, (canvas) => {
  if (!canvas) return
  canvas.addEventListener('pointermove', hoverCanvas)
  canvas.addEventListener('pointerdown', clickDown)
  // canvas.addEventListener('pointerdown', clickMe)
}, { immediate: true })

onMounted(() => {
  canvasMode.value = props.makerMode
  window.addEventListener('resize', resizeMe)
})


</script>

<template>
  <!-- <p style="position:absolute;top:0px;left:0px;font-size:30px; color:white">{{ canvasMode }}</p> -->
  <div class="coolness" v-if="selectedStrokeBounds"
  :style="{
    width: `${selectedStrokeBounds.width + 20}px`,
    height: `${selectedStrokeBounds.height + 20}px`,
    left: `${selectedStrokeBounds.left - 10}px`,
    top: `${selectedStrokeBounds.top - 10}px`
  }"
  >
  <button @pointerdown="deleteMe">X</button>
  </div>
  <canvas
  ref="canvasRef"
  :class="props.class"
  />
</template>

<style lang="scss">

.coolness {
  position:absolute;
  left:100px;
  top:100px;
  outline:3px dashed rgb(207, 24, 24);
  width:20px;
  height:20px;
  z-index: 999999;
  -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
  button {
    position:absolute;
    top:-2px;
    left:100%;
    padding:10px 15px;
    font-size:20px;
    font-weight:bold;
    background:rgb(207, 24, 24);
    color:white;
    cursor:pointer;
  }
}
</style>