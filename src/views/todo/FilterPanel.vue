<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Card from 'primevue/card';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { Form } from '@primevue/forms'
import { useDebounceFn } from '@vueuse/core'
import DurationInput from './DurationInput.vue';

import {  ref } from 'vue'
import { statusType, priorityType, Task } from '@/models/todo.model'
import { useTodoStore } from '@/stores/todo.store';

const {  loadTaskList } = useTodoStore();
const choose = '--Выбери--';

const statusTypeRef = ref([choose,...statusType])
const priorityTypeRef = ref([choose,...priorityType])
// search?: string;
//   priority?: Priority;
//   status?: Status;
//   durationMinutes?: number;
function statusChanged({value}) {
    if (choose == value) {
        loadTaskList();
    } else {
        loadTaskList({status: value});
    }

}
function priorityChanged({value}) {
    if (choose == value) {
        loadTaskList();
    } else {
        loadTaskList({priority: value});
    }
}
function durationMinutesChanged({target}) {

    loadTaskList({durationMinutes: Task.stringToMinutes(target.value)})
}


const searchChanged = useDebounceFn((value) => {
    console.log(value)
    loadTaskList({search: value});
}, 500)




</script>
<template>
     <Card class="mt-3 mb-3">
      <template #content>
        <Form v-slot="$form"   class="flex  gap-3">
        <div class="flex   flex-nowrap w-full">
            <InputText  @input="searchChanged($event.target.value)"
                name="search" type="text" placeholder="Значение" fluid  
                v-tooltip.top="{ value: $form?.name?.error?.message }" 
            />
        </div>

        <div class="flex   flex-nowrap w-full">
            <Select @change="statusChanged($event)"
                name="status" :options="statusTypeRef" 
                :placeholder="choose" class="w-50rem" fluid 
            />
        </div>
        <div class="flex   flex-nowrap w-full">
            <Select  @change="priorityChanged($event)"
                name="priority" :options="priorityTypeRef" 
                :placeholder="choose" class="w-50rem" fluid 
            />
        </div>
        <div class="flex   flex-nowrap w-full">
            <!-- <InputText name="durationMinutes" fluid class="w-50rem" 
                v-keyfilter="/[0-9чм\s]/" 
                placeholder="99ч99м"
                @keydown.enter="durationMinutesChanged($event)"
            /> -->
            <IconField>
                <InputIcon class="pi pi-angle-right" />
                <DurationInput  name="t_durationMinutes" class="w-50rem" fluid 
                    @keydown.enter="durationMinutesChanged($event)"
                    />
            </IconField>
            
        </div>

  </Form>
      </template>
  </Card>
</template>