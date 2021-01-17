import moment from 'moment'
import { ComradeModel } from './comrade-model'
import { RequestType, TaskModel } from './task-model'

export interface RequestModel {
  id?: string
  title?: string
  type?: RequestType
  startedDate?: string
  task?: string | TaskModel
  description?: string
  requestor?: string | ComradeModel
  approver?: string | ComradeModel
  files?: string
  config?: {}
  metadata?: {}
  updated_at?: string
  created_at?: string
}

export const canChangeRequest = (request: RequestModel) => {
  if (!request) return false
  return moment().isBefore(moment(request.created_at).add(1, 'day'))
}
