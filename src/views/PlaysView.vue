<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import PlayCanvas from '@/components/PlayCanvas.vue'
import type { ColorType, ToolType } from '@/composables/usePlayCanvasB'
import { useFormation } from '@/stores/formStore'

const playsStore = usePlayStore()
const formationStore = useFormation()

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

const deleteMe = (id: string) => {
  playsStore.deletePlay(id)
}

</script>
<template>
  <main class="plays">
    <h1>Your playbook</h1>
    <div class="sorters">
      <h4>SORT BY: </h4>
      <select v-model="sortBy">
        <option value="title">Name</option>
        <option value="formation">Formation</option>
        <option value="playType">Play Type</option>
      </select>
      <!-- <select v-model="selectedFormation">
        <option value="All">All Formations</option>
        <option
          v-for="formation in formationStore.formations"
          :key="formation.id"
          :value="formation.name"
        >
          {{ formation.name }}
        </option>
      </select> -->
    </div>
    <section class="playsContainer" > 
      <!-- <div v-for="p in playsStore.plays" :key="p.title" class="indPlays"
      :class="{active: currentSort === p.formation || currentSort === p.title || currentSort === p.playType}"
      > -->
      <div
        v-for="p in sortedPlays"
        :key="p.id"
        class="indPlays"
      >
        <div  class="field"> 
          <div class="addedPlayers">
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
          <button @click="deleteMe(p.id)">DELETE</button>
        </div>
      </div>
    </section>
  </main>
</template>