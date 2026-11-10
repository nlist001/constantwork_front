<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Textarea from 'primevue/textarea';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button'


    const displayValue = defineModel('displayValue',{default:''});
    const visible = defineModel('visible',{default: false});

    const emit = defineEmits(['onUpdateTask']);

 // const _displayValue =ref('')
//   const _displayValue = computed(()=>{
//         console.log('computed displayValue: ',displayValue?.value, displayValue)
//         return displayValue.value || ''
//     });
  
//   watch(displayValue, (newVal) => {
//     console.log('watch displayValue',newVal)
//     _displayValue.value = newVal;
    
//   }, { immediate: true });


    function applyEnter(){
        console.log('applyEnter')
        emit('onUpdateTask')
    }
   
</script>

<template>
    <Drawer v-model:visible="visible" header="Chat" position="right"  class="w-5">

        <p class="m-0">
            <slot />
        </p>
        <template #footer>
            <div>
                <Textarea rows="5" cols="30" v-model="displayValue"  class="w-full"  />
                <Button type="button" @click="applyEnter" icon="pi pi-check" rounded ></Button>
            </div>
        </template>
    
    </Drawer>
</template>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white; padding: 20px; border-radius: 8px;
  max-width: 500px; width: 100%;
}
</style>