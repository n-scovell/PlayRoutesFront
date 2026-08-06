<script setup lang="ts">
  import { onMounted  } from 'vue'
  import { useFormation } from '@/stores/formStore'
  import Player from '../components/Player.vue'
  const forms = useFormation()
  onMounted(async () => {
    if (!forms.formations.length) {
      await forms.fetchFormations()
    }
  })
  const delForm = (id:string) => {
    forms.deleteFormation(id)
  }
</script>
<template>
  <main>
    <h1>Your Formations</h1>
    <section class="playsContainer fav" >
      <div class="playRows">
        <div v-for="(p, index) in forms.formations" :key="p.id" class="indPlays">
          <h4>{{ p.formationName }}</h4>
          <div class="field">
            <div class="addedPlayers xs">
              <Player :players="p.grid.players" :num="88" />
            </div>
          </div>
          <button class="primaryBt" @click="delForm(p.id)">DELETE</button>
        </div>
      </div>
    </section>
  </main>
</template>