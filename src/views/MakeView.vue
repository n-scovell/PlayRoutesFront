<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted  } from 'vue'
import { useFormation } from '@/stores/formStore'
import { useAuthStore } from '@/stores/userAuth' 
import { usePlayStore } from '@/stores/playStore'

import { useRouter } from 'vue-router'
const router = useRouter()

const forms = useFormation()
const plays = usePlayStore()
const auth = useAuthStore()




import PlayCanvas from '@/components/PlayCanvas.vue'
import type { Stroke, ColorType, ToolType } from '@/composables/usePlayCanvasB'

const canvasRef = ref<InstanceType<typeof PlayCanvas> | null>(null)

// const forms = useFormation()

type Panel = 'pos' | 'pen' | 'color' | 'info' | 'formation' | null
const activePanel = ref<Panel>(null)
const togglePanel = (p: Panel) => {
  activePanel.value = activePanel.value === p ? null : p
}

const playSuccess = ref<boolean>(false)
const submitPlay = () => {
  if (!auth.user) return
  if (!title.value) {
    errors.value.push({ txt: `YOU HAVE A PLAY ERROR`, cls:'hdr' })
    errors.value.push({ txt: "Your play needs a name!", cls:'reg' })
    errorsShow.value = true
    playSuccess.value = false
    return
  }
  if (dropDownsPlayType.value.ptype.newValue === 'Play Type') {
    errors.value.push({ txt: `YOU HAVE A PLAY TYPE ERROR`, cls:'hdr' })
    errors.value.push({ txt: "Your play needs a type!", cls:'reg' })
    errorsShow.value = true
    playSuccess.value = false
    return
  }
  if (myStrokes.value.length === 0) {
    errors.value.push({ txt: `YOU HAVE A ROUTES ERROR`, cls:'hdr' })
    errors.value.push({ txt: "Don't you want to add player routes?", cls:'reg' })
    errorsShow.value = true
    playSuccess.value = false
    return
  }
  if (players.value.length <= 10) {
    const needed = 11 - players.value.length
    errors.value.push({ txt: `YOU HAVE A FORMATION ERROR`, cls:'hdr' })
    errors.value.push({ txt: `YOU NEED ${needed} MORE PLAYERS`, cls:'reg' })
    errorsShow.value = true
    playSuccess.value = false
    return
  }
  const payload = {
    title: title.value,
    formation: dropDownsPlayType.value.formation.newValue,
    playType: dropDownsPlayType.value.ptype.newValue,
    description: 'this is a default description for now',
    grid: {
      strokes: myStrokes.value,
      players: players.value
    },
    ownerId: auth.user.id
  }
  console.log('SUBMITTED PLAY')
  plays.createPlay(payload) 
  playSuccess.value = true
  clearPlayers()
  title.value = ''
}

const noPanel = () => {
  activePanel.value = null
}
interface Player {
  id: string
  pos: string
  x: number
  y: number
}

const showFormation = ref<boolean>(false)
const showFormations = () => {
  showFormation.value = !showFormation.value
}
const showPlayType = ref<boolean>(false)
const showPlayTypes = () => {
  showPlayType.value = !showPlayType.value
}


