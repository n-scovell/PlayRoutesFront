<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()



const name = ref('')
const password = ref('')
const team = ref('')
const sport = ref('')



async function sendMe() {
  if (!auth.user) return
  await auth.updateUser({
    id: auth.user.id,
    name: name.value,
    sport: sport.value,
    team: team.value,
    password: password.value
  })
}

</script>
<template>
  <main class="profile">
  <h1>YOUR PROFILE</h1>
    <form class="signIn" @submit.prevent>
      <p>{{ auth.user!.id }}</p>
      <div class="inputCont">
        <label>Name:</label><input :placeholder="auth.user!.name" type="text" v-model="name" />
      </div>
      <div class="inputCont">
        <label>Sport:</label><input :placeholder="auth.user!.sport" type="text" v-model="sport" />
      </div>
      <div class="inputCont">
        <label>Team Name:</label><input :placeholder="auth.user!.team" type="text" v-model="team" />
      </div>
      <div class="inputCont">
        <label>Password:</label><input placeholder="Password" type="text" v-model="password" />
      </div>
      <div class="btCont">
        <button type="button" class="formButton" @click="sendMe">Update User</button>
      </div>
    </form>
  </main>
</template>
<style lang="scss">
.signIn {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  max-width:400px;
  width:50%;
  height:auto;
  /* outline:1px solid red; */
  .btCont {
    margin-top:-10px;
    gap:10px;
  }
}
</style>