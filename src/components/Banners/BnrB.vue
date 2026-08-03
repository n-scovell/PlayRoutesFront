<script setup lang="ts">
const hdrA = `
Play Routes is an online football playbook builder 
designed for coaches at every level.
`
const hdrB = `
Create custom offensive plays, organize your formations, 
and build a playbook that's always available whenever inspiration strikes.
`
</script>
<template>
  <section class="instruction">
      <div class="arrowBox">
        <img src="@/assets/images/circleArrow.png" />
      </div>
      <div class="textBox">
        <h3>{{hdrA}}</h3>
        <p>{{hdrB}}</p>
      </div>
  </section>
</template>