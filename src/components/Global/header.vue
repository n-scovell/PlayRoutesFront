<script setup lang="ts">
    import Avatar from '@/components/Global/user.vue'
    import NewMenu from '@/components/Global/navigation.vue'
    import { useAuthStore } from '@/stores/userAuth'
    import { RouterLink } from 'vue-router'
    const auth = useAuthStore()
</script>
<template>
    <header>
        <RouterLink to="/" class="logo">
            <img alt="Play Routes Logo" src="@/assets/images/PlayRoutesBW.png" />
        </RouterLink>
        <NewMenu />
        <Avatar /> 
    </header>
</template>