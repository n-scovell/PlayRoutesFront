<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/userAuth'
const auth = useAuthStore()
const showNav = ref<boolean>(true)
const togNav = () => {
    showNav.value = !showNav.value
}
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
    <nav>
        <button @click="togNav" class="menuTog"><div class="bar" v-for="i in 3" :key="'bar'+i"><div></div><div></div></div></button>
        <div v-if="showNav">
            <button class="icoBt" v-for="route in routes" :key="route.path">
                <RouterLink :to="route.path">
                    <div class="ico" :class="route.meta.icon"></div>
                </RouterLink>
            </button>
        </div>
    </nav>
</template>