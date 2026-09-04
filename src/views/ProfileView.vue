<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { usePlayStore } from '@/stores/playStore'
import { useFormation } from '@/stores/formStore'
import { useFavorites } from '@/stores/favStore'

import UserIcon from '@/assets/icons/ico_user.svg'
import PinIcon from '@/assets/icons/ico_pin.svg'
import PasswordIcon from '@/assets/icons/ico_password.svg'

const auth = useAuthStore()
const fav = useFavorites()
const playsStore = usePlayStore()
const forms = useFormation()
const error = ref<string | null>(null)


const initChange = ref<boolean>(false)
const checkUpdateAccount =  ref<number>(0)
const showActionForm = ref<boolean>(false)
const areYouSure = ref<boolean>(false)
const areYouSurePass = ref<boolean>(false)
const chosenAction = ref<string>('')
const password = ref<string>('')
const newPassword = ref<string>('')

const revealForm = (prop:string) => {
  showActionForm.value = true
  chosenAction.value = prop
}

const name = ref<any>(auth.user?.name)
const email = ref<any>(auth.user?.email)
const team = ref<any>(auth.user?.team)
const sport = ref<any>(auth.user?.sport)
const pin = ref<any>()

const selectedPlay = ref([
  {
  head: 'Change Team Pin',
  par: 'Update your pin access number.',
  bt: 'Change Pin',
  ico: 'pin'
 },
  {
  head: 'Change Password',
  par: 'Update your password to keep your account secure.',
  bt: 'Change Password',
  ico: 'password'
 },
])

// const images = import.meta.glob<string>('@/assets/images/*.png', { eager: true, query: '?url', import: 'default'})

const updateMyAccount = async () => {
  checkUpdateAccount.value = initChange.value ? 1 : 3
}
const yesUpdateAccount = async () => {
  try {
    await auth.updateUser({
      name: name.value,
      sport: sport.value,
      teamPin: pin.value,
      team: team.value
    })
    checkUpdateAccount.value = 2
    setTimeout(() => {
      checkUpdateAccount.value = 0
      initChange.value = false
    }, 5000)
  } catch  (error:any) {
    console.log('Update not working')
  }
}





