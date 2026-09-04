<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/userAuth'

import UserIcon from '@/assets/icons/ico_user.svg'
import RegisterIcon from '@/assets/icons/ico_register.svg'
import AccountIcon from '@/assets/icons/ico_account.svg'
import TeamIcon from '@/assets/icons/ico_team.svg'
import VerifyIcon from '@/assets/icons/ico_verify.svg'
import PaymentIcon from '@/assets/icons/ico_payment.svg'
import CoachIcon from '@/assets/icons/ico_coach.svg'

const auth = useAuthStore()
const showModal = ref<boolean>(false)
const name = ref('Nathan')
const email = ref('n8scovell@yahoo.com')
const sport = ref('Tackle Football')
const team = ref('Raiders')
const pin = ref('nathan')
const password = ref('Baggins12345!')
const passwordRepeat = ref('Baggins12345!')
const code = ref("")
const selectedSport = ref("Tackle Football")

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


const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
)

const selectedPlan = ref<'COACH' | 'TEAM' | ''>('')

let stripe: Stripe | null = null
let elements: StripeElements | null = null

const isProcessing = ref(false)
const paymentError = ref('')


// ==================================================
// SELECT PLAN
// ==================================================

const selectPlan = async (
  plan: 'COACH' | 'TEAM'
) => {
  selectedPlan.value = plan

  try {
    await setupStripe()

    step.value = 5
  } catch (err: any) {
    console.error(
      'STRIPE SETUP ERROR:',
      err
    )

    paymentError.value =
      err.message ||
      'Unable to initialize payment'
  }
}


// ==================================================
// SETUP STRIPE
// ==================================================

const setupStripe = async () => {
  console.log(
    'REGISTRATION USER:',
    registrationUserId.value
  )

  console.log(
    'SELECTED PLAN:',
    selectedPlan.value
  )

  const res = await fetch(
    'https://play-route-back.vercel.app/api/stripe',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        action: 'create-subscription',
        userId: registrationUserId.value,
        plan: selectedPlan.value
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      data.error ||
      'Unable to initialize payment'
    )
  }

  if (!data.clientSecret) {
    throw new Error(
      'Stripe client secret was not returned'
    )
  }

  // -----------------------------------------------
  // GET STRIPE
  // -----------------------------------------------

  stripe = await stripePromise

  if (!stripe) {
    throw new Error(
      'Stripe failed to initialize'
    )
  }

  // -----------------------------------------------
  // CREATE ELEMENTS
  // -----------------------------------------------

  elements = stripe.elements({
    clientSecret:
      data.clientSecret
  })

  // -----------------------------------------------
  // CREATE PAYMENT ELEMENT
  // -----------------------------------------------

  const paymentElement =
    elements.create('payment')

  paymentElement.mount(
    '#payment-element'
  )
}


// ==================================================
// SUBMIT PAYMENT
// ==================================================

const submitPayment = async () => {
  paymentError.value = ''
  isProcessing.value = true

  try {
    if (!stripe || !elements) {
      throw new Error(
        'Stripe has not been initialized'
      )
    }

    const { error, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            `${window.location.origin}/register`
        },
        redirect: 'if_required'
      })
    if (error) {
      paymentError.value =
        error.message ||
        'Payment failed'

      return
    }
    if (
      paymentIntent?.status === 'succeeded'
    ) {
      step.value = 6
      await auth.login(email.value, password.value)
    }
  } catch (err: any) {
    console.error(
      'PAYMENT ERROR:',
      err
    )
    paymentError.value =
      err.message ||
      'Unable to process payment'
  } finally {
    isProcessing.value = false
  }
}

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

const verifyPass = (a: string) => {
  hasCap.value = !/[A-Z]/.test(a) ? false : true
  hasLow.value = !/[a-z]/.test(a) ? false : true
  hasSpec.value = !/[^a-zA-Z0-9]/.test(a) ? false : true
  hasNumb.value = !/[0-9]/.test(a) ? false : true
  hasLen.value = a.length < 10 ? false : true
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

async function startCheckout(plan: string) {
  const res = await fetch(
    'https://play-route-back.vercel.app/api/stripe',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create-subscription',
        userId: registrationUserId.value,
        plan,
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) {
    error.value = data.error
    return
  }
  // const checkoutWindow = window.open(
  //   data.url,
  //   '_blank'
  // )
  // if (!checkoutWindow) {
  //   error.value = 'Please allow popups to complete payment.'
  //   return
  // }
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


// const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
// )
// const selectedPlan = ref<string>('')
// const selectPlan = async (plan: 'COACH' | 'TEAM') => {
//   selectedPlan.value = plan
//   try {
//     await setupStripe()
//     step.value = 5
//   } catch (err: any) {
//     console.log(err)
//   }
// }
// const setupStripe = async () => {
//   console.log('REGISTRATION USER:', registrationUserId.value)
//   console.log('SELECTED PLAN:', selectedPlan.value)
//   const res = await fetch(
//     'https://play-route-back.vercel.app/api/stripe',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         action: 'create-subscription',
//         userId: registrationUserId.value,
//         plan: selectedPlan.value
//       })
//     }
//   )
//   const data = await res.json()
//   if (!res.ok) {
//     throw new Error(
//       data.error || 'Unable to initialize payment'
//     )
//   }

//   if (!data.clientSecret) {
//     throw new Error(
//       'Stripe client secret was not returned'
//     )
//   }

//   const stripe = await stripePromise

//   if (!stripe) {
//     throw new Error(
//       'Stripe failed to initialize'
//     )
//   }
//   const elements = stripe.elements({
//     clientSecret: data.clientSecret
//   })
//   const paymentElement = elements.create('payment')
//   paymentElement.mount('#payment-element')
// }


// const isProcessing = ref(false)
// const paymentError = ref('')

// const submitPayment = async () => {
//   paymentError.value = ''
//   isProcessing.value = true

//   try {
//     if (!stripe || !elements) {
//       throw new Error('Stripe has not been initialized')
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/registration-complete`,
//       },
//     })

//     if (error) {
//       paymentError.value = error.message || 'Payment failed'
//     }
//   } catch (err: any) {
//     paymentError.value =
//       err.message || 'Unable to process payment'
//   } finally {
//     isProcessing.value = false
//   }
// }


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
        <label>Email:<input placeholder="Email" type="email" v-model="email" /></label>
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
        <button class="infoBt" @click="showPinInfo()">i</button>
        <div v-if="showinfo" class="popUp info">
          <strong>PIN NUMBER:</strong>
          The pin number is your specific number that allows players/coaches to read the {{ team }} playbook.
        </div>
        <label>Team Pin:<input placeholder="Team Pin" type="password" v-model="pin" maxlength="15" /></label>
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
            <!-- <button
              class="primaryBt b"
              type="button"
              @click="startCheckout('COACH')"
            >
              SELECT
            </button> -->
            <button
              class="primaryBt b"
              type="button"
              @click="selectPlan('COACH')"
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
              @click="selectPlan('TEAM')"
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
      <div class="btCont">
        <button class="primaryBt b" type="submit" :disabled="isProcessing" @click="submitPayment">
          {{ isProcessing ? 'PROCESSING...' : 'SUBMIT' }}
        </button>
      </div>
      <p v-if="paymentError">{{ paymentError }}</p>
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


