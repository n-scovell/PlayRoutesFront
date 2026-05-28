<script setup lang="ts">
  // import { ref } from 'vue'
  import { useAuthStore } from '@/stores/userAuth'
  // defineProps<{ axis: string }>()
  const auth = useAuthStore()
  const info = {
    team: auth.teamName!.toUpperCase()
  }
  console.log(auth)
</script>
<template>
  <div class="avatarCont">
    <div class="avatar"></div>
    <h3>{{ info.team }} PLAY BOOK</h3>
  </div>
</template>
<style lang="scss">
  $w: 50px;
  .avatarCont {
    width:300px;
    height:100%;
    display:flex;
    position:relative;
    left:10px;
    .avatar {
      width:$w;
      height:$w;
      border-radius:50%;
      background:rgba(255,255,255,.5);
      position:relative;
      top:50%;
      transform:translate(0%, -50%);
    }
    h3 {
      color:white;
      position:absolute;
      top:50%;
      left:$w + 10px;
      transform:translate(0%, -50%);
    }
  }
</style>