const passChangeCheck = async () => {
  error.value = null
  if (!password.value || !newPassword.value) {
    error.value = 'Please enter both passwords'
    return
  }
  try {
    await checkPassword(password.value, newPassword.value)
    areYouSurePass.value = true
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}

const checkPassword = async (oldPass: string, newPass: string) => {
  if (!oldPass) {
    throw new Error('You need to enter your old password')
  }
  if (oldPass === newPass) {
    throw new Error('New password cannot be the same as old')
  }
  if (!/[A-Z]/.test(newPass)) {
    throw new Error('Password needs 1 capital letter')
  }
  if (!/[a-z]/.test(newPass)) {
    throw new Error('Password needs 1 lowecase letter')
  }
  if (!/[^a-zA-Z0-9]/.test(newPass)) {
    throw new Error('Needs a special character')
  }
  if (!/[0-9]/.test(newPass)) {
    throw new Error('Needs atleast 1 number')
  }
  if (newPass.length < 10) {
    throw new Error('Needs to be longer than 10 characters')
  }
  return true
}
const updatePassword = async () => {
  error.value = null
  try {
    await checkPassword(password.value, newPassword.value) 
    await auth.updatePassword(newPassword.value)
    error.value = 'Successfully changed password.'
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
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
const pinChangeCheck = async() => {
  error.value = null
  try {
    await checkPin(pin.value)
    areYouSure.value = true
  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  } 
}
let pinChangeLocked = ref<boolean>(false)
const updatePin = async () => {
  error.value = null
  try {
    await checkPin(pin.value)
    await auth.updateUser( { teamPin: pin.value, } )
    error.value = `Team Pin Number Has Been Changed for the ${team.value}`
    areYouSure.value = false
    pinChangeLocked.value = true
    setTimeout(() => {
      pinChangeLocked.value = false
    }, 2 * 60 * 1000)


  } catch (err: any) {
    error.value = err.message || 'Something went wrong'
  }
}

watch(
  [name, email, team],
  () => {
    initChange.value = true
  }
)





</script>
<template>
  <main>
    <h1>PROFILE</h1>
    <div class="profileCont">
      <div class="selection a">
        <div class="iconCont">
          <UserIcon />
        </div>
        <div class="txt">
          <h3>Coach {{ auth.user?.name }}</h3>
          <h4>{{ auth.user?.team }}</h4>
        </div>
        <div class="teamInfo">
            <div>
              <h5>{{playsStore.plays.length}}</h5>
              <p>Total Plays</p>
            </div>
            <div>
              <h5>{{ forms.formations.length }}</h5>
              <p>Formations</p>
            </div>
            <div>
              <h5>{{ fav.favorites.length }}</h5>
              <p>Favorites</p>
            </div>
        </div>
        <div class="userPlan" :class="auth.user?.plan">
          <h4><div class="icon"></div> Pro {{ auth.user?.plan }} Plan <button>ACTIVE</button></h4>
          <button class="manage">Manage Subscription</button>
        </div>
        <button class="primaryBt c">LOG OUT</button>
      </div>
      <div class="selection b">
        <div class="top">
          <h4>Account Information</h4>
          <h5>Keep your profile and team details up to date</h5>
          <button class="primaryBt" @click="updateMyAccount()" :class="{active : checkUpdateAccount === 0}">Save Changes</button>
          <button class="primaryBt check" @click="yesUpdateAccount()" :class="{active : checkUpdateAccount === 1}">Are You Sure?</button>
          <button class="primaryBt success" :class="{active : checkUpdateAccount === 2}">Done</button>
          <button class="primaryBt nothing" @click="updateMyAccount()" :class="{active : checkUpdateAccount === 3}">Nothing Changed</button>
        </div>
        <form  @submit.prevent>
          <div class="inp">
            <label>Full Name:</label><input :placeholder="auth.user?.name" type="text" v-model="name" />
          </div>
          <div class="inp">
            <label>Email:</label><input :placeholder="auth.user?.email" type="email" v-model="email" />
          </div>
          <div class="inp">
            <label>Team Name:</label><input :placeholder="auth.user?.team" type="text" v-model="team" />
          </div>
          <div class="inp">
            <label>Sport:</label><input :placeholder="auth.user?.sport" type="text" v-model="sport" />
          </div>
        </form>
        <div class="quickActions">
          <h3>Quick Actions</h3>
          <div class="actionForm" v-if="showActionForm">
            <form @submit.prevent v-if="chosenAction === 'Change Pin'">
              <div class="inp a">
                <label>Assistant/Player PIN:</label><input placeholder="" type="password" v-model="pin" />
                <small>Share this PIN with your players & assistant coaches so they can access the playbook.</small>
                <button class="gen" :class="{disabled : pinChangeLocked}" @click="pinChangeCheck()" :disabled="pinChangeLocked" v-if="!areYouSure"><span v-if="pinChangeLocked">DISABLED FOR 2 MINUTES</span><span v-else>GENERATE PIN</span></button>
                <button class="gen a" @click="updatePin()" v-if="areYouSure">ARE YOU SURE</button>
              </div>
              <div class="error" v-if="error">{{ error }}</div>
            </form>

            <form @submit.prevent v-if="chosenAction === 'Change Password'">
              <div class="inp a">
                <label>Current Password</label><input placeholder="" type="password" v-model="password" />
              </div>
              <div class="inp a">                
                <label>New Password</label>
                <input placeholder="" type="password" v-model="newPassword" />
                <button class="gen" @click="passChangeCheck()" v-if="!areYouSurePass">CREATE NEW PASSWORD</button>
                <button class="gen a" @click="updatePassword()" v-if="areYouSurePass">READY</button>
              </div>
              <div class="error" v-if="error">{{ error }}</div>
            </form>
          </div>
          <div class="action" v-for="a in selectedPlay" :key="a.head">
            <div class="secA">
              <div class="icon">
                <PinIcon  :class="a.ico" v-if="a.ico === 'pin'" />
                <PasswordIcon :class="a.ico" v-if="a.ico === 'password'" />
              </div>
              <div class="info">
                <h5>{{ a.head }}</h5>
                <p>{{ a.par }}</p>
              </div>
            </div>
            <button @click="revealForm(a.bt)">{{ a.bt }}</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