const hasC = ref<number>(0)
const hasG = ref<number>(0)
const hasT = ref<number>(0)
const hasQB = ref<number>(0)
interface PosType { id:number, pos: string, x: number, y:number, name: string}
const myPositionList = ref<PosType[]>([
  {id:0, pos:'qb', x:.5, y:.74, name:'quarterback'},
  {id:0, pos:'fb', x:.5, y:.83, name:'fullback'},
  {id:0, pos:'rb', x:.5, y:.92, name:'runningback'},
  {id:0, pos:'tb', x:.5, y:.88, name:'tailback'},
  {id:0, pos:'wr', x:.7, y:.65, name:'wide reciever'},
  {id:0, pos:'sl', x:.65, y:.75, name:'slot reciever'},
  {id:0, pos:'te', x:.35, y:.7, name:'tight end'},
  {id:0, pos:'c', x:.5, y:.65, name:'center'},
  {id:0, pos:'g', x:.25, y:.65, name:'guard'},
  {id:0, pos:'t', x:.6, y:.65, name:'tackle'},
])
const players = ref<Player[]>([])
const myCount = ref<number>(0)
const addPlayer = (pos: string, x:number, y:number) => {
  if (myCount.value === 11) return
  if (pos === 'qb') {
    if (hasQB.value === 1) return
    hasQB.value++
  }
  if (pos === 'c') {
    if (hasC.value === 1) return
    hasC.value++
  }
  if (pos === 'g') {
    if (hasG.value === 2) return
    x = hasG.value === 0 ? .55 : .45
    hasG.value++
  }
  if (pos === 't') {
    if (hasT.value === 2) return
    x = hasT.value === 0 ? .6 : .4
    hasT.value++
  }
  myCount.value++
  players.value.push({
    id: crypto.randomUUID(),
    pos,
    x,
    y
  })
}
const clearPlayers = () => {
  canvasRef.value?.clearMe()
  hasG.value = 0
  hasT.value = 0
  hasC.value = 0
  hasQB.value = 0
  players.value = []
}
const container = ref<HTMLElement | null>(null)
const fuller = ref<HTMLElement | null>(null)
let activeId: string | null = null
const makeActiveTool = (tool: 'erase' | 'select') => {
  if (activeTool.value === 'select') {
    activeTool.value = tool
  } else {
    activeTool.value = 'select'
  }
}
const activeTool = ref<'select' | 'erase'>('select')
const startDrag = (id: string, pos: string, e: PointerEvent) => {
  noPanel()
    if (activeTool.value === 'erase') {
    players.value = players.value.filter(p => p.id !== id)
    myCount.value--
    if (pos === 'c') hasC.value = 0
    if (pos === 'qb') hasQB.value = 0
    if (pos === 'g') hasG.value--
    if (pos === 't') hasT.value--
    return
  }
  const el = container.value
  if (!el) return
  el.setPointerCapture(e.pointerId)
  activeId = id
  // 👇 IMPORTANT: attach move to element via capture
  el.addEventListener('pointermove', onDrag)
  el.addEventListener('pointerup', stopDrag)
}
const onDrag = (e: PointerEvent) => {
  if (!activeId || !container.value) return
  const rect = container.value.getBoundingClientRect()
  const player = players.value.find(p => p.id === activeId)
  if (!player) return
  player.x = (e.clientX - rect.left) / rect.width
  player.y = (e.clientY - rect.top) / rect.height
}
const stopDrag = () => {
  activeId = null
}
const newFormation = ref()
const title = ref()
interface DropField { showDrop: boolean, initialVal: string, newValue: string, newLst: string[], errorOut: boolean }
    type DropKeys = 'ptype' | 'formation'
    type Ptype = Record<DropKeys, DropField>
    const dropDownsPlayType = ref<Ptype>({
        formation: {
            errorOut: false,
            showDrop: false,
            initialVal: 'Formation',
            newValue: 'Formation',
            newLst: [ ],
        },
        ptype: {
            errorOut: false,
            showDrop: false,
            initialVal: 'Play Type',
            newValue: 'Play Type',
            newLst: ['Pass', 'Run', 'Special'],
        },
        
    })

  const showTypeDrop = (key: DropKeys) => {
      Object.keys(dropDownsPlayType.value).forEach((k) => {
          const typedKey = k as DropKeys
          dropDownsPlayType.value[typedKey].showDrop =
          typedKey === key? !dropDownsPlayType.value[typedKey].showDrop : false
      })
  }
  const playTypeValue = (key: DropKeys, value: string ) => {
      dropDownsPlayType.value[key].newValue = value
      dropDownsPlayType.value[key].showDrop = false
      showPlayTypes()
  }

  const formationType = (key: DropKeys, value: string) => {
    dropDownsPlayType.value[key].newValue = value
    dropDownsPlayType.value[key].showDrop = false
    showFormations()
    router.push('/create')
  }



watch(() => dropDownsPlayType.value.formation.newValue, (f: string) => {
  clearPlayers()
  myCount.value = 0
  hasC.value = 0
  hasQB.value = 0
  hasG.value = 0
  hasT.value = 0
  for (let i = 0; i <forms.formations.length; i++) {
    const myForm = forms.formations[i]
    if (myForm.formationName === f) {
      for (let p = 0; p < myForm.grid.players.length; p++) {
        const pg = myForm.grid.players[p]
        addPlayer(pg.pos, pg.x, pg.y)
      }
    }
  }
})

const saveFormation = () => {
  if (!auth.user) return
  const formationload = {
    formationName: newFormation.value,
    grid: {
      players: players.value
    },
    ownerId: auth.user.id
  }
  clearPlayers()
}

