import { authStore } from '@/stores/auth-store'
import _ from 'lodash'
import moment from 'moment'
import { ComradeModel } from './comrade-model'
import { DepartmentModel } from './department-model'
import { FileModel } from './file-model'
import { UnitModel } from './unit-model'

export interface TaskModel {
  id?: string
  title?: string
  code?: string
  description?: string
  priority?: TaskPriorityType
  state?: TaskStateType
  status?: TaskApprovementStatusType
  type?: TaskDeadlineType

  executedUnit?: string | UnitModel
  supportedUnits?: (string | UnitModel)[]
  supervisorUnit?: string | UnitModel

  executedDepartment?: string | DepartmentModel
  supportedDepartment?: string | DepartmentModel
  supervisorDepartment?: string | DepartmentModel

  supervisors?: (string | ComradeModel)[]
  executedComrade?: string | ComradeModel
  supportedComrades?: (string | ComradeModel)[]

  subtasks?: (string | TaskModel)[]
  parent?: string | TaskModel

  expiredDate?: string
  publishedDate?: string

  files?: (string | FileModel)[]
  createdBy?: string | ComradeModel
  requests?: (string | Request)[]

  data?: {
    explain?: string
    docsInfo?: string // thong tin van ban den
  }
}

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
export const taskPriorityNameMap: { [name in TaskPriorityType]: string } = {
  level_1: 'Mức 1',
  level_2: 'Mức 2',
  level_3: 'Mức 3',
  urgent: 'Cấp thiết'
}
export const taskPriorityNames: { type: TaskPriorityType; name: string }[] = Object.entries(taskPriorityNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskProcessingExpireType = 'inProcessing' | 'expired' | 'almostExpired'
export const taskProcessingExpireNameMap: { [name in TaskProcessingExpireType]: string } = {
  inProcessing: 'Trong hạn',
  expired: 'Quá hạn',
  almostExpired: 'Sắp hết hạn'
}
export const taskProcessingExpireNames: { type: TaskProcessingExpireType; name: string }[] = Object.entries(
  taskProcessingExpireNameMap
).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskDeadlineType = 'hasDeadline' | 'noDeadline'
export const taskDeadlineNameMap: { [name in TaskDeadlineType]: string } = {
  hasDeadline: 'Có thời hạn xử lý',
  noDeadline: 'Không có thời hạn xử lý'
}
export const taskDeadlineNames: { type: TaskDeadlineType; name: string }[] = Object.entries(taskDeadlineNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskApprovementStatusType = 'approving' | 'approved' | 'rejected'
export const taskApprovementStatusNameMap: { [name in TaskApprovementStatusType]: string } = {
  approving: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Trả lại'
}
export const taskApprovementStatusNames: { type: TaskApprovementStatusType; name: string }[] = Object.entries(
  taskApprovementStatusNameMap
).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskStateType = 'waiting' | 'todo' | 'doing' | 'done' | 'recovered' | 'returned'
export const taskStateNameMap: { [name in TaskStateType]: string } = {
  waiting: 'Chưa cập nhật tiến độ',
  todo: 'Chưa thực hiện',
  doing: 'Đang thực hiện',
  done: 'Đã hoàn thành',
  recovered: 'Bị thu hồi',
  returned: 'Trả lại'
}
export const taskStateNames: { type: TaskStateType; name: string }[] = Object.entries(taskStateNameMap).map(
  ([type, value]) =>
    ({
      type,
      value
    } as any)
)

export type TaskRouteType =
  | 'task-created'
  | 'task-assigned'
  | 'task-following'
  | 'task-expired'
  | 'task-unfinished'
  | 'task-approving'
  | 'task-support'
  | 'task-done'
export const taskRouteNameMap: { [name in TaskRouteType]: string } = {
  'task-created': 'Nhiệm vụ giao',
  'task-assigned': 'Được giao',
  'task-expired': 'Đã quá hạn',
  'task-unfinished': 'Chưa hoàn thành',
  'task-approving': 'Chờ xác nhận',
  'task-following': 'Đang theo dõi',
  'task-support': 'Phối hợp',
  'task-done': 'Đã hoàn thành'
}
export const taskRouteNames: { type: TaskRouteType; name: string }[] = Object.entries(taskRouteNameMap).map(
  ([type, name]) =>
    ({
      type,
      name
    } as any)
)

export const createTaskBody = (task: TaskModel, changes: TaskModel) => {
  return changes
}
export const taskTypeToFilterParams = (taskType: TaskRouteType) => {
  const params: TaskModel = {}
  switch (taskType) {
    case 'task-created':
      params.createdBy = authStore.comrade.id
      break
    case 'task-assigned':
      params.executedComrade = authStore.comrade.id
      break
    case 'task-following':
      _.set(params, 'supervisors_contains', authStore.comrade.id)
      break
    case 'task-support':
      _.set(params, 'supportedComrades_contains', authStore.comrade.id)
      break
    case 'task-expired':
      params.type = 'hasDeadline'
      _.set(params, 'expiredDate_lt', moment().toISOString())
      break
    case 'task-approving':
      params.state = 'done'
      params.status = 'approving'
      break
    case 'task-done':
      params.state = 'done'
      break
    default:
      console.error(`not support ${taskType}`)
      break
  }
  return params
}
