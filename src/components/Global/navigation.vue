<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/userAuth'
const auth = useAuthStore()
const showNav = ref<boolean>(false)
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
const alertMe = () => {
    showNav.value = false
}
</script>
<template>
    <nav>
        <button class="ham" @click="togNav()">
            <div></div><div></div><div></div>
        </button>
        <div class="mobNav" :class="{show : showNav}">
            <button class="close" @click="togNav()">✕</button>
            <div class="icoBt" v-for="route in routes" :key="route.path">
                <RouterLink :to="route.path">
                    <button @click="alertMe()">{{ route.name }}</button>
                </RouterLink>
            </div>
        </div>
        <div class="deskNav">
            <button class="icoBt" v-for="route in routes" :key="route.path">
                <RouterLink :to="route.path">
                    <button>{{ route.name }}</button>
                </RouterLink>
            </button>
        </div>
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