import { BaseModel } from './base.model'
import { v4 as uuidv4 } from 'uuid';

// import { AccountTypeEnum } from './constants.model'

// export interface IAccount {
//   id: string
//   label: string
//   accountType: AccountTypeEnum
//   login: string
//   password: string | null
// }

// export class Account extends BaseModel implements IAccount {
//   id = String(Math.round(Math.random() * 100000000))
//   label = ''
//   accountType = AccountTypeEnum.Локальная
//   login = ''
//   password = null
//   constructor(o?: unknown) {
//     super()
//     super.checkFields(o)
//   }
// }
 class TaskFields {
  t_created = 'Время создания';
  t_updated = 'Время обновления';
  name = 'Название';
  description = 'Описание';
  priority = 'Приоритет';
  status = 'Статус';
  t_durationMinutes = 'Срок выполнения'
}
class TaskListTableHeader extends TaskFields {

}

export const taskFields = new TaskFields()
export const taskListTableHeader = new TaskListTableHeader()



export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export const priorityType = Object.values(Priority)


export enum Status {
  pending = 'pending',    // Ожидает
  active = 'active', // В работе
  done = 'done',    // Готово
}
export const statusType = Object.values(Status)


export interface ITask {
  parent: null | string;
  id?: string;
  created?: Date;
  updated?: Date;
  name: string;
  description: string;
  priority: Priority;
  status: Status;
  durationMinutes: number;

  t_created?: string;
  t_updated?: string;
  t_durationMinutes?: string;
}

export class Task extends BaseModel implements ITask {
  parent = null;
  name = '';
  description = '';
  priority = Priority.low;
  status = Status.pending;
  durationMinutes = 0;

  constructor(o?: unknown) {
    super()
    super.checkFields(o)
    if(o?.t_durationMinutes) {
      this.durationMinutes = Task.stringToMinutes(o.t_durationMinutes)
    }
  }

  static minutesToStr(durationMinutes: number): string {
    const hour = Math.trunc( Number(durationMinutes) / 60);
    const min = Number(durationMinutes) % 60;
    return  (hour ? hour+' ч ': '')+(min ? min+' м': '');
  }

  static stringToMinutes(value: string): number {
    const hours = value.match(/(\d+)\s*ч/)?.[1] || 0;   // "3"
    const minutes = value.match(/(\d+)\s*м/)?.[1] || 0; // "23"
    return parseInt(hours) * 60 + parseInt(minutes); 
  }
}

export class TaskId extends Task {
  id = '';
  constructor(o?: unknown) {
    super()
    super.checkFields(o)
    if(!o?.id) {
      this.id = uuidv4()
    }
  }
}

export class TaskTemplate extends Task {
  id = '';
  created = new Date();
  updated = new Date();
  t_created = '';
  t_updated = '';
  t_durationMinutes = '';

  constructor(o?: unknown) {
    super()
    super.checkFields(o);
    if(o?.created) {
      this.t_created = new Date(o.created).toLocaleDateString('ru-RU',{
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    if(o?.updated) {
      this.t_updated = new Date(o.updated).toLocaleDateString('ru-RU',{
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    if(o?.durationMinutes) {
      this.t_durationMinutes = Task.minutesToStr(o.durationMinutes)
    }
  }
  
}

export interface ITaskList {
  data: ITask[];
  total: number;
  page: number;
  lastPage: number;
}

export interface ITaskListQuery {
  page?: number;
  limit?: number;
  search?: string;
  priority?: Priority[];
  status?: Status[];
  durationMinutes?: number;
  all?: boolean;
  exceptionId?: string[]
  parent?: string
}

