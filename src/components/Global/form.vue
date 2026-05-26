<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  formList: any,
  title: string,
  modelValue: Record<string, any>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'action', action: string, payload: any, val: string): void
  (e: 'drop', action: string, payload: any, val: string, id: number): void
}>()
function updateField(key: string, value: any) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}


</script>
<template>
  <form @submit.prevent :class="title">
    <div class="inputCont" v-for="(f, index) in formList.formSections" :key="'field_' + index">
      <label>{{ f.label }}</label>

      <div class="selectHolder" v-if="f.type === 'select'">
        <button 
        class="dropDownInd"
        @click="emit('action', f.controls.action, props.modelValue, f.controls.id)"
        >
        {{ f.label }}
        </button>
        <div v-if="f.controls.showDrop" class="dropDown">
          <button v-for="opt in f.options" :key="opt" @click="emit('drop', f.controls.dropAction, props.modelValue, opt, f.controls.id)">{{ opt }}</button>
        </div>
      </div>
        
      <!-- <ul v-if="f.type === 'select'" class="fakeSelect" @click="emit('action', f.action, modelValue)" >
        {{ f.label }}
        <div v-if="f.showDrop">
        <li @click="emit('action', fake)" v-for="fake in f.options" :key="fake">{{  fake  }}</li>
        </div>
      </ul> -->



      <!-- <select v-if="f.type === 'select'" :value="modelValue[f.key]" @change="updateField(f.key, ($event.target as HTMLSelectElement).value)" :disabled="f.dis">
        <option value="" disabled selected>{{f.nopickval}}</option>
        <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
      </select> -->

      <input v-else :placeholder="f.label" :type="f.type" :value="modelValue[f.key]" @input="updateField(f.key, ($event.target as HTMLInputElement).value)"/>
      <button v-if="f.key === 'password'" class="togglePassword" :class="f.type === 'password' ? 'text':'pass'" @mousedown="$emit('action', 'passwordShow')" @mouseup="$emit('action', 'passwordHide')"></button>

    </div>
    <div class="btCont">
      <button class="formButton" v-for="(b, index) in formList.formButtons" :key="'btn_' + index" type="button" @click="emit('action', b.action, modelValue)">{{ b.label }}</button>
    </div>
  </form>
</template>