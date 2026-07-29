<script setup lang="ts">
import PlayCanvas from '@/components/PlayCanvas.vue'
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

<template>
  <div 
    v-if="show"
    class="modal-backdrop"
    @click.self="close"
  >
    <div class="modal-container">
      <button class="close" @click="close">
        ✕
      </button>
<PlayCanvas
        makerMode="small"
        :strokesData="selectedPlay.grid.strokes"
        :color="selectedColor"
        :tool="selectedTool"
      />
      <!-- Whatever you put inside the modal -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  width: 80vw;
  height: 80vh;
  background: white;
  border-radius: 10px;
  position: relative;
  padding: 20px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>