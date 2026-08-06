<script setup lang="ts">
import { useBadges } from '@/stores/badgeStore'
const badges = useBadges();
badges.fetchBadges();
</script>
<template>
  <main style="min-height:100vh">
    <h1>Your Badges work </h1>
    <div
      class="badge"
      style="color:white;font-size:15px;"
      v-for="(b,index) in badges.badges" :key="'badge'+index">
      <p>{{ b.badge.name }}</p>
      <p>{{ b.badge.description }}</p>
    </div>
  </main>
</template>

<style lang="scss">
.badge {
  outline:1px solid red;
  width:250px;
  height:250px;
  color:white;
  font-size:20px;
  float:left;
}
</style>