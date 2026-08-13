<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth'
import { useGuest } from '@/stores/guestStore'
import { RouterLink } from 'vue-router'
const auth = useAuthStore()
const gst = useGuest()
</script>
<template>
  <section class="upgradeAccount">
    <div class="textBox">
      <img alt="Arrow" src="@/assets/images/playFunB.png" class="imgB" />
      <div class="txt">
        <h2>LET'S GO!!</h2>
        <h4>UPGRADE YOUR ACCOUNT!</h4>
        <h5>By upgrading your account and can save your five plays and five formations!</h5>
        <h5 class="a">Plus have full access to the Play Routes tools!</h5>
        <RouterLink to="/register">
          <button aria-label="Register Button" class="primaryBt">REGISTER</button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>