<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()


const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const charged = ref(false)

const signIn = async () => {
  loading.value = true
  error.value = null
  try {
    await auth.login(email.value, password.value)
    charged.value = true
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
  
}

// watch(charged.value, (val: boolean) => {
//   if (val) {
//     setTimeout(() => {
//       charged.value = false
//     }, 0)
//   }
// })
const signOut = () => {
  auth.logout()
  email.value = ''
  password.value = ''
}
</script>

<template>
  <main class="login">

    <h1>Sign In:</h1>
    <form class="signIn" @submit.prevent>
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

    <Teleport to="body">
      <div class="messageOutput" :class="{green: auth.user}">
        <p v-if="error" style="color:red">
        {{ error }}
        </p>
        <p v-if="auth.user">
        Welcome back coach: {{ auth.user.name }}
        </p>
      </div>
    </Teleport>
    
  </main>
</template>

<style lang="scss">
.messageOutput {
  position:fixed;
  top:80px;
  right:10px;
  max-width:350px;
  width:70%;
  background:rgba(236, 24, 24, 0.541);
  color:white;
  font-size:12px;
  font-weight:bold;
  font-family:sans-serif;
  line-height:18px;
  padding:10px;
  display:none;
  &.green {
    display:block;
    background:rgba(24, 236, 70, 0.541);
  }
}
.signIn {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  width:400px;
  height:auto;
  .btCont {
    margin-top:-10px;
    gap:10px;
  }
}
</style>