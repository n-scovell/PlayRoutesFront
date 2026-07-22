<script setup lang="ts">
import { ref, watch, onMounted  } from 'vue'
import { useFormation } from '@/stores/formStore'
import { useAuthStore } from '@/stores/userAuth' 
import { usePlayStore } from '@/stores/playStore'

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

const submitPlay = () => {
  if (!auth.user) return
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
const hasC = ref<number>(0)
const hasG = ref<number>(0)
const hasT = ref<number>(0)
const hasQB = ref<number>(0)
interface PosType { id:number, pos: string, x: number, y:number}
const myPositionList = ref<PosType[]>([
  {id:0, pos:'qb', x:.5, y:.74},
  {id:0, pos:'fb', x:.5, y:.83},
  {id:0, pos:'rb', x:.5, y:.92},
  {id:0, pos:'wr', x:.7, y:.65},
  {id:0, pos:'sl', x:.65, y:.75},
  {id:0, pos:'te', x:.35, y:.7},
  {id:0, pos:'c', x:.5, y:.65},
  {id:0, pos:'g', x:.25, y:.65},
  {id:0, pos:'t', x:.6, y:.65},
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
  {class:'position', click: () => togglePanel('pos'), icon:'P'},
  {class:'pen', click: () => togglePanel('pen'), icon:''},
  {class:'color', click: () => togglePanel('color'), icon:''},
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

const addFormation = () => {
  if (!auth.user) return
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

</script>

<template>
  <main class="make">

    <h1>Your Play {{ title }}</h1>
    <div class="boardCont">
    <div class="board" ref="fuller">
      <!-- <div class="loading" :class="{active: plays.loading}"></div> -->
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
        <div class="mid">
          <div class="grid" v-for="g in 7" :key="g" />
        </div>
        <div class="los" />
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
      <!-- INFO -->
      <ul class="toolbox deep" :class="{active: activePanel === 'info'}">
        <form @submit.prevent>
          <div class="inputCont">
          <p>
          Input play information:
          </p>
          </div>
          <div class="inputCont">
            <label>Name</label><input placeholder="Name" type="text" v-model="title" />
          </div>
          <div class="inputCont">
            <div class="selectHolder" v-for="(field, key) in dropDownsPlayType" :key="key" :class="{active: field.showDrop, error: field.errorOut}">
              <button @pointerdown="showTypeDrop(key)" class="dropDownInd" :class="{inactive: field.newLst.length === 0}">{{ field.newValue }}</button>
              <div class="dropDownCase" v-if="field.showDrop" :class="{inactive: field.newLst.length === 0}" >
                <div :class="{short: field.initialVal === 'Formation'}">
                <button v-for="(option, index) in field.newLst" @pointerdown="playTypeValue(key, option)">{{option}}</button>
                </div>  
              </div>
            </div>
          </div>
          <!-- :disabled="plays.loading" :class="{active: plays.loading}"  -->
          <div class="btCont">
            <button class="formButton" 
            
            @click="submitPlay">Submit Play</button>
          </div>
          <div class="inputCont">
            <p>Create formation:</p>
            <label>Name</label><input placeholder="New Formation" type="text" v-model="newFormation" />
          </div>
          <div class="btCont b">
            <button class="formButton" @click="addFormation">Add Formation</button>
          </div>
        </form>
      </ul>
      <ul class="toolbox pop" :class="{active: activePanel === 'color'}">
        <li class="color white"><button @pointerdown="changeColor('white')">W</button></li>
        <li class="color red"><button @pointerdown="changeColor('red')">R</button></li>
        <li class="color blue"><button @pointerdown="changeColor('blue')">B</button></li>
        <li class="color yellow"><button @pointerdown="changeColor('yellow')">Y</button></li>
      </ul>
      <ul class="toolbox pop" :class="{active: activePanel === 'pen'}">
        <li><button @pointerdown="changeTool('pen')">P</button></li>
        <li><button @pointerdown="changeTool('chalk')">C</button></li>
        <li><button @pointerdown="changeTool('dash')">D</button></li>
      </ul>
      <ul class="toolbox pop" :class="{active: activePanel === 'pos'}">
        <li v-for="p in myPositionList" :key="`${p.pos}_bt`">
          <button @pointerdown="addPlayer(p.pos, p.x, p.y)">{{ p.pos.toUpperCase() }}</button>
        </li>
      </ul> 
    </div>
    </div>
  </main>
</template>
<style lang="scss">

* {touch-action: none;}
$player:35px;
@keyframes shrinkDown {
  0% {width:50%;height:50%;}
  50% {width:150%;height:150%;}
  100% {width:50%;height:50%;}
}
.delete-stroke-btn {
  position: absolute;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: red;
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.palette {
  display:none;
  gap:10px;
  button {
    padding:5px 10px;
    cursor:pointer;
    &.active {
      background:rgb(24, 69, 192);
      color:white;
    }
  }
}

@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

@keyframes progressFill {
  to {
    --progress: 100%;   /* Change this to whatever % you want */
  }
}
.boardCont {
  height:100vh;
  overflow:hidden;
  display:flex;
  flex-direction:column;
}
.board {
  display:flex;
  // border:2px solid rgba(255,255,255,.5);
  width:100%;
  flex:1;
  // max-width:100%;
  min-width:850px;
  position:relative;
  overflow:hidden;
  margin-bottom:0px;
  margin-left:0px;
  .loading {
    $w:100px;
    width: $w;
    height: $w;
    border-radius: 50%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:9999;
    &.active {
      /* Background ring (gray track) */
  background: 
    conic-gradient(transparent 0% 100%,transparent ),
    radial-gradient(circle closest-side at 50% 50%, 
      transparent 70%,      /* inner hole */
      transparent 11%              /* thickness of the track */
    );

  /* Progress overlay */
  mask: 
    radial-gradient(circle closest-side at 50% 50%, 
      transparent 70%, 
      black 71%
    );
  
  background: 
    conic-gradient(
      blue var(--progress),   /* progress color */
      transparent var(--progress)
    ),
    radial-gradient(circle closest-side at 50% 50%, 
      transparent 70%, 
      transparent 71%
    );
    transition: --progress 1s ease;
    animation: progressFill 2s ease-in .5s forwards;
    }
  }
  &.active {
    position:fixed;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    max-width:100%;
  }
  .toolbox {
    $toolWidth: 50px;
    flex:1;
    max-width:$toolWidth;
    background:black;
    list-style-type:none;
    display:flex;
    gap:10px;
    flex-direction:column;
    flex-wrap:wrap;
    text-align:center;
    align-items:center;
    justify-content:center;
    z-index:3;
    &.deep {
      position:absolute;
      right:-250px;
      max-width:200px;
      width:100%;
      height:100%;
      background:rgba(0,0,0,.5);
      transition:all .5s;
      padding:2% 10px 10px;
      li {
        width:90%;
        padding:0px;
        outline:1px solid red;
        input {
          width:100%;
        }
      }
      &.active {
        width:200px;
        right:$toolWidth;
        transition:all .5s;
      }
    }
    &.pop {
      position:absolute;
      right:-$toolWidth;
      width:$toolWidth;
      height:100%;
      background:rgba(0,0,0,.5);
      transition:all .5s;
      z-index:900;
      &.active {
        right:$toolWidth;
        transition:all .5s;
      }
      &.deactive {
        opacity:.8;
      }
      li {
        button {
          font-size:.8rem;
          border:3px solid white;
        }
      }
    }
    li {
      $d: 12px;
      width:$toolWidth - $d;
      height:$toolWidth - $d;
      button {
        height:100%;
        width:100%;
        border-radius:50%;
        text-align:center;
        background:transparent;
        background:transparent;
        border:4px solid white;
        color:white;
        font-size:1.2rem;
        cursor:pointer;
      }
      &.info {
        button {
          font-size:28px;
          font-family:serif;
          font-style:italic;
          font-weight:bold;
        }
      }
      &.pen {
        button {
          position:relative;
          transform:rotate(-45deg);
          &:after {
            content:' ';
            width:80%;
            height:30%;
            background:white;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            // clip-path:polygon(0% 50%, 30% 0%, 100% 0%, 100% 100%, 30% 100%);
            clip-path:polygon(
              0% 50%, 30% 0%, 80% 0%, 80% 95%, 85% 95%, 85% 0%, 100% 0%, 100% 100%, 30% 100%
            )
          }
        }
      }
      &.color {
        button {
          
        font-weight:bold;
        }
        &.red { button {
          border:none;
          background:red;
        }}
        &.blue { button {
          border:none;
          background:blue;
        }}
        &.white { button {
          border:none;
          color:black;
          background:white;
        }}
        &.yellow { button {
          border:none;
          color:black;
          background:yellow;
        }}
        button {
          background:red;
          overflow:hidden;
          .colors {
            width:100%;
            height:100%;
            background:blue;
            display:flex;
            flex-wrap:wrap;
            div {
              flex: 0 0 50%;
              height:50%;
              &:nth-child(1) {background:white;}
              &:nth-child(2) {background:red;}
              &:nth-child(3) {background:blue;}
              &:nth-child(4) {background:yellow;}
            }
          }
        }
      }
      &.select {
        position:relative;
        transform:rotate(-35deg);
        button {
          background:blue;
          &:before {
            content:' ';
            width:55%;
            height:35%;
            background:white;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            $a:50%;
            $b:100% - $a;
            $c: 25%;
            $d: 100% - $c;
            clip-path:polygon(
              0% 50%, $a 0%, $a $c, 100% $c, 100% $d, $a $d, $a 100%,
            );
          }
        }
      }
      &.erase {
        position:relative;
        button {
          position:absolute;
          top:0px;
          left:0px;
          
          &.select {
            transform:rotate(-135deg);
            background:green;
            &:before {
            content:' ';
            width:50%;
            height:75%;
            background:white;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            $h:50%;
            $a: 65%;
            $b: 100% - $a;
            clip-path:polygon(
              50% 0%, 100% 60%, $a $h, $a 100%, $b 100%, $b $h, 0% 60%
            )
            }
          }
          &.erase {
            background:red;
            position:relative;
            .lid {
              width:50%;
              height:10%;
              background:white;
              position:absolute;
              top:22%;
              left:50%;
              transform:translate(-50%,0%);
            }
            &:after {
              content:' ';
              width:48%;
              height:45%;
              background:white;
              position:absolute;
              top:40%;
              left:50%;
              transform:translate(-50%,0%);
              clip-path:polygon(
                0% 0%, 100% 0%, 90% 100%, 10% 100%,
              )
            }
            &:before {
              content:' ';
              width:30%;
              height:15%;
              background:white;
              position:absolute;
              top:10%;
              left:50%;
              transform:translate(-50%,0%);
              $a:30%;
              $b:100% - $a;
              clip-path:polygon(
                0% 0%, 100% 0%, 100% 100%,
                $b 100%, $b $a, $a $a, $a 100%, 0% 100%
              )
            }
          }
          &.select {
            background:blue;
          }
          &.active {
            display:block;
          }
        }
      }
    }
  }
  .field {
    flex:1;
    position: relative;
    height: 100%;
    background-image:url('@/assets/images/bck_chalkboard.jpg');
    background-repeat:no-repeat;
    background-size:cover;
    .playerLand {
      position:absolute;
      top:0px;
      left:0px;
      width:100%;
      height:100%;
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
    .hoverBts {
      width:auto;
      height:auto;
      position:absolute;
      background:rgba(255,255,255,.3);
      display:flex;
      box-shadow:1px 5px 2px rgba(0,0,0,.1);
      padding:5px;
      border-radius:30px;
      font-size:30px;
      font-weight:bold;
      gap:13px;
      button {
        $w:40px;
        width:$w;
        height:$w;
        border-radius:50%;
        background:rgba(255,255,255,.8);
        color:white;
        cursor:pointer;
        &.delete {
          $w:60%;
          $h:10%;
          position:relative;
          transform:rotate(45deg);
          &:before, &:after {
            
            content:' ';
            width:$w;
            height:$h;
            background:#333;
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
          }
          &:after {
            width:$h;
            height:$w;
          }
        }
        &.mover {
          position:relative;
          &:before, &:after {
            $w:80%;
            $h:20%;
            $d:20%;
            $e:100% - $d;
            $f:30%;
            $g:100% - $f;
            content:' ';
            width:$w;
            height:$h;
            background:#333;
            position:absolute;
            top:16px;
            left:4px;
            clip-path:polygon(
              0% 50%, $d 0%, $d $f, $e $f, $e 0%, 100% 50%, $e 100%, $e $g, $d $g, $d 100%,
            );
          }
          &:after {
            transform:rotate(90deg);
          }
          &.active {
            background:rgba(5, 233, 73, 0.8);
            &:before, &:after{
              background:white;
            }
          }
        }
      }
    }
    h3 {
      width:100%;
      text-align:center;
      font-size:20px;
      padding-top:5px;
    }
    .small {
      touch-action: none;
      position:absolute;
      top:0px;
      left:0px;
      width:300px;
      height:300px;
      z-index:2;
    }
    .canvas {
      touch-action: none;
      position:absolute;
      top:0px;
      left:0px;
      width:100%;
      height:100%;
      z-index:2;
    }
    .mid {
      position:absolute;
      top:0%;
      left:50%;
      transform:translate(-50%,0%);
      width:100%;
      height:100%;
      display:flex;
      .grid {
        flex:1;
        border-right:1px dashed rgba(255,255,255,.9);
        &:last-child {
          border-right:none;
        }
      }
    }
    .los {
      position: absolute;
      left: 0;
      right: 0;
      top:65%;
      height: 10px;
      // background: red;
      background-image:url('@/assets/maker/line.png');
      background-size:contain;
      background-position:center -5px;
      background-repeat:repeat-x;
    }
  }
}
.player {
  $player:38px;
  width:$player;
  height:$player;
  border-radius:50%;
  background:transparent;
  color:black;
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:99999;
  &.remove {
    &:before {
      background:gray;
      color:white;
      transition:all .5s;
    }
  }
  &:before, &:after {
    content:attr(myText);
    width:100%;
    height:100%;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    border-radius:50%;
    background:white;
    display:flex;
    align-items:center;
    justify-content:center;
    text-transform:uppercase;
    font-weight:bold;
    z-index:1;
    transition:all .5s;
  }
  &:after {
    width:100%;
    height:100%;
    background:red;
    z-index:0;
    filter:blur(5px);
    animation:shrinkDown 1s .1s forwards;
  }
}
@media only screen and (max-width: 900px) {
  .board {
    height:400px;
  }
  .player {
  $player:30px;
  width:$player;
  height:$player;
  font-size:11px;
  transition:all .1s;
  }

}
@media only screen and (max-width: 600px) {
  .board {
    height:300px;
  }
  .player {
  $player:20px;
  width:$player;
  height:$player;
  font-size:9px;
  transition:all .1s;
  }

}
</style>