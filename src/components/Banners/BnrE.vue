<script setup lang="ts">
  const header = 'BUILT FOR THE SIDELINE'
  const listTxt = [
    'Save formations for automatic player placement',
    'Draw routes with simple, intuitive tools',
    'Identify players at a glance'
  ]
</script>
<template>
  <section class="screenShot">
    <div class="textBox">
      <div class="left">
        <img alt="PR iPad Shot" src="@/assets/images/ipadShotA.jpg" />
      </div>>
      <div class="right">
        <img alt="Play Routes Orb Logo" src="@/assets/images/PlayRoutesBW_Orb.png" class="prLogo" />
        <div class="txt">
          <h2>{{header}}</h2>
          <ul>
            <li v-for="(l, index) in listTxt" :key="index+'_txt'">{{ l }}</li>
          </ul>
        </div>
      </div>
      
    </div>
  </section>
</template>