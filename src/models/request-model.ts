import { ComradeModel } from './comrade-model'
import { TaskModel } from './task-model';

export interface RequestModel {
  id?: string
  title?: string
  type?: RequestType
  task?: string | TaskModel
  description?: string
  requestor?: string | ComradeModel
  approver?: string | ComradeModel
  files?: string
  config?: {}
  metadata?: {}
}

export type RequestType = 'recovered' | 'extend' |  'acceptance' | 'rejected' | 'updateState'
