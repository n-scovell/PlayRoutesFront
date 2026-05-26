<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  msg: string,
  cool: boolean
}>()

const wow = ref<string>('This is working')

</script>

<template>
  <div>
    {{  wow }}
    <h1 class="green">{{ msg }}</h1>
    <p v-if="cool">Cool</p>
  </div>
</template>
