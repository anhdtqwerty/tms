import { ComradeModel } from './comrade-model'
import { TaskModel, TaskStateType } from './task-model';

export interface RequestModel {
  id?: string
  title?: string
  type?: TaskStateType
  task?: string | TaskModel
  description?: string
  requestor?: string | ComradeModel
  approver?: string | ComradeModel
  files?: string
  config?: {}
  metadata?: {}
}