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

  const delForm = (id:string) => {
    forms.deleteFormation(id)
  }

  let selectedFormation = ''
  let selectedFormationName = ''
  const areYouSure = ref<boolean>(false);
  const triggerPrompt = (p: string, n: string) => {
    selectedFormationName = n
    areYouSure.value = true
    selectedFormation = p
  }
  const popMenu = ref<number>()
  const showMenu = (i: number) => {
    if (popMenu.value === i) { 
      popMenu.value = -1
      return true
    }
    popMenu.value = i
  }

  const formDelete = (num: number) => {
    num === 0 ? forms.deleteFormation(selectedFormation) : ''
    areYouSure.value = false
  }


  
</script>
<template>
    <div class="authDelete" v-if="areYouSure">
    <p>Delete:</p>
    <h3>DELETE {{ selectedFormationName }}</h3>
    <button @click="formDelete(0)">DELETE</button>
    <button @click="formDelete(1)">NOPE</button>
  </div>
  <main>
    <h1>Your Formations</h1>
    <section class="playsContainer form" >
      <div class="playRows">
        <div v-for="(p, index) in myForms" :key="p.id" class="indPlays">
          <h5>{{ p.formationName }}</h5>
          <div class="field">
            <div class="addedPlayers xs">
              <Player :players="p.grid.players" :num="88" />
            </div>
          </div>
          <button class="primaryBt b" style="width:100%;" @click="forms.deleteFormation(p.id)">DELETE</button>
        </div>
      </div>
    </section>
  </main>
</template>