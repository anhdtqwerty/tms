import { ComradeModel } from './comrade-model'
import { TaskModel } from './task-model';

export interface RequestModel {
  id?: string
  title?: string
  type?: string
  task?: string | TaskModel
  description?: string
  requestor?: string | ComradeModel
  approver?: string | ComradeModel
  config?: {}
  metadata?: {}
}
