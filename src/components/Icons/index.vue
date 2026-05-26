<script setup lang="ts">
defineProps<{
  src: string,
}>()
</script>
<template>
    <!-- HOME ICON -->
    <div v-if="src === 'home'" class="icon" :class="src"></div>
    <!-- ALERT ICON -->
    <div v-else-if="src === 'error'" class="icon" :class="src">!</div>
    <!-- SUCCESS ICON -->
    <div v-else-if="src === 'success'" class="icon" :class="src">✔</div>
    <!-- UPDATE ICON -->
    <div v-else-if="src === 'update'" class="icon" :class="src">
      <div class="doc"></div>
      <div class="doc a"></div>
    </div>
    <!-- TRASH CAN -->
    <div v-else-if="src === 'trash'" class="icon" :class="src">
      <div class="lid"></div><div class="can"></div>
    </div>
    <!-- FULLSCREEN -->
    <div v-else-if="src === 'fullscreen'" class="icon" :class="src">
      <div></div><div></div><div></div><div></div>
    </div>
    <!-- CLEAR -->
    <div v-else-if="src === 'clear'" class="icon" :class="src">
      <div class="axe">X</div>
      <div class="tool"></div>
    </div>
    <!-- FIRSTDOWN -->
    <div v-else-if="src === 'firstdown'" class="icon" :class="src">
      <div class="circle"></div>
      <div class="pole"></div>
    </div>
    <!-- PEN -->
    <div v-else-if="src === 'pen'" class="icon" :class="src"></div>
    <!-- COLOR -->
    <div v-else-if="src === 'colors'" class="icon" :class="src">
      <div></div><div></div><div></div><div></div>
    </div>
    <div v-else-if="src === 'last'" class="icon" :class="src"></div>
    <div v-else-if="src === 'redo'" class="icon" :class="src"></div>
    <div v-else-if="src === 'thin'" class="icon" :class="src"></div>
    <div v-else-if="src === 'thick'" class="icon" :class="src"></div>
    <div v-else-if="src === 'faint'" class="icon" :class="src"></div>

</template>