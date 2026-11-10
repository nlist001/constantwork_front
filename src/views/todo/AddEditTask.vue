<script setup lang="ts">
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Toast from 'primevue/toast';

import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import { errorsValidation } from '@/utils/errors'
import { useTodoStore } from '@/stores/todo.store'
import { useToast } from 'primevue/usetoast'
import { statusType, priorityType, type ITask, Status, Task } from '@/models/todo.model'
import {  ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';
import DurationInput from './DurationInput.vue';
import ChatBreakBtn from '../chat/ChatBreakBtn.vue';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '@/stores/task.store';

const statusTypeRef = ref(statusType)
const priorityTypeRef = ref(priorityType)
const route = useRoute()
const router = useRouter()
const toast = useToast()
const {createTask, updateTask, loadTaskList} = useTodoStore();
const {getTask,  loadPosibleParentsTasks, loadSubTasks} = useTaskStore();
const taskStore = useTaskStore();
const {posibleParentsTasks, subTasks}  = storeToRefs(taskStore);


const task = ref<ITask>(new Task())
const initialValues = ref<ITask>(new Task())
const taskParent = ref<ITask|null>(null)






function loadData(paramsId: string) {
  taskParent.value = null;
  getTask(paramsId,{parent:true}).then(([t,p])=> { 
    if(t?.id) {
      initialValues.value = t; 
      task.value = t; 
      loadSubTasks(t.id);
    }
    if(p?.id) { taskParent.value = p; }
      console.log('subTasks.value: ',subTasks.value)
  })
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId) 
    }
  },
  { immediate: true } 
);

watch(
  () => route.query.parent,
  (parentId) => {
    if(parentId) {
      initialValues.value = new Task(); 
      task.value = new Task();
      loadSubTasks();
      getTask(parentId).then(([p,])=> {
        console.log(parentId,p)
        if(p?.id) { taskParent.value = p; }
      })
    }
  },
  { immediate: true } 
);


function onSelectFocus() {
    loadPosibleParentsTasks(task.value.id)
}


const resolver = ({ values }) => {
  //const updatedAccountData = structuredClone({ ...item, ...values })

  const errors = errorsValidation(values, {
    name: ['required', 'maxLength:1000', 'minLength:10'],
    description: [ 'maxLength:500', 'minLength:3']
  })
  console.log('errors', errors)
  console.log('values', values)

//   if (values.accountType == AccountTypeEnum.LDAP) {
//     errors['password'] && delete errors.password
//     delete updatedAccountData.password
//   }

//   if (!Object.keys(errors).length) {
//     updateAccount(new Account(updatedAccountData))
//   }
  return {
    values, // (Optional) Used to pass current form values to submit event.
    errors,
  }
}

const onFormSubmit = ({ valid, values }) => {
  console.log(valid, values)
  if (valid) {
    if(route.params.id) {
      console.log('initialValues',initialValues.value, values)
      updateTask({...initialValues.value,...values}).then(()=>{
          toast.add({
              severity: 'success',
              summary: 'Form is submitted.',
              life: 3000,
          })
      },(err)=>toast.add({
              severity: 'error',
              summary: err['error'] +': '+ err['message'] || 'Error',
              life: 3000,
          }))
    } else {
      createTask(values).then(()=>{
          toast.add({
              severity: 'success',
              summary: 'Form is submitted.',
              life: 3000,
          })
      },(err)=>toast.add({
              severity: 'error',
              summary: err['error'] +': '+ err['message'] || 'Error',
              life: 3000,
          }))
    }
   
  }
}
function reloadTaskData() {
  loadTaskList().then(()=>loadData(route?.params?.id))
}

</script>

<template>
  <Toast />
  <ChatBreakBtn v-if="initialValues.id" :task="initialValues" @onReloadTaskData="reloadTaskData" />
  <div>
    <Form v-slot="$form" :key="initialValues.id" :initialValues="initialValues" :resolver @submit="onFormSubmit" class="flex flex-column gap-3">
    <div class="flex   flex-nowrap w-full">
        <RouterLink v-if="taskParent" :to="{ name: 'editTask', params: { id: taskParent.id } }">{{ taskParent.name }}</RouterLink>
    </div>
    <div class="flex   flex-nowrap w-full  mb-5">
        <Select 
            @focus="onSelectFocus"
            name="parent" :options="[{name:'root'},...posibleParentsTasks]" 
            optionLabel="name"
            optionValue="id"
            placeholder="Выбери" class=" font-italic" fluid 

        />
    </div>
    <div class="flex   flex-nowrap w-full">
        <InputText 
            name="name" type="text" placeholder="Значение" fluid  
            v-tooltip.top="{ value: $form?.name?.error?.message }" 
        />
    </div>
    <div class="flex   flex-nowrap w-full">
        <Textarea 
            name="description"  rows="5" cols="30" placeholder="Значение" fluid  
            v-tooltip.top="{ value: $form?.description?.error?.message }"
        />
    </div>
    <div class="flex   flex-nowrap w-full">
        <Select 
            name="status" :options="statusTypeRef" 
            placeholder="Выбери" class="w-50rem" fluid 
            v-tooltip.top="{ value: $form?.statusTypeRef?.error?.message }" 
        />
    </div>
    <div class="flex   flex-nowrap w-full">
        <Select 
            name="priority" :options="priorityTypeRef" 
            placeholder="Выбери" class="w-50rem" fluid 
            v-tooltip.top="{ value: $form?.priorityTypeRef?.error?.message }" 
        />
    </div>
    <div class="flex   flex-nowrap w-full">
      <DurationInput  name="t_durationMinutes" class="w-50rem" fluid 
      v-tooltip.top="{ value: $form?.t_durationMinutes?.error?.message }" />
    </div>


    <div class="flex   flex-nowrap w-full">
      <Button  type="submit" :label="route.params.id ? 'Update' : 'Create' " class="w-10rem" />
    </div>


  </Form>
  <Button v-if="route.params.id" @click="router.push({name:'createTask',query: { parent: task.id}})" type="button" icon="pi pi-plus" label="Добавить подзадачу" class="w-full  mt-5 mb-5" variant="outlined" />
  
  <div>
    
    <div v-for="task in subTasks" :class="{'line-through': task.status == Status.done}" class="mt-2 mb-2"><RouterLink  :to="{ name: 'editTask', params: { id: task.id } }" class="text-teal-700">{{ task.name }}</RouterLink> </div>
  </div>

  </div>
</template>



