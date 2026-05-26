
<script setup>
import Icon from '@/components/Icons/index.vue'
</script>

<template>
  <main class="test">
  <div class="iconContainer"><Icon src="home"/></div>
  <div class="iconContainer"><Icon src="alert"/></div>
  </main>
</template>

<style>
.test {
  display:flex;
}
.iconContainer {
  width:50px;
  height:45px;
  /* .icon {
    &:before, &:after {
      background:red;
    }
  } */
}
</style>


