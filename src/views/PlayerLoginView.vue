<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()
const playername = ref('')
const selectedPlay = ref('')
const team = ref('')
const pin = ref('')

const playerLogin = () => {
  auth.playerLogin(team.value, pin.value, playername.value, selectedPlay.value)
}

const positions = ref([
  { id: 'QB', name: 'Quarterback' },
  { id: 'RB', name: 'Running Back' },
  { id: 'FB', name: 'Full Back' },
  { id: 'TB', name: 'Tail Back' },
  { id: 'WR', name: 'Wide Receiver' },
  { id: 'SL', name: 'Slot Reciever' },
  { id: 'TE', name: 'Tight End' },
  { id: 'C', name: 'Center' },
  { id: 'Q', name: 'Guard' },
  { id: 'T', name: 'Tackle' },
])
// const clearMe = () => {
//   name.value = ''
//   email.value = ''
//   sport.value = ''
//   pin.value = ''
//   password.value = ''
//   team.value = ''
// }

</script>
<template>
  <main style="min-height:100vh">
  <h1>Login as player!</h1>
    <form class="signUp" @submit.prevent>
      <h3>Login:</h3>
      <div class="inputCont">
        <label>Player Name:<input placeholder="Player Name" type="input" v-model="playername" /></label>
      </div>
      <div class="inputCont a">
        <label>Player Position:
        <select id="city-select" v-model="selectedPlay" >
          <option value="" disabled>Please select one</option>
          <option v-for="p in positions" :key="p.id" :value="p.id">{{p.id}} - {{ p.name }}</option>
        </select>
        </label>
      </div>
      <div class="inputCont">
      <label>Team Name:<input placeholder="Team Name" type="input" v-model="team" /></label>
      </div>
      <div class="inputCont">
        <label>Pin Number:<input placeholder="Pin" type="text" v-model="pin" /></label>
      </div>
      <div class="btCont">
        <button class="formButton" type="button" @click="playerLogin()">SUBMIT</button>
      </div>
    </form>
  </main>
</template>