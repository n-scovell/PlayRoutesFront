<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { useGuest } from '../stores/guestStore'

const guestAccount = useGuest()
const auth = useAuthStore()


const userEmail = ref('')
const userPassword = ref('')
const userLoading = ref(false)
const showUserMessage = ref(false)

const guestName = ref('')
const guestemail = ref('')
const guestdescription = ref('')

const error = ref<string | null>(null)




const clearGuest = () => {
  guestName.value = ''
  guestemail.value = ''
  guestdescription.value = ''
}

const clearInp = () => {
  guestName.value = ''
  guestemail.value = ''
  guestdescription.value = ''
  userEmail.value = ''
  userPassword.value = ''
}



const signOut = () => {
  auth.logout()
  clearInp()
}

const clearChoice = ref<boolean>(false)
const userLogin = ref<boolean>(false)
const playerLogin = ref<boolean>(false)
const guestLogin = ref<boolean>(false)

const chooseLogin = (p: string) => {
  clearChoice.value = true
  if (p === 'user') userLogin.value = true
  if (p === 'player') playerLogin.value = true
  if (p === 'guest') guestLogin.value = true
}
const closeLogin = () => {
  clearChoice.value = false
  userLogin.value = false
  playerLogin.value = false
  guestLogin.value = false
}


// PLAYER LOGIN
const playername = ref('')
const selectedPlay = ref('')
const team = ref('')
const pin = ref('')
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

// SIGN IN FUNCTIONS
const userSignIn = async () => {
  userLoading.value = true
  error.value = null
  try {
    await auth.login(userEmail.value, userPassword.value)
    showUserMessage.value = true
    clearGuest()
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    userLoading.value = false
    guestAccount.emptyGuest()
  }  
}
const playerSignIn = () => {
  auth.playerLogin(team.value, pin.value, playername.value, selectedPlay.value)
}
const guestSignIn = () => {
  guestAccount.createGuest(guestName.value, guestemail.value, guestdescription.value)
  clearInp()
}

</script>

<template>
  <main style="min-height:100vh; overflow:hidden"> 
    <div class="loginChoice" :class="{active: clearChoice}">

      <h1>Choose Your Access</h1>
      <h2>Select how you want to continue</h2>

      <div class="selection" @click="chooseLogin('user')">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" src="@/assets/images/user.png" />
          </div>
          <div>
          <h3>USER LOGIN</h3>
          <p>Login as the user and create plays, formations!</p>
          <button class="primaryBt b" >Continue as User</button>
          </div>
        </div>
      </div>

      <div class="selection" @click="chooseLogin('player')">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" class='a' src="@/assets/images/player.png" />
          </div>
          <div>
          <h3>PLAYER LOGIN</h3>
          <p>Acces your teams playbook!</p>
          <button class="primaryBt b" >Continue as Player</button>
          </div>
        </div>
      </div>

      <div class="selection" @click="chooseLogin('guest')">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" src="@/assets/images/guest.png" />
          </div>
          <div>
          <h3>GUEST LOGIN</h3>
          <p>Go ahead and check out Player Routes!</p>
          <button class="primaryBt b" >Continue as Guest</button>
          </div>
        </div>
      </div>

    </div>

    // LOGIN SCREENS
    <div class="userLogin" :class="{active:userLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent>
        <img alt="PRArrow" src="@/assets/images/user.png" />
        <h3>User Login</h3>
        <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="userEmail" />
        </div>
        <div class="inputCont">
          <label>Password:</label><input placeholder="Password" type="password" v-model="userPassword" />
        </div>
        <div class="btCont">
          <button :disabled="userLoading" class="primaryBt b" @click="userSignIn">{{ userLoading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="primaryBt b" @click="signOut">Log Out</button>
        </div>
      </form>
    </div>

    <div class="playerLogin" :class="{active:playerLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent>
        <img alt="PRArrow" src="@/assets/images/player.png" />
        <h3>Player Login</h3>
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
          <button class="primaryBt" type="button" @click="playerSignIn()">SUBMIT</button>
        </div>
      </form>
    </div>

    <div class="guestLogin" :class="{active:guestLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent v-if="!auth.user">
        <img alt="PRArrow" src="@/assets/images/guest.png" />
        <h3>Guest Login</h3>
        <div class="inputCont">
        <label>Guest Name:</label><input placeholder="Guest" type="text" v-model="guestName" />
        </div>
        <div class="inputCont">
        <label>Guest Email:</label><input placeholder="Email" type="email" v-model="guestemail" />
        </div>
        <div class="inputCont">
        <label>Describe Usage:</label><input placeholder="Tell us who you are" type="text" v-model="guestdescription" />
        </div>
        <div class="btCont">
        <button type="button" class="primaryBt" @click="guestSignIn()">PROCEED</button>
        <button type="button" class="formButton" @click="clearGuest()">CLEAR</button>
        </div>
      </form>
    </div>


  </main>
</template>