<script setup lang="ts">
defineProps<{
  title: string
  icon: string
}>()

const images = import.meta.glob<string>(
  '@/assets/images/*.png', { eager: true, query: '?url', import: 'default'}
)
</script>
<template>
    <h4>
      <div><img :src="images[`/src/assets/images/${icon}.png`]" :class="icon" /></div>
      {{title}}
    </h4>
</template>