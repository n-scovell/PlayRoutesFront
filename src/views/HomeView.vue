<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const sport = ref('')
const team = ref('')
const password = ref('')
const signMeUp = () => {
  auth.createUser( email.value, password.value, name.value, sport.value, team.value )

}
const clearMe =() => {
  name.value = ''
  email.value = ''
  sport.value = ''
  password.value = ''
  team.value = ''
}
</script>
<template>
  <main class="home">
    <h1>HOME</h1>
    <form class="signUp" @submit.prevent>
      <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="email" />
      </div>
      <div class="inputCont">
          <label>Name:</label><input placeholder="Coach Name" type="text" v-model="name" />
      </div>
      <div class="inputCont">
          <label>Sport:</label><input placeholder="Sport" type="text" v-model="sport" />
      </div>
      <div class="inputCont">
          <label>Team Name:</label><input placeholder="Team Name" type="text" v-model="team" />
      </div>
      <div class="inputCont">
          <label>Pasword:</label><input placeholder="Password" type="text" v-model="password" />
      </div>
      <div class="btCont">
        <button class="formButton" type="button" @click="signMeUp">CREATE NEW USER</button>
        <button class="formButton" type="button" @click="clearMe">CLEAR</button>
      </div>
    </form>
  </main>
</template>
<style lang="scss">
.signUp {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  max-width:400px;
  width:50%;
  height:auto;
  outline:1px solid red;
  .btCont {
    margin-top:-10px;
    gap:10px;
  }
}
</style>