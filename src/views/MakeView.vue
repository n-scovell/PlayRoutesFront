<script setup lang="ts">
  //IMPORTS
  import { ref, watch, onMounted } from 'vue'
  import { useFormation } from '@/stores/formStore'
  import { useAuthStore } from '@/stores/userAuth' 
  import { useGuest } from '@/stores/guestStore' 
  import { usePlayStore } from '@/stores/playStore'
  import { useRouter } from 'vue-router'
  import PlayCanvas from '@/components/PlayCanvas.vue'
  import type { Stroke, ColorType, ToolType } from '@/composables/usePlayCanvasB'

  import Header from '@/components/maker/header.vue'

  //TYPES
  type Panel = 'pos' | 'pen' | 'color' | 'info' | 'formation' | null
  type DropKeys = 'ptype' | 'formation'
  type Ptype = Record<DropKeys, DropField>

  //INTERFACES
  interface Player { id: string, pos: string, x: number, y: number }
  interface PosType { id:number, pos: string, x: number, y:number, name: string }
  interface DropField { showDrop: boolean, initialVal: string, newValue: string, newLst: string[], errorOut: boolean }
  interface FormError {txt: string, cls: string }

  //LETS
  let activeId: string | null = null

  //CONSTS
  const router = useRouter()
  const forms = useFormation()
  const plays = usePlayStore()
  const auth = useAuthStore()
  const gst = useGuest()
  const canvasRef = ref<InstanceType<typeof PlayCanvas> | null>(null)
  const activePanel = ref<Panel>(null)
  const playSuccess = ref<boolean>(false)
  const hasC = ref<number>(0)
  const hasG = ref<number>(0)
  const hasT = ref<number>(0)
  const hasWR = ref<number>(0)
  const hasTE = ref<number>(0)
  const hasQB = ref<number>(0)
  const hasRB = ref<number>(0)
  const hasFB = ref<number>(0)
  const hasTB = ref<number>(0)
  const hasSL = ref<number>(0)
  const showFormation = ref<boolean>(false)
  const showPlayType = ref<boolean>(false)
  const players = ref<Player[]>([])
  const playerCount = ref<number>(0)
  const container = ref<HTMLElement | null>(null)
  const activeTool = ref<'select' | 'erase'>('select')
  const newFormation = ref()
  const title = ref()
  const activeColor = ref('white')
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
          newLst: ['Play Type', 'Pass', 'Run', 'Special'],
      },
  })
  const myStrokes = ref<Stroke[]>([])
  const selectedColor = ref<ColorType>('white')
  const selectedTool = ref<ToolType>('pen')
  const errors = ref<FormError[]>([])
  const errorsShow = ref<boolean>(false)

  //LISTS
  const positionList = ref<PosType[]>([
    {id:0, pos:'qb', x:.5, y:.74, name:'quarterback'},
    {id:0, pos:'fb', x:.5, y:.83, name:'fullback'},
    {id:0, pos:'rb', x:.5, y:.92, name:'runningback'},
    {id:0, pos:'tb', x:.6, y:.92, name:'tailback'},
    {id:0, pos:'wr', x:.7, y:.65, name:'wide reciever'},
    {id:0, pos:'sl', x:.65, y:.7, name:'slot reciever'},
    {id:0, pos:'te', x:.35, y:.7, name:'tight end'},
    {id:0, pos:'c', x:.5, y:.65, name:'center'},
    {id:0, pos:'g', x:.25, y:.65, name:'guard'},
    {id:0, pos:'t', x:.6, y:.65, name:'tackle'},
  ])
  const myToolbarList = [
    {class:'info', click: () => togglePanel('info'), icon:'i'},
    {class:'formation', click: () => togglePanel('formation'), icon:'F'},
    {class:'position', click: () => togglePanel('pos'), icon:'P'},
    {class:'pen', click: () => togglePanel('pen'), icon:''},
    {class:'select', click: () => makeActiveTool('select'), icon:''},
    {class:'erase', click: () => makeActiveTool('erase'), icon:''},
    {class:'clear', click: () => clearPlayers(), icon:'X'},
  ]
  
  //FUNCTIONS
  const togglePanel = (p: Panel) => {
    activePanel.value = activePanel.value === p ? null : p
  }
  const checkErrors = (type: 'play' | 'formation') => {
    let pass = 0
    let playCheck = 0
    let formationCheck = 0
    errors.value = []
    const needed = 11 - players.value.length
    const errorLogs = {
      101: `${needed} players needed.`,
      102: `Name your play.`,
      103: `Choose play type.`,
      104: `Play needs routes.`,
      105: `Name your formation`
    }
    //CHECK PLAYER COUNT
    if (players.value.length <= 10) {
      errors.value.push({ txt: errorLogs[101], cls:'reg' })
      pass++
      playCheck++
      formationCheck++
    }
    if (type === 'play') {
      //CHECK TITLE
      if (!title.value) {
        errors.value.push({ txt: errorLogs[102], cls:'reg' })
        pass++
        playCheck++
      }
      //CHECK PLAY TYPE
      if (dropDownsPlayType.value.ptype.newValue === 'Play Type') { 
        errors.value.push({ txt: errorLogs[103], cls:'reg' })
        pass++
        playCheck++
      }
      //CHECK STROKES
      if (myStrokes.value.length === 0) {
        errors.value.push({ txt: errorLogs[104], cls:'reg' })
        pass++
        playCheck++
      }
      if (playCheck >= 1) {
        errors.value.unshift({ txt: "Submit Play Errors:", cls:'hdr' })
      }
    }
    if (type === 'formation') {
      //CHECK FORMATION NAME
      if (!newFormation.value) {
        errors.value.push({ txt: errorLogs[105], cls:'reg' })
        pass++
        formationCheck++
      }
      if (formationCheck >= 1) {
        errors.value.unshift({ txt: "Formation Error:", cls:'hdr' })
      }
    }
    if (pass != 0) {
      errorsShow.value = true
      return false
    } else {
      errorsShow.value = false
      errors.value = []
      return true
    }
  }
  // const submitPlay = () => {
  //   if (!checkErrors('play')) return

  //   const grid = {
  //     strokes: myStrokes.value,
  //     players: players.value
  //   }
  //   let payload
  //   if (auth.user) {
  //      payload = {
  //       title: title.value,
  //       formation: dropDownsPlayType.value.formation.newValue,
  //       playType: dropDownsPlayType.value.ptype.newValue,
  //       description: 'this is a default description for now',
  //       grid: {
  //         strokes: myStrokes.value,
  //         players: players.value
  //       },
  //       ownerId: auth.user?.id
  //     }
  //     plays.createPlay(payload) 
  //   }
  //   if (gst.guest) {
  //      payload = {
  //       title: title.value,
  //       formation: dropDownsPlayType.value.formation.newValue,
  //       playType: dropDownsPlayType.value.ptype.newValue,
  //       description: 'this is a default description for now',
  //       grid: {
  //         strokes: myStrokes.value,
  //         players: players.value
  //       },
  //       guestId: gst.guest?.id
  //     }
  //     gst.createGuestPlay(payload)
  //   }
  //   playSuccess.value = true
  //   clearPlayers()
  //   title.value = ''
  // }

  const submitPlay = async () => {
    if (!checkErrors('play')) return
    const grid = {
      strokes: myStrokes.value,
      players: players.value
    }
    try {
      if (auth.user) {
        await plays.createPlay({
          title: title.value,
          formation: dropDownsPlayType.value.formation.newValue,
          playType: dropDownsPlayType.value.ptype.newValue,
          description: 'default description',
          grid,
          ownerId: auth.user.id
        })
      } 
      else if (gst.guest) {
        await gst.createGuestPlay({
          title: title.value,
          formation: dropDownsPlayType.value.formation.newValue,
          playType: dropDownsPlayType.value.ptype.newValue,
          description: 'default description',
          grid,
          guestId: gst.guest.id
        })
      }
      // Only happens if API succeeded
      playSuccess.value = true
      clearPlayers()
      title.value = ''
    } catch (err: any) {
      if (err.message === 'Guest play limit reached') {

        errors.value.push({ txt: 'You have reached your play limit', cls:'reg' })
        errorsShow.value = true
        return
      }
      console.error(err)
    }
  }
  const noPanel = () => {
    activePanel.value = null
  }
  const showFormations = () => {
    showFormation.value = !showFormation.value
  }
  const showPlayTypes = () => {
    showPlayType.value = !showPlayType.value
  }
  const addPlayer = (pos: string, x:number, y:number) => {
    // WHEN USER SELECTS A PLAYER ICON
    if (playerCount.value === 11) return
    // if (auth.sport?.toLowerCase().includes("tackle")) {
    //   if (playerCount.value === 10) return // stops at 11
    // }
    // if (auth.sport?.toLowerCase().includes("flag")) {
    //   if (playerCount.value === 9) return // stops at 9
    // }
    if (pos === 'qb') {
      if (hasQB.value === 1) return
      hasQB.value++
    }
    if (pos === 'fb') {
      if (hasFB.value === 1) return
      hasFB.value++
    }
    if (pos === 'tb') {
      if (hasTB.value === 1) return
      hasTB.value++
    }
    if (pos === 'c') {
      if (hasC.value === 1) return
      hasC.value++
    }
    if (pos === 'g') {
      if (hasG.value === 2) return
      x = hasG.value === 0 ? .56 : .44
      hasG.value++
    }
    if (pos === 't') {
      if (hasT.value === 2) return
      x = hasT.value === 0 ? .62 : .38
      hasT.value++
    }
    if (pos === 'wr') {
      if (hasWR.value === 2) return
      x = hasWR.value === 0 ? .80 : .20
      hasWR.value++
    }
    if (pos === 'sl') {
      if (hasSL.value === 2) return
      x = hasSL.value === 0 ? .7 : .3
      hasSL.value++
    }
    if (pos === 'te') {
      if (hasTE.value === 2) return
      x = hasTE.value === 0 ? .655 : .345
      hasTE.value++
    }
    if (pos === 'rb') {
      if (hasRB.value === 2) return
      x = hasRB.value === 0 ? .55 : .45
      hasRB.value++
    }
    playerCount.value++
    players.value.push({ id: crypto.randomUUID(), pos, x, y }) // add to payload
  }
  const clearPlayers = () => {
    canvasRef.value?.clearMe()
    players.value = []
    clearAllPositionCount()
  }
  const makeActiveTool = (tool: 'erase' | 'select') => {
    if (activeTool.value === 'select') {
      activeTool.value = tool
    } else {
      activeTool.value = 'select'
    }
  }
  // const startDrag = (id: string, pos: string, e: PointerEvent) => {
  //   noPanel()
  //     if (activeTool.value === 'erase') {
  //       players.value = players.value.filter(p => p.id !== id)
  //       playerCount.value--
  //       if (pos === 'qb') hasQB.value = 0
  //       if (pos === 'c') hasC.value = 0
  //       if (pos === 'g') hasG.value = 0
  //       if (pos === 't') hasT.value = 0
  //       if (pos === 'wr') hasWR.value = 0
  //       if (pos === 'rb') hasRB.value = 0
  //       if (pos === 'fb') hasFB.value = 0
  //       if (pos === 'tb') hasTB.value = 0
  //       if (pos === 'te') hasTE.value = 0
  //       if (pos === 'sl') hasSL.value = 0
  //       return
  //     }
  //     const el = container.value
  //     if (!el) return
  //     el.setPointerCapture(e.pointerId)
  //     activeId = id
  //     el.addEventListener('pointermove', onDrag)
  //     el.addEventListener('pointerup', stopDrag)
  // }

  const startDrag = (id: string, pos: string, e: PointerEvent) => {
  noPanel()

  if (activeTool.value === 'erase') {
    players.value = players.value.filter(p => p.id !== id)
    playerCount.value--

    if (pos === 'qb') hasQB.value = 0
    if (pos === 'c') hasC.value = 0
    if (pos === 'g') hasG.value = 0
    if (pos === 't') hasT.value = 0
    if (pos === 'wr') hasWR.value = 0
    if (pos === 'rb') hasRB.value = 0
    if (pos === 'fb') hasFB.value = 0
    if (pos === 'tb') hasTB.value = 0
    if (pos === 'te') hasTE.value = 0
    if (pos === 'sl') hasSL.value = 0

    return
  }

  activeId = id

  const el = container.value
  if (!el) return

  el.setPointerCapture(e.pointerId)
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
  const changeColor = (prop: ColorType) => {

    selectedColor.value = prop
  }
  const changeTool = (prop: ToolType) => {
    selectedTool.value = prop
  }
  const addFormation = async () => {
    if (!checkErrors('formation')) return
    let formload
    try {
    if (auth.user) {
      formload = {
        formationName: newFormation.value,
        grid: {
          players: players.value
        },
        ownerId: auth.user.id
      }
      await forms.createFormation(formload)
    }
    if (gst.guest) {
      formload = {
        formationName: newFormation.value,
        grid: {
          players: players.value
        },
        guestId: gst.guest.id
      }
      await gst.createGuestFormation(formload)
      gst.getGuestFormations(gst.guest?.id)
    }
    } catch (err: any) {
      if (err.message === 'Guest formation limit reached') {
        errors.value.push({ txt: 'You have reached your formation limit', cls:'reg' })
        errorsShow.value = true
        return
      }
      console.error(err)
    }
    
    dropDownsPlayType.value.formation.newLst.push(newFormation.value)
    dropDownsPlayType.value.formation.newLst.sort((a, b) => a.localeCompare(b))
    newFormation.value = ""
    router.push('/create')
  }
  const gatherAllFormations = () => {
    // Gets all formations and places them in formations list
    dropDownsPlayType.value.formation.newLst = []
    if (auth.user) {
      for (const i of forms.formations) {
        dropDownsPlayType.value.formation.newLst.push(i.formationName)
        dropDownsPlayType.value.formation.newLst.sort();
      }
    }
    if (gst.guest) {
      for (const i of gst.guestFormations) {
        dropDownsPlayType.value.formation.newLst.push(i.formationName)
        dropDownsPlayType.value.formation.newLst.sort();
      }
    }
    dropDownsPlayType.value.formation.newLst.sort((a, b) => a.localeCompare(b))
  }
  const clearErrors = () => {
    errorsShow.value = false
    errors.value = []
  }
  const clearAllPositionCount = () => {
    playerCount.value = 0
    hasC.value = 0
    hasG.value = 0
    hasT.value = 0
    hasQB.value = 0
    hasFB.value = 0
    hasRB.value = 0
    hasTB.value = 0
    hasTE.value = 0
    hasWR.value = 0
    hasSL.value = 0
  }
  const closeBox = () => {
    playSuccess.value = false;
  }
  //WATCH
  // watch when a new formation dropdown is chosen
  // watch(() => dropDownsPlayType.value.formation.newValue, (f: string) => {
  //   clearPlayers() // gets rid of every player on the screen
  //   clearAllPositionCount() // clear all positions
  //   const myForm = forms.formations.find( formation => formation.formationName === f )
  //   if (myForm) {
  //     for (const player of myForm.grid.players) {
  //       addPlayer(player.pos, player.x, player.y)
  //     }
  //   }
  // })

  watch(() => dropDownsPlayType.value.formation.newValue, (f: string) => {
  clearPlayers()
  
  let myForm
  if (auth.user) {
    myForm = forms.formations.find(
      formation => formation.formationName === f
    )
  }
  if (gst.guest) {
    myForm = gst.guestFormations.find(
    formation => formation.formationName === f
    )
  }

  if (myForm) {
    for (const player of myForm.grid.players) {
      players.value.push({
        id: crypto.randomUUID(),
        pos: player.pos,
        x: player.x,
        y: player.y
      })

      playerCount.value++
    }
  }
})

  //OnMOUNTED
  onMounted(async () => {
    if (auth.user) {
      if (!forms.formations.length) {
        await forms.fetchFormations()
      } 
    }
    if (gst.guest) {
      await gst.getGuestFormations(gst.guest.id)
    }
    gatherAllFormations()
  })

const shrinkBox = ref<boolean>(false)
const shownBox =  ref<string>('')
const showBox = (p:string) => {
  if (shownBox.value === p) {
    shrinkBox.value = false
    shownBox.value = ''
  } else {
    shrinkBox.value = true
    shownBox.value = p
  }
  
}


const colorFlip = ref<boolean>(false)
const changePosColor = () => {
  colorFlip.value = !colorFlip.value
}


const extendPop = ref<boolean>(false)
const infoShow = ref<boolean>(false)
const formationShow = ref<boolean>(false)
const positionShow = ref<boolean>(false)
const penShow = ref<boolean>(false)


const showInfo = () => {
  if (extendPop.value && infoShow.value) {
    extendPop.value = false
  } else {
    extendPop.value = true
  }
  penShow.value = false
  infoShow.value = true
  formationShow.value = false
  positionShow.value = false
}
const showFormationMenu = () => {
  if (extendPop.value && formationShow.value) {
    extendPop.value = false
  } else {
    extendPop.value = true
  }
  penShow.value = false
  formationShow.value = true
  infoShow.value = false
  positionShow.value = false
}
const showPositionsMenu = () => {
  if (extendPop.value && positionShow.value) {
    extendPop.value = false
  } else {
    extendPop.value = true
  }
  penShow.value = false
  positionShow.value = true
  formationShow.value = false
  infoShow.value = false
}
const showPenMenu = () => {
  if (extendPop.value && penShow.value) {
    extendPop.value = false
  } else {
    extendPop.value = true
  }
  penShow.value = true
  positionShow.value = false
  formationShow.value = false
  infoShow.value = false
}

</script>

<template>
  <main>
    <h1>CREATE YOUR PLAY</h1>
    <section class="playCreator">
      <div class="secA">
        <div class="sectional a">
          <button class="info">i</button>
          <Header title="PLAY INFORMATION" icon="clipboard" />
          <form @submit.prevent class="submitForm">
            <div class="inputCont a">
            <label>Play Name<input placeholder="Name" type="text" v-model="title" /></label>
            </div>
            <div class="inputCont a">
              <div class="selectHolder">
              <label>Choose Your Play Type:
              <button aria-label="Play Type Drop" class="dropDownInd" @pointerdown="showPlayTypes()">{{ dropDownsPlayType.ptype.newValue }}</button>
              <div class="dropDownCase" v-if="showPlayType">
              <div>
              <button :aria-label="`${f} Option`" v-for="f in dropDownsPlayType.ptype.newLst" :key="f" @pointerdown="playTypeValue('ptype', f)">{{f}}</button>
              </div>
              </div>
              </label>
              </div>
            </div>
            <div class="btCont">
              <button aria-label="Submit Play" class="primaryBt" @click="submitPlay">Submit Play</button>
            </div>
          </form>
        </div>
        <div class="sectional b">
          <Header title="FORMATIONS" icon="formation" />
          <form @submit.prevent class="submitForm">
            <div class="inputCont a">
              <div class="selectHolder">
                <label>Choose Your Formation:
                <button aria-label="Formations Select" class="dropDownInd" @pointerdown="showFormations()">{{ dropDownsPlayType.formation.newValue }}</button>
                <div class="dropDownCase" v-if="showFormation">
                <div class="short">
                <button :aria-label="`${f} Formation Option`" v-for="f in dropDownsPlayType.formation.newLst" :key="f" @pointerdown="formationType('formation', f)">{{f}}</button>
                </div>
                </div>
                </label>
              </div>
            </div>
            <div class="inputCont inline">
              <button aria-label="Add Formation" @click="addFormation">+NEW</button>
              <label><input placeholder="New Formation" type="text" v-model="newFormation" /></label>
            </div>
          </form>
        </div>
      </div>
      <div class="secB" :class="{ active : extendPop }">
        <div class="topButtonCont">
          <button :class="{active : activeTool === 'select'}" @click="makeActiveTool('select')">
            <div class="icon pointer"></div>
            MOVE
          </button>
          <button :class="{active : activeTool === 'erase'}" @click="makeActiveTool('erase')">
            <div class="icon trash"><div></div><div></div></div>
            DELETE
          </button>
          <button :class="{color : colorFlip }" @click="changePosColor()">COLOR/B&W</button>
          <button class="clearBt" @click="clearPlayers()">
            <div class="icon clear"></div>
            CLEAR
          </button>
        </div>
        <div class="sectional">
          <div class="errorsShow" v-if="errorsShow" @click="clearErrors()">
            <div class="errorCont">
              <p v-for="(e,index) in errors" :key="'error_'+index" :class="e.cls">{{ e.txt }}</p>
            </div>
          </div>
          <p class="success" v-if="playSuccess"><button @click="closeBox()">X</button>PLAY CREATED!</p>
          <p class="pc" v-if="playerCount">Player Count: <span class="complete" v-if="playerCount === 11">COMPLETE</span><span v-else>{{ playerCount }}</span></p>
          <div class="field">
            <PlayCanvas ref="canvasRef" makerMode="maker" class="canvas" @update:strokes="myStrokes = $event" :color="selectedColor" :tool="selectedTool" />
            <div 
            class="positionBox"
            ref="container" 
            @pointermove="onDrag"
            @pointerup="stopDrag"
            @pointercancel="stopDrag"
          >
            <div
              v-for="p in players"
              :key="p.id"
              class="player"
              :myText="p.pos"
              :class="[{color: colorFlip }, p.pos, { remove: activeTool === 'erase'} ]"
              :style="{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }"
              @pointerdown="(e) => startDrag(p.id, p.pos, e)"
            >
            {{ p.pos }}
            </div>
          </div>
          <div class="gridBox">
            <div class="logoCont">
              <img src="@/assets/images/PlayRoutesBWsm.png" />
            </div>
            <div class="lineOfScrimmage" />
            <div class="gridLine" v-for="g in 6" :key="g" />
          </div>
          </div>
        </div>
      </div>
      <div class="secC">
        <div class="sectional pos">
          <button class="info">i</button>
          <Header title="POSITIONS" icon="formation" />
          <div class="positions">
            <div class="posCont" v-for="p in positionList" :key="`${p.pos}_bt`" @pointerdown="addPlayer(p.pos, p.x, p.y)">
              <button :aria-label="`${p.pos}`" >{{ p.pos.toUpperCase() }}</button>
            </div>
          </div> 
        </div>
        <div class="sectional pos">
          <button class="info">i</button>
          <Header title="PEN STYLE" icon="formation" />
          <div class="pens">
            <div class="posCont">
              <button aria-label="Pen Stroke" :class="{ active: selectedTool === 'pen' }" @pointerdown="changeTool('pen')"><img src="@/assets/images/pen.png" /></button>
            </div>
            <div class="posCont">
              <button aria-label="Chalk Stroke" :class="{ active: selectedTool === 'chalk' }" @pointerdown="changeTool('chalk')"><img src="@/assets/images/chalk.png" /></button>
            </div>
            <div class="posCont">
              <button aria-label="Dash Stroke" :class="{ active: selectedTool === 'dash' }" @pointerdown="changeTool('dash')"><img src="@/assets/images/dash.png" /></button>
            </div>
          </div> 
          <Header title="PEN COLOR" icon="formation" />
          <div class="colors">
            <div class="posCont">
              <button class="white" :class="{ active: selectedColor === 'white' }" aria-label="Pen Stroke" @pointerdown="changeColor('white')"></button>
            </div>
            <div class="posCont">
              <button class="red" :class="{ active: selectedColor === 'red' }" aria-label="Pen Stroke" @pointerdown="changeColor('red')"></button>
            </div>
            <div class="posCont">
              <button class="blue" :class="{ active: selectedColor === 'blue' }" aria-label="Pen Stroke" @pointerdown="changeColor('blue')"></button>
            </div>
            <div class="posCont">
              <button class="yellow" :class="{ active: selectedColor === 'yellow' }" aria-label="Pen Stroke" @pointerdown="changeColor('yellow')"></button>
            </div>
          </div>
        </div>
      </div>
      <div class="secD">
        <div class="mobileCont">
          <button @click="showInfo()" class='playInfo'><div>i</div></button>
          <button @click="showFormationMenu()" class='formations'><div><img src="@/assets/images/formation.png"/></div></button>
          <button @click="showPositionsMenu()" class='positions'><div></div></button>
          <button @click="showPenMenu()" class='penSelect'><div></div></button>
        </div>
      </div>
      <div class="secE" v-if="extendPop">
        <!-- MOBILE PLAY INFO -->
        <div class="sectional" v-if="infoShow">
          <Header title="PLAY INFORMATION" icon="clipboard" />
          <form @submit.prevent class="submitForm">
            <div class="inputCont a">
            <label>Play Name<input placeholder="Name" type="text" v-model="title" /></label>
            </div>
            <div class="inputCont a">
            <div class="selectHolder">
            <label>Choose Your Play Type:
            <button aria-label="Play Type Drop" class="dropDownInd" @pointerdown="showPlayTypes()">{{ dropDownsPlayType.ptype.newValue }}</button>
            <div class="dropDownCase" v-if="showPlayType">
            <div>
            <button :aria-label="`${f} Option`" v-for="f in dropDownsPlayType.ptype.newLst" :key="f" @pointerdown="playTypeValue('ptype', f)">{{f}}</button>
            </div>
            </div>
            </label>
            </div>
            </div>
            <div class="btCont">
              <button aria-label="Submit Play" class="primaryBt" @click="submitPlay">Submit Play</button>
            </div>
          </form>
        </div>
        <!-- MOBILE FORMATION INFO -->
        <div class="sectional" v-if="formationShow">
          <Header title="FORMATIONS" icon="formation" />
          <form @submit.prevent class="submitForm">
            <div class="inputCont a" style="margin-bottom:0px;">
              <div class="selectHolder">
                <label>Create New Formation:</label>
              </div>
            </div>
            <div class="inputCont inline">
              <button aria-label="Add Formation" @click="addFormation">+NEW</button>
              <label><input placeholder="New Formation" type="text" v-model="newFormation" /></label>
            </div>
            <div class="inputCont a">
              <div class="selectHolder">
                <label>Choose Your Formation:
                <button aria-label="Formations Select" class="dropDownInd" @pointerdown="showFormations()">{{ dropDownsPlayType.formation.newValue }}</button>
                <div class="dropDownCase" v-if="showFormation">
                <div class="shortMob">
                <button :aria-label="`${f} Formation Option`" v-for="f in dropDownsPlayType.formation.newLst" :key="f" @pointerdown="formationType('formation', f)">{{f}}</button>
                </div>
                </div>
                </label>
              </div>
            </div>
            
          </form>
        </div>
        <!-- MOBILE POSITIONS INFO -->
        <div class="sectional" v-if="positionShow">
          <Header title="POSITIONS" icon="formation" />
          <div class="positions">
            <div class="posCont" v-for="p in positionList" :key="`${p.pos}_bt`" @pointerdown="addPlayer(p.pos, p.x, p.y)">
              <button :aria-label="`${p.pos}`" >{{ p.pos.toUpperCase() }}</button>
            </div>
          </div> 
        </div>
        <div class="sectional" v-if="penShow">
          <Header title="PEN STYLE" icon="formation" />
          <div class="pens">
            <div class="posCont">
              <button aria-label="Pen Stroke" :class="{ active: selectedTool === 'pen' }" @pointerdown="changeTool('pen')"><img src="@/assets/images/pen.png" /></button>
            </div>
            <div class="posCont">
              <button aria-label="Chalk Stroke" :class="{ active: selectedTool === 'chalk' }" @pointerdown="changeTool('chalk')"><img src="@/assets/images/chalk.png" /></button>
            </div>
            <div class="posCont">
              <button aria-label="Dash Stroke" :class="{ active: selectedTool === 'dash' }" @pointerdown="changeTool('dash')"><img src="@/assets/images/dash.png" /></button>
            </div>
          </div> 
          <Header title="PEN COLOR" icon="formation" />
          <div class="colors">
            <div class="posCont">
              <button class="white" :class="{ active: selectedColor === 'white' }" aria-label="White Pen Stroke" @pointerdown="changeColor('white')"></button>
            </div>
            <div class="posCont">
              <button class="red" :class="{ active: selectedColor === 'red' }" aria-label="Red Pen Stroke" @pointerdown="changeColor('red')"></button>
            </div>
            <div class="posCont">
              <button class="blue" :class="{ active: selectedColor === 'blue' }" aria-label="Blue Pen Stroke" @pointerdown="changeColor('blue')"></button>
            </div>
            <div class="posCont">
              <button class="yellow" :class="{ active: selectedColor === 'yellow' }" aria-label="Yellow Pen Stroke" @pointerdown="changeColor('yellow')"></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>