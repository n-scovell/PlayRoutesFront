<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()
const email = ref('')
const guest = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const charged = ref(false)
const showMessage = ref(false)

const signIn = async () => {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    charged.value = true
    showMessage.value = true
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }  
}
const signGuest = () => {
  
}
const signOut = () => {
  auth.logout()
  email.value = ''
  password.value = ''
}
</script>

<template>
  <main style="min-height:100vh"> 
    <h1>Sign In:</h1>
    <form class="signIn" @submit.prevent>
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
    <form class="signIn" @submit.prevent>
      <h3>Preview As Guest!</h3>
      <p></p>
      <div class="inputCont">
          <label>Guest Name:</label><input placeholder="Guest" type="guest" v-model="guest" />
      </div>
      <div class="btCont">
        <button type="button" class="formButton" @click="signGuest()">PROCEED</button>
      </div>
    </form>

    <Teleport to="body" >
      <div class="messageOutput" :class="{green: auth.user}" v-if="showMessage">
        <p v-if="error" style="color:red">{{ error }}</p>
        <h3 v-if="auth.user">Welcome back coach:</h3>
        <h4>{{ auth.user?.name }}</h4>
        <div class="btCont">
          <RouterLink to="/create"><button>CREATE PLAYS</button></RouterLink>
          <RouterLink to="/plays"><button>PLAYBOOK</button></RouterLink>
        </div>
      </div>
    </Teleport>
  </main>
</template>