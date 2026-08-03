<script setup lang="ts">
// import { ref, useState } from 'vue'
import { useAuthStore } from '../stores/userAuth'
// import { Image } from '@unpic/vue'
// import fieldImage from '@/assets/images/field.jpg'
import { RouterLink } from 'vue-router'
// import '../assets/home.css'
const auth = useAuthStore()


const hdrA = `
Play Routes is an online football playbook builder 
designed for coaches at every level.
`
const hdrB = `
Create custom offensive plays, organize your formations, 
and build a playbook that's always available whenever inspiration strikes.
`

</script>
<template>
    <div class="homePageBanners">
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
              <button>CREATE PLAY</button>
            </RouterLink>
          </div>
        </div>
        <img src="@/assets/images/field.jpg" width="100%" class="fieldImage" />
      </section>
      <section class="instruction">
          <div class="arrowBox">
            <img src="@/assets/images/circleArrow.png" />
          </div>
          <div class="textBox">
            <h3>{{hdrA}}</h3>
            <p>{{hdrB}}</p>
          </div>
      </section>
      <section class="guestUsage">
          <div class="textBox">
            <div class="left">
              <img src="@/assets/images/playFun.png" class="imgA" />
              <img src="@/assets/images/playFunB.png" class="imgB" />
              <h2>Don't have an</h2>
              <h2 class="highlight">Account?</h2>
              <h3>That's OK!</h3>
              <h4>We get it! You want to be sure of what <strong>Play Routes</strong> <br>does and how it can help you get the <strong>W</strong>.</h4>
              <h5>So go ahead and use it as a guest</h5>
              <h5 class="highlight">For the time being.</h5>
              <button type="button" class="primaryBt">Use as Guest</button>
            </div>
            <div class="right">
              <ul>
                <h3>You'll have access to:</h3>
                <li> <img src="@/assets/images/clipboard.png" class="ico" /> <strong>4</strong> Plays</li>
                <li> <img src="@/assets/images/formation.png" class="ico" /> <strong>2</strong> Formations</li>
                <li>
                  <img src="@/assets/images/playbook.png" class="ico" />
                  <div>
                    Playbook access
                    <p>Without enlarging or play sharing</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
      </section>
      
    </div>
</template>