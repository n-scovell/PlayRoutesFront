<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { Image } from '@unpic/vue'
import fieldImage from '@/assets/images/field.jpg'
import { RouterLink } from 'vue-router'
import '../assets/home.css'
const auth = useAuthStore()

// const showModal = ref<boolean>(false)
// const name = ref('')
// const email = ref('')
// const sport = ref('')
// const team = ref('')
// const password = ref('')
// const code = ref("")
// async function checkSignUp() {
//   try {
//     const formData = {
//       email: email.value,
//       password: password.value,
//       name: name.value,
//       sport: sport.value,
//       team: team.value,
//     }
//     const res = await fetch(
//       "https://play-route-back.vercel.app/api/auth/request-verification",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       }
//     )
//     const data = await res.json()
//     if (!res.ok) {
//       throw new Error(data.error || "Request failed")
//     }
//     showModal.value = true
//   } catch (err: any) {
//     console.log(err.message)
//   }
// }
// async function verifyCode() {
//   const res = await fetch(
//     "https://play-route-back.vercel.app/api/auth/verify-code",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: email.value,
//         code: code.value,
//       }),
//     }
//   )
//   const data = await res.json()
//   if (!res.ok) {
//     alert(data.error)
//     return
//   }
//   showModal.value = false
//   auth.login(email.value, password.value)
// }
// const cancelcode = () => {
//   showModal.value = false
// }

// const clearMe = () => {
//   name.value = ''
//   email.value = ''
//   sport.value = ''
//   password.value = ''
//   team.value = ''
// }
</script>
<template>
  <main class="home">
    
    <!-- <div v-if="showModal" class="loginCreds">
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
    </div> -->
    <!-- <h1>Want to join Play Routes?</h1> -->
    <div class="myCont">
      <section class="createAccount">
        <div class="mid">
          <img src="@/assets/images/PlayRoutesBW.png" />
          <h3>PLAY <span class="navy">ROUTES</span></h3>
          <h4>PLAN, PREPARE, PERFORM</h4>
          <div class="btCont" v-if="!auth.user">
            <RouterLink to="/register">
              <button>REGISTER</button>
            </RouterLink>
            <RouterLink to="/login">
            <button>LOGIN</button>
            </RouterLink>
          </div>
          <div class="btCont" v-else>
            <RouterLink to="/create">
              <button>CREATE PLAY</button>
            </RouterLink>
          </div>
        </div>
        <img src="@/assets/images/field.jpg" width="100%" className="fieldImage" />
      </section>
      <section class="instruction">
        <div class="textBox">
          <h3>
            Play Routes is an online football playbook builder designed for coaches at every level.
          </h3>
          <p>
            Create custom offensive and defensive plays, organize your formations, and build a playbook 
            that's always available whenever inspiration strikes.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
<style lang="scss">

</style>