<script setup lang="ts">
interface MyChoice {
  icon: string,
  tabSel: string,
  hdr: string,
  txt: string,
  bttxt: string
}
defineProps<{
  src: MyChoice
}>()

const images = import.meta.glob<string>(
  '@/assets/icons/*.svg', { eager: true, query: '?url', import: 'default'}
)
</script>
<template>
    <div class="selection" >
        <div class="txt">
            <div class="iconCont">
                <img :src="images[`/src/assets/icons/ico_${src.icon}.svg`]" :class="src.icon" />
            </div>
            <div>
                <h3>{{ src.hdr }}</h3>
                <p>{{ src.txt }}</p>
                <button class="primaryBt b">{{ src.bttxt }}</button>
            </div>
        </div>
    </div>
</template>