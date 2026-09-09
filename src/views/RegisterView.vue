<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick  } from 'vue'
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
const selectedSport = ref('')

const error = ref<string | null>(null)
const step = ref<number>(0)
const currentStep = ref<string>('init')
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
  registrationUserId.value = data.user.id
}

const cancelcode = () => {
  clearMe()
  fc.resetErrors()
  currentStep.value = 'init'
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


const processParade = async (val: string) => {
  error.value = null
  try {
    if (currentStep.value === 'init') {
      // GOES TO ACCOUNT
      currentStep.value = val
    } else if (currentStep.value === 'account') {
      // GOES TO TEAM
      await fc.checkEmail(email.value)
      await fc.checkPassword(password.value, passwordRepeat.value)
      currentStep.value = val
    } else if (currentStep.value === 'team') {
      // GOES TO VERIFY
      await fc.checkInput(team.value, 'team')
      await fc.checkInput(name.value, 'name')
      await fc.checkInput(selectedSport.value, 'sport')
      await fc.checkPin(pin.value, name.value, team.value)
      checkSignUp()
      currentStep.value = val
    } else if (currentStep.value === 'verify') {
      // GOES TO PLAN
      await fc.checkInput(code.value, 'code')
      await verifyCode()
      currentStep.value = val
    } else if (currentStep.value === 'plan') {
      await fc.checkInput(code.value, 'code')
      await verifyCode()
      currentStep.value = val
    }
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}

const goBackOne = (val: number) => {
  step.value = val
}

const showinfo = ref<boolean>(false)
const showPinInfo = () => {
  showinfo.value = !showinfo.value
}

const planPick = async (plan: 'COACH' | 'TEAM') => {
  try {
    await nextTick()
    await strp.stripePlan(plan, registrationUserId.value)
    currentStep.value = 'payment'
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}
const submitPaymntInfo = async () => {
    try {
        await strp.stripePayment()

        console.log('STRIPE SUCCESS — NOW LOGGING IN')
        await auth.login(email.value, password.value)

        console.log('LOGIN SUCCESS')
        currentStep.value = 'success'
    } catch (err: any) {
        console.error('REGISTRATION ERROR:', err)
        error.value = err.message || 'Something went wrong'
    }
}

watch(() => password.value, () => {
  allClear.value = fc.verifyPass(password.value) ? true : false
})

</script>
<template>
  <main style="min-height:100vh">
  
  <div class="loginChoice" :class="{inactive: currentStep !== 'init'}">
    <h1>Registration</h1>
    <h2>or do you need to login?</h2>
    <div class="selection">
      <div class="txt">
        <div class="iconCont">
          <RegisterIcon />

        </div>
        <div>
        <h3>REGISTER NEW USER</h3>
        <p>Join Player Routes and take<br> your playbook to a new level!</p>
        <button class="primaryBt b" @click="processParade('account')">NEW USER</button>
        </div>
      </div>
    </div>
    <div class="selection">
      <RouterLink to="/login"> 
        <button class="wide">
          <div class="txt">
            <div class="iconCont">
              <UserIcon />
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
  <!-- ACCOUNT -->
  <div class="userLogin" :class="{active: currentStep === 'account'}">
    <form class="signIn" @submit.prevent>
      <AccountIcon />
      <h3>ACCOUNT SETUP</h3>
      <p>Create your login information</p>
      <div class="loggedIn error" v-if="error" >
        <h3>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Email:<input :class="{error : fc.inpEmail.value}" autocomplete="off" placeholder="Email" type="email" v-model="email" /></label>
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
        <label>Password:<input 
        onpaste="return false;" 
        oncopy="return false;" 
        ondrop="return false;"
        :class="{error : fc.inpPassword.value || fc.inpPasswordRepeat.value}" autocomplete="off" placeholder="Password" type="password" v-model="password" /></label>
      </div>
      <div class="inputCont"  >
        <label v-if="allClear">Secure password!</label>
        <label v-else>Password check:</label>
        <ul class="processList">
          <li :class="{ active : fc.hasCap.value }"></li>
          <li :class="{ active : fc.hasLow.value }"></li>
          <li :class="{ active : fc.hasSpec.value }"></li>
          <li :class="{ active : fc.hasNumb.value }"></li>
          <li :class="{ active : fc.hasLen.value }"></li>
        </ul>
      </div>
      <div class="inputCont" >
        <label>Repeat Password:<input 
        onpaste="return false;" 
        oncopy="return false;" 
        ondrop="return false;"
          :class="{error : fc.inpPasswordRepeat.value}"  autocomplete="off" placeholder="Repeat Password" type="password" v-model="passwordRepeat" /></label>
      </div>
      <div class="btCont">
        <button class="primaryBt b" @click="processParade('team')">NEXT</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
  </div>
  <!-- TEAM -->
  <div class="userLogin" :class="{active: currentStep === 'team'}">
    <form class="signIn" @submit.prevent>
      <TeamIcon />
      <h3>TEAM SETUP</h3>
      <p>Create your team information</p>
      <div class="loggedIn error" v-if="error" >
        <h3 v-if="error.includes('luggage')" class="spec"><strong><em>12345?!</em></strong>{{error}}</h3>
        <h3 v-else>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Team Name:<input :class="{error : fc.inpTeam.value}" autocomplete="off" placeholder="Team Name" type="text" v-model="team" /></label>
      </div>
      <div class="inputCont">
        <label>Your Name:<input :class="{error : fc.inpName.value}" autocomplete="off" placeholder="Name" type="text" v-model="name" /></label>
      </div>
      <div class="inputCont a">
        <label>Sport:
          <select :class="{error : fc.inpSport.value}" id="city-select" v-model="selectedSport" >
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
        <label>Team Pin:<input :class="{error : fc.inpPin.value}" autocomplete="off" placeholder="Team Pin" type="password" v-model="pin" maxlength="15" /></label>
      </div>
      <div class="btCont">
        <button class="primaryBt b" @click="processParade('verify')">NEXT</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
  </div>
  <!-- VERIFY -->
  <div class="userLogin" :class="{active: currentStep === 'verify'}">
    <form class="signIn" @submit.prevent>
      <VerifyIcon />
      <h3>VERIFY ACCOUNT</h3>
      <p>A verification number was sent to: {{email}}</p>
      <div class="loggedIn error" v-if="error" >
        <h3>{{error}}</h3>
      </div>
      <div class="inputCont">
        <label>Verify:</label><input placeholder="Verify Code" type="text" v-model="code" />
      </div>
      <div class="btCont">
        <button class="primaryBt b" type="button" @click="processParade('plan')">VERIFY</button>
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
  </div>
  <!-- PLAN -->
  <div class="userLogin" :class="{active: currentStep === 'plan'}">
    <form @submit.prevent>
      <PaymentIcon />
      <h3>SELECT PAYMENT PLAN</h3>
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
              @click="planPick('COACH')"
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
              @click="planPick('TEAM')"
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
      <div class="btCont">
        <button class="primaryBt cancel" type="button" @click="cancelcode">CANCEL</button>
      </div>
    </form>
  </div>

  <div class="userLogin" :class="{active: currentStep === 'payment'}">
    <form @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>COMPLETE YOUR SUBSCRIPTION</h3>
      <p>
        Enter your payment information to activate your account.
      </p>
      <div id="payment-element"></div>
      <div class="btCont" style="margin-top:10px">
        <button class="primaryBt b" type="submit" :disabled="strp.isProcessing.value" @click="submitPaymntInfo">
          {{ strp.isProcessing.value ? 'PROCESSING...' : 'SUBMIT' }}
        </button>
      </div>
      <p v-if="strp.paymentError">{{ strp.paymentError }}</p>
    </form>
  </div>

  <div class="userLogin":class="{active: currentStep === 'success'}">
    <form @submit.prevent>
      <img alt="PRArrow" src="@/assets/images/user.png" />
      <h3>Your account is completed and paid for! HOORAH!</h3>
      <p>
        Let's get started and kick some ass!
      </p>
      <div class="btCont">
        <RouterLink to="/create"> 
          <button class="primaryBt b" ss >
            CREATE PLAYS
          </button>
        </RouterLink>
      </div>
    </form>
  </div>

  </main>
</template>