const myToolbarList = [
  {class:'info', click: () => togglePanel('info'), icon:'i'},
  {class:'formation', click: () => togglePanel('formation'), icon:'F'},
  {class:'position', click: () => togglePanel('pos'), icon:'P'},
  {class:'pen', click: () => togglePanel('pen'), icon:''},
  // {class:'color', click: () => togglePanel('color'), icon:''},
  {class:'select', click: () => makeActiveTool('select'), icon:''},
  {class:'erase', click: () => makeActiveTool('erase'), icon:''},
  {class:'clear', click: () => clearPlayers(), icon:'X'},
  // {class:'submit', click: () => submitPlay(), icon:'S'},
]
const myStrokes = ref<Stroke[]>([])
const selectedColor = ref<ColorType>('white')
const selectedTool = ref<ToolType>('pen')
const changeColor = (prop: ColorType) => {
  selectedColor.value = prop
}
const changeTool = (prop: ToolType) => {
  selectedTool.value = prop
}

interface FormError {
  txt: string,
  cls: string
}
const errors = ref<FormError[]>([])
const errorsShow = ref<boolean>(false)
const addFormation = () => {
  if (!auth.user) return
  if (!newFormation.value) {
    errors.value.push({ txt: `YOU HAVE A FORMATION ERROR`, cls:'hdr' })
    errors.value.push({ txt: "Your formation needs a name!", cls:'reg' })
    errorsShow.value = true
    return
  }
  if (players.value.length <= 10) {
    const needed = 11 - players.value.length
    errors.value.push({ txt: `YOU HAVE A FORMATION ERROR`, cls:'hdr' })
    errors.value.push({ txt: `YOU NEED ${needed} MORE PLAYERS`, cls:'reg' })
    errorsShow.value = true
    return
  }

  
  const formload = {
    formationName: newFormation.value,
    grid: {
      players: players.value
    },
    ownerId: auth.user.id
  }
  dropDownsPlayType.value.formation.newLst.push(newFormation.value)
  dropDownsPlayType.value.formation.newLst.sort((a, b) => a.localeCompare(b))
  forms.createFormation(formload)
  newFormation.value = ""
}

const gatherAllFormations = () => {
  dropDownsPlayType.value.formation.newLst = []
  for (let i = 0; i < forms.formations.length; i++) {
    dropDownsPlayType.value.formation.newLst.push(forms.formations[i].formationName)
    dropDownsPlayType.value.formation.newLst.sort();
  }
  dropDownsPlayType.value.formation.newLst.sort((a, b) => a.localeCompare(b))
}

onMounted(async () => {
  if (!forms.formations.length) {
    await forms.fetchFormations()
  }
  gatherAllFormations()
})

const clearErrors = () => {
  errorsShow.value = false
  errors.value = []
}

</script>

