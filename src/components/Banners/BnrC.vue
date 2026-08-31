<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth'
import { useGuest } from '@/stores/guestStore'
import { RouterLink } from 'vue-router'

import PlayIcon from '@/assets/icons/ico_play.svg'
import FormationIcon from '@/assets/icons/ico_formations.svg'
import PlaybookIcon from '@/assets/icons/ico_playbook.svg'
const auth = useAuthStore()
const gst = useGuest()
</script>
<template>
  <section class="guestUsage">
    <div class="textBox">
      <div class="left">
        <img alt="arrows" src="@/assets/images/playFun.png" class="imgA" />
        <img alt="extra arrows" src="@/assets/images/playFunB.png" class="imgB" />
        <h2>Don't have an</h2>
        <h2 class="highlight">Account?</h2>
        <h3>That's OK!</h3>
        <h4>We get it! You want to be sure of what <strong>Player Routes</strong> <br>does and how it can help you get the <strong>W</strong>.</h4>
        <h5>So go ahead and use it as a guest</h5>
        <h5 class="highlight">For the time being.</h5> 
        <RouterLink to="/login">
          <button aria-label="Use As Guest" v-if="!gst.guest" type="button" class="primaryBt">Use as Guest</button>
        </RouterLink>
      </div>
      <div class="right">
        <ul>
          <h3>You'll have access to:</h3>
          <li> <PlayIcon class="ico" /> <strong>4</strong> Plays</li>
          <li> <FormationIcon class="ico" /> <strong>2</strong> Formations</li>
          <li>
            <PlaybookIcon class="ico" />
            <div>
              Playbook access
              <p>Without enlarging or play sharing</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>