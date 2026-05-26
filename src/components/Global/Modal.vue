<script setup lang="ts">
import { ref, nextTick } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps<{
  show: boolean
  title: string,
  formation: string,
  playType: string
}>()

// const props = defineProps({
//   show: {
//     type: Boolean,
//     required: true
//   },
//   title: {
//     type: String,
//     default: 'Modal Title'
//   },
// })
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
} 
const hideDisplays = ref<boolean>(false)
const captureArea = ref<HTMLElement | null>(null)
const saveScreenshot = async (playName: string, form: string, type: string) => {
    hideDisplays.value = false
    if (!captureArea.value) return
    const canvas = await html2canvas(captureArea.value, {scale: 3})
    canvas.toBlob((blob) => {
        if (!blob) return
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = playName.replaceAll(' ','') + '_' + form + '_' + type + '.png'
        link.click()
    })
}

const printPlay = async () => {
  if (!captureArea.value) return
  await nextTick()
  const canvas = await html2canvas(captureArea.value, {
      scale: 1,
      backgroundColor: '#000000'
  })
  const image = canvas.toDataURL('image/png')
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  printWindow.document.write(`
      <html>
          <head>
              <title>Print Play</title>
              <style>
                  body { margin:20px; display:flex; justify-content:center; align-items:center; }
                  img { width:100%; max-width:1000px; }
              </style>
          </head>
          <body>
              <img src="${image}" />
              <script>
                  window.onload = () => {
                      window.print()
                      window.onafterprint = () => window.close()
                  }
              <\/script>
          </body>
      </html>
  `)
  printWindow.document.close()
}
const printMode = ref<boolean>(false)
const setMode = () => {
  printMode.value = !printMode.value
}
</script>
<template>
  <Teleport to="body">
    <div v-if="show" class="modal-selected-play" @click.self="closeModal">
      <!-- <button class="doit" @pointerdown="saveScreenshot(props.title, props.formation, props.playType)">DOWNLOAD</button> -->
      <!-- <button class="doit b" @pointerdown="printPlay">PRINT</button> -->
      <button class="close-play" @click="closeModal">✕</button>
      <div class="play-content" @click.stop ref="captureArea" >
        <slot>
        </slot>
      </div>
    </div>
  </Teleport>
</template>