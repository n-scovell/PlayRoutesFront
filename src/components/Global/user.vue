<script setup lang="ts">
  import { ref, computed, watch  } from 'vue'
  import router from '@/router'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/userAuth'
  import { RouterLink } from 'vue-router'

  const route = useRoute()
  const showDrop = ref<boolean>(false)
  const auth = useAuthStore()
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
      <button class="avatar" @pointerdown="revealDrop"></button>
    </div>
    <h3>
      <span v-if="auth.user" style="margin-right:5px;">{{auth.teamName}}</span> 
      <span v-else style="margin-right:5px;">SIGN UP WITH</span> 
       PLAY BOOK
    </h3>
    <!-- <div class="drop" v-if="showDrop">
      <div v-if="auth.user">
        <button v-for="route in routes" :key="route.path">
            <RouterLink :to="route.path">
                <div>{{ route.name }}</div>
            </RouterLink>
        </button>
        <RouterLink to="/profile"></RouterLink>
        <button @pointerdown="signOut">Log Out</button>
      </div>
      <button v-if="!auth.user">Create Account</button>
    </div> -->
  </div>
</template>
<style lang="scss">
  $w: 50px;
  .userCont {
    height:100%;
    display:flex;
    position:relative;
    left:0px;
    gap:10px;
    .avatarCont {
      width:$w;
      display:flex;
      align-items:center;
      justify-content:center;
      .avatar {
        width:$w;
        height:$w;
        background:purple;
        border-radius:50%;
      }
    }
    h3 {
      display:flex;
      justify-content:center;
      align-items:center;
      color:white;
    }
    // .drop {
    //   width:300px;
    //   padding:20px;
    //   background:rgba(0,0,0,.9);
    //   position:absolute;
    //   top:0px;
    //   left:0px;
    //   z-index:9;
    //   padding-top:60px;
    //   button {
    //     width:100%;
    //     text-align:left;
    //     background:transparent;
    //     color:white;
    //     padding:10px;
    //     margin:5px 0px;
    //     font-size:15px;
    //     font-weight:bold;
    //     cursor:pointer;
    //   }
    // }
    // .avatar {
    //   width:$w;
    //   height:$w;
    //   border-radius:50%;
    //   background:rgba(255,255,255,.5);
    //   position:relative;
    //   top:50%;
    //   left:30px;
    //   transform:translate(0%, -50%);
    //   z-index:10;
    // }
    // h3 {
    //   color:white;
    //   position:absolute;
    //   top:50%;
    //   left:$w + 35px;
    //   z-index:10;
    //   transform:translate(0%, -50%);
    // }
  }
</style>