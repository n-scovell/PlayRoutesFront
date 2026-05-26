<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted} from 'vue'
// import { useAuthStore } from '@/stores/userAuth'
import { usePlayStore } from '@/stores/playStore'
import PlayCanvas from '@/components/PlayCanvas.vue'
import type { ColorType, ToolType } from '@/composables/usePlayCanvasB'


// const auth = useAuthStore()
const playsStore = usePlayStore()
const currentSort = ref('title')
const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')

const deleteMe = (id: string) => {
  playsStore.deletePlay(id)
}

</script>
<template>
  <main class="plays">
    <h1>Your playbook rules</h1>
    <section class="playsContainer" > 
      <div class="deleting" :class="{active: playsStore.deleting}">
        <p>LOADING</p>
        <div class="inner"></div>
      </div>
      <div v-for="p in playsStore.plays" :key="p.title" class="plays"
      :class="{active: currentSort === p.formation || currentSort === p.title || currentSort === p.playType}"
      >
      
        <div  class="field" 
        > 
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
          <p class="hover">{{ p.grid.strokes }}</p>
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
          <p>{{ p.title }}</p>
          <p>
          {{ p.formation }}
          </p>
          <p>
          {{ p.playType }}
          </p>
          <button @click="deleteMe(p.id)">DELETE</button>
        </div>
      </div>
    </section>
  </main>
</template>
<style lang="scss">
@keyframes spinMeRightRoundBaby {
  to { transform: rotate(360deg);}
}

.hover {
  position:absolute;
  top:0px;
  left:0px;
  width:100%;
  height:auto;
  background:black;
  display:none;
}
.playsContainer {
  position:relative;
  padding-top:50px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11%, 300px));
  grid-gap: .5rem;
  row-gap:20px;
  margin:0px;
  .deleting {
    $slA: 2%;
    $slB: 100% - $slA;
    width:100px;
    height:100px;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    display:none;
    z-index:50;
    p {
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      font-size:13px;
      font-family:sans-serif;
      font-weight:bold;
      color:rgba(255,255,255,.5);
      margin:0px;
      padding:0px;
      text-align:center;
    }
    .inner {
      width:100%;
      height:100%;
      border:.8rem solid rgba(255,255,255,.5);
      border-radius:50%;
      position:relative;
      clip-path:polygon(
        0% 0%, $slA 0%, 50% 50%, $slB 0%, 100% 0%, 100% 100%, 0% 100%
      );
      opacity:0;
      transition:all .5s;
      animation: spinMeRightRoundBaby .5s linear .5s infinite;
    }
    &.active {
      display:block;
      .inner {
        opacity:1;
        transition:all .5s;
      }
    }
    
  }
  // .deleting {
  //   $w:100px;
  //   width: $w;
  //   height: $w;
  //   border-radius: 50%;
  //   position:absolute;
  //   top:50%;
  //   left:50%;
  //   transform:translate(-50%,-50%);
  //   z-index:9999;
  //   &.active {
  //     /* Background ring (gray track) */
  // background: 
  //   conic-gradient(transparent 0% 100%,transparent ),
  //   radial-gradient(circle closest-side at 50% 50%, 
  //     transparent 70%,      /* inner hole */
  //     transparent 11%              /* thickness of the track */
  //   );

  // /* Progress overlay */
  // mask: 
  //   radial-gradient(circle closest-side at 50% 50%, 
  //     transparent 70%, 
  //     black 71%
  //   );
  
  // background: 
  //   conic-gradient(
  //     blue var(--progress),   /* progress color */
  //     transparent var(--progress)
  //   ),
  //   radial-gradient(circle closest-side at 50% 50%, 
  //     transparent 70%, 
  //     transparent 71%
  //   );
  //   transition: --progress 1s ease;
  //   animation: progressFill 2s ease-in .5s forwards;
  //   }
  // }
  .plays {
    flex:1;
    position:relative;
    max-width:290px;
    overflow:hidden;
    border-radius:18px;
    border-top:2px solid rgba(255,255,255,.2);
    box-shadow:0 2px 10px black;
    
    &.active {
      outline:3px solid rgba(255, 188, 62, 0.8);
    }
    .field {
      background-image:url('@/assets/images/bck_chalkboard.jpg');
      background-repeat:no-repeat;
      background-size:cover;
      position:relative;
      width:100%;
      height:120px;
      .canvas {
        position:absolute;
        top:0px;
        left:0px;
        width:100%;
        height:100%;
      }
      .addedPlayers {
        position:absolute;
        top:-3px;
        left:-3px;
        width:100%;
        height:100%;
        .player {
          $w:8px;
          width:$w;
          height:$w;
          transform:translate(-50%,-50%);
          background:white;
          border-radius:50%;
          position:absolute;
          margin:3px;
          color:transparent;
          font-size:9px;
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:0;
          // display:none;
        }
      }
    }
    .playInfo {
      background:rgba(0,0,0,.5);
      border-radius:0 0 18px 18px;
      padding:10px;
    }
  }
}
// @media screen and (min-width: 600px) {
//   .playsContainer {
//     grid-template-columns: repeat(auto-fill, minmax(200px, 30%));
//     grid-gap: 1rem;
//     row-gap:20px;
//   }
// }
</style> 



