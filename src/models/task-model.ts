import { ComradeModel } from './comrade-model'
import { DepartmentModel } from './department-model'
import { UnitModel } from './unit-model'

export interface TaskModel {
  id?: string
  title?: string
  code?: string
  description?: string
  priority?: string | TaskPriorityType
  state?: TaskStateType
  status?: TaskApprovementStatusType
  type?: string

  executedUnit?: string | UnitModel
  supportedUnits?: string[] | UnitModel[]
  supervisorUnit?: string | UnitModel

  executeDepartment?: string | DepartmentModel
  supportedDepartment?: string | DepartmentModel
  supervisorDepartment?: string | DepartmentModel

  supervisors?: string[] | ComradeModel[]
  executedComrade?: string | ComradeModel
  supportedComrades?: string[] | ComradeModel[]

  subtasks?: string[] | TaskModel[]
  parent?: string | TaskModel

  expiredDate?: string
  publishedDate?: string

  files?: string[]
  createdBy: string | ComradeModel
  // requests?: string[] | Request[]

  data?: {}
}

export type TaskPriorityType = 'level_1' | 'level_2' | 'level_3' | 'urgent'
export const taskPriorityNames: { type: TaskPriorityType; name: string }[] = [
  { type: 'level_1', name: 'Mức 1' },
  { type: 'level_2', name: 'Mức 2' },
  { type: 'level_3', name: 'Mức 3' },
  { type: 'urgent', name: 'Cấp thiết' }
]

export type TaskProcessingExpireType = 'inProcessing' | 'expired' | 'almostExpired'
export const taskProcessingExpireNames: { type: TaskProcessingExpireType; name: string }[] = [
  { type: 'inProcessing', name: 'Trong hạn' },
  { type: 'expired', name: 'Quá hạn' },
  { type: 'almostExpired', name: 'Sắp hết hạn' }
]

export type TaskDeadlineType = 'hasDeadline' | 'noDeadline'
export const taskDeadlineTypeNames: { type: TaskDeadlineType; name: string }[] = [
  { type: 'hasDeadline', name: 'Có thời hạn xử lý' },
  { type: 'noDeadline', name: 'Không có thời hạn xử lý' }
]

export type TaskApprovementStatusType = 'approving' | 'approved' |  'rejected'
export const taskApprovementStatusNames: { type: TaskApprovementStatusType; name: string }[] = [
  { type: 'approving', name: 'Chờ phê duyệt' },
  { type: 'approved', name: 'Đã phê duyệt' },
  { type:  'rejected', name: 'Trả lại' }
]

export type TaskStateType = 'waiting' | 'todo' | 'doing' | 'done' | 'recovered'
export const taskStateNameMap:{[name in TaskStateType]: string} = {
  'todo': 'Chưa thực hiện',
  'waiting': 'Chưa cập nhật tiến độ',
  'doing': 'Đang thực hiện',
  'done': 'Đã hoàn thành',
  'recovered': 'Bị thu hồi'
}
export const taskStateNames: { type: TaskStateType; name: string }[] = Object.entries(taskStateNameMap).map(([type, value])=>({
  type, value
}) as any)

export type TaskRouteType = 'task-created' | 'task-assigned' | 'task-following' | 'task-expired' | 'task-unfinished' | 'task-approving' | 'task-support' | 'task-done'
export const taskRouteNameMap:{[name in TaskRouteType]: string} = {
  'task-created': 'Nhiệm vụ giao',
  'task-assigned': 'Được giao',
  'task-expired': 'Đã quá hạn',
  'task-unfinished': 'Chưa hoàn thành',
  'task-approving': 'Chờ xác nhận',
  'task-following': 'Đang theo dõi',
  'task-support': 'Phối hợp',
  'task-done': 'Đã hoàn thành'
}
export const taskRouteNames: { type: TaskRouteType; name: string }[] = Object.entries(taskRouteNameMap).map(([type, value])=>({
  type, value
}) as any)