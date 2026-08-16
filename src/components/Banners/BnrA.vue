<script setup lang="ts">
import { useAuthStore } from '../../stores/userAuth'
import { RouterLink } from 'vue-router'
import { useGuest } from '@/stores/guestStore'
const auth = useAuthStore()
const gst = useGuest()
</script>
<template>
      <section class="createAccount">
        <div class="mid">
          <img alt="PRArrow" src="@/assets/images/PlayRoutesBW.png" />
          <h3>PLAYER <span class="alt">ROUTES</span></h3>
          <h4>PLAN, PREPARE, PERFORM</h4>
          <div class="btCont" v-if="!auth.user">
            <RouterLink to="/register">
              <button  aria-label="Register Button" class="primaryBt">
                <span v-if="gst.guest">GUEST REGISTER</span>
                <span v-else>REGISTER</span>
              </button>
            </RouterLink>
            <RouterLink to="/login">
              <button  aria-label="Login Button" class="primaryBt">LOGIN</button>
            </RouterLink>
            <RouterLink to="/login" v-if="!gst.guest">
              <button aria-label="Guest Button" class="primaryBt">GUEST</button>
            </RouterLink>
          </div>
          <div class="btCont" v-else>
            <RouterLink to="/create">
              <button aria-label="Creat Play Button" class="primaryBt">CREATE PLAY</button>
            </RouterLink>
          </div>
        </div>
        <img alt="PR Field" src="@/assets/images/PRBack.jpg" width="100%" class="fieldImage" />
      </section>
</template>