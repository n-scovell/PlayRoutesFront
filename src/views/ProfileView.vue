<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'
const auth = useAuthStore()
</script>
<template>
  <main class="profile">
  <h1>YOUR PROFILE</h1>
    <p style="margin-bottom:30px;">{{ auth }}</p>
    <div v-if="auth.user">
      <p>Coach: {{ auth.user.name }}</p>
      <p>Team: {{ auth.user.team }}</p>
      <p>Sport: {{ auth.user.sport }}</p>
      <p>Email: {{ auth.user.email }}</p>
    </div>
  </main>
</template>
<style lang="scss">
</style>