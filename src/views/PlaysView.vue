<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import PlayCanvas from '@/components/PlayCanvas.vue'
import Modal from '@/components/Modal.vue'
import type { ColorType, ToolType, Stroke } from '@/composables/usePlayCanvasB'
// import { useFormation } from '@/stores/formStore'

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

const playsStore = usePlayStore()
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


const sortBy = ref<'title' | 'formation' | 'playType'>('title')
const sortedPlays = computed(() => {
  return [...playsStore.plays].sort((a, b) =>
    a[sortBy.value].localeCompare(b[sortBy.value])
  )
})

const selectedFormation = ref('All')
const displayedPlays = computed(() => {
  let plays = [...playsStore.plays]
  if (selectedFormation.value !== 'All') {
    plays = plays.filter(
      play => play.formation === selectedFormation.value
    )
  }
  plays.sort((a, b) =>
    a[sortBy.value].localeCompare(b[sortBy.value])
  )
  return plays
})

const areYouSure = ref<boolean>(false);
const triggerPrompt = (p: Play) => {
  selectedPlay.value = p
  areYouSure.value = true
}
const deleteMe = (id: string) => {
  areYouSure.value = false
  playsStore.deletePlay(id)
}



</script>
<template>

  <Modal 
    :show="showPlay"
    @close="closePlay"
    :foo="selectedPlay"
  />

  <div class="authDelete" v-if="areYouSure">
    <p>Delete:</p>
    <h3>{{ selectedPlay?.title }}</h3>
    <button @click="selectedPlay && deleteMe(selectedPlay.id)">DELETE</button>
    <button  @click="areYouSure = false">NOPE</button>
  </div>
  
  <main class="plays">
    <h1>Your Playbook</h1>
    <div class="sorters">
      <h4>SORT BY: </h4>
      <select v-model="sortBy">
        <option value="title">Name</option>
        <option value="formation">Formation</option>
        <option value="playType">Play Type</option>
      </select>
    </div>
    <section class="playsContainer" > 
      <div
        v-for="p in sortedPlays"
        :key="p.id"
        class="indPlays"
      >
        <div  class="field" @click="openPlay(p)"> 
          <div class="addedPlayers xs">
            <div
              v-for="player in p.grid.players"
              :key="player.id"
              class="player"
              :style="{
               left: `${player.x * 100}%`,
              top: `${player.y * 100}%`
              }"
              >
              {{ player.type }}
            </div>
          </div>
          <div class="previewScale">
            <PlayCanvas
              makerMode="small"
              class="canvas"
              :strokesData="p.grid.strokes"
              :color="selectedColor" :tool="selectedTool"
            />
          </div>
        </div>
        <div class="playInfo">
          <h3>{{ p.title }}</h3>
          <h4> {{ p.formation }} - {{ p.playType }} </h4>
          <button class="" @click.self="triggerPrompt(p)">X</button>
        </div>
      </div>
    </section>
  </main>
</template>