<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'
  import router from '@/router'
  import { useAuthStore } from '@/stores/userAuth'
  defineProps<{ axis: string }>()
  const auth = useAuthStore()
  const routes = computed(() => {
    return router.getRoutes().filter(route => {
      if (route.name === 'Login' && auth.user) {
        // return false
      }
      return true
    })
  })
</script>
<template>
  <nav :class="axis">
    <ul>
      <li v-for="route in routes" :key="route.path">
        <RouterLink :to="route.path">{{ route.name }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>