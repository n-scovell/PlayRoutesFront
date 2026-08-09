<script setup lang="ts">
import { useAuthStore } from '../../stores/userAuth'
const auth = useAuthStore()
</script>
<template>
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
        <button v-if="!auth.user" type="button" class="primaryBt">Use as Guest</button>
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
</template>