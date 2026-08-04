<script setup lang="ts">
import { ref } from 'vue'
import { useFavorites } from '@/stores/favStore'
import PlayCanvas from '@/components/PlayCanvas.vue'
import Modal from '@/components/Modal.vue'
import type { ColorType, ToolType, Stroke } from '@/composables/usePlayCanvasB'

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

const favStore = useFavorites()
favStore.fetchFavorites()
const selectedPlay = ref<Play>()
const showPlay = ref(false)

const openPlay = (p: Play) => {
  selectedPlay.value = p
  showPlay.value = true
}
const closePlay = () => {
  showPlay.value = false
}

// const formationStore = useFormation()

const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')
</script>
<template>
    <Modal 
      :show="showPlay"
      @close="closePlay"
      :foo="selectedPlay"
    />

  <main>
    <h1>Your Favorites</h1>
    <section class="playsContainer fav" > 
      <div class="playRows">
        <div v-for="p in favStore.favorites" :key="p.id" class="indPlays">
          <div class="field">
            <div class="addedPlayers xs">
              <div v-for="(player, index) in p.play.grid.players" :key="p.play.title + index" class="player"
              :style="{left: `${player.x * 100}%`, top: `${player.y * 100}%`}"
              ></div>
            </div>
            <div class="previewScale">
              <PlayCanvas
              makerMode="small"
              class="canvas"
              :strokesData="p.play.grid.strokes"
              :color="selectedColor" :tool="selectedTool"
              />
            </div>
          </div>
          <div class="playInfo">
            <h3>{{ p.play.title }}</h3>
            <h4> {{ p.play.formation }} - {{ p.play.playType }} </h4>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>