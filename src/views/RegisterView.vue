<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()
const showModal = ref<boolean>(false)
const name = ref('')
const email = ref('')
const sport = ref('')
const team = ref('')
const pin = ref('')
const password = ref('')
const passwordRepeat = ref('')
const code = ref("")
const selectedSport = ref("")

const error = ref<string | null>(null)
const step = ref<number>(0)

const hasCap = ref<boolean>(false)
const hasLow = ref<boolean>(false)
const hasSpec = ref<boolean>(false)
const hasNumb = ref<boolean>(false)
const hasLen = ref<boolean>(false)
const allClear = ref<boolean>(false)

const sportChoice = ref([
  { id: 'tackle', name: 'Tackle Football' },
  { id: 'flag', name: 'Flag Football' },
])

async function checkSignUp() {
  try {
    const formData = {
      email: email.value,
      password: password.value,
      teamPin: pin.value,
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
    if (data.error === 'Server error') {
      throw new Error('Account already assigned to this email.')
    } 
  }
}
const cancelcode = () => {
  clearMe()
  step.value = 0
}

const clearMe = () => {
  name.value = ''
  email.value = ''
  sport.value = ''
  pin.value = ''
  password.value = ''
  team.value = ''
}

const verifyPass = (a: string) => {
  hasCap.value = !/[A-Z]/.test(a) ? false : true
  hasLow.value = !/[a-z]/.test(a) ? false : true
  hasSpec.value = !/[^a-zA-Z0-9]/.test(a) ? false : true
  hasNumb.value = !/[0-9]/.test(a) ? false : true
  hasLen.value = a.length < 8 ? false : true
  return (
    hasCap.value &&
    hasLow.value &&
    hasSpec.value &&
    hasNumb.value &&
    hasLen.value
  )
}

const checkValue = async (a: string, obj: string) => {
  if (!a) {
    if (obj === 'sport') {
      throw new Error('Select a sport')
    } else {
      throw new Error(`Enter a ${obj}`)
    }
  }
}
const checkPin = async (a: string) => {
  if (!a) {
    throw new Error('You need a pin number')
  }
  if (a === '12345') {
    throw new Error(`That's the kind of thing an idiot has on his luggage!`)
  }
  if (a === '123456') {
    throw new Error(`Adding six is pathetic.`)
  }
  if (a === '1234567') {
    throw new Error(`Do... do you not understand what a pin is?`)
  }
  if (a === '12345678') {
    throw new Error(`Oh come on!`)
  }
  if (a === '123456789') {
    throw new Error(`This is getting ridiculous.`)
  }
  if (a === '12345678910') {
    throw new Error(`Now you're just playing with me.`)
  }
  if (a.length <= 4) {
    throw new Error('Pin Number Needs At Least 5 Numbers')
  }
  return true
}
const  isValidEmail = async (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email is not valid')
  }
  return true
}
const checkPassword = async (a: string, b: string) => {
  if (!a || !b) {
    throw new Error('Please enter and confirm your password')
  }
  if (a !== b) {
    throw new Error('Passwords do not match')
  }
  if (!allClear) {
    throw new Error('Password Needs Work')
  }
  return true
}


watch(() => password.value, () => {
  const valid = verifyPass(password.value)
  if (valid) {
    allClear.value = true
  } else {
    allClear.value = false
  }
})

const registerProcess = async (val: number) => {
  error.value = null
  try {
    if (step.value === 0) {
      step.value = val
    } else if (step.value === 1) {
      await checkPassword(password.value, passwordRepeat.value)
      await isValidEmail(email.value)
      step.value = val
    } else if (step.value === 2) {
      await checkValue(team.value, 'team')
      await checkValue(name.value, 'name')
      await checkValue(selectedSport.value, 'sport')
      await checkPin(pin.value)
      checkSignUp()
      step.value = val
    } else if (step.value === 3) {
      await checkValue(code.value, 'code')
      await verifyCode()
      await auth.login(email.value, password.value)
      step.value = val
      clearMe()
    }
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
    console.log(error.value)
  }
}
const goBackOne = (val: number) => {
  step.value = val
}

