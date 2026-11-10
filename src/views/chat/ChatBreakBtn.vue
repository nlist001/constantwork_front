<script setup lang="ts">
import { Task, TaskId, type ITask } from '@/models/todo.model';
import { useTodoStore } from '@/stores/todo.store';
import Button from 'primevue/button'
import ChatView from './ChatView.vue'
import { ref, watch } from 'vue';

const {aiTaskBreak, createTasks} = useTodoStore();

const visible = ref(false);
const isLoading = ref(false);
const isLoadingAddSubTasks = ref(false);
const tasks = ref<ITask[]>([]);
const taskEditing = ref<ITask>();
const taskEditingField = ref< keyof ITask>();
const {task} = defineProps(['task']);

const emit = defineEmits(['onReloadTaskData']);


const displayValue = ref('');


function taskBreak() {
    isLoading.value = true
    aiTaskBreak(task).then((res)=>{
        isLoading.value = false
        console.log(res)
        tasks.value = res?.['tasks']?.map(t=>new TaskId(t)) || [];
        visible.value = true;
    })
}

watch(displayValue, (newVal) => {
    console.log('out watch displayValue',newVal)


}, { immediate: true });

function taskEdit(task:ITask, taskField: keyof ITask) {
    displayValue.value = task[taskField];
    taskEditingField.value = taskField
    taskEditing.value = task;
}

function onUpdateTask() {
    if(taskEditing.value && taskEditingField.value) {
        taskEditing.value[taskEditingField.value] = displayValue.value;
        tasks.value = tasks.value.map(t=>t.id == taskEditing.value.id ? new TaskId(taskEditing.value) : t)
    }
}

function  addSubTasks() {
    isLoadingAddSubTasks.value = true;
    createTasks(tasks.value.map(t=>new Task({...t, parent: task.id}))).then(()=>{
        visible.value = false;
        isLoadingAddSubTasks.value = false;
        emit('onReloadTaskData')
    })
}

</script>

<template>
    <div>
        <ChatView v-model:visible="visible" v-model:displayValue="displayValue" @onUpdateTask="onUpdateTask">
            <ol>
                <li v-for="task in tasks" :key="task?.id">
                    <p>
                        <b>{{ task.name }}</b> 
                        <Button  aria-label="Редактировать" type="button" 
                        @click="taskEdit(task,'name')" 
                        icon="pi pi-pencil" variant="text"   />
                    </p>
                    <p>
                        {{ task.description }} 
                        <Button  aria-label="Редактировать" type="button" 
                        @click="taskEdit(task,'description')" 
                        icon="pi pi-pencil" variant="text" />
                    </p>
                    
                </li>
            </ol>
            <Button label="Добавить подзадачи" type="button"  @click="addSubTasks" 
             :icon="'pi ' + (isLoadingAddSubTasks ? 'pi-spin pi-spinner' : 'pi-plus')"  />
        </ChatView>

        <Button :disabled="visible" label="Разбить на подзадачи?" type="button" class="m-3" 
            @click="taskBreak" 
            :icon="'pi ' + (isLoading ? 'pi-spin pi-spinner' : 'pi-list-check' )"
        />
    </div>
</template>