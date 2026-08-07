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
        <div class="ind">Id:</div>
        <div>First:</div>
        <div>Last:</div>
        <div>Number:</div>
        <div>Positions</div>
        <div>Grade</div>
        <!-- <div class="del"></div> -->
        <div class="del"></div>
      </div>
      <div class="playerRoster" v-for="(b,index) in players.players" :key="'player'+index">
        <div class="editor" v-if="selectedPlayer === index"></div>
        <div class="ind">{{ index + 1 }}</div>
        <div>{{ b.firstName }}</div>
        <div>{{ b.lastName }}</div>
        <div>{{ b.playerNumber }}</div>
        <div>{{ b.playerPositions }}</div>
        <div>{{ b.playerGrade }}</div>
        <!-- <div class="del"><button @click="updateTab(index)">UP</button></div> -->
        <div class="del"><button @click="deletePlayer(b.id)">X</button></div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
$white: rgba(255,255,255,.3);
.roster {
  display:flex;
  flex-direction:column;
  flex-wrap:nowrap;
  gap:0px;
  padding:30px 50px;
  .playerRoster {
    position:relative;
    outline:1px solid $white;
    color:white;
    font-size:15px;
    font-weight:bold;
    display:flex;
    flex-direction:row;
    flex-wrap:nowrap;
    font-size:16px;
    font-weight:300;
    letter-spacing:.03em;
    font-family:'Arial', sans-serif;
    .editor {
      position:absolute;
      top:0px;
      left:0px;
      width:100%;
      height:100%;
      background:red;
      color:white;
      display:flex;
      flex-direction:row;
      flex-wrap:nowrap;
      div {
        flex:1;
        padding:13px 0px 13px 10px;
        border-right:1px solid $white;
        position:relative;
      }
    }
    &.a {
      background:$white;
      color:black;
    }
    div {
      flex:1;
      padding:13px 0px 13px 10px;
      border-right:1px solid $white;
      position:relative;
      
      &.del {
        flex: 0 0 40px;
      }
      &.ind {
        flex: 0 0 50px;
        padding:13px 0px 13px 0px;
        text-align:center;
      }
      &:last-child {
        border-right:none;
      }
      button {
        background:$white;
        color:black;
        width:100%;
        height:100%;
        position:absolute;
        top:0px;
        left:0px;
      }
    }
  }
}
</style>