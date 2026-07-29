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
        if (route.name === 'Home' || route.name === 'Login' && !auth.user) return true
        if (route.meta.active === 'topNav' && auth.user) {
            return true
        }
    })
})
</script>
<template>
    <nav>
        <button class="icoBt" v-for="route in routes" :key="route.path">
            <RouterLink :to="route.path">
                <button>{{ route.name }}</button>
            </RouterLink>
        </button>
    </nav>
</template>

<style lang="scss">
// nav {
//     position:relative;
//     top:0px;
//     left:100px;
//     button {
//     color:white;
//     font-size:25px;
//     background:none;
//     }
// }
</style>