<template>
  <main>
    <h1>Your Play {{ title }}</h1>
    <div class="errorsShow" v-if="errorsShow" @click="clearErrors()">
      <p v-for="(e,index) in errors" :key="'error_'+index">{{ e.txt }}</p>
    </div>
    <div class="boardCont">
    <div class="board" ref="fuller">
      <!-- FIELD STRATEGY -->
      <div class="field" >
        <!-- <h3>{{ title }}</h3> -->
        <PlayCanvas ref="canvasRef" makerMode="maker" class="canvas" @update:strokes="myStrokes = $event" :color="selectedColor" :tool="selectedTool" />
        <div ref="container" class="playerLand">
          <div
            v-for="p in players"
            :key="p.id"
            class="player"
            :myText="p.pos"
            :class="{ remove: activeTool === 'erase' }"
            :style="{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }"
            @pointerdown="(e) => startDrag(p.id, p.pos, e)"
          >
            {{ p.pos }}
          </div>
        </div>
        <!-- GRID DISPLAY UTILITIES -->
        <div class="gridBox">
          <div class="lineOfScrimmage" />
          <div class="gridLine" v-for="g in 7" :key="g" />
        </div>
        <!-- <div class="los" /> -->
      </div>

      <!-- TOOLBOX -->
      <ul class="toolbox">
        <li v-for="b in myToolbarList" :key="'bt_'+b.class" :class="b.class">
          <button :class="b.class" @pointerdown="b.click">
            <div v-if="b.class === 'color'" class="colors">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div v-else-if="b.class === 'erase'" class="lid"></div>
            <div v-else class="lid">{{ b.icon }}</div>
          </button>
        </li>
      </ul>

      <!-- INFO BOX -->
      <ul class="toolbox toolInfo" :class="{active: activePanel === 'info'}">
        <form @submit.prevent class="submitPlay">
          <div class="inputCont">
            <h3>Play Information:</h3>
          </div>
          <div class="inputCont a">
            <label>Play Name<input placeholder="Name" type="text" v-model="title" /></label>
          </div>
          <div class="inputCont a">
            <div class="selectHolder">
              <label>Choose Your Formation:
                <button class="dropDownInd" @pointerdown="showPlayTypes()">{{ dropDownsPlayType.ptype.newValue }}</button>
                <div class="dropDownCase" v-if="showPlayType">
                  <div>
                    <button v-for="f in dropDownsPlayType.ptype.newLst" :key="f" @pointerdown="playTypeValue('ptype', f)">{{f}}</button>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div class="btCont">
            <button class="primaryBt" @click="submitPlay">Submit Play</button>
            <p class="success" v-if="playSuccess">PLAY CREATED!</p>
          </div>
        </form>
      </ul>
      


      <ul class="toolbox toolInfo" :class="{active: activePanel === 'formation'}">
        <form @submit.prevent class="submitPlay">
          <div class="inputCont">
            <h3>Formations:</h3>
          </div>
          <div class="inputCont a">
            <div class="selectHolder">
              <label>Choose Your Formation:
                <button class="dropDownInd" @pointerdown="showFormations()">{{ dropDownsPlayType.formation.newValue }}</button>
                <div class="dropDownCase" v-if="showFormation">
                  <div class="short">
                    <button v-for="f in dropDownsPlayType.formation.newLst" :key="f" @pointerdown="formationType('formation', f)">{{f}}</button>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div class="inputCont">
            <h3>Add Formation:</h3>
            <label>Formation Name<input placeholder="New Formation" type="text" v-model="newFormation" /></label>
          </div>
          <div class="btCont b">
            <button class="formButton" @click="addFormation">Add Formation</button>
          </div>
        </form>
      </ul>


      <!-- PEN COLORS -->
      <ul class="toolbox popTools positions" :class="{active: activePanel === 'color'}">
        <h3>Pen Color:</h3>
        <div class="popDisplay">
          <li class="color white"><button @pointerdown="changeColor('white')">W</button></li>
          <p>white</p>
        </div>
        <div class="popDisplay">
          <li class="color red"><button @pointerdown="changeColor('red')">R</button></li>
          <p>red</p>
        </div>
        <div class="popDisplay">
          <li class="color blue"><button @pointerdown="changeColor('blue')">B</button></li>
          <p>blue</p>
        </div>
        <div class="popDisplay">
          <li class="color yellow"><button @pointerdown="changeColor('yellow')">Y</button></li>
          <p>yellow</p>
        </div>
      </ul>

      <!-- PEN TOOLS -->
      <ul class="toolbox popTools positions" :class="{active: activePanel === 'pen'}">
        <h3>Pen Style:</h3>
        <div class="popDisplay">
          <li><button @pointerdown="changeTool('pen')">P</button></li>
          <p>pen</p>
        </div>
        <div class="popDisplay">
          <li><button @pointerdown="changeTool('chalk')">C</button></li>
          <p>chalk</p>
        </div>
        <div class="popDisplay">
          <li><button @pointerdown="changeTool('dash')">D</button></li>
          <p>dash</p>
        </div>

        <h3>Pen Color:</h3>
        <div class="popDisplay">
          <li class="color white"><button @pointerdown="changeColor('white')">W</button></li>
          <p>white</p>
        </div>
        <div class="popDisplay">
          <li class="color red"><button @pointerdown="changeColor('red')">R</button></li>
          <p>red</p>
        </div>
        <div class="popDisplay">
          <li class="color blue"><button @pointerdown="changeColor('blue')">B</button></li>
          <p>blue</p>
        </div>
        <div class="popDisplay">
          <li class="color yellow"><button @pointerdown="changeColor('yellow')">Y</button></li>
          <p>yellow</p>
        </div>
      </ul>

      <!-- POSITIONS -->
      <ul class="toolbox popTools positions" :class="{active: activePanel === 'pos'}">
        <h3>Add Player:</h3>
        <div class="popDisplay" v-for="p in myPositionList" :key="`${p.pos}_bt`" @pointerdown="addPlayer(p.pos, p.x, p.y)">
          <li ><button >{{ p.pos.toUpperCase() }}</button></li>
          <p>{{ p.name.toUpperCase() }}</p>
        </div>
      </ul> 

    </div>
    </div>
  </main>
</template>