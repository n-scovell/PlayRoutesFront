<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth'
import { useFormation } from '@/stores/formStore'
import { usePlayStore } from '@/stores/playStore'
import { useFavorites } from '@/stores/favStore'
const auth = useAuthStore()
const forms = useFormation()
const plays = usePlayStore()
const fav = useFavorites()
</script>

<template>
  <main style="min-height:100vh">
    <h1>Your Badges</h1>
    <div class="badges">

      <div class="badge" v-if="auth.teamName && fav.favorites.length >= 1 && plays.plays.length >= 1">
        <div class="icon"></div>
        <h3>Beta Coach!</h3>
        <p>Good start!</p>
      </div>
      <div class="badge" v-if="auth.teamName && forms.formations.length >= 20 && plays.plays.length >= 20">
        <div class="icon"></div>
        <h3>Sigma Coach!</h3>
        <p>20 plays and 20 formations!</p>
      </div>


      <div class="badge" v-if="auth.teamName">
        <div class="icon"></div>
        <h3>Rookie Keeper</h3>
        <p>Good job creating an account!</p>
      </div>

      <div class="badge" v-if="plays.plays.length >= 1">
        <div class="icon"></div>
        <h3>Play Maker</h3>
        <p>You made your first play!</p>
      </div>

      <div class="badge" v-if="plays.plays.length >= 20">
        <div class="icon"></div>
        <h3>Play Warrior</h3>
        <p>You made 20 plays!</p>
      </div>

      <div class="badge" v-if="plays.plays.length >= 50">
        <div class="icon"></div>
        <h3>Play King</h3>
        <p>You made 50 plays!</p>
      </div>

      <div class="badge" v-if="forms.formations.length >= 1">
        <div class="icon"></div>
        <h3>Formation Planner</h3>
        <p>You created your first formation!</p>
      </div>

      <div class="badge" v-if="forms.formations.length >= 20">
        <div class="icon"></div>
        <h3>Formation Warrior</h3>
        <p>20 Formations Made!</p>
      </div>

      <div class="badge" v-if="fav.favorites.length >= 1">
        <div class="icon"></div>
        <h3>Favorites</h3>
        <p>You made your first favorite!</p>
      </div>

      <div class="badge" v-if="fav.favorites.length >= 20">
        <div class="icon"></div>
        <h3>Favorites Warrior</h3>
        <p>20 Favorite plays made!</p>
      </div>
      

    </div>
  </main>
</template>
<style lang="scss">
.badges {
  padding-top:50px;
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  align-items:center;
  justify-content:center;
  gap:20px;
  .badge {
    $w:250px;
    flex: 0 1 $w;
    height:$w;
    background:rgba(0,0,0,.5);
    padding:10px;
    backdrop-filter: blur(1px);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:20px;
    .icon {
      $w:80px;
      width:$w;
      height:$w;
      background:red;
    }
    h3, p {
      margin:0px;
      font-size:25px;
      text-transform:uppercase;
      font-family:"Fjalla One", sans-serif;
      color:white;
    }
    p {
      text-transform:none;
      text-align:center;
      font-family:"Inter", sans-serif;
      font-size:15px;
    }
  }
}
</style>