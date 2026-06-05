<script setup lang="ts">
import Avatar from '@/components/Global/user.vue'
import NewMenu from '@/components/Global/topNav.vue'
import { useAuthStore } from '@/stores/userAuth'
import { RouterLink } from 'vue-router'
const auth = useAuthStore()

</script>
<template>
    <header>
        <RouterLink to="/">
          <img src="@/assets/images/PlayRoutesBW.png" style="opacity:1;"/>
        </RouterLink>
        <NewMenu />
        <!-- <RouterLink to="/create" v-if="auth.user">
            <button class="green-bt"><div></div>Create New Play</button>
        </RouterLink> -->
        <Avatar /> 
    </header>
</template>

<style lang="scss">
$green:#0EB056;
@mixin hdrFont {
  font-family: "Fjalla One", sans-serif;
  font-weight: 400;
  font-style: normal;
}
header {
  width:100%;
  height:70px;
  background-image:url('@/assets/images/bck_blackGrain.png');
  background-repeat:no-repeat;
  border-bottom:2px solid rgba(0,0,0,.7);
  box-shadow:0 5px 15px rgba(0,0,0,.5);
  position:relative;
  @include hdrFont;
  display:flex;
  img {
    height:80%;
    position:relative;
    top:50%;
    transform:translateY(-50%);
  }
  nav {
    flex:1;
    // outline:1px solid red;
    position:relative;
    top:0px;
    display:flex;
    gap:10px;
    padding-left:20px;
    button {
      color:white;
      font-size:15px;
      font-weight:bold;
      background:transparent;
      padding:0px;
      cursor:pointer;
    }
  }
}


.green-bt {
    position:fixed;
    bottom:0px;
    right:0px;
    z-index:500;
    width:auto;
    height:40px;
    background:$green;
    // width:auto;
    // height:40px;
    padding:0px 20px;
    display:flex;
    align-items:center;
    justify-content:center;
    // background:$green;
    background: linear-gradient(180deg,rgba(12, 82, 42, 1) 0%, rgba(18, 99, 53, 1) 55%, rgba(16, 110, 52, 1) 100%);
    border-radius:7px;
    color:white;
    font-size:15px;
    font-weight:500;
    letter-spacing:0.05em;
    text-shadow:0 1px 3px rgba(0,0,0,.4);
    font-family: "Fjalla One", sans-serif;
    // position:absolute;
    // top:50%;
    // right:10px;
    // transform:translate(0%, -50%);
    border-top:1px solid rgba(255,255,255,.5);
    border-right:1px solid rgba(255,255,255,.5);
    border-left:1px solid rgba(255,255,255,.3);
    box-shadow:0 3px 5px rgba(0,0,0,.9);
    cursor:pointer;
  }
</style>