<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth'
const auth = useAuthStore()
</script>
<template>
    <header>
        <h4>{{ auth.teamName }} PLAY BOOK</h4>
        <RouterLink to="/create">
        <button class="green-bt"><div></div>Create New Play</button>
        </RouterLink>
    </header>
</template>

<style lang="scss">
$green             :   #0EB056;
.green-bt {
    width:auto;
    height:40px;
    padding:0px 20px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:$green;
    background: linear-gradient(180deg,rgba(12, 82, 42, 1) 0%, rgba(18, 99, 53, 1) 55%, rgba(16, 110, 52, 1) 100%);
    border-radius:7px;
    color:white;
    font-size:15px;
    font-weight:500;
    letter-spacing:0.05em;
    text-shadow:0 1px 3px rgba(0,0,0,.4);
    font-family: "Fjalla One", sans-serif;
    position:absolute;
    top:50%;
    right:10px;
    transform:translate(0%, -50%);
    border-top:1px solid rgba(255,255,255,.5);
    border-right:1px solid rgba(255,255,255,.5);
    border-left:1px solid rgba(255,255,255,.3);
    box-shadow:0 3px 5px rgba(0,0,0,.9);
    cursor:pointer;
  }
</style>