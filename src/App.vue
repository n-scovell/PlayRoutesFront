<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import HeadSec from '@/components/Global/header.vue'
  import { useAuthStore } from '@/stores/userAuth'
  const auth = useAuthStore()
</script>
<template>
    <HeadSec />
    <section class="page">
      <RouterView v-slot="{ Component }">
          <component :is="Component" />
      </RouterView>
    </section>
</template>
