<script setup lang="ts">
import { ref } from 'vue'
import { useGuest } from '@/stores/guestStore' 
import PlayCanvas from '@/components/PlayCanvas.vue'
import type { ColorType, ToolType, Stroke } from '@/composables/usePlayCanvasB'
import html2canvas from 'html2canvas' 

const gst = useGuest();
const captureTarget = ref<HTMLElement | null>(null)
const previewUrl = ref<string | null>(null)
const isCapturing = ref(false)


async function captureDownload(title?: string): Promise<void> {
  if (!captureTarget.value) {
    console.warn('Capture target not found')
    return
  }
  isCapturing.value = true
  try {
    const canvas: HTMLCanvasElement = await html2canvas(captureTarget.value, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff', // or null for transparent
      scale: 2,                   // higher quality
      logging: false
    })
    // Convert to data URL
    const dataUrl: string = canvas.toDataURL('image/png')
    // Show preview
    previewUrl.value = dataUrl
    // Trigger download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${title}.png`
    link.click()
  } catch (error) {
    console.error('Capture failed:', error)
  } finally {
    isCapturing.value = false
  }
}
const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')
type Pos = {
    x: number,
    y: number,
    id: string | number,
    pos: string
}

type Grid = {
  players: Pos[]
  strokes: Stroke[]
}
interface Play {
  id: string
  title: string
  formation: string
  playType: string
  grid: Grid
}

defineProps<{
  show: boolean
  foo?: Play
}>()

const flipChoice = ref<boolean>(false)
const flipPlay = () => {
    flipChoice.value = !flipChoice.value
}
const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
    flipChoice.value = false
    emit('close')
}
</script>
<template>
    <div v-if="show" class="mdlBack" @click.self="close">
        <div class="mdlCont" ref="captureTarget">
            <button  aria-label="Close Modal" class="mdlClose" @click="close">✕</button>
            <div class="btCont" v-if="!gst.guest"">
                <button  aria-label="Download Play" @click="captureDownload(foo?.title)" :disabled="isCapturing">PRINT</button>
                <button  aria-label="Flip Play" @click="flipPlay()">FLIP</button>
            </div>
            <div class="addedPlayers" :class="{flip: flipChoice}">
                <div
                    v-for="player in foo?.grid.players"
                    :key="player.id"
                    class="player"
                    :style="{
                    left: `${player.x * 100}%`,
                    top: `${player.y * 100}%`
                    }"
                >
                    {{ player.pos }}
                </div>
            </div>
            <div class="lineOfScrimmage" />
            <div class="canvasCont" :class="{flip: flipChoice}">
                <PlayCanvas
                    makerMode="cool"
                    class="canvas"
                    :strokesData="foo?.grid.strokes"
                    :color="selectedColor" :tool="selectedTool"
                />
            </div>
            <div class="field"></div>
    </div>
  </div>
</template>

<style lang="scss">
.mdlBack {
    position:fixed;
    top:-500px;
    left:-100px;
    
    width:1500px;
    height:50px;
    overflow:hidden;
    background:rgba(0,0,0,.5);
    background:blue;
    backdrop-filter: blur(2px);
    z-index:555;
    inset: 0;
    .preview {
        position:absolute;
        top:0px;
        left:0px;
        width:400px;
        background:red;
        z-index:9999;
        display:none;
        img {
            width:100%;
        }
    }
    .mdlCont {
        width:85vw;
        height:85vh;
        background:white;
        position:absolute;
        top:5%;
        left:50%;
        transform:translate(-50%,0%);
        border:4px solid rgba(255,255,255,.3);
        .field {
            position:absolute;
            top:0px;
            left:0px;
            width:100%;
            height:100%;
            background:green;
            background-image:url('@/assets/images/bck_chalkboard.jpg');
            background-size:cover;
            background-repeat:no-repeat;
            z-index:0;
        }
        .lineOfScrimmage {
            position:absolute;
            top:65%;
            width:100%;
            height:10px;
            background-image:url('@/assets/maker/line.png');
            background-size:contain;
            background-position:center -5px;
            background-repeat:repeat-x;
            z-index:2;
        }
        .canvasCont {
            position:absolute;
            top:0px;
            left:0px;
            width:100%;
            height:100%;
            z-index:2;
             &.flip {
                transform: scaleX(-1);
                top:-5px;
                left:5px;
            }
            canvas {
                width:100%;
                height:100%;
            }
        }
        .addedPlayers {
            position:absolute;
            top:0px;
            left:0px;
            width:100%;
            height:100%;
            z-index:3;
            &.flip {
                transform: scaleX(-1);
                top:-20px;
                left:25px;
                .player {
                    transform: scaleX(-1);
                }
            }
            .player {
                $w: 38px;
                width:$w;
                height:$w;
                display:flex;
                align-items:center;
                justify-content:center;
                position:absolute;
                transform:translate(-50%,-50%);
                font-size:20px;
                text-transform:uppercase;
                font-family:"Racing Sans One", sans-serif;
                background:white;
                border-radius:50%;
                border:2px solid gray;
                margin:3px;
            }
        }
        .btCont {
            position:absolute;
            bottom:0px;
            right:0px;
            display:flex;
            flex-direction:row;
            flex-wrap: nowrap;
            gap:5px;
            z-index:999999;
            button {
                background:white;
                padding:5px 10px;
                font-family:"Inter", sans-serif;
                font-size:13px;
                font-weight:bold;
                color:black;
            }
        }
        .mdlClose {
            position:absolute;
            top:0px;
            right:-1px;
            padding:5px;
            width:40px;
            height:40px;
            background:rgb(255,255,255,1);
            backdrop-filter: blur(2px);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:20px;
            color:black;
            font-weight:bold;
            z-index:999999;
        }
    }
}
@media only screen and (max-width: 900px) {
    .mdlBack .mdlCont .addedPlayers .player {
        color:transparent;
        width:20px;
        height:20px;
        color:transparent;
    }
}
@media only screen and (max-width: 728px) {
    .mdlBack .mdlCont {
        top:50%;
        left:0px;
        transform:translate(0%, -50%);
        width:100vw;
        height:100%;
        max-height:350px;
    }
    .mdlBack .mdlCont .addedPlayers .player {
        color:transparent;
        width:20px;
        height:20px;
        color:transparent;
    }
}


</style>
