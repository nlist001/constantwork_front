import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Status, statusType, Task, TaskId, TaskTemplate, type ITask, type ITaskList, type ITaskListQuery } from '@/models/todo.model'
import api from '@/services/api'

export const useTaskStore = defineStore(
  'task',
  () => {
    const posibleParentsTasks = ref<ITask[]>([]);
    const subTasks = ref<ITask[]>([]);


    function loadPosibleParentsTasks(paramsId?: string) {
      const params = {
        all:true, 
        status: statusType.filter(s=>s!==Status.done)
      }
      if(paramsId) {
        params['exceptionId'] = [paramsId];
      }
        getTaskList(params).then(list=>{
          posibleParentsTasks.value=list
        })
    }

    function loadSubTasks(parentId?: string) {
        if(!parentId) {
          subTasks.value=[]
          return;
        }
        getTaskList({all:true, parent: parentId}).then(list=>{
            subTasks.value=list
        })
    }


    async function getTaskList(params?: ITaskListQuery): Promise<TaskTemplate[]> {
      const {data } = await api.get<ITaskList>('tasks',{params});

      return data.map(t=>new TaskTemplate(t));
    }

   
    async function getTask(id: string, opts?: {parent:boolean}): Promise<[ITask, ITask | null] | ITask> {
       const t = await api.get<ITask>('task/'+id);
       let p = null;

       if (opts?.parent && t.parent) {
         p = await api.get<ITask>('task/'+t.parent);
       }
       
       return [new TaskTemplate(t), p && new TaskTemplate(p)];
    }



    async function aiTaskBreak(task: ITask): Promise<string> {
      return await api.post<string>('/aitask/break',new TaskId(task), { timeout: 1500000 })
    }






    return {
        loadSubTasks,
        loadPosibleParentsTasks,
        getTask,
        aiTaskBreak,
        posibleParentsTasks,
        subTasks
    }
  },
  {
    persist: true,
  },
)