</script>
<template>
  <main style="min-height:100vh">
  
  <div class="loginChoice"  :class="{active: step !== 0}">

    <h1>Player Routes Registration {{ step }}</h1>
    <h2>or do you need to login?</h2>

    <div class="selection" @click="registerProcess(1)" >
      <div class="txt">
        <div class="iconCont">
          <img alt="PRArrow" src="@/assets/images/user.png" />
        </div>
        <div>
        <h3>REGISTER NEW USER</h3>
        <p>Join Player Routes and take<br> your playbook to a new level!</p>
        <button class="primaryBt b" >Continue as User</button>
        </div>
      </div>
    </div>
    
    <div class="selection"  >
      <RouterLink to="/login"> 
        <button class="wide">
          <div class="txt">
            <div class="iconCont">
              <img alt="PRArrow" src="@/assets/images/user.png" />
            </div>
            <div>
            <h3>USER LOGIN</h3>
            <p>Login as the user and create<br> plays, formations!</p>
            <button class="primaryBt b" >Continue as User</button>
            </div>
          </div>
        </button>
      </RouterLink>
    </div>
  </div>

  <div class="userLogin" :class="{active : step === 1}">
    <form class="signIn" @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>STEP 1: ACCOUNT SETUP</h3>
      <p>Create your login information</p>
      <div class="inputCont">
        <label>Email:<input placeholder="Email" type="email" v-model="email" /></label>
      </div>
      <!-- <div class="inputCont">
        <label>Name:<input placeholder="Name" type="text" v-model="name" /></label>
      </div> -->
      
      <div class="inputCont">
        <label>Password:<input placeholder="Password" type="password" v-model="password" /></label>
      </div>
      <div class="inputCont" v-if="password.length >= 1" >
        <label v-if="allClear">PASSWORD IS CLEAR!</label>
        <ul class="processList">
          <li v-if="hasCap"></li>
          <li v-if="hasLow"></li>
          <li v-if="hasSpec"></li>
          <li v-if="hasNumb"></li>
          <li v-if="hasLen"></li>
        </ul>
        
      </div>
      <div class="inputCont" >
        <label>Repeat Password:<input placeholder="Repeat Password" type="password" v-model="passwordRepeat" /></label>
      </div>
      <button class="primaryBt b" @click="registerProcess(2)">>>></button>
    </form>
    <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
    </div>
  </div>

  <div class="userLogin" :class="{active : step === 2}">
    <form class="signIn" @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>STEP 2: TEAM SETUP</h3>
      <p>Create your team information</p>
      <div class="inputCont">
        <label>Team Name:<input placeholder="Team Name" type="text" v-model="team" /></label>
      </div>
      <div class="inputCont">
        <label>Your Name:<input placeholder="Name" type="text" v-model="name" /></label>
      </div>
      <div class="inputCont a">
        <label>Sport:
          <select id="city-select" v-model="selectedSport" >
            <option value="" disabled>Please select one</option>
            <option v-for="s in sportChoice" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </label>
      </div>
      <div class="inputCont">
        <label>Team Pin:<input placeholder="Team Pin" type="password" v-model="pin" maxlength="15" /></label>
      </div>
      <div class="btCont">
        <button class="primaryBt b" @click="goBackOne(1)"><<<</button>
        <button class="primaryBt b" @click="registerProcess(3)">>>></button>
      </div>
    </form>
    <div class="loggedIn" v-if="error" >
        <h3 v-if="error.includes('luggage')" class="spec">
          <strong><em>12345?!</em></strong>
          {{error}}
        </h3>
        <h3 v-else>{{error}}</h3>
    </div>
  </div>

  <div class="userLogin" :class="{active : step === 3}">
    <form class="signIn" @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>STEP 3: VERIFY ACCOUNT</h3>
      <p>A verification number was sent to: {{email}}</p>
      <div class="inputCont">
        <label>Verify:</label><input placeholder="Verify Code" type="text" v-model="code" />
      </div>
      <div class="btCont">
        <button class="primaryBt b" type="button" v-if="error" @click="registerProcess(0)">GO BACK</button>
        <button class="primaryBt b" type="button" @click="registerProcess(4)">VERIFY</button>
        <button class="primaryBt b" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
    <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
    </div>
  </div>

  <div class="userLogin" :class="{active : step === 4}">
    <form class="signIn" @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>STEP 4: ACCOUNT IS MADE</h3>
      <p>Congratulations on becoming a playbook wizard!</p>
      <div class="btCont">
        <RouterLink to="/create"> 
         <button class="primaryBt b" type="button">CREATE PLAYS</button>
        </RouterLink>
      </div>
    </form>
    <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
    </div>
  </div>

  <!-- <div v-if="showModal" class="loginCreds">
    <div class="content">
      <form class="verify" @submit.prevent>
        <h3>SENT CODE TO VERIFY</h3>
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
  <form class="signUp" @submit.prevent>
        <h3>Want to join?</h3>
        <div class="inputCont">
            <label>Email:<input placeholder="Email" type="email" v-model="email" /></label>
        </div>
        <div class="inputCont">
            <label>Name:<input placeholder="Coach Name" type="text" v-model="name" /></label>
        </div>
        <div class="inputCont">
            <label>Sport:<input placeholder="Sport" type="text" v-model="sport" /></label>
        </div>
        <div class="inputCont">
            <label>Team Pin Number:<input placeholder="Team Pin" type="text" v-model="pin" /></label>
        </div>
        <div class="inputCont">
            <label>Team Name:<input placeholder="Team Name" type="text" v-model="team" /></label>
        </div>
        <div class="inputCont">
            <label>Pasword:<input placeholder="Password" type="text" v-model="password" /></label>
        </div>
        <div class="btCont">
          <button class="formButton" type="button" @click="checkSignUp">NEW USER</button>
          <button class="formButton" type="button" @click="clearMe">CLEAR</button>
        </div>
      </form> -->
  </main>
</template>