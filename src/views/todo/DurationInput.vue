<script setup lang="ts">
  import { TaskTemplate } from '@/models/todo.model';
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import vKeyfilter from 'primevue/keyfilter';

  
  const {modelValue} = defineProps(['modelValue']); // Принимает общее число минут
  const emit = defineEmits(['update:modelValue']);

  
  const displayValue = ref('');
  const error = ref(false);
  
  watch(() => modelValue, (newVal) => {
    if (newVal !== TaskTemplate.stringToMinutes(displayValue.value)) {
      displayValue.value = TaskTemplate.minutesToStr(newVal);
    }
  }, { immediate: true });

  
//   function handleBlur() {
//     const regex = /^\s*((\d+)\s*ч)?\s*((\d+)\s*м)?\s*$/;
//     error.value =  !(!displayValue.value || regex.test(displayValue.value))

//   }
</script>

<template>
      <InputText 
        v-model="displayValue" 
        v-keyfilter="/[0-9чм\s]/" 
      

        :class="{ 'p-invalid': error }"
        placeholder="1ч 20м"
      />
  </template>