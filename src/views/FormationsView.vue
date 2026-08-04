<script setup lang="ts">
import { ref, watch, onMounted  } from 'vue'
import { useFormation } from '@/stores/formStore'
import { useAuthStore } from '../stores/userAuth'
import Player from '../components/Player.vue'

import type { ColorType, ToolType } from '@/composables/usePlayCanvasB'

const forms = useFormation()
const auth = useAuthStore()

onMounted(async () => {
  if (!forms.formations.length) {
    await forms.fetchFormations()
  }

})


</script>
<template>
  <main>
    <h1>Your Formations</h1>
    <section class="playsContainer fav" >
      <div class="playRows">
        <div v-for="(p, index) in forms.formations" :key="p.id" class="indPlays">
          <div class="field">
            <div class="addedPlayers xs">
              <Player :players="p.grid.players" />
            </div>
          </div>
          <div class="playInfo">
            <h3>{{ p.formationName }}</h3>
            <button class="primaryBt" @click="forms.deleteFormation(p.id)">DELETE</button>
          </div>
        </div>
      </div>
    </section>
    <!-- <PlayCanvas
      makerMode="small"
      class="canvas"
      :strokesData="p.grid.strokes"
      :color="selectedColor" :tool="selectedTool"
    /> -->
  </main>
</template>
<style lang="scss">
</style>