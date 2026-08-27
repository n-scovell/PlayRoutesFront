<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/userAuth'

const auth = useAuthStore()

const name = ref<any>(auth.user?.name)
const email = ref<any>(auth.user?.email)
const team = ref<any>(auth.user?.team)
const sport = ref<any>(auth.user?.sport)
const pin = ref<any>(123245)


const selectedPlay = ref([
 {
  head: 'Change Password',
  par: 'Update your password to keep your account secure.',
  bt: 'Change Password',
  ico: 'user'
 },
  {
  head: 'Change Password',
  par: 'Update your password to keep your account secure.',
  bt: 'Change Password',
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
              <h5>10</h5>
              <p>Total Plays</p>
            </div>
            <div>
              <h5>5</h5>
              <p>Total Plays</p>
            </div>
            <div>
              <h5>5</h5>
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
          <button class="primaryBt">Save Changes</button>
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
          <div class="inp">
            <label>Assistant/Player PIN:</label><input placeholder="123456" type="password" v-model="pin" />
            <small>Share this PIN with your players & assistant coaches so they can access the playbook.</small>
          </div>
        </form>
        <div class="quickActions">
          <h3>Quick Actions</h3>
          <div class="action" v-for="a in selectedPlay" :key="a.head">
            <div class="secA">
              <div class="icon"><img :src="images[`/src/assets/images/${a.ico}.png`]" :class="a.ico" /></div>
              <div class="info">
                <h5>{{ a.head }}</h5>
                <p>{{ a.par }}</p>
              </div>
            </div>
            <button>{{ a.bt }}</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
