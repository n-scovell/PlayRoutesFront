<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/userAuth'

import UserIcon from '@/assets/icons/ico_user.svg'
import RegisterIcon from '@/assets/icons/ico_register.svg'
import AccountIcon from '@/assets/icons/ico_account.svg'
import TeamIcon from '@/assets/icons/ico_team.svg'
import VerifyIcon from '@/assets/icons/ico_verify.svg'
import PaymentIcon from '@/assets/icons/ico_payment.svg'
import CoachIcon from '@/assets/icons/ico_coach.svg'

import { stripeInit } from '@/composables/stripe'
import { formCheck } from '@/composables/formcheck'

const auth = useAuthStore()
const strp = stripeInit()
const fc = formCheck()

const showModal = ref<boolean>(false)

//Vmods
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
      sport: selectedSport.value,
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
const registrationUserId = ref('')
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

    throw new Error(data.error || 'Verification failed')
  }

  // NEW
  registrationUserId.value = data.user.id
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
  passwordRepeat.value = ''
  team.value = ''
  code.value = ''
}

const registerProcess = async (val: number) => {
  error.value = null
  try {
    if (step.value === 0) {
      step.value = val
    } else if (step.value === 1) {
      await fc.checkPassword(password.value, passwordRepeat.value)
      await fc.checkEmail(email.value)
      step.value = val
    } else if (step.value === 2) {
      await fc.checkInput(team.value, 'team')
      await fc.checkInput(name.value, 'name')
      await fc.checkInput(selectedSport.value, 'sport')
      await fc.checkPin(pin.value, name.value, team.value)
      checkSignUp()
      step.value = val
    } else if (step.value === 3) {
      await fc.checkInput(code.value, 'code')
      await verifyCode()
      step.value = val
    } else if (step.value === 4) {
      // await auth.login(email.value, password.value)
      // clearMe()
      step.value = val
    } else if (step.value === 5) {
      await auth.login(email.value, password.value)
      clearMe()
      step.value = val
    }
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
    console.log(error.value)
  }
}
const goBackOne = (val: number) => {
  step.value = val
}

const showinfo = ref<boolean>(false)
const showPinInfo = () => {
  showinfo.value = !showinfo.value
}


onMounted(() => {
  // window.addEventListener('message', handlePaymentMessage)
  const params = new URLSearchParams(window.location.search)
  if (params.get('payment') === 'success' && window.opener) {
    window.opener.postMessage(
      { type: 'STRIPE_PAYMENT_SUCCESS' },
      'https://www.playerroutes.com'
    )

    window.close()
  }
})

function handlePaymentMessage(event: MessageEvent) {

  if (
    event.origin !== 'https://www.playerroutes.com'
  ) {
    return
  }

  if (
    event.data?.type === 'STRIPE_PAYMENT_SUCCESS'
  ) {
    registerProcess(5)
  }
}

