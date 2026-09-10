<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { useGuest } from '../stores/guestStore'
import { RouterLink } from 'vue-router'

import UserIcon from '@/assets/icons/ico_user.svg'
import RegisterIcon from '@/assets/icons/ico_register.svg'
import HelmetIcon from '@/assets/icons/ico_helmet.svg'
import GuestIcon from '@/assets/icons/ico_guest.svg'

import MySel from '@/components/Selection.vue'

const guestAccount = useGuest()
const auth = useAuthStore()


const userEmail = ref('')
const userPassword = ref('')
const userLoading = ref(false)
const showUserMessage = ref(false)


const playername = ref('')
const selectedPlay = ref('')
const team = ref('')
const pin = ref('')

const guestName = ref('')
const guestemail = ref('')
const guestdescription = ref('')



const error = ref<string | null>(null)




const clearAll = () => {
  userEmail.value = ''
  userPassword.value = ''
  playername.value = ''
  selectedPlay.value = ''
  team.value = ''
  pin.value = ''
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
  if (auth.player) auth.playerLogout()
  try {
    await auth.login(userEmail.value, userPassword.value)
    showUserMessage.value = true
    clearAll()
  } catch (err: any) {
    if (!userEmail.value || !userPassword.value) {
      if (!userEmail.value) error.value = 'Username is blank'
      if (!userPassword.value) error.value = 'Password is blank'
    } else {
      error.value = err.message || 'Login failed'
    }
  } finally {
    userLoading.value = false
    guestAccount.emptyGuest()
  }  
}
const playerSignIn = async () => {
  error.value = null
  if (auth.user) auth.logout()
  try {
    await auth.playerLogin(team.value, pin.value, playername.value, selectedPlay.value)

    clearAll()
    showUserMessage.value = true
  } catch (err: any) {
    if (!team.value || !pin.value) {
      if (!team.value) error.value = 'Team is blank'
      if (!pin.value) error.value = 'Pin is blank'
    } else {
      error.value = err.message || 'Login failed'
    }
  }
}
const guestSignIn = async () => {
  error.value = null
  if (!guestName.value || !guestemail.value) return
  try {
    await guestAccount.createGuest(guestName.value, guestemail.value, guestdescription.value)
    showUserMessage.value = true
    clearAll()
  } catch (err: any) {
    if (!guestName.value || !guestemail.value) {
      if (!guestName.value) error.value = 'Name is blank'
      if (!guestemail.value) error.value = 'Email is blank'
    } else {
      error.value = err.message || 'Login failed'
    }
  }
}

  onMounted(() => {
    if (auth.user || auth.player || guestAccount.guest) {
    showUserMessage.value = true
    }
  })

  watch(
  [
    () => auth.user,
    () => guestAccount.guest,
    () => auth.player
  ],
  ([user, guest, player]) => {
    if (!user || !guest || !player) {
      showUserMessage.value = false
    }
  }
)

const images = import.meta.glob<string>(
  '@/assets/icons/*.svg', { eager: true, query: '?url', import: 'default'}
)

interface MyChoice {
  icon: string,
  tabSel: string,
  hdr: string,
  txt: string,
  bttxt: string
}
const choiceList = ref<MyChoice[]> ([
  {
    icon:'user',
    tabSel: 'user',
    hdr: 'USER LOGIN',
    txt: 'Login as the user and create plays, formations!',
    bttxt: 'Continue as User',
  },
  {
    icon:'player',
    tabSel: 'player',
    hdr: 'PLAYER LOGIN',
    txt: 'Acces your teams playbook!',
    bttxt: 'Continue as Player',
  },
  {
    icon:'guest',
    tabSel: 'guest',
    hdr: 'GUEST LOGIN',
    txt: 'Go ahead and check out Player Routes!',
    bttxt: 'Create Login',
  },
])

</script>

<template>
  <main style="min-height:90vh; overflow:hidden"> 
    <div class="loginChoice" :class="{active: clearChoice}">
      <h1>Choose Your Access</h1>
      <h2>Select how you want to continue</h2>
      <MySel v-for="s in choiceList" :key="`${s.icon}_selection`" :src="s" @click="chooseLogin(s.icon)" />
    </div>

    // LOGIN SCREENS
    <div class="userLogin" :class="{active:userLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent v-if="!showUserMessage">
        <UserIcon />
        <h3>User Login</h3>
        <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="userEmail" />
        </div>
        <div class="inputCont">
          <label>Password:</label><input placeholder="Password" type="password" v-model="userPassword" />
        </div>
        <div class="btCont">
          <button :disabled="userLoading" class="primaryBt b" @click="userSignIn">{{ userLoading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="primaryBt b" @click="clearAll()">CLEAR</button>
        </div>
      </form>
      <div class="loggedIn" v-if="showUserMessage" >
        <img alt="PRArrow" src="@/assets/images/success.png" />
        <h3><span>YOU ARE LOGGED IN: </span>{{ auth.user?.name }}</h3>
      </div>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
    </div>

    <div class="playerLogin" :class="{active:playerLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent v-if="!showUserMessage">
        <!-- <img alt="PRArrow" src="@/assets/images/player.png" /> -->
        <HelmetIcon class="a" />
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
          <button class="primaryBt b" type="button" @click="playerSignIn()">SUBMIT</button>
          <button type="button" class="primaryBt b" @click="clearAll()">CLEAR</button>
        </div>
      </form>
      <div class="loggedIn" v-if="showUserMessage" >
        <img alt="PRArrow" src="@/assets/images/success.png" />
        <h3><span>YOU ARE LOGGED IN: </span>{{ auth.pName }}</h3>
      </div>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
    </div>

    <div class="guestLogin" :class="{active:guestLogin}">
      <button class="goBack" @click="closeLogin()"></button>
      <form class="signIn" @submit.prevent v-if="!showUserMessage">
        <GuestIcon />
        <!-- <img alt="PRArrow" src="@/assets/images/guest.png" /> -->
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
        <button type="button" class="primaryBt b" @click="guestSignIn()">PROCEED</button>
        <button type="button" class="primaryBt b" @click="clearAll()">CLEAR</button>
        </div>
      </form>
      <div class="loggedIn" v-if="showUserMessage" >
        <img alt="PRArrow" src="@/assets/images/success.png" />
        <h3><span>YOU ARE LOGGED IN: </span>{{ guestAccount.guest?.name }}</h3>
      </div>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
    </div>


  </main>
</template>