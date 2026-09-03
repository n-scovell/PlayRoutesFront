<script setup lang="ts">
  import { ref, onMounted, computed  } from 'vue'
  import { useFormation } from '@/stores/formStore'
  import { useAuthStore } from '../stores/userAuth'
  import { useGuest } from '@/stores/guestStore'
  import Player from '../components/Player.vue'

  const forms = useFormation()
  const auth = useAuthStore();
  const gst = useGuest()

  const myForms = computed(() => {
  return auth.user
    ? forms.formations
    : gst.guestFormations
  })

  onMounted(async () => {
    if (auth.user) {
      await forms.fetchFormations()
    } else if (gst.guest) {
      await gst.getGuestFormations(gst.guest.id)
    }
  })


  // const popMenu = ref<number>()
  // const showMenu = (i: number) => {
  //   if (popMenu.value === i) { 
  //     popMenu.value = -1
  //     return true
  //   }
  //   popMenu.value = i
  // }

// const formDelete = (num: number) => {
//   num === 0 ? forms.deleteFormation(selectedFormation) : ''
//   areYouSure.value = false
// }

const activeSel = ref<string>('')
const areYouSure = ref<boolean>(false);
const doubleCheck = (p:string) => {
  activeSel.value = p
  areYouSure.value = !areYouSure.value
}
const yesDelete = () => {
  areYouSure.value = false
  forms.deleteFormation(activeSel.value)
}
  
</script>


<template>
  <main>
    <h1>Your Formations</h1>
    <div class="areYouSure" v-if="areYouSure">
      <h3>ARE YOU SURE?</h3>
      <button class="primaryBt" @click="areYouSure = false">X</button>
      <button class="primaryBt" @click="yesDelete()">DELETE</button>
      <button class="primaryBt" @click="areYouSure = false">CANCEL</button>
    </div>
    <section class="playsContainer form" >
      <div class="playRows">
        <div v-for="(p, index) in myForms" :key="p.id" class="indPlays">
          <h5>{{ p.formationName }}</h5>
          <div class="field">
            <div class="addedPlayers xs">
              <Player :players="p.grid.players" :num="88" />
            </div>
          </div>
          <button class="primaryBt b" style="width:100%;" @click="doubleCheck(p.id)">DELETE</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.areYouSure {
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:80%;
  max-width:500px;
  min-width:250px;
  height:auto;
  background:black;
  outline:1px solid rgba(255,255,255,.5);
  color:white;
  font-size:20px;
  display:flex;
  flex-direction:row;
  button {
    flex:1;
  }
}
</style>