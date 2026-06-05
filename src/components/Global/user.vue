<script setup lang="ts">
  import { ref, computed, watch  } from 'vue'
  import router from '@/router'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/userAuth'
  import { RouterLink } from 'vue-router'

  const route = useRoute()
  const showDrop = ref<boolean>(false)
  const auth = useAuthStore()

  const imgSrc = computed(() => {
    return new URL(`../../assets/icons/alph/${auth.teamName![0]}.png`, import.meta.url).href
  })

  const revealDrop = () => {
    showDrop.value = !showDrop.value
  }
  const signOut = () => {
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

</script>
<template>
  <div class="userCont">
    <div class="avatarCont" v-if="auth.user">
      <button class="avatar" @pointerdown="revealDrop">
        <img :src="imgSrc" />
      </button>
    </div>
    <h3>
      <span v-if="auth.user" style="margin-right:5px;">{{auth.teamName}}</span> 
      <span v-else style="margin-right:5px;"><RouterLink to="/">SIGN UP</RouterLink></span> 
    </h3>
    <div class="drop" v-if="showDrop">
      <div v-if="auth.user">
        <button v-for="route in routes" :key="route.path">
            <RouterLink :to="route.path">
                <div>{{ route.name }}</div>
            </RouterLink>
        </button>
        <!-- <RouterLink to="/profile"></RouterLink> -->
        <button @pointerdown="signOut">Log Out</button>
      </div>
      <button v-if="!auth.user">Create Account</button>
    </div>
  </div>
</template>
<style lang="scss">
  $w: 50px;
  .userCont {
    height:100%;
    display:flex;
    position:absolute;
    right:0px;
    gap:10px;
    padding-right:10px;
    .avatarCont {
      width:$w;
      display:flex;
      align-items:center;
      justify-content:center;
      .avatar {
        width:$w;
        height:$w;
        background:transparent;
        border-radius:50%;
        position:relative;
        overflow:hidden;
        cursor:pointer;
        img {
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          z-index:1;
        }
        &:after {
          $w:80%;
          content:' ';
          width:$w;
          height:$w;
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          background:rgb(60, 55, 134);
          border-radius:50%;
          border:3px solid white;
        }
      }
    }
    h3 {
      display:flex;
      display:none;
      justify-content:center;
      align-items:center;
      color:white;
      a {
        color:inherit;
        text-decoration:underline;
      }
    }
    .drop {
      width:300px;
      background:rgba(0,0,0,.5);
      position:absolute;
      top:100%;
      right:0px;
      z-index:555;
      display:flex;
      flex-wrap:wrap;
      flex-direction:column;
      padding:20px;
      button {
        display:block;
        background:transparent;
        color:white;
        padding:5px 10px;
      }
    }
    
  }
</style>