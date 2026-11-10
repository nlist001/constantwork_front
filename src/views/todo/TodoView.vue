<script setup lang="ts">
import Button from 'primevue/button'
import {useTodoStore} from '@/stores/todo.store'
import TaskList from './TaskList.vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const {  loadTaskList } = useTodoStore();
loadTaskList();
</script>

<template>
  <main>
    <Button type="button" @click="router.push({ name: 'createTask' });" icon="pi pi-plus" aria-label="Create task" class="w-10rem" />
    <TaskList></TaskList>
  </main>
</template>