const yourPick = async (plan: 'COACH' | 'TEAM') => {
  try {
    await strp.stripePlan(plan, registrationUserId.value)
    step.value = 5
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}
const mainSubmit = async () => {
  try {
    await strp.stripePayment(email.value, password.value)
    step.value = 6
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}

watch(() => password.value, () => {
  allClear.value = fc.verifyPass(password.value) ? true : false
})

</script>
<template>
  <main style="min-height:100vh">
  
  <div class="loginChoice"  :class="{active: step !== 0}">

    <h1>Player Routes Registration</h1>
    <h2>or do you need to login?</h2>

    <div class="selection" @click="registerProcess(1)" >
      <div class="txt">
        <div class="iconCont">
          <UserIcon />
        </div>
        <div>
        <h3>REGISTER NEW USER</h3>
        <p>Join Player Routes and take<br> your playbook to a new level!</p>
        <button class="primaryBt b" >NEW USER</button>
        </div>
      </div>
    </div>
    
    <div class="selection"  >
      <RouterLink to="/login"> 
        <button class="wide">
          <div class="txt">
            <div class="iconCont">
              <RegisterIcon />
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
      <AccountIcon />
      <h3>STEP 1: ACCOUNT SETUP</h3>
      <p>Create your login information</p>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Email:<input autocomplete="off" placeholder="Email" type="email" v-model="email" /></label>
      </div>
      <div class="inputCont">
        <button class="infoBt" @click="showPinInfo()">i</button>
        <div v-if="showinfo" class="popUp info">
          <strong>PASSWORD</strong>
          <p>Ensure your password has:</p>
          <ul>
            <li>10 Characters</li>
            <li>1 Capital Letter</li>
            <li>1 Lowecase Letter</li>
            <li>1 Number</li>
            <li>1 Special - !@#$%?</li>
          </ul>
        </div>
        <label>Password:<input autocomplete="off" placeholder="Password" type="password" v-model="password" /></label>
      </div>
      <div class="inputCont" v-if="password.length >= 1" >
        <label v-if="allClear">PASSWORD IS CLEAR!</label>
        <ul class="processList">
          <li v-if="fc.hasCap.value"></li>
          <li v-if="fc.hasLow.value"></li>
          <li v-if="fc.hasSpec.value"></li>
          <li v-if="fc.hasNumb.value"></li>
          <li v-if="fc.hasLen.value"></li>
        </ul>
      </div>
      <div class="inputCont" >
        <label>Repeat Password:<input autocomplete="off" placeholder="Repeat Password" type="password" v-model="passwordRepeat" /></label>
      </div>
      <div class="btCont">
        <button class="primaryBt b" @click="registerProcess(2)">NEXT</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
    
  </div>

  <div class="userLogin" :class="{active : step === 2}">
    <form class="signIn" @submit.prevent>
      <TeamIcon />
      <h3>STEP 2: TEAM SETUP</h3>
      <p>Create your team information</p>
      <div class="loggedIn" v-if="error" >
        <h3 v-if="error.includes('luggage')" class="spec"><strong><em>12345?!</em></strong>{{error}}</h3>
        <h3 v-else>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Team Name:<input autocomplete="off" placeholder="Team Name" type="text" v-model="team" /></label>
      </div>
      <div class="inputCont">
        <label>Your Name:<input autocomplete="off" placeholder="Name" type="text" v-model="name" /></label>
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
        <button class="infoBt" @click="showPinInfo()">i</button>
        <div v-if="showinfo" class="popUp info">
          <strong>PIN NUMBER:</strong>
          The pin number is your specific number that allows players/coaches to read the {{ team }} playbook.
        </div>
        <label>Team Pin:<input autocomplete="off" placeholder="Team Pin" type="password" v-model="pin" maxlength="15" /></label>
      </div>
      <div class="btCont">
        <button class="primaryBt b" @click="goBackOne(1)">BACK</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
        <button class="primaryBt b" @click="registerProcess(3)">NEXT</button>
      </div>
    </form>
    
  </div>

  <div class="userLogin" :class="{active : step === 3}">
    <form class="signIn" @submit.prevent>

      <VerifyIcon />
      <h3>STEP 3: VERIFY ACCOUNT</h3>
      <p>A verification number was sent to: {{email}}</p>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Verify:</label><input placeholder="Verify Code" type="text" v-model="code" />
      </div>
      <div class="btCont">
        <button class="primaryBt b" type="button" @click="registerProcess(4)">VERIFY</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
  </div>

  <div class="userLogin" :class="{active : step === 4}">
    <form @submit.prevent>
      <PaymentIcon />
      <h3>STEP {{step}}: SELECT PAYMENT PLAN</h3>
      <p>Setup your payment process to access Player Routes!</p>
      <div class="loggedIn" v-if="error" >
        <h3>{{error}}</h3>
      </div>
      <div class="paymentCont">
        <div class="plan">
          <div class='icon'><CoachIcon /></div>
          <div class="content">
            <h4>COACH PLAN</h4>
            <h5>$6.00/monthly</h5>
            <p>So on and so on</p>
            <button
              class="primaryBt b"
              type="button"
              @click="yourPick('COACH')"
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
      <div class="paymentCont">
        <div class="plan">
          <div class='icon'><TeamIcon /></div>
          <div class="content">
            <h4>TEAM PLAN</h4>
            <h5>$10.00/monthly</h5>
            <p>So on and so on</p>
            <button
              class="primaryBt b"
              type="button"
              @click="yourPick('TEAM')"
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
      <div class="btCont">
        <button class="primaryBt b" type="button" style="max-width:200px;" @click="registerProcess(2)">BACK</button>
      </div>
    </form>
  </div>

  <div class="userLogin" :class="{ active: step === 5 }">
    <form @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>COMPLETE YOUR SUBSCRIPTION</h3>
      <p>
        Enter your payment information to activate your account.
      </p>
      <div id="payment-element"></div>
      <div class="btCont" style="margin-top:10px">
        <button class="primaryBt b" type="submit" :disabled="strp.isProcessing.value" @click="mainSubmit">
          {{ strp.isProcessing.value ? 'PROCESSING...' : 'SUBMIT' }}
        </button>
      </div>
      <p v-if="strp.paymentError">{{ strp.paymentError }}</p>
    </form>
  </div>

  <div class="userLogin" :class="{ active: step === 6 }">
    <form @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>Your account is completed and paid for! HOORAH!</h3>
      <p>
        Let's get started and kick some ass!
      </p>
      <div class="btCont">
        <button class="primaryBt b" ss >
          CREATE PLAYS
        </button>
      </div>
    </form>
  </div>

  </main>
</template>


