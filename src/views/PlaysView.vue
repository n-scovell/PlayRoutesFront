<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useGuest } from '@/stores/guestStore' 
import { useFavorites } from '@/stores/favStore'
import Player from '../components/Player.vue'
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

const gst = useGuest()
const playsStore = usePlayStore()
const favPlays = useFavorites()
const selectedPlay = ref<Play>()
const showPlay = ref(false)

const openPlay = (p: Play) => {
  selectedPlay.value = p
  showPlay.value = true
}
const closePlay = () => {
  showPlay.value = false
}



const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')


const sortBy = ref<'title' | 'formation' | 'playType'>('title')

// const sortedPlays = computed(() => {
//   return [...playsStore.plays].sort((a, b) =>
//     a[sortBy.value].localeCompare(b[sortBy.value])
//   )
// })


onMounted(async () => {
  if (gst.guest?.id) {
    await gst.getGuestPlays(gst.guest.id)
  }
})

const sortedPlays = computed(() => {
  if (gst.guest) {
    console.log(gst.guestPlays)
  }
  const source = gst.guest ? gst.guestPlays : playsStore.plays
  return [...source].sort((a, b) =>
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

const coolness = (p: string): boolean => {
  return favPlays.favorites.some(f => f.playId === p)
}


const addFav = (p: string) => {
  if (favPlays.favorites.length === 0) {
    favPlays.createFavorite(p)
    return false
  }
  favPlays.favorites.filter(f => {
    if (p === f.playId) {
      favPlays.deleteFavorite(p)
    } else {
      favPlays.createFavorite(p)
    }
    favPlays.fetchFavorites()
  })
}

const popMenu = ref<number>()
const showMenu = (i: number) => {
  if (popMenu.value === i) { 
    popMenu.value = -1
    return true
  }
  popMenu.value = i
}
</script>
<template>

  <!-- <Modal :show="showPlay" @close="closePlay" :foo="selectedPlay"/> -->

  <div class="authDelete" v-if="areYouSure">
    <p>Delete:</p>
    <h3>{{ selectedPlay?.title }}</h3>
    <button @click="selectedPlay && deleteMe(selectedPlay.id)">DELETE</button>
    <button  @click="areYouSure = false">NOPE</button>
  </div>
  
  <main>
    <h1>Your Playbook:</h1>
    <div v-if="showPlay">
      HELLO ALL
    </div>
    <div class="sorters">
      <h4>SORT BY: </h4>
      <select v-model="sortBy">
        <option value="title">Name</option>
        <option value="formation">Formation</option>
        <option value="playType">Play Type</option>
      </select>
    </div>
    <section class="playsContainer" > 
      <div class="playRows">
        <div
          v-for="(p, index) in sortedPlays"
          :key="p.id"
          class="indPlays"
        >
          <div  class="field" @click="openPlay(p)"> 
          <!-- <div class="field">  -->
             <div class="addedPlayers xs">
              <Player :players="p.grid.players" :num="100" />
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
            <div class="btCont">
              <div class="show" :class="{active: popMenu === index}" v-if="!gst.guest">
                <button class="fav" @click="addFav(p.id)" :class="{star: coolness(p.id)}">&#9733</button>
                <button class="del" @click.self="triggerPrompt(p)">
                  <div class="lid"></div>
                </button>
              </div>
              <button v-if="!gst.guest" class="menu" @click="showMenu(index)" :class="{active: popMenu}">
                <div></div>
                <div></div>
                <div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  
</template>