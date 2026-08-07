<script setup lang="ts">
import { ref } from 'vue'
import {useAuthStore} from '@/stores/userAuth'
import { usePlayers } from '@/stores/playerStore'

const selectedPlayer = ref<number>()
const auth = useAuthStore()
const players = usePlayers();
players.fetchPlayers();
const deletePlayer = (id:string) => {
  players.deletePlayer(id)
}
const updateTab = (id: number) => {
  selectedPlayer.value = id
}
</script>
<template>
  <main style="min-height:100vh">
    <h1>{{auth.teamName}} Roster</h1>
    <div class="roster">
      <div class="playerRoster a">
        <div class="ind">#</div>
        <div>First:</div>
        <div>Last:</div>
        <div>Number:</div>
        <div>Positions</div>
        <div>Grade</div>
        <div class="del"></div>
      </div>
      <div class="playerRoster" v-for="(b,index) in players.players" :key="'player'+index">
        <div class="ind">{{ index + 1 }}</div>
        <div>{{ b.firstName }}</div>
        <div>{{ b.lastName }}</div>
        <div>{{ b.playerNumber }}</div>
        <div>{{ b.playerPositions }}</div>
        <div>{{ b.playerGrade }}</div>
        <div class="del"><button @click="deletePlayer(b.id)">X</button></div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
$a: rgba(255,255,255,.3);

</style>