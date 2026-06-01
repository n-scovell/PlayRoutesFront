<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeadSec from '@/components/Global/header.vue'
// import SideSec from '@/components/Global/sideNav.vue'
import { useAuthStore } from '@/stores/userAuth'
const auth = useAuthStore()
</script>
<template>
  <HeadSec />
  <section class="page">
    <!-- <SideSec /> -->
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </section>
</template>
