<script setup lang="ts">
// import { ref } from 'vue'
interface Player {
    x: number
    y: number
    id: string
    pos: string
}
defineProps<{players: Player[]}>()
</script>
<template>
    <div class="player" v-for="player in players" :key="player.id" :style="{left: `${player.x * 100}%`, top: `${player.y * 100}%`}"/>
</template>