<script setup lang="ts">
import { ref, watch, onMounted  } from 'vue'
import { useFormation } from '@/stores/formStore'
import { useAuthStore } from '../stores/userAuth'

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
  <main class="profile">
    <h1>YOUR Formations - {{forms.formations.length}}</h1>
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