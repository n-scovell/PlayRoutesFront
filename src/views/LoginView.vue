<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { useGuest } from '../stores/guestStore'

const guestAccount = useGuest()
const auth = useAuthStore()
const email = ref('')
const guest = ref('')
const guestemail = ref('')
const guestdescription = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const charged = ref(false)
const showMessage = ref(false)


const clearGuest = () => {
  guest.value = ''
  guestemail.value = ''
  guestdescription.value = ''
}

const clearInp = () => {
  guest.value = ''
  guestemail.value = ''
  guestdescription.value = ''
  email.value = ''
  password.value = ''
}

const signIn = async () => {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    charged.value = true
    showMessage.value = true
    clearGuest()
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    guestAccount.emptyGuest()
    loading.value = false
  }  
}
const signGuest = () => {
  guestAccount.createGuest(guest.value, guestemail.value, guestdescription.value)
  clearInp()
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

</script>

<template>
  <main style="min-height:100vh;"> 

    <div class="loginChoice" :class="{active: clearChoice}">
      <h1>Choose Your Access</h1>
      <h2>Select how you want to continue</h2>
      <div class="selection">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" src="@/assets/images/user.png" />
          </div>
          <h3>USER LOGIN</h3>
          <p>Login as the user and create plays, formations!</p>
        </div>
        <button class="primaryBt b" @click="chooseLogin('user')">Continue as User</button>
      </div>
      <div class="selection">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" class='a' src="@/assets/images/player.png" />
          </div>
          <h3>PLAYER LOGIN</h3>
          <p>Acces your teams playbook!</p>
        </div>
        <button class="primaryBt b" @click="chooseLogin('player')">Continue as Player</button>
      </div>
      <div class="selection">
        <div class="txt">
          <div class="iconCont">
            <img alt="PRArrow" src="@/assets/images/guest.png" />
          </div>
          <h3>GUEST LOGIN</h3>
          <p>Go ahead and check out Player Routes!</p>
        </div>
        <button class="primaryBt b" @click="chooseLogin('guest')">Continue as Guest</button>
      </div>
    </div>

    <div class="userLogin" :class="{active:userLogin}">
      <form class="signIn" @submit.prevent>
        <h3>USER!</h3>
        <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="email" />
        </div>
        <div class="inputCont">
          <label>Password:</label><input placeholder="Password" type="password" v-model="password" />
        </div>
        <div class="btCont">
          <button :disabled="loading" class="formButton" @click="signIn">{{ loading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="formButton" @click="signOut">Log Out</button>
        </div>
      </form>
    </div>

    <div class="guestLogin" :class="{active:guestLogin}">
      <form class="signIn" @submit.prevent>
        <h3>GUEST!</h3>
        <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="email" />
        </div>
        <div class="inputCont">
          <label>Password:</label><input placeholder="Password" type="password" v-model="password" />
        </div>
        <div class="btCont">
          <button :disabled="loading" class="formButton" @click="signIn">{{ loading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="formButton" @click="signOut">Log Out</button>
        </div>
      </form>
    </div>

    <div class="playerLogin" :class="{active:playerLogin}">
      <form class="signIn" @submit.prevent>
        <h3>PLAYER!</h3>
        <div class="inputCont">
          <label>Email:</label><input placeholder="Email" type="email" v-model="email" />
        </div>
        <div class="inputCont">
          <label>Password:</label><input placeholder="Password" type="password" v-model="password" />
        </div>
        <div class="btCont">
          <button :disabled="loading" class="formButton" @click="signIn">{{ loading ? 'Logging in...' : 'Login' }}</button>
          <button type="button" class="formButton" @click="signOut">Log Out</button>
        </div>
      </form>
    </div>
    <!-- <form class="signIn" @submit.prevent>
      <h3>Welcome back!</h3>
      <div class="inputCont">
            <label>Email:</label><input placeholder="Email" type="email" v-model="email" />
      </div>
      <div class="inputCont">
            <label>Password:</label><input placeholder="Password" type="password" v-model="password" />
      </div>
      <div class="btCont">
        <button :disabled="loading" class="formButton" @click="signIn">{{ loading ? 'Logging in...' : 'Login' }}</button>
        <button type="button" class="formButton" @click="signOut">Log Out</button>
      </div>
    </form>
    <form class="signIn" @submit.prevent v-if="!auth.user">
      <h3>Preview As Guest!</h3>
      <p></p>
      <div class="inputCont">
          <label>Guest Name:</label><input placeholder="Guest" type="text" v-model="guest" />
      </div>
      <div class="inputCont">
          <label>Guest Email:</label><input placeholder="Email" type="email" v-model="guestemail" />
      </div>
      <div class="inputCont">
          <label>Describe Usage:</label><input placeholder="Tell us who you are" type="text" v-model="guestdescription" />
      </div>
      <div class="btCont">
        <button type="button" class="formButton" @click="signGuest()">PROCEED</button>
        <button type="button" class="formButton" @click="clearGuest()">CLEAR</button>
      </div>
    </form> -->

    <!-- <div v-if="showMessage && auth.user" class="messageToUser">
      Welcome back {{ auth.user.name }}
    </div> -->

    <!-- <Teleport to="body" >
      <div class="messageOutput" :class="{green: auth.user}" v-if="showMessage">
        <p v-if="error" style="color:red">{{ error }}</p>
        <h3 v-if="auth.user">Welcome back coach:</h3>
        <h4>{{ auth.user?.name }}</h4>
        <div class="btCont">
          <RouterLink to="/create"><button>CREATE PLAYS</button></RouterLink>
          <RouterLink to="/plays"><button>PLAYBOOK</button></RouterLink>
        </div>
      </div>
    </Teleport> -->
  </main>
</template>