<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import {useAuthStore} from '@/stores/userAuth'
  import { usePlayers } from '@/stores/playerStore'
  import '../assets/style/teamRoster.css'

  const auth = useAuthStore()
  const players = usePlayers()
  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const playerNumber = ref<string>('')
  const playerPosition = ref<string>('')

  const selectedPlayer = ref<string>('')

  const positions = ['QB', 'RB', 'FB', 'TB', 'WR', 'TE', 'SL', 'C', 'G', 'T']

  const choosePlayer = (id: string) => {
    selectedPlayer.value = id
  }
  const deletePlayer = () => {
    players.deletePlayer(selectedPlayer.value)
  }
  const submitPlayer = async() => {
    await players.addPlayer({
      firstName: firstName.value,
      lastName: lastName.value,
      playerNumber: playerNumber.value,
      playerPositions: playerPosition.value,
      playerGrade: 'A',
      userId: auth.user?.id
    })
  }
  onMounted(() => {
    players.fetchPlayers()

  })

</script>
<template>
  <main style="min-height:100vh;">
    <h1>{{auth.teamName }} Team Roster</h1>
    <div class="roster">
      <section>
        <form class="signIn" @submit.prevent>
          <div class="inputCont">
            <label>First Name:<input autocomplete="off" placeholder="First Name" type="text" v-model="firstName" /></label>
          </div>
          <div class="inputCont">
            <label>Last Name:<input autocomplete="off" placeholder="Last Name" type="text" v-model="lastName" /></label>
          </div>
          <div class="inputCont a">
            <label>Player Number:
              <select v-model="playerNumber">
                <option value="" disabled>Please select one</option>
                <option v-for="s in 99" :key="`${s}_num`" :value="s">{{ s }}</option>
              </select>
            </label>
          </div>
          <div class="inputCont a">
            <label>Player Position:
              <select v-model="playerPosition">
                <option value="" disabled>Please select one</option>
                <option v-for="s in positions" :key="`${s}_num`" :value="s">{{ s }}</option>
              </select>
            </label>
          </div>
          <div class="btCont">
            <button @click="submitPlayer()">ADD PLAYER TO ROSTER</button>
          </div>
        </form>
        <!-- <div class="playerCount">
          <p>{{ players.players.length }}</p>
          <p v-if="players.error" >{{players.error}}</p>
        </div> -->
      </section>
      <section>
        <div class="player" v-for="(b,index) in players.players" :key="'playerroster_'+index">
            <h2>{{ b.playerNumber }}</h2>
            <div class="mid">
              <h3 class="name">{{ b.firstName + ' ' + b.lastName }}</h3>
              <p>{{ b.playerPositions }}</p>
            </div> 
            <button class="delete" :class="{ inactive : b.id === selectedPlayer }"   @click="choosePlayer(b.id)">Delete Player</button>
            <div class="areYouSure" v-if="b.id === selectedPlayer">
              <button class="a"  >ARE YOU SURE?</button>
              <button class="b"  @click="deletePlayer()">YES</button>
              <button class="c"  @click="choosePlayer('back')">NO</button>
            </div>
        </div>
      </section>
    </div>
  </main>
</template>