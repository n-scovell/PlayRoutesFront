<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'
import { usePlayStore } from '@/stores/playStore'
import { useFormation } from '@/stores/formStore'
import { useFavorites } from '@/stores/favStore'

const auth = useAuthStore()
const fav = useFavorites()
const playsStore = usePlayStore()
const forms = useFormation()
const error = ref<string | null>(null)


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
const showModal = ref<boolean>(false)


const selectedPlay = ref([
//  {
//   head: 'Change Password',
//   par: 'Update your password to keep your account secure.',
//   bt: 'Change Password',
//   ico: 'user'
//  },
  {
  head: 'Change Team Pin',
  par: 'Update your pin access number.',
  bt: 'Change Pin',
  ico: 'user'
 },
  {
  head: 'Change Password',
  par: 'Update your password to keep your account secure.',
  bt: 'Change Password',
  ico: 'user'
 },
])

const images = import.meta.glob<string>('@/assets/images/*.png', { eager: true, query: '?url', import: 'default'})

const updateMyAccount = async () => {
  try {
    await auth.updateUser({
      name: name.value,
      sport: sport.value,
      teamPin: pin.value,
      team: team.value
    })
  } catch  (error:any) {
    console.log('Update not working')
  }
}



const pinChangeCheck = async() => {
  areYouSure.value = true
}
const passChangeCheck = async() => {
  areYouSurePass.value = true
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
    await auth.updateUser({password: newPassword.value})
    alert('password is updated')
  } catch  (error:any) {
    error.value = error.message || 'Something went wrong'
  }
}

const updatePin = async () => {
  error.value = null
  try {
    await auth.updateUser( { teamPin: pin.value, } )
  } catch  (error:any) {
    error.value = error.message || 'Something went wrong'
  }
}






</script>
<template>
  <main>
    <h1>PROFILE</h1>
    <div class="profileCont">
      <div class="selection a">
        <div class="iconCont">
          <img alt="PRArrow" src="@/assets/images/user.png" />
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
          <button class="primaryBt" @click="updateMyAccount()">Save Changes</button>
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
          <!-- <div class="inp">
            <label>Assistant/Player PIN:</label><input placeholder="123456" type="password" v-model="pin" />
            <small>Share this PIN with your players & assistant coaches so they can access the playbook.</small>
          </div> -->
        </form>
        <div class="quickActions">
          <h3>Quick Actions</h3>
          <div class="actionForm" v-if="showActionForm">
            <form @submit.prevent v-if="chosenAction === 'Change Pin'">
              <div class="inp a">
                <button class="gen" @click="pinChangeCheck()" v-if="!areYouSure">GENERATE PIN</button>
                <button class="gen a" @click="updatePin()" v-if="areYouSure">ARE YOU SURE</button>
                <label>Assistant/Player PIN:</label><input placeholder="" type="password" v-model="pin" />
                <small>Share this PIN with your players & assistant coaches so they can access the playbook.</small>
              </div>
            </form>

            <form @submit.prevent v-if="chosenAction === 'Change Password'">
              <div class="inp a">
                <label>Current Password</label><input placeholder="" type="password" v-model="password" />
              </div>
              <div class="inp a">
                <button class="gen" @click="passChangeCheck()" v-if="!areYouSurePass">NEW PASSWORD</button>
                <button class="gen a" @click="updatePassword()" v-if="areYouSurePass">READY</button>
                <label>New Password</label><input placeholder="" type="password" v-model="newPassword" />
              </div>
              <div class="error" v-if="error">{{ error }}</div>
            </form>
            <!-- <button class="primaryBt b" @click="updatePin()" v-if="areYouSure">ARE YOU SURE?</button> -->
          </div>
          <div class="action" v-for="a in selectedPlay" :key="a.head">
            <div class="secA">
              <div class="icon"><img :src="images[`/src/assets/images/${a.ico}.png`]" :class="a.ico" /></div>
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
