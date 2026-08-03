<script setup lang="ts">
import { useAuthStore } from '../../stores/userAuth'
import { RouterLink } from 'vue-router'
const auth = useAuthStore()
</script>
<template>
      <section class="createAccount">
        <div class="mid">
          <img src="@/assets/images/PlayRoutesBW.png" />
          <h3>PLAY <span class="alt">ROUTES</span></h3>
          <h4>PLAN, PREPARE, PERFORM</h4>
          <div class="btCont" v-if="!auth.user">
            <RouterLink to="/register">
              <button class="primaryBt">REGISTER</button>
            </RouterLink>
            <RouterLink to="/login">
            <button class="primaryBt">LOGIN</button>
            </RouterLink>
            <button class="primaryBt">GUEST</button>
          </div>
          <div class="btCont" v-else>
            <RouterLink to="/create">
              <button class="primaryBt">CREATE PLAY</button>
            </RouterLink>
          </div>
        </div>
        <img src="@/assets/images/field.jpg" width="100%" class="fieldImage" />
      </section>
</template>