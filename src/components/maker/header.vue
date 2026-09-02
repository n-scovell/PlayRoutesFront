<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  drop: boolean
}>()

const images = import.meta.glob<string>(
  '@/assets/icons/*.svg', { eager: true, query: '?url', import: 'default'}
)
</script>
<template>
    <button class="makerHeader" :class="{active: drop}"><div class="iconBox"><img :src="images[`/src/assets/icons/ico_${icon}.svg`]" :class="icon" /></div><span>{{title}}</span></button>
</template>