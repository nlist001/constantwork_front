import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Task, TaskId, TaskTemplate, type ITask, type ITaskList, type ITaskListQuery } from '@/models/todo.model'
import api from '@/services/api'

export const useTodoStore = defineStore(
  'todo',
  () => {
    const pagination = ref<Omit<ITaskList,'data'>>({total: 0, page: 1, lastPage: 1})
    const taskList = ref<ITask[]>([])

    async function loadTaskList(params?: ITaskListQuery): Promise<void> {
      const {data, total,page,lastPage } = await api.get<ITaskList>('tasks',{params});

      taskList.value = data.map(t=>new TaskTemplate(t));
      console.log(taskList.value)
      pagination.value = {total,page,lastPage}
    }


    async function createTask(task: ITask): Promise<ITask> {
      return await api.post<ITask>('task/create',new Task(task))
      .then((newTask: ITask) => {
        taskList.value.push(newTask);
        return newTask;
      });
    }

    async function createTasks(tasks: ITask[]): Promise<ITask[]> {
      return await api.post<ITask[]>('tasks/create',tasks.map(t=>new Task(t)))
      .then((newTasks: ITask[]) => {
        taskList.value.concat(newTasks);
        return newTasks;
      });
    }

    async function updateTask(task: ITask): Promise<ITask> {
      return await api.put<ITask>('task/update',new TaskId(task))
      .then((updateTask: ITask) => {
        const ind = taskList.value.findIndex(t=>t.id==task.id)
        taskList.value[ind] = updateTask;
        return updateTask;
      });
    }

    


    async function delTask(id: string): Promise<ITask> {
      return await api.delete<ITask>('task/'+id)
      .then((delTask: ITask) => {
        const ind = taskList.value.findIndex(t=>t.id==id)
        taskList.value.splice(ind,1);
        return delTask;
      });
    }






    return {
      loadTaskList, 
      taskList, pagination, 
      createTask, delTask,
      updateTask,
      createTasks
    }
  },
  {
    persist: true,
  },
)