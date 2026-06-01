<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'
const auth = useAuthStore()
const showModal = ref<boolean>(false)
const name = ref('')
const email = ref('')
const sport = ref('')
const team = ref('')
const password = ref('')
const code = ref("")
async function checkSignUp() {
  try {
    const formData = {
      email: email.value,
      password: password.value,
      name: name.value,
      sport: sport.value,
      team: team.value,
    }
    const res = await fetch(
      "https://play-route-back.vercel.app/api/auth/request-verification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Request failed")
    }
    showModal.value = true
  } catch (err: any) {
    console.log(err.message)
  }
}
async function verifyCode() {
  const res = await fetch(
    "https://play-route-back.vercel.app/api/auth/verify-code",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) {
    alert(data.error)
    return
  }
  showModal.value = false
  auth.login(email.value, password.value)
}
const cancelcode = () => {
  showModal.value = false
}

const clearMe = () => {
  name.value = ''
  email.value = ''
  sport.value = ''
  password.value = ''
  team.value = ''
}
</script>
<template>
  <main class="home">
    
    <div v-if="showModal" class="loginCreds">
      <div class="content">
        <h3>INPUT SENT CODE TO VERIFY</h3>
        <form class="verify" @submit.prevent>
          <div class="inputCont">
              <label>Verify:</label><input placeholder="Verify Code" type="text" v-model="code" />
          </div>
          <div class="btCont">
            <button class="formButton" type="button" @click="verifyCode">VERIFY</button>
            <button class="formButton" type="button" @click="cancelcode">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
    <h1>Want to join Play Routes?</h1>
    <div class="myCont">
      <div class="welcome">
        <p>
          Welcome to Play Routes! The digital playbook for coaches that want an edge.
        </p>
      </div>
      <form class="signUp" @submit.prevent>
        <h3>Want to join?</h3>
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
          <button class="formButton" type="button" @click="checkSignUp">NEW USER</button>
          <button class="formButton" type="button" @click="clearMe">CLEAR</button>
        </div>
      </form>
    </div>
  </main>
</template>
<style lang="scss">
.loginCreds {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; 
  backdrop-filter: blur(13px);
  .content {
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    z-index:99999;
    width:300px;
    color:white;
    h3 {
      text-align:center;
      margin-bottom:20px;
    }
    .verify {
      .inputCont {
        margin-bottom:30px;
      }
    }
  }
}
.myCont {
  position:relative;
  width:100%;
  height:560px;
  background:rgba(255,255,255,.0);
  display:flex;
  gap:20px;
  .welcome {
    padding:20px;
    position:relative;
    &:before {
      content:' ';
      width:2px;
      height: 83%;
      background:rgba(255,255,255,.2);
      position:absolute;
      right:0px;
      top:50%;
      transform:translate(0%,-50%);
    }
  }
  .signUp {
    flex:1;
    max-width:400px;
    width:50%;
    height:auto;
    padding-top:30px;
    h3 {
        margin-bottom:10px;
        // outline:1px solid red;
      }
    .btCont {
      margin-top:-10px;
      gap:10px;
    }
  }
}
</style>