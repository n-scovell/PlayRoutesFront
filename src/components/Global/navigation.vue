<script setup lang="ts">
    import { ref, computed } from 'vue'
    import router from '@/router'
    import { RouterLink, useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/userAuth'
    import { useGuest } from '@/stores/guestStore'
    const auth = useAuthStore()
    const gst = useGuest()
    const myRoute = useRoute()
    const showNav = ref<boolean>(false)
    const togNav = () => {
        showNav.value = !showNav.value
    }
    const routes = computed(() => {
        return router.getRoutes().filter(route => {
            if (!auth.user && !gst.guest) {
                if (route.name === 'Home' || route.name === 'Login' ) return true
            }
            if (auth.user) {
                if (route.meta.active === 'topNav') return true
            }
            if (gst.guest) {
                if (route.name === 'Home' || route.name === 'Create' || route.name === 'Playbook' || route.name === 'Formations' ) return true
            }
        })
    })
    const alertMe = () => {
        showNav.value = false
    }
</script>
<template>
    <nav>
        <button aria-label="Navigation Toggle" class="ham" @click="togNav()">
            <div></div><div></div><div></div>
        </button>
        <div class="mobNav" :class="{show : showNav}">
            <button aria-label="Close Menu" class="close" @click="togNav()">✕</button>
            <div class="icoBt" v-for="route in routes" :key="route.path">
                <div class="icon"></div>
                <RouterLink :to="route.path">
                    <button aria-label="Close Menu"  @click="alertMe()">{{ route.name }}</button>
                </RouterLink>
            </div>
        </div>
        <div class="deskNav">
            <button aria-label="Menu BT" class="icoBt" :class="{ active: route.path === myRoute.path }" v-for="route in routes" :key="route.path">
                <RouterLink :to="route.path">
                    {{ route.name }}
                </RouterLink>
            </button>
        </div>
    </nav>
</template>