<!-- <script setup lang="ts">
import { ref, reactive, watch, computed} from 'vue'
import { showPlays } from '@/composables/playbook'
import PlayCanvas from '@/components/PlayCanvas.vue'
import type { ColorType, ToolType } from '@/composables/usePlayCanvasB'
import Modal from '@/components/Global/Modal.vue'



const {
  title, plays, deletePlay, currentSort, columnSearch, sortMe, sortBy
} = showPlays()

// DROP LIST INITIAL VALS
const anyValue = ref<string>('Sort By Any:')
const formationValue = ref<string>('Sort By Formation:')
const typeValue = ref<string>('Sort By Play Type:')
// DROP SHOW INITIALS
const isAny = ref(false)
const isFormation = ref(false)
const isPlayType = ref(false)
type SearchTypes = 'formation' | 'title' | 'playType'

const changeSortVal = (prop:string, type: SearchTypes) => {
  sortMe(prop, type)
  isAny.value = false
  isPlayType.value = false
  isFormation.value = false
}

const myTitles = computed(() => {
  return [...new Set(plays.value.map(p => p.title))]
    .sort((a, b) => a.localeCompare(b))
})
const myFormations = computed(() => {
  return [...new Set(plays.value.map(p => p.formation))]
    .sort((a, b) => a.localeCompare(b))
})
const myPlayType = computed(() => {
  return [...new Set(plays.value.map(p => p.playType))]
    .sort((a, b) => a.localeCompare(b))
})

const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')


  type PlayerType =
  | 'qb'
  | 'wr'
  | 'rb'
  | 'te'
  | 'fb'
  | 'c'
  | 'sl'
  | 'g'
  | 't'
export type Point = { x: number; y: number }
export interface Stroke {
  id: number
  tool: ToolType
  color: string
  width: number
  points: Point[]
}
interface Player {
  id: string
  type: PlayerType
  x: number
  y: number
}
interface Grid {
  strokes: Stroke[]
  players: Player[]
}

interface PlayData {
  id: string | number
  title: string
  formation: string
  playType: string
  grid: Grid
}
const isModalOpen = ref<boolean>(false)
const selectedPlay = ref<PlayData | null>(null)
const showPlayLarger = (play: PlayData) => {
  isModalOpen.value = true
  selectedPlay.value = play
  // console.log(selectedPlay.value)
}




</script>
<template> 
  <main class="plays" ref="captureArea">

    <Modal v-if="selectedPlay" :title="selectedPlay.title" :formation="selectedPlay.formation" :playType="selectedPlay.playType" :show="isModalOpen" @close="isModalOpen = false">
      <div class="modal--field">
        <hr />
        <PlayCanvas
          makerMode="large"
          class="large"
          :strokesData="selectedPlay.grid.strokes"
          :color="selectedColor" :tool="selectedTool"
        />
        <div class="playerPlacement">
            <div
              v-for="player in selectedPlay.grid.players"
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
      </div>
    </Modal>
    <h1>{{ title }}</h1>
    <form @submit.prevent class="sorter">
      <div class="inputCont">
        <div class="selectHolder" :class="{active: isAny}">
          <button class="dropDownInd" @click="isAny = !isAny">{{anyValue}}</button>
          <div class="dropDownCase" v-if="isAny">
            <div>
              <button v-for="myTitle in myTitles" :key="myTitle" @pointerdown="changeSortVal(myTitle, 'title')">
              {{ myTitle }}
              </button>
            </div>
          </div>
        </div>
         <div class="selectHolder" :class="{active: isPlayType}">
          <button class="dropDownInd" @click="isPlayType = !isPlayType">{{typeValue}}</button>
          <div class="dropDownCase" v-if="isPlayType">
            <div>
              <button v-for="playt in myPlayType" :key="playt" @pointerdown="changeSortVal(playt, 'playType')">
              {{ playt }}
              </button>
            </div>
          </div>
        </div>
        <div class="selectHolder" :class="{active: isFormation}">
          <button class="dropDownInd" @click="isFormation = !isFormation">{{formationValue}}</button>
          <div class="dropDownCase" v-if="isFormation">
            <div>
              <button v-for="form in myFormations" :key="form" @pointerdown="changeSortVal(form, 'formation')">
              {{ form }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <section class="playsContainer" > 
      <div v-for="p in plays" :key="p.title" class="plays"
      :class="{active: currentSort === p.formation || currentSort === p.title || currentSort === p.playType}"
      >
        <div  class="field" @pointerdown="showPlayLarger(p)"> 
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
          <p class="hover">{{ p.grid.strokes }}</p>
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
          <p>{{ p.title }}</p>
          <p>
          {{ p.formation }}
          </p>
          <p>
          {{ p.playType }}
          </p>
          <button @click="deletePlay(p.id)">DELETE</button>
        </div>
        
      </div>
    </section>
  </main>
</template>


-->