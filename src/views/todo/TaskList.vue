<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import { taskListTableHeader } from '@/models/todo.model'
import { useTodoStore } from '@/stores/todo.store'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import FilterPanel from './FilterPanel.vue';

const router = useRouter();
const todoStore = useTodoStore();
const {delTask, loadTaskList} = useTodoStore();

const { taskList, pagination } = storeToRefs(todoStore);

function dd({page}){
  loadTaskList({page: page+1})
}

</script>


<template>
  <div class="card">
      <FilterPanel></FilterPanel>
      <DataTable :value="taskList" 
         paginator :totalRecords="pagination.total" :rows="10" 
         :lazy="true"
         @page="dd($event)"
         tableStyle="min-width: 50rem">
          <Column>
            <template #body="{  index }"> {{ index +1 }}</template>
          </Column>
          <Column 
            v-for="(item, key) in taskListTableHeader" :key="key" 
            :field="key" :header="item" style="width: 25%"
          ></Column>
          <Column >
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button type="button" @click="router.push({ name: 'editTask', params: {id: slotProps.data.id} })" icon="pi pi-pencil" aria-label="Редактировать" />
                <Button type="button" @click="delTask(slotProps.data.id)" icon="pi pi-trash" aria-label="Удалить" />
              </div>
            </template>
          </Column>
      </DataTable>
  </div>
</template>



