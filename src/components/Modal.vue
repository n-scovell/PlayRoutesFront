<script setup lang="ts">
import { ref } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import PlayCanvas from '@/components/PlayCanvas.vue'
import type { ColorType, ToolType, Stroke } from '@/composables/usePlayCanvasB'

const playsStore = usePlayStore()
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
    <div class="mdlCont" >
        <button class="mdlClose" @click="close">✕</button>
        <button class="flipBt" @click="flipPlay()">FLIP</button>
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
                makerMode="small"
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
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,.5);
    backdrop-filter: blur(2px);
    z-index:9999;
    inset: 0;
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
            z-index:3;
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
        .flipBt {
            position:absolute;
            bottom:0px;
            right:0px;
            background:white;
            padding:10px 20px;
            color:black;
            z-index:999999;
        }
        .mdlClose {
            position:absolute;
            top:20px;
            right:20px;
            padding:10px;
            width:50px;
            height:50px;
            border-radius:50%;
            background:rgb(219, 218, 218,.5);
            backdrop-filter: blur(2px);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:20px;
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
@media only screen and (max-width: 500px) {
    .mdlBack .mdlCont {
        top:50%;
        left:0px;
        transform:translate(0%, -50%);
        width:100vw;
        height:100%;
        max-height:200px;
    }
    .mdlBack .mdlCont .addedPlayers .player {
        color:transparent;
        width:20px;
        height:20px;
        color:transparent;
    }
}


</style>
