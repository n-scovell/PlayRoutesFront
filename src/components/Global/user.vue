<script setup lang="ts">
  import { ref, computed, watch  } from 'vue'
  import router from '@/router'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/userAuth'
  import { useGuest } from '@/stores/guestStore'
  import { RouterLink } from 'vue-router'

  const route = useRoute()
  const showDrop = ref<boolean>(false)
  const auth = useAuthStore()
  const gst = useGuest()


  const imgSrc = computed(() => {
    if (auth.user) {
      return new URL(`../../assets/icons/alph/${auth.teamName![0]}.png`, import.meta.url).href
    }
    if (gst.guest?.name) {
      return new URL(`../../assets/icons/alph/${gst.guest.name![0]}.png`, import.meta.url).href
    }
  })

  const avatarImg = computed(() => {
    return new URL(`../../assets/icons/alph/${auth.teamName![0]}.png`, import.meta.url).href
  })

  const revealDrop = () => {
    // if (gst.guest?.name) {
    // } else {
    showDrop.value = !showDrop.value
    // }
  }
  const signOut = () => {
    showDrop.value = false
    auth.logout()
  }
  const routes = computed(() => {
    return router.getRoutes().filter(route => {
        if (route.meta.active === 'avatar') {
            return true
        }
    })
  })
  watch(() => route.path, () => {
    showDrop.value = false
  })

  const iconSrc = computed(() => {
  if (!route.meta.icon) return ''
  return new URL(`../assets/icons/${route.meta.icon}.png`, import.meta.url).href
})

const logoutGuest = () => {
  showDrop.value = false
  gst.emptyGuest()
}

</script>
<template>
  <div class="userCont">
    <div class="avatarCont" v-if="auth.user || gst.guest?.name">
      <button class="avatar" @pointerdown="revealDrop">
        <img alt="User Logo" :src="imgSrc" />
      </button>
    </div>
    <h3>
      <span v-if="auth.user" style="margin-right:5px;">{{auth.teamName || gst.guest?.name}}</span> 
      <span v-else style="margin-right:5px;"><RouterLink to="/">SIGN UP</RouterLink></span> 
    </h3>
    <div class="userDrop" v-if="showDrop">

      <button v-for="route in routes" :key="route.path" v-if="!gst.guest">
          <RouterLink :to="route.path">
              <div>{{ route.name }}</div>
          </RouterLink>
      </button>
      <button @click="logoutGuest()">GUEST LOGOUT</button>
      <button v-if="auth.user" @pointerdown="signOut">Log Out</button>
    </div>
  </div>
</template>